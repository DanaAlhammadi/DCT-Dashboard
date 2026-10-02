export interface ReportKnowledgeItem {
  id: string;
  question: string;
  answer: string;
  limitation: string;
  sourceDocument: string;
  sourcePage: number;
  keywords: string[];
}

export const REPORT_KNOWLEDGE_BASE: ReportKnowledgeItem[] = [
  {
    id: 'guests-vs-new-arrivals',
    question: 'What is the difference between Guests and New Arrivals?',
    answer:
      'In DCT hotel records, "Guests" and "New Arrivals" measure two distinct stages of hotel occupancy. "Guests" represents active in-house hotel occupants on a given date (including continuing guests from previous nights), while "New Arrivals" represents newly registered check-ins on that date. In all 58,360 paired daily observations from January 2022 to July 2025, recorded Guests exceeded New Arrivals with zero exceptions.',
    limitation:
      'The gap between Guests and New Arrivals is not a direct estimate of stay length. While a larger gap typically correlates with longer stays, the ratio alone cannot establish average length of stay (ALOS) or identify same-day visits.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 1,
    keywords: [
      'guests',
      'new arrivals',
      'check-ins',
      'difference',
      'occupancy',
      'definitions',
      'target',
    ],
  },
  {
    id: 'why-new-arrivals-target',
    question: 'Why is New Arrivals the current modelling target?',
    answer:
      'The first planned predictive model targets "Monthly New Hotel Arrivals" (new check-in registrations) pooled across nationalities. When airlines add flight seats or introduce new routes, those flights deliver newly arriving passengers who generate new hotel check-ins. Focusing on New Arrivals directly connects flight arrivals to new commercial demand, rather than modeling continuing guests who were already counted upon arrival in previous days.',
    limitation:
      'No predictive model has been trained or evaluated yet in this report. This reflects the planned architectural design, with one observation per nationality and month.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 19,
    keywords: [
      'target',
      'modelling target',
      'new arrivals',
      'why new arrivals',
      'modelling decision',
      'first model',
    ],
  },
  {
    id: 'what-is-p2p',
    question: 'What is P2P?',
    answer:
      'P2P stands for "Point-to-Point" passengers. It refers to flight passengers whose air journey ends at Zayed International Airport (AUH) in Abu Dhabi, rather than transferring to another connecting flight or stopping in brief transit. Mathematically in airport records: Total PAX = P2P + Transfer + Transit.',
    limitation:
      'P2P passengers deplane into the emirate, but they are not all commercial hotel guests; they include returning UAE citizens, expatriate residents, and visitors staying with family or friends.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 12,
    keywords: [
      'p2p',
      'point to point',
      'definition',
      'aviation',
      'transfers',
      'passengers',
      'what is p2p',
    ],
  },
  {
    id: 'why-p2p-more-useful-than-total-pax',
    question: 'Why is P2P more useful than Total PAX?',
    answer:
      'Total PAX includes connecting transfer and transit passengers who remain airside inside Zayed International Airport and fly onward to other worldwide destinations. Between 40% and 55% of all arriving passengers at AUH are connecting travelers. Because transit passengers do not enter the city or stay in Abu Dhabi hotels, analyzing Total PAX would heavily distort tourism conversion. P2P isolates the actual passenger stream ending their flight in Abu Dhabi.',
    limitation:
      'While P2P is far more relevant than Total PAX for local hotel demand, P2P still contains returning residents and friends/relatives visitors who do not book commercial hotels.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 12,
    keywords: [
      'p2p vs total pax',
      'why p2p',
      'total pax',
      'connecting passengers',
      'transits',
      'more useful',
    ],
  },
  {
    id: 'why-p2p-not-equal-to-hotel-guests',
    question: 'Why is P2P not equal to hotel guests?',
    answer:
      'P2P passengers end their flight in Abu Dhabi, but they are not all hotel tourists. A significant proportion of arriving P2P passengers are UAE citizens and expatriate residents returning from holidays or business trips who go directly to their private residences. Additionally, tourists visiting friends and relatives (VFR) often sleep in private accommodations rather than licensed commercial hotels.',
    limitation:
      'Airport flight manifests record passport country or origin city, but do not record whether a traveler owns a home in Abu Dhabi or holds a commercial hotel booking.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 12,
    keywords: [
      'p2p not equal to hotel guests',
      'residents',
      'vfr',
      'leakage',
      'private residences',
      'conversion',
    ],
  },
  {
    id: 'why-missing-values-not-zero',
    question: 'Why must missing values not become zero?',
    answer:
      'In observational data, a missing observation (e.g., an absent calendar row or an unrecorded check-in field) indicates that administrative data was not collected, unrecorded, or suppressed for that period. It does NOT mean that zero tourists arrived or that hotel demand was zero. Converting missing data into numeric zeros would severely distort statistical averages, artificially depress summer demand profiles, and bias predictive features.',
    limitation:
      'Handling missing data requires keeping coverage indicators strictly separate from demand calculations (e.g., flagging complete months vs. incomplete months).',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 9,
    keywords: [
      'missing values',
      'zero',
      'missing not zero',
      'missing data policy',
      'data coverage',
      'finland',
    ],
  },
  {
    id: 'why-load-factor-exceeds-100',
    question: 'Why can load factor exceed 100%?',
    answer:
      'Passenger load factor is calculated as (Total PAX / Scheduled Seats) × 100. In the raw dataset, 9,896 records showed passenger counts exceeding seat capacity. This occurs primarily because non-seated lap infants (children under 2 years old who do not occupy an airline seat) are counted in passenger manifests. Excluding infants reduced the flagged excess records by 77.3% (from 9,896 down to 2,246 records). Remaining excesses often reflect aircraft upgauges (swapping to a larger plane) or record aggregation.',
    limitation:
      'Load factor is a derived operational measure of capacity utilization, not an independent direct measurement of latent travel demand.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 11,
    keywords: [
      'load factor',
      'exceed 100',
      'infants',
      'seats',
      'capacity',
      'pax above seats',
      'aircraft swap',
    ],
  },
  {
    id: 'what-is-adjusted-association',
    question: 'What is an adjusted association?',
    answer:
      'An adjusted association (or adjusted correlation) measures the statistical co-movement between flight passenger volumes and hotel check-ins after removing common confounding factors: specifically, fitted month-of-year seasonal cycles, linear time trends, and overall airport point-to-point traffic from other origins. It reveals whether fluctuations in a specific route coincide with arrivals from a specific nationality beyond what is explained by general holiday seasons and overall travel growth.',
    limitation:
      'Adjusted correlation is an exploratory statistical association; it does NOT prove that passengers on that flight actually checked into Abu Dhabi hotels, nor does it establish an individual itinerary flow.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 14,
    keywords: [
      'adjusted association',
      'adjusted correlation',
      'raw correlation',
      'seasonality adjustment',
      'statistical adjustment',
    ],
  },
  {
    id: 'departure-country-vs-nationality',
    question: 'Can departure country identify guest nationality?',
    answer:
      'No. Flight departure country records where the aircraft took off, whereas hotel nationality records the passport of the guest checking in. The report proved that matching departure country is often NOT the closest statistical association for hotel arrivals. For example, Japanese and South Korean hotel check-ins in Abu Dhabi tracked UK flight departures more closely (adjusted r = 0.65 and 0.67) than direct flights from East Asia. Furthermore, 15 of 45 analyzed nationalities had no direct matching-country flight service to AUH.',
    limitation:
      'Tracking third-country flight departures does not prove travelers flew that specific route; these are candidate exploratory associations for machine learning feature testing.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 16,
    keywords: [
      'departure country',
      'nationality',
      'flight origin',
      'passport',
      'japan',
      'korea',
      'market mapping',
    ],
  },
  {
    id: 'is-prediction-model-trained',
    question: 'Is the prediction model already trained?',
    answer:
      'No. As clearly stated throughout the EDA report: "No predictive model has been trained or evaluated in this report." The current application is operating in "EDA MODE". The report represents exploratory data analysis and feature architecture design. Machine learning models (such as regularized regressions and XGBoost) and formal out-of-sample holdout validation will be conducted in subsequent phases.',
    limitation:
      'No trained model weights, backtest evaluations, or confirmed predictive forecasts currently exist. Any scenario projections shown in the planner are illustrative conversions derived from empirical funnel ratios.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 19,
    keywords: [
      'model trained',
      'is model trained',
      'predictive model',
      'validation',
      'eda mode',
      'xgboost',
      'backtest',
    ],
  },
  {
    id: 'are-guest-nights-available',
    question: 'Are Guest Nights available?',
    answer:
      'No. Guest Nights are marked as: "Guest Nights — not yet supported (stay-duration component pending)." The report explicitly concluded that the guest-night component remains later work because stay duration, overnight participation, and month-boundary allocation rules require defensible empirical data or explicit validated assumptions before they can be responsibly forecasted.',
    limitation:
      'Displaying speculative guest night numbers or hotel room revenue estimates would violate data integrity principles established in the EDA report.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 19,
    keywords: [
      'guest nights',
      'nights available',
      'alos',
      'stay duration',
      'room nights',
      'not yet supported',
    ],
  },
  {
    id: 'what-does-incomplete-month-mean',
    question: 'What does incomplete month mean?',
    answer:
      'An "incomplete month" is a calendar month where one or more days lack recorded observations (either missing rows or missing fields such as unrecorded check-in counts). In seasonal charts, incomplete months are flagged with hollow circle markers. Normalizing an incomplete month by its observed days can prevent missing data from creating an artificial downward spike, but it does not fully replace genuine full-month data.',
    limitation:
      'For association analysis, the report screened out incomplete months (for instance, retaining only 15 of 50 possible months for Finland). Incomplete months must never be imputed as zero demand.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 6,
    keywords: [
      'incomplete month',
      'hollow marker',
      'missing days',
      'data coverage',
      'screening',
    ],
  },
  {
    id: 'market-seasonality-reliability',
    question: 'Is this market’s seasonal pattern reliable?',
    answer:
      'Seasonal reliability depends heavily on the specific market and historical data consistency. European markets (such as Germany and France) exhibit highly stable, recurring annual profiles with pronounced summer troughs (July–August). Major Gulf markets (Oman, Saudi Arabia, Kuwait, Qatar) exhibit recurring summer peaks. However, markets with geopolitical shocks (like Israel post-October 2023) or severe summer data gaps (like Finland with only 15 complete months) cannot be characterized by a single simple seasonal profile.',
    limitation:
      'Seasonal curves reflect historical check-ins across 2022–2024. Future geopolitical, macroeconomic, or flight frequency changes may shift historical seasonal timing.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 6,
    keywords: [
      'seasonal pattern',
      'reliable',
      'seasonality',
      'is seasonality reliable',
      'europe vs gcc',
      'israel',
      'finland',
    ],
  },
  {
    id: 'why-reporting-frequency-matters',
    question: 'Why does the 2022 to 2023 reporting-frequency change matter?',
    answer:
      'In airport traffic data, flight records throughout calendar year 2022 were aggregated and month-stamped in source records. Daily-dated flight and passenger records began only in January 2023. Comparing 2022 against 2023 requires caution because day-of-week and week-of-month analyses cannot be calculated on 2022 data, and year-on-year comparisons cross a structural granularity boundary.',
    limitation:
      'Year-on-year calculations crossing the January 2023 boundary are marked with hatched shading in the research report to flag the change in underlying data granularity.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 11,
    keywords: [
      'reporting frequency',
      '2022 vs 2023',
      'granularity',
      'daily vs monthly',
      'frequency change',
    ],
  },
  {
    id: 'what-data-is-still-missing',
    question: 'What data is still missing?',
    answer:
      'Key data components identified in the EDA report as missing or pending include: (1) Validated length of stay / stay duration to support Guest Nights; (2) Transportation mode identifier for GCC border arrivals (air vs. road border driving); (3) True origin-and-destination (O&D) ticketed itineraries connecting flight origin to guest nationality; (4) Formal train/test temporal holdout split partitions for predictive evaluation; and (5) Consistent reporting for Same-Day Guests, which currently has substantial missingness.',
    limitation:
      'The platform maintains transparent governance registers to ensure planners know which insights are directly observed versus where data remains incomplete.',
    sourceDocument: 'DCT_EDA_Report.pdf (24 September 2026)',
    sourcePage: 18,
    keywords: [
      'what data is missing',
      'missing data',
      'pending data',
      'limitations',
      'same day guests',
      'transport mode',
    ],
  },
];
