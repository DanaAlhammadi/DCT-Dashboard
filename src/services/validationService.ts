import { ScenarioInput, BaselineFlightData, ValidationError, RouteInfo } from '../types';

export interface ValidationSummary {
  isValid: boolean;
  hasBlockingErrors: boolean;
  blockingErrors: ValidationError[];
  warnings: ValidationError[];
}

export function validateScenario(
  input: ScenarioInput,
  baseline: BaselineFlightData | null,
  route: RouteInfo | null
): ValidationSummary {
  const blockingErrors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Required Baseline & Route Check
  if (!route) {
    blockingErrors.push({
      field: 'routeId',
      message: 'A flight route must be selected to establish the planning baseline.',
      isBlocking: true,
    });
  }

  if (!baseline) {
    blockingErrors.push({
      field: 'baseline',
      message: 'No baseline data found for the selected route. Select a valid route.',
      isBlocking: true,
    });
    return {
      isValid: false,
      hasBlockingErrors: true,
      blockingErrors,
      warnings,
    };
  }

  // 2. Date validations
  if (!input.startMonth || !input.endMonth) {
    blockingErrors.push({
      field: 'dateRange',
      message: 'Both start month and end month are required to calculate seasonal hotel demand.',
      isBlocking: true,
    });
  } else {
    const start = new Date(input.startMonth + '-01').getTime();
    const end = new Date(input.endMonth + '-01').getTime();
    if (isNaN(start) || isNaN(end)) {
      blockingErrors.push({
        field: 'dateRange',
        message: 'Invalid date format. Please select valid months.',
        isBlocking: true,
      });
    } else if (start > end) {
      blockingErrors.push({
        field: 'endMonth',
        message: 'The end month cannot be earlier than the start month.',
        isBlocking: true,
      });
    }
  }

  // 3. Route Status & Capacity Consistency
  if (input.routeStatus === 'DISCONTINUED') {
    if (input.seatCapacityChange > 0) {
      blockingErrors.push({
        field: 'seatCapacityChange',
        message: 'A discontinued route cannot have a positive seat capacity increase.',
        isBlocking: true,
      });
    }
    if (input.assumedWeeklyFrequencyChange !== null && input.assumedWeeklyFrequencyChange > 0) {
      blockingErrors.push({
        field: 'assumedWeeklyFrequencyChange',
        message: 'A discontinued route cannot have an increase in weekly flight frequency.',
        isBlocking: true,
      });
    }
  }

  if (input.routeStatus === 'NEW_ROUTE') {
    if (input.seatCapacityChange < 0) {
      blockingErrors.push({
        field: 'seatCapacityChange',
        message: 'A new route proposal cannot start with a negative seat capacity.',
        isBlocking: true,
      });
    }
    if (input.seatCapacityChange === 0 && (!input.assumedWeeklyFrequencyChange || input.assumedWeeklyFrequencyChange <= 0)) {
      blockingErrors.push({
        field: 'seatCapacityChange',
        message: 'A new route requires entering scheduled seat capacity or weekly flight frequency.',
        isBlocking: true,
      });
    }
  }

  // 4. Resulting capacity bounds
  const resultingSeats = baseline.totalSeats + input.seatCapacityChange;
  if (resultingSeats < 0) {
    blockingErrors.push({
      field: 'seatCapacityChange',
      message: `Resulting monthly seat capacity (${resultingSeats.toLocaleString()}) cannot be negative. Maximum reduction possible is -${baseline.totalSeats.toLocaleString()} seats.`,
      isBlocking: true,
    });
  }

  // 5. Resulting frequency bounds
  if (input.assumedWeeklyFrequencyChange !== null) {
    const baseFreq = baseline.averageWeeklyFrequency ?? 0;
    if (baseFreq + input.assumedWeeklyFrequencyChange < 0) {
      blockingErrors.push({
        field: 'assumedWeeklyFrequencyChange',
        message: 'Resulting weekly flight frequency cannot be less than zero.',
        isBlocking: true,
      });
    }
  }

  // 6. Warnings
  // Load Factor Warning
  if (input.useCustomLoadFactor && input.customLoadFactor !== null) {
    if (input.customLoadFactor < 0) {
      blockingErrors.push({
        field: 'customLoadFactor',
        message: 'Load factor cannot be negative.',
        isBlocking: true,
      });
    } else if (input.customLoadFactor > 1.0) {
      warnings.push({
        field: 'customLoadFactor',
        message: `Assumed load factor of ${(input.customLoadFactor * 100).toFixed(0)}% exceeds 100%. While historical flights occasionally exceed 100% due to lap infants or staff re-routing, confirm if intentional.`,
        isBlocking: false,
      });
    }
  }

  // New Route without direct history
  if (input.routeStatus === 'NEW_ROUTE' || (route && !route.isExisting)) {
    warnings.push({
      field: 'supportLevel',
      message: 'This route lacks direct historical Abu Dhabi flight operations. Results will be derived using comparable analogue markets and marked as exploratory.',
      isBlocking: false,
    });
  }

  // Weekly frequency entered as an assumption
  if (input.assumedWeeklyFrequencyChange !== null) {
    warnings.push({
      field: 'assumedWeeklyFrequencyChange',
      message: 'Weekly frequency is unavailable for many historical records. This value will be treated as a planner assumption.',
      isBlocking: false,
    });
  }

  // No change warning
  if (
    input.seatCapacityChange === 0 &&
    !input.useCustomLoadFactor &&
    input.routeStatus === 'EXISTING' &&
    (input.assumedWeeklyFrequencyChange === null || input.assumedWeeklyFrequencyChange === 0)
  ) {
    warnings.push({
      field: 'general',
      message: 'No scenario changes have been defined yet. Increase or decrease seat capacity, frequency, or load factor to simulate impact.',
      isBlocking: false,
    });
  }

  // Extreme seat capacity change warning
  if (baseline.totalSeats > 0 && input.seatCapacityChange > baseline.totalSeats * 1.5) {
    warnings.push({
      field: 'seatCapacityChange',
      message: 'Capacity change is more than 150% above historical baseline. The estimate carries wider uncertainty bands.',
      isBlocking: false,
    });
  }

  return {
    isValid: blockingErrors.length === 0,
    hasBlockingErrors: blockingErrors.length > 0,
    blockingErrors,
    warnings,
  };
}
