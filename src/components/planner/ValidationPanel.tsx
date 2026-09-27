import React from 'react';
import { ValidationSummary } from '../../services/validationService';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  validation: ValidationSummary;
}

export const ValidationPanel: React.FC<Props> = ({ validation }) => {
  if (validation.blockingErrors.length === 0 && validation.warnings.length === 0) {
    return (
      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2" id="validation-clean-indicator">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="font-semibold">Inputs valid: Scenario is ready to simulate.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2.5" id="scenario-validation-panel">
      {/* Blocking Errors */}
      {validation.blockingErrors.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 space-y-1.5 shadow-xs" role="alert">
          <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Blocking Issues ({validation.blockingErrors.length}) — Simulation Paused:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs pl-1">
            {validation.blockingErrors.map((err, idx) => (
              <li key={idx} className="leading-relaxed">
                <strong className="capitalize">{err.field.replace(/([A-Z])/g, ' $1')}:</strong> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advisory Warnings */}
      {validation.warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Advisory Planning Notes:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-xs pl-1 text-amber-900">
            {validation.warnings.map((warn, idx) => (
              <li key={idx} className="leading-relaxed">
                {warn.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
