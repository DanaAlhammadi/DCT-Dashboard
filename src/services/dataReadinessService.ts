import { DashboardDataService } from './dashboardDataService';

export interface ModelReadinessStatus {
  isPredictionModeAvailable: boolean;
  activeMode: 'EDA_MODE' | 'PREDICTION_MODE';
  statusBanner: string;
  modelVersion: string | null;
  validationPeriod: string | null;
  wmape: number | null;
  predictionIntervalsAvailable: boolean;
  historicalSupportStatus: string;
  filesAvailable: {
    metadata: boolean;
    hotelMarketMonthly: boolean;
    flightMarketMonthly: boolean;
    marketSeasonality: boolean;
    dataQuality: boolean;
    marketMapping: boolean;
    modelPredictions: boolean;
    modelMetrics: boolean;
  };
}

export class DataReadinessService {
  private static cachedStatus: ModelReadinessStatus | null = null;

  public static async checkDataReadiness(): Promise<ModelReadinessStatus> {
    if (this.cachedStatus) {
      return this.cachedStatus;
    }

    const files = {
      metadata: false,
      hotelMarketMonthly: false,
      flightMarketMonthly: false,
      marketSeasonality: false,
      dataQuality: false,
      marketMapping: false,
      modelPredictions: false,
      modelMetrics: false,
    };

    let predictionsValid = false;
    let metricsValid = false;
    let modelVersion: string | null = null;
    let validationPeriod: string | null = null;
    let wmape: number | null = null;
    let intervalsAvailable = false;

    try {
      const store = await DashboardDataService.auditAllDatasets();
      
      files.metadata = store.fileSummaries['metadata.json']?.status === 'Loaded';
      files.hotelMarketMonthly = store.fileSummaries['hotel_market_monthly.json']?.status === 'Loaded';
      files.flightMarketMonthly = store.fileSummaries['flight_market_monthly.json']?.status === 'Loaded';
      files.marketSeasonality = store.fileSummaries['market_seasonality.json']?.status === 'Loaded';
      files.dataQuality = store.fileSummaries['data_quality.json']?.status === 'Loaded';
      files.marketMapping = store.fileSummaries['market_mapping.json']?.status === 'Loaded';
      files.modelPredictions = store.fileSummaries['model_predictions.json']?.status === 'Loaded';
      files.modelMetrics = store.fileSummaries['model_metrics.json']?.status === 'Loaded';

      if (store.modelPredictions && store.modelPredictions.length > 0) {
        predictionsValid = true;
        modelVersion = store.globalStats.modelVersion || 'linear_v009';
        validationPeriod = '2025-01 to 2026-02';
        intervalsAvailable = false; // Bounds uncalibrated
      }

      if (store.modelMetrics && typeof store.globalStats.overallWmape === 'number') {
        metricsValid = true;
        wmape = store.globalStats.overallWmape / 100;
        validationPeriod = validationPeriod || '2022-01 to 2026-02';
      }
    } catch {
      // In case audit fails, defaults are retained
    }

    const isPredictionMode = predictionsValid && metricsValid;

    const status: ModelReadinessStatus = {
      isPredictionModeAvailable: isPredictionMode,
      activeMode: isPredictionMode ? 'PREDICTION_MODE' : 'EDA_MODE',
      statusBanner: isPredictionMode
        ? `PREDICTION MODE — Model ${modelVersion ?? 'Active'} evaluated over ${validationPeriod ?? 'holdout period'} (WMAPE: ${(wmape! * 100).toFixed(1)}%).`
        : 'EDA MODE — Current analytical focus: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.',
      modelVersion,
      validationPeriod,
      wmape,
      predictionIntervalsAvailable: intervalsAvailable,
      historicalSupportStatus: isPredictionMode ? 'EVALUATED_HOLDOUT' : 'EXPLORATORY_ASSOCIATION',
      filesAvailable: files,
    };

    this.cachedStatus = status;
    return status;
  }

  /**
   * Synchronous default getter ensuring reliable immediate render without layout flicker.
   */
  public static getSyncDefaultStatus(): ModelReadinessStatus {
    return {
      isPredictionModeAvailable: false,
      activeMode: 'EDA_MODE',
      statusBanner:
        'EDA MODE — Current analytical focus: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.',
      modelVersion: null,
      validationPeriod: null,
      wmape: null,
      predictionIntervalsAvailable: false,
      historicalSupportStatus: 'EXPLORATORY_ASSOCIATION',
      filesAvailable: {
        metadata: true,
        hotelMarketMonthly: true,
        flightMarketMonthly: true,
        marketSeasonality: true,
        dataQuality: true,
        marketMapping: true,
        modelPredictions: true,
        modelMetrics: true,
      },
    };
  }
}
