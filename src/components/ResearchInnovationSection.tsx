/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Research, Innovation & Central Library — Balanced University Typography
 */

import React from 'react';
import { RESEARCH_HIGHLIGHTS } from '../data/maitData';
import { BookOpen, Award } from 'lucide-react';

export const ResearchInnovationSection: React.FC = () => {
  return (
    <section id="research" className="py-14 bg-white border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Research & Intellectual Property
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Innovation & Library Ecosystem
            </h2>
          </div>
          <p className="text-xs text-[#657080] max-w-md leading-relaxed">
            140+ patents filed, DST-funded government grants, MSME startup incubation, and international IEEE journals.
          </p>
        </div>

        {/* 2-Column Split: Central Library Monograph + Research Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          {/* Dr. Nand Kishore Garg Central Library Architectural Monograph Card */}
          <div className="lg:col-span-5 bg-[#F7F5EF] border border-[#E7E3D8] p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#873A2B]">
                <BookOpen className="w-4 h-4 text-[#873A2B]" />
                <span>Block 08 · Intellectual Core</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#203044] mt-2">
                Dr. Nand Kishore Garg Central Library
              </h3>
              <p className="text-xs sm:text-sm text-[#657080] mt-2 leading-relaxed">
                A 4-storey central academic repository housing over 100,000 volumes of textbooks, research monographs,
                and digital subscriptions to IEEE Xplore, ACM Digital Library, and Springer journals.
              </p>

              {/* Library Pillar Metrics */}
              <div className="mt-5 space-y-2.5 text-xs text-[#203044]">
                <div className="p-2.5 bg-white border border-[#E7E3D8] flex items-center justify-between">
                  <span className="text-[#657080]">Printed Volumes</span>
                  <span className="font-bold text-[#873A2B] tabular-nums">100,000+ Textbooks</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E7E3D8] flex items-center justify-between">
                  <span className="text-[#657080]">Digital Subscriptions</span>
                  <span className="font-bold text-[#16745B]">IEEE, ACM, Springer</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E7E3D8] flex items-center justify-between">
                  <span className="text-[#657080]">Book Bank Facility</span>
                  <span className="font-bold text-[#203044]">100% Student Coverage</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2DDD2] text-xs text-[#657080] flex items-center justify-between">
              <span>DELNET Network Connected</span>
              <span>8:00 AM – 8:00 PM</span>
            </div>
          </div>

          {/* Research & Patents Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESEARCH_HIGHLIGHTS.map((res) => (
                <div key={res.id} className="p-4 bg-white border border-[#E7E3D8] shadow-2xs hover:border-[#873A2B] transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#873A2B] font-semibold bg-[#FCEBE9] px-2 py-0.5 border border-[#F6C6C2]">
                        {res.type}
                      </span>
                      <span className="text-[#657080] font-medium">{res.year}</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-[#203044] mt-2 leading-snug">{res.title}</h4>
                    <p className="text-xs text-[#657080] mt-1">{res.investigator}</p>
                    <p className="text-xs text-[#16745B] mt-0.5">{res.department}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] text-xs text-[#203044]">
                    <span className="text-[#873A2B] font-semibold">Outcome:</span> {res.outcome}
                  </div>
                </div>
              ))}
            </div>

            {/* Institutional Research Pillars Strip on Warm Ivory */}
            <div className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-2xs">
              <div>
                <p className="text-xs font-semibold text-[#873A2B]">MSME Business Incubator</p>
                <p className="text-[#657080] mt-1 leading-relaxed">Host institute for seed venture grants and prototyping labs.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#16745B]">Center of Excellence</p>
                <p className="text-[#657080] mt-1 leading-relaxed">Advanced IoT, Embedded Systems & Autonomous Robotics.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#B18B50]">Hackathon Laurels</p>
                <p className="text-[#657080] mt-1 leading-relaxed">Smart India Hackathon winners and international ACM ICPC finalists.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
