import React from 'react';
import { SavedScenario, ScenarioResult } from '../../types/dashboard';
import { InfoTooltip } from '../common/InfoTooltip';
import {
  GitCompare,
  Trash2,
  ExternalLink,
  Award,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileDown,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
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
import { DataStatusChip } from '../common/DataStatusChip';

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
  onLoadScenario,
  onDeleteScenario,
  onOpenDecisionBrief,
}) => {
  // Enforce max 3 saved scenarios
  const scenariosToCompare = savedScenarios.slice(0, 3);

  // Scatter chart data
  const chartData = scenariosToCompare.map((scen) => ({
    name: scen.name,
    market: scen.marketLabel,
    confidence: scen.confidenceScore,
    impact: Math.abs(scen.addedGuests),
    seats: Math.max(2000, Math.abs(scen.addedSeats)),
    supportLevel: scen.supportLevel,
    recommendation: scen.recommendation || scen.result?.decisionSummary?.recommendedAction,
    mainUncertainty: scen.mainUncertainty,
    scenarioObj: scen,
  }));

  const getSupportBadge = (level: string) => {
    switch (level) {
      case 'SUPPORTED':
        return { label: 'SUPPORTED', color: 'text-emerald-800 bg-emerald-50 border-emerald-300', icon: ShieldCheck };
      case 'LIMITED_SUPPORT':
        return { label: 'LIMITED SUPPORT', color: 'text-amber-800 bg-amber-50 border-amber-300', icon: AlertTriangle };
      case 'OUT_OF_SUPPORT':
      default:
        return { label: 'OUT OF SUPPORT', color: 'text-orange-800 bg-orange-50 border-orange-300', icon: HelpCircle };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="compare-opportunities-tab">
      {/* Title & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Strategic Prioritisation
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">
            Compare Opportunities
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Evaluate up to three saved aviation scenarios side-by-side across predicted hotel impact, confidence score, support status, and main uncertainties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {scenariosToCompare.length} / 3 Scenarios Compared
          </span>
          <button
            id="compare-export-brief-btn"
            type="button"
            onClick={onOpenDecisionBrief}
            className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Decision Brief</span>
          </button>
        </div>
      </div>

      {scenariosToCompare.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Saved Scenarios Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Run a scenario in the Scenario Planner and click “Save” to compare it against other strategic opportunities here (up to 3).
          </p>
        </div>
      ) : (
        <>
          {/* 1. Comparison Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Scenario Comparison Table
                </h3>
                <p className="text-xs text-slate-500">
                  Direct evaluation of scheduled seats, predicted arrivals, evidence status, and core uncertainties.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-bold">Scenario & Route</th>
                    <th className="py-3 px-3 font-bold">Timing</th>
                    <th className="py-3 px-3 text-right font-bold">Added Seats</th>
                    <th className="py-3 px-3 text-right font-bold">Predicted New Arrivals</th>
                    <th className="py-3 px-3 text-center font-bold">
                      <div className="inline-flex items-center gap-1 justify-center">
                        <span>Forecast Reliability</span>
                        <InfoTooltip
                          title="Forecast Reliability"
                          businessTerm="How reliably historical flight and hotel data supports this projection."
                          technicalDefinition="Model Support Status (SUPPORTED, LIMITED SUPPORT, OUT OF SUPPORT)."
                          position="bottom"
                        />
                      </div>
                    </th>
                    <th className="py-3 px-4 font-bold">Main Uncertainty</th>
                    <th className="py-3 px-4 font-bold">Scenario Recommendation</th>
                    <th className="py-3 px-3 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scenariosToCompare.map((scen) => {
                    const badge = getSupportBadge(scen.supportLevel);
                    const BadgeIcon = badge.icon;
                    return (
                      <tr key={scen.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>
                            <span className="text-slate-900 font-semibold">{scen.name}</span>
                            <span className="block text-[11px] text-slate-500 font-mono font-normal mt-0.5">
                              {scen.routeLabel}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-medium">
                          {scen.dateRange}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                          {scen.addedSeats > 0 ? `+${scen.addedSeats.toLocaleString()}` : scen.addedSeats.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="font-mono font-extrabold text-teal-800 text-sm">
                            {scen.addedGuests > 0 ? `+${scen.addedGuests.toLocaleString()}` : scen.addedGuests.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {scen.guestsPer1kSeats} / 1k seats
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed text-[11px]">
                          {scen.mainUncertainty || 'Standard seasonal variations.'}
                        </td>
                        <td className="py-3.5 px-4 text-teal-950 font-medium max-w-xs leading-relaxed text-[11px] bg-teal-50/40 rounded">
                          {scen.recommendation || scen.result?.decisionSummary?.recommendedAction || 'Recommended for evaluation.'}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onLoadScenario(scen)}
                              className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                              title="Load into Scenario Planner"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteScenario(scen.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>
                <strong>What this table shows:</strong> Comparing up to 3 saved scenarios side-by-side allows DCT planners to weigh high-volume vs. high-efficiency flight interventions.
              </span>
              <span className="text-[11px] text-slate-400">Guest Nights: Pending stay-duration module</span>
            </div>
          </div>

          {/* 2. Impact-versus-Confidence Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Risk vs Return Matrix
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                  Impact vs. Confidence Chart
                </h3>
                <p className="text-xs text-slate-500">
                  Visual mapping of predicted hotel arrivals (Impact) against evidence certainty (Confidence Score).
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-700" /> Supported
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Limited Support
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500" /> Out of Support
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="confidence"
                    name="Evidence Confidence"
                    domain={[40, 100]}
                    unit="/100"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Evidence Confidence Score (Higher = Stronger Historical Support)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="impact"
                    name="Predicted Hotel Arrivals"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                    label={{ value: 'Predicted New Hotel Arrivals', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#475569' }}
                  />
                  <ZAxis type="number" dataKey="seats" range={[150, 450]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                    formatter={(val: any, name?: any) => {
                      if (name === 'Evidence Confidence') return [`${val}/100`, String(name)];
                      if (name === 'Predicted Hotel Arrivals') return [val?.toLocaleString(), String(name)];
                      return [val, String(name || '')];
                    }}
                  />
                  <Scatter data={chartData} name="Scenarios">
                    {chartData.map((entry, index) => {
                      const color =
                        entry.supportLevel === 'SUPPORTED'
                          ? '#0f766e'
                          : entry.supportLevel === 'LIMITED_SUPPORT'
                          ? '#f59e0b'
                          : '#ea580c';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border-t border-slate-100">
              <strong>What this means:</strong> Scenarios in the top-right quadrant (e.g. UK Winter Capacity Boost) deliver high incremental hotel volume with low forecasting risk because they are backed by extensive historical flight data.
            </div>
          </div>

          {/* 3. Scenario Recommendation Summary */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Strategic Recommendation for Portfolio
                </h3>
                <p className="text-xs text-slate-300">
                  Consolidated advisory for airline negotiations and marketing subsidies
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {scenariosToCompare.map((scen, idx) => (
                <div key={scen.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-300 text-xs truncate">
                      Option {idx + 1}: {scen.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {scen.confidenceScore}/100 Conf.
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-[11.5px]">
                    {scen.recommendation || scen.result?.decisionSummary?.recommendedAction || 'Recommended for DCT commercial review.'}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[10.5px] text-slate-400">
                    <strong className="text-slate-300">Uncertainty:</strong> {scen.mainUncertainty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
