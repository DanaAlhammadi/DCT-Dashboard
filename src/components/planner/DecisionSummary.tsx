import React from 'react';
import { DecisionSummary as IDecisionSummary } from '../../types';
import { Compass, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  summary: IDecisionSummary;
}

export const DecisionSummary: React.FC<Props> = ({ summary }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/80 space-y-5" id="decision-summary-card">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">What this means for DCT</h3>
            <p className="text-xs text-slate-300">Executive decision synthesis & recommended policy actions</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-teal-300 bg-teal-950/80 border border-teal-800 px-2.5 py-1 rounded-full">
          Leadership Brief
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Expected Impact */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-teal-300 font-bold uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Expected Impact</span>
          </div>
          <p className="text-slate-200 leading-relaxed text-[12.5px]">
            {summary.expectedImpact}
          </p>
        </div>

        {/* Main Reason */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Main Reason</span>
          </div>
          <p className="text-slate-200 leading-relaxed text-[12.5px]">
            {summary.mainReason}
          </p>
        </div>

        {/* Main Uncertainty */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-orange-300 font-bold uppercase tracking-wider text-[11px]">
            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Main Uncertainty</span>
          </div>
          <p className="text-slate-200 leading-relaxed text-[12.5px]">
            {summary.mainUncertainty}
          </p>
        </div>

        {/* Recommended Next Action */}
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-400/30 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Recommended Next Action</span>
          </div>
          <p className="text-emerald-100 font-medium leading-relaxed text-[12.5px]">
            {summary.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
};
