import { ScenarioResult, RouteInfo, BaselineFlightData } from '../types';

export function exportScenarioToCSV(result: ScenarioResult, route: RouteInfo, baseline: BaselineFlightData): void {
  const lines: string[] = [];

  // Header section
  lines.push('AEROSTAY ABU DHABI - FLIGHT-TO-HOTEL DECISION STUDIO');
  lines.push(`Scenario Name,"${result.input.scenarioName}"`);
  lines.push(`Export Timestamp,"${new Date().toISOString()}"`);
  lines.push(`Route,"${route.routeCode} (${route.departureCity}, ${route.departureCountry} to Abu Dhabi AUH)"`);
  lines.push(`Modelled Source Market,"${route.modelledSourceMarket}"`);
  lines.push(`Timeframe,"${result.input.startMonth} to ${result.input.endMonth}"`);
  lines.push(`Historical Support Level,"${result.supportLevel}"`);
  lines.push('');

  // Conversion Chain Table
  lines.push('CONVERSION CHAIN STAGES');
  lines.push('Stage,Status,Baseline Value,Scenario Value,Absolute Change,Percent Change,Unit,Formula');
  result.conversionStages.forEach(stage => {
    lines.push(
      `"${stage.name}","${stage.status}",${stage.baselineValue},${stage.scenarioValue},${stage.changeValue},${stage.percentChange.toFixed(1)}%,"${stage.unit}","${stage.formula}"`
    );
  });
  lines.push('');

  // Monthly Breakdown
  lines.push('MONTHLY IMPACT FORECAST');
  lines.push('Month,Baseline Seats,Scenario Seats,Baseline Guests,Scenario Guests,Additional Guests,Confidence Min,Confidence Max,Baseline Guest Nights,Scenario Guest Nights,Event');
  result.monthlyBreakdown.forEach(m => {
    lines.push(
      `"${m.month}",${m.baselineSeats},${m.scenarioSeats},${m.baselineGuests},${m.scenarioGuests},${m.scenarioGuests - m.baselineGuests},${m.confidenceMin},${m.confidenceMax},${m.baselineNights},${m.scenarioNights},"${m.eventName || 'None'}"`
    );
  });
  lines.push('');

  // Decision Summary
  lines.push('EXECUTIVE DECISION SUMMARY');
  lines.push(`Expected Impact,"${result.decisionSummary.expectedImpact.replace(/"/g, '""')}"`);
  lines.push(`Main Reason,"${result.decisionSummary.mainReason.replace(/"/g, '""')}"`);
  lines.push(`Main Uncertainty,"${result.decisionSummary.mainUncertainty.replace(/"/g, '""')}"`);
  lines.push(`Recommended Next Action,"${result.decisionSummary.recommendedAction.replace(/"/g, '""')}"`);

  // Download trigger
  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `AeroStay_Scenario_${result.input.routeId}_${result.input.startMonth}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportScenarioToJSON(result: ScenarioResult, route: RouteInfo, baseline: BaselineFlightData): void {
  const exportData = {
    metadata: {
      application: 'AeroStay Abu Dhabi',
      subtitle: 'Flight-to-Hotel Decision Studio',
      exportDate: new Date().toISOString(),
      modelVersion: 'v2.4-AeroStay-Hybrid',
      disclaimer: 'Illustrative demo values — not official DCT results.',
    },
    route,
    baseline,
    scenarioResult: result,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `AeroStay_Scenario_${result.input.routeId}_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
