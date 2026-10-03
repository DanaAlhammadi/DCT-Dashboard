import React from 'react';
import { RouteInfo, BaselineFlightData } from '../../types';
import { Plane, Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';

interface Props {
  routes: RouteInfo[];
  selectedRoute: RouteInfo;
  baseline: BaselineFlightData;
  onSelectRoute: (routeId: string) => void;
}

export const BaselineSelector: React.FC<Props> = ({
  routes,
  selectedRoute,
  baseline,
  onSelectRoute,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-5" id="baseline-selector-card">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
              Choose baseline
            </h3>
            <p className="text-[11px] text-stone-500">
              Select the departure market and current flight operation before your change.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Observed Baseline</span>
        </div>
      </div>

      {/* Route Select Dropdown */}
      <div className="space-y-1.5">
        <label htmlFor="route-selector-dropdown" className="text-xs font-medium text-stone-700 block">
          Operating Route & Airline
        </label>
        <div className="relative">
          <select
            id="route-selector-dropdown"
            value={selectedRoute.id}
            onChange={(e) => onSelectRoute(e.target.value)}
            className="w-full text-sm font-medium py-3 px-3.5 pr-8 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 focus:outline-hidden transition-all text-stone-900 appearance-none cursor-pointer"
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeCode} — {r.departureCity}, {r.departureCountry} ({r.airline}) {r.isExisting ? '' : '· Proposed New'}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clean Route Overview Card */}
      <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-800">{selectedRoute.departureCity} ({selectedRoute.routeCode.split('-')[0] || selectedRoute.departureCity})</span>
            <ArrowRight className="w-3 h-3 text-stone-300" />
            <span className="font-semibold text-teal-900">Abu Dhabi (AUH)</span>
          </div>
          <span className="text-[11px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200/80">
            {selectedRoute.airline}
          </span>
        </div>

        {/* 3 Key Baseline Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 text-center">
          <div>
            <div className="text-[10px] text-stone-500 font-medium">Scheduled Seats</div>
            <div className="text-sm font-semibold text-stone-900 font-mono mt-0.5">
              {baseline.totalSeats.toLocaleString()}<span className="text-[10px] font-sans font-normal text-stone-400">/mo</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 font-medium">Historical Fill</div>
            <div className="text-sm font-semibold text-stone-900 font-mono mt-0.5">
              {(baseline.historicalLoadFactor * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 font-medium">Abu Dhabi Ending (P2P)</div>
            <div className="text-sm font-semibold text-stone-900 font-mono mt-0.5">
              {(baseline.totalPax > 0 ? (baseline.totalP2P / baseline.totalPax) * 100 : 45).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
