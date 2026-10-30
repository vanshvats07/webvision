/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Campus Life Experience — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Trophy,
  Coffee,
  HeartPulse,
  Dumbbell,
  Compass,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { CAMPUS_FACILITIES_DATA, CampusFacilityItem } from '../data/phase4Data';
import { OFFICIAL_SOCIETIES } from '../data/officialContentRegistry';

interface CampusLifePageProps {
  onBackToHome: () => void;
  onNavigateToEvents?: () => void;
}

export const CampusLifePage: React.FC<CampusLifePageProps> = ({ onBackToHome, onNavigateToEvents }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'facilities' | 'societies'>('facilities');

  const categories = [
    'All',
    'Academic & Research',
    'Student Living',
    'Sports & Wellness',
    'Community & Culture',
  ];

  const filteredFacilities = useMemo(() => {
    if (activeCategory === 'All') return CAMPUS_FACILITIES_DATA;
    return CAMPUS_FACILITIES_DATA.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

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
                  Campus Life & Amenities
                </span>
                <span aria-hidden="true">/</span>
                <span>Facilities, Living & Societies</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Campus Life: 10.5 Acres of Vitality
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Explore the residential halls, 4-floor central library, 1,200-seat convention auditorium, sports grounds, Section-8 startup incubator, and 15+ student societies at Maharaja Agrasen Institute of Technology.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onNavigateToEvents && (
                <button
                  onClick={onNavigateToEvents}
                  className="px-3.5 py-2 text-xs font-medium text-[#16745B] hover:text-white bg-[#F7F5EF] hover:bg-[#16745B] border border-[#E7E3D8] hover:border-[#16745B] transition-colors shadow-2xs"
                >
                  Explore Campus Events & Fests
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Authentic Academic Quadrangle Showcase (User-Supplied Authentic Photo mait-central-avenue.jpeg) */}
        <div className="bg-white border border-[#E7E3D8] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden bg-[#203044]">
              <img
                src="/images/mait-central-avenue.jpeg"
                alt="MAIT Central Academic Quadrangle between Aryabhatta and Brahmagupta Blocks with the central rotunda"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-[#203044]/90 text-white text-[10px] font-mono px-2.5 py-1 backdrop-blur-xs">
                Authentic Campus Asset · Central Academic Avenue & Rotunda
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <span className="font-mono text-xs text-[#873A2B] font-semibold uppercase tracking-wider block mb-1">
                  Architectural Fabric
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044]">
                  The Central Academic Quadrangle
                </h2>
                <p className="text-xs sm:text-sm text-[#657080] mt-3 leading-relaxed">
                  MAIT's urban campus features red-brick multi-storey academic complexes flanking the central promenade leading to the iconic cylindrical library rotunda. Connected walkways, lush landscaped verges, and solar photovoltaic rooftop canopies integrate environmental sustainability with high-density academic spaces.
                </p>

                <div className="mt-4 pt-4 border-t border-[#E7E3D8] space-y-2 text-xs text-[#657080]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16745B]" />
                    <span className="text-[#203044] font-medium">Aryabhatta Block (Block 1 & 2): </span>
                    <span>Administrative offices, computing labs, and admissions hall.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16745B]" />
                    <span className="text-[#203044] font-medium">Brahmagupta Block (Block 3 & 4): </span>
                    <span>Semiconductor VLSI suites, heavy machining, and MAIIF incubator.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E3D8] text-[11px] font-mono text-[#657080]">
                Sector-22 Rohini, New Delhi - 110086 · 10.5 Urban Acres
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher: Campus Facilities vs Student Societies */}
        <div className="flex items-center gap-2 border-b border-[#E7E3D8] pb-4">
          <button
            onClick={() => setActiveSubTab('facilities')}
            className={`px-4 py-2 text-xs font-medium border transition-colors ${
              activeSubTab === 'facilities'
                ? 'bg-[#873A2B] text-white border-[#873A2B] font-semibold'
                : 'bg-white text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
            }`}
          >
            Campus Infrastructure & Facilities ({CAMPUS_FACILITIES_DATA.length})
          </button>
          <button
            onClick={() => setActiveSubTab('societies')}
            className={`px-4 py-2 text-xs font-medium border transition-colors ${
              activeSubTab === 'societies'
                ? 'bg-[#873A2B] text-white border-[#873A2B] font-semibold'
                : 'bg-white text-[#657080] hover:text-[#203044] border-[#E7E3D8]'
            }`}
          >
            Student Societies & Clubs ({OFFICIAL_SOCIETIES.length})
          </button>
        </div>

        {/* SUB-VIEW 1: CAMPUS FACILITIES */}
        {activeSubTab === 'facilities' && (
          <div className="space-y-6">
            {/* Category Filter Pills (Zero-Pill Discipline with Clean Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#16745B] text-white'
                      : 'bg-white text-[#657080] hover:text-[#203044] border border-[#E7E3D8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Facilities Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white border border-[#E7E3D8] hover:border-[#16745B] p-6 shadow-xs flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                      <span className="font-mono text-[11px] text-[#16745B] font-semibold uppercase">
                        {fac.badge || fac.category}
                      </span>
                      <span className="font-mono">{fac.extentOrCapacity}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#203044]">
                      {fac.title}
                    </h3>

                    <p className="text-xs text-[#657080] mt-2 leading-relaxed">
                      {fac.description}
                    </p>

                    {/* Architectural Specifications */}
                    <div className="mt-4 pt-3 border-t border-[#E7E3D8]/60 space-y-1.5 text-xs">
                      {fac.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[#203044]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#873A2B] mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Coordinates */}
                  <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#657080]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#873A2B]" />
                      <span className="truncate max-w-[200px]">{fac.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#16745B]" />
                      <span>{fac.timings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: STUDENT SOCIETIES */}
        {activeSubTab === 'societies' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
              <h2 className="text-lg font-serif font-bold text-[#203044] mb-1">
                Student Societies & Collegiate Chapters
              </h2>
              <p className="text-xs text-[#657080] mb-6">
                Active technical chapters, research motorsport teams, dramatics clubs, and social welfare wings operating under the MAIT Student Affairs Board.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OFFICIAL_SOCIETIES.map((soc) => (
                  <div
                    key={soc.id}
                    className="p-5 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                        <span className="font-mono text-[11px] text-[#873A2B] font-semibold uppercase">
                          {soc.category}
                        </span>
                        <span className="font-mono text-[#657080]">
                          {soc.activeMembersCount}+ Members
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#203044]">
                        {soc.name}
                      </h3>
                      <div className="text-xs text-[#16745B] font-medium italic mt-0.5">
                        "{soc.tagline}"
                      </div>

                      <p className="text-xs text-[#657080] mt-2.5 leading-relaxed">
                        {soc.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E7E3D8]/60 text-xs">
                        <span className="font-mono text-[10px] uppercase text-[#657080] block mb-1">
                          Key Annual Events:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {soc.keyEvents.map((evt, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-white border border-[#E7E3D8] px-2 py-0.5 text-[#203044]"
                            >
                              {evt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-xs text-[#657080]">
                      <span>{soc.facultyCoordinator}</span>
                      <a
                        href={soc.meta.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
                      >
                        <span>Official Society Page</span>
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
