import React from 'react';
import { SupportLevel } from '../../types';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  level: SupportLevel;
  customExplanation?: string;
  className?: string;
}

export const SupportStatusBanner: React.FC<Props> = ({ level, customExplanation, className = '' }) => {
  const getConfig = () => {
    switch (level) {
      case 'SUPPORTED':
        return {
          title: 'High Evidence Reliability',
          technicalLabel: 'SUPPORTED',
          desc: customExplanation || 'Historical evidence exists for a similar market, route, and scenario range.',
          technicalDefinition:
            'Model Support Status: SUPPORTED. Input parameters fall directly within observed historical distributions (training convex hull).',
          icon: CheckCircle2,
          containerClass: 'bg-emerald-50/90 border-emerald-300 text-emerald-950',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconColor: 'text-emerald-600',
        };
      case 'LIMITED_SUPPORT':
        return {
          title: 'Moderate Evidence Reliability',
          technicalLabel: 'LIMITED SUPPORT',
          desc: customExplanation || 'The route is represented historically, but the proposed change is near or beyond the normal range.',
          technicalDefinition:
            'Model Support Status: LIMITED SUPPORT. Input capacity changes exceed standard historical deviations; confidence intervals widen accordingly.',
          icon: AlertTriangle,
          containerClass: 'bg-amber-50/90 border-amber-300 text-amber-950',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          iconColor: 'text-amber-600',
        };
      case 'OUT_OF_SUPPORT':
        return {
          title: 'Exploratory Proxy Model',
          technicalLabel: 'OUT OF SUPPORT',
          desc: customExplanation || 'This route or market lacks sufficient historical evidence. Treat the estimate as exploratory based on comparable analogues.',
          technicalDefinition:
            'Model Support Status: OUT OF SUPPORT. Route lacks direct historical records; projections rely on analogue proxy routes.',
          icon: HelpCircle,
          containerClass: 'bg-orange-50/90 border-orange-300 text-orange-950',
          badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
          iconColor: 'text-orange-600',
        };
      case 'BLOCKED':
      default:
        return {
          title: 'Input Revision Required',
          technicalLabel: 'BLOCKED',
          desc: customExplanation || 'The scenario contains invalid, contradictory, or incomplete inputs.',
          technicalDefinition:
            'Model Support Status: BLOCKED. One or more mandatory parameter constraints are violated.',
          icon: XCircle,
          containerClass: 'bg-rose-50/90 border-rose-300 text-rose-950',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          iconColor: 'text-rose-600',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      id="support-status-banner"
      className={`rounded-xl border p-4 flex items-start gap-3.5 shadow-xs transition-all ${config.containerClass} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${config.badgeClass}`}>
            <span>{config.title}</span>
            <InfoTooltip
              title={config.title}
              businessTerm={config.desc}
              technicalDefinition={config.technicalDefinition}
              position="bottom"
              iconClassName="w-3 h-3 text-slate-600 hover:text-slate-900"
            />
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Evidence Assessment ({config.technicalLabel})
          </span>
        </div>
        <p className="text-sm leading-relaxed">{config.desc}</p>
      </div>
    </div>
  );
};
