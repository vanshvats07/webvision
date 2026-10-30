/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Campus 3D Section — Balanced University Typography
 */

import React, { useState } from 'react';
import { Campus3DViewer } from './Campus3DViewer';
import { CAMPUS_BLOCKS, CampusBlock } from '../data/maitData';

interface Campus3DSectionProps {
  onSelectBlock?: (block: CampusBlock) => void;
}

export const Campus3DSection: React.FC<Campus3DSectionProps> = ({ onSelectBlock }) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-2');

  const handleBlockSelect = (block: CampusBlock | null) => {
    if (block) {
      setSelectedBlockId(block.id);
      if (onSelectBlock) onSelectBlock(block);
    }
  };

  return (
    <section id="campus-3d" className="py-14 bg-white border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Interactive 3D Architectural Model
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Campus Spatial Explorer
            </h2>
          </div>
          <p className="text-xs text-[#657080] max-w-md leading-relaxed">
            WebGL spatial visualization of MAIT’s red-brick academic blocks, central rotunda library, courtyards, and
            connecting walkways.
          </p>
        </div>

        {/* 3D Campus Canvas Viewport */}
        <div className="w-full mb-6">
          <Campus3DViewer
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleBlockSelect}
            className="w-full h-[540px] border border-[#E7E3D8] shadow-sm"
          />
        </div>

        {/* 9-Block Architectural Navigation Strip on Pure White */}
        <div>
          <div className="flex items-center justify-between mb-2 text-xs text-[#657080]">
            <span className="font-semibold text-[#203044]">Campus Block Directory (Click to Focus Camera)</span>
            <span>9 Interconnected Blocks</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {CAMPUS_BLOCKS.map((b) => {
              const isCurrent = b.id === selectedBlockId;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBlockId(b.id);
                    handleBlockSelect(b);
                  }}
                  className={`p-2.5 text-left border transition-all text-xs ${
                    isCurrent
                      ? 'bg-[#873A2B] border-[#873A2B] text-white shadow-xs'
                      : 'bg-[#F7F5EF] border-[#E7E3D8] text-[#203044] hover:border-[#873A2B] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] font-bold ${isCurrent ? 'text-amber-200' : 'text-[#873A2B]'}`}>
                      B0{b.number}
                    </span>
                    <span className={`text-[9px] uppercase ${isCurrent ? 'text-stone-200' : 'text-[#657080]'}`}>
                      {b.category}
                    </span>
                  </div>
                  <p className="font-semibold text-[11px] truncate mt-1">{b.shortName}</p>
                  <p className={`text-[10px] mt-0.5 ${isCurrent ? 'text-stone-200' : 'text-[#657080]'}`}>
                    {b.floorCount} Floors
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
