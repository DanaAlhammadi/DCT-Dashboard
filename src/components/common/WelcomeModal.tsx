import React from 'react';
import { ArrowRight, Sparkles, X, Layers, Compass } from 'lucide-react';
import { SilaLogo } from './SilaLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadExample: () => void;
}

export const WelcomeModal: React.FC<Props> = ({ isOpen, onClose, onLoadExample }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E4D]/40 backdrop-blur-xs animate-in fade-in" id="welcome-modal-backdrop">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#0A2E4D]/15 overflow-hidden animate-in zoom-in-95 duration-200"
        id="welcome-modal-dialog"
      >
        {/* Top Banner with SILA | صِلَة Identity */}
        <div className="bg-[#0A2E4D] p-6 text-white relative">
          <button
            id="welcome-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss welcome dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4">
            <SilaLogo size="lg" showSubtitle={true} showTagline={false} />
          </div>

          {/* Primary & Arabic Tagline */}
          <div className="space-y-1 mb-3 pt-1 border-t border-white/10">
            <p className="text-sm font-bold text-[#D4AF37] tracking-wide font-display">
              “From flights to stays. From data to decisions.”
            </p>
            <p className="text-xs font-sans text-white/80" dir="rtl" lang="ar">
              «من الرحلات إلى الإقامات، ومن البيانات إلى القرار»
            </p>
          </div>

          {/* Official Product Description */}
          <p className="text-xs text-[#F4F1EA]/80 leading-relaxed max-w-lg">
            SILA is an explainable scenario-planning platform that helps DCT explore how changes in airline capacity, passenger movement, source markets, and seasonality could affect hotel demand in Abu Dhabi.
          </p>
        </div>

        {/* 3 Step Visual Flow */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#0A2E4D] text-[#F4F1EA] flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                1
              </div>
              <h3 className="text-xs font-bold text-[#0A2E4D] mb-0.5">Select Route</h3>
              <p className="text-[10.5px] text-[#0A2E4D]/60 leading-tight">Current baseline corridor</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E6B6E]/10 border border-[#0E6B6E]/20">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#0E6B6E] text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                2
              </div>
              <h3 className="text-xs font-bold text-[#0A2E4D] mb-0.5">Define Change</h3>
              <p className="text-[10.5px] text-[#0E6B6E] leading-tight">Seats, flights, or fill</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F4F1EA]/60 border border-[#0A2E4D]/10">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#D4AF37] text-[#0A2E4D] flex items-center justify-center text-xs font-bold mb-1.5 shadow-2xs">
                3
              </div>
              <h3 className="text-xs font-bold text-[#0A2E4D] mb-0.5">Hotel Impact</h3>
              <p className="text-[10.5px] text-[#0A2E4D]/60 leading-tight">Monthly arrivals &amp; advice</p>
            </div>
          </div>

          {/* Recommended Quick Start Example */}
          <div className="p-3.5 rounded-2xl border border-[#0E6B6E]/30 bg-[#F4F1EA]/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#0E6B6E] border border-[#0A2E4D]/10 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E6B6E] block">
                Recommended SILA Quick Start
              </span>
              <h4 className="text-xs font-bold text-[#0A2E4D] mt-0.5">
                “Add two weekly flights from India between January and March 2027.”
              </h4>
              <p className="text-[11px] text-[#0A2E4D]/70 mt-0.5 leading-snug">
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
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0A2E4D] hover:bg-[#08233B] text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Load example scenario</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              id="welcome-new-scenario-btn"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#0A2E4D]/20 hover:bg-[#F4F1EA] text-[#0A2E4D] font-semibold text-xs transition-colors"
            >
              Start fresh scenario
            </button>
          </div>

          {/* Prototype disclaimer badge */}
          <div className="pt-2 border-t border-[#0A2E4D]/10 flex items-center justify-between text-[10.5px] text-[#0A2E4D]/60">
            <span className="inline-flex items-center gap-1 font-medium text-[#B45309]">
              SILA Decision Intelligence
            </span>
            <span>Empirical research model — Abu Dhabi hotel demand analytics.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
