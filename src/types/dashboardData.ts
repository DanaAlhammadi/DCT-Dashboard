/**
 * SILA Dashboard Data Integration Types
 * Strictly models the 9 runtime JSON datasets located in /public/dashboard_data_v1/
 * Preserves null values, month keys, and distinguishes fractions from percentages.
 */

export type LoadingStatus = 'Loaded' | 'Failed';

export interface FileIntegrationSummary {
  filename: string;
  status: LoadingStatus;
  rowCount: number;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  nullCount: number;
  availableMarkets: number;
  sampleMarkets: string[];
  validationWarnings: string[];
  fileSizeBytes?: number;
  errorMessage?: string;
  fieldsDetected: string[];
}

export interface GlobalDataStats {
  earliestMonth: string | null;
  latestMonth: string | null;
  distinctMonths: string[];
  distinctMonthsCount: number;
  nationalityCount: number;
  distinctNationalities: string[];
  departureCountryCount: number;
  distinctDepartureCountries: string[];
  cityCount: number;
  distinctCities: string[];
  departureCityCount: number;
  distinctDepartureCities: string[];
  airlineCount: number;
  distinctAirlines: string[];
  routeCount: number;
  distinctRoutes: string[];
  modelVersion: string | null;
  benchmarkModel: string | null;
  overallWmape: number | null;
  totalFilesLoaded: number;
  totalFilesExpected: number;
  auditTimestamp: string;
}

// 1. metadata.json
export interface MetadataDoc {
  data_version: string;
  dashboard_schema_version: string;
  package_version: string;
  generated_at: string;
  hotel_date_min: string;
  hotel_date_max: string;
  flight_date_min: string;
  flight_date_max: string;
  date_range_basis: string;
  model_status: string;
  current_target: string;
  model_version: string;
  conversion_version: string;
  converted_target: string;
  forecast_origin: string;
  reference_year: number;
  notes: string[];
}

// 2. knowledge_base.json
export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: 'hotel' | 'aviation' | 'data_quality' | 'eda' | 'model' | 'evaluation' | string;
  explanation: string;
  limitations: string;
  source_document: string;
  source_page: number | null;
  keywords: string[];
}

// 3. model_metrics.json
export interface ModelMetricsDoc {
  model_version: string;
  target: string;
  model_status: string;
  training_period: {
    start: string;
    end: string;
  };
  validation_period: {
    start: string;
    end: string;
    role?: string;
  };
  test_period: {
    start: string;
    end: string;
  };
  forecast_origin: string;
  reference_year: number;
  overall_wmape: number; // Percentage value (e.g. 25.52)
  wmape_unit: string;
  primary_prediction_type: string;
  wmape_by_nationality: Array<{
    nationality: string;
    rows: number;
    actual_total: number;
    predicted_total: number;
    wmape_percent: number;
    mae: number;
    bias_percent: number;
  }>;
  wmape_by_season: Array<{
    season: string;
    prediction_type: string;
    rows: number;
    actual_total: number;
    predicted_total: number;
    wmape_percent: number;
    mae: number;
    bias_percent: number;
  }>;
  feature_list?: string[];
  input_columns?: string[];
  arrival_comparisons: Record<
    string,
    {
      wmape_percent: number;
      mae: number;
      bias_percent: number;
      actual_total: number;
      predicted_total: number;
      rows: number;
    }
  >;
  guest_day_comparisons: Record<
    string,
    {
      wmape_percent: number;
      mae: number;
      bias_percent: number;
      actual_total: number;
      predicted_total: number;
      rows: number;
    }
  >;
  guest_day_scoring_period?: {
    start: string;
    end: string;
  };
  training_summary?: {
    training_rows: number;
    nationalities: number;
    encoded_features: number;
    ridge_alpha: number;
    solver_iterations: number;
    iteration_limit: number;
    raw_negative_training_predictions: number;
    observed_passenger_responses: number;
    nonpositive_observed_responses: number;
    local_conversion_factors: number;
    pooled_conversion_factors: number;
  };
  known_limitations: string[];
}

// 4. hotel_market_monthly.json
export interface HotelMarketMonthlyRecord {
  month: string; // YYYY-MM format
  nationality: string;
  recorded_days: number;
  expected_days: number;
  missing_row_days: number;
  new_arrivals_observed: number | null;
  observed_days: number;
  new_arrivals_missing_recorded_days: number;
  coverage_percent: number; // 0 to 100 percentage
  complete_month: boolean;
  new_arrivals: number | null; // Hotel check-in target (null for incomplete months)
  guests_observed: number | null;
  guests_observed_days: number;
  guests_missing_recorded_days: number;
  guests_coverage_percent: number;
  guests_complete: boolean;
  guests: number | null; // Recorded guest-day proxy
  same_day_guests_observed: number | null;
  same_day_guests_observed_days: number;
  same_day_guests_missing_recorded_days: number;
  same_day_guests_coverage_percent: number;
  same_day_guests_complete: boolean;
  same_day_guests: number | null;
  source_partitions: string;
  guests_withheld_days: number;
  year: number;
  month_number: number;
  quality_flags: string[];
  season: string;
  new_arrivals_share: number | null; // Fraction (0.0 to 1.0)
  new_arrivals_share_status: string;
  guests_metric: string;
  aviation_mapping_status: string;
  new_arrivals_status: string;
  guests_status: string;
  same_day_guests_status: string;
}

// 5. market_mapping.json
export interface MarketMappingRecord {
  hotel_nationality: string;
  departure_country: string;
  raw_correlation: number | null;
  adjusted_correlation: number | null;
  paired_months: number;
  sufficient_support: boolean;
  matching_country: boolean;
  selected_alternative: boolean;
  mapping_confidence: string;
  residual_degrees_of_freedom: number | null;
  analysis_start: string;
  analysis_end: string;
  adjustment: string;
  used_in_model: boolean;
  alternative_comparison_months: number | null;
  alternative_common_month_same_country_correlation: number | null;
  alternative_common_month_correlation: number | null;
  notes: string[];
}

// 6. market_seasonality.json
export interface MarketSeasonalityRecord {
  month: string; // YYYY-MM
  nationality: string;
  year: number;
  month_number: number;
  season: string;
  metric: 'guests' | 'new_arrivals' | string;
  seasonality_index: number | null; // Normalized around 100
  complete_month: boolean;
  coverage_percent: number; // 0 to 100 percentage
  observed_days: number;
  expected_days: number;
  complete_year: boolean;
  complete_months_in_year: number;
  expected_months_in_year: number;
  year_observed_days: number;
  year_expected_days: number;
  year_coverage_percent: number;
  months_present_in_dataset_year: number;
  monthly_daily_mean: number | null;
  annual_daily_mean: number | null;
  normalization: string;
  support_status: string;
  quality_flags: string[];
}

// 7. model_predictions.json
export interface ModelPredictionRecord {
  month: string; // YYYY-MM
  nationality: string;
  target: string;
  actual_value: number | null;
  baseline_prediction: number | null;
  seasonal_benchmark_prediction: number | null;
  observed_p2p_prediction: number | null;
  lower_bound: number | null; // Null because intervals were not calibrated
  upper_bound: number | null; // Null because intervals were not calibrated
  residual: number | null;
  support_status: string;
  model_version: string;
  split_name: string;
  eligible_for_arrival_score: boolean;
  complete_month: boolean;
  actual_recorded_guest_days: number | null;
  baseline_recorded_guest_days: number | null;
  seasonal_benchmark_recorded_guest_days: number | null;
  observed_p2p_recorded_guest_days: number | null;
  eligible_for_guest_day_score: boolean;
  conversion_factor: number | null;
  conversion_factor_source: string;
  baseline_clipped: boolean;
  raw_baseline_prediction: number | null;
  forecast_months_ahead: number;
  reference_month: string | null;
  seasonal_benchmark_source_month: string | null;
  seasonal_benchmark_method: string;
  scenario_effect_supported: boolean;
  warnings: string[];
}

// 8. flight_market_monthly.json
export interface FlightMarketMonthlyRecord {
  month: string; // YYYY-MM
  route_key: string; // contains arrival city/code e.g. "DEL-AUH"
  departure_city: string;
  departure_country: string;
  arrival_city: string;
  arrival_airport: string;
  airline: string;
  total_seats: number | null;
  total_pax: number | null;
  p2p: number | null;
  transfer: number | null;
  transit: number | null;
  load_factor: number | null; // 0 to 100 percentage
  p2p_share: number | null; // 0.0 to 1.0 fraction
  transfer_share: number | null; // 0.0 to 1.0 fraction
  transit_share: number | null; // 0.0 to 1.0 fraction
  quality_flags: string[];
}

// 9. data_quality.json
export interface DataQualityRecordItem {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  market: string;
  month: string;
  dataset: string;
  field: string;
  affected_value: number | string | null;
  description: string;
  governance_action: string;
}

export interface DataQualityDoc {
  description?: string;
  generated_at?: string;
  total_records?: number;
  records: DataQualityRecordItem[];
}

// Complete Loaded Datasets Container
export interface DashboardDataStore {
  metadata: MetadataDoc | null;
  knowledgeBase: KnowledgeBaseItem[] | null;
  modelMetrics: ModelMetricsDoc | null;
  hotelMarketMonthly: HotelMarketMonthlyRecord[] | null;
  marketMapping: MarketMappingRecord[] | null;
  marketSeasonality: MarketSeasonalityRecord[] | null;
  modelPredictions: ModelPredictionRecord[] | null;
  flightMarketMonthly: FlightMarketMonthlyRecord[] | null;
  dataQuality: DataQualityDoc | null;
  fileSummaries: Record<string, FileIntegrationSummary>;
  globalStats: GlobalDataStats;
  isAudited: boolean;
  hasErrors: boolean;
}

// Formatting utilities matching domain rules
export function formatFractionAsShare(val: number | null | undefined): string {
  if (val === null || val === undefined) return 'Unavailable';
  return `${(val * 100).toFixed(1)}%`;
}

export function formatPercentageValue(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined) return 'Unavailable';
  return `${val.toFixed(decimals)}%`;
}

export function formatNumberWithCommas(val: number | null | undefined, fallback = 'Unavailable'): string {
  if (val === null || val === undefined) return fallback;
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}
