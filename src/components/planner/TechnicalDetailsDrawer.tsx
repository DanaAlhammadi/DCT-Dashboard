import React, { useState } from 'react';
import { ScenarioResult, RouteInfo, BaselineFlightData } from '../../types/dashboard';
import {
  X,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  Info,
  ArrowDown,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { DataStatusChip } from '../common/DataStatusChip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: ScenarioResult;
  route?: RouteInfo;
  baseline?: BaselineFlightData;
}

export const TechnicalDetailsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  result,
  route,
  baseline,
}) => {
  const [activeTab, setActiveTab] = useState<'conversion' | 'formulas' | 'warnings'>('conversion');
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedStage = result.conversionStages.find((s) => s.id === selectedStageId) || result.conversionStages[0];

  const getSupportBadge = () => {
    switch (result.supportLevel) {
      case 'SUPPORTED':
        return {
          label: 'SUPPORTED',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
          icon: ShieldCheck,
          note: 'Historical evidence directly supports this capacity and route range.',
        };
      case 'LIMITED_SUPPORT':
        return {
          label: 'LIMITED SUPPORT',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          icon: AlertTriangle,
          note: 'Proposed shift is near or beyond normal historical fluctuations.',
        };
      case 'OUT_OF_SUPPORT':
      default:
        return {
          label: 'OUT OF SUPPORT',
          color: 'text-orange-800 bg-orange-50 border-orange-300',
          icon: HelpCircle,
          note: 'Exploratory estimate derived from analogue markets.',
        };
    }
  };

  const support = getSupportBadge();
  const SupportIcon = support.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      id="technical-details-drawer-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        id="technical-details-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Technical Details & Calculation Audit
              </h2>
              <p className="text-xs text-slate-300">
                Detailed conversion chain, governing formulas & governance warnings
              </p>
            </div>
          </div>
          <button
            id="close-technical-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Bar */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 font-mono text-[10px]">
              EDA MODE
            </span>
            <span>Target: Monthly New Hotel Arrivals</span>
          </div>
          <span className="font-semibold text-teal-800">
            {route?.routeCode || 'DEL → AUH'}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('conversion')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'conversion'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Conversion Chain ({result.conversionStages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'formulas'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculation Logic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warnings')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'warnings'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Warnings & Audit ({result.allWarnings.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* TAB 1: CONVERSION CHAIN */}
          {activeTab === 'conversion' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11.5px]">
                  <strong>Core Planning Principle:</strong> Arriving Point-to-Point (P2P) passengers are not automatically commercial hotel guests. Returning UAE residents sleep in private homes, and connecting passengers leave the Emirate immediately.
                </p>
              </div>

              {/* Conversion Stages List */}
              <div className="space-y-2">
                {result.conversionStages.map((stage, idx) => {
                  const isSelected = selectedStageId === stage.id;
                  const isPositive = stage.changeValue >= 0;

                  return (
                    <div key={stage.id} className="space-y-1.5">
                      {idx > 0 && (
                        <div className="flex items-center justify-center py-0.5">
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-500 border border-slate-200">
                            <ArrowDown className="w-2.5 h-2.5 text-teal-700" />
                            <span className="font-mono text-[9.5px] truncate max-w-[260px]">{stage.formula}</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedStageId(isSelected ? null : stage.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 text-xs truncate">{stage.name}</h4>
                              <DataStatusChip status={stage.status} size="sm" />
                            </div>
                            <p className="text-[10.5px] text-slate-500 truncate">{stage.explanation}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-slate-900 text-xs block">
                            {stage.scenarioValue.toLocaleString()} {stage.unit.split('/')[0]}
                          </span>
                          <span className={`text-[10px] font-mono ${isPositive ? 'text-teal-700' : 'text-rose-700'}`}>
                            {isPositive ? `+${stage.changeValue.toLocaleString()}` : stage.changeValue.toLocaleString()} ({stage.percentChange >= 0 ? '+' : ''}{stage.percentChange.toFixed(1)}%)
                          </span>
                        </div>
                      </button>

                      {/* Drilldown inline if selected */}
                      {isSelected && (
                        <div className="p-3 bg-teal-50/90 rounded-lg border border-teal-200 space-y-2 animate-in fade-in duration-100">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 bg-white rounded border border-teal-200/60">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Governing Formula</span>
                              <p className="font-mono font-bold text-slate-800 mt-0.5">{stage.formula}</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-teal-200/60">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uncertainty Range</span>
                              <p className="font-mono font-bold text-teal-800 mt-0.5">
                                {stage.uncertaintyRange.min.toLocaleString()} – {stage.uncertaintyRange.max.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-teal-200/60">
                            <strong>Rationale:</strong> {stage.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FORMULAS & CALCULATION LOGIC */}
          {activeTab === 'formulas' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Mathematical Transformation Pipeline
                </span>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  How scheduled seats convert into estimated hotel arrivals at each step:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">1. Scheduled Seats → Arriving PAX</span>
                    <DataStatusChip status="Estimated" size="sm" />
                  </div>
                  <p className="font-mono text-[11px] text-teal-800 bg-slate-50 p-2 rounded border border-slate-100">
                    Total Arriving PAX = Scheduled Monthly Seats × Historical Load Factor
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Uses baseline load factor ({((baseline?.historicalLoadFactor ?? 0.8) * 100).toFixed(0)}%) or custom target.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">2. Arriving PAX → P2P Passengers</span>
                    <DataStatusChip status="Derived" size="sm" />
                  </div>
                  <p className="font-mono text-[11px] text-teal-800 bg-slate-50 p-2 rounded border border-slate-100">
                    P2P Passengers = Arriving PAX × (1 - Transfer% - Transit%)
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Strips out connecting hub passengers who do not enter Abu Dhabi.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">3. P2P Passengers → Inbound Visitors</span>
                    <DataStatusChip status="Derived" size="sm" />
                  </div>
                  <p className="font-mono text-[11px] text-teal-800 bg-slate-50 p-2 rounded border border-slate-100">
                    Inbound Visitors = P2P Passengers × Inbound Visitor Ratio
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Excludes returning UAE residents who sleep in private residences.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">4. Inbound Visitors → New Hotel Arrivals</span>
                    <DataStatusChip status="Estimated" size="sm" />
                  </div>
                  <p className="font-mono text-[11px] text-teal-800 bg-slate-50 p-2 rounded border border-slate-100">
                    New Hotel Arrivals = Inbound Visitors × Hotel-Capture Rate
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Captures tourists staying in licensed commercial establishments vs. staying with relatives or friends.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 text-xs">5. Hotel Guest Nights (ALOS)</span>
                    <DataStatusChip status="Unknown" size="sm" />
                  </div>
                  <p className="font-mono text-[11px] text-amber-800 bg-white p-2 rounded border border-amber-200">
                    Guest Nights: Not yet available — stay-duration component pending.
                  </p>
                  <p className="text-amber-900 text-[11px]">
                    Component locked until nationality-linked Average Length of Stay (ALOS) validation is ratified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WARNINGS & AUDIT */}
          {activeTab === 'warnings' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Evidence Support Rating Box */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Evidence Support Status</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${support.color}`}>
                    <SupportIcon className="w-3.5 h-3.5" />
                    {support.label}
                  </span>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  {result.supportExplanation}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Confidence Score:</span>
                  <span className="font-mono font-bold text-slate-800">{result.confidenceScore} / 100</span>
                </div>
              </div>

              {/* Warnings List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Active Audit Observations ({result.allWarnings.length})
                </span>

                {result.allWarnings.map((warning, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11.5px] text-amber-950 leading-relaxed">
                      {warning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Source: DCT Abu Dhabi & AUH Reports</span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
