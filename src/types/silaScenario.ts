/**
 * SILA Python Scenario Backend Integration Types
 * Strictly enforces integration contract for Python scenario backend.
 * Preserves null values, distinguishes guest days proxy from check-ins.
 */

export interface BackendHealthResponse {
  status?: string;
  model_status?: string;
  model_loaded?: boolean;
  model_version?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface BackendHealthStatus {
  connected: boolean;
  modelLoaded: boolean;
  statusText: 'Connected' | 'Unavailable';
  modelText: 'Loaded' | 'Not Loaded' | 'Unavailable';
  lastChecked: string;
  errorMessage?: string;
}

export type NullableNumber = number | null;
export type Month = string; // YYYY-MM
export type RouteStatus = 'unchanged' | 'added' | 'removed';

export interface AviationChange {
  month: Month;
  departure_country: string;
  departure_city?: string | null;
  arrival_city?: string | null;
  airline?: string | null;
  route_status?: RouteStatus | null;
  seat_change?: NullableNumber;
  weekly_frequency_change?: NullableNumber;
  seats_per_flight?: NullableNumber;
  load_factor_override?: NullableNumber; // Percentage, 0–100.
  p2p_share_override?: NullableNumber; // Fraction, 0–1; added routes only.
}

export interface CanonicalScenarioRequest {
  start_month: Month;
  end_month: Month;
  nationality?: string | null;
  nationalities?: string[];
  changes?: AviationChange[];
}

export interface SilaMonthlyIntervention {
  month: string; // YYYY-MM
  seat_change?: number;
  seats?: number;
  [key: string]: any;
}

export interface SilaScenarioRequest extends Partial<CanonicalScenarioRequest> {
  scenario_name?: string;
  departure_country?: string;
  market?: string;
  start_month?: string; // YYYY-MM
  end_month?: string;   // YYYY-MM
  seat_capacity_change?: number;
  monthly_seat_changes?: Record<string, number>;
  interventions?: SilaMonthlyIntervention[];
  changes?: AviationChange[];
  [key: string]: any;
}

export interface SilaMonthlyPrediction {
  month: string; // YYYY-MM
  baseline: number | null;
  scenario: number | null;
  change: number | null;
  lower_bound?: number | null;
  upper_bound?: number | null;
  baseline_recorded_guest_days?: number | null;
  scenario_recorded_guest_days?: number | null;
  change_recorded_guest_days?: number | null;
  support_status?: string | null;
  warnings?: string[];
  [key: string]: any;
}

export interface SilaNationalitySummary {
  nationality: string;
  baseline: number | null;
  scenario: number | null;
  change: number | null;
  conversion_factor?: number | null;
  baseline_recorded_guest_days?: number | null;
  scenario_recorded_guest_days?: number | null;
  change_recorded_guest_days?: number | null;
  support_status?: string | null;
  warnings?: string[];
  [key: string]: any;
}

export interface SilaRecordedGuestDaysProxy {
  baseline: number | null;
  scenario: number | null;
  change: number | null;
  [key: string]: any;
}

export interface SilaScenarioResponse {
  scenario_name?: string;
  baseline_checkins: number | null;
  scenario_checkins: number | null;
  additional_checkins: number | null;
  support_status: string;
  period?: string;
  start_month?: string;
  end_month?: string;
  nationality_scope: string | string[];
  model_version: string;
  conversion_version: string;
  forecast_origin?: string;
  reference_year?: number | string;
  recorded_guest_days_proxy: SilaRecordedGuestDaysProxy | number | null;
  monthly: SilaMonthlyPrediction[];
  by_nationality: SilaNationalitySummary[];
  warnings: string[];
  notes?: string[];
  error?: string;
  [key: string]: any;
}

export type SilaErrorKind = 
  | 'backend_unavailable' 
  | 'model_not_loaded' 
  | 'request_failed' 
  | 'invalid_scenario' 
  | 'unavailable_result' 
  | 'timeout';

export interface SilaErrorState {
  kind: SilaErrorKind;
  title: string;
  message: string;
  actionHint: string;
}
