/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Training & Placement Cell (T&P) Showcase — Balanced University Typography
 */

import React, { useState } from 'react';
import { PLACEMENT_STATS, RECRUITERS_LIST, RecruiterHighlight } from '../data/maitData';

interface PlacementShowcaseProps {
  onOpenFullPlacementPortal?: () => void;
}

export const PlacementShowcase: React.FC<PlacementShowcaseProps> = ({ onOpenFullPlacementPortal }) => {
  const [filterTier, setFilterTier] = useState<'all' | 'Super Dream' | 'Dream' | 'Core'>('all');

  const filteredRecruiters = RECRUITERS_LIST.filter((rec) => {
    if (filterTier === 'all') return true;
    return rec.tier === filterTier;
  });

  return (
    <section id="placements" className="py-14 bg-white border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Corporate Relations & Career Records
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Training & Placement Records
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-[#657080] max-w-md hidden lg:block leading-relaxed">
              Consistently leading Delhi NCR engineering colleges with offers from global product engineering and fintech enterprises.
            </p>
            {onOpenFullPlacementPortal && (
              <button
                onClick={onOpenFullPlacementPortal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-semibold transition-colors shrink-0 shadow-2xs"
              >
                <span>Enter Placement Portal</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Quantitative Rigor Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PLACEMENT_STATS.map((stat, idx) => (
            <div key={idx} className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] shadow-2xs">
              <span className="text-xs text-[#657080] font-medium">
                {stat.metric}
              </span>
              <p className="text-2xl font-serif font-bold text-[#873A2B] mt-1 tabular-nums">{stat.value}</p>
              <p className="text-xs text-[#657080] mt-1 leading-relaxed">{stat.context}</p>
            </div>
          ))}
        </div>

        {/* Recruiter Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
          <div className="text-xs text-[#203044] font-semibold">
            Visiting Industry Partners & Recruiters
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F7F5EF] border border-[#E7E3D8]">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                filterTier === 'all' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              All Recruiters
            </button>
            <button
              onClick={() => setFilterTier('Super Dream')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                filterTier === 'Super Dream' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Super Dream (20+ LPA)
            </button>
            <button
              onClick={() => setFilterTier('Dream')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                filterTier === 'Dream' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Dream (12-20 LPA)
            </button>
            <button
              onClick={() => setFilterTier('Core')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                filterTier === 'Core' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Mass & Core
            </button>
          </div>
        </div>

        {/* Recruiters Matrix on Pure White */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredRecruiters.map((rec, i) => (
            <div
              key={i}
              className="p-3.5 bg-white border border-[#E7E3D8] hover:border-[#873A2B] transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#203044] font-bold">{rec.name}</span>
                  <span className="text-[10px] text-[#16745B] font-semibold bg-[#EAF5F1] px-1.5 py-0.5 border border-[#C6E6DC]">
                    {rec.tier}
                  </span>
                </div>
                {rec.highestOfferLPA && (
                  <p className="text-xs text-[#657080] mt-1">
                    Highest: <span className="font-bold text-[#873A2B] tabular-nums">₹{rec.highestOfferLPA} LPA</span>
                  </p>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#F0ECE1]">
                <p className="text-[10px] text-[#657080] font-medium">Profiles</p>
                <p className="text-xs text-[#203044] truncate mt-0.5">{rec.roles.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placement Preparation Roadmap Box on Warm Ivory */}
        <div className="mt-7 p-5 bg-[#F7F5EF] border border-[#E7E3D8] grid grid-cols-1 md:grid-cols-3 gap-5 shadow-2xs">
          <div>
            <h4 className="text-xs font-semibold text-[#873A2B]">
              Competitive Coding Bootcamps
            </h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              Semester-round problem-solving drills with ACM MAIT covering algorithms, system design, and distributed
              computing.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#873A2B]">
              Industry Mock Interview Panels
            </h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              1-on-1 technical and behavioral panel simulations in Block 6 with MAIT alumni at FAANG and global firms.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#873A2B]">
              Central Placement Suite
            </h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              Automation portal managing student resumes, interview scheduling, coding rounds, and selection offers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
