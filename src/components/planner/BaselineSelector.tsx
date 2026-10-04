import React from 'react';
import { RouteInfo, BaselineFlightData, DecisionType } from '../../types';
import { Calendar, MapPin, Building2, ArrowRight, Globe } from 'lucide-react';

interface Props {
  routes: RouteInfo[];
  selectedRoute: RouteInfo;
  baseline: BaselineFlightData;
  decisionType: DecisionType;
  selectedMarket: string;
  startMonth: string;
  endMonth: string;
  onSelectRoute: (routeId: string) => void;
  onSelectMarket: (market: string) => void;
  onSelectPeriod: (startMonth: string, endMonth: string) => void;
}

const POPULAR_MARKETS = [
  'India',
  'United Kingdom',
  'Germany',
  'Saudi Arabia',
  'Russia',
  'China',
  'France',
  'United States',
  'Italy',
  'Australia',
  'Japan',
];

const PERIOD_PRESETS = [
  { label: 'Nov–Dec 2025 (Benchmark)', start: '2025-11', end: '2025-12' },
  { label: 'Q1 2027 (Jan–Mar)', start: '2027-01', end: '2027-03' },
  { label: 'Q2 2027 (Apr–Jun)', start: '2027-04', end: '2027-06' },
  { label: 'Full Year 2027', start: '2027-01', end: '2027-12' },
];

export const BaselineSelector: React.FC<Props> = ({
  routes,
  selectedRoute,
  baseline,
  decisionType,
  selectedMarket,
  startMonth,
  endMonth,
  onSelectRoute,
  onSelectMarket,
  onSelectPeriod,
}) => {
  const isNewRoute = decisionType === 'NEW_ROUTE';
  const showAirline = decisionType === 'CHANGE_CAPACITY' || decisionType === 'CHANGE_FREQUENCY';

  // Filter routes by selected market if applicable
  const availableRoutes = routes.filter((r) => {
    if (!r.isExisting && !isNewRoute) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-5" id="baseline-selector-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#0A2E4D]/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0A2E4D] text-[#D4AF37] font-semibold text-xs flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[#0A2E4D] tracking-tight">
              STEP 1 — Choose the baseline
            </h3>
            <p className="text-[11px] text-[#0A2E4D]/60 font-normal">
              Select the source market, evaluation period, and baseline flight operation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
          <span>Observed Baseline</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Field 1: Source Market / Nationality */}
        <div className="space-y-1.5">
          <label htmlFor="source-market-dropdown" className="text-xs font-semibold text-[#0A2E4D] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0E6B6E]" />
              <span>Source Market / Nationality</span>
            </span>
            <span className="text-[10px] text-[#0A2E4D]/50 font-normal">Target Nationality Scope</span>
          </label>
          <div className="relative">
            <select
              id="source-market-dropdown"
              value={selectedMarket}
              onChange={(e) => onSelectMarket(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium py-2.5 px-3 pr-8 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/40 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#0E6B6E]/20 focus:border-[#0E6B6E] focus:outline-hidden transition-all text-[#0A2E4D] appearance-none cursor-pointer"
            >
              {POPULAR_MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m.toUpperCase()} (Source Market)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#0A2E4D]/40">
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Field 2: Period */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0A2E4D] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0E6B6E]" />
              <span>Period</span>
            </span>
            <span className="text-[10px] font-mono text-[#0A2E4D]/60 font-medium">
              {startMonth} to {endMonth}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PERIOD_PRESETS.map((p) => {
              const isSelected = startMonth === p.start && endMonth === p.end;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onSelectPeriod(p.start, p.end)}
                  className={`py-1.5 px-2.5 rounded-xl text-[11px] font-medium transition-all text-center border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2E4D] text-white border-[#0A2E4D] shadow-xs'
                      : 'bg-white hover:bg-[#F4F1EA] border-[#0A2E4D]/15 text-[#0A2E4D]/80'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fields for Existing Route Scenarios (Seats, Frequency, Load Factor) */}
        {!isNewRoute ? (
          <>
            {/* Field 3: Departure Country */}
            <div className="space-y-1.5">
              <label htmlFor="departure-country-input" className="text-xs font-semibold text-[#0A2E4D] block">
                Departure Country
              </label>
              <div className="py-2 px-3 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/60 text-xs font-medium text-[#0A2E4D] flex items-center justify-between">
                <span>{selectedRoute.departureCountry}</span>
                <span className="text-[10px] text-[#0A2E4D]/50 uppercase tracking-wider">Flight Origin</span>
              </div>
            </div>

            {/* Field 4: Route (Where appropriate) */}
            <div className="space-y-1.5">
              <label htmlFor="route-selector-dropdown" className="text-xs font-semibold text-[#0A2E4D] block">
                Operating Route
              </label>
              <div className="relative">
                <select
                  id="route-selector-dropdown"
                  value={selectedRoute.id}
                  onChange={(e) => onSelectRoute(e.target.value)}
                  className="w-full text-xs sm:text-sm font-medium py-2.5 px-3 pr-8 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/40 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#0E6B6E]/20 focus:border-[#0E6B6E] focus:outline-hidden transition-all text-[#0A2E4D] appearance-none cursor-pointer"
                >
                  {availableRoutes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeCode} — {r.departureCity}, {r.departureCountry} ({r.airline})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#0A2E4D]/40">
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Field 5: Airline (Where appropriate) */}
            {showAirline && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0A2E4D] block">
                  Operating Airline
                </label>
                <div className="py-2 px-3 rounded-xl border border-[#0A2E4D]/15 bg-[#F4F1EA]/60 text-xs font-medium text-[#0A2E4D] flex items-center justify-between">
                  <span>{selectedRoute.airline}</span>
                  <span className="text-[10px] text-[#0A2E4D]/50">Carrier</span>
                </div>
              </div>
            )}

            {/* Route Baseline Summary Card */}
            <div className="p-3.5 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0A2E4D]/40" />
                  <span className="font-semibold text-[#0A2E4D]">{selectedRoute.departureCity}</span>
                  <ArrowRight className="w-3 h-3 text-[#0A2E4D]/30" />
                  <span className="font-semibold text-[#0E6B6E]">Abu Dhabi (AUH)</span>
                </div>
                <span className="text-[10px] font-mono text-[#0A2E4D]/70 bg-white px-2 py-0.5 rounded border border-[#0A2E4D]/10">
                  {selectedRoute.airline}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#0A2E4D]/10 text-center">
                <div>
                  <div className="text-[10px] text-[#0A2E4D]/60 font-medium">Scheduled Seats</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] font-mono mt-0.5">
                    {baseline.totalSeats.toLocaleString()}<span className="text-[10px] font-sans font-normal text-[#0A2E4D]/40">/mo</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#0A2E4D]/60 font-medium">Historical Fill</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] font-mono mt-0.5">
                    {(baseline.historicalLoadFactor * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#0A2E4D]/60 font-medium">Abu Dhabi Ending</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0A2E4D] font-mono mt-0.5">
                    {(baseline.totalPax > 0 ? (baseline.totalP2P / baseline.totalPax) * 100 : 45).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Notice for New Route */
          <div className="p-3.5 rounded-2xl bg-[#0E6B6E]/8 border border-[#0E6B6E]/20 text-xs text-[#0A2E4D] space-y-1">
            <div className="font-semibold text-[#0A2E4D]">New Route Mode Active</div>
            <p className="text-[11px] text-[#0A2E4D]/70 leading-relaxed font-normal">
              For an unserved route, the departure city, arrival city, airline, capacity, passenger fill, and Abu Dhabi-ending share are defined in Step 2.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
