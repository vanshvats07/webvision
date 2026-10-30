/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Official Circular / Document Viewer Modal
 * Institutional Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React from 'react';
import { X, Download, ExternalLink, Printer, ShieldCheck, FileText, Calendar, Building, Bookmark } from 'lucide-react';
import { SmartNoticeItem } from '../types/phase3';

interface NoticeDocumentModalProps {
  notice: SmartNoticeItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (noticeId: string) => void;
}

export const NoticeDocumentModal: React.FC<NoticeDocumentModalProps> = ({
  notice,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!isOpen || !notice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white border border-[#E7E3D8] shadow-2xl overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#F7F5EF] border-b border-[#E7E3D8]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#873A2B]" />
            <span className="text-xs font-mono font-medium tracking-wider text-[#657080] uppercase">
              Official Institutional Gazette · {notice.refNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(notice.id)}
              className={`p-1.5 transition-colors text-xs flex items-center gap-1 border ${
                isBookmarked
                  ? 'bg-[#873A2B] text-white border-[#873A2B]'
                  : 'bg-white text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark notice'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-[11px] font-sans hidden sm:inline">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 bg-white text-[#657080] hover:text-[#203044] border border-[#E7E3D8] transition-colors"
              title="Print Circular"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-white text-[#657080] hover:text-[#203044] border border-[#E7E3D8] hover:border-[#873A2B] transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Official Circular Simulation Paper */}
        <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto font-sans bg-white">
          {/* Institutional Letterhead */}
          <div className="text-center pb-6 border-b-2 border-[#873A2B]/20">
            <div className="inline-block px-3 py-1 bg-[#F7F5EF] border border-[#E7E3D8] text-[10px] font-mono tracking-widest text-[#657080] uppercase mb-2">
              Govt. of NCT of Delhi · AICTE Approved · GGSIPU Code 148
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044] tracking-tight">
              MAHARAJA AGRASEN INSTITUTE OF TECHNOLOGY
            </h2>
            <p className="text-xs text-[#657080] mt-1">
              PSP Area, Plot No. 1, Sector-22, Rohini, New Delhi - 110086
            </p>
            <p className="text-[11px] font-mono text-[#873A2B] mt-0.5">
              www.mait.ac.in · mait@mait.ac.in · EPABX: 011-27582095
            </p>
          </div>

          {/* Reference & Metadata Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-[#E7E3D8] text-xs text-[#657080]">
            <div>
              <span className="font-mono text-[#203044] font-semibold">Ref No: </span>
              <span className="font-mono">{notice.refNo}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[#203044] font-medium">Department: </span>
                <span>{notice.department}</span>
              </div>
              <div>
                <span className="text-[#203044] font-medium">Date: </span>
                <span>{notice.displayDate}</span>
              </div>
            </div>
          </div>

          {/* Circular Title */}
          <div className="py-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#873A2B] font-semibold">
                Official Circular · {notice.category}
              </span>
              {notice.semesterApplicable && (
                <>
                  <span className="text-[#657080]" aria-hidden="true">·</span>
                  <span className="text-[11px] text-[#657080] font-sans">
                    Applicable: {notice.semesterApplicable}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-[#203044] leading-snug">
              {notice.title}
            </h1>
          </div>

          {/* Circular Text Body */}
          <div className="space-y-4 text-sm text-[#203044] leading-relaxed border-t border-[#E7E3D8] pt-5">
            {notice.fullContent.map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Attachment Box if available */}
          {notice.hasAttachment && (
            <div className="mt-6 p-4 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-[#E7E3D8] flex items-center justify-center text-[#873A2B] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-medium text-[#203044]">
                    {notice.attachmentFileName || 'Official_Document.pdf'}
                  </div>
                  <div className="text-[11px] text-[#657080] mt-0.5">
                    Format: {notice.attachmentFileType || 'PDF'} · Size: {notice.attachmentSize || 'Official File'}
                  </div>
                </div>
              </div>

              <a
                href={notice.documentDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Attachment</span>
              </a>
            </div>
          )}

          {/* Signatory Footer */}
          <div className="mt-10 pt-6 border-t border-[#E7E3D8] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-xs text-[#657080] space-y-1">
              <div className="flex items-center gap-1.5 text-[#16745B] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Verification: {notice.meta.verificationStatus}</span>
              </div>
              <div className="text-[11px] font-mono">
                Source: {notice.meta.officialCitation}
              </div>
              <div className="text-[11px] font-mono text-[#657080]">
                Last Audit: {notice.meta.verifiedDate}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-serif font-bold text-sm text-[#203044]">
                {notice.issuer}
              </div>
              <div className="text-xs text-[#657080]">
                {notice.issuerDesignation}
              </div>
              <div className="text-[10px] font-mono text-[#873A2B] uppercase tracking-wider mt-0.5">
                MAIT, Rohini, Delhi
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-[#F7F5EF] border-t border-[#E7E3D8] flex flex-wrap items-center justify-between gap-3">
          <a
            href={notice.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#873A2B] hover:text-[#16745B] font-medium transition-colors"
          >
            <span>Open Verified Portal Source (mait.ac.in)</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#203044] text-[#203044] hover:text-white border border-[#E7E3D8] hover:border-[#203044] text-xs font-medium transition-colors"
          >
            Dismiss Circular
          </button>
        </div>
      </div>
    </div>
  );
};
