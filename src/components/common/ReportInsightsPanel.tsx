import React, { useState } from 'react';
import { EdaService } from '../../services/edaService';
import { EdaInsight } from '../../data/edaInsights';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Filter,
} from 'lucide-react';

interface Props {
  categoryFilter?: EdaInsight['category'];
  compact?: boolean;
}

export const ReportInsightsPanel: React.FC<Props> = ({ categoryFilter, compact = false }) => {
  const allInsights = EdaService.getAllInsights();
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'all');
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  const displayedInsights = allInsights.filter((insight) => {
    if (categoryFilter) return insight.category === categoryFilter;
    if (selectedCategory === 'all') return true;
    return insight.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'All Findings' },
    { id: 'target-definition', label: 'Target Definition' },
    { id: 'arrival-share', label: 'Arrival Shares' },
    { id: 'seasonality', label: 'Seasonality Patterns' },
    { id: 'aviation-composition', label: 'Aviation Composition' },
    { id: 'market-associations', label: 'Market Associations' },
    { id: 'data-coverage', label: 'Data Coverage' },
    { id: 'modelling-decisions', label: 'Modelling Decisions' },
  ];

  const toggleExpand = (id: string) => {
    setExpandedInsightId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5"
      id="report-insights-panel"
      aria-labelledby="report-insights-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-teal-700" />
              Empirical Research Findings
            </span>
            <span className="text-[11px] text-slate-500 font-mono">DCT_EDA_Report.pdf (Sep 2026)</span>
          </div>
          <h2 id="report-insights-heading" className="text-lg font-extrabold text-slate-900 font-display mt-1">
            What the research currently tells us
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Key empirical findings, statistical limits, and business implications derived from the official exploratory data analysis.
          </p>
        </div>

        {!categoryFilter && !compact && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="flex gap-1">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-teal-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Concise Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayedInsights.map((insight) => {
          const isExpanded = expandedInsightId === insight.id;

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isExpanded
                  ? 'border-teal-500 bg-teal-50/20 shadow-xs ring-1 ring-teal-500/20'
                  : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-xs leading-snug font-display">
                    {insight.title}
                  </h3>
                  <span className="shrink-0 text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    p. {insight.sourcePage}
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {insight.summary}
                </p>

                {/* Plain-Language Business Meaning */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[10.5px]">
                    <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Why it matters for DCT:</span>
                  </div>
                  <p className="leading-snug text-slate-600">
                    {insight.businessMeaning}
                  </p>
                </div>
              </div>

              {/* Expandable Technical Details & Limitations */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() => toggleExpand(insight.id)}
                  className="w-full flex items-center justify-between text-[11px] font-semibold text-teal-800 hover:text-teal-950 py-0.5"
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? 'Hide evidence & limits' : 'View report evidence & limits'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-2.5 space-y-2 text-[11px] animate-in fade-in duration-100">
                    <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                      <strong className="text-slate-900 block mb-0.5 font-mono text-[10px] uppercase">
                        Evidence (Page {insight.sourcePage}):
                      </strong>
                      <p className="leading-relaxed text-[10.5px]">{insight.evidence}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-950">
                      <div className="flex items-center gap-1 font-bold text-[10px] text-amber-900 uppercase">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Important Limitation:</span>
                      </div>
                      <p className="mt-0.5 leading-relaxed text-[10.5px] text-amber-900">
                        {insight.limitation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
