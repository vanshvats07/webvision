/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Campus Events Platform — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Bookmark,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  ChevronRight,
  Eye,
  LayoutGrid,
  CalendarDays,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { CAMPUS_EVENTS_DATA } from '../data/phase3Data';
import { CampusEventItem, EventCategory } from '../types/phase3';
import { EventDetailModal } from './EventDetailModal';

interface EventsPlatformPageProps {
  onBackToHome: () => void;
}

export const EventsPlatformPage: React.FC<EventsPlatformPageProps> = ({ onBackToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [statusTab, setStatusTab] = useState<'All' | 'Upcoming' | 'Past'>('Upcoming');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeEventForModal, setActiveEventForModal] = useState<CampusEventItem | null>(null);

  // Bookmarked event IDs
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mait_event_bookmarks');
      return saved ? JSON.parse(saved) : ['evt-techsurge-mridang-2027', 'evt-hackmait-2026'];
    } catch {
      return ['evt-techsurge-mridang-2027', 'evt-hackmait-2026'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mait_event_bookmarks', JSON.stringify(bookmarkedEventIds));
    } catch (e) {
      console.warn('Could not persist event bookmarks', e);
    }
  }, [bookmarkedEventIds]);

  const toggleEventBookmark = (id: string) => {
    setBookmarkedEventIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Technical',
    'Cultural',
    'Hackathon',
    'Workshops',
    'Seminars',
    'Competitions',
    'Club Activities',
  ];

  // Filtering
  const filteredEvents = useMemo(() => {
    return CAMPUS_EVENTS_DATA.filter((evt) => {
      // Status filter
      if (statusTab !== 'All' && evt.status !== statusTab) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedEventIds.includes(evt.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesOrganizer = evt.organizer.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesOrganizer) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Upcoming: ascending by date; Past: descending by date
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return statusTab === 'Past' ? dateB - dateA : dateA - dateB;
    });
  }, [statusTab, selectedCategory, showBookmarksOnly, bookmarkedEventIds, searchQuery]);

  // Calendar events grouped by month
  const calendarMonths = useMemo(() => {
    const map = new Map<string, CampusEventItem[]>();
    filteredEvents.forEach((evt) => {
      const date = new Date(evt.startDate);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!map.has(monthYear)) {
        map.set(monthYear, []);
      }
      map.get(monthYear)!.push(evt);
    });
    return Array.from(map.entries());
  }, [filteredEvents]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusTab('Upcoming');
    setShowBookmarksOnly(false);
  };

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
                  Campus Events Platform
                </span>
                <span aria-hidden="true">/</span>
                <span>Fests, Hackathons & Seminars</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Events at MAIT: Intellectual & Cultural Life
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Explore TechSurge & Mridang, HackMAIT, Scopus conferences, racing vehicle rollouts, and collegiate competitions hosted across the Rohini campus.
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
                <span>Saved Events ({bookmarkedEventIds.length})</span>
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
        {/* Filter and Control Bar */}
        <div className="bg-white border border-[#E7E3D8] p-4 sm:p-6 mb-6 shadow-xs">
          {/* Row 1: Search + Status Toggle + View Toggle */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pb-4 border-b border-[#E7E3D8]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#657080] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, society, topic, or venue..."
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
              {/* Upcoming vs Past Toggle */}
              <div className="flex items-center border border-[#E7E3D8] bg-[#F7F5EF] p-1">
                <button
                  onClick={() => setStatusTab('Upcoming')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusTab === 'Upcoming'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  Upcoming ({CAMPUS_EVENTS_DATA.filter((e) => e.status === 'Upcoming').length})
                </button>
                <button
                  onClick={() => setStatusTab('Past')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusTab === 'Past'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  Past Archive ({CAMPUS_EVENTS_DATA.filter((e) => e.status === 'Past').length})
                </button>
                <button
                  onClick={() => setStatusTab('All')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusTab === 'All'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  All
                </button>
              </div>

              {/* View Mode Toggle: Grid vs Calendar */}
              <div className="flex items-center border border-[#E7E3D8] bg-[#F7F5EF] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white text-[#203044] shadow-xs'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                  title="Calendar Timeline View"
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
              </div>

              {/* Reset */}
              {(searchQuery || selectedCategory !== 'All' || showBookmarksOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-[#873A2B] hover:bg-[#F7F5EF] border border-[#E7E3D8] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Segmented Filters */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#657080]">
                Event Track:
              </span>
              <span className="text-[11px] text-[#657080]">
                Showing {filteredEvents.length} events
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#16745B] text-white'
                      : 'bg-[#F7F5EF] text-[#657080] hover:text-[#203044] hover:bg-[#EAE6DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section: Grid View vs Calendar View */}
        {filteredEvents.length > 0 ? (
          viewMode === 'grid' ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isBookmarked = bookmarkedEventIds.includes(event.id);

                return (
                  <article
                    key={event.id}
                    className="bg-white border border-[#E7E3D8] hover:border-[#873A2B] flex flex-col justify-between transition-all duration-200 shadow-xs group"
                  >
                    <div>
                      {/* Top Header Row with Poster Badge (Zero-Pill Discipline) */}
                      <div className="p-5 pb-3 border-b border-[#E7E3D8]/60 bg-[#F7F5EF]/40">
                        <div className="flex items-center justify-between gap-2 text-xs text-[#657080] mb-2">
                          <span className="font-mono text-[11px] text-[#873A2B] font-semibold uppercase">
                            {event.posterBadgeText || event.category}
                          </span>
                          <button
                            onClick={() => toggleEventBookmark(event.id)}
                            className={`p-1 transition-colors border ${
                              isBookmarked
                                ? 'bg-[#873A2B] text-white border-[#873A2B]'
                                : 'bg-white text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
                            }`}
                            title={isBookmarked ? 'Bookmarked' : 'Bookmark event'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <h2
                          onClick={() => setActiveEventForModal(event)}
                          className="text-base font-serif font-bold text-[#203044] group-hover:text-[#873A2B] cursor-pointer transition-colors leading-snug"
                        >
                          {event.title}
                        </h2>

                        <p className="text-xs text-[#657080] mt-1.5 line-clamp-2">
                          {event.shortTagline}
                        </p>
                      </div>

                      {/* Event Key Coordinates */}
                      <div className="p-5 space-y-2.5 text-xs text-[#657080]">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#873A2B] shrink-0" />
                          <span className="font-medium text-[#203044]">{event.displayDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#657080] shrink-0" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#16745B] shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#B18B50] shrink-0" />
                          <span className="truncate">{event.organizer}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 border-t border-[#E7E3D8] bg-[#F7F5EF]/30 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => setActiveEventForModal(event)}
                        className="inline-flex items-center gap-1.5 text-[#873A2B] hover:text-[#16745B] font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {event.status === 'Upcoming' ? (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white font-medium transition-colors shadow-xs"
                        >
                          <span>Register</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-mono text-[#657080]">
                          Concluded
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Monthly Calendar Timeline View */
            <div className="space-y-8">
              {calendarMonths.map(([monthYear, eventsInMonth]) => (
                <div key={monthYear} className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E7E3D8]">
                    <CalendarIcon className="w-4 h-4 text-[#873A2B]" />
                    <h2 className="text-base font-serif font-bold text-[#203044] uppercase tracking-wider">
                      {monthYear}
                    </h2>
                    <span className="text-xs text-[#657080]">
                      ({eventsInMonth.length} scheduled events)
                    </span>
                  </div>

                  <div className="divide-y divide-[#E7E3D8]">
                    {eventsInMonth.map((evt) => (
                      <div
                        key={evt.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 text-center shrink-0 p-2 bg-[#F7F5EF] border border-[#E7E3D8]">
                            <span className="block text-[10px] font-mono text-[#873A2B] uppercase">
                              {new Date(evt.startDate).toLocaleString('default', { month: 'short' })}
                            </span>
                            <span className="block text-lg font-serif font-bold text-[#203044]">
                              {new Date(evt.startDate).getDate()}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-xs text-[#657080] mb-1">
                              <span className="font-mono text-[#873A2B] font-semibold">
                                {evt.category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{evt.organizer}</span>
                            </div>

                            <h3
                              onClick={() => setActiveEventForModal(evt)}
                              className="text-base font-serif font-bold text-[#203044] hover:text-[#873A2B] cursor-pointer transition-colors"
                            >
                              {evt.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#657080] mt-1">
                              <span>{evt.venue}</span>
                              <span aria-hidden="true">·</span>
                              <span>{evt.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                          <button
                            onClick={() => setActiveEventForModal(evt)}
                            className="px-3 py-1.5 bg-[#F7F5EF] hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] text-xs font-medium transition-colors"
                          >
                            Details
                          </button>

                          {evt.status === 'Upcoming' && (
                            <a
                              href={evt.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors"
                            >
                              <span>Register</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty Search State */
          <div className="bg-white border border-[#E7E3D8] p-12 text-center my-6">
            <CalendarIcon className="w-10 h-10 text-[#657080] mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-[#203044]">
              No Campus Events Match Your Search
            </h3>
            <p className="text-xs sm:text-sm text-[#657080] max-w-md mx-auto mt-1">
              No scheduled festivals, hackathons, or workshops match the selected track. Try clearing your filters or switching to the archive.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Verification Footer Note */}
        <div className="mt-8 p-4 bg-white border border-[#E7E3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#657080]">
          <div>
            <span className="font-semibold text-[#203044]">Event Verification: </span>
            <span>
              All student festivals, competitions, and conferences are sanctioned by the Cultural & Technical Affairs Board at MAIT. External registrations are conducted directly on authorized host portals.
            </span>
          </div>
          <a
            href="https://mait.ac.in/index.php/student-corner/events"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
          >
            <span>MAIT Student Corner</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailModal
        event={activeEventForModal}
        isOpen={!!activeEventForModal}
        onClose={() => setActiveEventForModal(null)}
        isBookmarked={activeEventForModal ? bookmarkedEventIds.includes(activeEventForModal.id) : false}
        onToggleBookmark={toggleEventBookmark}
      />
    </div>
  );
};
