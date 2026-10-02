export type NullableNumber = number | null;
export type Month = string; // YYYY-MM, or YYYY-MM-01 on input.
export type RouteStatus = "unchanged" | "added" | "removed";

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

type PeriodInput = { month: Month; start_month?: never; end_month?: never }
  | { month?: never; start_month: Month; end_month: Month };
type NationalityInput = { nationality?: string | null; nationalities?: never }
  | { nationality?: never; nationalities?: string[] };

export type CanonicalScenarioRequest = PeriodInput & NationalityInput & {
  changes?: AviationChange[];
};
export type LegacyScenarioRequest = Omit<AviationChange, "month"> & NationalityInput & {
  month: Month;
  changes?: never;
  start_month?: never;
  end_month?: never;
};
export type ScenarioRequest = CanonicalScenarioRequest | LegacyScenarioRequest;

export interface Outcome {
  target: "monthly_new_arrivals" | "recorded_guest_days_proxy";
  baseline_value: NullableNumber;
  scenario_value: NullableNumber;
  absolute_change: NullableNumber;
  percent_change: NullableNumber; // Percentage, not fraction.
  lower_bound: null;
  upper_bound: null;
}

interface NationalityOutcome extends Outcome {
  nationality: string;
  target: "monthly_new_arrivals";
  raw_baseline_value: NullableNumber;
  raw_scenario_value: NullableNumber;
  guest_day_proxy: Outcome;
  conversion_factor: NullableNumber;
  conversion_factor_source: string | null;
  response_scope: "matching_country_model_output_only";
  warnings: string[];
}

export interface MonthlyOutcome extends NationalityOutcome {
  month: Month;
  support_status: string;
  scenario_effect_supported: boolean;
  baseline_p2p: NullableNumber;
  scenario_p2p: NullableNumber;
}

export interface PeriodOutcome extends NationalityOutcome {
  start_month: Month;
  end_month: Month;
  support_statuses: string[];
  unsupported_effect_months: number;
  expected_months: number;
  observed_months: number;
  complete_period: boolean;
}

export interface ScenarioCoverage {
  expected_months: number;
  requested_nationalities: number;
  expected_rows: number;
  baseline_rows: number;
  scenario_rows: number;
  supported_passenger_nationalities: number;
  unsupported_passenger_nationalities: string[];
  active_departure_countries: string[];
  unrepresented_departure_countries: string[];
  changed_countries_outside_selection: string[];
  aggregate_complete: boolean;
  guest_day_aggregate_complete: boolean;
}

export interface AviationComparison {
  month: Month;
  departure_country: string;
  reference_month: Month;
  baseline_seats: NullableNumber;
  scenario_seats: NullableNumber;
  seat_change: NullableNumber;
  baseline_p2p: NullableNumber;
  scenario_p2p: NullableNumber;
  p2p_change: NullableNumber;
}

export interface ScenarioResponse extends Outcome {
  schema_version: "dashboard_scenario_v1";
  target: "monthly_new_arrivals";
  baseline_kind: "regression_reference_prediction_not_seasonal_benchmark";
  guest_day_proxy: Outcome;
  support_status: "reference_only" | "supported_with_limitations" | "incomplete_scenario";
  changed_fields: string[];
  assumptions: string[];
  warnings: string[];
  model_version: string;
  conversion_version: string;
  model_status: "evaluated_with_limitations";
  forecast_origin: string;
  reference_year: number;
  start_month: Month;
  end_month: Month;
  nationalities: string[];
  response_scope: "sum_of_selected_nationality_model_outputs_not_verified_all_market_impact";
  coverage: ScenarioCoverage;
  normalized_input: CanonicalScenarioRequest;
  monthly: MonthlyOutcome[];
  by_nationality: PeriodOutcome[];
  aviation_changes: AviationComparison[];
}

export interface ApiError {
  error: {
    code: "invalid_request" | "invalid_json" | "invalid_body_size" | "origin_not_allowed"
      | "unsupported_media_type" | "not_found" | "model_unavailable" | "internal_error";
    message: string;
  };
}

export interface HealthResponse {
  status: "ok";
  model_status: "evaluated_with_limitations";
  model_version: string;
  conversion_version: string;
  forecast_origin: string;
  reference_year: number;
}
