import React from 'react';
import { Plane, ArrowRight, Sparkles, X, Layers, Compass } from 'lucide-react';
import { SilaLogo } from './SilaLogo';

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
        {/* Top Banner with SILA | صِلَة Identity */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white relative">
          <button
            id="welcome-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss welcome dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            <SilaLogo size="lg" showSubtitle={true} showTagline={false} />
          </div>

          {/* Primary & Arabic Tagline */}
          <div className="space-y-1 mb-3 pt-1 border-t border-white/10">
            <p className="text-sm font-bold text-amber-300 tracking-wide font-display">
              “From flights to stays. From data to decisions.”
            </p>
            <p className="text-xs font-sans text-teal-200/90" dir="rtl" lang="ar">
              «من الرحلات إلى الإقامات، ومن البيانات إلى القرار»
            </p>
          </div>

          {/* Official Product Description */}
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            SILA is an explainable scenario-planning platform that helps DCT explore how changes in airline capacity, passenger movement, source markets, and seasonality could affect hotel demand in Abu Dhabi.
          </p>
        </div>

        {/* 3 Step Visual Flow */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-0.5">Select Route</h3>
              <p className="text-[10.5px] text-slate-500 leading-tight">Current baseline corridor</p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                2
              </div>
              <h3 className="text-xs font-bold text-teal-950 mb-0.5">Define Change</h3>
              <p className="text-[10.5px] text-teal-800 leading-tight">Seats, flights, or occupancy</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-0.5">Hotel Impact</h3>
              <p className="text-[10.5px] text-slate-500 leading-tight">Monthly arrivals & advice</p>
            </div>
          </div>

          {/* Recommended Quick Start Example */}
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-teal-800 block">
                Recommended SILA Quick Start
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                “Add two weekly flights from India between January and March 2027.”
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Simulate passenger uplift, transfer leakage, and estimated Abu Dhabi hotel arrivals with one click.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              id="welcome-load-example-btn"
              onClick={() => {
                onLoadExample();
                onClose();
              }}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Load example scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="welcome-new-scenario-btn"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              Start fresh scenario
            </button>
          </div>

          {/* Prototype disclaimer badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              SILA Prototype
            </span>
            <span>Illustrative demo values — not official DCT results.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
