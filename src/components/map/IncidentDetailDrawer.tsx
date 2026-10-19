import React, { useState } from 'react';
import { RoadIncident, IncidentConfirmation } from '../../types';
import { CategoryBadge, SeverityBadge, StatusBadge } from '../common/Badges';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle, 
  Share2, 
  ExternalLink,
  Navigation,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface IncidentDetailDrawerProps {
  incident: RoadIncident;
  onClose: () => void;
}

export const IncidentDetailDrawer: React.FC<IncidentDetailDrawerProps> = ({ incident, onClose }) => {
  const { addConfirmation, checkJourneyRoute, setCurrentView, user } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'confirmations' | 'history'>('overview');
  const [commentInput, setCommentInput] = useState('');
  const [showShareNotification, setShowShareNotification] = useState(false);

  const handleConfirm = (type: IncidentConfirmation['type']) => {
    addConfirmation(incident.id, type, commentInput.trim() ? commentInput.trim() : undefined);
    setCommentInput('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2500);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-brand-border bg-brand-surface/40 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CategoryBadge category={incident.category} />
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {incident.title}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="font-medium text-slate-300">{incident.roadName}</span>
            <span>&bull;</span>
            <span>{incident.area}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border bg-brand-darkest/60 px-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-brand-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Incident Overview
        </button>
        <button
          onClick={() => setActiveTab('confirmations')}
          className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'confirmations'
              ? 'border-brand-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Community Feedback</span>
          <span className="px-1.5 py-0.2 rounded-full bg-brand-surface text-[10px] text-brand-accent">
            {incident.confirmations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-3 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-brand-primary text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Status Audit Trail
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm">
        {activeTab === 'overview' && (
          <>
            {/* Incident Photo if present */}
            {incident.imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-brand-border h-48 sm:h-56 bg-slate-900">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On-site condition snapshot</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-brand-surface/30 p-4 rounded-xl border border-brand-border/60">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                Situation Report
              </h4>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                {incident.description}
              </p>
            </div>

            {/* Delay & Impact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-brand-surface/50 border border-brand-border/70 p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Estimated Delay</span>
                <span className="text-lg font-bold text-amber-400">
                  +{incident.estimatedDelayMinutes || 15} mins
                </span>
              </div>
              <div className="bg-brand-surface/50 border border-brand-border/70 p-3 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Data Source</span>
                <span className="text-xs font-semibold text-slate-200 block truncate" title={incident.sourceName}>
                  {incident.sourceName}
                </span>
              </div>
              <div className="bg-brand-surface/50 border border-brand-border/70 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block mb-1">Expected Clear</span>
                <span className="text-xs font-semibold text-slate-200">
                  {incident.expectedResolution ? new Date(incident.expectedResolution).toLocaleDateString() : 'Pending Inspection'}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>First Reported: {new Date(incident.reportedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Last Updated: {new Date(incident.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Community Confirmation Section */}
            <div className="border-t border-brand-border pt-4">
              <h4 className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                <span>Are you on this road? Confirm this report:</span>
                <span className="text-[10px] text-slate-400">Anti-abuse verified</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <button
                  onClick={() => handleConfirm('confirm')}
                  className="px-2.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>I Can Confirm</span>
                </button>
                <button
                  onClick={() => handleConfirm('still_happening')}
                  className="px-2.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Still Happening</span>
                </button>
                <button
                  onClick={() => handleConfirm('resolved')}
                  className="px-2.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Cleared / Resolved</span>
                </button>
                <button
                  onClick={() => handleConfirm('inaccurate')}
                  className="px-2.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Inaccurate</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Optional observation (e.g., 'Right lane now opening up')..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'confirmations' && (
          <div className="space-y-3">
            {incident.confirmations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No user confirmations recorded yet. Be the first commuter to confirm!
              </div>
            ) : (
              incident.confirmations.map(conf => (
                <div key={conf.id} className="p-3 bg-brand-surface/40 rounded-xl border border-brand-border flex items-start gap-3">
                  <div className="mt-0.5">
                    {conf.type === 'confirm' && <ThumbsUp className="w-4 h-4 text-emerald-400" />}
                    {conf.type === 'still_happening' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {conf.type === 'resolved' && <CheckCircle className="w-4 h-4 text-blue-400" />}
                    {conf.type === 'inaccurate' && <X className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 capitalize">
                        {conf.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(conf.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {conf.comment && (
                      <p className="text-xs text-slate-300 mt-1">"{conf.comment}"</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {incident.statusHistory.map((item, idx) => (
              <div key={idx} className="relative pl-6 pb-3 border-l-2 border-brand-border last:border-transparent">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-brand-accent" />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    <span className="text-slate-400 text-[11px]">
                      by {item.updatedBy}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  {item.reason && (
                    <p className="text-xs text-slate-300 mt-1 italic">
                      Note: {item.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-brand-border bg-brand-surface/40 flex items-center justify-between gap-3">
        <button
          onClick={handleShare}
          className="px-3 py-2 rounded-lg bg-brand-surface hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-brand-border transition-colors flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{showShareNotification ? 'Link Copied!' : 'Share Alert'}</span>
        </button>

        <button
          onClick={() => {
            checkJourneyRoute('My Location', incident.roadName);
            setCurrentView('check-route');
          }}
          className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-blue-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Check Alternative Route</span>
        </button>
      </div>
    </div>
  );
};
