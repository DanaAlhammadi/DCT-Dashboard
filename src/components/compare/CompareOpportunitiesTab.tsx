import React, { useState } from 'react';
import { SavedScenario, ScenarioResult } from '../../types';
import { 
  GitCompare, 
  Trash2, 
  ExternalLink, 
  Copy, 
  HelpCircle, 
  AlertTriangle, 
  Award, 
  ShieldCheck, 
  FileDown, 
  Printer, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { MOCK_ANALOGUES } from '../../data/mockData';

interface Props {
  savedScenarios: SavedScenario[];
  currentResult: ScenarioResult | null;
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
  onDuplicateScenario: (scenario: SavedScenario) => void;
  onOpenDecisionBrief: () => void;
}

export const CompareOpportunitiesTab: React.FC<Props> = ({
  savedScenarios,
  currentResult,
  onLoadScenario,
  onDeleteScenario,
  onDuplicateScenario,
  onOpenDecisionBrief,
}) => {
  const [selectedAnalogueMarket, setSelectedAnalogueMarket] = useState<string>('Japan');

  // Matrix data
  const matrixData = savedScenarios.map((scen) => ({
    name: scen.name,
    market: scen.marketLabel,
    confidence: scen.confidenceScore,
    impact: Math.abs(scen.addedGuests),
    seats: Math.max(2000, Math.abs(scen.addedSeats)),
    supportLevel: scen.supportLevel,
    isReduction: scen.addedSeats < 0,
    scenarioObj: scen,
  }));

  const analogues = MOCK_ANALOGUES[selectedAnalogueMarket] || MOCK_ANALOGUES['Japan'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="compare-opportunities-tab">
      {/* Title & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Strategic Prioritisation
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">
            Compare Aviation Route Opportunities
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Evaluate alternative route expansions, load-factor assumptions, and capacity interventions on equal footing across impact, confidence, and seasonal alignment.
          </p>
        </div>

        <button
          id="compare-export-brief-btn"
          type="button"
          onClick={onOpenDecisionBrief}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Decision Brief</span>
        </button>
      </div>

      {/* Section A: Scenario Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Scenario Evaluation Matrix ({savedScenarios.length} Scenarios)
            </h3>
            <p className="text-xs text-slate-500">
              Direct comparison of expected hotel gains, efficiency ratios, and evidence support.
            </p>
          </div>
        </div>

        {savedScenarios.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <GitCompare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-600" />
            <p className="text-sm font-semibold text-slate-700">No saved scenarios yet</p>
            <p className="text-xs text-slate-500 mt-1">Run a scenario in the Planner tab and click "Save Scenario" to compare proposals.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse" id="scenario-comparison-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3">Scenario & Route</th>
                  <th className="p-3">Timeframe</th>
                  <th className="p-3">Added Seats</th>
                  <th className="p-3">Added Guests</th>
                  <th className="p-3">Guest Nights</th>
                  <th className="p-3">Guests / 1k Seats</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Support</th>
                  <th className="p-3">Badges & Focus</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {savedScenarios.map((scen) => (
                  <tr key={scen.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-sans">
                      <strong className="text-slate-900 block font-semibold">{scen.name}</strong>
                      <span className="text-[11px] text-slate-500">{scen.routeLabel}</span>
                    </td>
                    <td className="p-3 font-sans text-slate-600 text-[11px] whitespace-nowrap">
                      {scen.dateRange}
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {scen.addedSeats >= 0 ? `+${scen.addedSeats.toLocaleString()}` : scen.addedSeats.toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-teal-800">
                      {scen.addedGuests >= 0 ? `+${scen.addedGuests.toLocaleString()}` : scen.addedGuests.toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-amber-800">
                      {scen.addedNights ? `+${scen.addedNights.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="p-3 text-slate-700">
                      {scen.guestsPer1kSeats}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        scen.confidenceScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {scen.confidenceScore}/100
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        scen.supportLevel === 'SUPPORTED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : scen.supportLevel === 'LIMITED_SUPPORT'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-orange-50 text-orange-800 border-orange-300'
                      }`}>
                        {scen.supportLevel.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-sans">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {scen.badges.map((b, bIdx) => (
                          <span key={bIdx} className="text-[9.5px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`load-scenario-${scen.id}`}
                          onClick={() => onLoadScenario(scen)}
                          title="Load in Scenario Planner"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`dup-scenario-${scen.id}`}
                          onClick={() => onDuplicateScenario(scen)}
                          title="Duplicate Scenario"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`del-scenario-${scen.id}`}
                          onClick={() => onDeleteScenario(scen.id)}
                          title="Delete Scenario"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section B: Impact vs Confidence Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Decision Framework
          </span>
          <h3 className="text-base font-bold text-slate-900 font-display mt-1">
            Impact-versus-Confidence Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Plotting potential hotel-demand gains against model certainty ensures DCT balances quick wins against exploratory high-yield routes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="confidence"
                  name="Prediction Confidence"
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  unit="%"
                  label={{ value: 'Evidence / Prediction Confidence →', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  name="Additional Hotel Guests"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => v.toLocaleString()}
                  label={{ value: 'Expected Additional Hotel Guests / Mo →', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#475569' }}
                />
                <ZAxis type="number" dataKey="seats" range={[150, 600]} name="Scheduled Seats" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any, name: any) => [name === 'Prediction Confidence' ? `${val}%` : val?.toLocaleString(), name]}
                />
                <Scatter name="Scenarios" data={matrixData} fill="#0d9488">
                  {matrixData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.confidence > 80 ? '#047857' : entry.supportLevel === 'OUT_OF_SUPPORT' ? '#d97706' : '#0d9488'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* 4 Quadrants Guide */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">1. High Impact, High Confidence</span>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Priority investments (e.g. UK / India capacity boosts). Solid historical precedent, low forecast risk.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900 block">2. High Impact, Lower Confidence</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Strategic bets (e.g. Japan / New East Asian routes). Substantial room-night yield, but requires risk sharing with airlines.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block">3. Low Impact, High Confidence</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Tactical optimizations (e.g. off-peak load factor shifts). Safe incremental gains.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section C: New-Route Analogue Finder (Standout feature) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                New-Route Analogue Finder
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Analogue Confidence: Medium
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display mt-1">
              Comparable Historical Markets for Unserved Routes
            </h3>
            <p className="text-xs text-slate-500">
              When a proposed route lacks direct historical flights (e.g. Tokyo to Abu Dhabi), the model borrows flight behavior from statistically matched analogue markets.
            </p>
          </div>
        </div>

        {/* Analogue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {analogues.map((an, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{an.market}</span>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  {an.similarityScore}% Match
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <span className="text-slate-500 block font-medium">Similarity Factors:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {an.similarityFactors.map((f, fIdx) => (
                    <li key={fIdx}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Hist. Load Factor:</span>
                  <span className="font-bold text-slate-800">{(an.historicalLoadFactor * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hotel Capture:</span>
                  <span className="font-bold text-teal-700">{(an.hotelCaptureRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Methodology Transparency:</strong> Analogue matching maps flight duration, inbound GDP per capita, cabin class proportions, and hotel capture. Analogue estimates are exploratory benchmarks and <em>not direct historical evidence</em>.
          </p>
        </div>
      </div>

      {/* Section D: Route Loss & Early-Warning View */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Route Loss & Early-Warning Monitoring
            </h3>
            <p className="text-xs text-slate-500">
              Simulates downstream room-night deficits in the event of carrier frequency cuts or route discontinuations.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Winter Capacity Vulnerability Advisory:</span>
          </div>
          <p className="leading-relaxed">
            Winter hotel demand is highly sensitive to European flight frequencies. A 2-frequency reduction from Frankfurt or London during peak season (Dec–Feb) projects a monthly loss of ~2,400 hotel guests and over 10,500 guest nights.
          </p>
          <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
            <span><strong>Recommended Lead Time:</strong> 90 days prior to schedule release</span>
            <span><strong>Strategic Action:</strong> Engage airline route committees to discuss frequency protections</span>
          </div>
        </div>
      </div>
    </div>
  );
};
