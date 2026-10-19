import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { VerificationStatus, IncidentCategory } from '../types';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Edit3, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const AdminCommandCenter: React.FC = () => {
  const { 
    incidents, 
    updateIncidentStatus, 
    selectedCity, 
    setSelectedIncident, 
    setCurrentView,
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'audit'>('pending');
  const [selectedIncId, setSelectedIncId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const pendingReports = incidents.filter(i => i.status === 'pending_review' || i.status === 'community_reported');
  const selectedIncident = incidents.find(i => i.id === selectedIncId) || incidents[0];

  const handleStatusUpdate = (newStatus: VerificationStatus) => {
    if (!selectedIncident) return;
    updateIncidentStatus(
      selectedIncident.id, 
      newStatus, 
      reasonInput.trim() ? reasonInput.trim() : `Decision by ${user?.fullName || 'Admin'}`
    );
    setReasonInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Ops Header */}
      <div className="bg-gradient-to-r from-rose-950/40 via-brand-card to-slate-900 border border-brand-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
            <Shield className="w-4 h-4" />
            <span>TRAFFIC OPERATIONS & MODERATION CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Incident Verification & Audit Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit citizen submissions, reconcile multi-user confirmations, and elevate to officially confirmed.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
            {pendingReports.length} Queued For Verification
          </span>
        </div>
      </div>

      {/* Main Two-Column Moderation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3 mb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Verification Queue ({pendingReports.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-brand-surface text-white border border-brand-border'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Incidents ({incidents.length})
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {(activeTab === 'pending' ? pendingReports : incidents).map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncId(inc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    (selectedIncident?.id === inc.id)
                      ? 'bg-brand-surface border-brand-primary shadow-glow-cyan'
                      : 'bg-brand-surface/40 border-brand-border hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <CategoryBadge category={inc.category} />
                    <StatusBadge status={inc.status} />
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {inc.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-brand-border/40">
                    <span>{inc.roadName}</span>
                    <span className="text-emerald-400 font-semibold">{inc.confirmations.length} Confirmations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Incident Review & Verification Actions */}
        <div className="lg:col-span-7">
          {selectedIncident ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">ID: #{selectedIncident.id}</span>
                    <SeverityBadge severity={selectedIncident.severity} />
                    <StatusBadge status={selectedIncident.status} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedIncident.title}</h2>
                  <p className="text-xs text-brand-cyan mt-0.5">{selectedIncident.roadName}, {selectedIncident.area}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedIncident(selectedIncident);
                    setCurrentView('map');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-slate-700 text-xs text-slate-300 border border-brand-border flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              </div>

              {/* Photo Preview if uploaded */}
              {selectedIncident.imageUrl && (
                <div className="h-48 rounded-xl overflow-hidden border border-brand-border bg-slate-900">
                  <img src={selectedIncident.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Description */}
              <div className="bg-brand-surface/40 p-4 rounded-xl border border-brand-border text-xs sm:text-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Field Report Notes</span>
                <p className="text-slate-200">{selectedIncident.description}</p>
              </div>

              {/* Telemetry metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-brand-surface/50 p-3 rounded-xl border border-brand-border">
                  <span className="text-slate-500 block text-[10px]">Reported By</span>
                  <span className="font-semibold text-white">{selectedIncident.sourceName}</span>
                </div>
                <div className="bg-brand-surface/50 p-3 rounded-xl border border-brand-border">
                  <span className="text-slate-500 block text-[10px]">Community Endorsements</span>
                  <span className="font-semibold text-emerald-400">{selectedIncident.confirmations.length} citizens</span>
                </div>
                <div className="bg-brand-surface/50 p-3 rounded-xl border border-brand-border">
                  <span className="text-slate-500 block text-[10px]">Estimated Delay</span>
                  <span className="font-semibold text-amber-400">+{selectedIncident.estimatedDelayMinutes || 10}m</span>
                </div>
              </div>

              {/* Moderation Action Box */}
              <div className="bg-brand-surface/70 border border-brand-border p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Apply Operational Verification Decision</span>
                </h4>

                <input
                  type="text"
                  placeholder="Audit reason / evidence note (e.g., 'Inspected via street camera #14, contractor on-site')..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full bg-brand-darkest border border-brand-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => handleStatusUpdate('officially_confirmed')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official Confirmed</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('verified')}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('resolved')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mark Cleared</span>
                  </button>

                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject / Spam</span>
                  </button>
                </div>
              </div>

              {/* Status Audit Trail */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Operational Audit Trail
                </span>
                <div className="space-y-2">
                  {selectedIncident.statusHistory.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-brand-surface/40 border border-brand-border text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="text-slate-300">{item.reason || 'Status changed'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Select an incident from the queue to moderate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
