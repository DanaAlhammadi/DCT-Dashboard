import React, { useState } from 'react';
import { GLOSSARY_ITEMS } from '../../data/mockData';
import { X, Search, BookOpen, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'General Planning', 'Aviation Metrics', 'Tourism Metrics', 'Model & Governance', 'Data & Methodology'];

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in" id="glossary-modal-backdrop">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        id="glossary-drawer"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">Planning Glossary & Methodology</h2>
              <p className="text-xs text-slate-500">Plain-language aviation & hotel concepts</p>
            </div>
          </div>
          <button
            id="close-glossary-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="glossary-search-input"
              type="text"
              placeholder="Search concepts (e.g., P2P, WMAPE, Load factor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No concepts matching "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or category filter.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                id={`glossary-item-${item.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{item.term}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>AeroStay Abu Dhabi Methodology</span>
          <span className="font-semibold text-teal-700">DCT Analytics Ready</span>
        </div>
      </div>
    </div>
  );
};
