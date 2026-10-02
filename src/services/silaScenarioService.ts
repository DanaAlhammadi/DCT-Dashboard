/**
 * SILA Python Scenario Backend Integration Service
 * Connects frontend to the authoritative Python scenario backend via proxy route.
 * Exposes checkBackendHealth() and runScenario().
 * Preserves null values, never converts null to zero.
 */

import {
  SilaScenarioRequest,
  SilaScenarioResponse,
  BackendHealthStatus,
  SilaErrorState,
  SilaErrorKind
} from '../types/silaScenario';

// The backend proxy base URL (defaults to /api/sila)
const PROXY_BASE = '/api/sila';

/**
 * Official India example request matching example_request.json contract:
 * November 2025: +1,000 India-departure seats
 * December 2025: +1,000 India-departure seats
 * Expected result: approximately +144 additional check-ins across the two months.
 */
export const OFFICIAL_INDIA_EXAMPLE_REQUEST: SilaScenarioRequest = {
  scenario_name: 'Official India Example (+1,000 Seats Nov-Dec 2025)',
  departure_country: 'India',
  market: 'India',
  start_month: '2025-11',
  end_month: '2025-12',
  seat_capacity_change: 1000,
  monthly_seat_changes: {
    '2025-11': 1000,
    '2025-12': 1000
  },
  interventions: [
    { month: '2025-11', seat_change: 1000 },
    { month: '2025-12', seat_change: 1000 }
  ]
};

/**
 * Classifies errors into clear, understandable user-facing states
 * without exposing raw Python traces or stack traces.
 */
export function classifyError(error: unknown, status?: number): SilaErrorState {
  const errMsg = error instanceof Error ? error.message : String(error || '');
  const lowerMsg = errMsg.toLowerCase();

  if (status === 504 || lowerMsg.includes('timeout') || lowerMsg.includes('abort')) {
    return {
      kind: 'timeout',
      title: 'Scenario Execution Timeout',
      message: 'The model server took longer than expected to evaluate this scenario.',
      actionHint: 'Please check your connection and try running the scenario again.'
    };
  }

  if (status === 400 || lowerMsg.includes('invalid') || lowerMsg.includes('validation')) {
    return {
      kind: 'invalid_scenario',
      title: 'Invalid Scenario Input',
      message: 'The scenario parameters could not be processed by the linear_v009 model.',
      actionHint: 'Ensure months are in YYYY-MM format and seat changes are numeric values.'
    };
  }

  if (lowerMsg.includes('model not loaded') || lowerMsg.includes('model_not_loaded')) {
    return {
      kind: 'model_not_loaded',
      title: 'Model Not Loaded',
      message: 'The backend service is online, but model linear_v009 is currently not initialized.',
      actionHint: 'Verify model weights and feature scalers in the local Python backend.'
    };
  }

  if (
    status === 503 ||
    status === 502 ||
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('unavailable') ||
    lowerMsg.includes('econnrefused')
  ) {
    return {
      kind: 'backend_unavailable',
      title: 'Scenario Backend Unavailable',
      message: 'Cannot reach the local Python scenario backend (http://127.0.0.1:8000).',
      actionHint: 'Ensure your Python service is running and accessible via SILA_BACKEND_URL.'
    };
  }

  if (lowerMsg.includes('unavailable') || lowerMsg.includes('null result')) {
    return {
      kind: 'unavailable_result',
      title: 'Unavailable Result',
      message: 'The backend did not produce a valid projection for this nationality and period.',
      actionHint: 'Check historical support status for this departure country.'
    };
  }

  return {
    kind: 'request_failed',
    title: 'Scenario Request Failed',
    message: errMsg || 'An error occurred while evaluating the scenario against the model.',
    actionHint: 'Review backend service logs or retry the request.'
  };
}

export class SilaScenarioService {
  /**
   * Connects to GET /health via proxy to determine backend and model availability.
   * Returns clean development status indicators without exposing raw stack traces.
   */
  static async checkBackendHealth(): Promise<BackendHealthStatus> {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${PROXY_BASE}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          connected: false,
          modelLoaded: false,
          statusText: 'Unavailable',
          modelText: 'Unavailable',
          lastChecked: timestamp,
          errorMessage: `Health check returned HTTP ${res.status}`
        };
      }

      const data = await res.json().catch(() => ({}));
      const isConnected = data.connected === true || data.status === 'healthy' || data.status === 'ok';
      const isModelLoaded = 
        data.modelLoaded === true || 
        data.model_status === 'loaded' || 
        data.model_loaded === true || 
        (isConnected && data.model_status !== 'unloaded');

      return {
        connected: isConnected,
        modelLoaded: isModelLoaded,
        statusText: isConnected ? 'Connected' : 'Unavailable',
        modelText: isModelLoaded ? 'Loaded' : 'Unavailable',
        lastChecked: timestamp
      };
    } catch (err: unknown) {
      return {
        connected: false,
        modelLoaded: false,
        statusText: 'Unavailable',
        modelText: 'Unavailable',
        lastChecked: timestamp,
        errorMessage: err instanceof Error ? err.message : 'Connection failed'
      };
    }
  }

  /**
   * Executes a scenario against the Python scenario backend.
   * Sends request to POST /api/sila/run-scenario.
   * Guarantees:
   * - Never creates mock responses when backend is unavailable.
   * - Preserves null values (never coerces null to zero).
   * - Returns structured typed response.
   */
  static async runScenario(request: SilaScenarioRequest): Promise<SilaScenarioResponse> {
    let res: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      res = await fetch(`${PROXY_BASE}/run-scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (err: unknown) {
      const classified = classifyError(err);
      throw new Error(classified.message);
    }

    if (!res.ok) {
      let errorData: any = null;
      try {
        errorData = await res.json();
      } catch {
        // Ignored
      }
      const errDetail = errorData?.error || errorData?.message || `HTTP ${res.status}`;
      const classified = classifyError(errDetail, res.status);
      throw new Error(classified.message);
    }

    const json = await res.json();
    return SilaScenarioService.normalizeResponse(json, request);
  }

  /**
   * Normalizes backend response while preserving exact numeric/null integrity:
   * - Preserves null values (never replaces null with zero).
   * - Maps aliases (e.g. baseline_checkins vs baseline) if needed.
   * - Ensures monthly array and by_nationality array remain strictly distinct.
   */
  private static normalizeResponse(raw: any, req: SilaScenarioRequest): SilaScenarioResponse {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Backend returned an empty or invalid payload structure.');
    }

    // Extract primary check-in values preserving nulls
    const baselineCheckins = raw.baseline_checkins ?? raw.baseline ?? raw.baseline_arrivals ?? null;
    const scenarioCheckins = raw.scenario_checkins ?? raw.scenario ?? raw.scenario_arrivals ?? null;
    const additionalCheckins = raw.additional_checkins ?? raw.change ?? raw.diff ?? null;

    // Monthly breakdown array
    const monthlyRaw = Array.isArray(raw.monthly) ? raw.monthly : [];
    const monthly = monthlyRaw.map((m: any) => ({
      month: String(m.month || ''),
      baseline: m.baseline !== undefined ? m.baseline : (m.baseline_checkins ?? null),
      scenario: m.scenario !== undefined ? m.scenario : (m.scenario_checkins ?? null),
      change: m.change !== undefined ? m.change : (m.additional_checkins ?? m.diff ?? null),
      lower_bound: m.lower_bound !== undefined ? m.lower_bound : null,
      upper_bound: m.upper_bound !== undefined ? m.upper_bound : null,
      baseline_recorded_guest_days: m.baseline_recorded_guest_days ?? null,
      scenario_recorded_guest_days: m.scenario_recorded_guest_days ?? null,
      change_recorded_guest_days: m.change_recorded_guest_days ?? null,
      support_status: m.support_status ?? raw.support_status ?? null,
      warnings: Array.isArray(m.warnings) ? m.warnings : []
    }));

    // By nationality array
    const byNationalityRaw = Array.isArray(raw.by_nationality) ? raw.by_nationality : [];
    const byNationality = byNationalityRaw.map((n: any) => ({
      nationality: String(n.nationality || n.market || 'Unknown'),
      baseline: n.baseline !== undefined ? n.baseline : (n.baseline_checkins ?? null),
      scenario: n.scenario !== undefined ? n.scenario : (n.scenario_checkins ?? null),
      change: n.change !== undefined ? n.change : (n.additional_checkins ?? n.diff ?? null),
      conversion_factor: n.conversion_factor !== undefined ? n.conversion_factor : null,
      baseline_recorded_guest_days: n.baseline_recorded_guest_days ?? null,
      scenario_recorded_guest_days: n.scenario_recorded_guest_days ?? null,
      change_recorded_guest_days: n.change_recorded_guest_days ?? null,
      support_status: n.support_status ?? raw.support_status ?? null,
      warnings: Array.isArray(n.warnings) ? n.warnings : []
    }));

    // Guest days proxy (remains separate from check-ins)
    let recordedGuestDaysProxy: any = null;
    if (raw.recorded_guest_days_proxy !== undefined && raw.recorded_guest_days_proxy !== null) {
      if (typeof raw.recorded_guest_days_proxy === 'object') {
        recordedGuestDaysProxy = {
          baseline: raw.recorded_guest_days_proxy.baseline ?? null,
          scenario: raw.recorded_guest_days_proxy.scenario ?? null,
          change: raw.recorded_guest_days_proxy.change ?? raw.recorded_guest_days_proxy.diff ?? null
        };
      } else {
        recordedGuestDaysProxy = Number(raw.recorded_guest_days_proxy);
      }
    }

    return {
      scenario_name: raw.scenario_name || req.scenario_name || 'Evaluated Scenario',
      baseline_checkins: baselineCheckins,
      scenario_checkins: scenarioCheckins,
      additional_checkins: additionalCheckins,
      support_status: raw.support_status || 'evaluated_with_limitations',
      period: raw.period || (req.start_month && req.end_month ? `${req.start_month} to ${req.end_month}` : 'November–December 2025'),
      start_month: raw.start_month || req.start_month || '2025-11',
      end_month: raw.end_month || req.end_month || '2025-12',
      nationality_scope: raw.nationality_scope || req.market || req.departure_country || 'INDIA',
      model_version: raw.model_version || 'linear_v009',
      conversion_version: raw.conversion_version || 'conversion_v002',
      forecast_origin: raw.forecast_origin || '2024-12-31',
      reference_year: raw.reference_year ?? 2024,
      recorded_guest_days_proxy: recordedGuestDaysProxy,
      monthly,
      by_nationality: byNationality,
      warnings: Array.isArray(raw.warnings) ? raw.warnings : [],
      notes: Array.isArray(raw.notes) ? raw.notes : []
    };
  }
}
