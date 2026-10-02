import { EDA_INSIGHTS, EdaInsight } from '../data/edaInsights';
import { REPORT_KNOWLEDGE_BASE, ReportKnowledgeItem } from '../data/reportKnowledge';

export class EdaService {
  /**
   * Returns all structured insight records extracted from the EDA Report.
   */
  public static getAllInsights(): EdaInsight[] {
    return EDA_INSIGHTS;
  }

  /**
   * Returns insights filtered by category.
   */
  public static getInsightsByCategory(category: EdaInsight['category']): EdaInsight[] {
    return EDA_INSIGHTS.filter((insight) => insight.category === category);
  }

  /**
   * Retrieves a single insight by its unique identifier.
   */
  public static getInsightById(id: string): EdaInsight | undefined {
    return EDA_INSIGHTS.find((insight) => insight.id === id);
  }

  /**
   * Searches the chatbot knowledge base using natural language keyword matching.
   */
  public static searchReportKnowledge(query: string): ReportKnowledgeItem[] {
    if (!query || query.trim().length === 0) {
      return REPORT_KNOWLEDGE_BASE;
    }

    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);

    return REPORT_KNOWLEDGE_BASE.map((item) => {
      let score = 0;
      const questionLower = item.question.toLowerCase();
      const answerLower = item.answer.toLowerCase();

      // Exact substring matches in question
      if (questionLower.includes(cleanQuery)) {
        score += 15;
      }

      // Keyword matches
      for (const kw of item.keywords) {
        if (cleanQuery.includes(kw) || kw.includes(cleanQuery)) {
          score += 10;
        }
      }

      // Token matches
      for (const token of queryTokens) {
        if (questionLower.includes(token)) score += 5;
        if (item.keywords.some((k) => k.includes(token))) score += 4;
        if (answerLower.includes(token)) score += 1;
      }

      return { item, score };
    })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);
  }

  /**
   * Returns market-specific EDA interpretation grounded in the report.
   */
  public static getMarketInterpretation(market: string): {
    market: string;
    summary: string;
    seasonality: string;
    association: string;
    limitation: string;
    sourcePages: number[];
  } {
    const marketLower = market.toLowerCase();

    if (marketLower.includes('oman') || marketLower.includes('qatar') || marketLower.includes('saudi') || marketLower.includes('kuwait') || marketLower.includes('bahrain')) {
      return {
        market,
        summary:
          'High median daily new-arrival share (40% to 63%), reflecting rapid guest turnover and short regional visits.',
        seasonality:
          'Exhibits summer peaks (July–August), counter-cyclical to European patterns. Weekday check showed Thursday peaks clearer outside summer.',
        association:
          'High direct connectivity to AUH. However, hotel records do not identify travel mode (air flight vs. land border crossing).',
        limitation:
          'Driving hypothesis remains unproven by weekday checks. Hotel records do not record transport mode or same-day visits.',
        sourcePages: [2, 7, 8],
      };
    }

    if (marketLower.includes('uk') || marketLower.includes('united kingdom') || marketLower.includes('brit') || marketLower.includes('german') || marketLower.includes('france')) {
      return {
        market,
        summary:
          'Lower median daily new-arrival share (18% to 25%), reflecting longer multiday hotel stays per check-in.',
        seasonality:
          'Strong winter seasonality (Nov–Mar) with recurring, pronounced summer troughs during extreme desert temperatures.',
        association:
          'UK is both a major direct source market and a prominent transit conduit; Japanese and South Korean check-ins correlate strongly with UK flight departures (adjusted r ~ 0.65).',
        limitation:
          'Raw correlation with flight departure country diminishes after controlling for global trends and month-of-year cycles.',
        sourcePages: [2, 6, 14, 16],
      };
    }

    if (marketLower.includes('india') || marketLower.includes('pakistan')) {
      return {
        market,
        summary:
          'Substantial steady baseline volume with moderate new-arrival share (~30–35%). High mix of business, leisure, and family travel.',
        seasonality:
          'Initially appeared less seasonal in raw counts; normalized 2023 and 2024 profiles reveal summer dips and post-monsoon/winter surges.',
        association:
          'Extensive direct airline connectivity. Adjusted market associations must account for the high proportion of returning UAE resident expatriates who do not stay in hotels.',
        limitation:
          'High P2P passenger numbers include substantial resident populations sleeping in private homes rather than hotels.',
        sourcePages: [3, 6, 12, 15],
      };
    }

    if (marketLower.includes('finland')) {
      return {
        market,
        summary:
          'Moderate winter leisure arrivals with severe summer data missingness.',
        seasonality:
          'Apparent summer absence is driven by data collection gaps rather than zero customer demand.',
        association:
          'Lacks direct matching-country flight series; requires proxy market alignment.',
        limitation:
          'Only 15 of 50 possible months retained complete observation status. Missing data must strictly NOT be imputed as zero.',
        sourcePages: [5, 9, 38],
      };
    }

    // Default general interpretation
    return {
      market,
      summary:
        'Analyzed as part of the 45 hotel nationalities and 33 aviation departure countries in the EDA report.',
      seasonality:
        'Subject to distinct source-market travel cycles documented in 2022–2025 monthly profiles.',
      association:
        'Evaluated under the pooled monthly New Arrivals framework (one observation per nationality and month).',
      limitation:
        'All statistical associations are exploratory co-movements; predictive model training and evaluation remain pending.',
      sourcePages: [1, 14, 19],
    };
  }

  /**
   * Provides high-level summary of data quality, coverage, and model governance from the report.
   */
  public static getDataLimitationSummary(): {
    totalPairedObs: number;
    totalNationalities: number;
    totalDepartureMarkets: number;
    exceptionCount: number;
    exceptionRate: string;
    missingnessRule: string;
    modelStatus: string;
    guestNightStatus: string;
    reportingGranularityBreak: string;
    referenceReport: string;
  } {
    return {
      totalPairedObs: 58360,
      totalNationalities: 45,
      totalDepartureMarkets: 33,
      exceptionCount: 14,
      exceptionRate: '0.024% (14 of 58,236 comparisons)',
      missingnessRule: 'Missing observations must strictly not be interpreted as zero demand',
      modelStatus: 'Model not yet trained (EDA Mode active; architecture defined for monthly pooled New Arrivals)',
      guestNightStatus: 'Guest Nights — not yet supported (stay-duration component pending)',
      reportingGranularityBreak: '2022 month-stamped records vs. 2023 daily-dated records',
      referenceReport: 'DCT_EDA_Report.pdf (24 September 2026, Notebook findings and discussion)',
    };
  }
}
