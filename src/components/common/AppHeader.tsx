import React from 'react';
import { 
  Building2, 
  Layers, 
  BarChart3, 
  GitCompare, 
  ShieldCheck, 
  BookOpen, 
  FileDown, 
  BookmarkCheck,
  Plane,
  Calendar,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'planner' | 'insights' | 'compare' | 'trust';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenGlossary: () => void;
  onExportBrief: () => void;
}

export const AppHeader: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSaved,
  onOpenGlossary,
  onExportBrief,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md no-print" id="app-global-header">
      {/* Top micro-bar for metadata and governance */}
      <div className="border-b border-slate-800/80 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-950/60">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden md:inline">Illustrative demo values — not official DCT results.</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Model:</span>
            <span className="text-slate-300 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">v2.4-AeroStay-Hybrid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">Latest Data:</span>
            <span className="text-slate-300 font-semibold">Aug 2026</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-900/30 ring-1 ring-white/20">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-display">AeroStay Abu Dhabi</h1>
              <span className="text-xs px-2 py-0.5 rounded-md bg-teal-950/80 text-teal-300 border border-teal-800 font-medium">
                DCT Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-slate-200 font-medium">Flight-to-Hotel Decision Studio</span>
              <span className="hidden sm:inline text-slate-500"> — “See how flight changes could affect Abu Dhabi hotel demand.”</span>
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            id="nav-saved-scenarios-btn"
            onClick={onOpenSaved}
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
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>Glossary & Help</span>
          </button>

          <button
            id="nav-export-brief-btn"
            onClick={onExportBrief}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Decision Brief</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Exactly 4 tabs as mandated) */}
      <nav className="px-4 sm:px-6 flex gap-1 border-t border-slate-800/80 overflow-x-auto no-scrollbar" aria-label="Main Navigation">
        <button
          id="tab-btn-planner"
          onClick={() => onSelectTab('planner')}
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
