import React from 'react';
import { DataStatus } from '../../types';

interface Props {
  status: DataStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const DataStatusChip: React.FC<Props> = ({ status, size = 'sm', className = '' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Observed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Derived':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Estimated':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Assumed':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Unknown':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTooltip = () => {
    switch (status) {
      case 'Observed':
        return 'Directly recorded in historical aviation or DCT hotel reports.';
      case 'Derived':
        return 'Calculated mathematically from observed historical metrics.';
      case 'Estimated':
        return 'Model-projected value with statistical uncertainty.';
      case 'Assumed':
        return 'User-specified or scenario planner assumption. Not observed data.';
      case 'Unknown':
        return 'Value unavailable or suppressed in current extract.';
    }
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      id={`chip-status-${status.toLowerCase()}`}
      title={getTooltip()}
      className={`inline-flex items-center font-medium border rounded-full select-none cursor-help transition-colors ${sizeClass} ${getStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 opacity-75 currentColor" style={{ backgroundColor: 'currentColor' }} />
      {status}
    </span>
  );
};
