/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Academic Programs & Faculty Departments — Balanced University Typography
 */

import React, { useState } from 'react';
import { ACADEMIC_PROGRAMS, AcademicProgram } from '../data/maitData';
import { ChevronRight, X, FlaskConical } from 'lucide-react';

interface AcademicProgramsSectionProps {
  onOpenDepartments?: () => void;
  onOpenAcademics?: () => void;
}

export const AcademicProgramsSection: React.FC<AcademicProgramsSectionProps> = ({
  onOpenDepartments,
  onOpenAcademics,
}) => {
  const [filter, setFilter] = useState<'all' | 'cs-ai' | 'ece-eee' | 'management'>('all');
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram | null>(null);

  const filteredPrograms = ACADEMIC_PROGRAMS.filter((prog) => {
    if (filter === 'all') return true;
    if (filter === 'cs-ai') return ['btech-cse', 'btech-aiml', 'btech-it', 'btech-aids'].includes(prog.id);
    if (filter === 'ece-eee') return ['btech-ece', 'btech-eee', 'btech-mae'].includes(prog.id);
    if (filter === 'management') return prog.id === 'mba';
    return true;
  });

  return (
    <section id="academics" className="py-14 bg-[#F7F5EF] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E3D8] pb-5 mb-7">
          <div>
            <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider mb-1">
              Curriculum & Departments
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044]">
              Academic Programs & Disciplines
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenDepartments && (
              <button
                onClick={onOpenDepartments}
                className="px-3.5 py-1.5 bg-white hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] text-xs font-medium transition-colors shadow-2xs"
              >
                Department Directory &rarr;
              </button>
            )}
            {onOpenAcademics && (
              <button
                onClick={onOpenAcademics}
                className="px-3.5 py-1.5 bg-white hover:bg-[#16745B] text-[#203044] hover:text-white border border-[#E7E3D8] text-xs font-medium transition-colors shadow-2xs"
              >
                Syllabus & Calendars &rarr;
              </button>
            )}
          </div>
        </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E7E3D8] shadow-2xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setFilter('cs-ai')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === 'cs-ai' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Computer Science & AI
            </button>
            <button
              onClick={() => setFilter('ece-eee')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === 'ece-eee' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Electronics & Mechanical
            </button>
            <button
              onClick={() => setFilter('management')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === 'management' ? 'bg-[#873A2B] text-white font-semibold' : 'text-[#657080] hover:text-[#203044]'
              }`}
            >
              Management (MBA)
            </button>
          </div>

        {/* Academic Infrastructure Overview Banner */}
        <div className="p-5 bg-white border border-[#E7E3D8] shadow-2xs mb-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border-l-2 border-[#873A2B] pl-3.5">
            <p className="text-xs font-semibold text-[#873A2B]">Accreditation</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Tier-1 NBA Compliant</h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              Programs structured around international Washington Accord outcome-based engineering education.
            </p>
          </div>
          <div className="border-l-2 border-[#16745B] pl-3.5">
            <p className="text-xs font-semibold text-[#16745B]">Laboratory Network</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">48+ High-Tech Labs</h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              Equipped with NVIDIA GPU deep learning suites, TI IoT hardware, and Cadence EDA VLSI tools.
            </p>
          </div>
          <div className="border-l-2 border-[#B18B50] pl-3.5">
            <p className="text-xs font-semibold text-[#B18B50]">Industry Options</p>
            <h4 className="text-sm font-serif font-bold text-[#203044] mt-0.5">Minor Specializations</h4>
            <p className="text-xs text-[#657080] mt-1 leading-relaxed">
              Credit transfer avenues via NPTEL/SWAYAM in Artificial Intelligence, Cybersecurity, and Fintech.
            </p>
          </div>
        </div>

        {/* Academic Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              onClick={() => setSelectedProgram(prog)}
              className="p-4 bg-white border border-[#E7E3D8] hover:border-[#873A2B] cursor-pointer transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-[#657080]">
                  <span className="text-[#873A2B] font-semibold">{prog.degree}</span>
                  <span aria-hidden="true">·</span>
                  <span>Intake: {prog.intake}</span>
                  <span aria-hidden="true">·</span>
                  <span>Estd. {prog.established}</span>
                </div>

                <h3 className="text-sm font-serif font-bold text-[#203044] mt-2 group-hover:text-[#873A2B] transition-colors leading-snug">
                  {prog.name}
                </h3>
                <p className="text-xs text-[#657080] mt-2 line-clamp-2 leading-relaxed">{prog.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#16745B] font-medium">{prog.accreditation}</span>
                <span className="text-[#873A2B] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Program Detailed Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white border border-[#E7E3D8] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-[#203044] shadow-xl relative">
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-1.5 text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-semibold text-[#873A2B] uppercase tracking-wider">
                MAIT Department Specification · {selectedProgram.degree}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044] mt-1">{selectedProgram.name}</h2>

              {/* Clean metadata strip */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#657080] border-y border-[#E7E3D8] py-2">
                <span>Intake: {selectedProgram.intake} Seats</span>
                <span aria-hidden="true">·</span>
                <span>Duration: {selectedProgram.durationYears} Years</span>
                <span aria-hidden="true">·</span>
                <span>HOD: {selectedProgram.hod}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#16745B] font-medium">{selectedProgram.accreditation}</span>
              </div>

              <div className="mt-4 space-y-4 text-xs text-[#657080]">
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#203044]">Program Overview</h4>
                  <p className="mt-1 leading-relaxed text-sm text-[#203044]">{selectedProgram.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#203044]">Eligibility & Admission Criteria</h4>
                  <p className="mt-1 text-[#203044] leading-relaxed">{selectedProgram.eligibility}</p>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#203044]">Core Curriculum Highlights</h4>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProgram.curriculumHighlights.map((curr, idx) => (
                      <div key={idx} className="p-2.5 bg-[#F7F5EF] border border-[#E7E3D8] text-[#203044] text-xs">
                        {curr}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#203044]">Specialized Laboratories</h4>
                  <ul className="mt-2 space-y-1">
                    {selectedProgram.labs.map((lab, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[#203044]">
                        <FlaskConical className="w-3.5 h-3.5 text-[#873A2B] shrink-0" />
                        <span>{lab}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#203044]">Career Trajectories</h4>
                  <p className="mt-1 text-[#203044] leading-relaxed">{selectedProgram.careerPath}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E3D8] flex items-center justify-end">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 bg-[#F7F5EF] hover:bg-[#EFECE3] border border-[#E7E3D8] text-xs font-semibold text-[#203044] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
