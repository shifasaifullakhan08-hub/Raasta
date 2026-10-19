import React from 'react';
import { IncidentCategory, IncidentSeverity, VerificationStatus } from '../../types';
import { 
  AlertTriangle, 
  Construction, 
  CircleSlash2, 
  Waves, 
  ArrowLeftRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertOctagon
} from 'lucide-react';

export const CategoryIcon: React.FC<{ category: IncidentCategory; className?: string }> = ({ category, className = "w-4 h-4" }) => {
  switch (category) {
    case 'roadblock':
      return <CircleSlash2 className={`${className} text-rose-500`} />;
    case 'maintenance':
      return <Construction className={`${className} text-amber-500`} />;
    case 'pothole':
      return <AlertTriangle className={`${className} text-orange-400`} />;
    case 'diversion':
      return <ArrowLeftRight className={`${className} text-blue-400`} />;
    case 'flooding':
      return <Waves className={`${className} text-cyan-400`} />;
    default:
      return <AlertOctagon className={className} />;
  }
};

export const CategoryBadge: React.FC<{ category: IncidentCategory }> = ({ category }) => {
  const configs: Record<IncidentCategory, { label: string; bg: string; text: string }> = {
    roadblock: { label: 'Roadblock', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' },
    maintenance: { label: 'Maintenance', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
    pothole: { label: 'Damaged Road / Pothole', bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-400' },
    diversion: { label: 'Diversion', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
    flooding: { label: 'Flooding / Waterlog', bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400' },
  };

  const cfg = configs[category] || { label: category, bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text}`}>
      <CategoryIcon category={category} className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: IncidentSeverity }> = ({ severity }) => {
  const configs: Record<IncidentSeverity, { label: string; dot: string; text: string; bg: string }> = {
    critical: { label: 'Critical', dot: 'bg-rose-500 animate-pulse', text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
    high: { label: 'High Priority', dot: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    moderate: { label: 'Moderate', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
    minor: { label: 'Minor Caution', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  };

  const cfg = configs[severity] || configs.minor;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  const configs: Record<VerificationStatus, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    officially_confirmed: {
      label: 'Officially Confirmed',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400'
    },
    verified: {
      label: 'Verified',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />,
      bg: 'bg-teal-500/10 border-teal-500/30',
      text: 'text-teal-400'
    },
    community_reported: {
      label: 'Community Confirmed',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400'
    },
    under_review: {
      label: 'Under Review',
      icon: <Clock className="w-3.5 h-3.5 text-blue-400" />,
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-400'
    },
    pending_review: {
      label: 'Pending Review',
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
      bg: 'bg-slate-700/30 border-slate-600',
      text: 'text-slate-300'
    },
    resolved: {
      label: 'Resolved',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />,
      bg: 'bg-slate-800 border-slate-700',
      text: 'text-slate-400 line-through'
    },
    rejected: {
      label: 'Rejected / Inaccurate',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
      bg: 'bg-rose-500/10 border-rose-500/30',
      text: 'text-rose-400'
    }
  };

  const cfg = configs[status] || configs.pending_review;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};
