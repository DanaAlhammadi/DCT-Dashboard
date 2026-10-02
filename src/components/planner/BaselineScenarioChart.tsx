import React, { useState } from 'react';
import { ScenarioResult } from '../../types/dashboard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Info, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  result: ScenarioResult;
}

export const BaselineScenarioChart: React.FC<Props> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'absolute' | 'percentage'>('absolute');

  // Display confirmed analytical targets with beginner-friendly labels & explanations
  const data = [
    {
      step: 'Step 1',
      name: 'Flight Seats',
      fullName: 'Scheduled Airline Seats',
      desc: 'Total airplane capacity scheduled to fly into Abu Dhabi',
      technicalDef: 'Commercial scheduled seats on this route per month.',
      baseline: result.totalSeats.baseline,
      scenario: result.totalSeats.scenario,
      diff: result.totalSeats.diff,
      diffPct: result.totalSeats.pct,
    },
    {
      step: 'Step 2',
      name: 'Arriving Passengers',
      fullName: 'Total Arriving Passengers',
      desc: 'All travelers flying into AUH airport (including transit)',
      technicalDef: 'Total PAX: Aviation passenger count (Scheduled Seats × Load Factor).',
      baseline: result.totalPax.baseline,
      scenario: result.totalPax.scenario,
      diff: result.totalPax.diff,
      diffPct: result.totalPax.pct,
    },
    {
      step: 'Step 3',
      name: 'Direct Visitors',
      fullName: 'Direct Abu Dhabi Visitors',
      desc: 'Passengers ending their journey in Abu Dhabi rather than connecting elsewhere',
      technicalDef: 'Point-to-Point (P2P) Passengers = Total PAX − Transfer PAX − Transit PAX.',
      baseline: result.totalP2P.baseline,
      scenario: result.totalP2P.scenario,
      diff: result.totalP2P.diff,
      diffPct: result.totalP2P.pct,
    },
    {
      step: 'Step 4',
      name: 'Inbound Tourists',
      fullName: 'Inbound Tourists & Travelers',
      desc: 'International visitors entering the emirate for business or holiday',
      technicalDef: 'Direct Visitors × (1 − Returning UAE Resident Expatriates Share).',
      baseline: result.inboundVisitors.baseline,
      scenario: result.inboundVisitors.scenario,
      diff: result.inboundVisitors.diff,
      diffPct: result.inboundVisitors.pct,
    },
    {
      step: 'Step 5',
      name: 'Hotel Check-ins',
      fullName: 'Commercial Hotel Arrivals',
      desc: 'Guests checking into Abu Dhabi hotels for overnight stays',
      technicalDef: 'Target metric: Commercial hotel arrivals based on market conversion capture rate.',
      baseline: result.hotelGuests.baseline,
      scenario: result.hotelGuests.scenario,
      diff: result.hotelGuests.diff,
      diffPct: result.hotelGuests.pct,
    },
  ];

  // Custom beginner-friendly tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const isPositive = item.diff >= 0;

      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs space-y-2 backdrop-blur-xs">
          <div className="border-b border-slate-700/80 pb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
              {item.step}
            </span>
            <h4 className="font-bold text-sm text-white">{item.fullName}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>
          </div>

          {viewMode === 'absolute' ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 inline-block" />
                  Current Baseline:
                </span>
                <span className="font-mono font-bold text-white">
                  {item.baseline ? item.baseline.toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-teal-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-500 inline-block" />
                  Planned Scenario:
                </span>
                <span className="font-mono font-bold text-teal-200">
                  {item.scenario ? item.scenario.toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Net Change:</span>
                <span
                  className={`font-mono font-bold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.diff ? item.diff.toLocaleString() : '0'} ({isPositive ? '+' : ''}
                  {item.diffPct ? item.diffPct.toFixed(1) : '0.0'}%)
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Change from baseline:</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    item.diffPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.diffPct >= 0 ? '+' : ''}
                  {item.diffPct?.toFixed(1)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                <span>Baseline: {item.baseline?.toLocaleString()}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-teal-300">Scenario: {item.scenario?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Technical definition tooltip block */}
          {item.technicalDef && (
            <div className="pt-1.5 mt-1 border-t border-slate-700/80 text-[10px]">
              <span className="text-teal-400 font-bold block uppercase tracking-wider text-[9px] mb-0.5">
                Technical Definition:
              </span>
              <p className="font-mono text-slate-300 leading-tight">
                {item.technicalDef}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4"
      id="baseline-scenario-chart-card"
    >
      {/* 1. Header with plain-language title and subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
              Comparative Impact
            </span>
            <span className="text-[11px] text-slate-500 font-medium">5 Funnel Stages</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 font-display mt-1.5">
            Flight-to-Hotel Impact: Baseline vs. Planned Scenario
          </h2>

          {/* Plain-Language Subtitle */}
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            See step-by-step how scheduled airline seats turn into actual hotel check-ins in Abu
            Dhabi, comparing what happens today against your planned flight changes.
          </p>
        </div>

        {/* Absolute Numbers vs Percentage Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold shrink-0 self-start sm:self-auto">
          <button
            id="chart-toggle-abs-btn"
            type="button"
            onClick={() => setViewMode('absolute')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'absolute'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Actual Counts
          </button>
          <button
            id="chart-toggle-pct-btn"
            type="button"
            onClick={() => setViewMode('percentage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'percentage'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % Change
          </button>
        </div>
      </div>

      {/* 2. One sentence explaining why it matters */}
      <div
        className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-950"
        id="chart-why-it-matters-banner"
      >
        <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
            Why this matters:
          </span>
          <p className="text-slate-800 mt-0.5 leading-relaxed font-medium">
            This shows whether extra flight capacity actually delivers paying hotel guests to Abu
            Dhabi or simply adds transit passengers passing through the airport.
          </p>
        </div>
      </div>

      {/* 3. Obvious, beginner-friendly legend */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50/90 border border-slate-200/80 rounded-xl text-xs"
        id="chart-obvious-legend"
      >
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Legend:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {viewMode === 'absolute' ? (
            <>
              {/* Grey Bar Legend */}
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-slate-400 shadow-2xs inline-block" />
                <span className="text-slate-700">
                  <strong className="text-slate-900">Grey Bar = Current Baseline</strong>{' '}
                  <span className="text-slate-500 hidden sm:inline">(What happens right now)</span>
                </span>
              </div>

              {/* Teal Bar Legend */}
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-teal-700 shadow-2xs inline-block" />
                <span className="text-slate-700">
                  <strong className="text-teal-900">Teal Bar = Planned Scenario</strong>{' '}
                  <span className="text-slate-500 hidden sm:inline">(Result with flight changes)</span>
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-teal-700 shadow-2xs inline-block" />
              <span className="text-slate-700">
                <strong className="text-teal-900">Teal Bar = Percentage Growth</strong>{' '}
                <span className="text-slate-500">
                  (% increase or decrease compared to current baseline)
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Chart container */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'absolute' ? (
            <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="baseline"
                name="Current Baseline"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="scenario"
                name="Planned Scenario"
                fill="#0f766e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="diffPct"
                name="% Change vs Baseline"
                fill="#0f766e"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 5. Plain-language conversion outcome & status note */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <p className="text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Key Takeaway:</strong> Each 1,000 additional scheduled
          airline seats generates approximately{' '}
          <strong className="text-teal-800 font-mono font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
            {result.guestsPer1kSeats.scenario} new commercial hotel arrivals
          </strong>{' '}
          in Abu Dhabi.
        </p>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Note on Hotel Guest Nights:</strong> Not plotted because stay-duration data is
            still pending validation (Status: <em>Guest Nights — not yet supported</em>).
          </span>
        </div>
      </div>
    </div>
  );
};
