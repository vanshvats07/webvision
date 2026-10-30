/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Campus Aerial & Architectural Storytelling
 * Features authentic photographs: mait-aerial-campus & Central Academic Quadrangle
 * Dignified, Balanced University Typography
 */

import React from 'react';
import { Compass, MapPin, Building2, Sun } from 'lucide-react';

export const CampusAerialStorytelling: React.FC = () => {
  return (
    <section id="campus-aerial" className="py-14 bg-[#F7F5EF] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Campus Documentation & Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              The 10.5-Acre Rohini Campus
            </h2>
          </div>
          <p className="text-xs text-[#657080] max-w-md leading-relaxed">
            Architectural photography of Maharaja Agrasen Institute of Technology. Designed with red-brick brutalist
            facades, rooftop photovoltaic solar arrays, and central academic courtyards.
          </p>
        </div>

        {/* Dual Authentic Photographic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          {/* Photo 1: Aerial Campus Overview */}
          <div className="lg:col-span-7 bg-white border border-[#E7E3D8] shadow-sm p-3 flex flex-col justify-between">
            <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden bg-[#EFECE3]">
              <img
                src="/assets/aistudio/mait-aerial-campus_4a69c182.jpeg"
                alt="Maharaja Agrasen Institute of Technology Aerial Campus Architecture and Solar Rooftops"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('mait-aerial-campus.jpeg')) {
                    target.src = '/images/mait-aerial-campus.jpeg';
                  }
                }}
              />
            </div>
            <div className="pt-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0ECE1] mt-2">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#203044]">
                  Aerial Panoramic View of MAIT Campus
                </h4>
                <p className="text-xs text-[#657080]">
                  Interconnected red-brick academic blocks with rooftop solar panels in Sector-22, Rohini.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#16745B] bg-[#EAF5F1] px-2 py-0.5 border border-[#C6E6DC] shrink-0 self-start sm:self-center">
                Aerial Perspective
              </span>
            </div>
          </div>

          {/* Photo 2: Central Academic Quadrangle Avenue */}
          <div className="lg:col-span-5 bg-white border border-[#E7E3D8] shadow-sm p-3 flex flex-col justify-between">
            <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden bg-[#EFECE3]">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-30_at_12.12.24_3506226a.jpeg"
                alt="Central Academic Quadrangle between Aryabhatta Block and Brahmagupta Block"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('mait-central-avenue.jpeg')) {
                    target.src = '/images/mait-central-avenue.jpeg';
                  }
                }}
              />
            </div>
            <div className="pt-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#F0ECE1] mt-2">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#203044]">
                  Central Academic Quadrangle
                </h4>
                <p className="text-xs text-[#657080]">
                  Avenue between Aryabhatta Block and Brahmagupta Block leading to the Central Library Rotunda.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#873A2B] bg-[#FCEBE9] px-2 py-0.5 border border-[#F6C6C2] shrink-0 self-start sm:self-center">
                Academic Avenue
              </span>
            </div>
          </div>
        </div>

        {/* Spatial Campus Pillars (Balanced Sizing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#E7E3D8] shadow-2xs">
            <p className="text-xs font-semibold text-[#873A2B]">Blocks 1 & 2</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Administration & Computing</h4>
            <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">
              Director's Secretariat, Registrar, CSE and IT computational suites with NVIDIA deep learning clusters.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E7E3D8] shadow-2xs">
            <p className="text-xs font-semibold text-[#16745B]">Blocks 3 & 4</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Hardware & Fabrication</h4>
            <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">
              Cadence VLSI suites, Texas Instruments IoT bays, and the Formula Student Team Defianz Racing workshop.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E7E3D8] shadow-2xs">
            <p className="text-xs font-semibold text-[#B18B50]">Block 8</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Dr. NK Garg Central Library</h4>
            <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">
              4-storey circular atrium housing 100,000+ volumes, IEEE digital access carrels, and book bank.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E7E3D8] shadow-2xs">
            <p className="text-xs font-semibold text-[#203044]">Block 9 & Grounds</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Auditorium & Amphitheater</h4>
            <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">
              1,200-seat convention hall, open-air Greek amphitheater, indoor badminton arena, and athletic lawns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
