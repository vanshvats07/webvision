/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Admissions Information Centre — Dedicated Page
 * Light Theme: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { ADMISSIONS_PROGRAMS_MATRIX, COUNSELING_PROCEDURE_STEPS } from '../data/phase4Data';

interface AdmissionsPageProps {
  onBackToHome: () => void;
  onOpenCutoffEstimator?: () => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ onBackToHome, onOpenCutoffEstimator }) => {
  const [selectedDegree, setSelectedDegree] = useState<'All' | 'B.Tech' | 'MBA'>('All');

  const filteredPrograms = ADMISSIONS_PROGRAMS_MATRIX.filter((prog) => {
    if (selectedDegree === 'B.Tech') return prog.programName.includes('B.Tech');
    if (selectedDegree === 'MBA') return prog.programName.includes('MBA');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-20">
      {/* Page Header */}
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
                  Admission Centre 2026–27
                </span>
                <span aria-hidden="true">/</span>
                <span>Programs & Counseling</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#203044] tracking-tight">
                Admissions Centre 2026–2027
              </h1>
              <p className="text-xs sm:text-sm text-[#657080] max-w-2xl mt-1">
                Official guidelines, approved intake seat matrix, verified annual fee structure, document verification checklist, and centralized GGSIPU counseling protocols (Code 148).
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onOpenCutoffEstimator && (
                <button
                  onClick={onOpenCutoffEstimator}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#873A2B] hover:bg-[#702f23] transition-colors shadow-2xs shrink-0"
                >
                  Launch Cutoff Calculator
                </button>
              )}

              <button
                onClick={onBackToHome}
                className="px-3.5 py-2 text-xs font-medium text-[#657080] hover:text-[#203044] bg-[#F7F5EF] hover:bg-white border border-[#E7E3D8] transition-colors"
              >
                Return to Campus 3D
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* Mandatory Transparency Notice Box */}
        <div className="p-4 sm:p-5 bg-white border-l-4 border-l-[#873A2B] border-y border-r border-[#E7E3D8] shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#873A2B] shrink-0 mt-0.5" />
            <div className="text-xs text-[#203044] space-y-1">
              <span className="font-bold text-sm">
                Mandatory Statutory Notice on Admissions:
              </span>
              <p className="leading-relaxed text-[#657080]">
                All admissions to B.Tech and MBA programs at Maharaja Agrasen Institute of Technology are administered solely through the centralized online counseling conducted by Guru Gobind Singh Indraprastha University (GGSIPU). This digital platform does not host independent application forms; all candidates must register directly on the authorized university counseling portal.
              </p>
              <div className="pt-2">
                <a
                  href="https://ipu.admissions.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#873A2B] hover:text-[#16745B] font-semibold"
                >
                  <span>Go to Official GGSIPU Counseling Portal (ipu.admissions.nic.in)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Programs Offered & Approved Seat Matrix */}
        <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E3D8] mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#203044]">
                Approved Programs, Approved Intakes & Annual Fees
              </h2>
              <p className="text-xs text-[#657080] mt-0.5">
                AICTE and GGSIPU sanctioned seat capacities and verified annual tuition fee structures.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 border border-[#E7E3D8]">
              {(['All', 'B.Tech', 'MBA'] as const).map((deg) => (
                <button
                  key={deg}
                  onClick={() => setSelectedDegree(deg)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedDegree === deg
                      ? 'bg-white text-[#203044] shadow-xs font-semibold'
                      : 'text-[#657080] hover:text-[#203044]'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F5EF] border-b border-[#E7E3D8] text-[#657080] font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">Program & Discipline</th>
                  <th className="py-3 px-4">Intake Seats</th>
                  <th className="py-3 px-4">Annual Fee (INR)</th>
                  <th className="py-3 px-4">Eligibility Norms</th>
                  <th className="py-3 px-4">Counseling Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3D8]">
                {filteredPrograms.map((prog, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F5EF]/50 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-[#203044]">
                      {prog.programName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#873A2B]">
                      {prog.intake} Seats
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#203044]">
                      ₹{prog.annualFeeINR.toLocaleString()}/yr
                    </td>
                    <td className="py-3.5 px-4 text-[#657080] max-w-xs leading-relaxed">
                      {prog.eligibility}
                    </td>
                    <td className="py-3.5 px-4 text-[#16745B] font-mono font-medium">
                      {prog.admissionChannel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hostel Fee Footnote */}
          <div className="mt-6 pt-4 border-t border-[#E7E3D8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#657080]">
            <div>
              <span className="font-semibold text-[#203044]">On-Campus Boys Hostel: </span>
              <span>Non-AC: ₹1,81,000–₹2,02,000/yr · AC: ₹2,15,000–₹2,70,000/yr (inclusive of meals).</span>
            </div>
            <a
              href="https://mait.ac.in/images/admissions/MAIT_Fee_Structure_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-[#873A2B] hover:text-[#16745B] font-medium flex items-center gap-1"
            >
              <span>Download Official Fee Notice</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Section 2: Step-by-Step Counseling Walkthrough */}
        <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
          <div className="pb-4 border-b border-[#E7E3D8] mb-6">
            <h2 className="text-lg font-serif font-bold text-[#203044]">
              Step-by-Step Centralized Counseling Walkthrough
            </h2>
            <p className="text-xs text-[#657080] mt-0.5">
              Protocol for seat allotment under Delhi (85%) and Outside Delhi (15%) regional quotas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COUNSELING_PROCEDURE_STEPS.map((step) => (
              <div key={step.stepNumber} className="p-4 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 bg-[#873A2B] text-white flex items-center justify-center font-mono font-bold text-xs mb-3">
                    0{step.stepNumber}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#203044] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#657080] leading-relaxed">
                    {step.actionText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Physical Document Verification Checklist */}
        <div className="bg-white border border-[#E7E3D8] p-6 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-[#203044] mb-1">
            Mandatory Documents for Physical Verification
          </h2>
          <p className="text-xs text-[#657080] mb-4">
            Candidates reporting in person at Block 1 must carry original certificates plus 2 sets of self-attested photocopies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              '1. GGSIPU Provisional Seat Allotment Letter & Registration Slip',
              '2. JEE Main 2026 Admit Card and Official NTA Scorecard (CRL Rank)',
              '3. 10th Class Marksheet & Passing Certificate (Date of Birth proof)',
              '4. 12th Class Marksheet & Passing Certificate with minimum 55% in PCM',
              '5. Medical Certificate of Fitness signed by Registered Medical Practitioner (Appendix 6)',
              '6. Character Certificate from the head of the institution last attended',
              '7. Category Certificate (SC/ST/OBC/Defence/PWD) if applicable under Delhi/All India quota',
              '8. Demand Draft for remaining Balance Academic Institute Fee in favour of "MAIT"',
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-[#F7F5EF] border border-[#E7E3D8] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16745B] shrink-0" />
                <span className="text-[#203044] font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Admissions Helpdesk & Coordinates */}
        <div className="p-6 bg-[#F7F5EF] border border-[#E7E3D8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#873A2B] font-bold mb-1">
              Central Admissions Advisory Board
            </div>
            <h3 className="text-base font-serif font-bold text-[#203044]">
              Campus Admissions Helpdesk
            </h3>
            <p className="text-xs text-[#657080] mt-1">
              Office of Dean (Academics), Block 1 Auditorium Lobby, MAIT, Sector-22, Rohini, New Delhi - 110086
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#203044]">
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#16745B]" />
                <span>+91-11-27582095 / 97</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#873A2B]" />
                <span>admissions@mait.ac.in</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <a
              href="https://mait.ac.in/images/admissions/Admissions_Brochure_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#873A2B] hover:bg-[#16745B] text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Admissions Brochure (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
