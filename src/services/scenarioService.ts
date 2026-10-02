import {
  ScenarioInput,
  BaselineFlightData,
  RouteInfo,
  ScenarioResult,
  SavedScenario,
  ValidationError,
  SensitivityFactor,
} from '../types/dashboard';

import { runSimulation, calculateSensitivity } from './simulationService';
import { validateScenario } from './validationService';
import { INITIAL_SAVED_SCENARIOS } from '../data/demoData';
import { DataService } from './dataService';

// Official SILA Local Storage Keys with backward-compatible migration
export const SILA_STORAGE_KEYS = {
  SAVED_SCENARIOS: 'sila_saved_scenarios',
  USER_PREFERENCES: 'sila_user_preferences',
  RECENT_MARKETS: 'sila_recent_markets',
  CHAT_HISTORY: 'sila_chat_history',
  LEGACY_SAVED_SCENARIOS: 'aerostay_saved_scenarios_v1',
  LEGACY_WELCOME_SEEN: 'aerostay_welcome_seen_v1',
};

export class ScenarioService {
  /**
   * Run simulation model
   */
  public static simulate(
    input: ScenarioInput,
    baseline?: BaselineFlightData,
    route?: RouteInfo
  ): ScenarioResult {
    const activeRoute = route || DataService.getRouteById(input.routeId);
    const activeBaseline = baseline || DataService.getBaseline(input.routeId);
    
    // Save to recent markets
    if (activeRoute) {
      ScenarioService.recordRecentMarket(activeRoute.id, activeRoute.modelledSourceMarket);
    }

    return runSimulation(input, activeBaseline, activeRoute);
  }

  /**
   * Validate scenario inputs before execution
   */
  public static validate(
    input: ScenarioInput,
    baseline: BaselineFlightData,
    route: RouteInfo
  ) {
    return validateScenario(input, baseline, route);
  }

  /**
   * Calculate sensitivity analysis (Tornado model)
   */
  public static getSensitivity(result: ScenarioResult): SensitivityFactor[] {
    return calculateSensitivity(result);
  }

  /**
   * Load saved scenarios (limit up to 3 for comparison)
   * Migrates from legacy aerostay_saved_scenarios_v1 if present.
   */
  public static getSavedScenarios(): SavedScenario[] {
    try {
      // 1. Check official SILA key
      let stored = localStorage.getItem(SILA_STORAGE_KEYS.SAVED_SCENARIOS);

      // 2. If not found, attempt migration from legacy key
      if (!stored) {
        const legacyStored = localStorage.getItem(SILA_STORAGE_KEYS.LEGACY_SAVED_SCENARIOS);
        if (legacyStored) {
          stored = legacyStored;
          localStorage.setItem(SILA_STORAGE_KEYS.SAVED_SCENARIOS, legacyStored);
        }
      }

      if (stored) {
        const parsed: SavedScenario[] = JSON.parse(stored);
        return parsed.slice(0, 3);
      }
    } catch (e) {
      console.warn('Could not read saved scenarios from localStorage:', e);
    }
    return INITIAL_SAVED_SCENARIOS.slice(0, 3);
  }

  /**
   * Save a scenario (enforcing max 3 saved scenarios as required by Compare Opportunities)
   */
  public static saveScenario(scenario: SavedScenario): SavedScenario[] {
    const existing = ScenarioService.getSavedScenarios();
    // Filter out if duplicate ID exists, then add to front and keep max 3
    const filtered = existing.filter((s) => s.id !== scenario.id);
    const updated = [scenario, ...filtered].slice(0, 3);
    try {
      localStorage.setItem(SILA_STORAGE_KEYS.SAVED_SCENARIOS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not write saved scenario to localStorage:', e);
    }
    return updated;
  }

  /**
   * Delete a saved scenario
   */
  public static deleteScenario(id: string): SavedScenario[] {
    const existing = ScenarioService.getSavedScenarios();
    const updated = existing.filter((s) => s.id !== id);
    try {
      localStorage.setItem(SILA_STORAGE_KEYS.SAVED_SCENARIOS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update saved scenarios in localStorage:', e);
    }
    return updated;
  }

  /**
   * Duplicate a saved scenario
   */
  public static duplicateScenario(scenario: SavedScenario): SavedScenario[] {
    const duplicated: SavedScenario = {
      ...scenario,
      id: 'scen-' + Date.now(),
      name: `${scenario.name} (Copy)`,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    return ScenarioService.saveScenario(duplicated);
  }

  /**
   * Record recent market in sila_recent_markets
   */
  public static recordRecentMarket(routeId: string, marketName: string): void {
    try {
      const stored = localStorage.getItem(SILA_STORAGE_KEYS.RECENT_MARKETS);
      let list: Array<{ routeId: string; marketName: string; timestamp: number }> = stored
        ? JSON.parse(stored)
        : [];
      list = [{ routeId, marketName, timestamp: Date.now() }, ...list.filter((m) => m.routeId !== routeId)].slice(0, 5);
      localStorage.setItem(SILA_STORAGE_KEYS.RECENT_MARKETS, JSON.stringify(list));
    } catch (e) {
      // Safe fallback
    }
  }

  /**
   * Get user preferences
   */
  public static getUserPreferences(): Record<string, any> {
    try {
      const stored = localStorage.getItem(SILA_STORAGE_KEYS.USER_PREFERENCES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  }

  /**
   * Save user preferences
   */
  public static setUserPreference(key: string, value: any): void {
    try {
      const current = ScenarioService.getUserPreferences();
      current[key] = value;
      localStorage.setItem(SILA_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(current));
    } catch (e) {}
  }
}
