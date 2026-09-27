import React from 'react';
import { ScenarioResult } from '../../types';
import { Users, BedDouble, TrendingUp, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import { DataStatusChip } from '../common/DataStatusChip';

interface Props {
  result: ScenarioResult;
}

export const KPIGrid: React.FC<Props> = ({ result }) => {
  const isPositiveGuests = result.hotelGuests.diff >= 0;
  const hasGuestNights = result.guestNights.scenario !== null;

  const getSupportBadge = () => {
    switch (result.supportLevel) {
      case 'SUPPORTED':
        return { label: 'SUPPORTED', color: 'text-emerald-700 bg-emerald-50 border-emerald-300', icon: ShieldCheck };
      case 'LIMITED_SUPPORT':
        return { label: 'LIMITED SUPPORT', color: 'text-amber-800 bg-amber-50 border-amber-300', icon: AlertTriangle };
      case 'OUT_OF_SUPPORT':
      default:
        return { label: 'OUT OF SUPPORT', color: 'text-orange-800 bg-orange-50 border-orange-300', icon: HelpCircle };
    }
  };

  const support = getSupportBadge();
  const SupportIcon = support.icon;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="priority-kpi-grid">
      {/* 1. Additional Hotel Guests */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              Hotel Guests / Mo
            </span>
            <DataStatusChip status="Estimated" size="sm" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {result.hotelGuests.scenario.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">guests</span>
          </div>

          <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
            isPositiveGuests ? 'text-teal-700 bg-teal-50' : 'text-rose-700 bg-rose-50'
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${isPositiveGuests ? '' : 'rotate-180'}`} />
            {isPositiveGuests ? `+${result.hotelGuests.diff.toLocaleString()}` : result.hotelGuests.diff.toLocaleString()}
            ({result.hotelGuests.pct >= 0 ? `+${result.hotelGuests.pct.toFixed(1)}%` : `${result.hotelGuests.pct.toFixed(1)}%`})
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Baseline: <strong className="text-slate-700">{result.hotelGuests.baseline.toLocaleString()}</strong></span>
          <span className="text-[10px] text-slate-400">Monthly pace</span>
        </div>
      </div>

      {/* 2. Additional Guest Nights */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-amber-600" />
              Guest Nights / Mo
            </span>
            <DataStatusChip status="Derived" size="sm" />
          </div>

          {hasGuestNights ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-display">
                  {result.guestNights.scenario?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">nights</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold font-mono text-amber-700 bg-amber-50">
                <TrendingUp className="w-3.5 h-3.5" />
                {result.guestNights.diff && result.guestNights.diff >= 0 ? `+${result.guestNights.diff.toLocaleString()}` : result.guestNights.diff?.toLocaleString()}
                ({result.guestNights.pct && result.guestNights.pct >= 0 ? `+${result.guestNights.pct.toFixed(1)}%` : `${result.guestNights.pct?.toFixed(1)}%`})
              </div>
            </>
          ) : (
            <div className="py-2">
              <span className="text-sm font-semibold text-slate-400 italic">Not yet directly supported</span>
              <p className="text-[10px] text-slate-400 mt-1">Requires linked ALOS dataset.</p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">{result.guestNights.statusNote}</span>
          <span className="font-mono text-[10px] font-bold text-slate-600">
            {result.nightsPer1kSeats.scenario} nts / 1k seats
          </span>
        </div>
      </div>

      {/* 3. Percentage Change in Hotel Demand */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Market Demand Shift
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              AUH Inbound
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-extrabold font-display ${isPositiveGuests ? 'text-teal-700' : 'text-rose-700'}`}>
              {result.hotelGuests.pct >= 0 ? `+${result.hotelGuests.pct.toFixed(1)}%` : `${result.hotelGuests.pct.toFixed(1)}%`}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-2 leading-snug">
            Yields <strong className="text-slate-900 font-mono">{result.guestsPer1kSeats.scenario}</strong> hotel guests per 1,000 scheduled seats.
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Efficiency metric</span>
          <span className="font-medium text-teal-800">
            {result.guestsPer1kSeats.scenario > 400 ? 'High conversion' : 'Moderate conversion'}
          </span>
        </div>
      </div>

      {/* 4. Confidence / Support Status */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <SupportIcon className="w-3.5 h-3.5" />
              Evidence Confidence
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">
              {result.confidenceScore}/100
            </span>
          </div>

          <div className="my-1">
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border tracking-wide uppercase ${support.color}`}>
              {support.label}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {result.supportExplanation}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Historical coverage</span>
          <span className="font-semibold text-slate-700">
            {result.supportLevel === 'OUT_OF_SUPPORT' ? 'Analogue proxies' : 'Direct history'}
          </span>
        </div>
      </div>
    </div>
  );
};
