/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Campus Events Preview Section for Homepage
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { CAMPUS_EVENTS_DATA } from '../data/phase3Data';
import { CampusEventItem } from '../types/phase3';

interface EventsPreviewSectionProps {
  onExploreAllEvents: () => void;
  onSelectEvent: (event: CampusEventItem) => void;
}

export const EventsPreviewSection: React.FC<EventsPreviewSectionProps> = ({
  onExploreAllEvents,
  onSelectEvent,
}) => {
  // Show 3 flagship upcoming events
  const upcomingEvents = CAMPUS_EVENTS_DATA.filter((e) => e.status === 'Upcoming').slice(0, 3);

  return (
    <section id="campus-events" className="py-14 bg-[#F7F5EF] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#16745B] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Campus Life & Innovation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Upcoming Campus Events & Fests
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-[#657080] max-w-md hidden lg:block leading-relaxed">
              Flagship national hackathons, annual cultural celebrations, Scopus conferences, and automotive rollouts.
            </p>
            <button
              onClick={onExploreAllEvents}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#16745B] text-[#203044] hover:text-white border border-[#E7E3D8] hover:border-[#16745B] text-xs font-semibold transition-colors shrink-0 shadow-2xs"
            >
              <span>Explore All Events & Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Upcoming Flagship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white border border-[#E7E3D8] hover:border-[#16745B] p-5 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Category & Status (Zero-Pill Discipline) */}
                <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                  <span className="font-mono text-[11px] text-[#16745B] font-semibold uppercase">
                    {evt.posterBadgeText || evt.category}
                  </span>
                  <span className="font-mono text-[11px] text-[#657080]">
                    {evt.displayDate}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectEvent(evt)}
                  className="text-base font-serif font-bold text-[#203044] group-hover:text-[#16745B] cursor-pointer transition-colors leading-snug"
                >
                  {evt.title}
                </h3>

                <p className="text-xs text-[#657080] mt-2 line-clamp-2 leading-relaxed">
                  {evt.shortTagline}
                </p>

                {/* Venue & Organizer */}
                <div className="mt-4 pt-3 border-t border-[#E7E3D8]/60 space-y-1.5 text-xs text-[#657080]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#16745B] shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#657080] shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectEvent(evt)}
                  className="text-[#873A2B] hover:text-[#16745B] font-medium transition-colors"
                >
                  View Details
                </button>

                <a
                  href={evt.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16745B] hover:bg-[#873A2B] text-white font-medium transition-colors text-xs"
                >
                  <span>Register</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA to Full Platform */}
        <div className="mt-6 p-4 bg-white border border-[#E7E3D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[#657080]">
            <span className="font-semibold text-[#203044]">Looking for Society Activities or Past Fests? </span>
            <span>Browse calendar timeline, club archives, and past competitions.</span>
          </div>

          <button
            onClick={onExploreAllEvents}
            className="inline-flex items-center gap-1.5 text-[#16745B] hover:text-[#873A2B] font-semibold text-xs transition-colors shrink-0"
          >
            <span>Open Dedicated Events Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
