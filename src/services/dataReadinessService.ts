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
      const predRes = await fetch('/data/model_predictions.json');
      if (predRes.ok) {
        files.modelPredictions = true;
        const predData = await predRes.json();
        if (predData && predData.isTrained && predData.predictions && predData.predictions.length > 0) {
          predictionsValid = true;
          modelVersion = predData.modelVersion || 'v1.0-prod';
          validationPeriod = predData.validationPeriod || null;
          intervalsAvailable = !!predData.predictionIntervals;
        }
      }
    } catch {
      // Keep predictionsValid = false
    }

    try {
      const metRes = await fetch('/data/model_metrics.json');
      if (metRes.ok) {
        files.modelMetrics = true;
        const metData = await metRes.json();
        if (metData && metData.isEvaluated && typeof metData.wmape === 'number') {
          metricsValid = true;
          wmape = metData.wmape;
          validationPeriod = validationPeriod || metData.validationWindow || null;
        }
      }
    } catch {
      // Keep metricsValid = false
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
