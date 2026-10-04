import React from 'react';
import { ScenarioInput, BaselineFlightData, RouteInfo } from '../../types';
import { Sliders, Calendar, ArrowRight, HelpCircle, AlertCircle, Percent, Users, Compass } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';

interface Props {
  input: ScenarioInput;
  baseline: BaselineFlightData;
  route: RouteInfo;
  onChangeInput: (updated: Partial<ScenarioInput>) => void;
  onApplyPreset?: (presetKey: string) => void;
}

export const ScenarioControls: React.FC<Props> = ({
  input,
  baseline,
  route,
  onChangeInput,
}) => {
  const seatsPerFlight = input.seatsPerFlight ?? 200;
  const monthlyMultiplier = 4.33; // Average weeks per month

  // Mode 1: SEATS ("Change available seats")
  const currentSeats = baseline.totalSeats;
  const diffSeats = input.seatCapacityChange;
  const scenarioSeats = Math.max(0, currentSeats + diffSeats);

  // Mode 2: FREQUENCY ("Weekly flights")
  const currentWeeklyFrequency = baseline.averageWeeklyFrequency ?? (route.isExisting ? 7 : 0);
  const weeklyChange = input.assumedWeeklyFrequencyChange ?? 0;
  const scenarioWeeklyFrequency = Math.max(0, currentWeeklyFrequency + weeklyChange);

  const handleWeeklyChange = (delta: number) => {
    const computedSeatDiff = Math.round(delta * monthlyMultiplier * seatsPerFlight);
    onChangeInput({
      assumedWeeklyFrequencyChange: delta,
      seatCapacityChange: computedSeatDiff,
    });
  };

  const handleSeatsPerFlightChange = (spf: number) => {
    const validSpf = Math.max(50, Math.min(600, spf));
    const delta = input.assumedWeeklyFrequencyChange ?? 0;
    const computedSeatDiff = Math.round(delta * monthlyMultiplier * validSpf);
    onChangeInput({
      seatsPerFlight: validSpf,
      seatCapacityChange: computedSeatDiff,
    });
  };

  // Mode 3: LOAD FACTOR ("Expected passenger fill")
  const currentLoadFactor = baseline.historicalLoadFactor;
  const scenarioLoadFactor =
    input.useCustomLoadFactor && input.customLoadFactor !== null
      ? input.customLoadFactor
      : currentLoadFactor;

  // Mode 4: NEW ROUTE
  const newRouteCountry = input.newRouteDepartureCountry || route.departureCountry || 'Japan';
  const newRouteCity = input.newRouteDepartureCity || (route.isExisting ? 'Tokyo (HND)' : route.departureCity);
  const newRouteArrival = input.newRouteArrivalCity || 'Abu Dhabi (AUH)';
  const newRouteAirline = input.newRouteAirline || (route.airline || 'Etihad Airways');
  const newRouteCapacity = input.newRouteMonthlyCapacity ?? 3000;
  const newRouteLF = input.newRouteLoadFactor ?? 0.75;
  const newRouteP2P = input.newRouteP2PShare ?? 0.45;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-6" id="scenario-controls-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#0A2E4D]/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0A2E4D] text-[#D4AF37] font-semibold text-xs flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[#0A2E4D] tracking-tight">
              STEP 2 — Define the change
            </h3>
            <p className="text-[11px] text-[#0A2E4D]/60 font-normal">
              Adjust connectivity levers for your chosen scenario mode.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-[#0E6B6E]">
          Active Levers
        </span>
      </div>

      {/* ========================================================================= */}
      {/* SCENARIO 1: SEATS ("Change available seats") */}
      {/* ========================================================================= */}
      {input.decisionType === 'CHANGE_CAPACITY' && (
        <div className="space-y-5" id="scenario-controls-seats">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#0A2E4D]">
              Change available seats
            </h4>
            <p className="text-xs text-[#0A2E4D]/65 font-normal">
              Adjust scheduled monthly seat capacity into Abu Dhabi up or down.
            </p>
          </div>

          {/* Slider & Quick Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="seat-capacity-slider" className="text-xs font-semibold text-[#0A2E4D]">
                Net Seat Capacity Adjustment
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="seat-capacity-number-input"
                  type="number"
                  step={100}
                  value={diffSeats}
                  onChange={(e) => onChangeInput({ seatCapacityChange: parseInt(e.target.value, 10) || 0 })}
                  className="w-24 text-right font-mono font-semibold text-xs py-1 px-2 rounded-lg border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D]"
                />
                <span className="text-xs text-[#0A2E4D]/60 font-medium">seats / mo</span>
              </div>
            </div>

            <input
              id="seat-capacity-slider"
              type="range"
              min={-15000}
              max={25000}
              step={500}
              value={diffSeats}
              onChange={(e) => onChangeInput({ seatCapacityChange: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-[#F4F1EA] rounded-lg appearance-none cursor-pointer accent-[#0E6B6E]"
            />

            <div className="flex justify-between text-[11px] text-[#0A2E4D]/50 font-mono">
              <span>-15,000 seats</span>
              <button
                type="button"
                onClick={() => onChangeInput({ seatCapacityChange: 0 })}
                className="text-[#0E6B6E] hover:underline cursor-pointer font-medium"
              >
                0 (No change)
              </button>
              <span>+25,000 seats</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChangeInput({ seatCapacityChange: val })}
                  className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    diffSeats === val
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D]'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]'
                  }`}
                >
                  +{val.toLocaleString()} seats
                </button>
              ))}
              {[-1000, -3000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onChangeInput({ seatCapacityChange: val })}
                  className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    diffSeats === val
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D]'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]'
                  }`}
                >
                  {val.toLocaleString()} seats
                </button>
              ))}
            </div>
          </div>

          {/* Prominent Three Metrics: Current Seats, Scenario Seats, Difference */}
          <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 text-center">
            <div>
              <div className="text-[10px] text-[#0A2E4D]/60 font-medium uppercase tracking-wider">Current seats</div>
              <div className="text-sm sm:text-base font-semibold text-[#0A2E4D] font-mono mt-0.5">
                {currentSeats.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#0A2E4D]/40">monthly baseline</div>
            </div>

            <div>
              <div className="text-[10px] text-[#0A2E4D]/60 font-medium uppercase tracking-wider">Scenario seats</div>
              <div className="text-sm sm:text-base font-semibold text-[#0A2E4D] font-mono mt-0.5">
                {scenarioSeats.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#0A2E4D]/40">resulting monthly</div>
            </div>

            <div className="border-l border-[#0A2E4D]/15 pl-2">
              <div className="text-[10px] text-[#0E6B6E] font-semibold uppercase tracking-wider">Difference</div>
              <div className="text-sm sm:text-base font-bold text-[#0E6B6E] font-mono mt-0.5">
                {diffSeats >= 0 ? '+' : ''}{diffSeats.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#0E6B6E]/70 font-medium">
                {currentSeats > 0 ? `${(diffSeats / currentSeats * 100).toFixed(1)}%` : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENARIO 2: FREQUENCY ("Weekly flights") */}
      {/* ========================================================================= */}
      {input.decisionType === 'CHANGE_FREQUENCY' && (
        <div className="space-y-5" id="scenario-controls-frequency">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#0A2E4D]">
              Weekly flights
            </h4>
            <p className="text-xs text-[#0A2E4D]/65 font-normal">
              Change the number of round-trip flights operated each week.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="weekly-frequency-slider" className="text-xs font-semibold text-[#0A2E4D]">
                Change in weekly frequency
              </label>
              <span className="font-mono text-sm font-bold text-[#0E6B6E]">
                {weeklyChange >= 0 ? '+' : ''}{weeklyChange} flights / week
              </span>
            </div>

            <input
              id="weekly-frequency-slider"
              type="range"
              min={-7}
              max={14}
              step={1}
              value={weeklyChange}
              onChange={(e) => handleWeeklyChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#F4F1EA] rounded-lg appearance-none cursor-pointer accent-[#0E6B6E]"
            />

            <div className="flex justify-between text-[11px] text-[#0A2E4D]/50 font-mono">
              <span>-7 flights</span>
              <button
                type="button"
                onClick={() => handleWeeklyChange(0)}
                className="text-[#0E6B6E] hover:underline cursor-pointer font-medium"
              >
                0 (Baseline: {currentWeeklyFrequency}/wk)
              </button>
              <span>+14 flights</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[1, 2, 3, 4, 7].map((flights) => (
                <button
                  key={flights}
                  type="button"
                  onClick={() => handleWeeklyChange(flights)}
                  className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    weeklyChange === flights
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D]'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]'
                  }`}
                >
                  +{flights} weekly
                </button>
              ))}
              {[-1, -2, -3].map((flights) => (
                <button
                  key={flights}
                  type="button"
                  onClick={() => handleWeeklyChange(flights)}
                  className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    weeklyChange === flights
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D]'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]'
                  }`}
                >
                  {flights} weekly
                </button>
              ))}
            </div>
          </div>

          {/* Seats Per Flight Input */}
          <div className="space-y-1.5 pt-2 border-t border-[#0A2E4D]/10">
            <div className="flex items-center justify-between">
              <label htmlFor="seats-per-flight-input" className="text-xs font-semibold text-[#0A2E4D]">
                Seats per flight
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="seats-per-flight-input"
                  type="number"
                  min={80}
                  max={550}
                  step={10}
                  value={seatsPerFlight}
                  onChange={(e) => handleSeatsPerFlightChange(parseInt(e.target.value, 10) || 200)}
                  className="w-20 text-right font-mono font-semibold text-xs py-1 px-2 rounded-lg border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D]"
                />
                <span className="text-xs text-[#0A2E4D]/60 font-medium">seats/aircraft</span>
              </div>
            </div>
            <p className="text-[11px] text-[#0A2E4D]/60 font-normal leading-relaxed">
              Standard aircraft sizing (e.g. 180-220 for narrowbody A320/A321, 280-350 for widebody B787/A350).
            </p>
          </div>

          {/* Plain Language Explanation */}
          <div className="p-3.5 rounded-2xl bg-[#0E6B6E]/8 border border-[#0E6B6E]/20 text-xs text-[#0A2E4D] space-y-1.5">
            <div className="font-semibold text-[#0E6B6E]">Plain Language Explanation</div>
            <p className="text-xs text-[#0A2E4D]/85 leading-relaxed font-normal">
              “Frequency changes are converted into monthly capacity using seats per flight.”
            </p>
            <div className="text-[11px] text-[#0A2E4D]/65 font-mono pt-1 border-t border-[#0E6B6E]/20">
              Calculation: {weeklyChange >= 0 ? `+${weeklyChange}` : weeklyChange} flights/wk × 4.33 wks/mo × {seatsPerFlight} seats = {diffSeats >= 0 ? `+${diffSeats.toLocaleString()}` : diffSeats.toLocaleString()} seats/mo.
            </div>
          </div>

          {/* Current vs Change vs Result Summary */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 text-center text-xs">
            <div>
              <span className="text-[10px] text-[#0A2E4D]/60 font-medium">Current frequency</span>
              <div className="text-sm font-semibold font-mono text-[#0A2E4D] mt-0.5">
                {currentWeeklyFrequency} flights/wk
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#0E6B6E] font-semibold">Change</span>
              <div className="text-sm font-bold font-mono text-[#0E6B6E] mt-0.5">
                {weeklyChange >= 0 ? `+${weeklyChange}` : weeklyChange} flights/wk
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#0A2E4D]/60 font-medium">Scenario frequency</span>
              <div className="text-sm font-semibold font-mono text-[#0A2E4D] mt-0.5">
                {scenarioWeeklyFrequency} flights/wk
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENARIO 3: LOAD FACTOR ("Expected passenger fill") */}
      {/* ========================================================================= */}
      {input.decisionType === 'TEST_LOAD_FACTOR' && (
        <div className="space-y-5" id="scenario-controls-load-factor">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#0A2E4D]">
              Expected passenger fill
            </h4>
            <p className="text-xs text-[#0A2E4D]/65 font-normal">
              Simulate higher or lower average passenger occupancy across scheduled flights.
            </p>
          </div>

          {/* Slider & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="load-factor-slider" className="text-xs font-semibold text-[#0A2E4D]">
                Passenger Fill Percentage
              </label>
              <span className="font-mono text-base font-bold text-[#0E6B6E]">
                {(scenarioLoadFactor * 100).toFixed(0)}%
              </span>
            </div>

            <input
              id="load-factor-slider"
              type="range"
              min={50}
              max={98}
              step={1}
              value={Math.round(scenarioLoadFactor * 100)}
              onChange={(e) =>
                onChangeInput({
                  useCustomLoadFactor: true,
                  customLoadFactor: parseInt(e.target.value, 10) / 100,
                })
              }
              className="w-full h-2 bg-[#F4F1EA] rounded-lg appearance-none cursor-pointer accent-[#0E6B6E]"
            />

            <div className="flex justify-between text-[11px] text-[#0A2E4D]/50 font-mono">
              <span>50% fill</span>
              <button
                type="button"
                onClick={() =>
                  onChangeInput({
                    useCustomLoadFactor: false,
                    customLoadFactor: null,
                  })
                }
                className="text-[#0E6B6E] hover:underline cursor-pointer font-medium"
              >
                Historical Baseline: {(currentLoadFactor * 100).toFixed(0)}%
              </button>
              <span>98% fill</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[70, 75, 80, 85, 90].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() =>
                    onChangeInput({
                      useCustomLoadFactor: true,
                      customLoadFactor: pct / 100,
                    })
                  }
                  className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer font-medium transition-all ${
                    Math.round(scenarioLoadFactor * 100) === pct
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D]'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]'
                  }`}
                >
                  {pct}% Fill
                </button>
              ))}
            </div>
          </div>

          {/* Visual Plain Language Indicator */}
          <div className="p-4 rounded-2xl bg-[#0E6B6E]/8 border border-[#0E6B6E]/20 text-xs text-[#0A2E4D] space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#0E6B6E]">
              <span>Visual Understanding</span>
              <span className="font-mono text-sm font-bold">{(scenarioLoadFactor * 100).toFixed(0)}%</span>
            </div>
            <p className="text-xs text-[#0A2E4D]/85 leading-relaxed font-normal">
              <strong>{(scenarioLoadFactor * 100).toFixed(0)}%</strong> means approximately{' '}
              <strong>{(scenarioLoadFactor * 100).toFixed(0)}% of available aircraft seats</strong> are filled with passengers onboard.
            </p>
            {/* Passenger Bar Visualization */}
            <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
              <div
                className="bg-[#0E6B6E] h-full transition-all duration-300"
                style={{ width: `${Math.round(scenarioLoadFactor * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#0A2E4D]/50 font-mono">
              <span>0% empty</span>
              <span>{(scenarioLoadFactor * 100).toFixed(0)}% occupied</span>
              <span>100% full</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENARIO 4: NEW ROUTE ("Test a new route") */}
      {/* ========================================================================= */}
      {input.decisionType === 'NEW_ROUTE' && (
        <div className="space-y-4" id="scenario-controls-new-route">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#0A2E4D]">
              Test a new route
            </h4>
            <p className="text-xs text-[#0A2E4D]/65 font-normal">
              Introduce a direct air link connecting an unserved city into Abu Dhabi.
            </p>
          </div>

          {/* Explicitly Required Fields: */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Departure Country */}
            <div className="space-y-1">
              <label htmlFor="new-route-departure-country" className="font-semibold text-[#0A2E4D] block">
                Departure Country <span className="text-rose-600">*</span>
              </label>
              <input
                id="new-route-departure-country"
                type="text"
                value={newRouteCountry}
                onChange={(e) => onChangeInput({ newRouteDepartureCountry: e.target.value })}
                placeholder="e.g. Japan, South Korea"
                className="w-full text-xs py-2 px-3 rounded-xl border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D] bg-white font-medium"
              />
            </div>

            {/* 2. Departure City */}
            <div className="space-y-1">
              <label htmlFor="new-route-departure-city" className="font-semibold text-[#0A2E4D] block">
                Departure City <span className="text-rose-600">*</span>
              </label>
              <input
                id="new-route-departure-city"
                type="text"
                value={newRouteCity}
                onChange={(e) => onChangeInput({ newRouteDepartureCity: e.target.value })}
                placeholder="e.g. Tokyo (HND), Seoul (ICN)"
                className="w-full text-xs py-2 px-3 rounded-xl border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D] bg-white font-medium"
              />
            </div>

            {/* 3. Arrival City (Locked to Abu Dhabi) */}
            <div className="space-y-1">
              <label className="font-semibold text-[#0A2E4D] block">
                Arrival City <span className="text-rose-600">*</span>
              </label>
              <div className="py-2 px-3 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/70 text-xs font-semibold text-[#0E6B6E] flex items-center justify-between">
                <span>{newRouteArrival}</span>
                <span className="text-[10px] text-[#0A2E4D]/50 font-normal">Fixed Target</span>
              </div>
            </div>

            {/* 4. Airline */}
            <div className="space-y-1">
              <label htmlFor="new-route-airline" className="font-semibold text-[#0A2E4D] block">
                Airline <span className="text-rose-600">*</span>
              </label>
              <input
                id="new-route-airline"
                type="text"
                value={newRouteAirline}
                onChange={(e) => onChangeInput({ newRouteAirline: e.target.value })}
                placeholder="e.g. Etihad Airways, ANA"
                className="w-full text-xs py-2 px-3 rounded-xl border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D] bg-white font-medium"
              />
            </div>

            {/* 5. Monthly Capacity */}
            <div className="space-y-1">
              <label htmlFor="new-route-capacity" className="font-semibold text-[#0A2E4D] block">
                Monthly Capacity (Seats) <span className="text-rose-600">*</span>
              </label>
              <input
                id="new-route-capacity"
                type="number"
                min={500}
                max={30000}
                step={500}
                value={newRouteCapacity}
                onChange={(e) => onChangeInput({ newRouteMonthlyCapacity: parseInt(e.target.value, 10) || 3000, seatCapacityChange: parseInt(e.target.value, 10) || 3000 })}
                className="w-full text-xs py-2 px-3 rounded-xl border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D] bg-white font-mono font-medium"
              />
            </div>

            {/* 6. Load Factor */}
            <div className="space-y-1">
              <label htmlFor="new-route-load-factor" className="font-semibold text-[#0A2E4D] block">
                Load Factor (%) <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="new-route-load-factor"
                  type="number"
                  min={40}
                  max={98}
                  step={1}
                  value={Math.round(newRouteLF * 100)}
                  onChange={(e) => onChangeInput({ newRouteLoadFactor: parseInt(e.target.value, 10) / 100, customLoadFactor: parseInt(e.target.value, 10) / 100, useCustomLoadFactor: true })}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-[#0A2E4D]/20 focus:border-[#0E6B6E] focus:outline-hidden text-[#0A2E4D] bg-white font-mono font-medium"
                />
                <span className="text-xs text-[#0A2E4D]/60">% fill</span>
              </div>
            </div>

            {/* 7. P2P Share */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="new-route-p2p" className="font-semibold text-[#0A2E4D]">
                  Point-to-Point (P2P) Share Ending in Abu Dhabi <span className="text-rose-600">*</span>
                </label>
                <span className="font-mono text-xs font-bold text-[#0E6B6E]">
                  {(newRouteP2P * 100).toFixed(0)}%
                </span>
              </div>
              <input
                id="new-route-p2p"
                type="range"
                min={15}
                max={90}
                step={5}
                value={Math.round(newRouteP2P * 100)}
                onChange={(e) => onChangeInput({ newRouteP2PShare: parseInt(e.target.value, 10) / 100 })}
                className="w-full h-2 bg-[#F4F1EA] rounded-lg appearance-none cursor-pointer accent-[#0E6B6E]"
              />
              <div className="flex justify-between text-[10px] text-[#0A2E4D]/50 font-mono">
                <span>15% (High transit)</span>
                <span>45% (Typical AUH point-to-point)</span>
                <span>90% (Direct destination)</span>
              </div>
            </div>
          </div>

          {/* Required Explanation Box */}
          <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#0A2E4D] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#0A2E4D]">
              <AlertCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Support Level Notice</span>
            </div>
            <p className="text-xs text-[#0A2E4D]/85 leading-relaxed font-normal">
              “This route has limited historical evidence, so SILA will clearly flag the result’s support level.”
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
