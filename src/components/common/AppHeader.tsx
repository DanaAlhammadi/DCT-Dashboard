import React from 'react';
import { 
  BookmarkCheck,
  FileDown,
  BookOpen,
  Layers,
  BarChart3,
  GitCompare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SilaLogo } from './SilaLogo';

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
  const tabs: { id: ActiveTab; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'planner', title: 'Scenario', subtitle: 'Plan & simulate', icon: Layers },
    { id: 'insights', title: 'Insights', subtitle: 'Market behaviors', icon: BarChart3 },
    { id: 'compare', title: 'Compare', subtitle: 'Evaluate options', icon: GitCompare },
    { id: 'trust', title: 'Trust', subtitle: 'Evidence & models', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all no-print">
      {/* Top subtle bar: Minimal identity & utilities */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-900 text-stone-100 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            ص
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 tracking-tight text-base">SILA</span>
              <span className="text-stone-300 font-light">|</span>
              <span className="text-stone-700 font-medium text-sm font-arabic">صِلَة</span>
              <span className="text-[11px] text-stone-400 font-normal hidden sm:inline">
                · Decision Intelligence
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-normal hidden sm:block">
              Flight-to-Hotel Decision Intelligence
            </p>
          </div>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenDataCheck && (
            <button
              id="nav-data-integration-check-btn"
              type="button"
              onClick={onOpenDataCheck}
              title="Verify 9 server-side datasets"
              className="text-stone-500 hover:text-stone-800 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-stone-200/50 transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Data Audit</span>
            </button>
          )}

          <button
            id="nav-glossary-btn"
            type="button"
            onClick={onOpenGlossary}
            className="text-stone-500 hover:text-stone-800 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-stone-200/50 transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Glossary</span>
          </button>

          <button
            id="nav-saved-scenarios-btn"
            type="button"
            onClick={onOpenSaved}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 border ${
              savedCount > 0
                ? 'bg-amber-50/80 border-amber-200/80 text-amber-900 hover:bg-amber-100/70'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <BookmarkCheck className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-amber-700' : 'text-stone-400'}`} />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-200/60 text-amber-950 font-mono text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-export-brief-btn"
            type="button"
            onClick={onExportBrief}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5 text-stone-300" />
            <span>Decision Brief</span>
          </button>
        </div>
      </div>

      {/* Main 4-Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 border-t border-stone-200/60">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-1" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`group py-2.5 px-3 rounded-xl transition-all text-left flex items-center gap-2.5 relative whitespace-nowrap ${
                  isActive
                    ? 'text-teal-950 font-semibold'
                    : 'text-stone-500 hover:text-stone-900 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-teal-900 text-white shadow-xs' : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200/70'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm tracking-tight leading-none">{tab.title}</div>
                  <div className="text-[10px] text-stone-400 font-normal leading-tight mt-0.5 hidden sm:block">
                    {tab.subtitle}
                  </div>
                </div>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
