export type DataStatus = 'Observed' | 'Derived' | 'Estimated' | 'Assumed' | 'Unknown';

export type SupportLevel = 'SUPPORTED' | 'LIMITED_SUPPORT' | 'OUT_OF_SUPPORT' | 'BLOCKED';

export type DecisionType = 
  | 'NEW_ROUTE' 
  | 'CHANGE_FREQUENCY' 
  | 'CHANGE_CAPACITY' 
  | 'TEST_LOAD_FACTOR' 
  | 'ASSESS_ROUTE_LOSS' 
  | 'COMPARE_MARKETS';

export type Season = 'Winter (Peak)' | 'Spring (Shoulder)' | 'Summer (Low)' | 'Autumn (Shoulder)';

export interface RouteInfo {
  id: string;
  routeCode: string; // e.g. DEL → AUH
  departureCity: string;
  departureCountry: string; // Flight-origin country (Never just 'Country')
  arrivalCity: string; // Abu Dhabi
  arrivalCode: string; // AUH
  airline: string;
  modelledSourceMarket: string; // Modelled source market
  isExisting: boolean;
  distanceKm: number;
  flightDurationHours: number;
}

export interface BaselineFlightData {
  routeId: string;
  reportingMonth: string; // YYYY-MM
  totalSeats: number;
  totalPax: number;
  totalPaxExcludingInfant?: number;
  totalP2P: number;
  totalTransfer: number;
  totalTransit: number;
  historicalLoadFactor: number; // e.g. 0.78
  averageWeeklyFrequency: number | null; // null if unavailable
  frequencyDataStatus: DataStatus;
  cabinClassMix: {
    first: number;
    business: number;
    economy: number;
  };
  inboundVisitorShare: number;
  hotelCaptureRate: number;
  averageLengthOfStay: number;
  alosStatus: 'DIRECT_DATA' | 'DERIVED' | 'DEMO_ASSUMPTION' | 'UNAVAILABLE';
}

export interface CountryMapping {
  flightOriginCountry: string; // Flight-origin country
  departureCity: string;
  modelledSourceMarket: string; // Modelled source market
  mappingConfidence: 'High' | 'Medium' | 'Low';
  explanation: string;
  guestNationalityMix: {
    hotelGuestNationality: string; // Hotel guest nationality
    sharePercentage: number;
    residenceGroup: 'UAE Resident' | 'GCC National' | 'International Tourist' | 'Other';
    status: DataStatus;
  }[];
}

export interface ScenarioInput {
  scenarioName: string;
  routeId: string;
  decisionType: DecisionType;
  routeStatus: 'EXISTING' | 'NEW_ROUTE' | 'DISCONTINUED';
  startMonth: string; // YYYY-MM
  endMonth: string; // YYYY-MM
  seatCapacityChange: number; // Absolute monthly change
  useCustomLoadFactor: boolean;
  customLoadFactor: number | null;
  assumedWeeklyFrequencyChange: number | null;
  aircraftType?: string;
  seatsPerFlight?: number;
  newRouteDepartureCountry?: string;
  newRouteDepartureCity?: string;
  newRouteArrivalCity?: string;
  newRouteAirline?: string;
  newRouteMonthlyCapacity?: number;
  newRouteLoadFactor?: number;
  newRouteP2PShare?: number;
  transferShareOverride?: number | null;
  transitShareOverride?: number | null;
  visitorShareOverride?: number | null;
  hotelCaptureRateOverride?: number | null;
  alosOverride?: number | null;
  hasEventPeriod?: boolean;
  selectedEvent?: string;
  sourceMarketHoliday?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  isBlocking: boolean;
}

export interface ValidationSummary {
  isValid: boolean;
  hasBlockingErrors: boolean;
  blockingErrors: ValidationError[];
  warnings: ValidationError[];
}

export interface ConversionStage {
  id: string;
  name: string;
  baselineValue: number;
  scenarioValue: number;
  changeValue: number;
  percentChange: number;
  unit: string;
  status: DataStatus;
  formula: string;
  explanation: string;
  uncertaintyRange: { min: number; max: number };
}

export interface MonthlyForecast {
  month: string;
  baselineGuests: number;
  scenarioGuests: number;
  confidenceMin: number;
  confidenceMax: number;
  baselineSeats: number;
  scenarioSeats: number;
  baselineNights: number | null;
  scenarioNights: number | null;
  eventName?: string;
  holidayName?: string;
}

export interface DecisionSummary {
  expectedImpact: string;
  mainReason: string;
  mainUncertainty: string;
  recommendedAction: string;
}

export interface ScenarioResult {
  id: string;
  timestamp: string;
  input: ScenarioInput;
  supportLevel: SupportLevel;
  supportExplanation: string;
  conversionStages: ConversionStage[];
  monthlyBreakdown: MonthlyForecast[];
  // Summary KPIs
  totalSeats: { baseline: number; scenario: number; diff: number; pct: number };
  totalPax: { baseline: number; scenario: number; diff: number; pct: number };
  totalP2P: { baseline: number; scenario: number; diff: number; pct: number };
  inboundVisitors: { baseline: number; scenario: number; diff: number; pct: number };
  hotelGuests: { baseline: number; scenario: number; diff: number; pct: number };
  guestNights: { 
    baseline: number | null; 
    scenario: number | null; 
    diff: number | null; 
    pct: number | null;
    statusNote: string;
  };
  guestsPer1kSeats: { baseline: number; scenario: number };
  nightsPer1kSeats: { baseline: number; scenario: number };
  confidenceScore: number;
  decisionSummary: DecisionSummary;
  topWarnings: string[];
  allWarnings: string[];
  analogueRoutes?: RouteAnalogue[];
}

export interface RouteAnalogue {
  market: string;
  routeCode: string;
  similarityScore: number;
  similarityFactors: string[];
  historicalLoadFactor: number;
  historicalP2PShare: number;
  hotelCaptureRate: number;
  alos: number;
  analogueConfidence: 'High' | 'Medium' | 'Exploratory';
}

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  routeLabel: string;
  marketLabel: string;
  dateRange: string;
  addedSeats: number;
  addedGuests: number;
  addedNights: number | null;
  guestsPer1kSeats: number;
  confidenceScore: number;
  supportLevel: SupportLevel;
  mainUncertainty: string;
  recommendation: string;
  badges: string[];
  input: ScenarioInput;
  result: ScenarioResult;
}

export interface SensitivityFactor {
  parameter: string;
  lowValue: string;
  highValue: string;
  lowImpactPercent: number;
  highImpactPercent: number;
  impactRange: number;
  description: string;
}

export interface ModelValidationMetric {
  market: string;
  sampleMonths: number;
  wmape: number | null;
  status: 'Pending' | 'Adequate' | 'Watch' | 'Strong';
  coverageNotes: string;
}

export interface MarketRankingItem {
  market: string;
  nationality: string;
  route: string;
  guestsPer1kSeats: number;
  p2pShare: number;
  hotelConversion: number;
  peakSeason: string;
  supportLevel: SupportLevel;
  dataCoverageMonths: number;
  status: DataStatus;
}

export interface SeasonalityMonthlyPoint {
  month: string;
  monthName: string;
  hotelGuests: number;
  newHotelArrivals: number;
  seasonName: string;
  isPeak: boolean;
  status: DataStatus;
}

export interface SourceMarketHeatmapRow {
  marketName: string;
  hotelGuestNationality: string;
  flightOriginCountry: string;
  monthlyIntensity: number[]; // 12 values 0.0 - 1.0
  annualArrivals: number;
  dataCoverage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  quickReplies?: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
  category: 'General Planning' | 'Aviation Metrics' | 'Tourism Metrics' | 'Model & Governance' | 'Data & Methodology';
}
