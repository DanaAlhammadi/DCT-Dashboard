import React from 'react';
import { SavedScenario, ScenarioResult } from '../../types/dashboard';
import {
  GitCompare,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileDown,
  ArrowRight,
  TrendingUp,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

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
  const scenariosToCompare = savedScenarios.slice(0, 3);

  // Scatter plot data for Impact vs Confidence
  const chartData = scenariosToCompare.map((scen, idx) => ({
    name: scen.name,
    market: scen.marketLabel,
    confidence: scen.confidenceScore,
    impact: Math.abs(scen.addedGuests),
    seats: scen.addedSeats,
    supportLevel: scen.supportLevel,
    uncertainty: scen.mainUncertainty,
    period: `${scen.input.startMonth} to ${scen.input.endMonth}`,
    id: scen.id,
    color: idx === 0 ? '#0d9488' : idx === 1 ? '#0284c7' : '#d97706',
  }));

  const getSupportBadge = (level: string) => {
    switch (level) {
      case 'SUPPORTED':
        return {
          label: 'High Reliability',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'LIMITED_SUPPORT':
        return {
          label: 'Moderate Reliability',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'OUT_OF_SUPPORT':
      default:
        return {
          label: 'Proxy Estimate',
          badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-500',
        };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-150 max-w-5xl mx-auto" id="compare-opportunities-tab">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 font-display">
          Compare Strategic Opportunities
        </h1>
        <p className="text-sm sm:text-base text-stone-500 font-normal leading-relaxed">
          Side-by-side evaluation of up to three saved aviation decisions.
        </p>
      </div>

      {scenariosToCompare.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200/80 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-800">No saved scenarios yet</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Run a scenario in the Scenario tab and click "Save" to compare multiple route options side-by-side.
          </p>
        </div>
      ) : (
        <>
          {/* Visual: Impact vs Confidence Scatter Quadrant */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                  Impact vs. Evidence Reliability
                </h3>
                <p className="text-xs text-stone-500">
                  Compares estimated hotel check-in gains against historical support confidence.
                </p>
              </div>

              <span className="text-[11px] font-medium text-stone-500">
                {scenariosToCompare.length} of 3 scenarios compared
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis
                    type="number"
                    dataKey="confidence"
                    name="Evidence Confidence"
                    domain={[40, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={{ stroke: '#e7e5e4' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="impact"
                    name="Additional Check-ins"
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [
                      name === 'Evidence Confidence' ? `${val}%` : `+${val.toLocaleString()} check-ins`,
                      String(name ?? ''),
                    ]}
                  />
                  <Scatter name="Scenarios" data={chartData}>
                    {chartData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 font-medium px-2">
              <span>← Lower historical evidence</span>
              <span>Higher historical evidence →</span>
            </div>
          </div>

          {/* Simple Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {scenariosToCompare.map((scen, idx) => {
              const support = getSupportBadge(scen.supportLevel);
              const colorDot = idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-sky-600' : 'bg-amber-600';

              return (
                <div
                  key={scen.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                          <span className={`w-2 h-2 rounded-full ${colorDot}`} />
                          <span>Scenario {idx + 1}</span>
                        </div>
                        <h3 className="text-base font-semibold text-stone-900 tracking-tight mt-1">
                          {scen.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteScenario(scen.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Primary Impact */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-stone-500">Projected Impact</div>
                      <div className="text-3xl font-semibold font-display tracking-tight text-teal-950 font-mono">
                        {scen.addedGuests >= 0 ? '+' : ''}
                        {scen.addedGuests.toLocaleString()}
                      </div>
                      <div className="text-xs text-stone-500">Additional hotel check-ins / mo</div>
                    </div>

                    {/* Support Status */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-stone-500">Evidence Support</div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                        <span className={`w-2 h-2 rounded-full ${support.dot}`} />
                        <span>{support.label}</span>
                      </div>
                    </div>

                    {/* Added Capacity & Timeframe */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Added Capacity</span>
                        <span className="font-semibold text-stone-800 font-mono">
                          {scen.addedSeats > 0 ? '+' : ''}
                          {scen.addedSeats.toLocaleString()} seats/mo
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Period</span>
                        <span className="font-medium text-stone-800">
                          {scen.input.startMonth}
                        </span>
                      </div>
                    </div>

                    {/* Uncertainty Note */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600 leading-relaxed">
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">
                        Key Planning Consideration
                      </span>
                      {scen.mainUncertainty}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => onLoadScenario(scen)}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Load into Scenario Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
