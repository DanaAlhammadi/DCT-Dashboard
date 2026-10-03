import React, { useState } from 'react';
import { ConversionStage, ScenarioResult } from '../../types';
import { ArrowDown, Info, ChevronRight, X, Layers, Users, Plane, Building2, AlertCircle } from 'lucide-react';

interface Props {
  stages: ConversionStage[];
  result?: ScenarioResult;
}

export const ConversionChain: React.FC<Props> = ({ stages, result }) => {
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  const selectedStage = stages.find((s) => s.id === activeStageId);

  // Story step mappings matching Apple-like storytelling clarity:
  // 1. Scheduled seats
  // 2. Passengers
  // 3. Abu Dhabi-ending traffic
  // 4. Predicted hotel check-ins
  const storySteps = [
    {
      id: 'scheduled_seats',
      title: 'Scheduled seats',
      stage: stages.find((s) => s.id === 'scheduled_seats') || stages[0],
      icon: Layers,
      plainExplanation: 'The total number of passenger seats airlines schedule to fly from the origin market into Abu Dhabi.',
    },
    {
      id: 'total_passengers',
      title: 'Passengers',
      stage: stages.find((s) => s.id === 'total_passengers') || stages[1],
      icon: Users,
      plainExplanation: 'Scheduled seats multiplied by average passenger fill (load factor) yields the estimated passengers onboard.',
    },
    {
      id: 'p2p_passengers',
      title: 'Abu Dhabi-ending traffic',
      stage: stages.find((s) => s.id === 'p2p_passengers') || stages[2],
      icon: Plane,
      plainExplanation: 'Passengers terminating their journey in Abu Dhabi (P2P), excluding travelers transferring onwards to other countries.',
    },
    {
      id: 'hotel_arrivals',
      title: 'Predicted hotel check-ins',
      stage: stages.find((s) => s.id === 'hotel_arrivals' || s.id === 'hotel_guests') || stages[3] || stages[stages.length - 1],
      icon: Building2,
      plainExplanation: 'Visiting passengers who stay in Abu Dhabi commercial hotels, based on empirical market conversion rates.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6" id="conversion-chain-card">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">
          How flights convert into stays
        </h3>
        <p className="text-xs text-stone-500 font-normal">
          Click any step in the journey to inspect the underlying conversion methodology.
        </p>
      </div>

      {/* 4-Step Storytelling Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {storySteps.map((step, idx) => {
          const isSelected = activeStageId === step.id;
          const stage = step.stage;
          const isPos = stage && stage.changeValue >= 0;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col">
              <button
                type="button"
                id={`conversion-step-${step.id}`}
                onClick={() => setActiveStageId(isSelected ? null : step.id)}
                className={`text-left p-4 rounded-2xl border transition-all h-full flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-teal-900 text-white border-teal-900 shadow-md ring-2 ring-teal-700/30'
                    : 'bg-stone-50/80 hover:bg-stone-100/70 border-stone-200/70 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center ${
                        isSelected ? 'bg-teal-800 text-teal-100' : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-300' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  </div>

                  <div className={`text-xs font-medium ${isSelected ? 'text-teal-200' : 'text-stone-500'}`}>
                    {step.title}
                  </div>

                  <div className={`text-lg sm:text-xl font-semibold font-mono tracking-tight mt-1 ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {stage ? stage.scenarioValue.toLocaleString() : '—'}
                  </div>

                  <div className={`text-[11px] font-medium mt-1 ${
                    isSelected ? 'text-teal-300' : isPos ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {stage ? `${isPos ? '+' : ''}${stage.changeValue.toLocaleString()} (${stage.percentChange >= 0 ? '+' : ''}${stage.percentChange.toFixed(1)}%)` : ''}
                  </div>
                </div>

                <div className={`mt-3 pt-2 text-[10px] font-medium border-t flex items-center justify-between ${
                  isSelected ? 'border-teal-800/80 text-teal-300' : 'border-stone-200/60 text-stone-400 group-hover:text-stone-600'
                }`}>
                  <span>{isSelected ? 'Viewing methodology' : 'Tap to inspect'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Step Methodology Drawer */}
      {selectedStage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-950 uppercase tracking-wider">
              Step Methodology: {selectedStage.name}
            </span>
            <button
              type="button"
              onClick={() => setActiveStageId(null)}
              className="text-teal-700 hover:text-teal-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-teal-900 pt-1">
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-200/60">
              <span className="text-[10px] text-teal-700 font-semibold block uppercase">Evidence Status</span>
              <span className="font-medium text-teal-950">{selectedStage.status}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-200/60">
              <span className="text-[10px] text-teal-700 font-semibold block uppercase">Calculation Formula</span>
              <span className="font-mono text-teal-950">{selectedStage.formula}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-teal-200/60">
              <span className="text-[10px] text-teal-700 font-semibold block uppercase">Baseline → Scenario</span>
              <span className="font-mono text-teal-950">
                {selectedStage.baselineValue.toLocaleString()} → {selectedStage.scenarioValue.toLocaleString()} {selectedStage.unit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STRICTLY SEPARATE: Recorded Guest-Days Proxy Card */}
      {result && (
        <div className="p-5 rounded-2xl bg-stone-50/90 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Modelled Proxy Metric
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-semibold text-stone-800">
                Recorded Guest-Days Proxy
              </span>
            </div>
            <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
              Multiplies predicted hotel check-ins by the historical market factor (3.44×). <strong>This is an illustrative proxy, not verified occupied guest nights or measured length of stay.</strong>
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-semibold font-mono text-stone-900">
              {result.guestNights.diff !== null ? `${result.guestNights.diff >= 0 ? '+' : ''}${result.guestNights.diff.toLocaleString()}` : 'Unavailable'}
            </div>
            <div className="text-[11px] text-stone-400">
              recorded guest-day proxy / mo
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
