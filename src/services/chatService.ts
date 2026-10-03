import { ScenarioResult, RouteInfo } from '../types/dashboard';
import { EdaService } from './edaService';
import { ReportKnowledgeItem } from '../data/reportKnowledge';

export class ChatService {
  /**
   * Five required Apple-like clear suggested questions for the DCT planner
   */
  public static getSuggestedPrompts(): string[] {
    return [
      'Explain this result',
      'Why is confidence limited?',
      'What assumption matters most?',
      'Compare two markets',
      'Summarise this for management',
    ];
  }

  /**
   * Generates an evidence-based, context-aware answer citing DCT research & active scenario
   */
  public static generateResponse(
    userQuery: string,
    currentResult?: ScenarioResult,
    currentRoute?: RouteInfo
  ): { text: string; sourcePage?: number; limitation?: string } {
    const q = userQuery.toLowerCase().trim();

    // 1. Context-Aware: Explain this result
    if (q.includes('explain this result') || q.includes('explain the result')) {
      if (currentResult && currentRoute) {
        const isPos = currentResult.hotelGuests.diff >= 0;
        return {
          text:
            `### Scenario Result Explanation\n\n` +
            `For your active plan (**${currentResult.input.scenarioName}** on ${currentRoute.routeCode}):\n\n` +
            `• **Net Hotel Check-in Impact**: **${isPos ? '+' : ''}${currentResult.hotelGuests.diff.toLocaleString()}** additional check-ins/month (${currentResult.hotelGuests.scenario.toLocaleString()} total vs. ${currentResult.hotelGuests.baseline.toLocaleString()} baseline).\n` +
            `• **Percentage Growth**: ${isPos ? '+' : ''}${currentResult.hotelGuests.pct.toFixed(1)}% above current baseline.\n` +
            `• **Conversion Efficiency**: **${currentResult.guestsPer1kSeats.scenario}** hotel check-ins generated per 1,000 scheduled flight seats.\n` +
            `• **Recorded Guest-Days Proxy**: **${currentResult.guestNights.diff !== null ? `${currentResult.guestNights.diff >= 0 ? '+' : ''}${currentResult.guestNights.diff.toLocaleString()}` : 'Unavailable'}** guest-days/month (using historical multiplier ${currentResult.conversionStages[3]?.scenarioValue && currentResult.guestNights.scenario !== null ? (currentResult.guestNights.scenario / Math.max(1, currentResult.hotelGuests.scenario)).toFixed(2) : '3.44'}×).\n\n` +
            `*Evidence status: ${currentResult.supportLevel}. Predictions are calibrated against 50 months of historical observations.*`,
          sourcePage: 19,
          limitation: 'Calculated using frozen linear_v009 regression baseline and empirical funnel conversions.',
        };
      }
    }

    // 2. Context-Aware: Why is confidence limited?
    if (q.includes('confidence') || q.includes('limited')) {
      const support = currentResult?.supportLevel || 'SUPPORTED';
      const explanation = currentResult?.supportExplanation || 'Parameters fall near historical boundary';
      return {
        text:
          `### Why Confidence Is Limited\n\n` +
          `The current support rating is **${support}** (${explanation}).\n\n` +
          `1. **Model Accuracy Benchmark**: The linear regression baseline (\`linear_v009\`) has an out-of-sample error (WMAPE) of **25.52%**. Notably, the Seasonal Benchmark achieved a superior **22.63% WMAPE**, proving seasonal factors dominate pure capacity shifts.\n` +
          `2. **Transit Passenger Filtering**: Abu Dhabi International Airport is a major global hub; over 50% of arriving seats transfer onward to other destinations and do not book hotel rooms.\n` +
          `3. **External Tourism Factors**: Flight capacity changes correlate with hotel demand, but cannot account for visa rule shifts, major events, currency swings, or overland road trips from GCC neighbors.`,
        sourcePage: 18,
        limitation: 'Exploratory correlations do not establish singular causal flight attribution.',
      };
    }

    // 3. Context-Aware: What assumption matters most?
    if (q.includes('assumption') || q.includes('matter')) {
      return {
        text:
          `### Critical Assumptions in Order of Sensitivity\n\n` +
          `1. **Point-to-Point (P2P) Share**: This is the single biggest filter. Only passengers terminating their journey in Abu Dhabi can generate hotel check-ins. High-transfer routes dilute flight additions.\n` +
          `2. **Seasonality Timing**: Adding flights during an origin's natural trough (e.g. Europe in July) generates far fewer visitors than adding capacity in peak season (November–March).\n` +
          `3. **Guest-Day Conversion Multiplier**: Check-ins are multiplied by historical ratios (3.44× to 4.2×) to estimate recorded guest-days. This is an analytical proxy, not verified occupied guest room nights.`,
        sourcePage: 14,
        limitation: 'Aviation seat growth does not convert 1:1 into hotel room occupancy.',
      };
    }

    // 4. Context-Aware: Compare two markets
    if (q.includes('compare') || q.includes('market')) {
      return {
        text:
          `### Comparing Market Behaviors: Europe vs. Gulf (GCC)\n\n` +
          `• **Western Europe (UK, Germany, France)**:\n` +
          `  - *Seasonality*: Deep summer troughs (<50 index in July/August); winter surges (up to 145 index).\n` +
          `  - *Stay Profile*: Longer multi-day stays (4.2+ guest days per check-in).\n` +
          `  - *Strategic Guidance*: Target airline seat incentives exclusively during November–March.\n\n` +
          `• **Gulf / GCC (Saudi Arabia, Oman, Qatar)**:\n` +
          `  - *Seasonality*: Summer surges (180–215 index) driven by regional school holidays.\n` +
          `  - *Stay Profile*: Shorter, frequent visits (rapid turnover); overland road arrivals not captured in flight logs.\n` +
          `  - *Strategic Guidance*: Maximize flight frequency and weekend hotel packages in June–August.`,
        sourcePage: 7,
        limitation: 'Hotel records do not record transport mode for driving visitors.',
      };
    }

    // 5. Context-Aware: Summarise this for management
    if (q.includes('management') || q.includes('summarise') || q.includes('summary') || q.includes('brief')) {
      if (currentResult && currentRoute) {
        const isPos = currentResult.hotelGuests.diff >= 0;
        return {
          text:
            `### Executive Brief for Leadership\n\n` +
            `• **Route & Proposal**: ${currentResult.input.scenarioName} (${currentRoute.departureCity} to AUH)\n` +
            `• **Planned Capacity Shift**: ${currentResult.totalSeats.diff >= 0 ? '+' : ''}${currentResult.totalSeats.diff.toLocaleString()} seats/month\n` +
            `• **Expected Hotel Impact**: **${isPos ? '+' : ''}${currentResult.hotelGuests.diff.toLocaleString()}** additional check-ins/month (+${currentResult.hotelGuests.pct.toFixed(1)}%)\n` +
            `• **Recorded Guest-Days Proxy**: **${currentResult.guestNights.diff !== null ? `${currentResult.guestNights.diff >= 0 ? '+' : ''}${currentResult.guestNights.diff.toLocaleString()}` : 'Unavailable'}** guest-days/month\n` +
            `• **Evidence Confidence**: ${currentResult.supportLevel} (${currentResult.supportExplanation})\n` +
            `• **Strategic Recommendation**: ${currentResult.decisionSummary.recommendedAction}`,
          sourcePage: 1,
          limitation: 'Prepared for DCT senior leadership planning; model linear_v009 holdout validated.',
        };
      }
    }

    // Guardrail search against report knowledge
    const matchedItems = EdaService.searchReportKnowledge(q);
    if (matchedItems && matchedItems.length > 0) {
      const topMatch: ReportKnowledgeItem = matchedItems[0];
      return {
        text: topMatch.answer,
        sourcePage: topMatch.sourcePage,
        limitation: topMatch.limitation,
      };
    }

    // General fallback
    return {
      text:
        `I can help clarify Abu Dhabi flight-to-hotel dynamics grounded in official DCT research.\n\n` +
        `Try asking one of the suggested prompts below to evaluate your current scenario or compare visitor markets.`,
      sourcePage: 1,
      limitation: 'All responses strictly reflect verified DCT data policies.',
    };
  }
}
