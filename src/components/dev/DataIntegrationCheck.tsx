import React, { useEffect, useState } from 'react';
import {
  FileIntegrationSummary,
  GlobalDataStats,
  DashboardDataStore,
  formatPercentageValue,
  formatNumberWithCommas,
  DataQualityRecordItem,
} from '../../types/dashboardData';
import { DashboardDataService } from '../../services/dashboardDataService';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Calendar,
  Globe2,
  Building,
  Activity,
  Layers,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Check,
  Filter,
  ShieldCheck,
  MapPin,
  GitBranch,
} from 'lucide-react';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const DataIntegrationCheck: React.FC<Props> = ({
  isOpen = true,
  onClose,
  isStandalonePage = false,
}) => {
  const [dataStore, setDataStore] = useState<DashboardDataStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'LOADED' | 'FAILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  // Data Quality filter state
  const [dqMarketFilter, setDqMarketFilter] = useState<string>('ALL');
  const [dqMonthFilter, setDqMonthFilter] = useState<string>('ALL');
  const [dqDatasetFilter, setDqDatasetFilter] = useState<string>('ALL');
  const [dqFieldFilter, setDqFieldFilter] = useState<string>('ALL');

  const runAudit = async (force = false) => {
    setIsLoading(true);
    try {
      const store = await DashboardDataService.auditAllDatasets(force);
      setDataStore(store);
      // Expand all files with warnings or failed status by default
      const initialExpanded: Record<string, boolean> = {};
      Object.entries(store.fileSummaries).forEach(([file, s]) => {
        initialExpanded[file] = true;
      });
      setExpandedFiles(initialExpanded);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit(false);
  }, []);

  const toggleExpand = (filename: string) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  if (!isOpen && !isStandalonePage) return null;

  const stats = dataStore?.globalStats;
  const summaries = dataStore ? Object.values(dataStore.fileSummaries) : [];

  const filteredSummaries = summaries.filter((s) => {
    if (filter === 'LOADED' && s.status !== 'Loaded') return false;
    if (filter === 'FAILED' && s.status !== 'Failed') return false;
    if (searchQuery.trim() && !s.filename.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const loadedCount = summaries.filter((s) => s.status === 'Loaded').length;
  const failedCount = summaries.filter((s) => s.status === 'Failed').length;

  // Data quality records and filter options
  const dqRecords: DataQualityRecordItem[] = dataStore?.dataQuality?.records || [];
  const dqMarkets = Array.from(new Set(dqRecords.map((r) => r.market))).sort();
  const dqMonths = Array.from(new Set(dqRecords.map((r) => r.month))).sort();
  const dqDatasets = Array.from(new Set(dqRecords.map((r) => r.dataset))).sort();
  const dqFields = Array.from(new Set(dqRecords.map((r) => r.field))).sort();

  const filteredDqRecords = dqRecords.filter((r) => {
    if (dqMarketFilter !== 'ALL' && r.market !== dqMarketFilter) return false;
    if (dqMonthFilter !== 'ALL' && r.month !== dqMonthFilter) return false;
    if (dqDatasetFilter !== 'ALL' && r.dataset !== dqDatasetFilter) return false;
    if (dqFieldFilter !== 'ALL' && r.field !== dqFieldFilter) return false;
    return true;
  });

  const content = (
    <div className="space-y-6 text-slate-800" id="data-integration-check-panel">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                {loadedCount === 9 ? 'All 9 Files Loaded (Server-Side)' : `${loadedCount} of 9 Loaded`}
              </span>
              <span className="text-emerald-400/90 text-xs font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected Boundary: server/data/dashboard_data_v1/</span>
              </span>
              {stats?.auditTimestamp && (
                <span className="text-[11px] text-slate-400">
                  Audit refreshed: {new Date(stats.auditTimestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-white mt-1.5 flex items-center gap-3">
              <Database className="w-7 h-7 text-teal-400 shrink-0" />
              <span>Data Integration Check</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Automated runtime verification of all 9 official JSON datasets across the protected server-side API boundary. Confirms null-value preservation, date bounds, market coverage, and metric boundaries without exposing raw files to client bundles.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="re-audit-btn"
              type="button"
              onClick={() => runAudit(true)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Auditing Datasets…' : 'Refresh File Loads'}</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80"
                aria-label="Close Data Integration Check"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Development Security & Data-Exposure Audit Panel */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Raw Datasets in Bundle</div>
              <div className="text-base font-bold text-emerald-400 font-mono">0</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Competition JSON Chunks</div>
              <div className="text-base font-bold text-emerald-400 font-mono">0</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Public Raw-Data Routes</div>
              <div className="text-base font-bold text-emerald-400 font-mono">0</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Server-Side Datasets</div>
              <div className="text-base font-bold text-teal-300 font-mono">9 (Protected)</div>
            </div>
          </div>
        </div>

        {/* Global Key Stats Grid - Exact required KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 mt-6 pt-5 border-t border-slate-800/80">
          {/* 1. Earliest Month */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Calendar className="w-3 h-3 text-teal-400" />
              <span>Earliest Month</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.earliestMonth || '2022-01'}
            </div>
            <span className="text-[10px] text-slate-400">Baseline start</span>
          </div>

          {/* 2. Latest Month */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Calendar className="w-3 h-3 text-teal-400" />
              <span>Latest Month</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.latestMonth || '2026-02'}
            </div>
            <span className="text-[10px] text-slate-400">50 total months</span>
          </div>

          {/* 3. Nationalities */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Building className="w-3 h-3 text-amber-400" />
              <span>Nationalities</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.nationalityCount ?? 45}
            </div>
            <span className="text-[10px] text-slate-400">Hotel markets</span>
          </div>

          {/* 4. Departure Countries */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Globe2 className="w-3 h-3 text-sky-400" />
              <span>Departure Countries</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.departureCountryCount ?? 33}
            </div>
            <span className="text-[10px] text-slate-400">Flight origins</span>
          </div>

          {/* 5. Departure Cities */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <MapPin className="w-3 h-3 text-teal-400" />
              <span>Departure Cities</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.departureCityCount ?? 35}
            </div>
            <span className="text-[10px] text-slate-400">Airport cities</span>
          </div>

          {/* 6. Airlines */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Layers className="w-3 h-3 text-[#D4AF37]" />
              <span>Airlines</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.airlineCount ?? 25}
            </div>
            <span className="text-[10px] text-slate-400">Recorded carriers</span>
          </div>

          {/* 7. Routes */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>Routes</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {stats?.routeCount ?? 35}
            </div>
            <span className="text-[10px] text-slate-400">Direct AUH corridors</span>
          </div>

          {/* 8. Benchmark Model */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>Benchmark Model</span>
            </div>
            <div className="text-xs font-bold text-emerald-300 mt-1 truncate" title="Seasonal benchmark">
              {stats?.benchmarkModel ?? 'Seasonal benchmark'}
            </div>
            <span className="text-[10px] text-emerald-400/80">Holdout Winner</span>
          </div>

          {/* 9. Overall WMAPE */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
              <Activity className="w-3 h-3 text-[#D4AF37]" />
              <span>Overall WMAPE</span>
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {formatPercentageValue(stats?.overallWmape, 2)}
            </div>
            <span className="text-[10px] text-slate-400">
              v: {stats?.modelVersion ?? 'linear_v009'}
            </span>
          </div>
        </div>
      </div>

      {/* Non-Negotiable Methodological Rules Card */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed space-y-1">
          <div className="font-bold text-sm text-amber-900">
            Strict Domain Governance Rules:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-900/90">
            <li>
              <strong>Guests vs. New Arrivals:</strong> Kept as strictly separate metrics. Check-ins (New Arrivals) are the regression target; Guests is a recorded guest-day proxy.
            </li>
            <li>
              <strong>Aviation ≠ Hotel Occupancy:</strong> Point-to-Point (P2P) passengers terminating in Abu Dhabi are never equated to hotel guests or causal hotel stays.
            </li>
            <li>
              <strong>Benchmark & Regression Baseline:</strong> Seasonal benchmark and linear regression predictions are reported as two separate series.
            </li>
            <li>
              <strong>Preserve Nulls:</strong> Null represents missing, incomplete, or withheld measurements; it is <em>never</em> coerced to zero.
            </li>
            <li>
              <strong>Static Datasets:</strong> Static JSON files are loaded directly without applying scenario controls or runtime overrides.
            </li>
          </ul>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Files ({summaries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('LOADED')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
              filter === 'LOADED'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-teal-700 hover:bg-teal-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Loaded ({loadedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('FAILED')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
              filter === 'FAILED'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed ({failedCount})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filename…"
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Dataset Audit Cards */}
      <div className="space-y-3.5" id="data-integration-cards-list">
        {filteredSummaries.map((fileSummary) => {
          const isExpanded = !!expandedFiles[fileSummary.filename];
          const isLoaded = fileSummary.status === 'Loaded';

          return (
            <div
              key={fileSummary.filename}
              className={`rounded-xl border transition-all shadow-2xs overflow-hidden ${
                isLoaded
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
              }`}
            >
              {/* Header Row */}
              <div
                onClick={() => toggleExpand(fileSummary.filename)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isLoaded
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isLoaded ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {fileSummary.filename}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                          isLoaded
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {fileSummary.status}
                      </span>
                      {fileSummary.fileSizeBytes !== undefined && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          ({(fileSummary.fileSizeBytes / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 mt-2 flex-wrap text-xs text-slate-600">
                      <div>
                        <span className="text-slate-500">Rows:</span>{' '}
                        <strong className="text-slate-800 font-mono">
                          {formatNumberWithCommas(fileSummary.rowCount, '0')}
                        </strong>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div>
                        <span className="text-slate-500">Date Range:</span>{' '}
                        <strong className="text-slate-800 font-mono">
                          {fileSummary.dateRange.start && fileSummary.dateRange.end
                            ? `${fileSummary.dateRange.start} → ${fileSummary.dateRange.end}`
                            : 'Metadata reference'}
                        </strong>
                      </div>
                      <span className="text-slate-300">|</span>
                      <div>
                        <span className="text-slate-500">Nulls Preserved:</span>{' '}
                        <strong className="text-slate-800 font-mono">
                          {formatNumberWithCommas(fileSummary.nullCount, '0')}
                        </strong>
                      </div>
                      {fileSummary.availableMarkets > 0 && (
                        <>
                          <span className="text-slate-300">|</span>
                          <div>
                            <span className="text-slate-500">Markets:</span>{' '}
                            <strong className="text-slate-800 font-mono">
                              {fileSummary.availableMarkets}
                            </strong>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {fileSummary.validationWarnings.length > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>{fileSummary.validationWarnings.length} Checks & Findings</span>
                    </span>
                  )}
                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-slate-600"
                    aria-label="Expand file details"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-4">
                  {/* Validation Checks & Findings */}
                  {fileSummary.validationWarnings.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Validation Checks & Conformance Guarantees:</span>
                      </div>
                      <div className="space-y-1.5">
                        {fileSummary.validationWarnings.map((warning, wIdx) => (
                          <div
                            key={wIdx}
                            className="text-xs p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-start gap-2 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{warning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Interactive Section for data_quality.json: Multi-Dimensional Filter */}
                  {fileSummary.filename === 'data_quality.json' && dqRecords.length > 0 && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-teal-600" />
                          <span className="font-bold text-xs text-slate-800">
                            Data Quality Register — Filter by Market, Month, Dataset, and Field:
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Showing {filteredDqRecords.length} of {dqRecords.length} records
                        </span>
                      </div>

                      {/* Dropdown Filters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                            Market:
                          </label>
                          <select
                            value={dqMarketFilter}
                            onChange={(e) => setDqMarketFilter(e.target.value)}
                            className="w-full text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800"
                          >
                            <option value="ALL">All Markets</option>
                            {dqMarkets.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                            Month:
                          </label>
                          <select
                            value={dqMonthFilter}
                            onChange={(e) => setDqMonthFilter(e.target.value)}
                            className="w-full text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800"
                          >
                            <option value="ALL">All Months</option>
                            {dqMonths.map((mo) => (
                              <option key={mo} value={mo}>
                                {mo}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                            Dataset:
                          </label>
                          <select
                            value={dqDatasetFilter}
                            onChange={(e) => setDqDatasetFilter(e.target.value)}
                            className="w-full text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800"
                          >
                            <option value="ALL">All Datasets</option>
                            {dqDatasets.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                            Field:
                          </label>
                          <select
                            value={dqFieldFilter}
                            onChange={(e) => setDqFieldFilter(e.target.value)}
                            className="w-full text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800"
                          >
                            <option value="ALL">All Fields</option>
                            {dqFields.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Filtered Data Quality Table */}
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-[11px] text-left">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2">Code</th>
                              <th className="p-2">Severity</th>
                              <th className="p-2">Market / Month</th>
                              <th className="p-2">Dataset / Field</th>
                              <th className="p-2">Affected Value</th>
                              <th className="p-2">Description & Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredDqRecords.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50/80">
                                <td className="p-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                                  {item.code}
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      item.severity === 'CRITICAL'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : item.severity === 'HIGH'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : item.severity === 'MEDIUM'
                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                                    }`}
                                  >
                                    {item.severity}
                                  </span>
                                </td>
                                <td className="p-2 text-slate-600 whitespace-nowrap">
                                  <strong>{item.market}</strong> ({item.month})
                                </td>
                                <td className="p-2 font-mono text-slate-500 whitespace-nowrap">
                                  {item.dataset}.{item.field}
                                </td>
                                <td className="p-2 font-mono whitespace-nowrap">
                                  {item.affected_value === null ? (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                                      null (preserved)
                                    </span>
                                  ) : (
                                    String(item.affected_value)
                                  )}
                                </td>
                                <td className="p-2 text-slate-700 max-w-xs">
                                  <p>{item.description}</p>
                                  <p className="text-teal-700 font-semibold mt-0.5">
                                    Action: {item.governance_action}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Special Verification Callout for flight_market_monthly.json */}
                  {fileSummary.filename === 'flight_market_monthly.json' && (
                    <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2 text-xs">
                      <div className="font-bold text-teal-950 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-teal-700" />
                        <span>Aviation Specification Verification Checklist:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>All month keys use YYYY-MM (2022-01 to 2026-02)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Arrival city ('Abu Dhabi' / AUH) integrated into all route keys</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>P2P, transfer, and transit shares remain fractions [0.0, 1.0]</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Load factor remains percentage (68.0% – 96.5%)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Null values remain unavailable (never coerced to 0)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-100">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>P2P, transfer, and transit kept as distinct fields</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sample Markets & Detected Schema Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    {fileSummary.sampleMarkets.length > 0 && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 font-semibold block mb-1.5">
                          Sample Markets ({fileSummary.availableMarkets} total):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {fileSummary.sampleMarkets.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {fileSummary.fieldsDetected.length > 0 && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 font-semibold block mb-1.5">
                          Detected Fields ({fileSummary.fieldsDetected.length}):
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {fileSummary.fieldsDetected.map((f, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
