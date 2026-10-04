import React from 'react';
import { DecisionType } from '../../types';
import { Layers, Calendar, Percent, Compass } from 'lucide-react';

interface Props {
  selectedType: DecisionType;
  onSelectType: (type: DecisionType) => void;
}

interface ActionChoice {
  type: DecisionType;
  title: string;
  explanation: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DecisionTypeSelector: React.FC<Props> = ({ selectedType, onSelectType }) => {
  const choices: ActionChoice[] = [
    {
      type: 'CHANGE_CAPACITY',
      title: 'Add / remove seats',
      explanation: 'Increase or decrease available passenger seats.',
      icon: Layers,
    },
    {
      type: 'CHANGE_FREQUENCY',
      title: 'Change weekly flights',
      explanation: 'Add or reduce weekly flights on an existing route.',
      icon: Calendar,
    },
    {
      type: 'TEST_LOAD_FACTOR',
      title: 'Change load factor',
      explanation: 'Test higher or lower passenger fill on flights.',
      icon: Percent,
    },
    {
      type: 'NEW_ROUTE',
      title: 'Test a new route',
      explanation: 'Simulate a direct flight connection from a new city.',
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-6" id="decision-question-selector">
      {/* Prominent Core User Question Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A2E4D]/10 shadow-[0_2px_12px_-4px_rgba(10,46,77,0.04)] text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E6B6E]/10 border border-[#0E6B6E]/20 text-[#0E6B6E] text-xs font-semibold tracking-wide uppercase">
          SILA Scenario Simulator
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#0A2E4D] font-display">
          “What happens to Abu Dhabi hotel arrivals if I change air connectivity?”
        </h1>
        <p className="text-sm sm:text-base text-[#0A2E4D]/70 max-w-2xl mx-auto font-normal leading-relaxed">
          Simulate how shifts in airline capacity, flight frequencies, passenger fill, or new city routes impact commercial hotel check-ins in Abu Dhabi.
        </p>
      </div>

      {/* Simulator Entry Screen: What would you like to explore? */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#0A2E4D]/10 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0A2E4D] tracking-tight">
              What would you like to explore?
            </h2>
            <p className="text-xs text-[#0A2E4D]/60 font-normal">
              Select a scenario type below to configure your baseline and define the change.
            </p>
          </div>
          <span className="text-xs font-medium text-[#0E6B6E] hidden sm:inline-block">
            4 Scenario Modes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {choices.map((choice, idx) => {
            const Icon = choice.icon;
            const isSelected = selectedType === choice.type;

            return (
              <button
                key={choice.type}
                id={`decision-card-${choice.type.toLowerCase()}`}
                type="button"
                onClick={() => onSelectType(choice.type)}
                className={`text-left p-5 sm:p-6 rounded-2xl border transition-all relative flex flex-col justify-between h-full group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#0E6B6E] ${
                  isSelected
                    ? 'bg-white border-[#0A2E4D] shadow-[0_4px_20px_-4px_rgba(10,46,77,0.12)] ring-2 ring-[#0A2E4D]'
                    : 'bg-white hover:bg-[#F4F1EA]/50 border-[#0A2E4D]/10 hover:border-[#0E6B6E]/40 shadow-[0_2px_8px_-2px_rgba(10,46,77,0.03)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0A2E4D] text-[#D4AF37] shadow-xs'
                          : 'bg-[#F4F1EA] text-[#0A2E4D]/70 group-hover:bg-[#EDE8DE] group-hover:text-[#0A2E4D]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-[#0A2E4D]/30 font-semibold">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#0A2E4D] tracking-tight mb-1.5">
                    {choice.title}
                  </h3>
                  <p className="text-xs text-[#0A2E4D]/65 leading-relaxed font-normal">
                    {choice.explanation}
                  </p>
                </div>

                {isSelected ? (
                  <div className="mt-4 pt-3 border-t border-[#0A2E4D]/10 flex items-center gap-1.5 text-xs font-medium text-[#0E6B6E]">
                    <span className="w-2 h-2 rounded-full bg-[#0E6B6E]" />
                    <span>Active Scenario Choice</span>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-transparent text-xs text-transparent select-none">
                    Inactive
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
