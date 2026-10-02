import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface Props {
  title?: string;
  businessTerm?: string;
  technicalDefinition: string;
  className?: string;
  iconClassName?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const InfoTooltip: React.FC<Props> = ({
  title,
  businessTerm,
  technicalDefinition,
  className = '',
  iconClassName = 'w-3.5 h-3.5 text-slate-400 hover:text-teal-700 transition-colors',
  position = 'top',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label={title || 'Information'}
        className="p-0.5 rounded-full hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500/40 inline-flex items-center justify-center transition-colors cursor-help"
      >
        <Info className={iconClassName} />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 w-64 sm:w-72 p-3 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-xs animate-in fade-in zoom-in-95 duration-100 ${getPositionClasses()}`}
        >
          {title && (
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/80">
              <span className="font-bold text-white tracking-tight">{title}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white sm:hidden"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {businessTerm && (
            <div className="text-[11.5px] text-slate-200 mb-2 leading-relaxed">
              {businessTerm}
            </div>
          )}

          <div className="pt-1.5 border-t border-slate-700/60 text-[11px] text-slate-300">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-0.5">
              Technical Definition:
            </span>
            <p className="leading-relaxed text-slate-300 font-mono text-[10.5px]">
              {technicalDefinition}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
