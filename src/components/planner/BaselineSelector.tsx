import React from 'react';
import { RouteInfo, BaselineFlightData } from '../../types';
import { DataStatusChip } from '../common/DataStatusChip';
import { Plane, MapPin, Building, ArrowRight, Info, AlertCircle } from 'lucide-react';

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
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4" id="baseline-selector-card">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Section A
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            1. Select the current situation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The baseline is the current or planned flight situation before your change.
          </p>
        </div>
        <DataStatusChip status="Observed" size="md" />
      </div>

      {/* Route Dropdown Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          Operating Route & Airline
        </label>
        <select
          id="route-selector-dropdown"
          value={selectedRoute.id}
          onChange={(e) => onSelectRoute(e.target.value)}
          className="w-full text-sm font-semibold py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
        >
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.routeCode} — {r.departureCity}, {r.departureCountry} ({r.airline}) {r.isExisting ? '' : '— [PROPOSED NEW]'}
            </option>
          ))}
        </select>
      </div>

      {/* Visual Route Path & Origin Distinction */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
              {selectedRoute.isExisting ? 'Existing Active Route' : 'Proposed New Route'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
            {selectedRoute.distanceKm.toLocaleString()} km · ~{selectedRoute.flightDurationHours}h
          </span>
        </div>

        {/* Path visual */}
        <div className="flex items-center justify-between gap-3 relative z-10 my-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Origin City</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {selectedRoute.departureCity}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center px-2">
            <div className="w-full flex items-center gap-1">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-teal-400/30 to-teal-400" />
              <div className="p-1.5 rounded-full bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/40">
                <Plane className="w-3.5 h-3.5 rotate-45" />
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-teal-400 to-teal-400/30" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1">{selectedRoute.airline}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Arrival Hub</span>
            <p className="text-sm font-bold text-white flex items-center gap-1.5 justify-end mt-0.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              Abu Dhabi (AUH)
            </p>
          </div>
        </div>

        {/* Exact Wording Dimensions */}
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Flight-origin country:</span>
            <span className="font-semibold text-slate-100">{selectedRoute.departureCountry}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Modelled source market:</span>
            <span className="font-semibold text-teal-300">{selectedRoute.modelledSourceMarket}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Reporting month:</span>
            <span className="font-semibold text-slate-100">{baseline.reportingMonth}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Target airport:</span>
            <span className="font-semibold text-amber-300">Zayed Int'l (AUH)</span>
          </div>
        </div>
      </div>

      {/* Compact Baseline Summary Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Observed Historical Baseline</span>
          <span className="text-[11px] text-slate-400">Values per monthly operating cycle</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Total Seats</span>
              <DataStatusChip status={baseline.totalSeats > 0 ? 'Observed' : 'Unknown'} size="sm" />
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {baseline.totalSeats > 0 ? baseline.totalSeats.toLocaleString() : '0 (New Route)'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Total PAX</span>
              <DataStatusChip status={baseline.totalPax > 0 ? 'Observed' : 'Unknown'} size="sm" />
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {baseline.totalPax > 0 ? baseline.totalPax.toLocaleString() : '0'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Total P2P</span>
              <DataStatusChip status={baseline.totalP2P > 0 ? 'Derived' : 'Unknown'} size="sm" />
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {baseline.totalP2P > 0 ? baseline.totalP2P.toLocaleString() : '0'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Transfer PAX</span>
              <DataStatusChip status={baseline.totalTransfer > 0 ? 'Observed' : 'Unknown'} size="sm" />
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {baseline.totalTransfer > 0 ? baseline.totalTransfer.toLocaleString() : '0'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Transit PAX</span>
              <DataStatusChip status={baseline.totalTransit > 0 ? 'Observed' : 'Unknown'} size="sm" />
            </div>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {baseline.totalTransit > 0 ? baseline.totalTransit.toLocaleString() : '0'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Hist. Load Factor</span>
              <DataStatusChip status={baseline.historicalLoadFactor > 0 ? 'Observed' : 'Assumed'} size="sm" />
            </div>
            <p className="text-sm font-bold text-teal-800 font-mono">
              {(baseline.historicalLoadFactor * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Weekly Frequency Field with Required Exact Warning */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Average Weekly Frequency:</span>
            {baseline.averageWeeklyFrequency !== null ? (
              <span className="font-bold text-slate-900 font-mono px-2 py-0.5 rounded bg-white border border-slate-200">
                {baseline.averageWeeklyFrequency} flights / week
              </span>
            ) : (
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Unavailable in the current extract
              </span>
            )}
          </div>
          <DataStatusChip status={baseline.frequencyDataStatus} size="sm" />
        </div>
      </div>
    </div>
  );
};
