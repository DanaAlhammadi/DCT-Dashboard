import React, { useState, useEffect } from 'react';
import { SilaLogo } from './SilaLogo';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isLoading: boolean;
  onFinished?: () => void;
}

const LOADING_STEPS = [
  'SILA is preparing your scenario',
  'Connecting flight changes to hotel demand',
  'Checking historical support',
  'Preparing your decision summary',
];

export const SilaLoadingOverlay: React.FC<Props> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 280);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      id="sila-loading-overlay"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4 animate-in zoom-in-95">
        <div className="flex justify-center">
          <SilaLogo size="lg" showSubtitle={false} light={false} />
        </div>

        <div className="space-y-1.5 pt-1">
          <h3 className="font-bold text-slate-900 text-sm font-display">
            {LOADING_STEPS[currentStep]}
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
            Flight-to-Hotel Decision Intelligence
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {LOADING_STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-teal-600'
                  : idx < currentStep
                  ? 'w-3 bg-teal-400'
                  : 'w-3 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10.5px] text-slate-400">
          منصة ذكاء ربط الرحلات بالطلب الفندقي
        </div>
      </div>
    </div>
  );
};
