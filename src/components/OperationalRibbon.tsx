/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Operational Utility Ribbon — Bright Light Theme
 */

import React from 'react';
import { Bell, MapPin, Phone, ExternalLink } from 'lucide-react';
import { OFFICIAL_NOTICES, OfficialNotice } from '../data/maitData';

interface OperationalRibbonProps {
  onSelectNotice: (notice: OfficialNotice) => void;
}

export const OperationalRibbon: React.FC<OperationalRibbonProps> = ({ onSelectNotice }) => {
  const latestNotice = OFFICIAL_NOTICES[0];

  return (
    <div className="bg-[#EFECE3] border-b border-[#E2DDD2] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Notice Dispatch Ticker */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#873A2B] text-white font-mono text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
            <Bell className="w-3 h-3 text-white" />
            <span>OFFICIAL CIRCULAR</span>
          </div>
          <button
            onClick={() => onSelectNotice(latestNotice)}
            className="text-[#203044] hover:text-[#873A2B] text-left truncate transition-colors font-medium flex items-center gap-2"
          >
            <span className="truncate">{latestNotice.title}</span>
            <span className="text-[10px] font-mono text-[#657080] shrink-0 hidden lg:inline">
              [{latestNotice.refNo}]
            </span>
          </button>
        </div>

        {/* Operational Coordinates & Helplines */}
        <div className="flex items-center gap-4 text-[#657080] font-mono text-[11px] shrink-0">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#873A2B]" />
            <span className="text-[#203044]">Rohini Sec-22, Delhi</span>
          </div>
          <span className="text-[#D0CAC0]">|</span>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#16745B]" />
            <a href="tel:+911127582095" className="hover:text-[#873A2B] transition-colors text-[#203044]">
              011-27582095
            </a>
          </div>
          <span className="text-[#D0CAC0] hidden sm:inline">|</span>
          <a
            href="https://ipu.ac.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#873A2B] transition-colors hidden sm:flex items-center gap-1 text-[#203044] font-medium"
          >
            <span>GGSIPU Affiliated</span>
            <ExternalLink className="w-3 h-3 text-[#657080]" />
          </a>
        </div>
      </div>
    </div>
  );
};
