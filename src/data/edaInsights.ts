export interface EdaInsight {
  id: string;
  title: string;
  category:
    | 'target-definition'
    | 'arrival-share'
    | 'seasonality'
    | 'data-coverage'
    | 'aviation-composition'
    | 'market-associations'
    | 'modelling-decisions';
  summary: string;
  evidence: string;
  limitation: string;
  businessMeaning: string;
  sourcePage: number;
  suggestedVisual: 'scatter' | 'boxplot' | 'heatmap' | 'line' | 'stacked-bar' | 'table' | 'flow';
  keyStats?: Record<string, string | number>;
}

export const EDA_INSIGHTS: EdaInsight[] = [
  {
    id: 'guests-vs-new-arrivals',
    title: 'Guests and New Arrivals Measure Different Things',
    category: 'target-definition',
    summary:
      'Hotel "Guests" (active in-house guest occupants on a given date) exceeded "New Arrivals" (new check-in registrations) across all 58,360 paired daily observations.',
    evidence:
      'In all 58,360 paired daily records from January 2022 to July 2025 across all recorded nationalities, Guests > New Arrivals with zero exceptions. The initial challenge starting point was Guests because it was withheld from the test set, but comparing the two made continuing stays part of the target discussion.',
    limitation:
      'The gap between Guests and New Arrivals is not a direct estimate of stay length. A larger gap can reflect longer stays, but the ratio alone cannot determine length of stay without individual guest folio tracking.',
    businessMeaning:
      'For airline capacity planning, new flight seats bring newly arriving check-ins to Abu Dhabi hotels, not the total stock of continuing guests already asleep in hotel rooms from previous days.',
    sourcePage: 1,
    suggestedVisual: 'scatter',
    keyStats: {
      pairedObservations: '58,360',
      exceedanceRate: '100%',
      observationPeriod: 'Jan 2022 – Jul 2025',
    },
  },
  {
    id: 'arrival-share-distribution',
    title: 'New Arrivals as a Share of Guests Varies Dramatically by Market',
    category: 'arrival-share',
    summary:
      'The median daily ratio of New Arrivals to recorded Guests varies from over 63% for short-haul Gulf markets to under 25% for long-haul Western markets.',
    evidence:
      'Oman recorded a median daily arrival share of 63.0% and Qatar 50.1%. Canada showed a much lower share at 24.5% (a larger gap between check-ins and recorded guests relative to guest count). China was also high at 42.2%, proving this is not exclusively a Gulf phenomenon.',
    limitation:
      'The ratio alone cannot establish stay length or isolate same-day visits. High arrival share can indicate short average stays, high turnover, or recurring weekend check-ins.',
    businessMeaning:
      'A flight carrying 200 passengers from Oman produces a much faster turnover of new hotel check-ins than a flight from Canada, where travelers stay multiple nights per single check-in.',
    sourcePage: 2,
    suggestedVisual: 'boxplot',
    keyStats: {
      omanMedianShare: '63.0%',
      qatarMedianShare: '50.1%',
      chinaMedianShare: '42.2%',
      saudiMedianShare: '40.9%',
      canadaMedianShare: '24.5%',
    },
  },
  {
    id: 'persistent-arrival-share-patterns',
    title: 'Arrival-Share Differences Persist Across Months',
    category: 'arrival-share',
    summary:
      'Monthly heatmap analysis demonstrates that arrival-share disparities are structural and persistent across all 45 recorded nationalities throughout 2022–2025.',
    evidence:
      'Full monthly heatmap across 45 nationalities shows consistent color bands: Gulf nationalities consistently display higher median daily shares (40–65%) while Western Europe and North America remain in the 18–28% range across all seasons.',
    limitation:
      'Persistence over time confirms genuine behavioral differences between source markets, but it does not resolve the mathematical relationship to average length of stay (ALOS).',
    businessMeaning:
      'Tourism planners should avoid applying a single global hotel conversion rule across all flight routes; source nationality fundamentally dictates check-in velocity.',
    sourcePage: 4,
    suggestedVisual: 'heatmap',
    keyStats: {
      nationalitiesAnalyzed: 45,
      consistency: 'Persistent 2022–2025',
    },
  },
  {
    id: 'market-seasonality-divergence',
    title: 'Seasonality Differs Substantially by Market',
    category: 'seasonality',
    summary:
      'European markets experience sharp summer drops in Abu Dhabi hotel arrivals, whereas major Gulf markets experience the exact opposite: summer peaks.',
    evidence:
      'Germany and France show recurring summer troughs (index falls below 50 in July–August relative to annual mean of 100). Conversely, Oman, Qatar, Kuwait, and Saudi Arabia show summer peaks (index reaching 180–250 in July–August). India shows milder seasonal variance with summer dips visible once normalized in 2023 and 2024.',
    limitation:
      'These profiles reflect differences in recorded hotel check-in patterns, not direct evidence of travelers’ motivation or overall vacation volume.',
    businessMeaning:
      'Flight capacity incentives must be counter-cyclical: airline marketing in Europe should focus on winter escapes (Nov–Mar), while GCC flight frequency should be bolstered for regional summer school holidays.',
    sourcePage: 6,
    suggestedVisual: 'line',
    keyStats: {
      europeanSummerIndex: '<50 (Trough)',
      gccSummerIndex: '180–250 (Peak)',
    },
  },
  {
    id: 'gulf-summer-driving-hypothesis',
    title: 'The Driving Hypothesis Does Not Fully Explain Gulf Summer Travel',
    category: 'seasonality',
    summary:
      'An exploratory check of weekday patterns failed to confirm that Gulf summer hotel peaks are driven primarily by weekend road trips.',
    evidence:
      'Thursday arrival spikes were actually clearer outside of summer in Gulf markets. Summer arrival patterns were dispersed throughout the week across Oman, Saudi Arabia, Kuwait, Bahrain, and Qatar.',
    limitation:
      'Hotel registration records collect nationality and check-in date, but do not record the passenger’s mode of transportation (air vs. road border crossing).',
    businessMeaning:
      'Planners cannot assume summer GCC visitors drive; air capacity from regional GCC capitals remains a vital contributor during summer peak months.',
    sourcePage: 8,
    suggestedVisual: 'line',
  },
  {
    id: 'missing-data-coverage-policy',
    title: 'Missing data must remain separate from low demand',
    category: 'data-coverage',
    summary:
      'Data gaps—such as missing calendar rows or unrecorded check-in fields—must be tracked as incomplete coverage, never imputed as zero hotel demand.',
    evidence:
      'In Finland’s data, missing observations clustered heavily in summer months (June–August 2022–2024), where check-ins were missing on days with recorded guests, or entire calendar rows were absent. An association screen requiring complete months retained only 15 of 50 possible months for Finland.',
    limitation:
      'Replacing missing values with zero would artificially depress summer demand estimates and bias seasonal indexes downwards.',
    businessMeaning:
      'When reviewing route performance, a blank or missing metric signifies unrecorded or withheld administrative data, not zero tourist interest.',
    sourcePage: 9,
    suggestedVisual: 'stacked-bar',
    keyStats: {
      finlandValidMonths: '15 of 50 retained',
      summerMissingCluster: 'Jun–Aug',
    },
  },
  {
    id: 'hotel-accounting-diagnostics',
    title: 'Hotel Accounting Diagnostic Reveals High Consistency with Few Exceptions',
    category: 'data-coverage',
    summary:
      'Testing whether daily guest increases (G_t - G_t-1) could be accounted for by that day’s New Arrivals revealed an exception rate of only 0.024%.',
    evidence:
      'Across 58,236 eligible consecutive-day comparisons, only 14 exceptions occurred where the daily guest count increased by more than that day’s recorded new arrivals. Eight of these 14 were minor discrepancies of 1–4 guests; only four exceeded 40 guests (Morocco, Egypt, Kazakhstan, Armenia).',
    limitation:
      'This diagnostic reflects internal consistency between DCT’s two hotel fields; it is an accounting sanity check rather than a ground-truth census validation.',
    businessMeaning:
      'The underlying hotel registration data has high mechanical fidelity; anomalous records are isolated and flagged without discarding valid market trends.',
    sourcePage: 10,
    suggestedVisual: 'table',
    keyStats: {
      eligibleComparisons: '58,236',
      totalExceptions: '14 (0.024%)',
      minorExcesses: '8 (1–4 guests)',
    },
  },
  {
    id: 'capacity-and-load-factor',
    title: 'Load Factor is Derived From Capacity and PAX, Not an Independent Demand Measure',
    category: 'aviation-composition',
    summary:
      'Aviation load factor is calculated mathematically as (Total PAX / Scheduled Seats) × 100. It measures capacity utilization rather than total latent tourism demand.',
    evidence:
      'Across all recorded AUH departure markets, monthly scheduled seats grew from ~400k in early 2022 to >1.2M in late 2025, with overall load factor stabilizing around 80–90%. In 2022, records were month-stamped; daily-dated flight records began only in 2023.',
    limitation:
      'A high load factor on a route does not reveal whether additional unserved demand exists (spill), nor does it indicate the final destination of those passengers.',
    businessMeaning:
      'Adding flight seats can induce new hotel arrivals even if current load factors are high, provided point-to-point tourist conversion remains efficient.',
    sourcePage: 11,
    suggestedVisual: 'line',
    keyStats: {
      auhSeatGrowth: '400k to >1.2M / mo',
      averageLoadFactor: '80%–90%',
      frequencyBreak: 'Month-stamped (2022) vs Daily (2023)',
    },
  },
  {
    id: 'p2p-vs-total-pax',
    title: 'P2P is a better aviation starting point than Total PAX',
    category: 'aviation-composition',
    summary:
      'Total passenger counts include connecting transit and transfer travelers who never leave Zayed International Airport. Point-to-Point (P2P) passengers are far more relevant for hotel demand, but are still not all hotel guests.',
    evidence:
      'Airport records confirm Total PAX = P2P + Transfer + Transit. Across AUH, transfer and transit traffic accounts for 40% to 55% of all arriving passengers. P2P passengers end their flight in Abu Dhabi, but also include returning UAE residents and people visiting friends/relatives who sleep at home.',
    limitation:
      'P2P isolates passengers deplaning into the emirate, but aviation datasets cannot distinguish an inbound hotel tourist from an expatriate resident returning from annual leave.',
    businessMeaning:
      'Never judge hotel potential based on Total PAX alone. An airline route with 90% transit share delivers far fewer hotel check-ins than a route with 80% P2P traffic.',
    sourcePage: 12,
    suggestedVisual: 'stacked-bar',
    keyStats: {
      transferTransitShare: '40%–55%',
      p2pShare: '45%–60%',
      formula: 'Total PAX = P2P + Transfer + Transit',
    },
  },
  {
    id: 'passenger-counts-above-seats',
    title: 'Passenger Counts Can Exceed Seat Capacity Due to Lap Infants and Aggregations',
    category: 'aviation-composition',
    summary:
      'A total of 9,896 flight records initially showed passenger counts exceeding scheduled seats; excluding non-seated lap infants resolved the majority of these flags.',
    evidence:
      'Excluding infants reduced the number of records with PAX > Seats from 9,896 down to 2,246 records. The remaining 2,246 records were retained and flagged for data governance.',
    limitation:
      'A record represents a departure-country/city/airline combination, which may aggregate multiple flights or aircraft swaps. Complete calendar date coverage does not guarantee complete route coverage.',
    businessMeaning:
      'Flight load factors exceeding 100% in raw extracts are often explainable by lap infants or operational aircraft upgrades rather than erroneous passenger reporting.',
    sourcePage: 13,
    suggestedVisual: 'line',
    keyStats: {
      rawExcessRecords: '9,896',
      postInfantExcessRecords: '2,246',
      resolutionRate: '77.3% explained by infants',
    },
  },
  {
    id: 'raw-vs-adjusted-correlations',
    title: 'Raw correlations can weaken after adjustment',
    category: 'market-associations',
    summary:
      'High raw correlations between flight routes and hotel nationalities often disappear once shared seasonal trends, macroeconomic growth, and global airport volume are controlled for.',
    evidence:
      'When adjusting for month-of-year, linear time trend, and other-origin airport P2P: Canada flights to Russian hotel check-ins dropped from r = 0.88 down to r = -0.01; UK flights to Qatar check-ins dropped from r = 0.75 down to r = 0.10; Japan flights to Qatar check-ins dropped from r = 0.76 down to r = 0.08. Conversely, Czechia–Poland remained strong (0.75 raw vs. 0.70 adjusted), Mexico–Qatar strengthened (0.34 to 0.56), and Pakistan–China flipped from -0.25 to +0.61.',
    limitation:
      'Adjusted correlation measures co-movement after removing common background cycles; it is an exploratory association, not proof of individual passenger itineraries.',
    businessMeaning:
      'Do not assume high correlation between a flight and a nationality proves passengers are using that flight. Without controlling for seasonal co-movement, decisions will misattribute tourist arrivals.',
    sourcePage: 14,
    suggestedVisual: 'heatmap',
    keyStats: {
      canadaRussiaDrop: '0.88 → -0.01',
      ukQatarDrop: '0.75 → 0.10',
      czechiaPolandStable: '0.75 → 0.70',
    },
  },
  {
    id: 'departure-country-vs-nationality',
    title: 'Flight origin and hotel nationality are different concepts',
    category: 'market-associations',
    summary:
      'Matching departure country is not always the closest statistical association for hotel arrivals; travelers frequently transit through third-country hubs or hold passports different from their flight origin.',
    evidence:
      'Japanese and South Korean hotel check-ins in Abu Dhabi tracked UK flight departures more closely (adjusted r = 0.65 and 0.67) than direct matching country flights. Furthermore, out of 45 nationalities, 15 nationalities had absent matching-country direct flight series.',
    limitation:
      'Statistical correlation with a third-country departure does not prove travelers flew that itinerary. These are candidate associations that require out-of-sample temporal backtesting.',
    businessMeaning:
      'AeroStay distinguishes between flight departure country, hotel guest nationality, and modelled source market. Investing in a London or Frankfurt flight route may boost Asian or North American hotel arrivals via airline connectivity.',
    sourcePage: 16,
    suggestedVisual: 'scatter',
    keyStats: {
      japanUKAssociation: 'r = 0.65',
      southKoreaUKAssociation: 'r = 0.67',
      missingDirectRoutes: '15 of 45 nationalities',
    },
  },
  {
    id: 'airline-detail-complexities',
    title: 'Airline Detail Yields Exploratory Associations, Not Verified Travel Flows',
    category: 'market-associations',
    summary:
      'Analyzing flight volume by specific airline (e.g., Air Arabia Abu Dhabi vs. Etihad Airways vs. Gulf Air from Bahrain) produces diverging statistical associations that cannot be assumed to represent passenger itineraries.',
    evidence:
      'In Bahrain departures versus Armenian check-ins: Air Arabia AD showed adjusted r = 0.63, while Etihad showed adjusted r = -0.54 in the same 33-month window. Across all countries, only 59 country-airline combinations had sufficient data for a calculable comparison, while 69 had too few recorded months and 5 had zero post-adjustment.',
    limitation:
      'Airline-level regressions reflect fleet schedule changes and carrier network shifts. "Calculable" does not mean statistically significant.',
    businessMeaning:
      'Airline-specific data should be treated as candidate exploratory features for machine learning, not definitive evidence of which airline specific nationalities prefer.',
    sourcePage: 17,
    suggestedVisual: 'scatter',
    keyStats: {
      airArabiaAdjusted: 'r = +0.63',
      etihadAdjusted: 'r = -0.54',
      calculableAirlineCombos: '59 of 133 evaluated',
    },
  },
  {
    id: 'first-model-decisions',
    title: 'First Planned Model: Monthly New Arrivals, Pooled Across Nationalities',
    category: 'modelling-decisions',
    summary:
      'The initial machine learning model is designed around monthly New Arrivals (new check-in registrations) pooled across all nationalities, with one observation representing one nationality and month.',
    evidence:
      'The EDA report explicitly decided: (1) One observation per nationality and month; (2) Target = total recorded new hotel check-ins in that month; (3) One pooled model across nationalities; (4) Retrainable architecture allowing regression baseline to be benchmarked against XGBoost.',
    limitation:
      'No predictive model has been trained or evaluated in this report. Full-history EDA informs the feature design; model validation must follow strict chronological holdout splits.',
    businessMeaning:
      'The platform operates in EDA Mode because predictive weights and accuracy benchmarks have not yet been evaluated on an out-of-sample validation period.',
    sourcePage: 19,
    suggestedVisual: 'flow',
    keyStats: {
      targetMetric: 'Monthly New Hotel Arrivals',
      unitOfObservation: '1 Nationality × 1 Month',
      modelStatus: 'Architecture Defined; Training Pending',
    },
  },
  {
    id: 'guest-nights-pending-status',
    title: 'Hotel Guest Nights Remains Later Work (Pending Stay-Duration Component)',
    category: 'modelling-decisions',
    summary:
      'Guest-night forecasting requires defensible stay duration data, overnight participation rates, and month-boundary allocation rules that are not yet established.',
    evidence:
      'The report notes: "Aviation and calendar inputs -> Predicted hotel check-ins -> Guest-night component. The guest-night component remains later work: stay duration, overnight participation and month boundaries need defensible data or explicit assumptions."',
    limitation:
      'Any display of confirmed guest-night totals or room revenue projections would be an unsupported extrapolation.',
    businessMeaning:
      'AeroStay explicitly displays "Guest Nights — not yet supported" to maintain analytical rigor and prevent false precision in policy commitments.',
    sourcePage: 19,
    suggestedVisual: 'flow',
    keyStats: {
      componentStatus: 'Pending',
      prerequisites: 'Stay duration, overnight participation, month boundary rules',
    },
  },
];
