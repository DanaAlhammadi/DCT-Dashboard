import React, { useState } from 'react';
import { ScenarioInput, BaselineFlightData } from '../../types';
import { DataStatusChip } from '../common/DataStatusChip';
import { ChevronDown, ChevronUp, SlidersHorizontal, Info, Sparkles } from 'lucide-react';
import { MOCK_EVENTS } from '../../data/mockData';

interface Props {
  input: ScenarioInput;
  baseline: BaselineFlightData;
  onChangeInput: (updated: Partial<ScenarioInput>) => void;
}

export const AdvancedAssumptions: React.FC<Props> = ({
  input,
  baseline,
  onChangeInput,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const alosMethodLabel = () => {
    switch (baseline.alosStatus) {
      case 'DIRECT_DATA':
        return 'Provided directly by data';
      case 'DERIVED':
        return 'Derived from average length of stay';
      case 'DEMO_ASSUMPTION':
        return 'Demo assumption only';
      case 'UNAVAILABLE':
      default:
        return 'Not available';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="advanced-assumptions-accordion">
      <button
        id="toggle-advanced-assumptions-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4.5 px-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors bg-white"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Advanced assumptions</h3>
            <p className="text-xs text-slate-500">Cabin mix, transfer ratios, hotel capture & length of stay</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-teal-700 hidden sm:inline">
            {isOpen ? 'Collapse' : 'Configure assumptions'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/40 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inbound Visitor Share */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Inbound Visitor Share
                </label>
                <DataStatusChip status="Estimated" size="sm" />
              </div>
              <p className="text-[11px] text-slate-500">
                P2P arrivals who are non-resident tourists (excludes returning UAE residents).
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="visitor-share-slider"
                  type="range"
                  min={30}
                  max={98}
                  value={Math.round((input.visitorShareOverride ?? baseline.inboundVisitorShare) * 100)}
                  onChange={(e) => onChangeInput({ visitorShareOverride: parseInt(e.target.value, 10) / 100 })}
                  className="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-800 w-12 text-right">
                  {Math.round((input.visitorShareOverride ?? baseline.inboundVisitorShare) * 100)}%
                </span>
              </div>
            </div>

            {/* Hotel Capture Rate */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Hotel-Capture Rate
                </label>
                <DataStatusChip status="Estimated" size="sm" />
              </div>
              <p className="text-[11px] text-slate-500">
                Visitors staying in commercial hotels vs staying with family, friends, or apartments.
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="hotel-capture-slider"
                  type="range"
                  min={40}
                  max={98}
                  value={Math.round((input.hotelCaptureRateOverride ?? baseline.hotelCaptureRate) * 100)}
                  onChange={(e) => onChangeInput({ hotelCaptureRateOverride: parseInt(e.target.value, 10) / 100 })}
                  className="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-800 w-12 text-right">
                  {Math.round((input.hotelCaptureRateOverride ?? baseline.hotelCaptureRate) * 100)}%
                </span>
              </div>
            </div>

            {/* Average Length of Stay (ALOS) */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Average Length of Stay (ALOS)
                </label>
                <DataStatusChip status={baseline.alosStatus === 'DIRECT_DATA' ? 'Observed' : 'Assumed'} size="sm" />
              </div>
              <p className="text-[11px] text-slate-500">
                Method status: <strong className="text-teal-700">{alosMethodLabel()}</strong>
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="alos-slider"
                  type="range"
                  min={1.5}
                  max={8.0}
                  step={0.1}
                  value={input.alosOverride ?? baseline.averageLengthOfStay}
                  onChange={(e) => onChangeInput({ alosOverride: parseFloat(e.target.value) })}
                  className="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-800 w-16 text-right">
                  {(input.alosOverride ?? baseline.averageLengthOfStay).toFixed(1)} nights
                </span>
              </div>
            </div>

            {/* Transfer & Transit Share */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Transfer Leakage Share
                </label>
                <DataStatusChip status="Derived" size="sm" />
              </div>
              <p className="text-[11px] text-slate-500">
                Arriving passengers connecting onward via Zayed International Airport (AUH).
              </p>
              <div className="flex items-center gap-3">
                <input
                  id="transfer-share-slider"
                  type="range"
                  min={5}
                  max={70}
                  value={Math.round((input.transferShareOverride ?? (baseline.totalPax > 0 ? baseline.totalTransfer / baseline.totalPax : 0.3)) * 100)}
                  onChange={(e) => onChangeInput({ transferShareOverride: parseInt(e.target.value, 10) / 100 })}
                  className="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-800 w-12 text-right">
                  {Math.round((input.transferShareOverride ?? (baseline.totalPax > 0 ? baseline.totalTransfer / baseline.totalPax : 0.3)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Event & Holiday Overlay Selector */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Active Abu Dhabi Event Overlay
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Apply seasonal tourism draw multipliers (Formula 1, Culture Summit, Boat Show)
              </p>
            </div>

            <select
              id="event-overlay-select"
              value={input.selectedEvent || ''}
              onChange={(e) =>
                onChangeInput({
                  selectedEvent: e.target.value,
                  hasEventPeriod: e.target.value !== '',
                })
              }
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800"
            >
              <option value="">No major event overlay</option>
              {MOCK_EVENTS.map((evt, idx) => (
                <option key={idx} value={evt.name}>
                  {evt.name} ({evt.month}) — +{Math.round((evt.impactMultiplier - 1) * 100)}%
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
