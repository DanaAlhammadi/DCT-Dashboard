import React from 'react';
import { ScenarioResult, RouteInfo, BaselineFlightData } from '../../types';
import { exportScenarioToCSV, exportScenarioToJSON } from '../../services/exportService';
import { SilaLogo } from '../common/SilaLogo';
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
            <span className="text-sm font-bold text-slate-800 font-display">SILA Scenario Decision Brief (ملخص قرار صِلَة)</span>
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
              className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
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
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <SilaLogo size="sm" showSubtitle={false} light={false} />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 border-l border-slate-300 pl-3">
                  Flight-to-Hotel Decision Intelligence
                </span>
              </div>
              <div className="flex items-baseline gap-3 pt-1">
                <h1 className="text-2xl font-black text-slate-900 font-display">
                  SILA Scenario Decision Brief
                </h1>
                <span className="text-lg font-bold text-teal-800 font-sans" dir="rtl" lang="ar">
                  ملخص قرار صِلَة
                </span>
              </div>
              {/* Primary & Arabic Tagline */}
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span>From flights to stays. From data to decisions.</span>
                <span className="text-slate-400">·</span>
                <span className="text-teal-900 font-sans" dir="rtl" lang="ar">من الرحلات إلى الإقامات، ومن البيانات إلى القرار</span>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-500 space-y-0.5 shrink-0">
              <div>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>Mode: <strong>EDA Mode (Target: New Arrivals)</strong></div>
              <div>Status: <strong className="text-teal-700 uppercase">{result.supportLevel}</strong></div>
            </div>
          </div>

          {/* Scenario Overview Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Route Corridor</span>
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
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Added Capacity</span>
              <strong className="text-slate-900 text-sm">
                {result.totalSeats.diff >= 0 ? `+${result.totalSeats.diff.toLocaleString()}` : result.totalSeats.diff.toLocaleString()}
              </strong>
              <div className="text-[11px] text-slate-500 font-sans">Seats scheduled/mo</div>
            </div>
          </div>

          {/* Core Decision Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Net Hotel Arrivals</span>
              <p className="text-2xl font-extrabold text-teal-800 font-display mt-0.5">
                {result.hotelGuests.diff >= 0 ? `+${result.hotelGuests.diff.toLocaleString()}` : result.hotelGuests.diff.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">New check-ins/mo</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">% Demand Change</span>
              <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                {result.hotelGuests.pct >= 0 ? `+${result.hotelGuests.pct.toFixed(1)}%` : `${result.hotelGuests.pct.toFixed(1)}%`}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">vs baseline pace</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Route Efficiency</span>
              <p className="text-2xl font-extrabold text-teal-800 font-display mt-0.5">
                {result.guestsPer1kSeats.scenario}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Check-ins / 1k seats</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reliability Score</span>
              <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                {result.confidenceScore}/100
              </p>
              <span className="text-[10px] text-slate-500 font-medium">{result.supportLevel}</span>
            </div>
          </div>

          {/* Conversion Funnel Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              5-Stage Flight-to-Hotel Conversion Waterfall
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-2 px-3 font-bold">Funnel Stage</th>
                    <th className="py-2 px-3 text-right font-bold">Baseline</th>
                    <th className="py-2 px-3 text-right font-bold">Scenario</th>
                    <th className="py-2 px-3 text-right font-bold">Net Change</th>
                    <th className="py-2 px-3 font-bold">Data Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
                  <tr>
                    <td className="py-1.5 px-3 font-sans font-medium text-slate-900">1. Scheduled Seats</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">{result.totalSeats.baseline.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-900">{result.totalSeats.scenario.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right text-teal-700 font-bold">
                      {result.totalSeats.diff >= 0 ? `+${result.totalSeats.diff.toLocaleString()}` : result.totalSeats.diff.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-sans text-slate-500 text-[10.5px]">Observed</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-sans font-medium text-slate-900">2. Arriving Passengers</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">{result.totalPax.baseline.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-900">{result.totalPax.scenario.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right text-teal-700 font-bold">
                      {result.totalPax.diff >= 0 ? `+${result.totalPax.diff.toLocaleString()}` : result.totalPax.diff.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-sans text-slate-500 text-[10.5px]">Observed (LF)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-sans font-medium text-slate-900">3. Direct Visitors (P2P)</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">{result.totalP2P.baseline.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-900">{result.totalP2P.scenario.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right text-teal-700 font-bold">
                      {result.totalP2P.diff >= 0 ? `+${result.totalP2P.diff.toLocaleString()}` : result.totalP2P.diff.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-sans text-slate-500 text-[10.5px]">Derived</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-sans font-medium text-slate-900">4. Inbound Tourists</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">{result.inboundVisitors.baseline.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-900">{result.inboundVisitors.scenario.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right text-teal-700 font-bold">
                      {result.inboundVisitors.diff >= 0 ? `+${result.inboundVisitors.diff.toLocaleString()}` : result.inboundVisitors.diff.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-sans text-slate-500 text-[10.5px]">Estimated</td>
                  </tr>
                  <tr className="bg-teal-50/40">
                    <td className="py-1.5 px-3 font-sans font-bold text-teal-950">5. Monthly Hotel Arrivals</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">{result.hotelGuests.baseline.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-teal-900">{result.hotelGuests.scenario.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right text-teal-800 font-bold">
                      {result.hotelGuests.diff >= 0 ? `+${result.hotelGuests.diff.toLocaleString()}` : result.hotelGuests.diff.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-sans text-teal-800 font-bold text-[10.5px]">Target Metric</td>
                  </tr>
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
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>SILA | صِلَة · Flight-to-Hotel Decision Intelligence</span>
            <span>Illustrative demo values — not official DCT results.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
