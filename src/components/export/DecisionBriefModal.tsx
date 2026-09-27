import React from 'react';
import { ScenarioResult, RouteInfo, BaselineFlightData } from '../../types';
import { exportScenarioToCSV, exportScenarioToJSON } from '../../services/exportService';
import { Printer, Download, FileText, X, CheckCircle2, ShieldCheck, Compass, AlertTriangle, Building2, Plane } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: ScenarioResult;
  route: RouteInfo;
  baseline: BaselineFlightData;
}

export const DecisionBriefModal: React.FC<Props> = ({
  isOpen,
  onClose,
  result,
  route,
  baseline,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in" id="decision-brief-modal-backdrop">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        id="decision-brief-dialog"
      >
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            <span className="text-sm font-bold text-slate-800 font-display">Executive Decision Brief (1-Page Print Ready)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="brief-print-btn"
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              id="brief-csv-btn"
              type="button"
              onClick={() => exportScenarioToCSV(result, route, baseline)}
              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              id="brief-json-btn"
              type="button"
              onClick={() => exportScenarioToJSON(result, route, baseline)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>JSON</span>
            </button>
            <button
              id="close-brief-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-white" id="printable-decision-brief">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                  AeroStay Abu Dhabi · Flight-to-Hotel Decision Studio
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-display">
                Strategic Aviation Scenario Decision Brief
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Prepared for: DCT Abu Dhabi Tourism & Aviation Planning Directorates
              </p>
            </div>

            <div className="text-right text-xs font-mono text-slate-500 space-y-0.5">
              <div>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>Model: <strong>v2.4-Hybrid</strong></div>
              <div>Status: <strong className="text-teal-700 uppercase">{result.supportLevel}</strong></div>
            </div>
          </div>

          {/* Scenario Overview Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Route Corridors</span>
              <strong className="text-slate-900 text-sm">{route.routeCode}</strong>
              <div className="text-[11px] text-slate-500 font-sans">{route.airline}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Source Market</span>
              <strong className="text-teal-800 text-sm font-sans">{route.modelledSourceMarket}</strong>
              <div className="text-[11px] text-slate-500 font-sans">Origin: {route.departureCountry}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Planning Horizon</span>
              <strong className="text-slate-900 text-sm">{result.input.startMonth} to {result.input.endMonth}</strong>
              <div className="text-[11px] text-slate-500 font-sans">{result.monthlyBreakdown.length} months active</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Monthly Capacity Intervention</span>
              <strong className="text-slate-900 text-sm">
                {result.totalSeats.diff >= 0 ? `+${result.totalSeats.diff.toLocaleString()}` : result.totalSeats.diff.toLocaleString()} seats
              </strong>
              <div className="text-[11px] text-teal-700 font-sans font-bold">
                ({result.totalSeats.pct >= 0 ? `+${result.totalSeats.pct.toFixed(0)}%` : `${result.totalSeats.pct.toFixed(0)}%`})
              </div>
            </div>
          </div>

          {/* Key Executive Impact Indicators */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60">
              <span className="text-[10px] uppercase tracking-wider font-bold text-teal-800 block">
                Additional Hotel Guests
              </span>
              <div className="text-2xl font-black text-slate-900 font-display mt-1">
                {result.hotelGuests.diff >= 0 ? `+${result.hotelGuests.diff.toLocaleString()}` : result.hotelGuests.diff.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-teal-700 mt-0.5">
                {result.hotelGuests.pct >= 0 ? `+${result.hotelGuests.pct.toFixed(1)}%` : `${result.hotelGuests.pct.toFixed(1)}%`} demand uplift
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">
                Additional Guest Nights
              </span>
              <div className="text-2xl font-black text-slate-900 font-display mt-1">
                {result.guestNights.diff && result.guestNights.diff >= 0 ? `+${result.guestNights.diff.toLocaleString()}` : (result.guestNights.diff?.toLocaleString() || 'N/A')}
              </div>
              <div className="text-xs font-semibold text-amber-800 mt-0.5">
                {result.nightsPer1kSeats.scenario} nights / 1,000 scheduled seats
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600 block">
                Prediction Confidence
              </span>
              <div className="text-2xl font-black text-slate-900 font-display mt-1">
                {result.confidenceScore}/100
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                Historical Support: {result.supportLevel}
              </div>
            </div>
          </div>

          {/* Full Conversion Narrative */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Transparent Aviation-to-Hotel Conversion Ledger
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-2">Stage</th>
                    <th className="p-2">Baseline</th>
                    <th className="p-2">Scenario</th>
                    <th className="p-2">Net Shift</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Governing Formula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {result.conversionStages.map((st) => (
                    <tr key={st.id}>
                      <td className="p-2 font-sans font-semibold text-slate-800">{st.name}</td>
                      <td className="p-2">{st.baselineValue.toLocaleString()}</td>
                      <td className="p-2 font-bold text-slate-900">{st.scenarioValue.toLocaleString()}</td>
                      <td className={`p-2 font-bold ${st.changeValue >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                        {st.changeValue >= 0 ? `+${st.changeValue.toLocaleString()}` : st.changeValue.toLocaleString()}
                      </td>
                      <td className="p-2 font-sans text-[11px]">{st.status}</td>
                      <td className="p-2 font-sans text-slate-500 text-[11px] truncate max-w-[200px]">{st.formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation & Strategy */}
          <div className="p-4 rounded-xl border border-slate-900 bg-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Recommended Strategic Next Action</span>
            </div>
            <p className="text-sm text-slate-100 leading-relaxed font-medium">
              {result.decisionSummary.recommendedAction}
            </p>
            <div className="pt-2 border-t border-white/10 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-white">Primary Driver:</strong> {result.decisionSummary.mainReason}
              </div>
              <div>
                <strong className="text-white">Principal Uncertainty:</strong> {result.decisionSummary.mainUncertainty}
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>AeroStay Abu Dhabi · Department of Culture and Tourism Prototype</span>
            <span>Illustrative demo values — not official DCT results.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
