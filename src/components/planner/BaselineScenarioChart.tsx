import React, { useState } from 'react';
import { ScenarioResult } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface Props {
  result: ScenarioResult;
}

export const BaselineScenarioChart: React.FC<Props> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'absolute' | 'percentage'>('absolute');

  const data = [
    {
      name: 'Total Seats',
      baseline: result.totalSeats.baseline,
      scenario: result.totalSeats.scenario,
      diffPct: result.totalSeats.pct,
    },
    {
      name: 'Total PAX',
      baseline: result.totalPax.baseline,
      scenario: result.totalPax.scenario,
      diffPct: result.totalPax.pct,
    },
    {
      name: 'Total P2P',
      baseline: result.totalP2P.baseline,
      scenario: result.totalP2P.scenario,
      diffPct: result.totalP2P.pct,
    },
    {
      name: 'Inbound Visitors',
      baseline: result.inboundVisitors.baseline,
      scenario: result.inboundVisitors.scenario,
      diffPct: result.inboundVisitors.pct,
    },
    {
      name: 'Hotel Guests',
      baseline: result.hotelGuests.baseline,
      scenario: result.hotelGuests.scenario,
      diffPct: result.hotelGuests.pct,
    },
    {
      name: 'Guest Nights',
      baseline: result.guestNights.baseline ?? 0,
      scenario: result.guestNights.scenario ?? 0,
      diffPct: result.guestNights.pct ?? 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4" id="baseline-scenario-chart-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Comparative Analysis
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            Baseline vs. Scenario Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Compare volumes across all flight and hotel metrics side-by-side.
          </p>
        </div>

        {/* Absolute vs Percentage Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            id="chart-toggle-abs-btn"
            type="button"
            onClick={() => setViewMode('absolute')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'absolute'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Absolute Values
          </button>
          <button
            id="chart-toggle-pct-btn"
            type="button"
            onClick={() => setViewMode('percentage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'percentage'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % Change
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'absolute' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                formatter={(val: any) => [val?.toLocaleString(), '']}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="baseline" name="Baseline (Current)" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="scenario" name="Scenario (Simulated)" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                formatter={(val: any) => [`${parseFloat(val).toFixed(1)}%`, 'Change vs Baseline']}
              />
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

      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
        <span>
          <strong>Insight:</strong> Scheduled seat shifts convert into hotel guests at approximately{' '}
          <span className="font-bold text-teal-800 font-mono">{result.guestsPer1kSeats.scenario} guests</span> per 1,000 scheduled seats.
        </span>
      </div>
    </div>
  );
};
