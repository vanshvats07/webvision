/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Admissions 2026 Gateway & Cutoff Estimator Modal — Bright Light Theme
 */

import React, { useState } from 'react';
import { ADMISSION_CUTOFFS } from '../data/maitData';
import { X, CheckCircle, AlertCircle, Calculator, ExternalLink, FileCheck } from 'lucide-react';

interface AdmissionsEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionsEstimatorModal: React.FC<AdmissionsEstimatorModalProps> = ({ isOpen, onClose }) => {
  const [region, setRegion] = useState<'delhi' | 'outside'>('delhi');
  const [userRank, setUserRank] = useState<string>('45000');

  if (!isOpen) return null;

  const numericRank = parseInt(userRank, 10) || 0;

  const getEligibilityStatus = (branchCode: string) => {
    if (numericRank <= 0) return { status: 'unknown', text: 'Enter Rank' };

    const cutoffs: Record<string, { delhi: number; outside: number }> = {
      CSE: { delhi: 46000, outside: 24000 },
      'CSE-2': { delhi: 58000, outside: 32000 },
      'AI&ML': { delhi: 64000, outside: 36000 },
      IT: { delhi: 72000, outside: 39000 },
      'AI&DS': { delhi: 79000, outside: 45000 },
      ECE: { delhi: 120000, outside: 62000 },
      EEE: { delhi: 190000, outside: 95000 },
      MAE: { delhi: 280000, outside: 145000 },
    };

    const maxRank = region === 'delhi' ? cutoffs[branchCode]?.delhi : cutoffs[branchCode]?.outside;
    if (!maxRank) return { status: 'neutral', text: 'Evaluation Pending' };

    if (numericRank <= maxRank * 0.9) {
      return { status: 'high', text: 'High Probability (Rounds 1-2)' };
    } else if (numericRank <= maxRank * 1.05) {
      return { status: 'moderate', text: 'Likely in Round 3 / Sliding' };
    } else if (numericRank <= maxRank * 1.25) {
      return { status: 'spot', text: 'Possible in Spot Round' };
    } else {
      return { status: 'low', text: 'Reach / Low Probability' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E7E3D8] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-[#203044] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-xs font-mono text-[#873A2B] uppercase tracking-widest font-bold">
          MAIT ADMISSIONS ADVISORY 2026 · GGSIPU CODE 148
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#203044] mt-1">
          JEE Main & CET Cutoff Predictor
        </h2>
        <p className="text-xs text-[#657080] mt-1.5 leading-relaxed">
          Estimate branch admission likelihood across MAIT B.Tech disciplines based on past multi-year GGSIPU
          centralized counseling closing ranks.
        </p>

        {/* Input Controls */}
        <div className="mt-6 p-4 bg-[#F7F5EF] border border-[#E7E3D8] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#203044] uppercase tracking-wider mb-1.5 font-bold">
              YOUR CANDIDATE QUOTA
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRegion('delhi')}
                className={`py-2 text-xs font-medium border text-center transition-colors ${
                  region === 'delhi'
                    ? 'bg-[#873A2B] text-white border-[#873A2B] font-semibold'
                    : 'bg-white text-[#657080] border-[#E7E3D8] hover:text-[#203044]'
                }`}
              >
                Delhi Region (85%)
              </button>
              <button
                onClick={() => setRegion('outside')}
                className={`py-2 text-xs font-medium border text-center transition-colors ${
                  region === 'outside'
                    ? 'bg-[#873A2B] text-white border-[#873A2B] font-semibold'
                    : 'bg-white text-[#657080] border-[#E7E3D8] hover:text-[#203044]'
                }`}
              >
                Outside Delhi (15%)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#203044] uppercase tracking-wider mb-1.5 font-bold">
              YOUR JEE MAIN / IPU CET ALL INDIA CRL RANK
            </label>
            <input
              type="number"
              value={userRank}
              onChange={(e) => setUserRank(e.target.value)}
              placeholder="e.g. 45000"
              className="w-full bg-white border border-[#E7E3D8] px-3 py-2 text-sm text-[#203044] font-mono focus:outline-none focus:border-[#873A2B] shadow-2xs"
            />
          </div>
        </div>

        {/* Branch Prediction Results Table */}
        <div className="mt-6">
          <div className="text-xs font-mono uppercase text-[#657080] mb-2 flex items-center justify-between font-semibold">
            <span>BRANCH-WISE PREDICTED PROBABILITY</span>
            <span>RANK: {numericRank.toLocaleString()} · {region === 'delhi' ? 'DELHI QUOTA' : 'OUTSIDE DELHI'}</span>
          </div>

          <div className="bg-white border border-[#E7E3D8] divide-y divide-[#F0ECE1] shadow-2xs">
            {ADMISSION_CUTOFFS.map((cutoff, i) => {
              const res = getEligibilityStatus(cutoff.ggsipuCode);
              return (
                <div key={i} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-[#203044]">{cutoff.branch}</span>
                      <span className="text-[10px] font-mono text-[#657080]">[{cutoff.ggsipuCode}]</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#657080] mt-0.5">
                      Expected Band: {region === 'delhi' ? cutoff.homeStateRank : cutoff.outsideDelhiRank} · Intake:{' '}
                      {cutoff.intake}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-xs font-mono px-2.5 py-1 border inline-block ${
                        res.status === 'high'
                          ? 'bg-[#EAF5F1] border-[#C6E6DC] text-[#16745B] font-bold'
                          : res.status === 'moderate'
                          ? 'bg-[#FBF4E8] border-[#F2DEBF] text-[#B18B50] font-bold'
                          : res.status === 'spot'
                          ? 'bg-[#EBF3FA] border-[#C8DFEE] text-[#205284] font-medium'
                          : 'bg-[#F7F5EF] border-[#E7E3D8] text-[#657080]'
                      }`}
                    >
                      {res.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Essential Documents Checklist on Warm Ivory */}
        <div className="mt-6 p-4 bg-[#F7F5EF] border border-[#E7E3D8] text-xs text-[#203044]">
          <div className="font-mono text-[#873A2B] uppercase text-[11px] tracking-wider mb-2 font-bold">
            REPORTING DOCUMENT CHECKLIST (BLOCK 1 AUDITORIUM)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#657080]">
            <div>✓ JEE Main / IPU CET Scorecard & Admit Card</div>
            <div>✓ Class 10th & 12th Original Marksheets + Passing Certificates</div>
            <div>✓ GGSIPU Provisional Seat Allotment Letter</div>
            <div>✓ Part Academic Fee Receipt (Paid to GGSIPU)</div>
            <div>✓ Medical Certificate (Appendix 6)</div>
            <div>✓ Category / Defense / PwD Certificate (if applicable)</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#E7E3D8] flex items-center justify-between flex-wrap gap-3">
          <a
            href="https://ipu.admissions.nic.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#873A2B] hover:text-[#702f23] flex items-center gap-1.5 font-mono font-medium"
          >
            <span>Go to Official GGSIPU Counseling Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F7F5EF] hover:bg-[#EFECE3] border border-[#E7E3D8] text-xs font-semibold text-[#203044] transition-colors"
          >
            Close Gateway
          </button>
        </div>
      </div>
    </div>
  );
};
