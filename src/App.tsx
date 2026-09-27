import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, AppHeader } from './components/common/AppHeader';
import { WelcomeModal } from './components/common/WelcomeModal';
import { GlossaryDrawer } from './components/common/GlossaryDrawer';
import { DecisionBriefModal } from './components/export/DecisionBriefModal';
import { DecisionTypeSelector } from './components/planner/DecisionTypeSelector';
import { BaselineSelector } from './components/planner/BaselineSelector';
import { ScenarioControls } from './components/planner/ScenarioControls';
import { AdvancedAssumptions } from './components/planner/AdvancedAssumptions';
import { ValidationPanel } from './components/planner/ValidationPanel';
import { KPIGrid } from './components/planner/KPIGrid';
import { SupportStatusBanner } from './components/common/SupportStatusBanner';
import { ConversionChain } from './components/planner/ConversionChain';
import { BaselineScenarioChart } from './components/planner/BaselineScenarioChart';
import { MonthlyImpactChart } from './components/planner/MonthlyImpactChart';
import { DecisionSummary } from './components/planner/DecisionSummary';
import { WarningsPanel } from './components/planner/WarningsPanel';
import { MarketInsightsTab } from './components/insights/MarketInsightsTab';
import { CompareOpportunitiesTab } from './components/compare/CompareOpportunitiesTab';
import { TrustDataTab } from './components/trust/TrustDataTab';

import { 
  MOCK_ROUTES, 
  MOCK_BASELINES, 
  INITIAL_SAVED_SCENARIOS 
} from './data/mockData';
import { 
  ScenarioInput, 
  BaselineFlightData, 
  RouteInfo, 
  ScenarioResult, 
  SavedScenario, 
  DecisionType 
} from './types';
import { validateScenario } from './services/validationService';
import { runSimulation } from './services/simulationService';
import { 
  Play, 
  RotateCcw, 
  Bookmark, 
  Check, 
  Layers, 
  ArrowRight, 
  Info, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'aerostay_saved_scenarios_v1';
const WELCOME_SEEN_KEY = 'aerostay_welcome_seen_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('DEL-AUH');

  // Scenario Input State (Defaulting to India +2 Weekly flights example)
  const [scenarioInput, setScenarioInput] = useState<ScenarioInput>({
    scenarioName: 'India: +2 Weekly Flights (DEL/BOM)',
    routeId: 'DEL-AUH',
    decisionType: 'CHANGE_FREQUENCY',
    routeStatus: 'EXISTING',
    startMonth: '2027-01',
    endMonth: '2027-03',
    seatCapacityChange: 2800,
    useCustomLoadFactor: false,
    customLoadFactor: null,
    assumedWeeklyFrequencyChange: 2,
  });

  // UI Modals & Drawers
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isDecisionBriefOpen, setIsDecisionBriefOpen] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Saved Scenarios in localStorage
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read localStorage:', e);
    }
    return INITIAL_SAVED_SCENARIOS;
  });

  // Check if first-time user
  useEffect(() => {
    try {
      const seen = localStorage.getItem(WELCOME_SEEN_KEY);
      if (!seen) {
        setIsWelcomeOpen(true);
      }
    } catch (e) {
      setIsWelcomeOpen(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch (e) {}
  };

  // Selected route and baseline
  const selectedRoute = useMemo<RouteInfo>(() => {
    return MOCK_ROUTES.find((r) => r.id === selectedRouteId) || MOCK_ROUTES[0];
  }, [selectedRouteId]);

  const currentBaseline = useMemo<BaselineFlightData>(() => {
    return MOCK_BASELINES[selectedRouteId] || MOCK_BASELINES['DEL-AUH'];
  }, [selectedRouteId]);

  // Validation
  const validation = useMemo(() => {
    return validateScenario(scenarioInput, currentBaseline, selectedRoute);
  }, [scenarioInput, currentBaseline, selectedRoute]);

  // Simulation Result State
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult>(() => {
    const initBaseline = MOCK_BASELINES['DEL-AUH'];
    const initRoute = MOCK_ROUTES[0];
    const initInput: ScenarioInput = {
      scenarioName: 'India: +2 Weekly Flights (DEL/BOM)',
      routeId: 'DEL-AUH',
      decisionType: 'CHANGE_FREQUENCY',
      routeStatus: 'EXISTING',
      startMonth: '2027-01',
      endMonth: '2027-03',
      seatCapacityChange: 2800,
      useCustomLoadFactor: false,
      customLoadFactor: null,
      assumedWeeklyFrequencyChange: 2,
    };
    return runSimulation(initInput, initBaseline, initRoute);
  });

  // Update input when route changes
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    const r = MOCK_ROUTES.find((item) => item.id === routeId);
    const b = MOCK_BASELINES[routeId];
    if (r && b) {
      setScenarioInput((prev) => ({
        ...prev,
        routeId,
        scenarioName: `${r.departureCountry}: Custom Scenario`,
        routeStatus: r.isExisting ? 'EXISTING' : 'NEW_ROUTE',
        seatCapacityChange: r.isExisting ? 2000 : 2400,
        useCustomLoadFactor: false,
        customLoadFactor: null,
        assumedWeeklyFrequencyChange: r.isExisting ? null : 3,
      }));
    }
  };

  const handleInputUpdate = (updated: Partial<ScenarioInput>) => {
    setScenarioInput((prev) => ({ ...prev, ...updated }));
  };

  // Run Simulation Action with Realistic Loading
  const handleRunScenario = () => {
    if (!validation.isValid) return;

    setIsCalculating(true);
    setTimeout(() => {
      const res = runSimulation(scenarioInput, currentBaseline, selectedRoute);
      setScenarioResult(res);
      setIsCalculating(false);
    }, 450);
  };

  // Reset to Baseline
  const handleResetToBaseline = () => {
    setScenarioInput({
      scenarioName: `${selectedRoute.departureCountry}: Baseline Reset`,
      routeId: selectedRoute.id,
      decisionType: 'CHANGE_CAPACITY',
      routeStatus: selectedRoute.isExisting ? 'EXISTING' : 'NEW_ROUTE',
      startMonth: '2027-01',
      endMonth: '2027-03',
      seatCapacityChange: 0,
      useCustomLoadFactor: false,
      customLoadFactor: null,
      assumedWeeklyFrequencyChange: null,
      transferShareOverride: null,
      transitShareOverride: null,
      visitorShareOverride: null,
      hotelCaptureRateOverride: null,
      alosOverride: null,
    });
  };

  // Save Scenario Action
  const handleSaveScenario = () => {
    if (!scenarioResult) return;

    const newSaved: SavedScenario = {
      id: 'scen-' + Date.now(),
      name: scenarioInput.scenarioName || `${selectedRoute.departureCity} ${scenarioResult.totalSeats.diff >= 0 ? '+' : ''}${scenarioResult.totalSeats.diff} Seats`,
      savedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      routeLabel: `${selectedRoute.routeCode} (${selectedRoute.departureCountry})`,
      marketLabel: selectedRoute.modelledSourceMarket,
      dateRange: `${scenarioInput.startMonth} to ${scenarioInput.endMonth}`,
      addedSeats: scenarioResult.totalSeats.diff,
      addedGuests: scenarioResult.hotelGuests.diff,
      addedNights: scenarioResult.guestNights.diff,
      guestsPer1kSeats: scenarioResult.guestsPer1kSeats.scenario,
      confidenceScore: scenarioResult.confidenceScore,
      supportLevel: scenarioResult.supportLevel,
      mainUncertainty: scenarioResult.decisionSummary.mainUncertainty,
      badges: [
        scenarioResult.supportLevel === 'SUPPORTED' ? 'Supported by history' : 'Exploratory analogue',
        `${scenarioResult.guestsPer1kSeats.scenario} guests/1k seats`,
      ],
      input: { ...scenarioInput },
      result: scenarioResult,
    };

    const updated = [newSaved, ...savedScenarios].slice(0, 8); // Keep up to 8
    setSavedScenarios(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    setSaveSuccessMsg('Scenario saved to portfolio');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Presets Handler
  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'india_freq') {
      handleSelectRoute('DEL-AUH');
      setScenarioInput({
        scenarioName: 'India: +2 Weekly Flights (DEL/BOM)',
        routeId: 'DEL-AUH',
        decisionType: 'CHANGE_FREQUENCY',
        routeStatus: 'EXISTING',
        startMonth: '2027-01',
        endMonth: '2027-03',
        seatCapacityChange: 2800,
        useCustomLoadFactor: false,
        customLoadFactor: null,
        assumedWeeklyFrequencyChange: 2,
      });
    } else if (presetKey === 'lf_85') {
      setScenarioInput((prev) => ({
        ...prev,
        scenarioName: `${selectedRoute.departureCountry}: 85% Load Factor Target`,
        decisionType: 'TEST_LOAD_FACTOR',
        useCustomLoadFactor: true,
        customLoadFactor: 0.85,
      }));
    } else if (presetKey === 'japan_new') {
      handleSelectRoute('HND-AUH');
      setScenarioInput({
        scenarioName: 'Japan: New Direct Route (Tokyo HND)',
        routeId: 'HND-AUH',
        decisionType: 'NEW_ROUTE',
        routeStatus: 'NEW_ROUTE',
        startMonth: '2027-01',
        endMonth: '2027-03',
        seatCapacityChange: 2400,
        useCustomLoadFactor: true,
        customLoadFactor: 0.75,
        assumedWeeklyFrequencyChange: 3,
      });
    } else if (presetKey === 'route_loss') {
      setScenarioInput((prev) => ({
        ...prev,
        scenarioName: `${selectedRoute.departureCountry}: Frequency Reduction`,
        decisionType: 'ASSESS_ROUTE_LOSS',
        seatCapacityChange: -Math.round(currentBaseline.totalSeats * 0.35),
        assumedWeeklyFrequencyChange: -2,
      }));
    }
  };

  const handleLoadSavedScenario = (scen: SavedScenario) => {
    setSelectedRouteId(scen.input.routeId);
    setScenarioInput({ ...scen.input });
    if (scen.result) {
      setScenarioResult(scen.result);
    } else {
      const b = MOCK_BASELINES[scen.input.routeId] || currentBaseline;
      const r = MOCK_ROUTES.find((item) => item.id === scen.input.routeId) || selectedRoute;
      setScenarioResult(runSimulation(scen.input, b, r));
    }
    setActiveTab('planner');
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id);
    setSavedScenarios(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDuplicateSaved = (scen: SavedScenario) => {
    const duplicated: SavedScenario = {
      ...scen,
      id: 'scen-' + Date.now(),
      name: `${scen.name} (Copy)`,
      savedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [duplicated, ...savedScenarios].slice(0, 8);
    setSavedScenarios(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white" id="aerostay-app-root">
      {/* Global Header */}
      <AppHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedScenarios.length}
        onOpenSaved={() => setActiveTab('compare')}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onExportBrief={() => setIsDecisionBriefOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Scenario Planner */}
        {activeTab === 'planner' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Step 1: Planning Question Cards */}
            <DecisionTypeSelector
              selectedType={scenarioInput.decisionType}
              onSelectType={(type) => {
                setScenarioInput((prev) => ({ ...prev, decisionType: type }));
                if (type === 'NEW_ROUTE') {
                  handleSelectRoute('HND-AUH');
                } else if (type === 'TEST_LOAD_FACTOR') {
                  handleApplyPreset('lf_85');
                } else if (type === 'ASSESS_ROUTE_LOSS') {
                  handleApplyPreset('route_loss');
                }
              }}
            />

            {/* Calm Two-Column Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Setup & Inputs (5 Cols on LG) */}
              <div className="lg:col-span-5 space-y-5" id="planner-inputs-column">
                {/* Section A: Select the Baseline */}
                <BaselineSelector
                  routes={MOCK_ROUTES}
                  selectedRoute={selectedRoute}
                  baseline={currentBaseline}
                  onSelectRoute={handleSelectRoute}
                />

                {/* Section B: Define the Change */}
                <ScenarioControls
                  input={scenarioInput}
                  baseline={currentBaseline}
                  route={selectedRoute}
                  onChangeInput={handleInputUpdate}
                  onApplyPreset={handleApplyPreset}
                />

                {/* Section C: Advanced Assumptions */}
                <AdvancedAssumptions
                  input={scenarioInput}
                  baseline={currentBaseline}
                  onChangeInput={handleInputUpdate}
                />

                {/* Section D: Immediate Validation */}
                <ValidationPanel validation={validation} />

                {/* Section E: Primary Actions */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center gap-2.5">
                  <button
                    id="run-scenario-main-btn"
                    type="button"
                    disabled={!validation.isValid || isCalculating}
                    onClick={handleRunScenario}
                    title={!validation.isValid ? 'Disabled: Please fix blocking issues above' : 'Simulate aviation to hotel demand impact'}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                      !validation.isValid || isCalculating
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-900/15 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isCalculating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Calculating aviation & hotel impact…</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Run Scenario</span>
                      </>
                    )}
                  </button>

                  <button
                    id="reset-scenario-btn"
                    type="button"
                    onClick={handleResetToBaseline}
                    title="Reset to current baseline"
                    className="p-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    id="save-scenario-btn"
                    type="button"
                    onClick={handleSaveScenario}
                    title="Save scenario to portfolio"
                    className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>Save</span>
                  </button>

                  {saveSuccessMsg && (
                    <span className="w-full text-center text-xs font-semibold text-teal-800 bg-teal-50 py-1.5 rounded-lg border border-teal-200 animate-in fade-in">
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Decision Results & Visual Story (7 Cols on LG) */}
              <div className="lg:col-span-7 space-y-6" id="planner-results-column">
                {/* A. 4 Priority KPI Cards */}
                <KPIGrid result={scenarioResult} />

                {/* B. Support Status Banner */}
                <SupportStatusBanner
                  level={scenarioResult.supportLevel}
                  customExplanation={scenarioResult.supportExplanation}
                />

                {/* C. Transparent Conversion Chain */}
                <ConversionChain stages={scenarioResult.conversionStages} />

                {/* D. Comparative Grouped Bar Chart */}
                <BaselineScenarioChart result={scenarioResult} />

                {/* E. Monthly Trajectory Line Chart */}
                <MonthlyImpactChart
                  data={scenarioResult.monthlyBreakdown}
                  supportLevel={scenarioResult.supportLevel}
                />

                {/* F. "What this means for DCT" */}
                <DecisionSummary summary={scenarioResult.decisionSummary} />

                {/* G. Important Warnings */}
                <WarningsPanel
                  topWarnings={scenarioResult.topWarnings}
                  allWarnings={scenarioResult.allWarnings}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Market & Season Insights */}
        {activeTab === 'insights' && <MarketInsightsTab />}

        {/* Tab 3: Compare Opportunities */}
        {activeTab === 'compare' && (
          <CompareOpportunitiesTab
            savedScenarios={savedScenarios}
            currentResult={scenarioResult}
            onLoadScenario={handleLoadSavedScenario}
            onDeleteScenario={handleDeleteSaved}
            onDuplicateScenario={handleDuplicateSaved}
            onOpenDecisionBrief={() => setIsDecisionBriefOpen(true)}
          />
        )}

        {/* Tab 4: Trust, Data & Assumptions */}
        {activeTab === 'trust' && (
          <TrustDataTab currentResult={scenarioResult} />
        )}
      </main>

      {/* Global Drawers & Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleCloseWelcome}
        onLoadExample={() => {
          handleApplyPreset('india_freq');
          handleRunScenario();
        }}
      />

      <GlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <DecisionBriefModal
        isOpen={isDecisionBriefOpen}
        onClose={() => setIsDecisionBriefOpen(false)}
        result={scenarioResult}
        route={selectedRoute}
        baseline={currentBaseline}
      />
    </div>
  );
}
