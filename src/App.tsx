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
import { ConversionChain } from './components/planner/ConversionChain';
import { MethodologyDisclosure } from './components/planner/MethodologyDisclosure';
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
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Exploration Intent Selection */}
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

            {/* Guided Flow: Left Column (Inputs) & Right Column (Outputs & Story) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Choose Baseline & Define Change (5 Cols) */}
              <div className="lg:col-span-5 space-y-6" id="planner-inputs-column">
                {/* Step 1: Baseline Selection */}
                <BaselineSelector
                  routes={allRoutes}
                  selectedRoute={selectedRoute}
                  baseline={currentBaseline}
                  onSelectRoute={handleSelectRoute}
                />

                {/* Step 2: Define Change */}
                <ScenarioControls
                  input={scenarioInput}
                  baseline={currentBaseline}
                  route={selectedRoute}
                  onChangeInput={handleInputUpdate}
                  onApplyPreset={handleApplyPreset}
                />

                {/* Optional Progressive Disclosure: Advanced Assumptions */}
                <AdvancedAssumptions
                  input={scenarioInput}
                  baseline={currentBaseline}
                  onChangeInput={handleInputUpdate}
                />

                {/* Validation Warnings (if any) */}
                <ValidationPanel validation={validation} />

                {/* Primary Action Bar */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      id="run-scenario-main-btn"
                      type="button"
                      disabled={!validation.isValid || isCalculating}
                      onClick={handleRunScenario}
                      className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
                        !validation.isValid || isCalculating
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-teal-900 hover:bg-teal-800 text-white shadow-teal-950/10 hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                    >
                      {isCalculating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Simulating Impact…</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Simulate Hotel Impact</span>
                        </>
                      )}
                    </button>

                    <button
                      id="reset-scenario-btn"
                      type="button"
                      onClick={handleResetToBaseline}
                      title="Reset to current baseline"
                      className="p-3.5 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      id="save-scenario-btn"
                      type="button"
                      onClick={handleSaveScenario}
                      title="Save scenario for comparison"
                      className="py-3.5 px-4 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-amber-500" />
                      <span>Save</span>
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <div className="text-center text-xs font-medium text-teal-900 bg-teal-50 py-1.5 rounded-xl border border-teal-200 animate-in fade-in">
                      {saveSuccessMsg}
                    </div>
                  )}
                </div>

                {/* Official Python Backend Benchmark Section */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-stone-900">
                        Official Backend Benchmark
                      </span>
                    </div>
                    <BackendHealthIndicator />
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-normal">
                    Evaluate live Python scenario engine (<code className="text-teal-900 font-mono font-medium">linear_v009</code>) with the official India benchmark (+1,000 seats in Nov &amp; Dec 2025).
                  </p>

                  <button
                    id="run-official-india-example-btn"
                    type="button"
                    disabled={isOfficialLoading}
                    onClick={handleRunOfficialIndiaExample}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-2 ${
                      isOfficialLoading
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-wait'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/80 active:scale-[0.99]'
                    }`}
                  >
                    {isOfficialLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
                        <span>Querying Python Benchmark…</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-teal-800" />
                        <span>Run Official India Benchmark</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Step 3 See Impact, Conversion Story, Decision & Methodology (7 Cols) */}
              <div className="lg:col-span-7 space-y-6" id="planner-results-column">
                {/* Official Python Scenario Backend Response View (if triggered) */}
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

                {/* 1. Primary Scenario Result (Hero Visually Dominant + 4 KPIs) */}
                <KPIGrid
                  result={scenarioResult}
                  route={selectedRoute}
                  onOpenTechnicalDrawer={() => setIsTechnicalDrawerOpen(true)}
                />

                {/* 2. Storytelling Conversion Flow (Seats → Pax → P2P → Hotel Check-ins + Separate Guest-Day Proxy) */}
                <ConversionChain
                  stages={scenarioResult.conversionStages}
                  result={scenarioResult}
                />

                {/* 3. Executive Decision Summary ("What this means for DCT") */}
                <DecisionSummary summary={scenarioResult.decisionSummary} />

                {/* 4. Baseline-versus-Scenario Comparative Visual Chart */}
                <BaselineScenarioChart result={scenarioResult} />

                {/* 5. Progressive Disclosure: How SILA reached this result */}
                <MethodologyDisclosure
                  result={scenarioResult}
                  route={selectedRoute}
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
