import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface Props {
  topWarnings: string[];
  allWarnings: string[];
}

export const WarningsPanel: React.FC<Props> = ({ topWarnings, allWarnings }) => {
  const [showAll, setShowAll] = useState(false);

  if (topWarnings.length === 0 && allWarnings.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-3" id="planning-warnings-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Key Assumptions & Governance Notes ({allWarnings.length})</span>
        </div>
        <span className="text-[10.5px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
          Audit Transparency
        </span>
      </div>

      {/* Top 2 warnings directly visible */}
      <ul className="space-y-1.5 text-xs text-amber-900">
        {topWarnings.slice(0, 2).map((w, idx) => (
          <li key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <span>{w}</span>
          </li>
        ))}
      </ul>

      {/* Expand/Collapse for full warnings list */}
      {allWarnings.length > 2 && (
        <div className="pt-2 border-t border-amber-200/60">
          <button
            id="toggle-all-warnings-btn"
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors"
          >
            <span>{showAll ? 'Hide secondary assumptions' : `View all assumptions & warnings (${allWarnings.length})`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAll && (
            <ul className="mt-2.5 space-y-1.5 text-xs text-amber-900/90 pl-1 animate-in fade-in duration-150">
              {allWarnings.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
