import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck, Info } from 'lucide-react';

interface Props {
  supportStatus?: string;
  warnings?: string[];
  assumptions?: string[];
}

// Plain-language translation dictionary for backend warnings
const PLAIN_WARNING_TRANSLATIONS: Record<string, string> = {
  guest_day_proxy_not_verified_guest_nights:
    'Recorded guest-day proxy is derived from historical hotel reporting ratios, not verified occupied guest nights or measured length of stay.',
  historical_ratio_not_measured_length_of_stay:
    'Stay duration reflects historical conversion proxies rather than actual guest check-out logs.',
  linear_trend_extrapolation:
    'Model extrapolates linear historical trends. Extreme volume swings may exhibit diminishing marginal returns.',
  other_nationality_zero_changes_are_model_structure_not_verified_no_effect:
    'Changes in other nationalities are held constant due to single-market model structure, not evidence of zero cross-market impact.',
  pax_above_seats:
    'High seasonal passenger traffic; ratio evaluated within historical observation envelope.',
  seasonal_benchmark_outperformed_reference_model_in_final_evaluation:
    'Seasonal benchmark demonstrated strong baseline predictability during final holdout evaluation.',
  weekly_frequency_aggregation_pending:
    'Frequency adjustments are aggregated into monthly capacity using estimated aircraft seat sizes.',
};

export const WarningsPanel: React.FC<Props> = ({
  supportStatus = 'supported_with_limitations',
  warnings = [],
  assumptions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Translate warnings to human-friendly explanations
  const friendlyWarnings = warnings.map((w) => PLAIN_WARNING_TRANSLATIONS[w] || w);

  // Core trust notices
  const isLimited = supportStatus.toLowerCase().includes('limited') || supportStatus.toLowerCase().includes('reference');

  return (
    <div className="p-5 rounded-3xl bg-white border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-4" id="planning-warnings-panel">
      <div className="flex items-center justify-between border-b border-[#0A2E4D]/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 text-[#B45309] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#0A2E4D]">
              Model Trust &amp; Governance Disclosures
            </h4>
            <p className="text-[11px] text-[#0A2E4D]/60 font-normal">
              Limitations and assumptions evaluated by the SILA governance framework
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F1EA] text-[#0A2E4D]/70 font-semibold border border-[#0A2E4D]/10">
          linear_v009
        </span>
      </div>

      {/* Primary Plain-Language Trust Points */}
      <div className="space-y-2 text-xs">
        {isLimited && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              “Limited support because the selected market has no matching departure-country passenger variation.”
            </span>
          </div>
        )}

        <div className="p-3 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 text-[#0A2E4D]/80 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0E6B6E] shrink-0 mt-0.5" />
          <span className="leading-relaxed font-normal">
            “Prediction interval not available because uncertainty bounds are not calibrated.”
          </span>
        </div>

        {friendlyWarnings.slice(0, 2).map((w, idx) => (
          <div key={idx} className="p-3 rounded-2xl bg-[#F4F1EA]/40 border border-[#0A2E4D]/10 text-[#0A2E4D]/75 flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B6E] mt-1.5 shrink-0" />
            <span className="leading-relaxed font-normal">{w}</span>
          </div>
        ))}
      </div>

      {/* Expand/Collapse for all backend notes & assumptions */}
      {(friendlyWarnings.length > 2 || assumptions.length > 0) && (
        <div className="pt-2 border-t border-[#0A2E4D]/10">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#0E6B6E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Hide detailed disclosures' : `View all model assumptions (${friendlyWarnings.length + assumptions.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 text-xs text-[#0A2E4D]/80 animate-in fade-in duration-150">
              {friendlyWarnings.slice(2).map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#0A2E4D]/10 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{w}</span>
                </div>
              ))}

              {assumptions.map((a, idx) => (
                <div key={`assump-${idx}`} className="p-2.5 rounded-xl bg-white border border-[#0A2E4D]/10 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A2E4D]/40 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-[#0A2E4D]/75">{a}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
