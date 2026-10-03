import React from 'react';
import { DecisionType } from '../../types';
import { Plane, Layers, Percent, Compass } from 'lucide-react';

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
      type: 'CHANGE_FREQUENCY',
      title: 'Add flights',
      explanation: 'Increase weekly flight frequencies on an existing or growing route.',
      icon: Plane,
    },
    {
      type: 'CHANGE_CAPACITY',
      title: 'Change capacity',
      explanation: 'Adjust scheduled monthly aircraft seats up or down.',
      icon: Layers,
    },
    {
      type: 'TEST_LOAD_FACTOR',
      title: 'Change load factor',
      explanation: 'Test higher or lower passenger occupancy without modifying flight schedules.',
      icon: Percent,
    },
    {
      type: 'NEW_ROUTE',
      title: 'New route',
      explanation: 'Simulate introducing a direct non-stop air link from an unserved market.',
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-4" id="decision-question-selector">
      <div className="text-center max-w-2xl mx-auto space-y-1.5 pt-2 pb-1">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 font-display">
          What would you like to explore?
        </h2>
        <p className="text-sm sm:text-base text-stone-500 font-normal leading-relaxed">
          See how a change in air connectivity could affect hotel arrivals in Abu Dhabi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {choices.map((choice) => {
          const Icon = choice.icon;
          const isSelected = selectedType === choice.type;

          return (
            <button
              key={choice.type}
              id={`decision-card-${choice.type.toLowerCase()}`}
              type="button"
              onClick={() => onSelectType(choice.type)}
              className={`text-left p-5 sm:p-6 rounded-2xl border transition-all relative flex flex-col justify-between h-full group ${
                isSelected
                  ? 'bg-white border-teal-800 shadow-[0_4px_20px_-4px_rgba(13,64,82,0.12)] ring-1 ring-teal-800'
                  : 'bg-white/80 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-xs'
              }`}
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors mb-4 ${
                    isSelected
                      ? 'bg-teal-900 text-stone-100 shadow-xs'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200/70 group-hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 tracking-tight mb-1.5">
                  {choice.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">
                  {choice.explanation}
                </p>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-medium text-teal-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-700" />
                  <span>Selected planning lever</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
