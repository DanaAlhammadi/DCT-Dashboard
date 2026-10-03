import React from 'react';
import { ScenarioResult, RouteInfo } from '../../types/dashboard';
import { ShieldCheck, AlertTriangle, HelpCircle, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { InfoTooltip } from '../common/InfoTooltip';

interface Props {
  result: ScenarioResult;
  route?: RouteInfo;
  onOpenTechnicalDrawer?: () => void;
}

export const KPIGrid: React.FC<Props> = ({ result, route, onOpenTechnicalDrawer }) => {
  const isPositive = result.hotelGuests.diff >= 0;

  const getSupportBadge = () => {
    switch (result.supportLevel) {
      case 'SUPPORTED':
        return {
          label: 'High Reliability',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dotClass: 'bg-emerald-600',
          desc: 'Parameters fall within observed historical data distribution.',
        };
      case 'LIMITED_SUPPORT':
        return {
          label: 'Moderate Reliability',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dotClass: 'bg-amber-600',
          desc: 'Capacity change reaches edge of historical observation envelope.',
        };
      case 'OUT_OF_SUPPORT':
      default:
        return {
          label: 'Proxy Estimate',
          badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
          dotClass: 'bg-stone-500',
          desc: 'Unserved or exploratory route; projected via market analogues.',
        };
    }
  };

  const support = getSupportBadge();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] space-y-6" id="kpi-hero-result-card">
      {/* Top micro-meta row */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">Step 3 · Projected Outcome</span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
          <span className={`w-2 h-2 rounded-full ${support.dotClass}`} />
          <span>{support.label}</span>
        </div>
      </div>

      {/* Hero Dominant Metric */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <span className="text-5xl sm:text-6xl font-semibold tracking-tight text-teal-950 font-display">
            {isPositive ? '+' : ''}
            {result.hotelGuests.diff.toLocaleString()}
          </span>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span
              className={`inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-lg ${
                isPositive ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {isPositive ? '+' : ''}
              {result.hotelGuests.pct.toFixed(1)}%
            </span>
            <span className="text-xs text-stone-400">vs baseline</span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-medium text-stone-800 tracking-tight">
          Additional hotel check-ins
        </h3>
        <p className="text-xs text-stone-500 font-normal">
          Estimated net change in monthly hotel arrivals in Abu Dhabi.
        </p>
      </div>

      {/* Clean 4-KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
        {/* 1. Baseline */}
        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
          <div className="text-[11px] font-medium text-stone-500">Baseline</div>
          <div className="text-base sm:text-lg font-semibold text-stone-900 font-mono mt-0.5">
            {result.hotelGuests.baseline.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400">check-ins / mo</div>
        </div>

        {/* 2. Scenario */}
        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
          <div className="text-[11px] font-medium text-stone-500">Scenario</div>
          <div className="text-base sm:text-lg font-semibold text-stone-900 font-mono mt-0.5">
            {result.hotelGuests.scenario.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-400">check-ins / mo</div>
        </div>

        {/* 3. Net Change */}
        <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100">
          <div className="text-[11px] font-medium text-teal-900">Net Change</div>
          <div className="text-base sm:text-lg font-semibold text-teal-950 font-mono mt-0.5">
            {isPositive ? '+' : ''}{result.hotelGuests.diff.toLocaleString()}
          </div>
          <div className="text-[10px] text-teal-700 font-medium">
            {isPositive ? '+' : ''}{result.hotelGuests.pct.toFixed(1)}%
          </div>
        </div>

        {/* 4. Support Status */}
        <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
          <div className="text-[11px] font-medium text-stone-500">Support Status</div>
          <div className="text-sm font-semibold text-stone-900 mt-1 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${support.dotClass}`} />
            <span>{result.supportLevel}</span>
          </div>
          <div className="text-[10px] text-stone-400 truncate" title={support.desc}>
            {support.desc}
          </div>
        </div>
      </div>

      {/* Scope & Metadata Footer */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
        <div>
          <span>Period: </span>
          <span className="font-medium text-stone-600">{result.input.startMonth} to {result.input.endMonth}</span>
          <span className="mx-2">·</span>
          <span>Nationality: </span>
          <span className="font-medium text-stone-600">{route?.modelledSourceMarket || result.input.routeId}</span>
          <span className="mx-2">·</span>
          <span>Model: </span>
          <span className="font-mono text-stone-600">linear_v009</span>
        </div>

        {onOpenTechnicalDrawer && (
          <button
            type="button"
            onClick={onOpenTechnicalDrawer}
            className="text-stone-500 hover:text-stone-800 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>View technical audit</span>
          </button>
        )}
      </div>
    </div>
  );
};
