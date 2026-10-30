/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Smart Notice Board — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  FileText,
  Download,
  ExternalLink,
  ArrowUpDown,
  AlertCircle,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SMART_NOTICES_DATA } from '../data/phase3Data';
import { SmartNoticeItem, NoticeCategory } from '../types/phase3';
import { NoticeDocumentModal } from './NoticeDocumentModal';

interface NoticeBoardPageProps {
  onBackToHome: () => void;
}

export const NoticeBoardPage: React.FC<NoticeBoardPageProps> = ({ onBackToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'All'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeNoticeForModal, setActiveNoticeForModal] = useState<SmartNoticeItem | null>(null);

  // Bookmarks state synced with localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mait_notice_bookmarks');
      return saved ? JSON.parse(saved) : ['not-001', 'not-003'];
    } catch {
      return ['not-001', 'not-003'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mait_notice_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('Could not persist notice bookmarks', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Distinct departments and academic years
  const departmentsList = useMemo(() => {
    const set = new Set(SMART_NOTICES_DATA.map((n) => n.department));
    return ['All', ...Array.from(set)];
  }, []);

  const academicYearsList = useMemo(() => {
    const set = new Set(SMART_NOTICES_DATA.map((n) => n.academicYear));
    return ['All', ...Array.from(set)];
  }, []);

  const semestersList = [
    'All',
    'Sem 1 (Incoming Freshmen)',
    'Sem 1, 3, 5 & 7',
    'Sem 3, 5 & 7',
    'Sem 7 & 8',
    'All Semesters',
  ];

  const categoriesList: (NoticeCategory | 'All')[] = [
    'All',
    'Examination',
    'Admissions',
    'Academic',
    'Registration',
    'Scholarships',
    'Administration',
    'Events',
    'Placements',
    'Circulars',
  ];

  // Filtering and sorting logic
  const filteredNotices = useMemo(() => {
    return SMART_NOTICES_DATA.filter((notice) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = notice.title.toLowerCase().includes(query);
        const matchesRef = notice.refNo.toLowerCase().includes(query);
        const matchesSummary = notice.summary.toLowerCase().includes(query);
        const matchesDept = notice.department.toLowerCase().includes(query);
        const matchesBody = notice.fullContent.some((p) => p.toLowerCase().includes(query));
        if (!matchesTitle && !matchesRef && !matchesSummary && !matchesDept && !matchesBody) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && notice.category !== selectedCategory) {
        return false;
      }

      // 3. Department
      if (selectedDepartment !== 'All' && notice.department !== selectedDepartment) {
        return false;
      }

      // 4. Semester
      if (selectedSemester !== 'All') {
        if (!notice.semesterApplicable || !notice.semesterApplicable.includes(selectedSemester.replace('All Semesters', ''))) {
          if (selectedSemester === 'All Semesters' && notice.semesterApplicable !== 'All Semesters') {
            return false;
          }
          if (notice.semesterApplicable !== selectedSemester) {
            return false;
          }
        }
      }

      // 5. Academic Year
      if (selectedAcademicYear !== 'All' && notice.academicYear !== selectedAcademicYear) {
        return false;
      }

      // 6. Important only
      if (showImportantOnly && !notice.isImportant && !notice.isUrgent) {
        return false;
      }

      // 7. Bookmarks only
      if (showBookmarksOnly && !bookmarkedIds.includes(notice.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.publicationDate).getTime();
      const dateB = new Date(b.publicationDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedDepartment,
    selectedSemester,
    selectedAcademicYear,
    showImportantOnly,
    showBookmarksOnly,
    bookmarkedIds,
    sortOrder,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedSemester('All');
    setSelectedAcademicYear('All');
    setShowImportantOnly(false);
    setShowBookmarksOnly(false);
    setSortOrder('newest');
  };

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
                  Smart Notice Board
                </span>
                <span aria-hidden="true">/</span>
                <span>Official Circulars</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Institutional Circulars & Notice Bulletin
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Verified administrative notices, examination schedules, admission guidelines, and academic orders issued by Maharaja Agrasen Institute of Technology.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBookmarksOnly((prev) => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium border transition-colors ${
                  showBookmarksOnly
                    ? 'bg-[#873A2B] text-white border-[#873A2B]'
                    : 'bg-[#F7F5EF] text-[#203044] hover:bg-white border-[#E7E3D8]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
                <span>Saved Notices ({bookmarkedIds.length})</span>
              </button>

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
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-[#E7E3D8] p-4 sm:p-6 mb-6 shadow-xs">
          {/* Row 1: Search Bar + Sort + Reset */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pb-5 border-b border-[#E7E3D8]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#657080] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars by title, keywords, ref number, or department..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] placeholder:text-[#657080] focus:outline-none focus:border-[#873A2B] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#657080] hover:text-[#203044]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Sort Order Selector */}
              <div className="flex items-center border border-[#E7E3D8] bg-[#F7F5EF] p-1">
                <button
                  onClick={() => setSortOrder('newest')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortOrder === 'newest'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => setSortOrder('oldest')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortOrder === 'oldest'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  Oldest First
                </button>
              </div>

              {/* Urgent / Important Filter Toggle */}
              <button
                onClick={() => setShowImportantOnly((prev) => !prev)}
                className={`px-3 py-2 text-xs font-medium border transition-colors ${
                  showImportantOnly
                    ? 'bg-[#873A2B] text-white border-[#873A2B]'
                    : 'bg-[#F7F5EF] text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
                }`}
              >
                Urgent Only
              </button>

              {/* Reset button */}
              {(searchQuery ||
                selectedCategory !== 'All' ||
                selectedDepartment !== 'All' ||
                selectedSemester !== 'All' ||
                selectedAcademicYear !== 'All' ||
                showImportantOnly ||
                showBookmarksOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#873A2B] hover:text-[#203044] hover:bg-[#F7F5EF] border border-[#E7E3D8] transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Segmented Filter Tabs */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#657080]">
                Notice Category:
              </span>
              <span className="text-[11px] text-[#657080] font-sans">
                Showing {filteredNotices.length} of {SMART_NOTICES_DATA.length} circulars
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#873A2B] text-white'
                      : 'bg-[#F7F5EF] text-[#657080] hover:text-[#203044] hover:bg-[#EAE6DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Secondary Dropdowns (Department, Semester, Academic Year) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E7E3D8]/60 text-xs">
            {/* Department Dropdown */}
            <div>
              <label className="block text-[11px] font-mono text-[#657080] uppercase mb-1">
                Department / Authority
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#873A2B]"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <label className="block text-[11px] font-mono text-[#657080] uppercase mb-1">
                Target Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#873A2B]"
              >
                {semestersList.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-[11px] font-mono text-[#657080] uppercase mb-1">
                Academic Session
              </label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#873A2B]"
              >
                {academicYearsList.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notices Cards Grid / Feed */}
        {filteredNotices.length > 0 ? (
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const isBookmarked = bookmarkedIds.includes(notice.id);

              return (
                <article
                  key={notice.id}
                  className={`bg-white border transition-all duration-200 p-5 sm:p-6 ${
                    notice.isUrgent
                      ? 'border-l-4 border-l-[#873A2B] border-y-[#E7E3D8] border-r-[#E7E3D8] shadow-xs'
                      : 'border-[#E7E3D8] hover:border-[#B18B50] shadow-xs'
                  }`}
                >
                  {/* Card Header: Metadata Row (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#657080] mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-[#873A2B] font-semibold">
                        {notice.refNo}
                      </span>
                      <span aria-hidden="true" className="text-[#657080]">·</span>
                      <span className="font-medium text-[#203044]">{notice.department}</span>
                      <span aria-hidden="true" className="text-[#657080]">·</span>
                      <span>{notice.category}</span>
                      {notice.semesterApplicable && (
                        <>
                          <span aria-hidden="true" className="text-[#657080]">·</span>
                          <span className="text-[#657080]">{notice.semesterApplicable}</span>
                        </>
                      )}
                      {notice.isUrgent && (
                        <>
                          <span aria-hidden="true" className="text-[#657080]">·</span>
                          <span className="text-[#873A2B] font-mono text-[11px] font-bold uppercase tracking-wider">
                            Urgent Circular
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#657080]">
                        {notice.displayDate}
                      </span>
                      <button
                        onClick={() => toggleBookmark(notice.id)}
                        className={`p-1.5 transition-colors border ${
                          isBookmarked
                            ? 'bg-[#873A2B] text-white border-[#873A2B]'
                            : 'bg-[#F7F5EF] text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this notice'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Notice Title */}
                  <h2
                    onClick={() => setActiveNoticeForModal(notice)}
                    className="text-base sm:text-lg font-serif font-bold text-[#203044] hover:text-[#873A2B] cursor-pointer transition-colors leading-snug"
                  >
                    {notice.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#657080] mt-2 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>

                  {/* Card Footer: Actions & Document Details */}
                  <div className="mt-4 pt-3 border-t border-[#E7E3D8]/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-[#657080]">
                      {notice.hasAttachment ? (
                        <div className="flex items-center gap-1.5 text-[#16745B] font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          <span>
                            {notice.attachmentFileName || 'Official Circular.pdf'} ({notice.attachmentSize || 'PDF'})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#657080]">Notice Text Only</span>
                      )}

                      <span className="hidden sm:inline" aria-hidden="true">·</span>
                      <span className="hidden sm:inline text-[11px]">
                        Session: {notice.academicYear}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveNoticeForModal(notice)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] hover:border-[#873A2B] font-medium transition-colors text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Circular</span>
                      </button>

                      {notice.hasAttachment && (
                        <a
                          href={notice.documentDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white font-medium transition-colors text-xs shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      )}

                      <a
                        href={notice.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#657080] hover:text-[#873A2B] transition-colors"
                        title="Open official mait.ac.in source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white border border-[#E7E3D8] p-12 text-center my-6">
            <div className="w-12 h-12 bg-[#F7F5EF] text-[#657080] mx-auto flex items-center justify-center rounded-full mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#203044]">
              No Matching Notices Found
            </h3>
            <p className="text-xs sm:text-sm text-[#657080] max-w-md mx-auto mt-1">
              No circulars match your current filter parameters or search query. Try broadening your keywords or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Audit Compliance Disclaimer */}
        <div className="mt-8 p-4 bg-white border border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#657080]">
          <div>
            <span className="font-semibold text-[#203044]">Statutory Notice Disclaimer: </span>
            <span>
              All notifications are mirrored from the Controller of Examinations and Registrar at Maharaja Agrasen Institute of Technology under GGSIPU Code 148.
            </span>
          </div>
          <a
            href="https://mait.ac.in/index.php/notices"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
          >
            <span>Live Archive on mait.ac.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Official Circular Inspection Modal */}
      <NoticeDocumentModal
        notice={activeNoticeForModal}
        isOpen={!!activeNoticeForModal}
        onClose={() => setActiveNoticeForModal(null)}
        isBookmarked={activeNoticeForModal ? bookmarkedIds.includes(activeNoticeForModal.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
};
