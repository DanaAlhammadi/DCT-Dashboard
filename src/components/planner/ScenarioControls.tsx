import React from 'react';
import { ScenarioInput, BaselineFlightData, RouteInfo } from '../../types';
import { Sliders, Calendar, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';

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
  const seatsPerFlight = 200; // Standard typical capacity per flight leg
  const monthlyFlightMultiplier = 4.33; // Weeks per month

  // Handle Weekly Flight frequency change
  const handleFrequencyChange = (deltaFlights: number) => {
    const computedSeats = Math.round(deltaFlights * monthlyFlightMultiplier * seatsPerFlight);
    onChangeInput({
      assumedWeeklyFrequencyChange: deltaFlights,
      seatCapacityChange: computedSeats,
    });
  };

  // Quick period presets
  const periods = [
    { label: 'Q1 2027 (Jan–Mar)', start: '2027-01', end: '2027-03' },
    { label: 'Q2 2027 (Apr–Jun)', start: '2027-04', end: '2027-06' },
    { label: 'Full Year 2027', start: '2027-01', end: '2027-12' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6" id="scenario-controls-card">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
              Define the change
            </h3>
            <p className="text-[11px] text-stone-500">
              Set the planned schedule, capacity, or passenger fill adjustments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>Assumed Change</span>
        </div>
      </div>

      {/* Relevant Controls Based on Selected Action Choice */}
      {/* CASE 1: ADD FLIGHTS (FREQUENCY) */}
      {input.decisionType === 'CHANGE_FREQUENCY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
              <span>Weekly flights to add or remove</span>
              <InfoTooltip
                title="Weekly Flights"
                businessTerm="Number of additional round-trip flights operated each week."
                technicalDefinition="Multiplied by average aircraft seat capacity to determine monthly scheduled seat volume."
              />
            </label>
            <span className="font-mono text-base font-semibold text-teal-900">
              {input.assumedWeeklyFrequencyChange && input.assumedWeeklyFrequencyChange > 0 ? '+' : ''}
              {input.assumedWeeklyFrequencyChange ?? 2} flights / week
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={-7}
              max={14}
              step={1}
              value={input.assumedWeeklyFrequencyChange ?? 2}
              onChange={(e) => handleFrequencyChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>-7 flights</span>
              <span className="text-stone-700 font-medium">0 (Baseline)</span>
              <span>+14 flights</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
            <span>Resulting monthly seat change:</span>
            <span className="font-mono font-semibold text-stone-900">
              {input.seatCapacityChange > 0 ? '+' : ''}
              {input.seatCapacityChange.toLocaleString()} seats/mo
            </span>
          </div>
        </div>
      )}

      {/* CASE 2: CHANGE CAPACITY (SEATS) */}
      {input.decisionType === 'CHANGE_CAPACITY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
              <span>Add or remove seats per month</span>
              <InfoTooltip
                title="Add Seats"
                businessTerm="Total monthly net change in scheduled seat capacity on this route."
                technicalDefinition="delta_seats applied directly to monthly flight volume."
              />
            </label>
            <span className="font-mono text-base font-semibold text-teal-900">
              {input.seatCapacityChange > 0 ? '+' : ''}
              {input.seatCapacityChange.toLocaleString()} seats / mo
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={-10000}
              max={25000}
              step={500}
              value={input.seatCapacityChange}
              onChange={(e) => onChangeInput({ seatCapacityChange: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>-10,000</span>
              <span className="text-stone-700 font-medium">0</span>
              <span>+25,000</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600 flex items-center justify-between">
            <span>Total resulting capacity:</span>
            <span className="font-mono font-semibold text-stone-900">
              {Math.max(0, baseline.totalSeats + input.seatCapacityChange).toLocaleString()} seats/mo
            </span>
          </div>
        </div>
      )}

      {/* CASE 3: TEST LOAD FACTOR (PASSENGER FILL) */}
      {input.decisionType === 'TEST_LOAD_FACTOR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
              <span>Expected passenger fill</span>
              <InfoTooltip
                title="Expected Passenger Fill"
                businessTerm="The proportion of aircraft seats occupied by passengers."
                technicalDefinition="Target load factor override (0.50 to 0.98)."
              />
            </label>
            <span className="font-mono text-base font-semibold text-teal-900">
              {input.useCustomLoadFactor && input.customLoadFactor !== null
                ? `${(input.customLoadFactor * 100).toFixed(0)}%`
                : `${(baseline.historicalLoadFactor * 100).toFixed(1)}% (Historical)`}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={50}
              max={98}
              step={1}
              value={
                input.useCustomLoadFactor && input.customLoadFactor !== null
                  ? Math.round(input.customLoadFactor * 100)
                  : Math.round(baseline.historicalLoadFactor * 100)
              }
              onChange={(e) =>
                onChangeInput({
                  useCustomLoadFactor: true,
                  customLoadFactor: parseInt(e.target.value, 10) / 100,
                })
              }
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-800"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>50% fill</span>
              <span className="text-stone-700 font-medium">Historical: {(baseline.historicalLoadFactor * 100).toFixed(0)}%</span>
              <span>98% fill</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApplyPreset('lf_85')}
              className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
            >
              Set 85% Target
            </button>
            <button
              type="button"
              onClick={() => onChangeInput({ useCustomLoadFactor: false, customLoadFactor: null })}
              className="text-xs px-2.5 py-1 rounded-lg text-stone-500 hover:text-stone-800"
            >
              Reset to Historical
            </button>
          </div>
        </div>
      )}

      {/* CASE 4: NEW ROUTE */}
      {input.decisionType === 'NEW_ROUTE' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 space-y-1">
            <div className="font-semibold text-teal-900">New Direct Air Connection</div>
            <p className="text-teal-900/80 leading-relaxed text-[11px]">
              Simulating direct non-stop service connecting {route.departureCity} ({route.routeCode.split('-')[0] || route.departureCity}) directly into Abu Dhabi (AUH).
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700">Initial weekly flight schedule</label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => handleFrequencyChange(freq)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    input.assumedWeeklyFrequencyChange === freq
                      ? 'bg-teal-900 text-white border-teal-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  {freq} flights / week
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeframe Selection */}
      <div className="pt-3 border-t border-stone-100 space-y-2">
        <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Evaluation timeframe</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {periods.map((p) => {
            const isSelected = input.startMonth === p.start && input.endMonth === p.end;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChangeInput({ startMonth: p.start, endMonth: p.end })}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-white border-stone-200 text-stone-600'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
