import React from 'react';
import { SilaScenarioResponse, SilaErrorState } from '../../types/silaScenario';
import {
  Users,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  BarChart3,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface Props {
  result: SilaScenarioResponse | null;
  error: SilaErrorState | null;
  isLoading: boolean;
  onRetry: () => void;
  onClear: () => void;
}

/**
 * Format helper that strictly preserves null values:
 * Never replaces null with zero.
 */
function formatValue(val: number | null | undefined, fallback: string = 'Unavailable'): string {
  if (val === null || val === undefined) {
    return fallback;
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(val);
}

function formatChangeValue(val: number | null | undefined): string {
  if (val === null || val === undefined) {
    return 'Unavailable';
  }
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(val)}`;
}

export const OfficialScenarioResultView: React.FC<Props> = ({
  result,
  error,
  isLoading,
  onRetry,
  onClear,
}) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <div
        id="official-scenario-loading"
        className="p-8 rounded-2xl bg-white border border-teal-200 shadow-sm text-center space-y-4"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
          <span className="w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Evaluating Official Scenario with Python Backend…
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Running India +1,000 seats intervention (Nov–Dec 2025) through linear_v009
          </p>
        </div>
      </div>
    );
  }

  // 2. Understandable Error States (No raw Python stack traces)
  if (error) {
    const isBackendUnavailable = error.kind === 'backend_unavailable';
    const isModelNotLoaded = error.kind === 'model_not_loaded';
    const isTimeout = error.kind === 'timeout';

    return (
      <div
        id="official-scenario-error-state"
        className="p-6 rounded-2xl bg-white border border-rose-200/90 shadow-sm space-y-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                {error.kind.replace('_', ' ')}
              </span>
              <h3 className="text-base font-bold text-slate-900">{error.title}</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{error.message}</p>
            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <span className="font-semibold text-slate-800">Troubleshooting hint: </span>
              {error.actionHint}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors"
          >
            Retry Scenario Request
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // 3. No active result yet
  if (!result) {
    return null;
  }

  // Extract Guest Days Proxy fields
  const guestDaysProxyObj =
    typeof result.recorded_guest_days_proxy === 'object' && result.recorded_guest_days_proxy !== null
      ? result.recorded_guest_days_proxy
      : null;
  const guestDaysProxyNum =
    typeof result.recorded_guest_days_proxy === 'number'
      ? result.recorded_guest_days_proxy
      : null;

  // Prepare chart data for monthly: Baseline, Scenario, Change
  const monthlyChartData = result.monthly.map((m) => ({
    month: m.month,
    label: m.month === '2025-11' ? 'Nov 2025' : m.month === '2025-12' ? 'Dec 2025' : m.month,
    Baseline: m.baseline !== null ? Math.round(m.baseline) : 0,
    Scenario: m.scenario !== null ? Math.round(m.scenario) : 0,
    Change: m.change !== null ? Math.round(m.change) : 0,
    rawBaseline: m.baseline,
    rawScenario: m.scenario,
    rawChange: m.change,
    lowerBound: m.lower_bound,
    upperBound: m.upper_bound,
  }));

  const nationalityScopeStr = Array.isArray(result.nationality_scope)
    ? result.nationality_scope.join(', ')
    : String(result.nationality_scope || 'India');

  const isPositiveAdditional = (result.additional_checkins ?? 0) >= 0;

  return (
    <div id="official-scenario-result-view" className="space-y-4">
      {/* Top Banner indicating authoritative Python backend result */}
      <div className="p-3.5 rounded-xl bg-teal-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-800 text-teal-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase text-teal-200">
              Live Backend Response
            </h4>
            <p className="text-sm font-semibold text-white">
              Official India Example: +1,000 seats/month (Nov & Dec 2025)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-teal-800/80 border border-teal-700 text-teal-200">
            Backend: Connected
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-teal-100 transition-colors"
          >
            Close Result
          </button>
        </div>
      </div>

      {/* Primary KPI Grid: 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Baseline Check-ins */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                1. Baseline Check-ins
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatValue(result.baseline_checkins)}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            Reference aviation forecast
          </div>
        </div>

        {/* KPI 2: Scenario Check-ins */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                2. Scenario Check-ins
              </span>
              <BarChart3 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatValue(result.scenario_checkins)}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            With +2,000 total seats
          </div>
        </div>

        {/* KPI 3: Additional Check-ins */}
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-teal-800 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">
                3. Additional Check-ins
              </span>
              <TrendingUp className="w-4 h-4 text-teal-700" />
            </div>
            <div className="text-2xl font-black text-teal-900 tracking-tight flex items-baseline gap-1.5">
              <span>{formatChangeValue(result.additional_checkins)}</span>
              {isPositiveAdditional ? (
                <ArrowUpRight className="w-5 h-5 text-teal-700 stroke-[3]" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-rose-600 stroke-[3]" />
              )}
            </div>
          </div>
          <div className="text-[11px] font-semibold text-teal-700 pt-2 border-t border-teal-200/60 mt-2">
            Net change across 2 months
          </div>
        </div>

        {/* KPI 4: Support Status */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                4. Support Status
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm font-bold text-slate-800 tracking-tight font-mono break-all">
              {result.support_status || 'Unavailable'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
            Model evidence boundary
          </div>
        </div>
      </div>

      {/* Metadata strip under the 4 KPI cards */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Period</span>
          <span className="font-semibold text-slate-800">
            {result.period || 'November–December 2025'}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Nationality Scope</span>
          <span className="font-semibold text-slate-800">{nationalityScopeStr}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Model Version</span>
          <span className="font-mono font-semibold text-slate-800">{result.model_version}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Conversion Version</span>
          <span className="font-mono font-semibold text-slate-800">{result.conversion_version}</span>
        </div>
      </div>

      {/* Recorded Guest-Days Proxy Card (Must remain separate from check-ins; do NOT call it verified Guest Nights) */}
      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/90 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Recorded Guest-Days Proxy
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Exploratory Proxy
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Derived guest-days proxy based on historical conversion ratios. This metric must remain
              separate from check-ins and is <strong>not</strong> verified guest nights.
            </p>
          </div>
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-amber-200/70 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Baseline Proxy:</span>
            <span className="font-bold text-slate-800 text-sm">
              {guestDaysProxyObj
                ? formatValue(guestDaysProxyObj.baseline)
                : guestDaysProxyNum !== null
                ? formatValue(guestDaysProxyNum)
                : 'Unavailable'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Scenario Proxy:</span>
            <span className="font-bold text-slate-800 text-sm">
              {guestDaysProxyObj ? formatValue(guestDaysProxyObj.scenario) : 'Unavailable'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Proxy Change:</span>
            <span className="font-bold text-amber-900 text-sm">
              {guestDaysProxyObj ? formatChangeValue(guestDaysProxyObj.change) : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Output: November vs December Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Monthly Output: November vs. December 2025
            </h4>
            <p className="text-xs text-slate-500">
              Showing Baseline, Scenario, and Change from the backend monthly array.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="inline-block w-3 h-3 rounded bg-slate-400" /> Baseline
            <span className="inline-block w-3 h-3 rounded bg-teal-600 ml-2" /> Scenario
            <span className="inline-block w-3 h-3 rounded bg-emerald-500 ml-2" /> Change
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${new Intl.NumberFormat('en-US').format(Number(value))}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontSize: '0.75rem',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Change" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Table with Null checks for lower_bound / upper_bound */}
        <div className="overflow-x-auto border-t border-slate-100 pt-3">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-3">Month</th>
                <th className="py-2 px-3 text-right">Baseline</th>
                <th className="py-2 px-3 text-right">Scenario</th>
                <th className="py-2 px-3 text-right">Change</th>
                <th className="py-2 px-3">Prediction Interval</th>
                <th className="py-2 px-3">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {result.monthly.map((m) => {
                const intervalText =
                  m.lower_bound !== null && m.lower_bound !== undefined && m.upper_bound !== null && m.upper_bound !== undefined
                    ? `[${formatValue(m.lower_bound)} - ${formatValue(m.upper_bound)}]`
                    : 'Prediction interval not available';

                return (
                  <tr key={m.month} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">{m.month}</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatValue(m.baseline)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-semibold">
                      {formatValue(m.scenario)}
                    </td>
                    <td className="py-2 px-3 text-right text-teal-700 font-bold">
                      {formatChangeValue(m.change)}
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px] font-sans">
                      {intervalText}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 font-sans">
                      {m.support_status || 'historical_p2p_range'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nationality Output: by_nationality summary table (Never add with monthly) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Nationality Output (by_nationality)
            </h4>
            <p className="text-xs text-slate-500">
              Period-summary breakdown by nationality. Distinct from the monthly breakdown.
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {result.by_nationality.length} market(s) evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-3">Nationality</th>
                <th className="py-2 px-3 text-right">Baseline Check-ins</th>
                <th className="py-2 px-3 text-right">Scenario Check-ins</th>
                <th className="py-2 px-3 text-right">Additional Check-ins</th>
                <th className="py-2 px-3 text-right">Conversion Factor</th>
                <th className="py-2 px-3">Support Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {result.by_nationality.length > 0 ? (
                result.by_nationality.map((n, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans font-bold text-slate-800">{n.nationality}</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatValue(n.baseline)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-semibold">
                      {formatValue(n.scenario)}
                    </td>
                    <td className="py-2 px-3 text-right text-teal-700 font-bold">
                      {formatChangeValue(n.change)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {n.conversion_factor !== null && n.conversion_factor !== undefined
                        ? n.conversion_factor.toFixed(2)
                        : 'Unavailable'}
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] font-sans">
                      {n.support_status || result.support_status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-3 font-sans font-bold text-slate-800">{nationalityScopeStr}</td>
                  <td className="py-2 px-3 text-right text-slate-700">{formatValue(result.baseline_checkins)}</td>
                  <td className="py-2 px-3 text-right text-slate-900 font-semibold">
                    {formatValue(result.scenario_checkins)}
                  </td>
                  <td className="py-2 px-3 text-right text-teal-700 font-bold">
                    {formatChangeValue(result.additional_checkins)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">3.44</td>
                  <td className="py-2 px-3 text-slate-600 text-[11px] font-sans">
                    {result.support_status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Status & Warnings (Visible next to result, not hidden only in Trust & Assumptions) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Model Support & Warnings (Active Result)
          </h4>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2.5 py-1 rounded bg-teal-100 text-teal-800 border border-teal-200 text-xs font-mono font-medium">
            support_status: {result.support_status}
          </span>
          {result.warnings.map((w, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono"
            >
              {w}
            </span>
          ))}
          {result.warnings.length === 0 && (
            <span className="text-xs text-slate-500 italic">No critical anomalies triggered for this run.</span>
          )}
        </div>
      </div>

      {/* Model Status Card (Mandatory Governance & Origin Disclosures) */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-2 border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold uppercase tracking-wider text-[11px] text-teal-400">
            Model evaluated with limitations
          </span>
          <span className="font-mono text-[11px]">linear_v009 | conversion_v002</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] py-1">
          <div>
            <span className="text-slate-400 block">Model:</span>
            <span className="font-mono font-bold text-white">linear_v009</span>
          </div>
          <div>
            <span className="text-slate-400 block">Conversion:</span>
            <span className="font-mono font-bold text-white">conversion_v002</span>
          </div>
          <div>
            <span className="text-slate-400 block">Forecast Origin:</span>
            <span className="font-mono font-bold text-white">2024-12-31</span>
          </div>
          <div>
            <span className="text-slate-400 block">Reference Year:</span>
            <span className="font-mono font-bold text-white">2024</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">
          Future aviation inputs use repeated 2024 aviation patterns from the model’s December 2024
          origin. SILA is not connected to a live airline timetable.
        </p>
      </div>
    </div>
  );
};
