import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { DataStatusChip } from '../common/DataStatusChip';
import { InfoTooltip } from '../common/InfoTooltip';

export const PlannerHeaderSteps: React.FC = () => {
  return (
    <div className="space-y-4" id="planner-header-steps">
      {/* Required Visible Status Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 font-mono">
                <span>EDA MODE</span>
                <InfoTooltip
                  title="EDA MODE"
                  businessTerm="Exploratory Data Analysis mode: allows interactive exploration and what-if simulation of flight capacity changes before full policy commitment."
                  technicalDefinition="Exploratory Data Analysis (EDA) Mode: Model calibrated to project Monthly New Hotel Arrivals by nationality based on empirical conversion funnel data; out-of-sample predictive holdout validation is pending."
                  position="bottom"
                />
              </span>
              <p className="text-xs font-semibold text-amber-950">
                EDA MODE — Current analytical focus: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] text-amber-800 font-medium">Validation Phase</span>
          <DataStatusChip status="Estimated" size="sm" />
        </div>
      </div>

      {/* Required 3-Step Simple Explanation */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Workflow Guide
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            How to use the Flight-to-Hotel Decision Studio
          </h2>
          <p className="text-xs text-slate-500">
            Follow these three simple steps to test any airline frequency, seat capacity, or new route proposal:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                1. Select the current flight situation
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Pick the origin route and view observed baseline seats, load factor, and passenger breakdown.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                2. Define the change
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Adjust flight frequency, seat volumes, load factor targets, or date ranges for your hypothetical scenario.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                3. Review the expected hotel impact
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Click “Run Scenario” to inspect predicted new hotel arrivals, conversion stages, and support ratings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
