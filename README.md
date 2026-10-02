# SILA | صِلَة
### Flight-to-Hotel Decision Intelligence
**منصة ذكاء ربط الرحلات بالطلب الفندقي**

> *“From flights to stays. From data to decisions.”*  
> *“من الرحلات إلى الإقامات، ومن البيانات إلى القرار”*

---

## 1. Product Overview
**SILA** (meaning *connection* or *link* in Arabic) is an explainable scenario-planning platform that helps the Department of Culture and Tourism (DCT) explore how changes in airline capacity, passenger movement, source markets, and seasonality could affect hotel demand in Abu Dhabi.

The platform bridges the analytical gap between aviation operations at Zayed International Airport (AUH) and commercial hotel check-ins across the emirate.

---

## 2. Core Modules
1. **SILA Scenario Planner** (`Scenario Planner`)  
   Interactive what-if studio to simulate flight frequency additions, seat capacity changes, and passenger load factor shifts, observing conversion through the 5-stage funnel into monthly new hotel arrivals.
2. **SILA Market & Season Insights** (`Market & Season Insights`)  
   Exploratory data analysis across 45 visitor nationalities and 33 departure markets, highlighting European summer troughs vs. Gulf summer surges, check-in velocity, and data coverage.
3. **SILA Opportunity Comparison** (`Compare Opportunities`)  
   Side-by-side evaluation of up to 3 strategic aviation scenarios across added seats, predicted hotel arrivals, evidence reliability, and core uncertainties.
4. **SILA Trust Centre** (`Trust, Data & Assumptions`)  
   Methodological transparency, assumption registers, Finnish summer missingness audits, 2022 vs. 2023 reporting granularity breaks, and non-zero imputation policies.
5. **Ask SILA | اسأل صِلَة**  
   Embedded conversational assistant grounded in the official DCT Exploratory Data Analysis report (`DCT_EDA_Report.pdf`, 24 September 2026).

---

## 3. Data Governance & Mode
- **Current Mode**: `EDA MODE`
- **Current Analytical Focus**: Monthly New Hotel Arrivals by nationality
- **Status Banner**: *“EDA MODE — Current analytical focus: Monthly New Hotel Arrivals by nationality. Predictive model validation is still pending.”*
- **Model Status**: `Model not yet trained` (predictive holdout validation is pending)
- **Guest-Night Status**: `Guest Nights — not yet supported` (stay-duration component pending)

---

## 4. Local Storage Configuration
SILA automatically migrates legacy browser storage keys to its modern namespaced schema:
- `sila_saved_scenarios`: Saved comparison scenarios (max 3)
- `sila_user_preferences`: User display preferences and modal dismissal flags
- `sila_recent_markets`: Recently evaluated flight corridors and source markets
- `sila_chat_history`: Historical queries and grounded citations in Ask SILA
