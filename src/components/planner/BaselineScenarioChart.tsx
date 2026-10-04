import React, { useState } from 'react';
import { SilaScenarioResponse, SilaMonthlyPrediction, SilaNationalitySummary } from '../../types/silaScenario';
import { ScenarioResult, MonthlyForecast } from '../../types/dashboard';
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
import { Calendar, Globe, Info, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  silaResponse?: SilaScenarioResponse | null;
  result?: ScenarioResult | null;
}

function formatVal(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'Unavailable';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);
}

function formatChange(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'Unavailable';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val)}`;
}

export const BaselineScenarioChart: React.FC<Props> = ({ silaResponse, result }) => {
  const [activeMetric, setActiveMetric] = useState<'checkins' | 'guest_days'>('checkins');

  // Authoritative monthly[] array from backend response
  const monthlyData: SilaMonthlyPrediction[] = silaResponse?.monthly && silaResponse.monthly.length > 0
    ? silaResponse.monthly
    : result?.monthlyBreakdown
      ? result.monthlyBreakdown.map((m: MonthlyForecast) => ({
          month: m.month,
          baseline: m.baselineGuests,
          scenario: m.scenarioGuests,
          change: m.scenarioGuests - m.baselineGuests,
          baseline_recorded_guest_days: null,
          scenario_recorded_guest_days: null,
          change_recorded_guest_days: null,
        }))
      : [];

  // Authoritative by_nationality[] array from backend response (kept strictly separate from monthly)
  const nationalitySummaries: SilaNationalitySummary[] = silaResponse?.by_nationality || [];

  // Chart data format
  const chartData = monthlyData.map((m) => {
    const isGuestDays = activeMetric === 'guest_days';
    const base = isGuestDays
      ? (m.baseline_recorded_guest_days ?? null)
      : (m.baseline ?? null);
    const scen = isGuestDays
      ? (m.scenario_recorded_guest_days ?? null)
      : (m.scenario ?? null);
    const diff = isGuestDays
      ? (m.change_recorded_guest_days ?? null)
      : (m.change ?? null);

    return {
      month: m.month,
      baseline: base,
      scenario: scen,
      change: diff,
      lower_bound: m.lower_bound ?? null,
      upper_bound: m.upper_bound ?? null,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-[#0A2E4D] text-[#F4F1EA] p-3.5 rounded-2xl shadow-xl border border-[#0A2E4D]/30 max-w-xs text-xs space-y-2">
          <div className="border-b border-[#F4F1EA]/15 pb-1 flex items-center justify-between">
            <span className="font-semibold text-white">{label}</span>
            <span className="text-[10px] uppercase font-mono text-[#D4AF37]">
              {activeMetric === 'checkins' ? 'Hotel Check-ins' : 'Guest-Days Proxy'}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#F4F1EA]/80">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0A2E4D] border border-white/40" />
                Baseline:
              </span>
              <span className="font-semibold text-white">{formatVal(dataPoint.baseline)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#F4F1EA]/80">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0E6B6E]" />
                Scenario:
              </span>
              <span className="font-semibold text-[#0E6B6E]">{formatVal(dataPoint.scenario)}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#F4F1EA]/15 text-[#D4AF37]">
              <span>Net Impact:</span>
              <span className="font-bold">{formatChange(dataPoint.change)}</span>
            </div>

            <div className="pt-1 text-[10px] text-[#F4F1EA]/60 font-sans">
              Prediction interval: Prediction interval not available
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-6" id="monthly-result-chart-card">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0A2E4D]/10 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0E6B6E]">
            Backend Monthly Evaluation
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-[#0A2E4D] tracking-tight mt-0.5">
            Baseline vs. Scenario Monthly Trajectory
          </h3>
          <p className="text-xs text-[#0A2E4D]/60 font-normal">
            Derived directly from the authoritative <code className="font-mono text-[#0E6B6E]">monthly[]</code> response array.
          </p>
        </div>

        {/* Metric Selector Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#F4F1EA] border border-[#0A2E4D]/10 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric('checkins')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === 'checkins'
                ? 'bg-white text-[#0A2E4D] shadow-xs font-bold'
                : 'text-[#0A2E4D]/60 hover:text-[#0A2E4D]'
            }`}
          >
            Hotel Check-ins
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('guest_days')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMetric === 'guest_days'
                ? 'bg-white text-[#0A2E4D] shadow-xs font-bold'
                : 'text-[#0A2E4D]/60 hover:text-[#0A2E4D]'
            }`}
          >
            Recorded Guest-Days Proxy
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, left: -5, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0A2E4D" strokeOpacity={0.06} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#0A2E4D', fontWeight: 500 }}
              axisLine={{ stroke: '#0A2E4D', strokeOpacity: 0.15 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#0A2E4D', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
              formatter={(value) => (
                <span className="text-[#0A2E4D] font-medium ml-1">
                  {value === 'baseline' ? 'Baseline' : 'Scenario'}
                </span>
              )}
            />
            {/* SILA official palette colors: Baseline = Deep Navy (#0A2E4D), Scenario = Teal (#0E6B6E) */}
            <Bar dataKey="baseline" name="baseline" fill="#0A2E4D" radius={[6, 6, 0, 0]} maxBarSize={45} />
            <Bar dataKey="scenario" name="scenario" fill="#0E6B6E" radius={[6, 6, 0, 0]} maxBarSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Uncertainty Bounds Plain Language Notice */}
      <div className="p-3 rounded-xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10 flex items-center justify-between text-xs text-[#0A2E4D]/70">
        <div className="flex items-center gap-1.5 font-medium">
          <Info className="w-3.5 h-3.5 text-[#0A2E4D]/50" />
          <span>Prediction Interval:</span>
        </div>
        <span className="font-normal text-[11px] text-[#0A2E4D]/60">
          Prediction interval not available because uncertainty bounds are not calibrated.
        </span>
      </div>

      {/* NATIONALITY RESULT: by_nationality[] Period Summary Table (kept separate from monthly[]) */}
      {nationalitySummaries.length > 0 && (
        <div className="pt-4 border-t border-[#0A2E4D]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0E6B6E]" />
              <h4 className="text-xs font-semibold text-[#0A2E4D]">
                Nationality Period Summary (<code className="font-mono text-[11px] text-[#0E6B6E]">by_nationality[]</code>)
              </h4>
            </div>
            <span className="text-[10px] text-[#0A2E4D]/50">
              Aggregated across period months
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#0A2E4D]/10 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F1EA] text-[#0A2E4D] font-semibold text-[11px] border-b border-[#0A2E4D]/10">
                <tr>
                  <th className="py-2.5 px-3">Nationality</th>
                  <th className="py-2.5 px-3">Baseline Check-ins</th>
                  <th className="py-2.5 px-3">Scenario Check-ins</th>
                  <th className="py-2.5 px-3 text-[#0E6B6E]">Additional Check-ins</th>
                  <th className="py-2.5 px-3">Conversion Factor</th>
                  <th className="py-2.5 px-3">Recorded Guest-Days Proxy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A2E4D]/10 font-mono text-[11px]">
                {nationalitySummaries.map((n, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F1EA]/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold font-sans text-[#0A2E4D]">
                      {n.nationality}
                    </td>
                    <td className="py-2.5 px-3 text-[#0A2E4D]">
                      {formatVal(n.baseline)}
                    </td>
                    <td className="py-2.5 px-3 text-[#0A2E4D]">
                      {formatVal(n.scenario)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#0E6B6E]">
                      {formatChange(n.change)}
                    </td>
                    <td className="py-2.5 px-3 text-[#0A2E4D]/70 font-sans">
                      {n.conversion_factor !== null && n.conversion_factor !== undefined
                        ? `${n.conversion_factor.toFixed(2)}x`
                        : 'Unavailable'}
                    </td>
                    <td className="py-2.5 px-3 text-[#0A2E4D]/80">
                      {formatChange(n.change_recorded_guest_days)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
