/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Official Notices & Circulars Bulletin — Balanced University Typography
 */

import React, { useState } from 'react';
import { OFFICIAL_NOTICES, OfficialNotice } from '../data/maitData';
import { Search, FileText, Download, Printer, X } from 'lucide-react';

interface NoticesBulletinProps {
  selectedNotice?: OfficialNotice | null;
  onClearSelectedNotice?: () => void;
  onOpenFullNoticeBoard?: () => void;
}

export const NoticesBulletin: React.FC<NoticesBulletinProps> = ({
  selectedNotice: initialNotice,
  onClearSelectedNotice,
  onOpenFullNoticeBoard,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingNotice, setViewingNotice] = useState<OfficialNotice | null>(initialNotice || null);

  React.useEffect(() => {
    if (initialNotice) {
      setViewingNotice(initialNotice);
    }
  }, [initialNotice]);

  const filteredNotices = OFFICIAL_NOTICES.filter((n) => {
    const matchesCategory = activeCategory === 'All' || n.category === activeCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Academic', 'Examination', 'Admissions', 'Placements', 'General'];

  return (
    <section id="notices" className="py-14 bg-[#F7F5EF] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Official Gazette & Circulars
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Administrative & Academic Notices
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-[#657080] max-w-md hidden lg:block leading-relaxed">
              Directives issued by the Director's Secretariat, Examination Controller, and Academic Council.
            </p>
            {onOpenFullNoticeBoard && (
              <button
                onClick={onOpenFullNoticeBoard}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] hover:border-[#873A2B] text-xs font-semibold transition-colors shrink-0 shadow-2xs"
              >
                <span>Open Smart Notice Board</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E7E3D8] shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-[#657080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by keyword or ref..."
              className="w-full bg-white border border-[#E7E3D8] pl-9 pr-4 py-2 text-xs text-[#203044] focus:outline-none focus:border-[#873A2B] shadow-2xs"
            />
          </div>
        </div>

        {/* Notices Table / List on Pure White */}
        <div className="bg-white border border-[#E7E3D8] divide-y divide-[#F0ECE1] shadow-2xs">
          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#657080]">
              No official notices matching "{searchQuery}".
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setViewingNotice(notice)}
                className="p-4 hover:bg-[#F7F5EF] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#657080]">
                    <span className="text-[#873A2B] font-semibold">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{notice.refNo}</span>
                    <span aria-hidden="true">·</span>
                    <span>{notice.date}</span>
                    {notice.isImportant && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#873A2B] font-semibold uppercase text-[10px] bg-[#FCEBE9] px-1.5 py-0.2 border border-[#F6C6C2]">
                          Important
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#203044] mt-1 group-hover:text-[#873A2B] transition-colors leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-[#657080] mt-1 line-clamp-2 leading-relaxed">{notice.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                  <span className="text-xs text-[#657080] hidden sm:inline">{notice.issuer}</span>
                  <button className="px-3 py-1.5 bg-[#F7F5EF] group-hover:bg-[#873A2B] text-[#203044] group-hover:text-white border border-[#E7E3D8] group-hover:border-[#873A2B] text-xs transition-colors flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Notice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Authentic Simulated Official Circular Modal */}
        {viewingNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[#FAF8F3] text-[#203044] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-xl relative border border-[#E7E3D8]">
              <button
                onClick={() => {
                  setViewingNotice(null);
                  if (onClearSelectedNotice) onClearSelectedNotice();
                }}
                className="absolute top-4 right-4 p-1.5 text-[#657080] hover:text-[#203044] hover:bg-[#EFECE3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Official Institute Letterhead */}
              <div className="text-center border-b-2 border-[#203044] pb-4 mb-5">
                <p className="text-xs uppercase tracking-wider text-[#657080] font-semibold">
                  Maharaja Agrasen Technical Education Society
                </p>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044] uppercase tracking-wide mt-1">
                  Maharaja Agrasen Institute of Technology
                </h2>
                <p className="text-xs text-[#657080] mt-1">
                  Affiliated to GGSIP University, Delhi · Approved by AICTE · NBA Accredited
                </p>
                <p className="text-xs text-[#657080] mt-0.5">
                  PSP Area, Plot No. 1, Sector-22, Rohini, New Delhi - 110086
                </p>
              </div>

              {/* Notice Reference Header */}
              <div className="flex items-center justify-between text-xs border-b border-[#E2DDD2] pb-2 mb-4 text-[#657080]">
                <div>
                  <strong className="text-[#203044]">Ref No:</strong> {viewingNotice.refNo}
                </div>
                <div>
                  <strong className="text-[#203044]">Date:</strong> {viewingNotice.date}
                </div>
              </div>

              {/* Notice Title */}
              <div className="text-center my-5">
                <span className="text-xs uppercase border border-[#873A2B] text-[#873A2B] px-3 py-1 font-semibold">
                  Official Notification
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#203044] mt-3 max-w-xl mx-auto leading-snug">
                  {viewingNotice.title}
                </h3>
              </div>

              {/* Notice Body */}
              <div className="text-xs sm:text-sm text-[#203044] space-y-3 leading-relaxed">
                <p>
                  This is to inform all concerned faculty members, staff, and students of Maharaja Agrasen Institute of
                  Technology regarding the following directive:
                </p>
                <div className="p-4 bg-white border-l-2 border-[#873A2B] text-[#203044] text-xs shadow-2xs">
                  {viewingNotice.summary}
                </div>
                <p>
                  All branch coordinators and student representatives are advised to note the stipulations and ensure
                  strict compliance with university academic norms and examination protocols as per GGSIPU statutes.
                </p>
                <p>
                  For clarifications, candidates may approach the office of the respective department Head or Registrar
                  during working hours.
                </p>
              </div>

              {/* Signatory */}
              <div className="mt-8 pt-5 border-t border-[#E2DDD2] flex items-end justify-between">
                <div className="text-xs text-[#657080]">
                  <p className="font-semibold text-[#203044]">Copy to:</p>
                  <p>1. Office of the Director</p>
                  <p>2. All Deans & HODs</p>
                  <p>3. Notice Boards & Portal</p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-9 border border-[#D8D2C4] bg-white rounded mb-1 flex items-center justify-center text-[10px] text-[#657080] italic">
                    [Signed]
                  </div>
                  <p className="text-xs font-serif font-bold text-[#203044]">{viewingNotice.issuer}</p>
                  <p className="text-[11px] text-[#657080]">MAIT, Rohini, New Delhi</p>
                </div>
              </div>

              {/* Modal Utility Bar */}
              <div className="mt-6 pt-4 border-t border-[#E2DDD2] flex items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-[#EFECE3] border border-[#E7E3D8] text-[#203044] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Simulated Download of ${viewingNotice.refNo}.pdf completed.`);
                  }}
                  className="px-3 py-1.5 bg-[#873A2B] hover:bg-[#702f23] text-white flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
