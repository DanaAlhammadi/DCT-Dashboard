import React from 'react';
import { DecisionType } from '../../types';
import { 
  PlusCircle, 
  Repeat, 
  PlaneTakeoff, 
  Percent, 
  MinusCircle, 
  Globe2 
} from 'lucide-react';

interface Props {
  selectedType: DecisionType;
  onSelectType: (type: DecisionType) => void;
}

interface Option {
  type: DecisionType;
  title: string;
  question: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DecisionTypeSelector: React.FC<Props> = ({ selectedType, onSelectType }) => {
  const options: Option[] = [
    {
      type: 'CHANGE_FREQUENCY',
      title: 'Increase / reduce flights',
      question: 'How much hotel demand changes if weekly flight frequency shifts?',
      icon: Repeat,
    },
    {
      type: 'CHANGE_CAPACITY',
      title: 'Change seat capacity',
      question: 'What happens if an airline deploys larger or smaller aircraft?',
      icon: PlaneTakeoff,
    },
    {
      type: 'TEST_LOAD_FACTOR',
      title: 'Test load factor',
      question: 'How do fuller or emptier flights affect Abu Dhabi hotel arrivals?',
      icon: Percent,
    },
    {
      type: 'NEW_ROUTE',
      title: 'Add a new route',
      question: 'How many hotel guests could an unserved direct route generate?',
      icon: PlusCircle,
    },
    {
      type: 'ASSESS_ROUTE_LOSS',
      title: 'Assess route reduction / loss',
      question: 'How much hotel demand could be lost if a route is discontinued?',
      icon: MinusCircle,
    },
    {
      type: 'COMPARE_MARKETS',
      title: 'Compare source markets',
      question: 'Which source market generates the most hotel demand per available seat?',
      icon: Globe2,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6" id="decision-question-selector">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Step 1 · Planning Intent
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-1">
            What decision are you exploring?
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">Select a card to auto-configure relevant inputs</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.type;

          return (
            <button
              key={opt.type}
              id={`decision-card-${opt.type.toLowerCase()}`}
              onClick={() => onSelectType(opt.type)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between h-full min-h-[110px] ${
                isSelected
                  ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-teal-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-teal-600 ring-2 ring-teal-200" />
                )}
              </div>

              <div>
                <h3 className={`text-xs font-bold leading-tight mb-1 ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                  {opt.title}
                </h3>
                <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed">
                  {opt.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
