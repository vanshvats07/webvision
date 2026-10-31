/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — AUTHENTICATION CONTEXT & HOOK
 * Provides session management, RBAC, demo login, and token persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/backend';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isStudent: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role: 'admin' | 'editor' | 'student') => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    department: string;
    enrollmentNumber?: string;
    semester?: number;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback demo users in case client is running without network
const FALLBACK_DEMO_USERS: Record<string, User> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Prof. Administrative Officer',
    email: 'demo-admin@mait.ac.in',
    passwordHash: '',
    role: 'Administrator',
    department: 'Central Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  editor: {
    id: 'usr-editor-01',
    name: 'Editorial Office MAIT',
    email: 'demo-editor@mait.ac.in',
    passwordHash: '',
    role: 'Content Editor',
    department: 'Public Relations & Academic Circulars',
    status: 'Active',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  student: {
    id: 'usr-student-01',
    name: 'Aarav Sharma',
    email: 'demo-student@mait.ac.in',
    passwordHash: '',
    role: 'Student',
    department: 'Computer Science & Engineering',
    enrollmentNumber: '02114802722',
    semester: 6,
    phone: '+91 98110 54321',
    status: 'Active',
    createdAt: '2026-08-15T12:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mait_auth_token');
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and check me endpoint
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mait_auth_token');
      const storedUser = localStorage.getItem('mait_auth_user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Ignore parse errors
        }
      }

      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('mait_auth_user', JSON.stringify(data.user));
          } else {
            // If token invalid, clean up unless offline demo user
            if (!storedUser) {
              setToken(null);
              localStorage.removeItem('mait_auth_token');
            }
          }
        } catch {
          // Network fallback keeps stored user
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('mait_auth_token', data.token);
      localStorage.setItem('mait_auth_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network connection failed',
      };
    }
  };

  const demoLogin = async (role: 'admin' | 'editor' | 'student') => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('mait_auth_token', data.token);
        localStorage.setItem('mait_auth_user', JSON.stringify(data.user));
        return { success: true };
      }
    } catch {
      // Offline fallback
    }

    const fallback = FALLBACK_DEMO_USERS[role];
    if (fallback) {
      setUser(fallback);
      setToken(`demo-token-${role}`);
      localStorage.setItem('mait_auth_token', `demo-token-${role}`);
      localStorage.setItem('mait_auth_user', JSON.stringify(fallback));
      return { success: true };
    }

    return { success: false, error: 'Demo account could not be initialized' };
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    department: string;
    enrollmentNumber?: string;
    semester?: number;
    phone?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('mait_auth_token', data.token);
      localStorage.setItem('mait_auth_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mait_auth_token');
    localStorage.removeItem('mait_auth_user');
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Password reset failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed' };
    }
  };

  const isAdmin = user?.role === 'Administrator';
  const isEditor = user?.role === 'Content Editor';
  const isStudent = user?.role === 'Student';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isEditor,
        isStudent,
        isLoggedIn,
        login,
        demoLogin,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
