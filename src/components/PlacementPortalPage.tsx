/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Placement Insights Portal — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Building,
  Award,
  Users,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  Briefcase,
  ChevronRight,
  BarChart3,
  Globe2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BATCH_PLACEMENT_DATA, RECRUITER_DIRECTORY_DATA } from '../data/phase3Data';
import { BatchPlacementInsight, RecruiterDirectoryItem } from '../types/phase3';

interface PlacementPortalPageProps {
  onBackToHome: () => void;
}

export const PlacementPortalPage: React.FC<PlacementPortalPageProps> = ({ onBackToHome }) => {
  const [selectedBatchYear, setSelectedBatchYear] = useState<string>('2024-2025');
  const [activeTab, setActiveTab] = useState<'overview' | 'recruiters' | 'departments' | 'reports'>('overview');
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [recruiterSectorFilter, setRecruiterSectorFilter] = useState('All');
  const [recruiterTierFilter, setRecruiterTierFilter] = useState('All');
  const [selectedDepartmentView, setSelectedDepartmentView] = useState('All');

  // Currently selected batch object
  const currentBatch = useMemo<BatchPlacementInsight>(() => {
    return (
      BATCH_PLACEMENT_DATA.find((b) => b.batchAcademicYear === selectedBatchYear) ||
      BATCH_PLACEMENT_DATA[0]
    );
  }, [selectedBatchYear]);

  // Distinct sectors and tiers for recruiters
  const sectorsList = useMemo(() => {
    const set = new Set(RECRUITER_DIRECTORY_DATA.map((r) => r.sector));
    return ['All', ...Array.from(set)];
  }, []);

  const tiersList = useMemo(() => {
    const set = new Set(RECRUITER_DIRECTORY_DATA.map((r) => r.tier));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered recruiters
  const filteredRecruiters = useMemo(() => {
    return RECRUITER_DIRECTORY_DATA.filter((rec) => {
      // Batch filter
      if (!rec.hiringBatches.includes(selectedBatchYear)) {
        return false;
      }

      // Sector filter
      if (recruiterSectorFilter !== 'All' && rec.sector !== recruiterSectorFilter) {
        return false;
      }

      // Tier filter
      if (recruiterTierFilter !== 'All' && rec.tier !== recruiterTierFilter) {
        return false;
      }

      // Search query
      if (recruiterSearch.trim()) {
        const q = recruiterSearch.toLowerCase();
        const matchesName = rec.companyName.toLowerCase().includes(q);
        const matchesRoles = rec.rolesOffered.some((r) => r.toLowerCase().includes(q));
        const matchesDesc = rec.description.toLowerCase().includes(q);
        if (!matchesName && !matchesRoles && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.topPackageOfferedLPA - a.topPackageOfferedLPA);
  }, [selectedBatchYear, recruiterSectorFilter, recruiterTierFilter, recruiterSearch]);

  // Filtered department statistics
  const filteredDepartmentStats = useMemo(() => {
    if (selectedDepartmentView === 'All') {
      return currentBatch.departmentStats;
    }
    return currentBatch.departmentStats.filter((d) => d.departmentCode === selectedDepartmentView);
  }, [currentBatch, selectedDepartmentView]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-20">
      {/* Page Header / Breadcrumb Header */}
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
                  Training & Placement Portal
                </span>
                <span aria-hidden="true">/</span>
                <span>Placement Insights</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Placement Insights & Corporate Relations
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Verified annual campus placement statistics, recruiter directory, salary tier distributions, and departmental audits for Maharaja Agrasen Institute of Technology.
              </p>
            </div>

            {/* Batch Selector Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-[#F7F5EF] border border-[#E7E3D8]">
                <span className="text-[11px] font-mono text-[#657080] uppercase px-2">
                  Batch:
                </span>
                {BATCH_PLACEMENT_DATA.map((b) => (
                  <button
                    key={b.batchId}
                    onClick={() => setSelectedBatchYear(b.batchAcademicYear)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedBatchYear === b.batchAcademicYear
                        ? 'bg-[#873A2B] text-white shadow-xs'
                        : 'text-[#657080] hover:text-[#203044]'
                    }`}
                  >
                    {b.batchAcademicYear}
                  </button>
                ))}
              </div>

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
        {/* Placement Cell Introduction & Leadership Bar */}
        <div className="bg-white border border-[#E7E3D8] p-5 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#F7F5EF] border border-[#E7E3D8] flex items-center justify-center text-[#873A2B] shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#203044]">
                Training & Placement Cell (T&P)
              </h2>
              <p className="text-xs text-[#657080] mt-0.5 max-w-xl">
                Led by Brig. S. K. Sharma (Head T&P) & Prof. Vaibhav Jain. Dedicated to bridging industry requirements with technical pedagogy, hosting 160+ top recruiters every recruitment cycle.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <a
              href="https://mait.ac.in/index.php/placement"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] text-xs font-medium transition-colors"
            >
              <span>T&P Official Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={currentBatch.officialReportPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Annual Report ({currentBatch.officialReportSize})</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs for Placement Sub-views */}
        <div className="flex items-center gap-1 border-b border-[#E7E3D8] mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#873A2B] text-[#873A2B] bg-white'
                : 'border-transparent text-[#657080] hover:text-[#203044]'
            }`}
          >
            Batch {selectedBatchYear} Highlights & Slabs
          </button>
          <button
            onClick={() => setActiveTab('recruiters')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'recruiters'
                ? 'border-[#873A2B] text-[#873A2B] bg-white'
                : 'border-transparent text-[#657080] hover:text-[#203044]'
            }`}
          >
            Recruiter Directory ({filteredRecruiters.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'departments'
                ? 'border-[#873A2B] text-[#873A2B] bg-white'
                : 'border-transparent text-[#657080] hover:text-[#203044]'
            }`}
          >
            Department Breakdown
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'reports'
                ? 'border-[#873A2B] text-[#873A2B] bg-white'
                : 'border-transparent text-[#657080] hover:text-[#203044]'
            }`}
          >
            Official Placement Gazettes
          </button>
        </div>

        {/* TAB 1: OVERVIEW & SALARY SLABS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Metric Cards (Zero-Pill Discipline) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E7E3D8] p-5 shadow-xs">
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Total Verified Offers
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#873A2B] mt-1">
                  {currentBatch.totalOffers.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#657080] mt-1">
                  Unique students: {currentBatch.uniqueStudentsPlaced}
                </div>
              </div>

              <div className="bg-white border border-[#E7E3D8] p-5 shadow-xs">
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Highest Domestic Package
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] mt-1">
                  ₹{currentBatch.highestPackageDomesticLPA} <span className="text-sm font-sans font-normal text-[#657080]">LPA</span>
                </div>
                <div className="text-[11px] text-[#657080] mt-1 truncate">
                  {currentBatch.topDomesticCompany}
                </div>
              </div>

              <div className="bg-white border border-[#E7E3D8] p-5 shadow-xs">
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Average CTC Package
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#16745B] mt-1">
                  ₹{currentBatch.averagePackageLPA} <span className="text-sm font-sans font-normal text-[#657080]">LPA</span>
                </div>
                <div className="text-[11px] text-[#657080] mt-1">
                  Median: ₹{currentBatch.medianPackageLPA} LPA
                </div>
              </div>

              <div className="bg-white border border-[#E7E3D8] p-5 shadow-xs">
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Companies In Recruitment
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#B18B50] mt-1">
                  {currentBatch.companiesVisited}
                </div>
                <div className="text-[11px] text-[#657080] mt-1">
                  Defense offers: {currentBatch.defenseRecruitmentOffers}
                </div>
              </div>
            </div>

            {/* International Outlier Callout if present */}
            {currentBatch.highestPackageInternationalLPA && (
              <div className="p-4 bg-white border border-[#E7E3D8] border-l-4 border-l-[#B18B50] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono text-[10px] uppercase text-[#B18B50] font-semibold">
                    International Outlier Placement (Batch {selectedBatchYear})
                  </div>
                  <div className="text-sm font-serif font-bold text-[#203044] mt-0.5">
                    ₹{currentBatch.highestPackageInternationalLPA / 100} Crore Per Annum (CPA) · {currentBatch.topInternationalCompany}
                  </div>
                  <p className="text-[11px] text-[#657080] mt-0.5">
                    Reported international placement in civil engineering infrastructure consulting.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-[#657080]">
                  Verified: {currentBatch.meta.verifiedDate}
                </div>
              </div>
            )}

            {/* Salary Slab Breakdown & Distribution Chart */}
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7E3D8] mb-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#203044]">
                    Verified Salary Slab Distribution (Batch {selectedBatchYear})
                  </h3>
                  <p className="text-xs text-[#657080] mt-0.5">
                    Numerical segmentation of offers received across verified CTC tiers.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#16745B]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified: {currentBatch.meta.verificationStatus}</span>
                </div>
              </div>

              {/* Visual Horizontal Bar Distribution */}
              <div className="space-y-4">
                {currentBatch.salarySlabs.map((slab, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-medium text-[#203044]">
                        {slab.slabRange}
                        <span className="text-[#657080] font-normal ml-2 hidden sm:inline">
                          — {slab.description}
                        </span>
                      </div>
                      <div className="font-mono text-[#203044] font-semibold">
                        {slab.offerCount} offers ({slab.percentageOfTotal}%)
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-[#F7F5EF] border border-[#E7E3D8] overflow-hidden">
                      <div
                        className="h-full bg-[#873A2B] transition-all duration-500"
                        style={{ width: `${Math.max(slab.percentageOfTotal * 1.5, 3)}%` }}
                      />
                    </div>

                    {/* Sample Companies */}
                    <div className="text-[11px] text-[#657080] flex items-center gap-1">
                      <span className="font-mono text-[#203044]">Key Recruiters: </span>
                      <span>{slab.sampleCompanies.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Source Citation for Chart */}
              <div className="mt-6 pt-4 border-t border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#657080]">
                <div>
                  <span className="font-mono font-semibold">Official Citation: </span>
                  <span>{currentBatch.meta.officialCitation}</span>
                </div>
                <a
                  href={currentBatch.meta.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
                >
                  <span>Verify on mait.ac.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITER DIRECTORY */}
        {activeTab === 'recruiters' && (
          <div className="space-y-6">
            {/* Recruiter Toolbar */}
            <div className="bg-white border border-[#E7E3D8] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#657080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={recruiterSearch}
                    onChange={(e) => setRecruiterSearch(e.target.value)}
                    placeholder="Search company by name, role, or profile..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] placeholder:text-[#657080] focus:outline-none focus:border-[#873A2B]"
                  />
                  {recruiterSearch && (
                    <button
                      onClick={() => setRecruiterSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#657080]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={recruiterSectorFilter}
                    onChange={(e) => setRecruiterSectorFilter(e.target.value)}
                    className="bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-3 py-2 text-xs focus:outline-none focus:border-[#873A2B]"
                  >
                    {sectorsList.map((sec) => (
                      <option key={sec} value={sec}>
                        Sector: {sec}
                      </option>
                    ))}
                  </select>

                  <select
                    value={recruiterTierFilter}
                    onChange={(e) => setRecruiterTierFilter(e.target.value)}
                    className="bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-3 py-2 text-xs focus:outline-none focus:border-[#873A2B]"
                  >
                    {tiersList.map((tier) => (
                      <option key={tier} value={tier}>
                        Tier: {tier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Recruiter Grid */}
            {filteredRecruiters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRecruiters.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white border border-[#E7E3D8] hover:border-[#873A2B] p-5 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Top Row (Zero-Pill Discipline) */}
                      <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                        <span className="font-mono text-[11px] text-[#873A2B] font-semibold">
                          {rec.tier}
                        </span>
                        <span className="font-mono">{rec.sector}</span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-[#203044]">
                        {rec.companyName}
                      </h4>

                      <div className="text-xs text-[#16745B] font-mono font-medium mt-1">
                        Top Package Offered: ₹{rec.topPackageOfferedLPA} LPA
                      </div>

                      <p className="text-xs text-[#657080] mt-2 line-clamp-2">
                        {rec.description}
                      </p>

                      {/* Roles Offered */}
                      <div className="mt-3 pt-3 border-t border-[#E7E3D8]/60 text-xs">
                        <div className="font-mono text-[10px] text-[#657080] uppercase mb-1">
                          Roles Recruited:
                        </div>
                        <ul className="space-y-0.5 text-xs text-[#203044]">
                          {rec.rolesOffered.map((role, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#873A2B]" />
                              <span>{role}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-[11px] text-[#657080]">
                      <span>Mode: {rec.selectionMode}</span>
                      <a
                        href={rec.meta.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
                      >
                        <span>Audit Gazette</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E7E3D8] p-10 text-center">
                <AlertCircle className="w-8 h-8 text-[#657080] mx-auto mb-2" />
                <h4 className="font-serif font-bold text-[#203044]">No Recruiters Found</h4>
                <p className="text-xs text-[#657080] mt-1">
                  No recruiting partners matched your query for batch {selectedBatchYear}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEPARTMENT BREAKDOWN */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#203044]">
                  Department-Wise Placement Performance (Batch {selectedBatchYear})
                </h3>
                <p className="text-xs text-[#657080] mt-0.5">
                  Verified registration, selection rate, and highest packages by academic department.
                </p>
              </div>

              <select
                value={selectedDepartmentView}
                onChange={(e) => setSelectedDepartmentView(e.target.value)}
                className="bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-3 py-1.5 text-xs focus:outline-none focus:border-[#873A2B]"
              >
                <option value="All">All Departments</option>
                {currentBatch.departmentStats.map((d) => (
                  <option key={d.departmentCode} value={d.departmentCode}>
                    {d.departmentCode} — {d.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Table */}
            <div className="bg-white border border-[#E7E3D8] overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F7F5EF] border-b border-[#E7E3D8] text-[#657080] font-mono uppercase text-[11px]">
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4">Placed</th>
                    <th className="py-3 px-4">Placement %</th>
                    <th className="py-3 px-4">Highest CTC</th>
                    <th className="py-3 px-4">Average CTC</th>
                    <th className="py-3 px-4">Key Hiring Partners</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E3D8]">
                  {filteredDepartmentStats.map((dept) => (
                    <tr key={dept.departmentCode} className="hover:bg-[#F7F5EF]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-serif font-bold text-[#203044]">
                          {dept.departmentCode}
                        </div>
                        <div className="text-[11px] text-[#657080]">
                          {dept.departmentName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{dept.studentsRegistered}</td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#203044]">
                        {dept.studentsPlaced}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-[#16745B]">
                          {dept.placementPercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#873A2B] font-semibold">
                        ₹{dept.highestPackageLPA} LPA
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#203044]">
                        ₹{dept.averagePackageLPA} LPA
                      </td>
                      <td className="py-3.5 px-4 text-[#657080]">
                        {dept.topRecruiters.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL REPORTS & AUDIT ARCHIVE */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#203044] mb-1">
                Official Institutional Placement Gazettes
              </h3>
              <p className="text-xs text-[#657080] mb-6">
                Download verified annual placement audit reports submitted to statutory regulatory bodies (NIRF, AICTE, GGSIPU).
              </p>

              <div className="space-y-4">
                {BATCH_PLACEMENT_DATA.map((batch) => (
                  <div
                    key={batch.batchId}
                    className="p-5 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white border border-[#E7E3D8] flex items-center justify-center text-[#873A2B] shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[#203044]">
                          {batch.officialReportPdfName}
                        </div>
                        <div className="text-xs text-[#657080] mt-0.5">
                          {batch.reportingPeriod} · Size: {batch.officialReportSize}
                        </div>
                        <div className="text-[11px] text-[#16745B] mt-1 font-mono">
                          Verification: {batch.meta.verificationStatus} ({batch.meta.verifiedDate})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <a
                        href={batch.officialReportPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>

                      <a
                        href={batch.meta.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-white text-[#203044] border border-[#E7E3D8] hover:border-[#873A2B] text-xs font-medium transition-colors"
                      >
                        Web Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Placement Transparency Footnote */}
        <div className="mt-8 p-4 bg-white border border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#657080]">
          <div>
            <span className="font-semibold text-[#203044]">Statutory Integrity Rule: </span>
            <span>
              MAIT Connect strictly adheres to verified numeric disclosure: historical batches are segregated into independent reporting periods and never commingled.
            </span>
          </div>
          <div className="shrink-0 font-mono text-[11px] text-[#873A2B]">
            Data Audited: October 2026
          </div>
        </div>
      </div>
    </div>
  );
};
