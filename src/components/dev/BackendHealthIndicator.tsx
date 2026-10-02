import React, { useEffect, useState } from 'react';
import { SilaScenarioService } from '../../services/silaScenarioService';
import { BackendHealthStatus } from '../../types/silaScenario';
import { Server, RefreshCw } from 'lucide-react';

interface Props {
  className?: string;
  onStatusChange?: (status: BackendHealthStatus) => void;
}

export const BackendHealthIndicator: React.FC<Props> = ({ className = '', onStatusChange }) => {
  const [health, setHealth] = useState<BackendHealthStatus>({
    connected: false,
    modelLoaded: false,
    statusText: 'Unavailable',
    modelText: 'Unavailable',
    lastChecked: '',
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const status = await SilaScenarioService.checkBackendHealth();
    setHealth(status);
    setIsChecking(false);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  useEffect(() => {
    checkHealth();
    // Periodic check every 30 seconds
    const timer = setInterval(checkHealth, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="sila-backend-health-indicator"
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
        health.connected
          ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
          : 'bg-slate-900/80 border-slate-700 text-slate-300'
      } ${className}`}
      title={`Backend: ${health.statusText} | Model: ${health.modelText} (Checked: ${health.lastChecked || 'just now'})`}
    >
      <div className="flex items-center gap-1.5">
        <Server className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[11px] font-sans font-medium text-slate-300">Backend:</span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            health.connected ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              health.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          {health.statusText}
        </span>
      </div>

      <span className="text-slate-600">|</span>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-sans font-medium text-slate-300">Model:</span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            health.modelLoaded ? 'text-teal-300' : 'text-amber-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              health.modelLoaded ? 'bg-teal-400' : 'bg-amber-400'
            }`}
          />
          {health.modelText}
        </span>
      </div>

      <button
        type="button"
        onClick={checkHealth}
        disabled={isChecking}
        title="Refresh SILA Python scenario backend status"
        className="ml-1 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-teal-400' : ''}`} />
      </button>
    </div>
  );
};
