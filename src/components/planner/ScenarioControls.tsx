import React from 'react';
import { ScenarioInput, BaselineFlightData, RouteInfo } from '../../types';
import { DataStatusChip } from '../common/DataStatusChip';
import { Sliders, AlertTriangle, Calendar, RefreshCw, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  input: ScenarioInput;
  baseline: BaselineFlightData;
  route: RouteInfo;
  onChangeInput: (updated: Partial<ScenarioInput>) => void;
  onApplyPreset: (presetKey: string) => void;
}

export const ScenarioControls: React.FC<Props> = ({
  input,
  baseline,
  route,
  onChangeInput,
  onApplyPreset,
}) => {
  const resultingSeats = Math.max(0, baseline.totalSeats + input.seatCapacityChange);
  const seatsChangePercent = baseline.totalSeats > 0 ? (input.seatCapacityChange / baseline.totalSeats) * 100 : 100;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5" id="scenario-controls-card">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Section B
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            2. Define the change
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify aviation levers to simulate the resulting effect on hotel guest demand.
          </p>
        </div>
        <DataStatusChip status="Assumed" size="md" />
      </div>

      {/* Quick Scenario Levers / Presets */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Planning Presets
          </span>
          <span className="text-[11px] text-slate-400">One-click standard scenarios</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            id="preset-india-flights-btn"
            type="button"
            onClick={() => onApplyPreset('india_freq')}
            className="text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-900 transition-colors text-center"
          >
            +2 Weekly Flights
          </button>
          <button
            id="preset-load-factor-btn"
            type="button"
            onClick={() => onApplyPreset('lf_85')}
            className="text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors text-center"
          >
            85% Load Factor
          </button>
          <button
            id="preset-japan-new-btn"
            type="button"
            onClick={() => onApplyPreset('japan_new')}
            className="text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 transition-colors text-center"
          >
            Japan New Route
          </button>
          <button
            id="preset-route-loss-btn"
            type="button"
            onClick={() => onApplyPreset('route_loss')}
            className="text-[11px] font-semibold py-1.5 px-2.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-900 transition-colors text-center"
          >
            Route Reduction
          </button>
        </div>
      </div>

      {/* Route Status Switcher */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          Route Operational Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['EXISTING', 'NEW_ROUTE', 'DISCONTINUED'] as const).map((st) => (
            <button
              key={st}
              id={`route-status-${st.toLowerCase()}`}
              type="button"
              onClick={() => {
                const changes: Partial<ScenarioInput> = { routeStatus: st };
                if (st === 'DISCONTINUED') {
                  changes.seatCapacityChange = -baseline.totalSeats;
                } else if (st === 'NEW_ROUTE' && input.seatCapacityChange <= 0) {
                  changes.seatCapacityChange = 2400;
                }
                onChangeInput(changes);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                input.routeStatus === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st === 'EXISTING' ? 'Existing Route' : st === 'NEW_ROUTE' ? 'Proposed New' : 'Discontinued'}
            </button>
          ))}
        </div>
      </div>

      {/* Total Seat Capacity Change (Slider + Number input) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-800 block">
              Total Seat-Capacity Change (per month)
            </label>
            <span className="text-[11px] text-slate-500">
              Direct physical capacity added or removed
            </span>
          </div>
          <DataStatusChip status="Assumed" size="sm" />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="seat-capacity-slider"
            type="range"
            min={-baseline.totalSeats}
            max={baseline.totalSeats > 0 ? baseline.totalSeats * 2 : 15000}
            step={200}
            value={input.seatCapacityChange}
            onChange={(e) => onChangeInput({ seatCapacityChange: parseInt(e.target.value, 10) || 0 })}
            className="flex-1 accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex items-center gap-1 min-w-[120px]">
            <input
              id="seat-capacity-input"
              type="number"
              step={100}
              value={input.seatCapacityChange}
              onChange={(e) => onChangeInput({ seatCapacityChange: parseInt(e.target.value, 10) || 0 })}
              className="w-24 text-right text-xs font-mono font-bold py-1.5 px-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <span className="text-[11px] font-semibold text-slate-500">seats</span>
          </div>
        </div>

        {/* Change breakdown feedback */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-mono">
          <span className="text-slate-500">
            Baseline: <strong className="text-slate-700">{baseline.totalSeats.toLocaleString()}</strong>
          </span>
          <span className={`font-bold flex items-center gap-1 ${input.seatCapacityChange >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
            {input.seatCapacityChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {input.seatCapacityChange >= 0 ? `+${input.seatCapacityChange.toLocaleString()}` : input.seatCapacityChange.toLocaleString()}
            ({seatsChangePercent >= 0 ? `+${seatsChangePercent.toFixed(0)}%` : `${seatsChangePercent.toFixed(0)}%`})
          </span>
          <span className="text-slate-500">
            Resulting: <strong className="text-slate-900">{resultingSeats.toLocaleString()} seats/mo</strong>
          </span>
        </div>
      </div>

      {/* Assumed Weekly Frequency Change */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 block">
            Assumed Weekly Frequency Change
          </label>
          <DataStatusChip status="Assumed" size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="weekly-frequency-input"
            type="number"
            min={-14}
            max={28}
            value={input.assumedWeeklyFrequencyChange ?? ''}
            placeholder="e.g. 2 flights / week"
            onChange={(e) =>
              onChangeInput({
                assumedWeeklyFrequencyChange: e.target.value === '' ? null : parseInt(e.target.value, 10),
              })
            }
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <span className="text-xs text-slate-500 whitespace-nowrap font-medium">flights/week</span>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>Weekly frequency is unavailable for many historical records. This value will be treated as a planner assumption.</span>
        </div>
      </div>

      {/* Load Factor Control with Custom Switch */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Passenger Load Factor</span>
            <span className="text-[11px] text-slate-500">
              Baseline: {(baseline.historicalLoadFactor * 100).toFixed(0)}%
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[11px] font-semibold text-slate-700">Use custom assumption</span>
            <input
              id="custom-load-factor-toggle"
              type="checkbox"
              checked={input.useCustomLoadFactor}
              onChange={(e) =>
                onChangeInput({
                  useCustomLoadFactor: e.target.checked,
                  customLoadFactor: e.target.checked ? (input.customLoadFactor ?? 0.85) : null,
                })
              }
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600 relative" />
          </label>
        </div>

        {input.useCustomLoadFactor ? (
          <div className="pt-2 border-t border-slate-200/60 space-y-2">
            <div className="flex items-center gap-3">
              <input
                id="custom-load-factor-slider"
                type="range"
                min={40}
                max={110}
                value={Math.round((input.customLoadFactor ?? 0.85) * 100)}
                onChange={(e) => onChangeInput({ customLoadFactor: parseInt(e.target.value, 10) / 100 })}
                className="flex-1 accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-1 min-w-[70px]">
                <input
                  id="custom-load-factor-input"
                  type="number"
                  min={1}
                  max={120}
                  value={Math.round((input.customLoadFactor ?? 0.85) * 100)}
                  onChange={(e) => onChangeInput({ customLoadFactor: (parseInt(e.target.value, 10) || 0) / 100 })}
                  className="w-14 text-right text-xs font-mono font-bold py-1 px-1.5 bg-white border border-slate-300 rounded-lg"
                />
                <span className="text-xs font-bold text-slate-700">%</span>
              </div>
              <DataStatusChip status="Assumed" size="sm" />
            </div>

            {(input.customLoadFactor ?? 0) > 1.0 && (
              <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                Note: Assumed load factor exceeds 100%. While historical flights occasionally record &gt;100% due to lap infants or re-accommodations, confirm this is intended.
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic">
            Currently retaining historical baseline rate of {(baseline.historicalLoadFactor * 100).toFixed(0)}%.
          </p>
        )}
      </div>

      {/* Date Range: Start and End Month */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-teal-600" />
            Start Month
          </label>
          <input
            id="scenario-start-month-input"
            type="month"
            value={input.startMonth}
            onChange={(e) => onChangeInput({ startMonth: e.target.value })}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-teal-600" />
            End Month
          </label>
          <input
            id="scenario-end-month-input"
            type="month"
            value={input.endMonth}
            onChange={(e) => onChangeInput({ endMonth: e.target.value })}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
