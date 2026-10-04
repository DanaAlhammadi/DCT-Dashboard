import React, { useState } from 'react';
import { MonthlyForecast } from '../../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Calendar, Sparkles } from 'lucide-react';

interface Props {
  data: MonthlyForecast[];
  supportLevel: string;
}

export const MonthlyImpactChart: React.FC<Props> = ({ data, supportLevel }) => {
  const [metric, setMetric] = useState<'guests' | 'nights'>('guests');

  const chartData = data.map((d) => ({
    month: d.month,
    baseline: metric === 'guests' ? d.baselineGuests : d.baselineNights,
    scenario: metric === 'guests' ? d.scenarioGuests : d.scenarioNights,
    confidenceMin: d.confidenceMin,
    confidenceMax: d.confidenceMax,
    eventName: d.eventName,
  }));

  const hasEvents = data.some((d) => d.eventName);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#0A2E4D]/10 shadow-xs space-y-4" id="monthly-impact-chart-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0E6B6E]">
            Timeline Forecast
          </span>
          <h2 className="text-base font-bold text-[#0A2E4D] font-display mt-1">
            Monthly Hotel Demand &amp; Uncertainty Band
          </h2>
          <p className="text-xs text-[#0A2E4D]/60">
            Projected seasonal trajectory across the simulation timeframe.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4F1EA] border border-[#0A2E4D]/10 text-xs font-semibold">
          <button
            id="monthly-toggle-guests-btn"
            type="button"
            onClick={() => setMetric('guests')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metric === 'guests'
                ? 'bg-white text-[#0A2E4D] shadow-xs font-bold'
                : 'text-[#0A2E4D]/60 hover:text-[#0A2E4D]'
            }`}
          >
            Hotel Guests
          </button>
          <button
            id="monthly-toggle-nights-btn"
            type="button"
            onClick={() => setMetric('nights')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metric === 'nights'
                ? 'bg-white text-[#0A2E4D] shadow-xs font-bold'
                : 'text-[#0A2E4D]/60 hover:text-[#0A2E4D]'
            }`}
          >
            Guest Nights
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8DE" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#0A2E4D' }}
              axisLine={{ stroke: '#0A2E4D', strokeOpacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#0A2E4D', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A2E4D',
                borderRadius: '12px',
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#F4F1EA',
              }}
              itemStyle={{ color: '#F4F1EA', fontSize: '12px' }}
              formatter={(val: any, name: any) => [val?.toLocaleString(), name]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item?.eventName ? `${label} (${item.eventName})` : label;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            {/* Uncertainty band area */}
            <Area
              dataKey="confidenceMax"
              name="Uncertainty Range (Max)"
              stroke="transparent"
              fill="#0E6B6E"
              fillOpacity={0.12}
            />
            <Area
              dataKey="confidenceMin"
              name="Uncertainty Range (Min)"
              stroke="transparent"
              fill="#ffffff"
            />
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline Trajectory"
              stroke="#0A2E4D"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#0A2E4D' }}
            />
            <Line
              type="monotone"
              dataKey="scenario"
              name="Scenario Trajectory"
              stroke="#0E6B6E"
              strokeWidth={3}
              dot={{ r: 4, fill: '#0E6B6E' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Events indicator banner */}
      {hasEvents && (
        <div className="p-3 bg-[#F4F1EA] border border-[#D4AF37]/40 rounded-xl text-xs text-[#0A2E4D] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B45309] shrink-0" />
          <span>
            <strong>Active Event Overlay:</strong> Special event tourism draws (e.g. Culture Summit / Abu Dhabi Grand Prix) are factored into timeline calculations.
          </span>
        </div>
      )}
    </div>
  );
};
