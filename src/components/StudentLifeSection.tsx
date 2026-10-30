/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Student Life, Societies & Annual Fest — Balanced University Typography
 */

import React, { useState } from 'react';
import { STUDENT_SOCIETIES, StudentSociety } from '../data/maitData';

export const StudentLifeSection: React.FC = () => {
  const [filterCat, setFilterCat] = useState<'all' | 'Technical' | 'Cultural'>('all');

  const filteredSocieties = STUDENT_SOCIETIES.filter((soc) => {
    if (filterCat === 'all') return true;
    return soc.category === filterCat;
  });

  return (
    <section id="student-life" className="py-14 bg-[#F7F5EF] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Student Life & Chapters
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Campus Societies & Cultural Traditions
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-[#E7E3D8] shadow-2xs">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCat === 'all' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              All Chapters
            </button>
            <button
              onClick={() => setFilterCat('Technical')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCat === 'Technical' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Technical (IEEE/ACM/Defianz)
            </button>
            <button
              onClick={() => setFilterCat('Cultural')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCat === 'Cultural' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Cultural & Dramatics
            </button>
          </div>
        </div>

        {/* Hero Fest Marquee: TechSurge & Mridang */}
        <div className="bg-white border border-[#E7E3D8] p-6 sm:p-7 mb-8 shadow-2xs">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase bg-[#873A2B] text-white px-2.5 py-0.5 font-semibold">
                Annual Techno-Cultural Festival
              </span>
              <span className="text-xs text-[#16745B] font-medium">Estd. 2004</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] mt-2">
              TechSurge & Mridang 2026
            </h3>
            <p className="text-xs sm:text-sm text-[#657080] mt-2 leading-relaxed">
              Delhi NCR’s prominent collegiate festival bringing together 15,000+ students from 80+ universities across
              India. Featuring 48-hour hackathons, Formula Student racecar demonstrations by Team Defianz, national street
              theatre championships, and musical evenings at the open-air campus amphitheater.
            </p>

            <div className="mt-5 pt-4 border-t border-[#F0ECE1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[#657080]">Prize Pool</p>
                <p className="text-base font-serif font-bold text-[#873A2B] tabular-nums mt-0.5">₹10,00,000+</p>
              </div>
              <div>
                <p className="text-[#657080]">Contests</p>
                <p className="text-base font-serif font-bold text-[#203044] tabular-nums mt-0.5">80+ Events</p>
              </div>
              <div>
                <p className="text-[#657080]">Footfall</p>
                <p className="text-base font-serif font-bold text-[#16745B] tabular-nums mt-0.5">15,000+ Students</p>
              </div>
              <div>
                <p className="text-[#657080]">Venue</p>
                <p className="text-base font-serif font-bold text-[#203044] mt-0.5">Block 9 & Amphitheater</p>
              </div>
            </div>
          </div>
        </div>

        {/* Societies Grid on Pure White */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSocieties.map((soc) => (
            <div
              key={soc.id}
              className="p-4 bg-white border border-[#E7E3D8] hover:border-[#873A2B] transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#873A2B] font-semibold bg-[#FCEBE9] px-2 py-0.5 border border-[#F6C6C2]">
                    {soc.category}
                  </span>
                  <span className="text-[#657080]">{soc.membersCount}+ Members</span>
                </div>
                <h4 className="text-base font-serif font-bold text-[#203044] mt-2">{soc.name}</h4>
                <p className="text-xs italic font-serif text-[#873A2B] mt-0.5">"{soc.tagline}"</p>
                <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">{soc.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0ECE1]">
                <p className="text-[11px] text-[#657080] font-semibold">Initiatives</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {soc.keyEvents.map((ev, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#F7F5EF] border border-[#E7E3D8] text-xs text-[#203044]"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
