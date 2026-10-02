import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import { EdaService } from '../../services/edaService';
import { ScenarioResult } from '../../types/dashboard';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Database,
  Layers,
  Info,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  Plane,
  Building,
  UserCheck,
  BookOpen,
  Calendar,
  XCircle,
} from 'lucide-react';
import { DataStatusChip } from '../common/DataStatusChip';
import { DataIntegrationCheck } from '../dev/DataIntegrationCheck';

interface Props {
  currentResult?: ScenarioResult;
}

export const TrustDataTab: React.FC<Props> = () => {
  const metadata = DataService.getDataMetadata();
  const countryMappings = DataService.getCountryMappings();
  const glossaryItems = DataService.getGlossaryItems();
  const limitations = EdaService.getDataLimitationSummary();

  const [selectedMappingKey, setSelectedMappingKey] = useState<string>('United Kingdom');
  const activeMapping = countryMappings[selectedMappingKey] || countryMappings['United Kingdom'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="trust-data-assumptions-tab">
      {/* 1. Header & Source-Document Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-teal-700" />
              Official Research Reference
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              DCT_EDA_Report.pdf (24 September 2026)
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-display mt-1.5">
            Trust, Data & Assumptions
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Full methodological transparency, data coverage registers, missingness policies, and empirical governance rules grounded in the official DCT Exploratory Data Analysis.
          </p>
        </div>

        {/* Source Document Reference Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 self-start md:self-auto">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FileText className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Document: DCT_EDA_Report.pdf</span>
          </div>
          <div className="text-[11px] text-slate-600 space-y-0.5 pl-6">
            <div>Author: DCT / EDA notes · Notebooks/01.ipynb</div>
            <div className="text-slate-500 font-mono">Date: 24 September 2026</div>
          </div>
        </div>
      </div>

      {/* 2. Mandatory Visible Status Banner */}
      <div
        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950"
        id="trust-status-banner"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs bg-amber-500/20 text-amber-900 px-2 py-0.5 rounded font-mono uppercase">
                EDA MODE
              </span>
              <span className="font-bold text-sm text-amber-950">
                Current analytical target: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              The application is operating in Exploratory Data Analysis (EDA) Mode. No machine learning predictive model has been trained or evaluated in this report.
            </p>
          </div>
        </div>
        <DataStatusChip status="Estimated" size="md" />
      </div>

      {/* 3. Model Status & Target Definition Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Status Card: explicitly displays "Model not yet trained" */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
              Predictive Architecture Status
            </span>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              Model not yet trained
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 font-display">
            Current Model Status: Architecture Defined, Validation Pending
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            The EDA report established the modeling architecture (Page 19) specifying <strong>one observation per nationality and month</strong> pooled across all 45 nationalities. However, <strong>no machine learning model has yet been trained, tuned, or benchmarked</strong>. Placeholder WMAPE scores or simulated error distributions are intentionally disabled to protect scientific integrity.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Planned Next Steps (Report Page 19):
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
              <li>Freeze prediction-time inputs and chronological evaluation periods</li>
              <li>Establish regularized regression baseline against holdout test partitions</li>
              <li>Benchmark XGBoost iterations against the baseline regression</li>
            </ul>
          </div>
        </div>

        {/* Guest Night Status Card: explicitly displays "Guest Nights — not yet supported" */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
              Lodging Duration Status
            </span>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
              Guest Nights — not yet supported
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 font-display">
            Guest-Night Component: Pending Stay-Duration Data
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Forecasting total Guest Nights requires empirical length of stay (ALOS), overnight participation rates, and month-boundary carry-over rules that are not yet established (Page 19). The EDA report explicitly designated the guest-night component as <strong>later work</strong>.
          </p>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Governance Constraint:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Any display of confirmed guest-night totals or room revenue projections would be an unsupported extrapolation. Planners must focus on Monthly New Check-in Arrivals.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Data Coverage & Missingness Policy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Observation Audit & Missingness Policy
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            Data Coverage Summary & Non-Zero Imputation Policy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rigorous standards derived from Pages 9, 10, and 44–46 of the EDA report to prevent missing records from corrupting tourism decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Database className="w-4 h-4 text-teal-700" />
              <span>Observed Sample Window</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>58,360 paired daily hotel observations</strong> spanning January 2022 to July 2025 across 45 nationalities. Flight records span January 2022 to February 2026 across 33 origin markets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2 text-rose-950">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <XCircle className="w-4 h-4 text-rose-700" />
              <span>Missing Data Rule: Never Zero</span>
            </div>
            <p className="text-rose-900 leading-relaxed">
              Missing observations (absent rows or blank fields) <strong>must strictly never be interpreted as numeric zeros</strong>. Blank entries signify uncollected or withheld data, not zero tourist demand.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Known Missingness Clusters</span>
            </div>
            <p className="text-amber-900 leading-relaxed">
              Finland suffered severe summer missingness (only <strong>15 of 50 months</strong> qualified for complete-month screening). Same-Day Guests also exhibits widespread reporting gaps (Page 46).
            </p>
          </div>
        </div>
      </div>

      {/* 5. Reporting-Frequency Change Warning & Weekly-Frequency Limitation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Aviation Data Granularity
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            Reporting-Frequency Shift & Weekly-Frequency Limitations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>2022 vs. 2023 Reporting-Frequency Break</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Flight records throughout calendar year 2022 were aggregated and month-stamped in source records. Daily-dated flight entries began only in January 2023 (Page 11). Any comparisons spanning the January 2023 boundary cross a fundamental change in recording granularity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Plane className="w-4 h-4 text-teal-700" />
              <span>Weekly-Frequency Limitation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Airline schedules fluctuate with seasonal rotations and aircraft swaps. Weekly flight frequency is an analytical derivation from monthly seat totals; airport records do not provide an independent weekly frequency field separate from recorded operational capacity.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Market-Mapping Explanation: Crucial Distinction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Cross-Dataset Alignment
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            Market-Mapping: Why “Country” is Never Just “Country”
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            Aviation timetables record where flights departed from, whereas hotel registries record the passport of arriving guests. Statistical associations between the two are exploratory co-movements, not verified passenger flows.
          </p>
        </div>

        {/* 3 Core Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold uppercase tracking-wider">
              <Plane className="w-4 h-4 text-teal-700" />
              <span>Flight Departure Country</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The geographical nation where the aircraft physically departed (e.g. <strong>United Kingdom</strong> for a flight departing London Heathrow).
            </p>
            <span className="inline-block text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Source: Airport Operations
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span>Hotel Guest Nationality</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The passport nationality recorded when the guest registers at a commercial hotel in Abu Dhabi (e.g. <strong>British, Japanese, Saudi</strong>).
            </p>
            <span className="inline-block text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Source: Hotel Guest Registry
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold uppercase tracking-wider">
              <Building className="w-4 h-4 text-teal-700" />
              <span>Modelled Source Market</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The analytical market portfolio defined by DCT planners to evaluate route investments and regional tourism campaigns.
            </p>
            <span className="inline-block text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Source: DCT Strategy
            </span>
          </div>
        </div>

        {/* Interactive Mapping Breakdown */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-900">
              Inspect Market Mapping Audit:
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(countryMappings).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedMappingKey(k)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    selectedMappingKey === k
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {activeMapping.modelledSourceMarket} ({activeMapping.flightOriginCountry})
              </span>
              <span className="text-[10.5px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Confidence: {activeMapping.mappingConfidence}
              </span>
            </div>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">
              {activeMapping.explanation}
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Primary Guest Passport: <strong>{activeMapping.guestNationalityMix[0]?.hotelGuestNationality} ({(activeMapping.guestNationalityMix[0]?.sharePercentage * 100).toFixed(0)}%)</strong></span>
              <span className="italic text-slate-400">EDA Market Research · Page 16 & 38</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Assumption Register & Field Definitions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Transparency Dictionary
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            Assumption Register & Field Definitions
          </h2>
          <p className="text-xs text-slate-600">
            Official definitions of aviation and lodging terms, ensuring non-technical planners have complete conceptual clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {glossaryItems.map((item) => (
            <div key={item.term} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{item.term}</h3>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-600 text-[11.5px] leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Official Runtime Data Integration Audit */}
      <div className="pt-2">
        <DataIntegrationCheck isStandalonePage={true} />
      </div>
    </div>
  );
};
