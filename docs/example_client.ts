import type { ApiError, ScenarioRequest, ScenarioResponse } from "./types";

export class ScenarioApiError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: number) {
    super(message);
    this.name = "ScenarioApiError";
  }
}

export async function runScenario(
  request: ScenarioRequest,
  baseUrl = "http://127.0.0.1:8000",
  signal?: AbortSignal,
): Promise<ScenarioResponse> {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const detail = body as Partial<ApiError>;
    throw new ScenarioApiError(
      detail.error?.code ?? "http_error",
      detail.error?.message ?? `Scenario request failed (${response.status}).`,
      response.status,
    );
  }
  return body as ScenarioResponse;
}

export const exampleRequest: ScenarioRequest = {
  start_month: "2025-11",
  end_month: "2025-12",
  nationality: "INDIA",
  changes: [
    { month: "2025-11", departure_country: "INDIA", seat_change: 1000 },
    { month: "2025-12", departure_country: "INDIA", seat_change: 1000 },
  ],
};

// Display null as unavailable. Show support_status, warnings and assumptions beside results.
// The baseline is a regression reference prediction, not the seasonal benchmark.
