import React from 'react';
import { Plane, ArrowRight, Sparkles, CheckCircle2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: () => void;
}

export const WelcomeModal: React.FC<Props> = ({ isOpen, onClose, onLoadExample }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in" id="welcome-modal-backdrop">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        id="welcome-modal-dialog"
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white relative">
          <button
            id="welcome-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss welcome dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flight-to-Hotel Decision Studio</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight font-display text-white mb-2">
            Test a flight decision in under one minute
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Choose a route, change an aviation assumption, and see the expected effect on Abu Dhabi hotel demand.
          </p>
        </div>

        {/* 3 Step Visual */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-2">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-1">Select Route</h3>
              <p className="text-[11px] text-slate-500 leading-snug">Current baseline flight schedule</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold mb-2">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-1">Define Change</h3>
              <p className="text-[11px] text-slate-500 leading-snug">Seats, flights, or load factor</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-1">Hotel Impact</h3>
              <p className="text-[11px] text-slate-500 leading-snug">Guests, nights & recommendations</p>
            </div>
          </div>

          {/* Example Box */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800 shrink-0 mt-0.5">
              <Plane className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Recommended Quick Start</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                “Add two weekly flights from India between January and March 2027.”
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Explore passenger uplift, transfer leakage, and estimated Abu Dhabi hotel room-night demand with a single click.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              id="welcome-load-example-btn"
              onClick={() => {
                onLoadExample();
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Load example scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="welcome-new-scenario-btn"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
            >
              Start fresh scenario
            </button>
          </div>

          {/* Demo disclaimer badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Demo data
            </span>
            <span>Illustrative demo values — not official DCT results.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
