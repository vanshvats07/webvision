/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Homepage Hero — Featuring Original Entrance Photograph mait-main-gate
 * Institutional University Scale — No Vibe-Coded Text Inflation
 */

import React from 'react';
import { Compass, BookOpen, ArrowRight, ShieldCheck, MapPin, Award } from 'lucide-react';

interface HeroSectionProps {
  onExplore3D: () => void;
  onOpenAdmissions: () => void;
  onViewPrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore3D,
  onOpenAdmissions,
  onViewPrograms,
}) => {
  return (
    <section id="campus-hero" className="relative bg-[#F7F5EF] border-b border-[#E7E3D8] pt-6 pb-12 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Curatorial Accreditation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#657080] mb-5 font-sans">
          <span className="text-[#873A2B] font-semibold">Established 1999 by MATES</span>
          <span aria-hidden="true" className="text-[#D0CAC0]">·</span>
          <span className="text-[#203044] font-medium">GGSIPU Affiliated (Code 148)</span>
          <span aria-hidden="true" className="text-[#D0CAC0]">·</span>
          <span className="text-[#16745B] font-medium">NBA Accredited (Tier 1)</span>
          <span aria-hidden="true" className="text-[#D0CAC0]">·</span>
          <span>AICTE Approved</span>
        </div>

        {/* Primary Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Authoritative Editorial Presentation */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#203044] leading-snug tracking-tight">
                Maharaja Agrasen Institute of Technology
              </h1>
              <p className="mt-2 text-base sm:text-lg font-serif text-[#873A2B] leading-snug">
                Beyond Boundaries — Engineering, Research & Leadership
              </p>
              <p className="mt-3 text-sm text-[#657080] leading-relaxed">
                Founded by the Maharaja Agrasen Technical Education Society (MATES), MAIT is an acclaimed engineering
                and management institution in Delhi NCR, distinguished by its 10.5-acre campus, premier faculty,
                high-tier recruitments, and innovative laboratories.
              </p>
            </div>

            {/* Clear Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAdmissions}
                className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#873A2B] hover:bg-[#702f23] text-white shadow-xs transition-colors"
              >
                Admissions 2026 Cutoffs
              </button>

              <button
                onClick={onViewPrograms}
                className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold bg-white hover:bg-[#F0ECE1] text-[#203044] border border-[#E7E3D8] shadow-xs transition-colors"
              >
                Degree Programs
              </button>

              <button
                onClick={onExplore3D}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#873A2B] hover:text-[#702f23] transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Campus Model</span>
              </button>
            </div>

            {/* Well-Proportioned Institutional Metrics */}
            <div className="mt-8 pt-5 border-t border-[#E7E3D8] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[11px] text-[#657080] font-sans">Highest CTC</p>
                <p className="text-xl font-serif font-bold text-[#873A2B] tabular-nums mt-0.5">₹51.25 LPA</p>
                <p className="text-[11px] text-[#657080]">Atlassian / Google</p>
              </div>
              <div>
                <p className="text-[11px] text-[#657080] font-sans">Annual Offers</p>
                <p className="text-xl font-serif font-bold text-[#203044] tabular-nums mt-0.5">1,240+</p>
                <p className="text-[11px] text-[#657080]">160+ Recruiters</p>
              </div>
              <div>
                <p className="text-[11px] text-[#657080] font-sans">Patents Filed</p>
                <p className="text-xl font-serif font-bold text-[#16745B] tabular-nums mt-0.5">140+</p>
                <p className="text-[11px] text-[#657080]">Tech Innovations</p>
              </div>
              <div>
                <p className="text-[11px] text-[#657080] font-sans">Campus Area</p>
                <p className="text-xl font-serif font-bold text-[#B18B50] tabular-nums mt-0.5">10.5 Acres</p>
                <p className="text-[11px] text-[#657080]">Rohini, Delhi</p>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Real Main Gate Photograph */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E7E3D8] shadow-md p-2.5">
              <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden bg-[#EFECE3]">
                <img
                  src="/assets/aistudio/mait-main-gate_7a80405d.jpeg"
                  alt="Maharaja Agrasen Institute of Technology Main Entrance and Campus Fountain"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('mait-main-gate.jpeg')) {
                      target.src = '/images/mait-main-gate.jpeg';
                    }
                  }}
                />
              </div>

              {/* Dignified University Photo Caption */}
              <div className="px-3 py-2.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0ECE1]">
                <div>
                  <p className="text-xs font-serif font-semibold text-[#203044]">
                    Main Entrance Portal & Campus Fountain
                  </p>
                  <p className="text-[11px] text-[#657080]">
                    Maharaja Agrasen Institute of Technology · Sector-22, Rohini, New Delhi
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans font-semibold text-[#16745B] bg-[#EAF5F1] px-2 py-0.5 border border-[#C6E6DC]">
                    Official Campus Photograph
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
