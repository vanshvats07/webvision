/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Department Directory & Profile Experience — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  Users,
  FlaskConical,
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { DETAILED_DEPARTMENTS, DepartmentProfileDetail } from '../data/phase4Data';

interface DepartmentsPageProps {
  onBackToHome: () => void;
  onNavigateToAcademics?: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onBackToHome, onNavigateToAcademics }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState<'All' | 'Computing' | 'Circuits' | 'Mechanical' | 'Management'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentProfileDetail | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'faculty' | 'laboratories' | 'research'>('overview');

  const filteredDepartments = useMemo(() => {
    return DETAILED_DEPARTMENTS.filter((dept) => {
      // Discipline filter
      if (disciplineFilter === 'Computing') {
        if (!['CSE', 'IT', 'AI&ML', 'AI&DS'].includes(dept.code)) return false;
      } else if (disciplineFilter === 'Circuits') {
        if (!['ECE', 'EEE'].includes(dept.code)) return false;
      } else if (disciplineFilter === 'Mechanical') {
        if (dept.code !== 'MAE') return false;
      } else if (disciplineFilter === 'Management') {
        if (dept.code !== 'MBA') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dept.name.toLowerCase().includes(q);
        const matchesCode = dept.code.toLowerCase().includes(q);
        const matchesHod = dept.hodName.toLowerCase().includes(q);
        const matchesResearch = dept.researchAreas.some((r) => r.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesHod && !matchesResearch) {
          return false;
        }
      }

      return true;
    });
  }, [disciplineFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-20">
      {/* Page Header */}
      <section className="bg-white border-b border-[#E7E3D8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#657080] mb-2">
                <button
                  onClick={onBackToHome}
                  className="hover:text-[#873A2B] transition-colors uppercase tracking-wider"
                >
                  MAIT Home
                </button>
                <span aria-hidden="true">/</span>
                <span className="text-[#873A2B] uppercase tracking-wider font-semibold">
                  Academic Departments
                </span>
                <span aria-hidden="true">/</span>
                <span>Engineering & Management</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Academic Departments Directory
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Explore the 8 verified teaching and research departments at Maharaja Agrasen Institute of Technology, featuring specialized computing suites, semiconductor testbenches, and heavy mechanical workshops.
              </p>
            </div>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 text-xs font-medium text-[#657080] hover:text-[#203044] bg-[#F7F5EF] hover:bg-white border border-[#E7E3D8] transition-colors self-start md:self-auto"
            >
              Return to Campus 3D
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* If a department profile modal/view is active, render the comprehensive profile */}
        {selectedDepartment ? (
          <div className="bg-white border border-[#E7E3D8] shadow-xs mb-8">
            {/* Profile Top Bar */}
            <div className="p-5 sm:p-6 bg-[#F7F5EF] border-b border-[#E7E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#873A2B] text-white flex items-center justify-center font-serif font-bold text-xl shrink-0 shadow-xs">
                  {selectedDepartment.code}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#657080] mb-1">
                    <span className="font-mono text-[#873A2B] font-semibold uppercase">
                      Est. {selectedDepartment.establishedYear}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{selectedDepartment.block}</span>
                    <span aria-hidden="true">·</span>
                    <span>Intake: {selectedDepartment.intakeSeats} Seats</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044]">
                    {selectedDepartment.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedDepartment(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#203044] hover:text-[#873A2B] border border-[#E7E3D8] text-xs font-medium transition-colors self-start sm:self-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Departments</span>
              </button>
            </div>

            {/* Profile Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-[#E7E3D8] px-5 sm:px-6 overflow-x-auto scrollbar-none bg-white">
              <button
                onClick={() => setActiveProfileTab('overview')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors shrink-0 ${
                  activeProfileTab === 'overview'
                    ? 'border-[#873A2B] text-[#873A2B] font-semibold'
                    : 'border-transparent text-[#657080] hover:text-[#203044]'
                }`}
              >
                Overview & HOD Message
              </button>
              <button
                onClick={() => setActiveProfileTab('faculty')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors shrink-0 ${
                  activeProfileTab === 'faculty'
                    ? 'border-[#873A2B] text-[#873A2B] font-semibold'
                    : 'border-transparent text-[#657080] hover:text-[#203044]'
                }`}
              >
                Faculty Directory ({selectedDepartment.facultyRoster.length})
              </button>
              <button
                onClick={() => setActiveProfileTab('laboratories')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors shrink-0 ${
                  activeProfileTab === 'laboratories'
                    ? 'border-[#873A2B] text-[#873A2B] font-semibold'
                    : 'border-transparent text-[#657080] hover:text-[#203044]'
                }`}
              >
                Laboratories & Facilities ({selectedDepartment.laboratories.length})
              </button>
              <button
                onClick={() => setActiveProfileTab('research')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors shrink-0 ${
                  activeProfileTab === 'research'
                    ? 'border-[#873A2B] text-[#873A2B] font-semibold'
                    : 'border-transparent text-[#657080] hover:text-[#203044]'
                }`}
              >
                Research & Achievements
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 sm:p-8">
              {/* TAB 1: OVERVIEW & VISION */}
              {activeProfileTab === 'overview' && (
                <div className="space-y-6">
                  {/* HOD Quote Banner */}
                  <div className="p-5 bg-[#F7F5EF] border-l-4 border-l-[#873A2B] border-y border-r border-[#E7E3D8]">
                    <div className="text-[11px] font-mono text-[#873A2B] uppercase font-semibold mb-1">
                      Message from the Head of Department
                    </div>
                    <p className="text-sm text-[#203044] italic leading-relaxed">
                      "{selectedDepartment.hodMessage}"
                    </p>
                    <div className="mt-3 text-xs text-[#203044] font-medium">
                      — {selectedDepartment.hodName}
                      <span className="text-[#657080] font-normal block sm:inline sm:ml-2">
                        ({selectedDepartment.hodDesignation})
                      </span>
                    </div>
                  </div>

                  {/* Vision & Mission Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white border border-[#E7E3D8]">
                      <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#873A2B] font-semibold uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Department Vision</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#203044] leading-relaxed">
                        {selectedDepartment.vision}
                      </p>
                    </div>

                    <div className="p-5 bg-white border border-[#E7E3D8]">
                      <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#16745B] font-semibold uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mission Pillars</span>
                      </div>
                      <ul className="space-y-2 text-xs text-[#203044]">
                        {selectedDepartment.mission.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16745B] mt-1.5 shrink-0" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Programs Offered */}
                  <div className="p-5 bg-white border border-[#E7E3D8]">
                    <h3 className="text-xs font-mono uppercase text-[#657080] mb-3">
                      Academic Programs Offered & Intake
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {selectedDepartment.programs.map((prog, idx) => (
                        <div key={idx} className="p-3 bg-[#F7F5EF] border border-[#E7E3D8] flex items-center justify-between">
                          <span className="font-medium text-[#203044]">{prog}</span>
                          <span className="text-[11px] font-mono text-[#873A2B]">Approved by AICTE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Box */}
                  <div className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-wrap items-center justify-between gap-4 text-xs text-[#657080]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#873A2B]" />
                        <span className="font-mono text-[#203044]">{selectedDepartment.hodEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#16745B]" />
                        <span className="font-mono text-[#203044]">{selectedDepartment.hodPhone}</span>
                      </div>
                    </div>

                    <a
                      href={selectedDepartment.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
                    >
                      <span>Official Department Web Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: FACULTY DIRECTORY */}
              {activeProfileTab === 'faculty' && (
                <div className="space-y-4">
                  <div className="text-xs text-[#657080] mb-2">
                    Verified faculty directory for {selectedDepartment.name}.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDepartment.facultyRoster.map((fac, idx) => (
                      <div key={idx} className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] text-xs space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-serif font-bold text-sm text-[#203044]">
                              {fac.name}
                            </div>
                            <div className="text-[#873A2B] font-medium text-xs">
                              {fac.designation}
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-[#657080] bg-white px-2 py-0.5 border border-[#E7E3D8]">
                            {fac.qualification}
                          </span>
                        </div>

                        <div className="text-[#657080] pt-1 border-t border-[#E7E3D8]/60">
                          <span className="font-medium text-[#203044]">Specialization: </span>
                          <span>{fac.specialization}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#657080]">
                          <Mail className="w-3 h-3 text-[#873A2B]" />
                          <a href={`mailto:${fac.email}`} className="hover:text-[#873A2B]">
                            {fac.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LABORATORIES */}
              {activeProfileTab === 'laboratories' && (
                <div className="space-y-4">
                  <div className="text-xs text-[#657080] mb-2">
                    Specialized computing suites, hardware benches, and research prototyping bays.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDepartment.laboratories.map((lab, idx) => (
                      <div key={idx} className="p-5 bg-white border border-[#E7E3D8] hover:border-[#873A2B] transition-colors shadow-2xs">
                        <div className="flex items-center justify-between text-xs text-[#657080] mb-1">
                          <span className="font-mono text-[11px] text-[#873A2B] font-semibold">
                            Laboratory #{idx + 1}
                          </span>
                          <span className="font-mono">{lab.location}</span>
                        </div>

                        <h4 className="text-base font-serif font-bold text-[#203044]">
                          {lab.name}
                        </h4>

                        <div className="mt-3 space-y-1.5 text-xs">
                          <div>
                            <span className="font-mono text-[10px] uppercase text-[#657080] block">
                              Key Hardware & Instruments:
                            </span>
                            <span className="text-[#203044]">{lab.equipment}</span>
                          </div>
                          <div className="pt-2 border-t border-[#E7E3D8]/60">
                            <span className="font-mono text-[10px] uppercase text-[#657080] block">
                              Software Suites & Toolchains:
                            </span>
                            <span className="font-mono text-[11px] text-[#16745B]">{lab.softwareOrBenches}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESEARCH & ACHIEVEMENTS */}
              {activeProfileTab === 'research' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#203044] uppercase tracking-wider mb-3">
                      Key Research Domains & Focus Areas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedDepartment.researchAreas.map((res, idx) => (
                        <div key={idx} className="p-3 bg-[#F7F5EF] border border-[#E7E3D8] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#873A2B]" />
                          <span className="text-[#203044] font-medium">{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#203044] uppercase tracking-wider mb-3">
                      Notable Department Achievements
                    </h3>
                    <div className="space-y-2 text-xs">
                      {selectedDepartment.achievements.map((ach, idx) => (
                        <div key={idx} className="p-3.5 bg-white border border-[#E7E3D8] flex items-start gap-3">
                          <Award className="w-4 h-4 text-[#B18B50] shrink-0 mt-0.5" />
                          <p className="text-[#203044] leading-relaxed">{ach}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#E7E3D8] p-4 sm:p-5 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#657080] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments by branch code (CSE, IT, ECE), HOD name, or research keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] placeholder:text-[#657080] focus:outline-none focus:border-[#873A2B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#657080]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {(['All', 'Computing', 'Circuits', 'Mechanical', 'Management'] as const).map((disc) => (
              <button
                key={disc}
                onClick={() => setDisciplineFilter(disc)}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  disciplineFilter === disc
                    ? 'bg-[#873A2B] text-white'
                    : 'bg-[#F7F5EF] text-[#657080] hover:text-[#203044]'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Department Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <article
              key={dept.id}
              className="bg-white border border-[#E7E3D8] hover:border-[#873A2B] p-5 shadow-xs flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Card Top: Code & Established Badge (Zero-Pill Discipline) */}
                <div className="flex items-center justify-between text-xs text-[#657080] mb-2.5">
                  <span className="font-mono text-sm text-[#873A2B] font-bold">
                    {dept.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#657080]">
                    Est. {dept.establishedYear} · {dept.intakeSeats} Seats
                  </span>
                </div>

                <h3
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setActiveProfileTab('overview');
                  }}
                  className="text-base font-serif font-bold text-[#203044] group-hover:text-[#873A2B] cursor-pointer transition-colors leading-snug"
                >
                  {dept.name}
                </h3>

                <p className="text-xs text-[#657080] mt-2 line-clamp-2 leading-relaxed">
                  {dept.hodMessage}
                </p>

                {/* Block & HOD info */}
                <div className="mt-4 pt-3 border-t border-[#E7E3D8]/60 space-y-1.5 text-xs text-[#657080]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#16745B] shrink-0" />
                    <span className="truncate">{dept.block}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#B18B50] shrink-0" />
                    <span className="truncate">HOD: {dept.hodName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-[#873A2B] shrink-0" />
                    <span>{dept.laboratories.length} Specialized Research Labs</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setActiveProfileTab('overview');
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#873A2B] hover:text-[#16745B] font-semibold transition-colors"
                >
                  <span>Explore Department Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={dept.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#657080] hover:text-[#203044] p-1"
                  title="Open Official Website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
