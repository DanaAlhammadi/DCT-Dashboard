import React from 'react';
import { SilaScenarioResponse } from '../../types/silaScenario';
import { DecisionSummary as IDecisionSummary } from '../../types';
import { Compass, Calendar, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  summary?: IDecisionSummary;
  silaResponse?: SilaScenarioResponse | null;
}

export const DecisionSummary: React.FC<Props> = ({ summary, silaResponse }) => {
  // Derive grounded explanations directly from actual scenario response
  const checkins = silaResponse?.additional_checkins;
  const isPos = checkins !== null && checkins !== undefined && checkins > 0;
  const period = silaResponse?.period || 'November 2025 to December 2025';
  const nationality = silaResponse?.nationality_scope || 'India';
  const warnings = silaResponse?.warnings || [];
  const assumptions = silaResponse?.assumptions || [];

  // 1. Expected Impact
  const expectedImpactText = checkins !== null && checkins !== undefined && !isNaN(checkins)
    ? `Approximately ${isPos ? '+' : ''}${Math.round(checkins).toLocaleString()} additional commercial hotel check-ins in Abu Dhabi based on ${nationality} market air connectivity changes.`
    : (summary?.expectedImpact || 'Expected impact evaluated from baseline aviation schedules.');

  // 2. Period Affected
  const periodAffectedText = `Applies across ${period}. Scenario impact is localized to these specific evaluation months without assumed compound carryover into subsequent quarters.`;

  // 3. Main Driver
  const mainDriverText = assumptions.length > 0
    ? `Primary aviation capacity intervention in ${nationality} departure connectivity converting into Abu Dhabi point-to-point hotel arrivals via empirical regression coefficients.`
    : (summary?.mainReason || `Direct flight capacity shift from origin market ${nationality} expanding available seats into AUH.`);

  // 4. Important Limitation
  let limitationText = 'Evaluation bounds are uncalibrated; model linear_v009 uses regression reference prediction. Recorded guest-days proxy is a historical ratio, not verified occupied guest nights or measured length of stay.';
  if (warnings.length > 0) {
    if (warnings.includes('guest_day_proxy_not_verified_guest_nights')) {
      limitationText = 'Guest-day proxy is an empirical historical conversion ratio, not verified guest nights. Uncertainty prediction intervals are uncalibrated.';
    } else if (warnings.includes('linear_trend_extrapolation')) {
      limitationText = 'Linear trend extrapolation applied. Country identity supplies a statistical predictor rather than verified individual passenger nationality flows.';
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-5" id="decision-summary-card">
      <div className="flex items-center justify-between border-b border-[#0A2E4D]/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0A2E4D] text-[#D4AF37] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#0A2E4D] tracking-tight">
              What this means for DCT
            </h3>
            <p className="text-xs text-[#0A2E4D]/60 font-normal">
              Decision synthesis grounded strictly in the scenario response data
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#0E6B6E] uppercase tracking-wider hidden sm:inline-block">
          Executive Decision Summary
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Expected Impact */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0A2E4D] font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0E6B6E] shrink-0" />
            <span>Expected Impact</span>
          </div>
          <p className="text-[#0A2E4D]/80 leading-relaxed text-xs font-normal">
            {expectedImpactText}
          </p>
        </div>

        {/* 2. Period Affected */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0A2E4D] font-semibold text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#0A2E4D]/70 shrink-0" />
            <span>Period Affected</span>
          </div>
          <p className="text-[#0A2E4D]/80 leading-relaxed text-xs font-normal">
            {periodAffectedText}
          </p>
        </div>

        {/* 3. Main Driver */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0A2E4D] font-semibold text-xs">
            <Zap className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Main Driver</span>
          </div>
          <p className="text-[#0A2E4D]/80 leading-relaxed text-xs font-normal">
            {mainDriverText}
          </p>
        </div>

        {/* 4. Important Limitation */}
        <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#0A2E4D] font-semibold text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
            <span>Important Limitation</span>
          </div>
          <p className="text-[#0A2E4D]/80 leading-relaxed text-xs font-normal">
            {limitationText}
          </p>
        </div>
      </div>
    </div>
  );
};
