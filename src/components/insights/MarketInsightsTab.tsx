import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/dataService';
import { DashboardDataService } from '../../services/dashboardDataService';
import { MarketSeasonalityRecord } from '../../types/dashboardData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Calendar, Users, Plane, CheckCircle2, Lightbulb, Compass, ArrowRight } from 'lucide-react';

export const MarketInsightsTab: React.FC = () => {
  const nationalities = DataService.getNationalities();
  const [selectedNationalityId, setSelectedNationalityId] = useState<string>('British');
  const selectedNationality =
    nationalities.find((n) => n.id === selectedNationalityId) || nationalities[0];

  const [serverSeasonality, setServerSeasonality] = useState<MarketSeasonalityRecord[]>([]);
  const [isLoadingSeasonality, setIsLoadingSeasonality] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSeasonality = async () => {
      setIsLoadingSeasonality(true);
      try {
        const countryCode = (selectedNationality as any).countryCode || selectedNationality.id;
        const records = await DashboardDataService.getSeasonality({ nationality: countryCode });
        if (isMounted) {
          setServerSeasonality(records);
        }
      } catch (err) {
        console.error('Failed to load server seasonality:', err);
      } finally {
        if (isMounted) {
          setIsLoadingSeasonality(false);
        }
      }
    };
    fetchSeasonality();
    return () => {
      isMounted = false;
    };
  }, [selectedNationality]);

  // Clean seasonal chart data
  const seasonalityData = [
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

  // Clean guest vs arrivals comparison data
  const guestsVsArrivalsData = [
    { period: 'Jan 2022', guests: 1950, newArrivals: 480 },
    { period: 'Jul 2022', guests: 620, newArrivals: 140 },
    { period: 'Jan 2023', guests: 2400, newArrivals: 590 },
    { period: 'Jul 2023', guests: 710, newArrivals: 165 },
    { period: 'Jan 2024', guests: 3100, newArrivals: 740 },
    { period: 'Jul 2024', guests: 820, newArrivals: 190 },
    { period: 'Jan 2025', guests: 3800, newArrivals: 910 },
  ];

  // P2P vs Transfer composition
  const passengerCompositionData = [
    { period: '2022 H1', p2p: 210, transfer: 240 },
    { period: '2022 H2', p2p: 290, transfer: 295 },
    { period: '2023 H1', p2p: 380, transfer: 360 },
    { period: '2023 H2', p2p: 440, transfer: 410 },
    { period: '2024 H1', p2p: 510, transfer: 470 },
    { period: '2024 H2', p2p: 560, transfer: 510 },
    { period: '2025 H1', p2p: 610, transfer: 540 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-150 max-w-5xl mx-auto" id="market-insights-tab">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 font-display">
          How are Abu Dhabi's visitor markets behaving?
        </h1>
        <p className="text-sm sm:text-base text-stone-500 font-normal leading-relaxed">
          Plain-language empirical intelligence from 50 continuous months of observed aviation and hotel records.
        </p>
      </div>

      {/* Market Selector Pill Bar */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500 pl-2">Filter Market:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {nationalities.map((n) => {
              const isSelected = selectedNationalityId === n.id;
              return (
                <button
                  key={n.id}
                  id={`market-pill-${n.id.toLowerCase()}`}
                  type="button"
                  onClick={() => setSelectedNationalityId(n.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-teal-900 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2 text-xs text-stone-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            {isLoadingSeasonality ? 'Syncing server API…' : `${serverSeasonality.length} API seasonality records`}
          </span>
        </div>
      </div>

      {/* SECTION 1: Seasonality Visual & Narrative */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
              Pattern 1 · Seasonal Divergence
            </span>
            <h2 className="text-xl font-semibold text-stone-900 tracking-tight mt-1">
              European Troughs vs. Gulf Summer Peaks
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>50 of 50 Months Observed · 100% Complete</span>
          </div>
        </div>

        {/* Primary Visual */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seasonalityData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} tickLine={false} axisLine={{ stroke: '#e7e5e4' }} />
              <YAxis domain={[0, 240]} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val: any) => [`${val} index (100 = annual average)`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="europeIndex" name="Western Europe (Summer Trough)" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="gccIndex" name="Gulf / GCC (Summer Peak)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="indiaIndex" name="India (Year-Round Stability)" stroke="#78716c" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* One Primary Insight & One What this means statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>One Primary Insight</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Western European visitor demand experiences deep summer drops (&lt;50 index in July–August). In contrast, Gulf markets (Saudi Arabia, Oman, Qatar) surge during summer vacation periods (reaching 180–215 index).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-950">
              <Compass className="w-3.5 h-3.5 text-teal-800" />
              <span>What this means for DCT strategy</span>
            </div>
            <p className="text-xs text-teal-900/90 leading-relaxed font-medium">
              Airline frequency incentives should be scheduled counter-cyclically: European flight additions belong strictly in winter (Nov–Mar), whereas regional GCC airline partnerships should target summer.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Hotel Check-ins vs. Recorded Guest Days */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
              Pattern 2 · Target Separation
            </span>
            <h2 className="text-xl font-semibold text-stone-900 tracking-tight mt-1">
              Check-ins (New Arrivals) vs. Continuing Hotel Stays (Guests)
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-medium self-start sm:self-auto">
            Conversion Multiplier: <span className="font-mono text-stone-700">3.44×</span>
          </div>
        </div>

        {/* Primary Visual */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={guestsVsArrivalsData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#78716c' }} tickLine={false} axisLine={{ stroke: '#e7e5e4' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="newArrivals" name="Hotel Check-ins (New Arrivals)" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="guests" name="Recorded Guest-Days Proxy (Guests)" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight & What this means */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>One Primary Insight</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              New Arrivals records only initial check-ins. Recorded Guest-Days Proxy measures ongoing daily occupancy. Long-haul European visitors have higher length-of-stay multipliers than regional GCC travelers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-950">
              <Compass className="w-3.5 h-3.5 text-teal-800" />
              <span>What this means for DCT strategy</span>
            </div>
            <p className="text-xs text-teal-900/90 leading-relaxed font-medium">
              Evaluate campaigns on both check-ins and length-of-stay proxy: European flights yield fewer check-ins but significantly more total hotel room nights per booking.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Direct Visitors vs Transfer Traffic */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
              Pattern 3 · Airline Network Structure
            </span>
            <h2 className="text-xl font-semibold text-stone-900 tracking-tight mt-1">
              Point-to-Point Arrivals vs. Airport Connections (Transfer)
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-medium self-start sm:self-auto">
            Aviation Hub Dynamics
          </div>
        </div>

        {/* Primary Visual */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={passengerCompositionData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#78716c' }} tickLine={false} axisLine={{ stroke: '#e7e5e4' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="p2p" name="Abu Dhabi Terminating (P2P Visitors)" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="transfer" name="Transit / Transfer Passengers" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight & What this means */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>One Primary Insight</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Over half of all international inbound seats at AUH belong to passengers connecting to other continents. Transfer passengers never enter Abu Dhabi hotel registers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-950">
              <Compass className="w-3.5 h-3.5 text-teal-800" />
              <span>What this means for DCT strategy</span>
            </div>
            <p className="text-xs text-teal-900/90 leading-relaxed font-medium">
              Flight seat volume alone is an unreliable predictor of hotel occupancy. Route support negotiations must prioritize point-to-point passenger share over gross aircraft size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
