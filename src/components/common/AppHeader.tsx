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
    <header className="sticky top-0 z-40 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#0A2E4D]/10 transition-all no-print">
      {/* Top subtle bar: Minimal identity & utilities */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0A2E4D] text-[#D4AF37] flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            ص
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0A2E4D] tracking-tight text-base">SILA</span>
              <span className="text-[#0A2E4D]/25 font-light">|</span>
              <span className="text-[#0A2E4D]/90 font-medium text-sm font-arabic">صِلَة</span>
              <span className="text-[11px] text-[#0A2E4D]/50 font-normal hidden sm:inline">
                · Decision Intelligence
              </span>
            </div>
            <p className="text-[11px] text-[#0A2E4D]/60 font-normal hidden sm:block">
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
              className="text-[#0A2E4D]/70 hover:text-[#0A2E4D] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-[#0A2E4D]/5 transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
              <span>Data Audit</span>
            </button>
          )}

          <button
            id="nav-glossary-btn"
            type="button"
            onClick={onOpenGlossary}
            className="text-[#0A2E4D]/70 hover:text-[#0A2E4D] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-[#0A2E4D]/5 transition-colors hidden sm:inline-flex items-center gap-1.5"
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
                ? 'bg-white border-[#D4AF37]/50 text-[#0A2E4D] shadow-xs'
                : 'bg-white border-[#0A2E4D]/15 text-[#0A2E4D]/80 hover:bg-[#F4F1EA]'
            }`}
          >
            <BookmarkCheck className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-[#D4AF37]' : 'text-[#0A2E4D]/40'}`} />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#0A2E4D] font-mono text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-export-brief-btn"
            type="button"
            onClick={onExportBrief}
            className="bg-[#0A2E4D] hover:bg-[#08233B] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Decision Brief</span>
          </button>
        </div>
      </div>

      {/* Main 4-Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 border-t border-[#0A2E4D]/10">
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
                    ? 'text-[#0A2E4D] font-semibold'
                    : 'text-[#0A2E4D]/60 hover:text-[#0A2E4D] font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#0A2E4D] text-[#D4AF37] shadow-xs' : 'bg-[#0A2E4D]/5 text-[#0A2E4D]/70 group-hover:bg-[#0A2E4D]/10'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm tracking-tight leading-none">{tab.title}</div>
                  <div className="text-[10px] text-[#0A2E4D]/50 font-normal leading-tight mt-0.5 hidden sm:block">
                    {tab.subtitle}
                  </div>
                </div>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0A2E4D] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
