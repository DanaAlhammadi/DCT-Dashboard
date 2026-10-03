import React from 'react';
import { DecisionSummary as IDecisionSummary } from '../../types';
import { Compass, Lightbulb, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  summary: IDecisionSummary;
}

export const DecisionSummary: React.FC<Props> = ({ summary }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6" id="decision-summary-card">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 tracking-tight">
              What this means for DCT
            </h3>
            <p className="text-xs text-stone-500 font-normal">
              Executive decision synthesis and recommended policy actions
            </p>
          </div>
        </div>

        <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider hidden sm:inline-block">
          Leadership Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Expected Impact */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Expected Impact</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-xs">
            {summary.expectedImpact}
          </p>
        </div>

        {/* 2. Main Reason */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Primary Driver</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-xs">
            {summary.mainReason}
          </p>
        </div>

        {/* 3. Main Uncertainty */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Main Uncertainty</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-xs">
            {summary.mainUncertainty}
          </p>
        </div>

        {/* 4. Recommended Action */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-teal-950 font-semibold text-xs">
            <ArrowRight className="w-3.5 h-3.5 text-teal-800 shrink-0" />
            <span>Recommended Strategic Action</span>
          </div>
          <p className="text-teal-900/90 leading-relaxed text-xs font-medium">
            {summary.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
};
