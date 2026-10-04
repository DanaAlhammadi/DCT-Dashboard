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
        return 'bg-[#0A2E4D]/8 text-[#0A2E4D] border-[#0A2E4D]/15';
      case 'Derived':
        return 'bg-[#0E6B6E]/10 text-[#0E6B6E] border-[#0E6B6E]/20';
      case 'Estimated':
        return 'bg-[#D4AF37]/15 text-[#0A2E4D] border-[#D4AF37]/35';
      case 'Assumed':
        return 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/25';
      case 'Unknown':
      default:
        return 'bg-[#F4F1EA] text-[#0A2E4D]/60 border-[#0A2E4D]/15';
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
