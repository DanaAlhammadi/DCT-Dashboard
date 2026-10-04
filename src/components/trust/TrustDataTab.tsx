import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import { EdaService } from '../../services/edaService';
import { ScenarioResult } from '../../types/dashboard';
import {
  ShieldCheck,
  AlertTriangle,
  Brain,
  Database,
  Compass,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { DataIntegrationCheck } from '../dev/DataIntegrationCheck';

interface Props {
  currentResult?: ScenarioResult;
}

export const TrustDataTab: React.FC<Props> = () => {
  const [showTechnicalAudit, setShowTechnicalAudit] = useState<boolean>(false);

  const sections = [
    {
      id: 'performance',
      title: 'Model performance',
      icon: Brain,
      badge: 'WMAPE: 25.52%',
      headline: 'Seasonal Benchmark Outperformed Linear Aviation Regression',
      body: 'Evaluation on holdout testing revealed that the simple Seasonal Benchmark (22.63% WMAPE) beat the reference aviation regression model (25.52% WMAPE). This proves that organic seasonality and holiday patterns are the dominant driver of hotel demand alongside flight capacity.',
      rule: 'Predictions must always be viewed alongside natural seasonal rhythms rather than as pure aviation causality.',
    },
    {
      id: 'coverage',
      title: 'Data coverage',
      icon: Database,
      badge: '50 Months Observed',
      headline: 'Strict Calendar Month Completeness Standard',
      body: 'Historical data spans January 2022 through February 2026. A calendar month is marked complete only when 100% of calendar days have recorded metrics. Incomplete months are preserved in data exports but strictly excluded from baseline target fitting.',
      rule: 'Null records are retained as unavailable and never substituted with zero.',
    },
    {
      id: 'mapping',
      title: 'Market mapping',
      icon: Compass,
      badge: 'Screening Weights',
      headline: 'Flight Origin Country Is Not Guest Passport Nationality',
      body: 'A flight departing Frankfurt or London carries diverse travelers, including German, British, American, and Asian passengers. SILA utilizes exploratory correlation weights to screen relationships, but never treats flight origin as a 1:1 passenger nationality identity.',
      rule: 'Exploratory correlations do not establish verified passenger-nationality flows.',
    },
    {
      id: 'assumptions',
      title: 'Assumptions & multipliers',
      icon: Layers,
      badge: 'Factor: 3.44×',
      headline: 'Recorded Guest-Days Proxy vs. Verified Guest Nights',
      body: 'SILA multiplies predicted hotel check-ins by the historical market factor (3.44× for India, 4.2× for UK). This produces a recorded guest-day proxy. It does not measure true length of stay or verified room nights.',
      rule: 'Always treat Guest-Days as an analytical proxy rather than verified room revenue nights.',
    },
    {
      id: 'limitations',
      title: 'Methodological limitations',
      icon: AlertCircle,
      badge: 'Non-Aviation Scope',
      headline: 'Overland GCC Travel & External Tourism Drivers',
      body: 'Hotel registers record visitors arriving by car from Oman, Saudi Arabia, and other GCC neighbors. These arrivals appear in hotel statistics but have no corresponding flight record at Zayed International Airport.',
      rule: 'Increases in regional hotel demand during summer cannot be fully explained by flight schedules.',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-150 max-w-5xl mx-auto" id="trust-data-assumptions-tab">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0A2E4D] font-display">
          Can I rely on this result?
        </h1>
        <p className="text-sm sm:text-base text-[#0A2E4D]/60 font-normal leading-relaxed">
          Full methodological transparency, model benchmarks, and empirical data governance grounded in DCT research.
        </p>
      </div>

      {/* 5 Core Trust Sections in Apple-like Editorial Cards */}
      <div className="space-y-5">
        {sections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0A2E4D]/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0E6B6E]/10 text-[#0E6B6E] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#0A2E4D] tracking-tight">
                      {sec.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-[#0A2E4D]/60 self-start sm:self-auto">
                  {sec.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-medium text-[#0A2E4D]">
                  {sec.headline}
                </h4>
                <p className="text-xs sm:text-sm text-[#0A2E4D]/70 leading-relaxed font-normal">
                  {sec.body}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F1EA]/70 border border-[#0A2E4D]/10 text-xs text-[#0A2E4D] flex items-start gap-2">
                <span className="font-semibold text-[#0E6B6E] shrink-0">Governance Rule:</span>
                <span className="text-[#0A2E4D]/80">{sec.rule}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progressive Disclosure: Technical Details & Full Data Audit */}
      <div className="pt-2">
        <button
          type="button"
          id="toggle-technical-audit-btn"
          onClick={() => setShowTechnicalAudit((prev) => !prev)}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-[#F4F1EA]/80 border border-[#0A2E4D]/10 text-[#0A2E4D] text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#0E6B6E]" />
            <span>Technical Verification &amp; Data Integration Audit (9 Server Datasets)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0A2E4D]/50 font-normal text-xs">
            <span>{showTechnicalAudit ? 'Hide technical audit' : 'Show full technical audit'}</span>
            {showTechnicalAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showTechnicalAudit && (
          <div className="mt-4 animate-in fade-in duration-200">
            <DataIntegrationCheck isStandalonePage={true} />
          </div>
        )}
      </div>
    </div>
  );
};
