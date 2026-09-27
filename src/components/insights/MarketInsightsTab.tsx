import React, { useState } from 'react';
import { MOCK_MARKET_RANKINGS, MOCK_EVENTS } from '../../data/mockData';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowUpDown, 
  Award, 
  Calendar, 
  Flame, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { SupportStatusBanner } from '../common/SupportStatusBanner';

export const MarketInsightsTab: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('best_1k');
  const [sortKey, setSortKey] = useState<string>('guestsPer1kSeats');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [heatmapMetric, setHeatmapMetric] = useState<'guests' | 'efficiency' | 'nights'>('efficiency');

  // Quick Questions
  const questions = [
    {
      id: 'best_1k',
      label: 'Best market per 1,000 seats',
      answer: 'Saudi Arabia generates 636 hotel guests per 1,000 scheduled seats, followed by United Kingdom (492).',
      soWhat: 'Direct regional flights yield the highest immediate hotel occupancy because transfer leakage is under 10%.',
    },
    {
      id: 'winter_opp',
      label: 'Strongest winter opportunity',
      answer: 'United Kingdom and Germany generate over 70% of their annual Abu Dhabi hotel demand between November and March.',
      soWhat: 'Expanding winter flight frequencies from Northern Europe captures peak leisure tourism with 4.2–4.6 nights average length of stay.',
    },
    {
      id: 'demand_risk',
      label: 'Largest demand risk',
      answer: 'United States (JFK) has a 38% P2P share; over 60% of passengers are connecting onward to the Indian subcontinent.',
      soWhat: 'Adding flight capacity without dedicated Abu Dhabi stopover incentive packages risks filling hotel rooms in competing destinations.',
    },
    {
      id: 'longest_stay',
      label: 'Longest-staying market',
      answer: 'United States (4.8 nights) and United Kingdom (4.6 nights) stay more than 60% longer than the 2.8-night regional average.',
      soWhat: 'Even moderate passenger volume from these long-haul origins generates disproportionately high hotel guest-night yields.',
    },
    {
      id: 'high_confidence',
      label: 'Highest-confidence opportunity',
      answer: 'Saudi Arabia and United Kingdom feature the lowest historical prediction errors (WMAPE 6.9% & 7.2%).',
      soWhat: 'Strategic aviation investments in these established lanes have low forecast risk for hotel sector partners.',
    },
    {
      id: 'weak_conversion',
      label: 'Weakest market conversion',
      answer: 'India has very high passenger volume but converts only ~341 hotel guests per 1,000 seats due to resident repatriation & VFR stays.',
      soWhat: 'Passenger arrival counts alone overstate hotel demand. Inbound marketing must target high-end corporate and luxury leisure tiers.',
    },
  ];

  const currentQ = questions.find((q) => q.id === selectedQuestion) || questions[0];

  // Sorting
  const sortedMarkets = [...MOCK_MARKET_RANKINGS].sort((a, b) => {
    const valA = (a as any)[sortKey];
    const valB = (b as any)[sortKey];
    if (typeof valA === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // Seasonal heatmap matrix data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const marketsForHeatmap = ['Saudi Arabia', 'United Kingdom', 'Germany', 'France', 'India', 'China'];
  
  const getSeasonalIntensity = (market: string, mIndex: number) => {
    // Return relative index 0.3 - 1.0
    if (market === 'Saudi Arabia') {
      return [0.95, 0.90, 0.85, 0.80, 0.70, 0.65, 0.60, 0.65, 0.75, 0.85, 0.95, 1.0][mIndex];
    }
    if (market === 'United Kingdom' || market === 'Germany' || market === 'France') {
      return [1.0, 0.98, 0.92, 0.75, 0.55, 0.40, 0.35, 0.38, 0.50, 0.82, 0.96, 0.98][mIndex];
    }
    if (market === 'India') {
      return [0.90, 0.88, 0.85, 0.80, 0.85, 0.82, 0.78, 0.80, 0.82, 0.92, 0.95, 0.92][mIndex];
    }
    return [0.75, 0.95, 0.80, 0.70, 0.75, 0.60, 0.65, 0.68, 0.70, 0.92, 0.85, 0.80][mIndex];
  };

  // Scatter plot data for Capacity vs Conversion Quadrants
  const scatterData = [
    { name: 'Saudi Arabia', capacity: 14200, conversion: 72, guestsPer1k: 636, quadrant: 'Core Engines' },
    { name: 'United Kingdom', capacity: 18500, conversion: 72, guestsPer1k: 492, quadrant: 'Core Engines' },
    { name: 'Germany', capacity: 9800, conversion: 67, guestsPer1k: 441, quadrant: 'High Conversion Potential' },
    { name: 'France', capacity: 10400, conversion: 65, guestsPer1k: 412, quadrant: 'High Conversion Potential' },
    { name: 'China', capacity: 8900, conversion: 74, guestsPer1k: 452, quadrant: 'High Conversion Potential' },
    { name: 'India', capacity: 22800, conversion: 44, guestsPer1k: 341, quadrant: 'Volume / High Leakage' },
    { name: 'United States', capacity: 11200, conversion: 38, guestsPer1k: 246, quadrant: 'Volume / High Leakage' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="market-season-insights-tab">
      {/* Title & Scope */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Cross-Market Intelligence
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">
              Source Market & Seasonality Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Understand conversion efficiencies, seasonal strength, length of stay, and capacity gaps across Abu Dhabi's critical air corridors.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono">
            Granularity: Month × Modelled Source Market
          </span>
        </div>

        {/* Section A: Quick Question Chips */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Priority Planning Questions:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions.map((q) => (
              <button
                key={q.id}
                id={`insight-q-${q.id}`}
                type="button"
                onClick={() => setSelectedQuestion(q.id)}
                className={`text-xs font-semibold py-1.5 px-3 rounded-xl border transition-all ${
                  selectedQuestion === q.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Question Response & "So What?" Box */}
          <div className="mt-4 p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-teal-950 shrink-0">Findings:</span>
              <span className="text-teal-900 font-medium">{currentQ.answer}</span>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-teal-200/60">
              <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
                So what?
              </span>
              <span className="text-slate-800 leading-relaxed font-semibold">{currentQ.soWhat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Market Ranking Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Air Corridor Hotel Conversion Ranking
            </h3>
            <p className="text-xs text-slate-500">
              Sorted by verifiable conversion metrics rather than an unexplained single score.
            </p>
          </div>
          <span className="text-xs text-slate-400">Click column headers to sort</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse" id="market-ranking-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('market')}>
                  <div className="flex items-center gap-1">
                    <span>Source Market</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('guestsPer1kSeats')}>
                  <div className="flex items-center gap-1">
                    <span>Hotel Guests / 1k Seats</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('nightsPer1kSeats')}>
                  <div className="flex items-center gap-1">
                    <span>Guest Nights / 1k Seats</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('p2pShare')}>
                  <div className="flex items-center gap-1">
                    <span>P2P Share</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('alos')}>
                  <div className="flex items-center gap-1">
                    <span>Avg Stay (ALOS)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">Peak Season</th>
                <th className="p-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('wmape')}>
                  <div className="flex items-center gap-1">
                    <span>WMAPE (Error)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">Support Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {sortedMarkets.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-sans font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{m.market}</span>
                      <span className="text-[11px] text-slate-400 font-mono font-normal">({m.route})</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-teal-800">
                    {m.guestsPer1kSeats}
                  </td>
                  <td className="p-3 font-bold text-amber-800">
                    {m.nightsPer1kSeats.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-700">
                    {m.p2pShare}%
                  </td>
                  <td className="p-3 text-slate-700">
                    {m.alos.toFixed(1)} nights
                  </td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">
                    {m.peakSeason}
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      m.wmape <= 8.5 ? 'bg-emerald-50 text-emerald-700' : m.wmape <= 12 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {m.wmape.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      m.supportLevel === 'SUPPORTED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : m.supportLevel === 'LIMITED_SUPPORT'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-orange-50 text-orange-800 border-orange-300'
                    }`}>
                      {m.supportLevel.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section C: Seasonal Heat Map */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Seasonal Inbound Demand Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Month-by-month demand strength for primary Abu Dhabi international source markets.
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 mr-1 font-medium">Intensity:</span>
            <span className="w-3 h-3 rounded bg-teal-100 border border-teal-200" />
            <span className="text-slate-500 text-[10px]">Low</span>
            <span className="w-3 h-3 rounded bg-teal-300 ml-1" />
            <span className="w-3 h-3 rounded bg-teal-600 ml-1" />
            <span className="w-3 h-3 rounded bg-teal-900 ml-1" />
            <span className="text-slate-500 text-[10px]">Peak</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 p-3 bg-slate-50/50">
          <div className="min-w-[650px] space-y-2">
            {/* Header row with months */}
            <div className="grid grid-cols-13 gap-1.5 text-center text-xs font-bold text-slate-600">
              <div className="text-left font-sans text-slate-400">Market</div>
              {months.map((m, idx) => (
                <div key={idx} className="font-mono">{m}</div>
              ))}
            </div>

            {/* Matrix rows */}
            {marketsForHeatmap.map((mkt, rIdx) => (
              <div key={rIdx} className="grid grid-cols-13 gap-1.5 items-center">
                <div className="text-xs font-bold text-slate-800 truncate pr-2" title={mkt}>
                  {mkt}
                </div>
                {months.map((_, cIdx) => {
                  const val = getSeasonalIntensity(mkt, cIdx);
                  // Color scale:
                  let bgClass = 'bg-teal-50 text-teal-800';
                  if (val >= 0.90) bgClass = 'bg-teal-900 text-white font-bold';
                  else if (val >= 0.80) bgClass = 'bg-teal-700 text-white';
                  else if (val >= 0.65) bgClass = 'bg-teal-500 text-white';
                  else if (val >= 0.50) bgClass = 'bg-teal-300 text-teal-950';
                  else bgClass = 'bg-teal-100 text-teal-800';

                  return (
                    <div
                      key={cIdx}
                      className={`h-9 rounded-lg flex items-center justify-center text-[10.5px] font-mono transition-transform hover:scale-105 cursor-default ${bgClass}`}
                      title={`${mkt} in ${months[cIdx]}: Relative seasonal index ${(val * 100).toFixed(0)}%`}
                    >
                      {(val * 100).toFixed(0)}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          Values represent relative monthly seasonal capacity and hotel occupancy indices grounded in historical DCT monthly releases.
        </p>
      </div>

      {/* Section D: Market Capacity Gap (Scatter Plot) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Aviation Capacity vs. Hotel Conversion Quadrants
          </h3>
          <p className="text-xs text-slate-500">
            Identifies lanes with high hotel conversion that lack sufficient flight inventory, and lanes with high capacity but low capture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Chart */}
          <div className="lg:col-span-2 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="capacity"
                  name="Monthly Seats"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  label={{ value: 'Available Monthly Flight Seats →', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
                />
                <YAxis
                  type="number"
                  dataKey="conversion"
                  name="Hotel Conversion %"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  unit="%"
                  label={{ value: 'Hotel Conversion % →', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#475569' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any, name: any) => [name === 'Monthly Seats' ? val.toLocaleString() : `${val}%`, name]}
                />
                <Scatter name="Air Corridors" data={scatterData} fill="#0d9488">
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.conversion > 60 && entry.capacity > 12000 ? '#047857' : entry.conversion > 60 ? '#0d9488' : '#e11d48'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Quadrant Explanations */}
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">High Capacity / High Conversion (Core Engines)</span>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Saudi Arabia & UK: High seat volumes translate reliably into solid hotel stays with high loyalty.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
              <span className="font-bold text-teal-900 block">Low Capacity / High Conversion (Expansion Targets)</span>
              <p className="text-teal-800 text-[11px] mt-0.5">
                Germany, China & Japan: Strong tourist appetite and high commercial hotel stays; constrained by direct flight seats.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900 block">High Capacity / Low Conversion (Transfer Corridors)</span>
              <p className="text-rose-800 text-[11px] mt-0.5">
                India & US: Heavy overall flight volume, but high hub transfer leakage and returning UAE resident mix.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
