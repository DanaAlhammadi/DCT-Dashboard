import { DecisionSummary, RouteInfo, ScenarioInput, SupportLevel } from '../types';

interface SummaryParams {
  route: RouteInfo;
  input: ScenarioInput;
  supportLevel: SupportLevel;
  addedMonthlySeats: number;
  addedGuests: number;
  guestsPct: number;
  startMonth: string;
  endMonth: string;
}

export function generateDecisionSummary(params: SummaryParams): DecisionSummary {
  const { route, input, supportLevel, addedMonthlySeats, addedGuests, guestsPct } = params;
  const absGuests = Math.abs(addedGuests).toLocaleString();
  const absSeats = Math.abs(addedMonthlySeats).toLocaleString();
  const isReduction = addedMonthlySeats < 0;
  const isNewRoute = input.routeStatus === 'NEW_ROUTE' || !route.isExisting;

  // New Route Case (e.g. Japan)
  if (isNewRoute) {
    return {
      expectedImpact: `Opening a proposed direct route from ${route.departureCity} (${route.departureCountry}) could generate approximately ${absGuests} new hotel guests per month during the ${input.startMonth} to ${input.endMonth} period.`,
      mainReason: `East Asian long-haul travelers exhibit high hotel-capture rates (~90%) and strong interest in cultural attractions (Saadiyat Cultural District, Louvre Abu Dhabi), with minimal friend-and-relative stay diversion.`,
      mainUncertainty: `Zero direct historical flight operations exist between ${route.departureCity} and Abu Dhabi. Estimates rely on analogue European and East Asian long-haul benchmarks and carry exploratory uncertainty.`,
      recommendedAction: `Use this estimate to initiate initial route viability discussions with airline partners, while commissioning a targeted consumer willingness-to-travel survey in Japan before committing marketing co-op funds.`,
    };
  }

  // Route Reduction or Discontinuation Case
  if (isReduction) {
    return {
      expectedImpact: `Reducing monthly seat capacity by ${absSeats} on ${route.routeCode} is expected to lower Abu Dhabi hotel demand by approximately ${absGuests} guests per month (${Math.abs(guestsPct).toFixed(1)}% drop).`,
      mainReason: `Direct reduction in scheduled seat inventory without compensating frequency on alternate carriers directly restricts point-to-point passenger arrivals.`,
      mainUncertainty: `Potential passenger re-routing through competing GCC hub airports or connecting European gateways could cushion or worsen the actual visitor loss.`,
      recommendedAction: `Provide early warning to hotels specializing in ${route.modelledSourceMarket} guests for the upcoming season, and explore joint marketing or code-share arrangements to protect critical direct capacity.`,
    };
  }

  // Normal Capacity / Frequency Increase Case (e.g. India or UK)
  const isWinter = ['2026-11', '2026-12', '2027-01', '2027-02'].some(m => input.startMonth.includes(m) || input.endMonth.includes(m));
  
  return {
    expectedImpact: `Adding ${absSeats} monthly seats on the ${route.departureCity} route is expected to generate approximately ${absGuests} additional Abu Dhabi hotel guests per month (+${guestsPct.toFixed(1)}% demand increase).`,
    mainReason: `Driven by strong historical point-to-point travel demand and proven hotel conversion from the ${route.modelledSourceMarket} market${isWinter ? ', amplified by high Abu Dhabi winter tourism seasonality' : ''}.`,
    mainUncertainty: route.departureCountry === 'India' 
      ? `Conversion from flight-origin market to hotel-guest nationality, specifically the proportion of returning UAE resident expatriates versus genuine commercial hotel guests.`
      : `Airport slot constraints and whether connecting transfer passengers absorb a larger portion of the newly added seat capacity.`,
    recommendedAction: `Confirm the operating carrier's target schedule, verify that local hotel inventory in relevant categories has capacity to absorb the expected demand, and align DCT promotional campaigns in ${route.departureCity}.`,
  };
}
