import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, AppHeader } from './components/common/AppHeader';
import { WelcomeModal } from './components/common/WelcomeModal';
import { GlossaryDrawer } from './components/common/GlossaryDrawer';
import { DecisionBriefModal } from './components/export/DecisionBriefModal';
import { DecisionTypeSelector } from './components/planner/DecisionTypeSelector';
import { PlannerHeaderSteps } from './components/planner/PlannerHeaderSteps';
import { BaselineSelector } from './components/planner/BaselineSelector';
import { ScenarioControls } from './components/planner/ScenarioControls';
import { AdvancedAssumptions } from './components/planner/AdvancedAssumptions';
import { ValidationPanel } from './components/planner/ValidationPanel';
import { KPIGrid } from './components/planner/KPIGrid';
import { BaselineScenarioChart } from './components/planner/BaselineScenarioChart';
import { DecisionSummary } from './components/planner/DecisionSummary';
import { TechnicalDetailsDrawer } from './components/planner/TechnicalDetailsDrawer';
import { MarketInsightsTab } from './components/insights/MarketInsightsTab';
import { CompareOpportunitiesTab } from './components/compare/CompareOpportunitiesTab';
import { TrustDataTab } from './components/trust/TrustDataTab';
import { AskAeroStayDrawer } from './components/chat/AskAeroStayDrawer';
import { DataIntegrationCheck } from './components/dev/DataIntegrationCheck';
import { BackendHealthIndicator } from './components/dev/BackendHealthIndicator';
import { OfficialScenarioResultView } from './components/planner/OfficialScenarioResultView';

import { DataService } from './services/dataService';
import { ScenarioService } from './services/scenarioService';
import {
  SilaScenarioService,
  OFFICIAL_INDIA_EXAMPLE_REQUEST,
  classifyError,
} from './services/silaScenarioService';
import {
  ScenarioInput,
  BaselineFlightData,
  RouteInfo,
  ScenarioResult,
  SavedScenario,
} from './types/dashboard';
import {
  SilaScenarioResponse,
  SilaErrorState,
} from './types/silaScenario';

import {
  Play,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';

const WELCOME_SEEN_KEY = 'aerostay_welcome_seen_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('DEL-AUH');

  // Load all routes from DataService
  const allRoutes = useMemo(() => DataService.getRoutes(), []);

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
  const [isDataCheckOpen, setIsDataCheckOpen] = useState<boolean>(false);
  const [isDecisionBriefOpen, setIsDecisionBriefOpen] = useState<boolean>(false);
  const [isTechnicalDrawerOpen, setIsTechnicalDrawerOpen] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Saved Scenarios via ScenarioService (max 3 for comparison)
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    return ScenarioService.getSavedScenarios();
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

  // Selected route and baseline via DataService
  const selectedRoute = useMemo<RouteInfo>(() => {
    return DataService.getRouteById(selectedRouteId);
  }, [selectedRouteId]);

  const currentBaseline = useMemo<BaselineFlightData>(() => {
    return DataService.getBaseline(selectedRouteId);
  }, [selectedRouteId]);

  // Validation via ScenarioService
  const validation = useMemo(() => {
    return ScenarioService.validate(scenarioInput, currentBaseline, selectedRoute);
  }, [scenarioInput, currentBaseline, selectedRoute]);

  // Simulation Result State via ScenarioService
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult>(() => {
    const initRoute = DataService.getRouteById('DEL-AUH');
    const initBaseline = DataService.getBaseline('DEL-AUH');
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
    return ScenarioService.simulate(initInput, initBaseline, initRoute);
  });

  // Official Python Scenario Backend State
  const [officialScenarioResult, setOfficialScenarioResult] = useState<SilaScenarioResponse | null>(null);
  const [officialScenarioError, setOfficialScenarioError] = useState<SilaErrorState | null>(null);
  const [isOfficialLoading, setIsOfficialLoading] = useState<boolean>(false);

  // Run Official India Example Action via SilaScenarioService
  const handleRunOfficialIndiaExample = async () => {
    setIsOfficialLoading(true);
    setOfficialScenarioError(null);
    try {
      const resp = await SilaScenarioService.runScenario(OFFICIAL_INDIA_EXAMPLE_REQUEST);
      setOfficialScenarioResult(resp);
      setOfficialScenarioError(null);
    } catch (err: unknown) {
      setOfficialScenarioResult(null);
      setOfficialScenarioError(classifyError(err));
    } finally {
      setIsOfficialLoading(false);
    }
  };

  // Update input when route changes
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    const r = DataService.getRouteById(routeId);
    const b = DataService.getBaseline(routeId);
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
      const res = ScenarioService.simulate(scenarioInput, currentBaseline, selectedRoute);
      setScenarioResult(res);
      setIsCalculating(false);
    }, 350);
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

  // Save Scenario Action (Max 3 saved scenarios for Compare Opportunities)
  const handleSaveScenario = () => {
    if (!scenarioResult) return;

    const newSaved: SavedScenario = {
      id: 'scen-' + Date.now(),
      name: scenarioInput.scenarioName || `${selectedRoute.departureCity} ${scenarioResult.totalSeats.diff >= 0 ? '+' : ''}${scenarioResult.totalSeats.diff} Seats`,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      routeLabel: `${selectedRoute.routeCode} (${selectedRoute.departureCountry})`,
      marketLabel: selectedRoute.modelledSourceMarket,
      dateRange: `${scenarioInput.startMonth} to ${scenarioInput.endMonth}`,
      addedSeats: scenarioResult.totalSeats.diff,
      addedGuests: scenarioResult.hotelGuests.diff,
      addedNights: null,
      guestsPer1kSeats: scenarioResult.guestsPer1kSeats.scenario,
      confidenceScore: scenarioResult.confidenceScore,
      supportLevel: scenarioResult.supportLevel,
      mainUncertainty: scenarioResult.decisionSummary.mainUncertainty,
      recommendation: scenarioResult.decisionSummary.recommendedAction,
      badges: [
        scenarioResult.supportLevel === 'SUPPORTED' ? 'Supported by history' : 'Exploratory analogue',
        `${scenarioResult.guestsPer1kSeats.scenario} guests/1k seats`,
      ],
      input: { ...scenarioInput },
      result: scenarioResult,
    };

    const updated = ScenarioService.saveScenario(newSaved);
    setSavedScenarios(updated);

    setSaveSuccessMsg('Saved to comparison portfolio (max 3)');
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
      const b = DataService.getBaseline(scen.input.routeId);
      const r = DataService.getRouteById(scen.input.routeId);
      setScenarioResult(ScenarioService.simulate(scen.input, b, r));
    }
    setActiveTab('planner');
  };

  const handleDeleteSaved = (id: string) => {
    const updated = ScenarioService.deleteScenario(id);
    setSavedScenarios(updated);
  };

  const handleDuplicateSaved = (scen: SavedScenario) => {
    const updated = ScenarioService.duplicateScenario(scen);
    setSavedScenarios(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col selection:bg-teal-700 selection:text-white" id="aerostay-app-root">
      {/* Global Header */}
      <AppHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedScenarios.length}
        onOpenSaved={() => setActiveTab('compare')}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onExportBrief={() => setIsDecisionBriefOpen(true)}
        onOpenDataCheck={() => setIsDataCheckOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Scenario Planner */}
        {activeTab === 'planner' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Simple Three-Step Explanation & Mandatory Visible Status Banner */}
            <PlannerHeaderSteps />

            {/* Step 1 Question Lever Selector */}
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

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Setup & Inputs (5 Cols on LG) */}
              <div className="lg:col-span-5 space-y-5" id="planner-inputs-column">
                {/* 1. Baseline Selection */}
                <BaselineSelector
                  routes={allRoutes}
                  selectedRoute={selectedRoute}
                  baseline={currentBaseline}
                  onSelectRoute={handleSelectRoute}
                />

                {/* 2. Scenario Controls */}
                <ScenarioControls
                  input={scenarioInput}
                  baseline={currentBaseline}
                  route={selectedRoute}
                  onChangeInput={handleInputUpdate}
                  onApplyPreset={handleApplyPreset}
                />

                {/* 3. Advanced Assumptions Accordion */}
                <AdvancedAssumptions
                  input={scenarioInput}
                  baseline={currentBaseline}
                  onChangeInput={handleInputUpdate}
                />

                {/* Validation Panel */}
                <ValidationPanel validation={validation} />

                {/* Official Scenario Backend Integration Block */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-white">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                        Official Backend Integration
                      </span>
                    </div>
                    <BackendHealthIndicator />
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Test live Python scenario backend (<code className="text-teal-300 font-mono">linear_v009</code>) with the official India example (+1,000 seats in Nov &amp; Dec 2025).
                  </p>

                  <button
                    id="run-official-india-example-btn"
                    type="button"
                    disabled={isOfficialLoading}
                    onClick={handleRunOfficialIndiaExample}
                    title="Run official India example (+1,000 seats Nov-Dec 2025) on Python backend"
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
                      isOfficialLoading
                        ? 'bg-teal-900 text-teal-300 cursor-wait'
                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-950/20 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isOfficialLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                        <span>Connecting to Python Backend…</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Official India Example</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 4. Run Scenario Button */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-2.5">
                  <button
                    id="run-scenario-main-btn"
                    type="button"
                    disabled={!validation.isValid || isCalculating}
                    onClick={handleRunScenario}
                    title={!validation.isValid ? 'Please fix blocking issues above' : 'Simulate aviation to hotel demand impact'}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                      !validation.isValid || isCalculating
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-900/15 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isCalculating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Calculating hotel impact…</span>
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
                    title="Save scenario for comparison (up to 3)"
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

              {/* Right Column: Four Main Outputs (Height reduced by 30%) + Executive Decision Support */}
              <div className="lg:col-span-7 space-y-4" id="planner-results-column">
                {/* Official Python Scenario Backend Response View */}
                {(officialScenarioResult || officialScenarioError || isOfficialLoading) && (
                  <OfficialScenarioResultView
                    result={officialScenarioResult}
                    error={officialScenarioError}
                    isLoading={isOfficialLoading}
                    onRetry={handleRunOfficialIndiaExample}
                    onClear={() => {
                      setOfficialScenarioResult(null);
                      setOfficialScenarioError(null);
                    }}
                  />
                )}

                {/* 1. Four Main Outputs (Height reduced by 30%, expandable drawer trigger integrated) */}
                <KPIGrid
                  result={scenarioResult}
                  onOpenTechnicalDrawer={() => setIsTechnicalDrawerOpen(true)}
                />

                {/* 2. Plain-language Executive Recommendation ("What this means for DCT") */}
                <DecisionSummary summary={scenarioResult.decisionSummary} />

                {/* 3. Baseline-versus-Scenario Comparative Chart */}
                <BaselineScenarioChart result={scenarioResult} />
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

      {/* Floating Bottom-Right "Ask AeroStay" Chatbot Button & Drawer */}
      <AskAeroStayDrawer
        currentResult={scenarioResult}
        currentRoute={selectedRoute}
      />

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

      {/* Data Integration Check Dev Modal */}
      <DataIntegrationCheck
        isOpen={isDataCheckOpen}
        onClose={() => setIsDataCheckOpen(false)}
      />

      <DecisionBriefModal
        isOpen={isDecisionBriefOpen}
        onClose={() => setIsDecisionBriefOpen(false)}
        result={scenarioResult}
        route={selectedRoute}
        baseline={currentBaseline}
      />

      {/* Expandable Technical Details Drawer */}
      <TechnicalDetailsDrawer
        isOpen={isTechnicalDrawerOpen}
        onClose={() => setIsTechnicalDrawerOpen(false)}
        result={scenarioResult}
        route={selectedRoute}
        baseline={currentBaseline}
      />
    </div>
  );
}
