import React, { useState } from 'react';
import { 
  MOCK_MODEL_METRICS, 
  MOCK_ACTUAL_VS_PREDICTED, 
  MOCK_COUNTRY_MAPPINGS 
} from '../../data/mockData';
import { calculateSensitivity } from '../../services/simulationService';
import { ScenarioResult } from '../../types';
import { 
  ShieldCheck, 
  HelpCircle, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  Database, 
  Layers, 
  Info,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { DataStatusChip } from '../common/DataStatusChip';

interface Props {
  currentResult: ScenarioResult;
}

export const TrustDataTab: React.FC<Props> = ({ currentResult }) => {
  const [selectedMappingMarket, setSelectedMappingMarket] = useState<string>('United Kingdom');
  const [sensitivityMode, setSensitivityMode] = useState<'expected' | 'low' | 'high'>('expected');

  const sensitivityFactors = calculateSensitivity(currentResult);
  const currentMapping = MOCK_COUNTRY_MAPPINGS[selectedMappingMarket] || MOCK_COUNTRY_MAPPINGS['United Kingdom'];

  // Data for Sensitivity Tornado Chart
  const tornadoData = sensitivityFactors.map((f) => ({
    parameter: f.parameter,
    low: f.lowImpactPercent,
    high: f.highImpactPercent,
    range: f.impactRange,
  })).sort((a, b) => b.range - a.range);

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="trust-data-assumptions-tab">
      {/* Title & Governance Badge */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Model Governance & Transparency
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">
            Trust, Data Quality & Assumption Audit
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Full methodology disclosure, historical error validation (WMAPE), assumption registers, and cross-dataset flight-to-hotel mapping audits.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Overall Model WMAPE</span>
            <span className="text-base font-extrabold text-teal-800 font-mono">9.4% Error</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Training Window</span>
            <span className="text-xs font-bold text-slate-700">36 Months</span>
          </div>
        </div>
      </div>

      {/* Section A: Model Performance & Actual vs Predicted */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Historical Model Performance & Validation
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated using Weighted Mean Absolute Percentage Error (WMAPE). Lower values denote higher forecasting precision.
            </p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Held-out Test Period: Jan 2026 – Aug 2026
          </span>
        </div>

        {/* Actual vs Predicted Line Chart */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Actual vs. Predicted Abu Dhabi International Hotel Guests (Validation Sample)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Mean monthly error: 2.5%</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ACTUAL_VS_PREDICTED} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [val.toLocaleString(), '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="actualGuests" name="Actual DCT Reported Guests" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="predictedGuests" name="AeroStay Model Forecast" stroke="#0d9488" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WMAPE by Source Market Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse" id="wmape-metrics-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3">Source Market</th>
                <th className="p-3">Historical Sample</th>
                <th className="p-3">WMAPE Error (%)</th>
                <th className="p-3">Model Status</th>
                <th className="p-3">Data Governance Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MOCK_MODEL_METRICS.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-sans font-bold text-slate-900">{m.market}</td>
                  <td className="p-3 text-slate-600">{m.sampleMonths > 0 ? `${m.sampleMonths} months` : '0 (Analogue)'}</td>
                  <td className="p-3 font-bold text-slate-900">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      m.wmape <= 8.5 ? 'bg-emerald-50 text-emerald-700' : m.wmape <= 12 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {m.wmape.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      m.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' : m.status === 'Adequate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">{m.coverageNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Sensitivity Analysis (Tornado Chart) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Scenario Sensitivity
          </span>
          <h3 className="text-base font-bold text-slate-900 font-display mt-1">
            Why This Result May Change (Tornado Sensitivity Analysis)
          </h3>
          <p className="text-xs text-slate-500">
            Ranks which aviation or conversion levers exert the highest swing on resulting hotel guest demand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={tornadoData}
                margin={{ top: 10, right: 20, left: 130, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#64748b' }} domain={[-30, 30]} />
                <YAxis type="category" dataKey="parameter" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Potential Demand Swing']}
                />
                <Bar dataKey="low" name="Downside Shift (-15%)" fill="#f43f5e" stackId="stack" radius={[4, 0, 0, 4]} />
                <Bar dataKey="high" name="Upside Shift (+15%)" fill="#0d9488" stackId="stack" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Top Swing Factor: Seasonal / Event Timing</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Abu Dhabi's calendar (Formula 1, Culture Summit, high winter season) causes up to ±26% swings in monthly hotel realization.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Second Factor: Scheduled Seat Capacity</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct physical airline schedule changes provide the strongest structural lever on visitor ceilings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section C: Country and Market Mapping (Mandatory requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Data Mapping Rigour
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Flight Origin ≠ Guest Nationality
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display mt-1">
              Flight-Origin Country vs. Hotel-Guest Nationality Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              The flight dataset records where the aircraft departed; the hotel dataset records the guest's passport nationality. AeroStay transparently models this cross-walk.
            </p>
          </div>

          <select
            id="mapping-country-selector"
            value={selectedMappingMarket}
            onChange={(e) => setSelectedMappingMarket(e.target.value)}
            className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
          >
            {Object.keys(MOCK_COUNTRY_MAPPINGS).map((c) => (
              <option key={c} value={c}>
                Mapping: {c}
              </option>
            ))}
          </select>
        </div>

        {/* Mapping Detail Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Flight Origin</span>
                <span className="text-sm font-bold text-slate-900">{currentMapping.flightOriginCountry} ({currentMapping.departureCity})</span>
              </div>
              <span className="text-slate-300">→</span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Modelled Source Market</span>
                <span className="text-sm font-bold text-teal-700">{currentMapping.modelledSourceMarket}</span>
              </div>
            </div>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              currentMapping.mappingConfidence === 'High'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : currentMapping.mappingConfidence === 'Medium'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}>
              Confidence: {currentMapping.mappingConfidence}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
            {currentMapping.explanation}
          </p>

          {/* Nationality breakdown table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-2.5">Arriving Passenger Nationality</th>
                  <th className="p-2.5">Share %</th>
                  <th className="p-2.5">Residence Group</th>
                  <th className="p-2.5">Evidence Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {currentMapping.guestNationalityMix.map((mix, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-sans font-semibold text-slate-800">{mix.nationality}</td>
                    <td className="p-2.5 font-bold text-teal-800">{mix.sharePercentage}%</td>
                    <td className="p-2.5 font-sans text-slate-600">{mix.residenceGroup}</td>
                    <td className="p-2.5 font-sans">
                      <DataStatusChip status={mix.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section D: Data Coverage & Quality Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Data Health & Granularity Coverage
            </h3>
            <p className="text-xs text-slate-500">
              Audit of underlying aviation vs hotel dataset formats, missing values, and reconciliation rules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-800 block mb-1">International Hotel Guests</span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Time Granularity: <strong>Daily</strong></li>
              <li>• Dimension: <strong>By nationality & residence</strong></li>
              <li>• Target metric: <strong>Guests & New Arrivals</strong></li>
              <li>• Coverage: Complete 2023–2026</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-800 block mb-1">Domestic Hotel Guests</span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Time Granularity: <strong>Daily</strong></li>
              <li>• Dimension: <strong>Aggregated (No nationality)</strong></li>
              <li>• Isolation: <strong>Static Context</strong></li>
              <li>• Note: Unaffected by international flights</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-slate-800 block mb-1">Flight Operations Data</span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Time Granularity: <strong>Monthly</strong></li>
              <li>• Dimensions: <strong>Route, Origin City, Airline</strong></li>
              <li>• Missing frequency: <strong>Suppressed / Unavailable</strong></li>
              <li>• Asterisk rule: <strong>Never converted to zero</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
