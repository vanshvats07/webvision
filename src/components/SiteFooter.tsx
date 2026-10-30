/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Institutional Site Footer & Statutory Compliance — Bright Light Theme
 */

import React from 'react';
import { MapPin, Phone, Mail, Globe, ExternalLink, ShieldAlert } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-[#EFECE3] border-t border-[#E2DDD2] text-[#657080] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Institute Brand & Identity */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/mait-logo.png"
                alt="Maharaja Agrasen Institute of Technology logo"
                className="w-8 h-9 object-contain shrink-0"
              />
              <div>
                <h4 className="text-sm font-serif font-bold text-[#203044] tracking-wider">
                  MAHARAJA AGRASEN INSTITUTE OF TECHNOLOGY
                </h4>
                <p className="text-[10px] font-mono text-[#657080] uppercase">
                  ESTABLISHED 1999 BY MATES · GGSIPU CODE 148
                </p>
              </div>
            </div>

            <p className="text-xs text-[#657080] leading-relaxed max-w-sm">
              Approved by AICTE and affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi. Dedicated
              to technical excellence, ethical leadership, and impactful research.
            </p>

            <div className="mt-4 space-y-1.5 font-mono text-[11px] text-[#203044]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#873A2B] shrink-0 mt-0.5" />
                <span>PSP Area, Plot No. 1, Sector-22, Rohini, Delhi - 110086</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#16745B] shrink-0" />
                <span>+91-11-27582095, 27582097</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B18B50] shrink-0" />
                <span>mait@mait.ac.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Departments */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#203044] mb-3 font-bold">
              ACADEMIC WINGS
            </h5>
            <ul className="space-y-2 text-[#657080]">
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Computer Science (CSE)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Artificial Intelligence (AI&ML)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Information Technology (IT)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  AI & Data Science (AI&DS)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Electronics & Comm (ECE)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Electrical & Electronics (EEE)
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  Mechanical & Automation
                </a>
              </li>
              <li>
                <a href="#academics" className="hover:text-[#873A2B] transition-colors">
                  School of Management (MBA)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory & Institutional Disclosures */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#203044] mb-3 font-bold">
              MANDATORY DISCLOSURES
            </h5>
            <ul className="space-y-2 text-[#657080]">
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  AICTE Mandatory Disclosure
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  NIRF Engineering Data
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  NBA Accreditation Status
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  Anti-Ragging Committee
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  Internal Complaints Committee (ICC)
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  SC/ST Grievance Redressal
                </a>
              </li>
              <li>
                <a href="https://mait.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors">
                  Right to Information (RTI)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Affiliation */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#203044] mb-3 font-bold">
              STUDENT PORTALS
            </h5>
            <ul className="space-y-2 text-[#657080]">
              <li>
                <a href="https://ipu.ac.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors flex items-center gap-1">
                  <span>GGSIPU Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#657080]" />
                </a>
              </li>
              <li>
                <a href="https://ipu.admissions.nic.in" target="_blank" rel="noreferrer" className="hover:text-[#873A2B] transition-colors flex items-center gap-1">
                  <span>IPU Admissions 2026</span>
                  <ExternalLink className="w-3 h-3 text-[#657080]" />
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-[#873A2B] transition-colors">
                  End-Term Datesheets
                </a>
              </li>
              <li>
                <a href="#campus-3d" className="hover:text-[#873A2B] transition-colors">
                  3D Campus Block Map
                </a>
              </li>
              <li>
                <a href="#campus-aerial" className="hover:text-[#873A2B] transition-colors">
                  Campus Aerial Story
                </a>
              </li>
              <li>
                <a href="#placements" className="hover:text-[#873A2B] transition-colors">
                  Training & Placement Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Anti-Ragging Helpline Banner + Copyright */}
        <div className="mt-12 pt-8 border-t border-[#E2DDD2] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#203044]">
            <span className="text-[#873A2B] font-bold uppercase font-mono">Toll Free Anti-Ragging:</span>
            <span className="font-mono">1800-180-5522</span>
            <span className="text-[#D0CAC0]">|</span>
            <span className="font-mono">Women Helpline: 1091</span>
          </div>

          <p className="text-xs text-[#657080] font-mono text-center md:text-right">
            © {new Date().getFullYear()} Maharaja Agrasen Institute of Technology. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
