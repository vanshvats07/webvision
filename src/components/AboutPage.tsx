/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * About MAIT — Dedicated Institutional Profile Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React from 'react';
import {
  Building2,
  Award,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { ABOUT_MAIT_DATA } from '../data/phase4Data';
import { OFFICIAL_LEADERSHIP } from '../data/officialContentRegistry';

interface AboutPageProps {
  onBackToHome: () => void;
  onNavigateToDepartments?: () => void;
  onNavigateToAdmissions?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onNavigateToDepartments,
  onNavigateToAdmissions,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-20">
      {/* Header Banner */}
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
                  About the Institute
                </span>
                <span aria-hidden="true">/</span>
                <span>History, Leadership & Vision</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                About Maharaja Agrasen Institute of Technology
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Founded in 1999 by Maharaja Agrasen Technical Education Society (MATES). Affiliated to GGSIPU (College Code 148), AICTE approved, and NBA accredited.
              </p>
            </div>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 text-xs font-medium text-[#657080] hover:text-[#203044] bg-[#F7F5EF] hover:bg-white border border-[#E7E3D8] transition-colors self-start md:self-auto"
            >
              Return to Campus 3D
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Section 1: Institutional Overview & History */}
        <div className="bg-white border border-[#E7E3D8] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs text-[#873A2B] font-semibold uppercase tracking-wider block">
                Institutional Genesis & Ethos
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044]">
                Quarter-Century of Technical Excellence
              </h2>
              <p className="text-xs sm:text-sm text-[#203044] leading-relaxed text-justify">
                {ABOUT_MAIT_DATA.overviewText}
              </p>
              <p className="text-xs sm:text-sm text-[#657080] leading-relaxed text-justify">
                Spread across 10.5 verdant acres in Rohini Sector-22, Delhi, the institute combines classical brick-facade academic quadrangles with modern computing networks, semiconductor design labs, heavy mechanical workshops, and the Section-8 Maharaja Agrasen Innovation and Incubation Foundation (MAIIF).
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#F7F5EF] border border-[#E7E3D8] p-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#657080] block mb-2">
                  Institutional Identification
                </span>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#657080] block text-[11px]">Affiliating University:</span>
                    <span className="font-medium text-[#203044]">Guru Gobind Singh Indraprastha University (GGSIPU)</span>
                  </div>
                  <div>
                    <span className="text-[#657080] block text-[11px]">University College Code:</span>
                    <span className="font-mono font-bold text-[#873A2B] text-sm">Code 148</span>
                  </div>
                  <div>
                    <span className="text-[#657080] block text-[11px]">Sponsoring Society:</span>
                    <span className="font-medium text-[#203044]">Maharaja Agrasen Technical Education Society (MATES)</span>
                  </div>
                  <div>
                    <span className="text-[#657080] block text-[11px]">Accreditation & Approvals:</span>
                    <span className="font-medium text-[#16745B]">AICTE Approved · NBA Accredited · ISO 9001:2015</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E3D8] text-[11px] font-mono text-[#657080]">
                Established 1999 · Delhi, India
              </div>
            </div>
          </div>

          {/* 4 Quantitative Achievement Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E7E3D8]">
            {ABOUT_MAIT_DATA.achievements.map((ach, idx) => (
              <div key={idx} className="p-4 bg-[#F7F5EF] border border-[#E7E3D8]">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#873A2B]">
                  {ach.metric}
                </div>
                <div className="text-xs text-[#657080] mt-1 font-medium">
                  {ach.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Vision & Mission Pillars */}
        <div className="bg-white border border-[#E7E3D8] p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl mb-6">
            <span className="font-mono text-xs text-[#16745B] font-semibold uppercase tracking-wider block mb-1">
              Guiding Charter
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#203044]">
              Institutional Vision & Mission
            </h2>
          </div>

          <div className="p-5 bg-[#F7F5EF] border-l-4 border-l-[#16745B] border-y border-r border-[#E7E3D8] mb-6">
            <div className="font-mono text-[10px] uppercase text-[#16745B] font-bold mb-1">
              Institutional Vision
            </div>
            <p className="text-base sm:text-lg font-serif font-bold text-[#203044]">
              "{ABOUT_MAIT_DATA.vision}"
            </p>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-xs text-[#657080] uppercase tracking-wider mb-2">
              Five Core Mission Pillars:
            </div>
            {ABOUT_MAIT_DATA.missionPillars.map((pillar, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-[#E7E3D8] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#16745B] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#203044] leading-relaxed">
                  {pillar}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Institutional Leadership */}
        <div className="bg-white border border-[#E7E3D8] p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-[#E7E3D8] mb-6">
            <h2 className="text-xl font-serif font-bold text-[#203044]">
              Leadership & Governing Secretariat
            </h2>
            <p className="text-xs text-[#657080] mt-0.5">
              Distinguished administrators, educationists, and academic deans steering MAIT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICIAL_LEADERSHIP.map((lead) => (
              <div
                key={lead.id}
                className="p-5 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#657080] mb-2">
                    <span className="font-mono text-[11px] text-[#873A2B] font-semibold uppercase">
                      {lead.entity}
                    </span>
                    <span className="font-mono text-[10px]">{lead.meta.verifiedDate}</span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#203044]">
                    {lead.name}
                  </h3>
                  <div className="text-xs text-[#873A2B] font-medium mt-0.5">
                    {lead.designation}
                  </div>
                  <div className="text-[11px] text-[#657080] font-mono mt-0.5">
                    {lead.qualifications}
                  </div>

                  <p className="text-xs text-[#203044] mt-3 leading-relaxed">
                    {lead.messageOrBio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E3D8] flex items-center justify-between text-[11px] text-[#657080]">
                  <span>{lead.email || 'mait@mait.ac.in'}</span>
                  <span className="font-mono">{lead.meta.verificationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: 25-Year Milestone Timeline */}
        <div className="bg-white border border-[#E7E3D8] p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-[#E7E3D8] mb-6">
            <h2 className="text-xl font-serif font-bold text-[#203044]">
              Chronicle of Institutional Milestones (1999–2026)
            </h2>
            <p className="text-xs text-[#657080] mt-0.5">
              Key historic landmarks in MAIT’s journey from foundational engineering branches to autonomous research and incubators.
            </p>
          </div>

          <div className="relative border-l-2 border-[#873A2B] ml-4 pl-6 space-y-6">
            {ABOUT_MAIT_DATA.milestones.map((milestone, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-white border-2 border-[#873A2B] rounded-full group-hover:bg-[#873A2B] transition-colors" />
                <span className="font-mono text-xs text-[#873A2B] font-bold">
                  {milestone.year}
                </span>
                <h3 className="text-base font-serif font-bold text-[#203044] mt-0.5">
                  {milestone.title}
                </h3>
                <p className="text-xs text-[#657080] mt-1 leading-relaxed max-w-2xl">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Statutory Contacts */}
        <div className="p-6 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#873A2B] font-bold mb-1">
              Official Institutional Secretariat
            </div>
            <h3 className="text-base font-serif font-bold text-[#203044]">
              Maharaja Agrasen Institute of Technology
            </h3>
            <p className="text-[#657080] mt-1">
              PSP Area, Plot No. 1, Sector-22, Rohini, New Delhi - 110086, India
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[#203044] font-mono">
              <span>EPABX: 011-27582095 / 97</span>
              <span aria-hidden="true">·</span>
              <span>Email: mait@mait.ac.in</span>
              <span aria-hidden="true">·</span>
              <span>Website: www.mait.ac.in</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToDepartments && (
              <button
                onClick={onNavigateToDepartments}
                className="px-4 py-2 bg-white hover:bg-[#873A2B] text-[#203044] hover:text-white border border-[#E7E3D8] hover:border-[#873A2B] font-semibold transition-colors"
              >
                Browse Departments
              </button>
            )}

            {onNavigateToAdmissions && (
              <button
                onClick={onNavigateToAdmissions}
                className="px-4 py-2 bg-[#873A2B] hover:bg-[#16745B] text-white font-semibold transition-colors shadow-2xs"
              >
                Admissions Information
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
