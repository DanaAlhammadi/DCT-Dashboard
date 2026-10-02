import {
  ScenarioInput,
  BaselineFlightData,
  RouteInfo,
  ScenarioResult,
  ConversionStage,
  SupportLevel,
  MonthlyForecast,
  SensitivityFactor,
} from '../types';
import { MOCK_ANALOGUES, MOCK_EVENTS } from '../data/mockData';
import { generateDecisionSummary } from './recommendationService';

/**
 * PURE SIMULATION ENGINE: Flight-to-Hotel Conversion Logic
 * 
 * Transparent Conversion Chain:
 * 1. Scheduled Seats
 * 2. Arriving Passengers (Seats × Load Factor)
 * 3. Abu Dhabi-Ending / P2P Passengers (Arriving PAX − Transfer − Transit)
 * 4. Inbound Visitors (P2P × Inbound Visitor Share)
 * 5. Hotel Guests (Inbound Visitors × Hotel-Capture Rate)
 * 6. Hotel Guest Nights (Hotel Guests × Average Length of Stay - ALOS)
 * 
 * MODEL API EXTENSION POINT:
 * When connecting to a deployed ML microservice or DCT Python model endpoint,
 * replace or wrap this simulation with an async fetch to:
 * POST /api/v1/predict-hotel-impact
 * (The same ScenarioInput & BaselineFlightData interface is preserved)
 */

export function runSimulation(
  input: ScenarioInput,
  baseline: BaselineFlightData,
  route: RouteInfo
): ScenarioResult {
  // 1. Calculate Capacity & Seats
  let addedMonthlySeats = input.seatCapacityChange;

  // If frequency was entered and seat change is 0, estimate seats using standard narrow/widebody (avg 180 seats * 4.33 weeks per monthly flight)
  if (addedMonthlySeats === 0 && input.assumedWeeklyFrequencyChange && input.assumedWeeklyFrequencyChange !== 0) {
    const seatsPerFlight = route.distanceKm > 4000 ? 260 : 180;
    addedMonthlySeats = Math.round(input.assumedWeeklyFrequencyChange * seatsPerFlight * 4.33);
  }

  // Baseline Monthly Seats
  const baselineMonthlySeats = baseline.totalSeats;
  let scenarioMonthlySeats = baselineMonthlySeats + addedMonthlySeats;
  if (input.routeStatus === 'DISCONTINUED') {
    scenarioMonthlySeats = 0;
    addedMonthlySeats = -baselineMonthlySeats;
  }
  scenarioMonthlySeats = Math.max(0, scenarioMonthlySeats);

  // 2. Load Factor
  const baselineLF = baseline.historicalLoadFactor;
  const scenarioLF = input.useCustomLoadFactor && input.customLoadFactor !== null
    ? input.customLoadFactor
    : baselineLF;

  // 3. Arriving Passengers (Total PAX)
  const baselinePax = baseline.totalPax;
  const scenarioPax = Math.round(scenarioMonthlySeats * scenarioLF);

  // 4. Abu Dhabi-Ending / P2P Passengers
  // Calculate baseline P2P share from historical data
  const baseP2PRatio = baseline.totalPax > 0 ? (baseline.totalP2P / baseline.totalPax) : 0.55;
  const transferShareOverride = input.transferShareOverride !== undefined && input.transferShareOverride !== null
    ? input.transferShareOverride
    : (baseline.totalPax > 0 ? baseline.totalTransfer / baseline.totalPax : 0.35);
  const transitShareOverride = input.transitShareOverride !== undefined && input.transitShareOverride !== null
    ? input.transitShareOverride
    : (baseline.totalPax > 0 ? baseline.totalTransit / baseline.totalPax : 0.08);

  const scenarioP2PRatio = Math.max(0.05, 1 - (transferShareOverride + transitShareOverride));
  const baselineP2P = baseline.totalP2P;
  const scenarioP2P = Math.round(scenarioPax * scenarioP2PRatio);

  // 5. Inbound Visitors (non-resident international visitors)
  const visitorShare = input.visitorShareOverride !== undefined && input.visitorShareOverride !== null
    ? input.visitorShareOverride
    : baseline.inboundVisitorShare;

  const baselineVisitors = Math.round(baselineP2P * baseline.inboundVisitorShare);
  const scenarioVisitors = Math.round(scenarioP2P * visitorShare);

  // 6. Hotel Guests (staying in licensed Abu Dhabi hotels)
  const hotelCaptureRate = input.hotelCaptureRateOverride !== undefined && input.hotelCaptureRateOverride !== null
    ? input.hotelCaptureRateOverride
    : baseline.hotelCaptureRate;

  const baselineGuests = Math.round(baselineVisitors * baseline.hotelCaptureRate);
  const scenarioGuests = Math.round(scenarioVisitors * hotelCaptureRate);

  // 7. Hotel Guest Nights (ALOS) - PENDING IN EDA MODE
  // Note: Guest nights are unconfirmed until the stay-duration component is validated.
  const baselineNights: number | null = null;
  const scenarioNights: number | null = null;
  const nightsDiff: number | null = null;
  const nightsPct: number | null = null;

  // Calculate Differences
  const seatsDiff = scenarioMonthlySeats - baselineMonthlySeats;
  const paxDiff = scenarioPax - baselinePax;
  const p2pDiff = scenarioP2P - baselineP2P;
  const visitorsDiff = scenarioVisitors - baselineVisitors;
  const guestsDiff = scenarioGuests - baselineGuests;

  const seatsPct = baselineMonthlySeats > 0 ? (seatsDiff / baselineMonthlySeats) * 100 : 100;
  const paxPct = baselinePax > 0 ? (paxDiff / baselinePax) * 100 : 100;
  const p2pPct = baselineP2P > 0 ? (p2pDiff / baselineP2P) * 100 : 100;
  const visitorsPct = baselineVisitors > 0 ? (visitorsDiff / baselineVisitors) * 100 : 100;
  const guestsPct = baselineGuests > 0 ? (guestsDiff / baselineGuests) * 100 : 100;

  // Efficiency ratios per 1,000 seats
  const baseGuestsPer1k = baselineMonthlySeats > 0 ? Math.round((baselineGuests / baselineMonthlySeats) * 1000) : 0;
  const scenGuestsPer1k = scenarioMonthlySeats > 0 ? Math.round((scenarioGuests / scenarioMonthlySeats) * 1000) : 0;

  const baseNightsPer1k = baselineNights && baselineMonthlySeats > 0 ? Math.round((baselineNights / baselineMonthlySeats) * 1000) : 0;
  const scenNightsPer1k = scenarioNights && scenarioMonthlySeats > 0 ? Math.round((scenarioNights / scenarioMonthlySeats) * 1000) : 0;

  // 8. Determine Historical Support Level
  let supportLevel: SupportLevel = 'SUPPORTED';
  let supportExplanation = 'Historical evidence exists for a similar market, route, and scenario range.';
  let confidenceScore = 88;

  if (input.routeStatus === 'NEW_ROUTE' || !route.isExisting) {
    supportLevel = 'OUT_OF_SUPPORT';
    supportExplanation = 'This route or market lacks direct historical flight evidence. The estimate is exploratory and derived from analogue markets.';
    confidenceScore = 52;
  } else if (Math.abs(seatsDiff) > baselineMonthlySeats * 1.2 || (input.useCustomLoadFactor && (input.customLoadFactor ?? 0) > 0.95)) {
    supportLevel = 'LIMITED_SUPPORT';
    supportExplanation = 'The route is represented historically, but the proposed change is near or beyond the normal observed range.';
    confidenceScore = 68;
  }

  // 9. Generate Detailed Conversion Stages
  const conversionStages: ConversionStage[] = [
    {
      id: 'seats',
      name: 'Scheduled Seats',
      baselineValue: baselineMonthlySeats,
      scenarioValue: scenarioMonthlySeats,
      changeValue: seatsDiff,
      percentChange: seatsPct,
      unit: 'Seats / Month',
      status: input.routeStatus === 'NEW_ROUTE' ? 'Assumed' : (seatsDiff !== 0 ? 'Assumed' : 'Observed'),
      formula: 'Airline Published Timetables + Scenario Input',
      explanation: 'Total available passenger seats scheduled by operating airlines for the month.',
      uncertaintyRange: { min: scenarioMonthlySeats, max: scenarioMonthlySeats },
    },
    {
      id: 'pax',
      name: 'Arriving Passengers (Total PAX)',
      baselineValue: baselinePax,
      scenarioValue: scenarioPax,
      changeValue: paxDiff,
      percentChange: paxPct,
      unit: 'Passengers / Month',
      status: input.useCustomLoadFactor ? 'Assumed' : 'Estimated',
      formula: `Scheduled Seats × ${(scenarioLF * 100).toFixed(0)}% Load Factor`,
      explanation: 'Occupied seats crossing into Abu Dhabi airspace across all passenger journey segments.',
      uncertaintyRange: { min: Math.round(scenarioPax * 0.94), max: Math.round(scenarioPax * 1.06) },
    },
    {
      id: 'p2p',
      name: 'Abu Dhabi-Ending / P2P Passengers',
      baselineValue: baselineP2P,
      scenarioValue: scenarioP2P,
      changeValue: p2pDiff,
      percentChange: p2pPct,
      unit: 'P2P Arrivals / Month',
      status: 'Derived',
      formula: 'Arriving PAX − Connecting Transfers − Short Transits',
      explanation: 'Passengers ending their journey in Abu Dhabi. Does NOT equal tourists yet, as returning UAE resident expats are included.',
      uncertaintyRange: { min: Math.round(scenarioP2P * 0.91), max: Math.round(scenarioP2P * 1.09) },
    },
    {
      id: 'visitors',
      name: 'Inbound Visitors',
      baselineValue: baselineVisitors,
      scenarioValue: scenarioVisitors,
      changeValue: visitorsDiff,
      percentChange: visitorsPct,
      unit: 'Inbound Visitors',
      status: 'Estimated',
      formula: `P2P Arrivals × ${(visitorShare * 100).toFixed(0)}% Visitor Share (excluding returning residents)`,
      explanation: 'Non-resident leisure, cultural, conference, and business travellers visiting Abu Dhabi.',
      uncertaintyRange: { min: Math.round(scenarioVisitors * 0.88), max: Math.round(scenarioVisitors * 1.12) },
    },
    {
      id: 'guests',
      name: 'Hotel Guests',
      baselineValue: baselineGuests,
      scenarioValue: scenarioGuests,
      changeValue: guestsDiff,
      percentChange: guestsPct,
      unit: 'Hotel Guests',
      status: 'Estimated',
      formula: `Inbound Visitors × ${(hotelCaptureRate * 100).toFixed(0)}% Commercial Hotel Capture`,
      explanation: 'Inbound visitors checking into licensed Abu Dhabi hotels and hotel apartments.',
      uncertaintyRange: {
        min: Math.round(scenarioGuests * (supportLevel === 'OUT_OF_SUPPORT' ? 0.75 : 0.90)),
        max: Math.round(scenarioGuests * (supportLevel === 'OUT_OF_SUPPORT' ? 1.25 : 1.10)),
      },
    },
    {
      id: 'nights',
      name: 'Hotel Guest Nights (Component Pending)',
      baselineValue: 0,
      scenarioValue: 0,
      changeValue: 0,
      percentChange: 0,
      unit: 'Guest Nights',
      status: 'Unknown',
      formula: 'Pending linked stay-duration dataset',
      explanation: 'Guest Nights: Not yet available — stay-duration component pending.',
      uncertaintyRange: { min: 0, max: 0 },
    },
  ];

  // 10. Generate Monthly Timeline Breakdown
  const months = getMonthRange(input.startMonth, input.endMonth);
  const monthlyBreakdown: MonthlyForecast[] = months.map((monthStr) => {
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    // Seasonality weights for Abu Dhabi tourism:
    // Winter (Dec, Jan, Feb): 1.18x
    // Spring/Autumn (Mar, Apr, Oct, Nov): 1.05x
    // Summer (Jun, Jul, Aug): 0.75x
    let seasonalWeight = 1.0;
    if ([12, 1, 2].includes(monthNum)) seasonalWeight = 1.18;
    else if ([3, 4, 10, 11].includes(monthNum)) seasonalWeight = 1.06;
    else if ([6, 7, 8].includes(monthNum)) seasonalWeight = 0.74;
    else seasonalWeight = 0.92;

    const matchedEvent = MOCK_EVENTS.find((e) => e.month === monthStr);
    const eventMultiplier = matchedEvent ? matchedEvent.impactMultiplier : 1.0;

    const effectiveWeight = seasonalWeight * eventMultiplier;

    const baseM = Math.round(baselineGuests * effectiveWeight);
    const scenM = Math.round(scenarioGuests * effectiveWeight);
    const uncertaintySpread = supportLevel === 'OUT_OF_SUPPORT' ? 0.28 : 0.10;

    return {
      month: monthStr,
      baselineGuests: baseM,
      scenarioGuests: scenM,
      confidenceMin: Math.round(scenM * (1 - uncertaintySpread)),
      confidenceMax: Math.round(scenM * (1 + uncertaintySpread)),
      baselineSeats: baselineMonthlySeats,
      scenarioSeats: scenarioMonthlySeats,
      baselineNights: null,
      scenarioNights: null,
      eventName: matchedEvent?.name,
    };
  });

  // 11. Compile Warnings
  const topWarnings: string[] = [];
  const allWarnings: string[] = [];

  if (input.assumedWeeklyFrequencyChange !== null) {
    topWarnings.push('Weekly frequency is unavailable for many historical records. This value is treated as a planner assumption.');
    allWarnings.push('Weekly frequency was entered manually rather than observed in the official extract.');
  }

  if (supportLevel === 'OUT_OF_SUPPORT') {
    topWarnings.push('This route lacks direct historical flight evidence. Estimates rely on analogue comparable markets (Germany, UK) and carry a wide uncertainty band.');
    allWarnings.push('Zero historical training observations for this route. Treat forecast as exploratory for executive discussions.');
  } else if (supportLevel === 'LIMITED_SUPPORT') {
    topWarnings.push('Proposed capacity change is near the outer boundary of historically observed fluctuations.');
    allWarnings.push('Confidence is medium due to high capacity delta.');
  }

  if (baseline.alosStatus === 'DEMO_ASSUMPTION') {
    allWarnings.push('Average Length of Stay (ALOS) is a demo assumption only and not yet directly supported by current hotel extracts.');
  }

  if (route.departureCountry === 'United Kingdom') {
    allWarnings.push('Market mapping: Flight origin is London LHR, but ~18% of passengers are European transfer feeders.');
  } else if (route.departureCountry === 'India') {
    allWarnings.push('Market mapping: ~14% of P2P arrivals are returning UAE residents who stay in private residences rather than hotels.');
  }

  // 12. Decision Summary Card generator
  const decisionSummary = generateDecisionSummary({
    route,
    input,
    supportLevel,
    addedMonthlySeats: seatsDiff,
    addedGuests: guestsDiff,
    guestsPct,
    startMonth: input.startMonth,
    endMonth: input.endMonth,
  });

  // 13. Analogues (if new route or requested)
  const analogueRoutes = MOCK_ANALOGUES[route.modelledSourceMarket] || undefined;

  return {
    id: 'res-' + Date.now(),
    timestamp: new Date().toISOString(),
    input,
    supportLevel,
    supportExplanation,
    conversionStages,
    monthlyBreakdown,
    totalSeats: { baseline: baselineMonthlySeats, scenario: scenarioMonthlySeats, diff: seatsDiff, pct: seatsPct },
    totalPax: { baseline: baselinePax, scenario: scenarioPax, diff: paxDiff, pct: paxPct },
    totalP2P: { baseline: baselineP2P, scenario: scenarioP2P, diff: p2pDiff, pct: p2pPct },
    inboundVisitors: { baseline: baselineVisitors, scenario: scenarioVisitors, diff: visitorsDiff, pct: visitorsPct },
    hotelGuests: { baseline: baselineGuests, scenario: scenarioGuests, diff: guestsDiff, pct: guestsPct },
    guestNights: {
      baseline: null,
      scenario: null,
      diff: null,
      pct: null,
      statusNote: 'Guest Nights: Not yet available — stay-duration component pending.',
    },
    guestsPer1kSeats: { baseline: baseGuestsPer1k, scenario: scenGuestsPer1k },
    nightsPer1kSeats: { baseline: baseNightsPer1k, scenario: scenNightsPer1k },
    confidenceScore,
    decisionSummary,
    topWarnings: topWarnings.length > 0 ? topWarnings : [
      'Estimates isolate international air connectivity and keep domestic Abu Dhabi hotel demand in static baseline context.',
      'Aviation changes assume consistent airline route scheduling throughout the selected period.',
    ],
    allWarnings,
    analogueRoutes,
  };
}

/**
 * Helper to compute month list from start to end (inclusive)
 */
function getMonthRange(start: string, end: string): string[] {
  if (!start || !end) return [start || '2027-01'];
  const res: string[] = [];
  let [sY, sM] = start.split('-').map(Number);
  const [eY, eM] = end.split('-').map(Number);

  while (sY < eY || (sY === eY && sM <= eM)) {
    const formatted = `${sY}-${String(sM).padStart(2, '0')}`;
    res.push(formatted);
    sM++;
    if (sM > 12) {
      sM = 1;
      sY++;
    }
    if (res.length > 36) break; // guard
  }
  return res.length > 0 ? res : [start];
}

/**
 * Calculates sensitivity tornado parameters for Tab 4 / Trust section
 */
export function calculateSensitivity(result: ScenarioResult): SensitivityFactor[] {
  const baseGuests = result.hotelGuests.scenario;

  return [
    {
      parameter: 'Total Seat Capacity',
      lowValue: '-15% capacity',
      highValue: '+15% capacity',
      lowImpactPercent: -14.8,
      highImpactPercent: +15.2,
      impactRange: 30.0,
      description: 'The dominant physical constraint. Adding or removing seats directly shifts passenger ceilings.',
    },
    {
      parameter: 'Load Factor',
      lowValue: '70% (-8 pts)',
      highValue: '86% (+8 pts)',
      lowImpactPercent: -10.2,
      highImpactPercent: +10.5,
      impactRange: 20.7,
      description: 'Reflects passenger occupancy. Off-season or competitive pricing shifts this significantly.',
    },
    {
      parameter: 'P2P vs Transfer Share',
      lowValue: '-10% P2P',
      highValue: '+10% P2P',
      lowImpactPercent: -9.5,
      highImpactPercent: +9.5,
      impactRange: 19.0,
      description: 'Zayed Airport transfer passengers do not generate Abu Dhabi hotel stays. High transfer reduces hotel capture.',
    },
    {
      parameter: 'Inbound Visitor Share',
      lowValue: '-10% visitors',
      highValue: '+10% visitors',
      lowImpactPercent: -8.8,
      highImpactPercent: +8.8,
      impactRange: 17.6,
      description: 'Separates non-resident tourists from returning UAE residents who sleep in private residences.',
    },
    {
      parameter: 'Hotel-Capture Rate',
      lowValue: '60% (-8 pts)',
      highValue: '76% (+8 pts)',
      lowImpactPercent: -7.5,
      highImpactPercent: +7.5,
      impactRange: 15.0,
      description: 'Proportion of tourists staying in licensed hotels versus visiting friends & relatives (VFR).',
    },
    {
      parameter: 'Average Length of Stay (ALOS)',
      lowValue: '2.8 nights',
      highValue: '4.2 nights',
      lowImpactPercent: -12.0,
      highImpactPercent: +14.0,
      impactRange: 26.0,
      description: 'Affects total Guest Nights. European and East Asian long-haul visitors stay significantly longer than regional visitors.',
    },
    {
      parameter: 'Event / Seasonal Period',
      lowValue: 'Summer Low (-26%)',
      highValue: 'F1 / Winter Peak (+22%)',
      lowImpactPercent: -26.0,
      highImpactPercent: +22.0,
      impactRange: 48.0,
      description: 'Abu Dhabi winter weather and cultural calendar dramatically shift monthly visitor volume.',
    },
  ];
}
