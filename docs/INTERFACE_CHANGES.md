# Changes from the proposed interface

The requested files and Python scenario entry point are retained. These changes make the meanings explicit:

- `model_status` adds `evaluated_with_limitations`. The frozen regression was evaluated, but the seasonal benchmark had lower reserved-period error. `validated` would be ambiguous.
- Prediction exports distinguish the regression prediction/baseline from `seasonal_benchmark_prediction`. The scenario's `baseline_value` is the unchanged regression reference, never a silently substituted benchmark.
- Scenario inputs support an inclusive `start_month`/`end_month` and explicit `changes[]`. The original flat single-month shape is accepted. `nationality` selects one hotel market; `nationalities` selects several. Do not provide both.
- Frequency input requires `seats_per_flight`. Monthly seat changes and frequency changes are alternatives. The legacy flat zero-seat placeholder is handled explicitly with a warning; canonical requests must omit/null the unused field.
- Added routes require `arrival_city`, complete route keys, positive capacity, `load_factor_override` in percent and `p2p_share_override` as a fraction. These are scenario assumptions, not learned route/nationality flows.
- Output adds `monthly[]`, `by_nationality[]`, `aviation_changes[]`, `coverage`, `normalized_input` and provenance. Top-level values sum the selected outputs; incomplete/unsupported scenario aggregates remain null.
- `guest_day_proxy` is separate from the New Arrivals target and labelled `recorded_guest_days_proxy`. It is not presented as verified occupied guest nights.
- Bounds remain null. No confidence interval has been calibrated. The optional lower/higher assumption cases in the underlying engine are stress cases, not interval estimates.
- Twelve hotel nationalities lack an observed matching-country passenger response. They can have calendar/trend forecasts, but an unchanged prediction does not demonstrate that aviation cannot affect them.
- `run_scenario(input)` returns strict JSON-compatible data. The original frozen engine remains available inside `model_runtime/src` for pandas-table inspection. Use the adapter for the dashboard.
- A local development HTTP server provides `GET /health` and `POST /scenario`; a typed fetch client is included. React does not execute the Python model. Public/HTTPS backend deployment remains an integration decision.

Use `model_runtime/README.md` for field definitions and `types.ts` for the live API types. The static exports' own README/schema describe their field additions and coverage rules.
