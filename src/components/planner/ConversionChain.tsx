import React, { useState } from 'react';
import { ConversionStage, ScenarioResult } from '../../types';
import { SilaScenarioResponse } from '../../types/silaScenario';
import { Layers, Users, Compass, Building2, ChevronDown, ChevronUp, ArrowDown, Info } from 'lucide-react';

interface Props {
  stages?: ConversionStage[];
  result?: ScenarioResult | null;
  silaResponse?: SilaScenarioResponse | null;
}

export const ConversionChain: React.FC<Props> = ({ stages = [], result, silaResponse }) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Derive estimated numbers for the 4 steps
  const totalSeats = result?.totalSeats.scenario ?? 25000;
  const totalPax = result?.totalPax.scenario ?? Math.round(totalSeats * 0.82);
  const p2pPax = result?.totalP2P.scenario ?? Math.round(totalPax * 0.45);
  const checkins = silaResponse?.scenario_checkins ?? result?.hotelGuests.scenario ?? 38298;

  const steps = [
    {
      id: 'scheduled_seats',
      stepNum: 1,
      title: 'Scheduled seats',
      value: totalSeats,
      unit: 'seats / mo',
      icon: Layers,
      plainExplanation: 'The total commercial aircraft seats planned and published by airlines operating flights into Abu Dhabi (AUH).',
      technicalDetail: 'Monthly total seat capacity calculated from schedule filings across all active flight legs on the selected route.',
    },
    {
      id: 'passengers',
      stepNum: 2,
      title: 'Passengers',
      value: totalPax,
      unit: 'passengers / mo',
      icon: Users,
      plainExplanation: 'Scheduled seats filled by travelers, based on the historical or target passenger occupancy rate (load factor).',
      technicalDetail: 'PAX = Scheduled Seats × Load Factor. Represents gross passengers on arriving flights before connection routing.',
    },
    {
      id: 'p2p_traffic',
      stepNum: 3,
      title: 'Abu Dhabi-ending traffic',
      value: p2pPax,
      unit: 'direct arrivals / mo',
      icon: Compass,
      plainExplanation: 'Travelers whose journey terminates in Abu Dhabi, after removing passengers transferring onwards to other global destinations.',
      technicalDetail: 'Point-to-Point (P2P) = PAX × (1 − Transfer Share − Transit Share). Reflects sovereign final destination traffic.',
    },
    {
      id: 'hotel_checkins',
      stepNum: 4,
      title: 'Predicted hotel check-ins',
      value: checkins,
      unit: 'check-ins / mo',
      icon: Building2,
      plainExplanation: 'Direct visitors who book and check into commercial hotels across Abu Dhabi emirate, evaluated via empirical conversion factors.',
      technicalDetail: 'Predicted Check-ins = linear_v009 regression reference prediction calibrated on verified DCT historical hotel registration data.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-6" id="conversion-chain-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0A2E4D]/10 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#0A2E4D] tracking-tight">
            Why the result changed
          </h3>
          <p className="text-xs text-[#0A2E4D]/60 font-normal">
            The four-stage flight-to-hotel conversion logic. Click any step to expand details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs text-[#0E6B6E] hover:underline font-medium flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showTechnicalDetails ? 'Hide technical formulas' : 'Explain technical details'}</span>
        </button>
      </div>

      {/* 4 Steps Vertical or Responsive Grid with explicit ↓ indicator */}
      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isExpanded = expandedStepId === s.id;
          const Icon = s.icon;

          return (
            <div key={s.id} className="space-y-2">
              <div
                onClick={() => setExpandedStepId(isExpanded ? null : s.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-[#F4F1EA] border-[#0A2E4D]/30 shadow-xs'
                    : 'bg-white hover:bg-[#F4F1EA]/50 border-[#0A2E4D]/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#0A2E4D] text-[#D4AF37] font-semibold text-xs flex items-center justify-center shrink-0">
                      0{s.stepNum}
                    </span>
                    <Icon className="w-4 h-4 text-[#0E6B6E] shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A2E4D] tracking-tight">
                        {s.title}
                      </h4>
                      <p className="text-xs text-[#0A2E4D]/60 line-clamp-1 font-normal">
                        {s.plainExplanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-semibold font-mono text-[#0A2E4D]">
                        {s.value !== null && !isNaN(s.value) ? Math.round(s.value).toLocaleString() : 'Unavailable'}
                      </div>
                      <div className="text-[10px] text-[#0A2E4D]/50 font-normal">
                        {s.unit}
                      </div>
                    </div>

                    <div className="text-[#0A2E4D]/40">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expandable Plain-Language Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#0A2E4D]/10 text-xs text-[#0A2E4D]/80 space-y-2 animate-in fade-in duration-150">
                    <div className="p-3 rounded-xl bg-white border border-[#0A2E4D]/10">
                      <div className="font-semibold text-[#0A2E4D] mb-1">How this step works:</div>
                      <p className="text-xs text-[#0A2E4D]/75 leading-relaxed font-normal">
                        {s.plainExplanation}
                      </p>
                    </div>

                    {showTechnicalDetails && (
                      <div className="p-3 rounded-xl bg-[#0E6B6E]/8 border border-[#0E6B6E]/20 text-[11px] font-mono text-[#0A2E4D]">
                        <div className="font-sans font-semibold text-[#0E6B6E] mb-1">Analytical Formula:</div>
                        {s.technicalDetail}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow down connector between steps */}
              {idx < steps.length - 1 && (
                <div className="flex justify-center -my-1 text-[#0E6B6E]">
                  <div className="flex items-center gap-1 text-[11px] font-mono opacity-60">
                    <span>↓</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
