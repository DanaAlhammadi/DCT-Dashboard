import React, { useState } from 'react';
import { DataService } from '../../services/dataService';
import { EdaService } from '../../services/edaService';
import { ReportInsightsPanel } from '../common/ReportInsightsPanel';
import { InfoTooltip } from '../common/InfoTooltip';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import {
  Users,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Plane,
  Database,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { DataStatusChip } from '../common/DataStatusChip';

export const MarketInsightsTab: React.FC = () => {
  const nationalities = DataService.getNationalities();
  const [selectedNationalityId, setSelectedNationalityId] = useState<string>('British');
  const selectedNationality =
    nationalities.find((n) => n.id === selectedNationalityId) || nationalities[0];

  // Accordion state for secondary technical details in each of the 6 sections
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const toggleDrawer = (id: string) => {
    setOpenDrawer((prev) => (prev === id ? null : id));
  };

  // Section 1: Guests vs New Arrivals (Empirical Comparison Data)
  const guestsVsArrivalsData = [
    { period: 'Jan 2022', guests: 1950, newArrivals: 480, nationality: 'UK' },
    { period: 'Jul 2022', guests: 620, newArrivals: 140, nationality: 'UK' },
    { period: 'Jan 2023', guests: 2400, newArrivals: 590, nationality: 'UK' },
    { period: 'Jul 2023', guests: 710, newArrivals: 165, nationality: 'UK' },
    { period: 'Jan 2024', guests: 3100, newArrivals: 740, nationality: 'UK' },
    { period: 'Jul 2024', guests: 820, newArrivals: 190, nationality: 'UK' },
    { period: 'Jan 2025', guests: 3800, newArrivals: 910, nationality: 'UK' },
  ];

  // Section 2: Arrival Share by Nationality (Boxplot distribution summary from Page 2 & 3)
  const arrivalShareData = [
    { market: 'Oman', share: 63.0, category: 'Short-Haul Gulf', gapType: 'Rapid Turnover / Short Stay' },
    { market: 'Qatar', share: 50.1, category: 'Short-Haul Gulf', gapType: 'Rapid Turnover' },
    { market: 'China', share: 42.2, category: 'Long-Haul Asia', gapType: 'High Arrival Proportion' },
    { market: 'Saudi Arabia', share: 40.9, category: 'Regional GCC', gapType: 'Moderate Turnover' },
    { market: 'Israel', share: 35.7, category: 'Near-East', gapType: 'Moderate Stay' },
    { market: 'Canada', share: 24.5, category: 'Long-Haul West', gapType: 'Extended Multi-night Stay' },
    { market: 'UK', share: 22.0, category: 'Long-Haul West', gapType: 'Longer Multiday Stay' },
    { market: 'Germany', share: 20.5, category: 'Long-Haul West', gapType: 'Longer Multiday Stay' },
  ];

  // Section 3: Seasonality Divergence (Europe vs Gulf from Page 6 & 7)
  const seasonalityComparisonData = [
    { month: 'Jan', europeIndex: 110, gccIndex: 55, indiaIndex: 90 },
    { month: 'Feb', europeIndex: 135, gccIndex: 75, indiaIndex: 92 },
    { month: 'Mar', europeIndex: 145, gccIndex: 85, indiaIndex: 98 },
    { month: 'Apr', europeIndex: 120, gccIndex: 60, indiaIndex: 95 },
    { month: 'May', europeIndex: 85, gccIndex: 70, indiaIndex: 108 },
    { month: 'Jun', europeIndex: 45, gccIndex: 130, indiaIndex: 90 },
    { month: 'Jul', europeIndex: 40, gccIndex: 185, indiaIndex: 75 },
    { month: 'Aug', europeIndex: 55, gccIndex: 215, indiaIndex: 60 },
    { month: 'Sep', europeIndex: 75, gccIndex: 80, indiaIndex: 95 },
    { month: 'Oct', europeIndex: 125, gccIndex: 70, indiaIndex: 120 },
    { month: 'Nov', europeIndex: 135, gccIndex: 85, indiaIndex: 140 },
    { month: 'Dec', europeIndex: 145, gccIndex: 75, indiaIndex: 155 },
  ];

  // Section 4: Passenger Composition Breakdown (AUH Totals from Page 12)
  const passengerCompositionData = [
    { period: '2022 H1', p2p: 210, transfer: 240, transit: 12 },
    { period: '2022 H2', p2p: 290, transfer: 295, transit: 15 },
    { period: '2023 H1', p2p: 380, transfer: 360, transit: 18 },
    { period: '2023 H2', p2p: 440, transfer: 410, transit: 20 },
    { period: '2024 H1', p2p: 510, transfer: 470, transit: 22 },
    { period: '2024 H2', p2p: 560, transfer: 510, transit: 25 },
    { period: '2025 H1', p2p: 610, transfer: 540, transit: 28 },
  ];

  // Section 5: Data Coverage Summary (Page 9 & 44)
  const coverageAuditData = [
    { market: 'United Kingdom', observedMonths: 50, missingMonths: 0, status: 'Complete 100%' },
    { market: 'Saudi Arabia', observedMonths: 50, missingMonths: 0, status: 'Complete 100%' },
    { market: 'Germany', observedMonths: 50, missingMonths: 0, status: 'Complete 100%' },
    { market: 'India', observedMonths: 50, missingMonths: 0, status: 'Complete 100%' },
    { market: 'Finland', observedMonths: 15, missingMonths: 35, status: 'Severe Summer Gaps (Page 9)' },
    { market: 'Same-Day Guests', observedMonths: 12, missingMonths: 38, status: 'High Missingness (Page 46)' },
  ];

  // Section 6: Market-Mapping Research (Raw vs Adjusted Correlations from Page 14-16)
  const associationComparisonData = [
    { pair: 'Canada flights → Russia hotel check-ins', raw: 0.88, adjusted: -0.01, verdict: 'Weakened to zero (Spurious trend)' },
    { pair: 'UK flights → Qatar hotel check-ins', raw: 0.75, adjusted: 0.10, verdict: 'Weakened (Co-seasonal confound)' },
    { pair: 'Japan flights → Qatar hotel check-ins', raw: 0.76, adjusted: 0.08, verdict: 'Weakened significantly' },
    { pair: 'Czechia flights → Poland hotel check-ins', raw: 0.75, adjusted: 0.70, verdict: 'Persisted strong' },
    { pair: 'Mexico flights → Qatar hotel check-ins', raw: 0.34, adjusted: 0.56, verdict: 'Strengthened after adjustment' },
    { pair: 'Pakistan flights → China hotel check-ins', raw: -0.25, adjusted: 0.61, verdict: 'Flipped sign completely' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150" id="market-season-insights-tab">
      {/* 0. Header with Nationality Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              EDA Mode Intelligence
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Source: DCT_EDA_Report.pdf</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 font-display mt-1.5">
            Market & Season Insights
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Exploratory data analysis investigating the relationship between inbound aviation capacity and Abu Dhabi hotel check-ins across 45 tourist nationalities and 33 departure markets.
          </p>
        </div>

        {/* Nationality Selector */}
        <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <label htmlFor="eda-nationality-select" className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">
            Focus Market:
          </label>
          <select
            id="eda-nationality-select"
            value={selectedNationalityId}
            onChange={(e) => setSelectedNationalityId(e.target.value)}
            className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          >
            {nationalities.map((nat) => (
              <option key={nat.id} value={nat.id}>
                {nat.flag} {nat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Report Insights Panel: "What the research currently tells us" */}
      <ReportInsightsPanel />

      {/* SECTION 1: Guests versus New Arrivals */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-guests-vs-arrivals">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Page 1 · Fundamental Target Definition
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              1. Guests vs. New Arrivals: Two Distinct Measures
            </h2>
          </div>
          <DataStatusChip status="Observed" size="sm" />
        </div>

        {/* 4 Required Metadata Points for Beginners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              In all <strong>58,360 paired observations</strong> from Jan 2022 to Jul 2025, recorded Guests exceeded New Arrivals with zero exceptions.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              Airlines bring <strong>new check-ins</strong>. Modeling continuing guests who already arrived days earlier distorts the true flight-to-hotel conversion rate.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              The size of the gap is <strong>not a direct estimate of stay length</strong>. Individual room records are required to calculate true length of stay.
            </p>
          </div>
        </div>

        {/* Primary Visual: Guests vs New Arrivals */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            In-House Guests vs. Newly Arrived Check-ins (Sample UK Time Series, 2022–2025)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={guestsVsArrivalsData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  formatter={(val: any) => [val?.toLocaleString(), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="guests" name="Total In-House Guests (Stock)" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="newArrivals" name="New Hotel Arrivals (Flow / Target)" fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expandable Secondary Details */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('guests-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'guests-details' ? 'Collapse secondary technical notes' : 'Expand technical details on the 58,360 paired observations'}</span>
            {openDrawer === 'guests-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'guests-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Methodological Context (Page 1):</strong> The researcher initially evaluated "Guests" as the target because it was withheld from the supplied test partition. Comparing both fields confirmed that "New Arrivals" represents newly initiated hotel bookings. The first machine learning model was therefore specified around Monthly New Arrivals pooled across nationalities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Arrival-Share Differences */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-arrival-share">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Pages 2–4 · Daily Check-in Velocity
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              2. Arrival-Share Differences Across Source Markets
            </h2>
          </div>
          <DataStatusChip status="Observed" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              Median daily arrival share varies from <strong>63.0% in Oman</strong> and <strong>50.1% in Qatar</strong> to <strong>24.5% in Canada</strong>. China is also elevated at <strong>42.2%</strong>.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              A flight from the Gulf produces immediate high check-in turnover, whereas a flight from North America produces longer stays with fewer check-ins per in-house guest.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              The ratio alone cannot establish stay duration or isolate same-day visits. High shares reflect rapid turnover, not necessarily short vacations.
            </p>
          </div>
        </div>

        {/* Primary Visual: Horizontal Bar Chart of Median Arrival Shares */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            Median Daily New Arrivals as % of Total Guests (Report Benchmark Ratios)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arrivalShareData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" unit="%" domain={[0, 70]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="market" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} width={80} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val}% (${item.payload.gapType})`,
                    'Median Daily Arrival Share',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="share" name="Median Daily Share" fill="#0f766e" radius={[0, 4, 4, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('share-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'share-details' ? 'Collapse persistence heatmap notes' : 'Expand notes on monthly persistence across 45 nationalities (Page 4)'}</span>
            {openDrawer === 'share-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'share-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Monthly Heatmap Finding (Page 4):</strong> These arrival-share differences were tracked month-by-month from 2022 to 2025. The disparities are persistent over time rather than isolated anomalies, indicating structural differences in market travel habits.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Seasonal Market Patterns */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-seasonality">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Pages 6–8 · Seasonal Profile Analysis
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              3. Seasonal Market Patterns: European Troughs vs. Gulf Peaks
            </h2>
          </div>
          <DataStatusChip status="Observed" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              Germany & France experience deep summer troughs (&lt;50 index). In contrast, <strong>Oman, Qatar, and Saudi Arabia show summer peaks</strong> (180–250 index).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              Capacity incentives must be scheduled counter-cyclically. European airline support belongs in winter; Gulf flight frequency should peak in summer.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              A targeted weekday check <strong>did not settle the driving hypothesis</strong>; Thursday peaks were clearer outside summer. Hotel records do not record transport mode.
            </p>
          </div>
        </div>

        {/* Primary Visual: Seasonal Index Comparison (Line Chart) */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            Monthly Seasonal Indices (100 = Annual Daily Mean)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonalityComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis domain={[0, 250]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  formatter={(val: any) => [`${val} index`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="europeIndex" name="Western Europe (Summer Trough)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gccIndex" name="Gulf / GCC Markets (Summer Peak)" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="indiaIndex" name="India (Moderate Dip & Winter Surge)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('seasonality-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'seasonality-details' ? 'Collapse weekday driving check details' : 'Expand weekday driving check details (Page 8)'}</span>
            {openDrawer === 'seasonality-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'seasonality-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Weekday Check Summary (Page 8):</strong> To test if Gulf summer peaks were driven by road trips from Oman or Saudi Arabia, weekday arrival shares were evaluated. Thursday weekend peaks were clearer outside summer. The report concluded: <em>"I did not find a clear common pattern supporting the driving explanation. Hotel records do not identify transport mode."</em>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Aviation Capacity and Passenger Composition */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-aviation-composition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Pages 11–13 · Passenger Composition & Capacity
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              4. Aviation Capacity & Passenger Composition: Why P2P is Key
            </h2>
          </div>
          <DataStatusChip status="Observed" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              Total PAX includes <strong>40% to 55% connecting transfer passengers</strong> who never enter Abu Dhabi. P2P became the starting aviation metric.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              Routes dominated by transfer traffic produce minimal hotel bookings. Point-to-Point (P2P) traffic is the true lever for hotel occupancy.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              P2P passengers are <strong>not automatically hotel guests</strong>; they include returning UAE residents and visitors staying with family.
            </p>
          </div>
        </div>

        {/* Primary Visual: Stacked Bar Chart of Passenger Composition */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            Arriving Passenger Composition at AUH (Thousands of Passengers per Half-Year)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passengerCompositionData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  formatter={(val: any) => [`${val}k PAX`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="p2p" name="Point-to-Point (Destination Abu Dhabi)" fill="#0f766e" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={32} />
                <Bar dataKey="transfer" name="Transfer (Connecting Onward)" fill="#cbd5e1" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={32} />
                <Bar dataKey="transit" name="Transit (Technical Stop)" fill="#e2e8f0" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('composition-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'composition-details' ? 'Collapse seat excess & infant details' : 'Expand details on PAX exceeding seats & lap infants (Page 13)'}</span>
            {openDrawer === 'composition-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'composition-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Infant Adjustment (Page 13):</strong> 9,896 records had passenger counts exceeding scheduled seats. Excluding non-seated lap infants resolved 77.3% of these cases, leaving 2,246 records flagged. The reporting frequency also shifted from month-stamped in 2022 to daily-dated in 2023.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Data Coverage and Missingness */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-data-coverage">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Pages 9, 10, 44–46 · Coverage & Missingness Rules
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              5. Data Coverage & Missingness: Missing is Never Zero
            </h2>
          </div>
          <DataStatusChip status="Observed" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              Data gaps cluster in specific months (e.g. <strong>Finland retained only 15 of 50 months</strong>). Same-Day Guests also has substantial missingness.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              Missing records must <strong>never be converted to zero</strong>. Imputing zero would distort seasonal indices and lead to mistaken capacity cuts.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              Complete-month screening rules exclude valid low-volume dates; coverage indicators must be presented alongside all metrics.
            </p>
          </div>
        </div>

        {/* Primary Visual: Coverage Audit Table */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            Sample Data Availability Audit across 50 Historical Months (Jan 2022 – Feb 2026)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">Nationality / Dimension</th>
                  <th className="py-2.5 px-3 font-bold text-center">Complete Months</th>
                  <th className="py-2.5 px-3 font-bold text-center">Missing Months</th>
                  <th className="py-2.5 px-3 font-bold">Coverage Status</th>
                  <th className="py-2.5 px-3 font-bold">Report Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coverageAuditData.map((row) => (
                  <tr key={row.market} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">{row.market}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-teal-800">{row.observedMonths} / 50</td>
                    <td className="py-2 px-3 text-center font-mono text-slate-500">{row.missingMonths}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${
                        row.observedMonths >= 45 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">
                      {row.market === 'Finland'
                        ? 'Summer observations clustered missing check-ins; screened down to 15 months.'
                        : row.market === 'Same-Day Guests'
                        ? 'Working dictionary combines zero, suppression, and unavailability.'
                        : 'Full historical continuous series observed.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('coverage-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'coverage-details' ? 'Collapse hotel accounting check notes' : 'Expand hotel accounting consistency check (Page 10)'}</span>
            {openDrawer === 'coverage-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'coverage-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Accounting Consistency Check (Page 10):</strong> The check verified whether daily guest increases (G_t - G_t-1) could be covered by that day's New Arrivals. Only 14 exceptions occurred across 58,236 eligible comparisons (0.024%). Eight were minor excesses of 1–4 guests.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: Market-Mapping Research */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4" id="section-market-mapping">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Pages 14–17, 35–43 · Cross-Market Correlations
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-1">
              6. Market-Mapping Research: Raw vs. Adjusted Associations
            </h2>
          </div>
          <DataStatusChip status="Derived" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              What the report found
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              High raw correlations often collapse after adjustment (e.g. <strong>Canada flights to Russian guests fell from 0.88 to -0.01</strong>; UK flights to Qatar check-ins fell from 0.75 to 0.10).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80">
            <span className="text-[10.5px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Why it matters for DCT
            </span>
            <p className="text-teal-950 leading-relaxed font-medium">
              Prevents attributing hotel check-ins to flight routes that merely share general holiday seasons. Ensures airline subsidies target routes with real visitor causality.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Important limitation
            </span>
            <p className="text-amber-950 leading-relaxed font-medium">
              Adjusted associations are <strong>exploratory correlations, not verified passenger flows</strong>. They do not prove individual passenger travel itineraries.
            </p>
          </div>
        </div>

        {/* Primary Visual: Table comparing Raw vs Adjusted Correlations */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 mb-2">
            Raw vs. Adjusted Statistical Associations (Removing Seasonal & Trend Confounders)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">Evaluated Relationship</th>
                  <th className="py-2.5 px-3 text-center font-bold">Raw (r)</th>
                  <th className="py-2.5 px-3 text-center font-bold">Adjusted (r)</th>
                  <th className="py-2.5 px-3 font-bold">Statistical Shift</th>
                  <th className="py-2.5 px-3 font-bold">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {associationComparisonData.map((row) => (
                  <tr key={row.pair} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">{row.pair}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{row.raw.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-teal-800 bg-teal-50/40">
                      {row.adjusted.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-slate-700 font-semibold">{row.verdict}</td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">
                      {row.adjusted <= 0.15
                        ? 'Apparent link was caused by shared calendar holidays and travel growth.'
                        : 'Connection remains observable even after removing global seasonal cycles.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDrawer('mapping-details')}
            className="flex items-center justify-between w-full py-1 text-xs font-semibold text-teal-800 hover:text-teal-950"
          >
            <span>{openDrawer === 'mapping-details' ? 'Collapse departure vs nationality notes' : 'Expand notes on Japanese/Korean check-ins tracking UK departures (Page 16)'}</span>
            {openDrawer === 'mapping-details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openDrawer === 'mapping-details' && (
            <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 mt-2 space-y-2 animate-in fade-in duration-100">
              <p>
                <strong>Third-Country Departure Tracking (Page 16):</strong> Japanese and South Korean check-ins in Abu Dhabi tracked UK flight departures more closely (adjusted r = 0.65 and 0.67) than direct East Asian departures. The report cautions: <em>"I would not assume every nationality should use only its matching country's aviation data. Selected alternatives still need evaluation on later periods."</em>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
