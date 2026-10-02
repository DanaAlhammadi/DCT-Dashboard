import { ScenarioResult, RouteInfo } from '../types/dashboard';
import { EdaService } from './edaService';
import { ReportKnowledgeItem } from '../data/reportKnowledge';

export class ChatService {
  /**
   * Default suggested quick questions for the DCT planner based on the EDA Report
   */
  public static getSuggestedPrompts(): string[] {
    return [
      'Explain Guests versus New Arrivals',
      'Why do we use P2P?',
      'Is this market’s seasonal pattern reliable?',
      'Why is this month marked incomplete?',
      'What does adjusted correlation mean?',
      'Why is flight-origin country different from nationality?',
      'Is the model already validated?',
      'What data is still missing?',
    ];
  }

  /**
   * Generates an evidence-based answer citing DCT_EDA_Report.pdf
   */
  public static generateResponse(
    userQuery: string,
    currentResult?: ScenarioResult,
    currentRoute?: RouteInfo
  ): { text: string; sourcePage?: number; limitation?: string } {
    const q = userQuery.toLowerCase().trim();

    // 1. Guardrail checks: Check against report knowledge items first
    const matchedItems = EdaService.searchReportKnowledge(q);
    if (matchedItems && matchedItems.length > 0) {
      const topMatch: ReportKnowledgeItem = matchedItems[0];
      return {
        text: topMatch.answer,
        sourcePage: topMatch.sourcePage,
        limitation: topMatch.limitation,
      };
    }

    // 2. Scenario-specific queries
    if (
      currentResult &&
      currentRoute &&
      (q.includes('this scenario') ||
        q.includes('current route') ||
        q.includes('recommendation') ||
        q.includes('my plan'))
    ) {
      const isPos = currentResult.hotelGuests.diff >= 0;
      return {
        text:
          `For your illustrative scenario (**${currentResult.input.scenarioName}** on ${currentRoute.routeCode}):\n\n` +
          `• **Illustrative Hotel Arrivals**: ${currentResult.hotelGuests.scenario.toLocaleString()} arrivals/mo (${isPos ? '+' : ''}${currentResult.hotelGuests.diff.toLocaleString()} vs baseline).\n` +
          `• **Empirical Funnel Efficiency**: ${currentResult.guestsPer1kSeats.scenario} hotel arrivals per 1,000 scheduled seats.\n` +
          `• **Evidence Support Level**: ${currentResult.supportLevel} (${currentResult.supportExplanation})\n` +
          `• **Strategic Guidance**: ${currentResult.decisionSummary.recommendedAction}\n\n` +
          `*Note: The platform is in EDA Mode. Predictive model validation is pending; numbers reflect direct empirical conversion funnels.*`,
        sourcePage: 19,
        limitation:
          'Illustrative conversion based on empirical funnel ratios; no predictive ML model has yet been trained.',
      };
    }

    // Default grounded overview
    return {
      text:
        `Hello! I am **SILA / AeroStay**, your DCT Abu Dhabi research assistant grounded in the official **DCT Exploratory Data Analysis Report (24 September 2026)**.\n\n` +
        `You can ask me to:\n` +
        `• **Explain report findings** (e.g., Guests vs. New Arrivals, seasonal European drops vs. Gulf summer surges)\n` +
        `• **Define aviation & hotel metrics** (e.g., P2P vs. Total PAX, Load Factor, Seat Occupancy)\n` +
        `• **Explain data-quality policies** (e.g., why missing observations are never zero, why Finnish data has summer gaps)\n` +
        `• **Clarify market-mapping** (e.g., why flight departure country differs from guest passport nationality)\n` +
        `• **Verify model status** (e.g., why Guest Nights and formal predictive scores remain later work)\n\n` +
        `Click any of the suggested prompts below to explore verified report findings.`,
      sourcePage: 1,
      limitation:
        'All answers strictly separate empirical evidence from interpretation and never invent unobserved figures.',
    };
  }
}
