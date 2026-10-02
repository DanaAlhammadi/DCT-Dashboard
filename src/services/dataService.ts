import {
  RouteInfo,
  BaselineFlightData,
  CountryMapping,
  RouteAnalogue,
  ModelValidationMetric,
  MarketRankingItem,
  SeasonalityMonthlyPoint,
  SourceMarketHeatmapRow,
  GlossaryItem,
} from '../types/dashboard';

import {
  DEMO_ROUTES,
  DEMO_BASELINES,
  DEMO_COUNTRY_MAPPINGS,
  DEMO_ANALOGUES,
  DEMO_MODEL_METRICS,
  DEMO_MARKET_RANKINGS,
  DEMO_NATIONALITIES,
  DEMO_SEASONALITY_BY_NATIONALITY,
  DEMO_SOURCE_MARKET_HEATMAP,
  GLOSSARY_ITEMS,
} from '../data/demoData';

export class DataService {
  /**
   * Retrieves all supported flight routes.
   */
  public static getRoutes(): RouteInfo[] {
    return DEMO_ROUTES;
  }

  /**
   * Retrieves specific route info by route ID.
   */
  public static getRouteById(id: string): RouteInfo {
    return DEMO_ROUTES.find((r) => r.id === id) || DEMO_ROUTES[0];
  }

  /**
   * Retrieves baseline flight data for a given route.
   */
  public static getBaseline(routeId: string): BaselineFlightData {
    return DEMO_BASELINES[routeId] || DEMO_BASELINES['DEL-AUH'];
  }

  /**
   * Retrieves all market-to-nationality mappings.
   */
  public static getCountryMappings(): Record<string, CountryMapping> {
    return DEMO_COUNTRY_MAPPINGS;
  }

  /**
   * Retrieves country mapping for a specific flight-origin country or modelled source market.
   */
  public static getCountryMapping(marketOrCountry: string): CountryMapping | undefined {
    return DEMO_COUNTRY_MAPPINGS[marketOrCountry] || DEMO_COUNTRY_MAPPINGS['United Kingdom'];
  }

  /**
   * Retrieves market ranking data.
   */
  public static getMarketRankings(): MarketRankingItem[] {
    return DEMO_MARKET_RANKINGS;
  }

  /**
   * Retrieves model validation and governance metrics.
   */
  public static getModelMetrics(): ModelValidationMetric[] {
    return DEMO_MODEL_METRICS;
  }

  /**
   * Retrieves selectable nationalities for insights.
   */
  public static getNationalities() {
    return DEMO_NATIONALITIES;
  }

  /**
   * Retrieves monthly seasonality points for a given nationality.
   */
  public static getSeasonality(nationality: string): SeasonalityMonthlyPoint[] {
    return DEMO_SEASONALITY_BY_NATIONALITY[nationality] || DEMO_SEASONALITY_BY_NATIONALITY['British'];
  }

  /**
   * Retrieves source market heatmap matrix data.
   */
  public static getSourceMarketHeatmap(): SourceMarketHeatmapRow[] {
    return DEMO_SOURCE_MARKET_HEATMAP;
  }

  /**
   * Retrieves glossary terms and definitions.
   */
  public static getGlossaryItems(): GlossaryItem[] {
    return GLOSSARY_ITEMS;
  }

  /**
   * Retrieves route analogues for exploratory markets.
   */
  public static getAnalogues(marketKey: string): RouteAnalogue[] {
    return DEMO_ANALOGUES[marketKey] || DEMO_ANALOGUES['Japan'] || [];
  }

  /**
   * Metadata regarding current data provenance, mode, and timestamps.
   */
  public static getDataMetadata() {
    return {
      dataSource: 'Abu Dhabi Department of Culture and Tourism (DCT) & Zayed International Airport (AUH)',
      lastUpdated: 'September 24, 2026',
      reportReference: 'DCT_EDA_Report.pdf (Notebooks/01.ipynb)',
      reportingCycle: 'Monthly Consolidated Operational Extract',
      currentMode: 'EDA MODE',
      analyticalTarget: 'Monthly New Hotel Arrivals by nationality',
      statusBanner: 'EDA MODE — Current analytical focus: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.',
      modelStatus: 'Model not yet trained',
      guestNightStatus: 'Guest Nights — not yet supported',
      validationStatus: 'Predictive model validation is still pending',
      historicalSampleMonths: 50,
    };
  }
}
