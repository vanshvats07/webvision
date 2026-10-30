/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Academic Resource Centre — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  Award,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileDown,
} from 'lucide-react';
import { ACADEMIC_SYLLABI_DATA, ACADEMIC_FORMS_DATA } from '../data/phase4Data';
import { OFFICIAL_SCHOLARSHIPS } from '../data/officialContentRegistry';

interface AcademicsPageProps {
  onBackToHome: () => void;
  onNavigateToDepartments?: () => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ onBackToHome, onNavigateToDepartments }) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'calendar' | 'examination' | 'forms' | 'scholarships'>('syllabus');
  const [syllabusDeptFilter, setSyllabusDeptFilter] = useState('All');
  const [syllabusSemFilter, setSyllabusSemFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Department code options for syllabus
  const departmentOptions = ['All', 'CSE', 'IT', 'ECE', 'MAE', 'MBA'];
  const semesterOptions = ['All', '1', '3', '5', '7'];

  // Filtered syllabi
  const filteredSyllabi = useMemo(() => {
    return ACADEMIC_SYLLABI_DATA.filter((syl) => {
      if (syllabusDeptFilter !== 'All' && syl.departmentCode !== syllabusDeptFilter) {
        return false;
      }
      if (syllabusSemFilter !== 'All' && syl.semester.toString() !== syllabusSemFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = syl.schemeTitle.toLowerCase().includes(q);
        const matchesProg = syl.programName.toLowerCase().includes(q);
        const matchesSub = syl.keySubjects.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProg && !matchesSub) return false;
      }
      return true;
    });
  }, [syllabusDeptFilter, syllabusSemFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-20">
      {/* Header Banner */}
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
                  Academic Resource Centre
                </span>
                <span aria-hidden="true">/</span>
                <span>Syllabus, Schedules & Forms</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Academic Resource Centre & Curriculum
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Centralized gateway for GGSIPU CBCS syllabi schemes, semester academic calendars, statutory examination datesheets, student requisition forms, and state scholarship guidelines.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onNavigateToDepartments && (
                <button
                  onClick={onNavigateToDepartments}
                  className="px-3.5 py-2 text-xs font-medium text-[#873A2B] hover:text-white bg-[#F7F5EF] hover:bg-[#873A2B] border border-[#E7E3D8] hover:border-[#873A2B] transition-colors shadow-2xs"
                >
                  View Department Directory
                </button>
              )}

              <button
                onClick={onBackToHome}
                className="px-3.5 py-2 text-xs font-medium text-[#657080] hover:text-[#203044] bg-[#F7F5EF] hover:bg-white border border-[#E7E3D8] transition-colors"
              >
                Return to Campus 3D
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E7E3D8] mb-6 overflow-x-auto scrollbar-none bg-white p-1">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2 text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'syllabus'
                ? 'bg-[#873A2B] text-white font-semibold'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Syllabus & Schemes ({filteredSyllabi.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'calendar'
                ? 'bg-[#873A2B] text-white font-semibold'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Academic Calendar 2026–27
          </button>
          <button
            onClick={() => setActiveTab('examination')}
            className={`px-4 py-2 text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'examination'
                ? 'bg-[#873A2B] text-white font-semibold'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Examination Resources
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-2 text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'forms'
                ? 'bg-[#873A2B] text-white font-semibold'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Student Forms & Clearance ({ACADEMIC_FORMS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2 text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'scholarships'
                ? 'bg-[#873A2B] text-white font-semibold'
                : 'text-[#657080] hover:text-[#203044]'
            }`}
          >
            Scholarships & Fee Concessions
          </button>
        </div>

        {/* TAB 1: SYLLABUS & SCHEMES */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white border border-[#E7E3D8] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#657080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject names (e.g. Operating Systems, VLSI, Data Structures)..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] placeholder:text-[#657080] focus:outline-none focus:border-[#873A2B]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={syllabusDeptFilter}
                  onChange={(e) => setSyllabusDeptFilter(e.target.value)}
                  className="bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-3 py-2 text-xs focus:outline-none focus:border-[#873A2B]"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>
                      Dept: {d}
                    </option>
                  ))}
                </select>

                <select
                  value={syllabusSemFilter}
                  onChange={(e) => setSyllabusSemFilter(e.target.value)}
                  className="bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-3 py-2 text-xs focus:outline-none focus:border-[#873A2B]"
                >
                  {semesterOptions.map((s) => (
                    <option key={s} value={s}>
                      Semester: {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Syllabi Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSyllabi.map((syl) => (
                <div
                  key={syl.id}
                  className="bg-white border border-[#E7E3D8] hover:border-[#873A2B] p-5 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                      <span className="font-mono text-sm text-[#873A2B] font-bold">
                        {syl.departmentCode} · Semester {syl.semester}
                      </span>
                      <span className="font-mono text-[11px] text-[#657080]">
                        {syl.creditsTotal} Credits
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#203044]">
                      {syl.programName}
                    </h3>
                    <div className="text-xs text-[#657080] mt-0.5">
                      {syl.schemeTitle}
                    </div>

                    {/* Key Subjects List */}
                    <div className="mt-4 pt-3 border-t border-[#E7E3D8]/60">
                      <div className="text-[10px] font-mono uppercase text-[#657080] mb-2">
                        Prescribed Core & Practical Papers:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {syl.keySubjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#F7F5EF] border border-[#E7E3D8] px-2 py-0.5 text-[#203044]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PDF Download Action */}
                  <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-xs text-[#657080]">
                    <span className="font-mono text-[11px]">{syl.revisionYear}</span>

                    <a
                      href={syl.downloadPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white font-medium transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Scheme ({syl.pdfSize})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E3D8] mb-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#203044]">
                    University Academic Calendar: Session 2026–2027
                  </h3>
                  <p className="text-xs text-[#657080] mt-0.5">
                    Statutory instructional days, examination windows, and semester breaks ratified by GGSIPU.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#16745B] font-semibold">
                  GGSIPU Order Ref. 2026/09
                </span>
              </div>

              {/* Odd Semester Table */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-[#873A2B] font-bold mb-3">
                  Odd Semester Schedule (Semesters 1, 3, 5 & 7)
                </h4>
                <div className="border border-[#E7E3D8] overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F5EF] font-mono text-[#657080] text-[11px] border-b border-[#E7E3D8]">
                      <tr>
                        <th className="py-2.5 px-4">Milestone Activity</th>
                        <th className="py-2.5 px-4">Start Date</th>
                        <th className="py-2.5 px-4">Concluding Date</th>
                        <th className="py-2.5 px-4">Compliance Authority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E3D8]">
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#203044]">Commencement of Classes</td>
                        <td className="py-3 px-4 font-mono">01 August 2026</td>
                        <td className="py-3 px-4 font-mono">—</td>
                        <td className="py-3 px-4 text-[#657080]">Department Heads</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#203044]">First Minor Assessment Examinations</td>
                        <td className="py-3 px-4 font-mono">18 October 2026</td>
                        <td className="py-3 px-4 font-mono">24 October 2026</td>
                        <td className="py-3 px-4 text-[#657080]">Academic Section</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#203044]">Preparatory Leave & Practical Exams</td>
                        <td className="py-3 px-4 font-mono">20 November 2026</td>
                        <td className="py-3 px-4 font-mono">30 November 2026</td>
                        <td className="py-3 px-4 text-[#657080]">Controller of Examinations</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#203044]">University End-Term Theory Examinations</td>
                        <td className="py-3 px-4 font-mono">02 December 2026</td>
                        <td className="py-3 px-4 font-mono">24 December 2026</td>
                        <td className="py-3 px-4 text-[#657080]">GGSIPU Examination Branch</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#203044]">Winter Inter-Semester Break</td>
                        <td className="py-3 px-4 font-mono">25 December 2026</td>
                        <td className="py-3 px-4 font-mono">08 January 2027</td>
                        <td className="py-3 px-4 text-[#657080]">Registrar Office</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Even Semester Preview */}
              <div>
                <h4 className="text-xs font-mono uppercase text-[#16745B] font-bold mb-3">
                  Even Semester Schedule (Semesters 2, 4, 6 & 8)
                </h4>
                <div className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#203044]">Commencement of Spring 2027 Semester:</span>
                    <span className="font-mono text-[#657080]">11 January 2027</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#203044]">TechSurge & Mridang 2027 University Fest:</span>
                    <span className="font-mono text-[#873A2B] font-semibold">18 – 20 February 2027</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#203044]">End-Term Even Semester University Examinations:</span>
                    <span className="font-mono text-[#657080]">May – June 2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXAMINATION RESOURCES */}
        {activeTab === 'examination' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#203044] mb-1">
                GGSIPU Examination Division & Conduct Guidelines
              </h3>
              <p className="text-xs text-[#657080] mb-6">
                Statutory instructions for students appearing in University End-Term examinations under College Code 148.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F7F5EF] border border-[#E7E3D8]">
                  <div className="font-mono text-[11px] uppercase text-[#873A2B] font-bold mb-2">
                    Admit Card & Seating Plan Protocol
                  </div>
                  <p className="text-[#203044] leading-relaxed">
                    Student admit cards with verified photographs are disbursed 7 days prior to examinations by Department Examination Superintendents. Physical photo ID alongside printed admit card is strictly compulsory.
                  </p>
                </div>

                <div className="p-4 bg-[#F7F5EF] border border-[#E7E3D8]">
                  <div className="font-mono text-[11px] uppercase text-[#16745B] font-bold mb-2">
                    Internal Assessment & CBCS Credits
                  </div>
                  <p className="text-[#203044] leading-relaxed">
                    Under GGSIPU CBCS guidelines: 25 marks weightage is allocated for internal continuous evaluations (minor exams, assignments, laboratory viva) and 75 marks for the external university written theory paper.
                  </p>
                </div>
              </div>

              {/* Direct University Exam Links */}
              <div className="mt-6 pt-5 border-t border-[#E7E3D8] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[#203044]">
                  External University Portals:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://ipu.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#873A2B] hover:text-[#16745B] flex items-center gap-1 font-medium"
                  >
                    <span>GGSIPU Examination Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://mait.ac.in/index.php/examination/datesheets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#873A2B] hover:text-[#16745B] flex items-center gap-1 font-medium"
                  >
                    <span>Live Datesheets on mait.ac.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT FORMS */}
        {activeTab === 'forms' && (
          <div className="space-y-4">
            <div className="text-xs text-[#657080] mb-2">
              Official downloadable PDF requisition forms verified from the Office of the Registrar.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACADEMIC_FORMS_DATA.map((form) => (
                <div
                  key={form.id}
                  className="bg-white border border-[#E7E3D8] hover:border-[#873A2B] p-5 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#657080] mb-1">
                      <span className="font-mono text-[11px] text-[#873A2B] font-semibold">
                        Processing: {form.processingTimeDays}
                      </span>
                      <span className="font-mono">{form.fileSize}</span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#203044]">
                      {form.title}
                    </h4>

                    <p className="text-xs text-[#657080] mt-2 leading-relaxed">
                      {form.purpose}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#E7E3D8]/60 text-xs text-[#657080] space-y-1">
                      <div>
                        <span className="font-medium text-[#203044]">Applicable To: </span>
                        <span>{form.applicableTo}</span>
                      </div>
                      <div>
                        <span className="font-medium text-[#203044]">Submission Desk: </span>
                        <span>{form.issuingOffice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#657080] truncate max-w-[200px]">
                      {form.fileName}
                    </span>

                    <a
                      href={form.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#203044] mb-1">
                Institutional & State Government Financial Assistance
              </h3>
              <p className="text-xs text-[#657080] mb-6">
                Verified scholarships available to MAIT students across economic tiers and academic merit criteria.
              </p>

              <div className="space-y-6">
                {OFFICIAL_SCHOLARSHIPS.map((sch) => (
                  <div key={sch.id} className="p-5 bg-[#F7F5EF] border border-[#E7E3D8] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[11px] text-[#873A2B] font-bold uppercase">
                        {sch.type}
                      </span>
                      <span className="text-[#657080]">
                        Application Window: {sch.applicationPeriod}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#203044]">
                      {sch.name}
                    </h4>

                    <div className="text-xs text-[#203044] leading-relaxed">
                      <span className="font-medium">Eligibility Slabs: </span>
                      {sch.eligibility}
                    </div>

                    <div className="text-xs text-[#16745B] font-medium">
                      Coverage: {sch.financialCoverage}
                    </div>

                    <div className="pt-3 border-t border-[#E7E3D8] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-[#657080]">
                        Institutional Verification Desk: {sch.submissionOffice}
                      </span>

                      <a
                        href={sch.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-2xs"
                      >
                        <span>Apply on Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
