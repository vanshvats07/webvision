/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — AUTHENTICATION MODAL
 * Bright Light Theme with Instant Demo Account Fast-Login
 * Tabs: Sign In | Register Student | Forgot Password
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Phone,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onLoginSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onLoginSuccess,
}) => {
  const { login, demoLogin, register, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [semester, setSemester] = useState(1);
  const [phone, setPhone] = useState('');

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess('user');
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleDemoSignIn = async (role: 'admin' | 'editor' | 'student') => {
    setErrorMsg(null);
    setLoading(true);
    const res = await demoLogin(role);
    setLoading(false);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(role);
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to initiate demo session.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      department,
      enrollmentNumber,
      semester,
      phone,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account registered successfully! You are signed in as a Student.');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess('student');
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and new password.');
      return;
    }
    setLoading(true);
    const res = await resetPassword(email, password);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password has been updated. You can now sign in.');
      setTimeout(() => {
        setActiveTab('login');
        setSuccessMsg(null);
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#203044]/10 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#873A2B] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight tracking-wide">
                MAIT Connect 2.0 Auth Portal
              </h3>
              <p className="text-xs text-white/80 font-sans">
                Role-Based Academic Identity & Content Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="bg-amber-50/90 border-b border-amber-200/70 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold tracking-wide">[DEMO PROTOTYPE]</span> This academic development interface enables sandboxed testing. All newly created user accounts strictly receive <strong>Student</strong> permissions.
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#203044]/10 bg-[#F7F5EF]/60 px-6 pt-3">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`pb-3 px-4 font-sans text-sm font-semibold transition-all relative ${
              activeTab === 'login'
                ? 'text-[#873A2B]'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Sign In
            {activeTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#873A2B]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`pb-3 px-4 font-sans text-sm font-semibold transition-all relative ${
              activeTab === 'register'
                ? 'text-[#873A2B]'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Register Student
            {activeTab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#873A2B]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('forgot');
              setErrorMsg(null);
            }}
            className={`pb-3 px-4 font-sans text-sm font-semibold transition-all relative ${
              activeTab === 'forgot'
                ? 'text-[#873A2B]'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Reset Password
            {activeTab === 'forgot' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#873A2B]" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Cards */}
          {activeTab === 'login' && (
            <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#203044]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#203044] tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B18B50]" />
                  1-Click Demo Profiles
                </span>
                <span className="text-[11px] text-[#657080]">Instant verification</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('student')}
                  disabled={loading}
                  className="p-2.5 rounded-lg bg-white border border-[#203044]/15 hover:border-[#16745B] hover:shadow-sm text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <GraduationCap className="w-4 h-4 text-[#16745B]" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#16745B]">
                      Student
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#203044] group-hover:text-[#16745B]">
                    Aarav Sharma
                  </div>
                  <div className="text-[10px] text-[#657080] truncate">CSE, Sem 6</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('editor')}
                  disabled={loading}
                  className="p-2.5 rounded-lg bg-white border border-[#203044]/15 hover:border-[#B18B50] hover:shadow-sm text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <FileCheck className="w-4 h-4 text-[#B18B50]" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-[#B18B50]">
                      Editor
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#203044] group-hover:text-[#B18B50]">
                    Editorial Office
                  </div>
                  <div className="text-[10px] text-[#657080] truncate">Circulars & Events</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('admin')}
                  disabled={loading}
                  className="p-2.5 rounded-lg bg-white border border-[#203044]/15 hover:border-[#873A2B] hover:shadow-sm text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Shield className="w-4 h-4 text-[#873A2B]" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#873A2B]">
                      Admin
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#203044] group-hover:text-[#873A2B]">
                    Prof. Admin
                  </div>
                  <div className="text-[10px] text-[#657080] truncate">Full CMS Access</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                  Institutional / Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#657080] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. demo-admin@mait.ac.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] focus:ring-1 focus:ring-[#873A2B] text-[#203044]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#657080] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] focus:ring-1 focus:ring-[#873A2B] text-[#203044]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#657080] hover:text-[#203044]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#657080] pt-1">
                <span>Demo passwords: <code className="bg-[#F7F5EF] px-1 py-0.5 rounded text-[#873A2B] font-mono">MaitAdmin@2026</code></span>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[#873A2B] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#873A2B] hover:bg-[#723124] text-white font-sans text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER STUDENT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <strong>Student Self-Registration:</strong> All new student accounts are created with Student privileges to register for events, report complaints, and download resources.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                  Full Student Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#657080] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanshu Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    College / Personal Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@mait.ac.in"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    placeholder="e.g. 02114802722"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    Academic Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engg (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                    <option value="AI & Machine Learning">AI & Machine Learning (AI&ML)</option>
                    <option value="AI & Data Science">AI & Data Science (AI&DS)</option>
                    <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical & Automation">Mechanical & Automation (MAE)</option>
                    <option value="Management Studies">Management Studies (MBA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#203044] mb-1.5">
                    Account Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#16745B] hover:bg-[#125d49] text-white font-sans text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Student Profile...' : 'Complete Student Registration'}
              </button>
            </form>
          )}

          {/* TAB 3: RESET PASSWORD */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <div role="status" className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs leading-5 text-amber-900">
                Self-service password recovery is not configured. No password will be changed here. Contact the account administrator for verified assistance.
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full py-3 px-4 bg-[#16745B] hover:bg-[#125d49] text-white font-sans text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Return to sign in
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F7F5EF] border-t border-[#203044]/10 text-center text-xs text-[#657080]">
          Maharaja Agrasen Institute of Technology (MAIT) Digital Core — Academic Session 2026–2027
        </div>
      </div>
    </div>
  );
};
