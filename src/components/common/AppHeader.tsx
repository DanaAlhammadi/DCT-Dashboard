import React from 'react';
import { InfoTooltip } from './InfoTooltip';
import { SilaLogo } from './SilaLogo';
import { 
  Building2, 
  Layers, 
  BarChart3, 
  GitCompare, 
  ShieldCheck, 
  BookOpen, 
  FileDown, 
  BookmarkCheck,
  Calendar,
  Sparkles,
  Database
} from 'lucide-react';

export type ActiveTab = 'planner' | 'insights' | 'compare' | 'trust';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenGlossary: () => void;
  onExportBrief: () => void;
  onOpenDataCheck?: () => void;
}

export const AppHeader: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSaved,
  onOpenGlossary,
  onExportBrief,
  onOpenDataCheck,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md no-print" id="app-global-header">
      {/* Top micro-bar for metadata and governance */}
      <div className="border-b border-slate-800/80 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-950/60">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold tracking-wide font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>EDA MODE</span>
            <InfoTooltip
              title="EDA MODE"
              businessTerm="Exploratory Data Analysis mode: interactive simulation studio allowing DCT planners to assess route impacts before official capacity commitment."
              technicalDefinition="Exploratory Data Analysis (EDA) Mode: Mathematical calibration against historical distributions; out-of-sample holdout validation is pending."
              position="bottom"
              iconClassName="w-3 h-3 text-amber-400/80 hover:text-amber-200"
            />
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden md:inline">Current analytical focus: Monthly New Hotel Arrivals by nationality · Predictive model validation is still pending</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Source:</span>
            <span className="text-slate-300 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">DCT Abu Dhabi & AUH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">Latest Data:</span>
            <span className="text-slate-300 font-semibold">Sep 2026</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand identity: SILA | صِلَة */}
        <div className="flex items-center gap-3">
          <SilaLogo size="md" showSubtitle={true} showTagline={false} />
          <div className="hidden lg:flex items-center pl-3 border-l border-slate-700/80">
            <span className="text-[11px] text-slate-300 italic font-medium max-w-xs leading-tight">
              “From flights to stays. From data to decisions.”
            </span>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            id="nav-saved-scenarios-btn"
            onClick={onOpenSaved}
            title="View saved scenarios in SILA Opportunity Comparison"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Scenarios</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-glossary-btn"
            onClick={onOpenGlossary}
            title="SILA Methodology & Technical Knowledge Base"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Glossary & Help</span>
          </button>

          {onOpenDataCheck && (
            <button
              id="nav-data-integration-check-btn"
              onClick={onOpenDataCheck}
              title="Verify the 9 JSON runtime files under /dashboard_data_v1/"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Data Integration Check</span>
            </button>
          )}

          <button
            id="nav-export-brief-btn"
            onClick={onExportBrief}
            title="Export SILA Scenario Decision Brief"
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Decision Brief</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Module names: SILA Scenario Planner, SILA Market & Season Insights, SILA Opportunity Comparison, SILA Trust Centre) */}
      <nav className="px-4 sm:px-6 flex gap-1 border-t border-slate-800/80 overflow-x-auto no-scrollbar" aria-label="SILA Main Navigation">
        <button
          id="tab-btn-planner"
          onClick={() => onSelectTab('planner')}
          title="SILA Scenario Planner — What-if flight-to-hotel simulation"
          className={`py-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'planner'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Scenario Planner</span>
        </button>

        <button
          id="tab-btn-insights"
          onClick={() => onSelectTab('insights')}
          title="SILA Market & Season Insights — Empirical research across 45 nationalities"
          className={`py-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'insights'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>2. Market & Season Insights</span>
        </button>

        <button
          id="tab-btn-compare"
          onClick={() => onSelectTab('compare')}
          title="SILA Opportunity Comparison — Multi-scenario portfolio comparison"
          className={`py-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'compare'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>3. Compare Opportunities</span>
        </button>

        <button
          id="tab-btn-trust"
          onClick={() => onSelectTab('trust')}
          title="SILA Trust Centre — Methodological transparency & governance"
          className={`py-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'trust'
              ? 'border-teal-400 text-teal-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>4. Trust, Data & Assumptions</span>
        </button>
      </nav>
    </header>
  );
};
