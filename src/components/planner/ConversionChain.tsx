import React, { useState } from 'react';
import { ConversionStage } from '../../types';
import { DataStatusChip } from '../common/DataStatusChip';
import { ArrowDown, HelpCircle, Info, ChevronRight, X, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  stages: ConversionStage[];
}

export const ConversionChain: React.FC<Props> = ({ stages }) => {
  const [selectedStage, setSelectedStage] = useState<ConversionStage | null>(null);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4" id="conversion-chain-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Transparent Conversion Chain
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            From Scheduled Flight Seats to Hotel Guest Nights
          </h2>
          <p className="text-xs text-slate-500">
            Every transformation step is explicit, inspectable, and tagged with its evidence status.
          </p>
        </div>

        <span className="text-xs text-slate-400 font-medium">Click any stage to view calculation logic</span>
      </div>

      {/* Critical Clarification Callout */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-amber-900">Important Planning Rule:</strong> Abu Dhabi-Ending (P2P) passengers have Abu Dhabi as their final destination, but they are <em>not automatically international tourists or hotel guests</em>. Returning UAE resident expatriates sleep at home, and visiting friends & relatives (VFR) do not generate commercial hotel bookings.
        </p>
      </div>

      {/* Conversion Stages List / Vertical-Horizontal Flow */}
      <div className="space-y-2.5">
        {stages.map((stage, idx) => {
          const isSelected = selectedStage?.id === stage.id;
          const isPositive = stage.changeValue >= 0;

          return (
            <React.Fragment key={stage.id}>
              {/* Connector Step between stages */}
              {idx > 0 && (
                <div className="flex items-center justify-center -my-1 py-1">
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 border border-slate-200">
                    <ArrowDown className="w-3 h-3 text-teal-600" />
                    <span>{stage.formula}</span>
                  </div>
                </div>
              )}

              {/* Stage Card */}
              <button
                type="button"
                id={`conversion-stage-${stage.id}`}
                onClick={() => setSelectedStage(isSelected ? null : stage)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-xs font-bold text-slate-900">{stage.name}</h3>
                      <DataStatusChip status={stage.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{stage.explanation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-10 sm:pl-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {stage.scenarioValue.toLocaleString()}
                      <span className="text-[11px] font-normal text-slate-500 ml-1">{stage.unit.split('/')[0]}</span>
                    </div>
                    <div className="text-[10.5px] text-slate-500 flex items-center justify-end gap-1.5 font-mono">
                      <span>Base: {stage.baselineValue.toLocaleString()}</span>
                      <span className={`font-bold ${isPositive ? 'text-teal-700' : 'text-rose-700'}`}>
                        ({isPositive ? `+${stage.percentChange.toFixed(1)}%` : `${stage.percentChange.toFixed(1)}%`})
                      </span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-teal-600' : ''}`} />
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage Drilldown Detail Panel (Appears when a stage is clicked) */}
      {selectedStage && (
        <div
          id="conversion-stage-drilldown"
          className="p-4 rounded-xl border border-teal-200 bg-teal-50/70 space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Calculation Logic: {selectedStage.name}
              </h4>
              <DataStatusChip status={selectedStage.status} size="sm" />
            </div>
            <button
              id="close-stage-drilldown-btn"
              type="button"
              onClick={() => setSelectedStage(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-teal-200/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Governing Formula</span>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">{selectedStage.formula}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-teal-200/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated Uncertainty Band</span>
              <p className="font-mono font-semibold text-teal-800 mt-0.5">
                {selectedStage.uncertaintyRange.min.toLocaleString()} — {selectedStage.uncertaintyRange.max.toLocaleString()} {selectedStage.unit}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-teal-200/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Planning Rationale</span>
              <p className="text-slate-700 mt-0.5">{selectedStage.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
