/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Top Navigation Bar — Phase 5 Global Navigation & Auth Integration
 * Responsive Desktop & Mobile Drawer
 * Sections: About, Academics, Departments, Admissions, Campus Life, Notices, Events, Placements, Student Hub, Admin CMS
 * Palette: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Building2,
  GraduationCap,
  Sparkles,
  Briefcase,
  Bell,
  Calendar,
  Layers,
  BookOpen,
  Shield,
  User as UserIcon,
  LogOut,
  Sliders,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavPage =
  | 'home'
  | 'about'
  | 'academics'
  | 'departments'
  | 'admissions'
  | 'campus-life'
  | 'notices'
  | 'events'
  | 'placements'
  | 'admin'
  | 'student-hub';

interface TopNavProps {
  onOpenSearch: () => void;
  onOpenAdmissions: () => void;
  onOpenAuth: () => void;
  activePage?: NavPage;
  onNavigate?: (page: NavPage) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenSearch,
  onOpenAdmissions,
  onOpenAuth,
  activePage = 'home',
  onNavigate,
}) => {
  const { user, isLoggedIn, isAdmin, isEditor, logout } = useAuth();
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isStudentHubDropdownOpen, setIsStudentHubDropdownOpen] = useState(false);

  const handleNavClick = (page: NavPage, hash?: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsStudentHubDropdownOpen(false);
    setIsQuickOpen(false);

    if (hash && page === 'home') {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  const navLinks: { label: string; page: NavPage }[] = [
    { label: 'About', page: 'about' },
    { label: 'Academics', page: 'academics' },
    { label: 'Departments', page: 'departments' },
    { label: 'Admissions', page: 'admissions' },
    { label: 'Campus Life', page: 'campus-life' },
    { label: 'Notices', page: 'notices' },
    { label: 'Events', page: 'events' },
    { label: 'Placements', page: 'placements' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-[#E7E3D8] shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#873A2B] text-left cursor-pointer"
        >
          <img
            src="/images/mait-logo.png"
            alt="Maharaja Agrasen Institute of Technology logo"
            className="w-9 h-10 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-base font-serif font-bold tracking-wider text-[#203044] uppercase whitespace-nowrap">
              MAIT
            </span>
            <span className="text-[10px] font-mono text-[#657080] tracking-wider uppercase whitespace-nowrap hidden sm:block">
              ROHINI · GGSIPU CODE 148
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs uppercase font-medium tracking-wider text-[#657080]">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activePage === 'home'
                ? 'text-[#873A2B] font-semibold border-b-2 border-[#873A2B]'
                : 'hover:text-[#873A2B]'
            }`}
          >
            Overview
          </button>

          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                activePage === link.page
                  ? 'text-[#873A2B] font-semibold border-b-2 border-[#873A2B]'
                  : 'hover:text-[#873A2B]'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Student Hub Direct Tab */}
          <button
            onClick={() => handleNavClick('student-hub')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 cursor-pointer ${
              activePage === 'student-hub'
                ? 'text-[#16745B] font-semibold border-b-2 border-[#16745B]'
                : 'text-[#16745B] hover:text-[#125d49]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Hub</span>
          </button>

          {/* Admin CMS (for Admin & Editor) */}
          {(isAdmin || isEditor) && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                activePage === 'admin'
                  ? 'text-[#873A2B] font-semibold border-b-2 border-[#873A2B]'
                  : 'text-[#873A2B] hover:text-[#723124]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Auth Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Command Search Shortcut Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#657080] hover:text-[#203044] bg-[#F7F5EF] border border-[#E7E3D8] hover:border-[#B18B50] transition-colors shadow-xs cursor-pointer"
            title="Search MAIT (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#657080]" />
            <span className="hidden sm:inline text-[11px] font-mono text-[#657080]">⌘K</span>
          </button>

          {/* User Account / Sign In Dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F5EF] border border-[#E7E3D8] hover:border-[#873A2B] transition-colors cursor-pointer text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#873A2B] text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="font-bold text-[#203044] leading-tight truncate max-w-[100px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#657080] leading-tight">
                    {user?.role}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#657080]" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E3D8] shadow-xl py-2 z-50 text-xs rounded-xl"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#F0ECE1] bg-[#F7F5EF]/60">
                    <div className="font-bold text-[#203044]">{user?.name}</div>
                    <div className="text-[11px] text-[#657080] truncate">{user?.email}</div>
                    <div className="text-[10px] font-bold text-[#873A2B] mt-0.5">{user?.role}</div>
                  </div>

                  <button
                    onClick={() => handleNavClick('student-hub')}
                    className="w-full px-3.5 py-2 text-[#203044] hover:bg-[#F7F5EF] hover:text-[#16745B] text-left flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-[#16745B]" />
                    <span>My Student Hub</span>
                  </button>

                  {(isAdmin || isEditor) && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full px-3.5 py-2 text-[#203044] hover:bg-[#F7F5EF] hover:text-[#873A2B] text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#873A2B]" />
                      <span>Admin CMS Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full px-3.5 py-2 text-[#203044] hover:bg-[#F7F5EF] text-left flex items-center gap-2 cursor-pointer border-t border-[#F0ECE1]"
                  >
                    <Sliders className="w-4 h-4 text-[#B18B50]" />
                    <span>Switch Demo Account</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-red-600 hover:bg-red-50 text-left flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#873A2B] bg-[#873A2B]/10 hover:bg-[#873A2B]/20 rounded-lg transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Admissions Action Button */}
          <button
            onClick={() => handleNavClick('admissions')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#873A2B] hover:bg-[#702f23] transition-colors whitespace-nowrap shrink-0 shadow-2xs hidden sm:block cursor-pointer"
          >
            Admissions
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 xl:hidden text-[#203044] hover:text-[#873A2B] bg-[#F7F5EF] border border-[#E7E3D8] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Responsive) */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E7E3D8] shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {isLoggedIn && (
              <div className="p-3 bg-[#F7F5EF] rounded-xl flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-xs text-[#203044]">{user?.name}</div>
                  <div className="text-[10px] text-[#657080]">{user?.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}

            <div className="text-[10px] font-mono uppercase text-[#657080] pb-1 border-b border-[#F0ECE1]">
              NAVIGATION DIRECTORY
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 text-xs uppercase font-medium tracking-wider transition-colors ${
                activePage === 'home'
                  ? 'bg-[#873A2B] text-white font-bold'
                  : 'text-[#203044] hover:bg-[#F7F5EF]'
              }`}
            >
              Overview (3D Campus)
            </button>

            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-3 py-2 text-xs uppercase font-medium tracking-wider transition-colors ${
                  activePage === link.page
                    ? 'bg-[#873A2B] text-white font-bold'
                    : 'text-[#203044] hover:bg-[#F7F5EF]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('student-hub')}
              className={`w-full text-left px-3 py-2 text-xs uppercase font-medium tracking-wider transition-colors ${
                activePage === 'student-hub'
                  ? 'bg-[#16745B] text-white font-bold'
                  : 'text-[#16745B] hover:bg-emerald-50'
              }`}
            >
              Student Digital Hub
            </button>

            {(isAdmin || isEditor) && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-3 py-2 text-xs uppercase font-medium tracking-wider transition-colors ${
                  activePage === 'admin'
                    ? 'bg-[#873A2B] text-white font-bold'
                    : 'text-[#873A2B] hover:bg-red-50'
                }`}
              >
                Admin CMS Dashboard
              </button>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-[#873A2B] text-white text-xs font-semibold uppercase tracking-wider text-center rounded-lg mt-2"
              >
                Sign In to Portal
              </button>
            )}

            <div className="pt-3 border-t border-[#F0ECE1] space-y-2">
              <button
                onClick={() => handleNavClick('admissions')}
                className="w-full py-2.5 bg-[#873A2B] text-white text-xs font-semibold uppercase tracking-wider text-center"
              >
                Admissions Centre 2026–27
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
