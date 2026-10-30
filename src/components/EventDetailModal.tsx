/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Event Detail Modal
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Share2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { CampusEventItem } from '../types/phase3';

interface EventDetailModalProps {
  event: CampusEventItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white border border-[#E7E3D8] shadow-2xl overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#F7F5EF] border-b border-[#E7E3D8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16745B]" />
            <span className="text-xs font-mono font-medium tracking-wider text-[#657080] uppercase">
              MAIT Campus Event · {event.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(event.id)}
              className={`p-1.5 transition-colors text-xs flex items-center gap-1 border ${
                isBookmarked
                  ? 'bg-[#873A2B] text-white border-[#873A2B]'
                  : 'bg-white text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark event'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-[11px] font-sans hidden sm:inline">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
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

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto font-sans bg-white">
          {/* Top Banner / Event Poster Badge */}
          <div className="p-4 sm:p-5 bg-[#F7F5EF] border-l-4 border-l-[#873A2B] border-y border-r border-[#E7E3D8] mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#657080] mb-1.5">
              <span className="font-mono text-[#873A2B] font-semibold uppercase">
                {event.posterBadgeText || event.category}
              </span>
              <span className="font-mono">Status: {event.status}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#203044] leading-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#657080] mt-1.5 font-medium">
              {event.shortTagline}
            </p>
          </div>

          {/* Quick Metrics Bar (Zero-Pill Discipline) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white border border-[#E7E3D8] text-xs mb-6">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#873A2B] shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Dates & Schedule
                </span>
                <span className="font-medium text-[#203044]">{event.displayDate}</span>
                <div className="text-[11px] text-[#657080]">{event.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#16745B] shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Campus Venue
                </span>
                <span className="font-medium text-[#203044]">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-[#B18B50] shrink-0 mt-0.5" />
              <div>
                <span className="block font-mono text-[10px] text-[#657080] uppercase">
                  Organizer Body
                </span>
                <span className="font-medium text-[#203044]">{event.organizer}</span>
                <div className="text-[11px] text-[#657080]">({event.organizingBodyType})</div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-4">
            <h2 className="text-sm font-serif font-bold text-[#203044] uppercase tracking-wider">
              About the Event
            </h2>
            <p className="text-xs sm:text-sm text-[#203044] leading-relaxed text-justify">
              {event.description}
            </p>
          </div>

          {/* Event Specifics: Eligibility, Prizes, Coordinators */}
          <div className="mt-6 pt-5 border-t border-[#E7E3D8] space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-[#F7F5EF] border border-[#E7E3D8]">
                <span className="block font-mono text-[10px] text-[#657080] uppercase mb-1">
                  Participant Eligibility
                </span>
                <p className="text-xs text-[#203044] leading-relaxed">
                  {event.eligibility}
                </p>
              </div>

              <div className="p-3 bg-[#F7F5EF] border border-[#E7E3D8]">
                <span className="block font-mono text-[10px] text-[#657080] uppercase mb-1">
                  Prizes & Recognition
                </span>
                <p className="text-xs text-[#203044] leading-relaxed font-medium">
                  {event.prizesOrCertificates || 'Official University Participation Certificates'}
                </p>
              </div>
            </div>

            {/* Coordinators */}
            <div className="p-3 bg-white border border-[#E7E3D8] text-xs">
              <div className="text-[10px] font-mono uppercase text-[#657080] mb-1">
                Faculty & Student Organizing Council
              </div>
              <div className="text-[#203044]">
                <span className="font-medium">Faculty Lead: </span>
                <span>{event.facultyCoordinator}</span>
              </div>
              <div className="text-[#657080] mt-1">
                <span className="font-medium text-[#203044]">Student Leads: </span>
                <span>{event.studentCoordinators.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* External Registration Protocol Notice */}
          <div className="mt-6 p-4 bg-[#F7F5EF] border border-[#E7E3D8] text-xs text-[#657080]">
            <div className="flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-[#16745B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#203044]">Official Registration Protocol: </span>
                <span>
                  Registrations for MAIT competitions and hackathons are administered via verified official portals (such as Unstop, Devpost, or institutional Google Forms). Clicking "Proceed to Registration" opens the authentic external form directly.
                </span>
              </div>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="mt-6 pt-4 border-t border-[#E7E3D8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-[#657080]">
            <div className="flex items-center gap-1.5 text-[#16745B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Institutional Record: {event.meta.verificationStatus}</span>
            </div>
            <div className="font-mono">
              Citation: {event.meta.officialCitation}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-[#F7F5EF] border-t border-[#E7E3D8] flex flex-wrap items-center justify-between gap-3">
          <a
            href={event.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#873A2B] hover:text-[#16745B] font-medium transition-colors"
          >
            <span>View Society Gazette on mait.ac.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#203044] text-[#203044] hover:text-white border border-[#E7E3D8] text-xs font-medium transition-colors"
            >
              Close
            </button>

            {event.status === 'Upcoming' && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <span>Proceed to Official Registration</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
