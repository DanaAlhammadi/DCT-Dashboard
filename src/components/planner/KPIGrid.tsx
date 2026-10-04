import React from 'react';
import { SilaScenarioResponse } from '../../types/silaScenario';
import { RouteInfo, ScenarioResult } from '../../types/dashboard';
import { ArrowUpRight, ArrowDownRight, Layers, ShieldCheck, AlertTriangle, Info, Calendar, Globe, Sparkles } from 'lucide-react';

interface Props {
  // Support both backend SilaScenarioResponse and local ScenarioResult
  silaResponse?: SilaScenarioResponse | null;
  result?: ScenarioResult | null;
  route?: RouteInfo;
  onOpenTechnicalDrawer?: () => void;
}

/**
 * Format number helper strictly preserving null values:
 * Never converts null to zero.
 */
function formatNumber(val: number | null | undefined, maximumFractionDigits: number = 0): string {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Unavailable';
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(val);
}

function formatDifference(val: number | null | undefined): { text: string; isPositive: boolean; isUnavailable: boolean } {
  if (val === null || val === undefined || isNaN(val)) {
    return { text: 'Unavailable', isPositive: true, isUnavailable: true };
  }
  const prefix = val > 0 ? '+' : '';
  return {
    text: `${prefix}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(val))}`,
    isPositive: val >= 0,
    isUnavailable: false,
  };
}

export const KPIGrid: React.FC<Props> = ({
  silaResponse,
  result,
  route,
  onOpenTechnicalDrawer,
}) => {
  // Extract values prioritizing official backend response
  const baselineCheckins = silaResponse?.baseline_checkins ?? result?.hotelGuests.baseline ?? null;
  const scenarioCheckins = silaResponse?.scenario_checkins ?? result?.hotelGuests.scenario ?? null;
  const additionalCheckins = silaResponse?.additional_checkins ?? result?.hotelGuests.diff ?? null;

  const supportStatus = silaResponse?.support_status || result?.supportLevel || 'supported_with_limitations';
  const period = silaResponse?.period || (result ? `${result.input.startMonth} to ${result.input.endMonth}` : '2025-11 to 2025-12');
  const nationalityScope = silaResponse?.nationality_scope || route?.modelledSourceMarket || 'INDIA';
  const modelVersion = silaResponse?.model_version || 'linear_v009';
  const conversionVersion = silaResponse?.conversion_version || 'conversion_v002';

  const diffFormatted = formatDifference(additionalCheckins);
  const roundedDiff = additionalCheckins !== null && !isNaN(additionalCheckins)
    ? Math.round(additionalCheckins)
    : null;

  // Support badge text & styling
  const getSupportDisplay = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('supported_with_limitations') || s === 'supported' || s.includes('range')) {
      return {
        label: 'Supported with Limitations',
        pillClass: 'bg-[#0E6B6E]/10 text-[#0E6B6E] border-[#0E6B6E]/20',
        dotClass: 'bg-[#0E6B6E]',
        desc: 'Evaluated against linear regression benchmark with calibrated reference slopes.',
      };
    }
    if (s.includes('limited') || s.includes('reference_only')) {
      return {
        label: 'Limited Support',
        pillClass: 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20',
        dotClass: 'bg-[#B45309]',
        desc: 'Limited support because the selected market has no matching departure-country passenger variation.',
      };
    }
    return {
      label: 'Proxy Estimate',
      pillClass: 'bg-[#0A2E4D]/10 text-[#0A2E4D] border-[#0A2E4D]/20',
      dotClass: 'bg-[#0A2E4D]',
      desc: 'Exploratory route; projected via market analogues and empirical ratios.',
    };
  };

  const supportInfo = getSupportDisplay(supportStatus);

  // Guest-Days Proxy handling
  let guestDaysBaseline: number | null = null;
  let guestDaysScenario: number | null = null;
  let guestDaysDiff: number | null = null;

  if (silaResponse?.recorded_guest_days_proxy) {
    if (typeof silaResponse.recorded_guest_days_proxy === 'object') {
      guestDaysBaseline = silaResponse.recorded_guest_days_proxy.baseline ?? null;
      guestDaysScenario = silaResponse.recorded_guest_days_proxy.scenario ?? null;
      guestDaysDiff = silaResponse.recorded_guest_days_proxy.change ?? null;
    } else {
      guestDaysDiff = Number(silaResponse.recorded_guest_days_proxy);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_4px_24px_-6px_rgba(10,46,77,0.06)] space-y-6" id="kpi-hero-result-card">
      {/* Top micro-meta row */}
      <div className="flex items-center justify-between text-xs text-[#0A2E4D]/60 border-b border-[#0A2E4D]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0A2E4D] text-[#D4AF37] font-semibold text-xs flex items-center justify-center">
            3
          </span>
          <span className="text-[11px] font-semibold text-[#0A2E4D] uppercase tracking-wider">
            STEP 3 — See the impact
          </span>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${supportInfo.pillClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${supportInfo.dotClass}`} />
          <span>{supportInfo.label}</span>
        </div>
      </div>

      {/* Hero Dominant Primary Result */}
      <div className="space-y-2 text-center sm:text-left py-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <div className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#0A2E4D] font-display">
            {diffFormatted.isUnavailable ? (
              <span className="text-stone-400">Unavailable</span>
            ) : (
              <span>{diffFormatted.text}</span>
            )}
          </div>

          {!diffFormatted.isUnavailable && (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span
                className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-lg ${
                  diffFormatted.isPositive ? 'bg-[#0E6B6E]/10 text-[#0E6B6E]' : 'bg-[#991B1B]/10 text-[#991B1B]'
                }`}
              >
                {diffFormatted.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {diffFormatted.text}
              </span>
              <span className="text-xs text-[#0A2E4D]/60 font-medium">net check-ins</span>
            </div>
          )}
        </div>

        {/* Required Prominent Sentence: “Approximately X additional hotel check-ins” */}
        <h3 className="text-lg sm:text-2xl font-semibold text-[#0A2E4D] tracking-tight">
          {roundedDiff !== null ? (
            <span>Approximately <strong>{roundedDiff >= 0 ? `+${roundedDiff.toLocaleString()}` : roundedDiff.toLocaleString()}</strong> additional hotel check-ins</span>
          ) : (
            <span>Additional hotel check-ins unavailable</span>
          )}
        </h3>
        <p className="text-xs text-[#0A2E4D]/70 font-normal leading-relaxed">
          Predicted change in commercial hotel arrivals in Abu Dhabi produced by linear_v009 regression model.
        </p>
      </div>

      {/* Four Primary Results Grid: BASELINE, SCENARIO, ADDITIONAL CHECK-INS, SUPPORT */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* 1. BASELINE */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 space-y-1">
          <div className="text-[10px] text-[#0A2E4D]/60 font-semibold uppercase tracking-wider">
            BASELINE
          </div>
          <div className="text-lg sm:text-xl font-semibold text-[#0A2E4D] font-mono">
            {formatNumber(baselineCheckins)}
          </div>
          <div className="text-[10px] text-[#0A2E4D]/50">hotel check-ins</div>
        </div>

        {/* 2. SCENARIO */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 space-y-1">
          <div className="text-[10px] text-[#0A2E4D]/60 font-semibold uppercase tracking-wider">
            SCENARIO
          </div>
          <div className="text-lg sm:text-xl font-semibold text-[#0A2E4D] font-mono">
            {formatNumber(scenarioCheckins)}
          </div>
          <div className="text-[10px] text-[#0A2E4D]/50">hotel check-ins</div>
        </div>

        {/* 3. ADDITIONAL CHECK-INS */}
        <div className="p-4 rounded-2xl bg-[#0E6B6E]/10 border border-[#0E6B6E]/20 space-y-1">
          <div className="text-[10px] text-[#0E6B6E] font-semibold uppercase tracking-wider">
            ADDITIONAL CHECK-INS
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#0E6B6E] font-mono">
            {diffFormatted.text}
          </div>
          <div className="text-[10px] text-[#0E6B6E]/80 font-medium">
            net impact
          </div>
        </div>

        {/* 4. SUPPORT */}
        <div className="p-4 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 space-y-1">
          <div className="text-[10px] text-[#0A2E4D]/60 font-semibold uppercase tracking-wider">
            SUPPORT
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] truncate" title={supportInfo.label}>
            {supportInfo.label}
          </div>
          <div className="text-[10px] text-[#0A2E4D]/50 truncate" title={supportInfo.desc}>
            {supportInfo.desc}
          </div>
        </div>
      </div>

      {/* Separate Measure: Recorded Guest-Days Proxy (NEVER call it verified guest nights) */}
      <div className="p-4 rounded-2xl bg-[#F4F1EA]/50 border border-[#0A2E4D]/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <h4 className="text-xs font-semibold text-[#0A2E4D]">
              Recorded Guest-Days Proxy
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#0A2E4D]/10 text-[#0A2E4D]/70 font-medium">
            Separate Analytical Measure
          </span>
        </div>

        <p className="text-[11px] text-[#0A2E4D]/70 font-normal leading-relaxed">
          Historical ratio conversion metric. <strong>Note:</strong> This is a recorded guest-day proxy derived from hotel registration records, <em>not</em> verified occupied guest nights or measured length of stay.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#0A2E4D]/10 text-center text-xs">
          <div>
            <span className="text-[10px] text-[#0A2E4D]/50 font-medium">Baseline Proxy</span>
            <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] font-mono mt-0.5">
              {formatNumber(guestDaysBaseline)}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#0A2E4D]/50 font-medium">Scenario Proxy</span>
            <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] font-mono mt-0.5">
              {formatNumber(guestDaysScenario)}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#0E6B6E] font-medium">Net Proxy Change</span>
            <div className="text-xs sm:text-sm font-bold text-[#0E6B6E] font-mono mt-0.5">
              {formatDifference(guestDaysDiff).text}
            </div>
          </div>
        </div>
      </div>

      {/* Uncertainty Bounds / Prediction Interval Notice */}
      <div className="flex items-center justify-between text-xs text-[#0A2E4D]/60 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#0A2E4D]/50 shrink-0" />
          <span className="text-[11px]">Prediction Bounds:</span>
        </div>
        <span className="text-[11px] font-medium text-[#0A2E4D]/70">
          Prediction interval not available (uncertainty bounds are not calibrated)
        </span>
      </div>

      {/* Required Metadata Scope Badges */}
      <div className="pt-3 border-t border-[#0A2E4D]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#0A2E4D]/70">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#0A2E4D]/50">Period:</span>
            <span className="font-semibold text-[#0A2E4D] bg-[#F4F1EA] px-2 py-0.5 rounded text-[11px]">{period}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#0A2E4D]/50">Nationality scope:</span>
            <span className="font-semibold text-[#0A2E4D] bg-[#F4F1EA] px-2 py-0.5 rounded text-[11px]">{nationalityScope}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#0A2E4D]/50">Model version:</span>
            <span className="font-mono font-semibold text-[#0E6B6E] bg-[#0E6B6E]/10 px-2 py-0.5 rounded text-[11px]">{modelVersion}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#0A2E4D]/50">Conversion version:</span>
            <span className="font-mono font-semibold text-[#0A2E4D] bg-[#F4F1EA] px-2 py-0.5 rounded text-[11px]">{conversionVersion}</span>
          </div>
        </div>

        {onOpenTechnicalDrawer && (
          <button
            type="button"
            onClick={onOpenTechnicalDrawer}
            className="text-xs text-[#0E6B6E] hover:underline font-medium cursor-pointer"
          >
            Technical audit &amp; formula →
          </button>
        )}
      </div>
    </div>
  );
};
