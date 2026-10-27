import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { IncidentDetailDrawer } from '../components/map/IncidentDetailDrawer';
import { CategoryIcon, SeverityBadge } from '../components/common/Badges';
import { 
  Search, 
  Filter, 
  MapPin, 
  RotateCcw, 
  Compass, 
  Plus, 
  Navigation, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { IncidentCategory, IncidentSeverity } from '../types';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentView, 
    incidents, 
    selectedCity, 
    setSelectedIncident, 
    selectedIncident,
    checkJourneyRoute,
    user,
    setIsOnboardingOpen
  } = useApp();

  const [originInput, setOriginInput] = useState('');
  const [destInput, setDestInput] = useState('');

  const activeIncidents = incidents.filter(i => i.city === selectedCity.id && i.status !== 'resolved');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const maintenanceCount = activeIncidents.filter(i => i.category === 'maintenance').length;
  const potholeCount = activeIncidents.filter(i => i.category === 'pothole').length;

  const handleHeroRouteCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originInput.trim() || !destInput.trim()) return;
    checkJourneyRoute(originInput, destInput);
    setCurrentView('check-route');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        {/* Subtle background ambient glowing orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface/80 border border-brand-border text-xs text-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Mobility Intelligence for <strong className="text-white">{selectedCity.name}</strong></span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-brand-accent">{activeIncidents.length} active disruptions monitored</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Know the road <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                before you go.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Roadblocks, emergency maintenance, hazardous potholes, and unexpected flash floods can disrupt any journey. Raasta empowers commuters with verified alerts and dynamic bypasses before leaving home.
            </p>

            {/* Quick Journey Search Input Box */}
            <div className="pt-2">
              <form 
                onSubmit={handleHeroRouteCheck}
                className="bg-brand-card/90 backdrop-blur-md p-3 rounded-2xl border border-brand-border shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 flex items-center gap-2 bg-brand-surface/80 px-3 py-2.5 rounded-xl border border-brand-border/60">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter origin (e.g. Tilakwadi 2nd Gate)..."
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2 bg-brand-surface/80 px-3 py-2.5 rounded-xl border border-brand-border/60">
                  <Navigation className="w-4 h-4 text-rose-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter destination (e.g. Belagavi Fort / Civil Hospital)..."
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Check Road</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('map')}
                className="px-5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-surface text-brand-cyan text-sm font-semibold border border-brand-cyan/30 shadow-md transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-brand-cyan" />
                <span>Explore Live Incident Map</span>
              </button>

              <button
                onClick={() => {
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setCurrentView('signup');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <span>{user ? 'Open My Dashboard' : 'Set Up Daily Route Alerts'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Command Map & Real-Time Telemetry Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Visualizer */}
          <div className="lg:col-span-2 h-[480px] relative">
            <InteractiveMap
              incidents={activeIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              className="w-full h-full"
            />
          </div>

          {/* Incident Details or Quick Telemetry Status Cards (Matching the reference layout) */}
          <div className="space-y-4">
            {selectedIncident ? (
              <IncidentDetailDrawer
                incident={selectedIncident}
                onClose={() => setSelectedIncident(null)}
              />
            ) : (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {selectedCity.name} Traffic Operations
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Telemetry & active road conditions
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Active Feed
                  </span>
                </div>

                {/* Grid counters inspired by the Yunex reference UI */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-surface/60 border border-brand-border/60 p-3.5 rounded-xl">
                    <span className="text-2xl font-black text-rose-500 block">
                      {criticalCount}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      Critical Roadblocks
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Full or partial closure
                    </span>
                  </div>

                  <div className="bg-brand-surface/60 border border-brand-border/60 p-3.5 rounded-xl">
                    <span className="text-2xl font-black text-amber-400 block">
                      {maintenanceCount}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      Maintenance Works
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Single-lane restrictions
                    </span>
                  </div>

                  <div className="bg-brand-surface/60 border border-brand-border/60 p-3.5 rounded-xl">
                    <span className="text-2xl font-black text-orange-400 block">
                      {potholeCount}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      Severe Potholes
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Community reported
                    </span>
                  </div>

                  <div className="bg-brand-surface/60 border border-brand-border/60 p-3.5 rounded-xl">
                    <span className="text-2xl font-black text-emerald-400 block">
                      {activeIncidents.length}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      Monitored Junctions
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Sensor & citizen feed
                    </span>
                  </div>
                </div>

                {/* Recent High Alert preview */}
                <div className="pt-2 border-t border-brand-border">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Priority Incident</span>
                    <button 
                      onClick={() => setCurrentView('alerts')}
                      className="text-brand-accent hover:underline lowercase font-normal"
                    >
                      view all
                    </button>
                  </div>

                  {activeIncidents.slice(0, 1).map(inc => (
                    <div 
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className="p-3 rounded-xl bg-brand-surface/80 border border-brand-border hover:border-slate-500 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-white truncate max-w-[180px]">
                          {inc.roadName}
                        </span>
                        <SeverityBadge severity={inc.severity} />
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {inc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3-Step Process: How Raasta Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-brand-accent">
            Simplicity & Speed
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            How Raasta Protects Your Daily Travel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brand-card/80 border border-brand-border rounded-2xl p-6 relative group hover:border-slate-600 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Save Your Daily Corridors
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Set your Home, Office, University, or frequent weekend destinations in seconds. Configure preferred morning departure windows.
            </p>
          </div>

          <div className="bg-brand-card/80 border border-brand-border rounded-2xl p-6 relative group hover:border-slate-600 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Anticipate Road Disruptions
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Receive smart proactive alerts before you step into your car or onto your bike. Know exact road names, causes, and expected delays.
            </p>
          </div>

          <div className="bg-brand-card/80 border border-brand-border rounded-2xl p-6 relative group hover:border-slate-600 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Bypass Hazards With Alternatives
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover reliable alternative routes vetted by community confirmations and avoid bottlenecks before getting stuck in deadlocks.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built for Modern Commuters & Cities
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every feature is designed to reduce travel uncertainty and prevent wasted hours on broken tarmac.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-brand-card border border-brand-border p-5 rounded-xl space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <CategoryIcon category="roadblock" className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Emergency Roadblocks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant alerts on emergency water main bursts, collapsed trees, and sudden police barricades.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border p-5 rounded-xl space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <CategoryIcon category="maintenance" className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Scheduled Roadworks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay ahead of nighttime resurfacing, utility excavations, and lane restrictions before peak hours.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border p-5 rounded-xl space-y-2">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
              <CategoryIcon category="pothole" className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Pothole Hazard Mapping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crowdsourced cavity depth warnings to protect two-wheelers, cyclists, and car suspensions from damage.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border p-5 rounded-xl space-y-2">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <CategoryIcon category="flooding" className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Flash Flood & Waterlog Alert</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time underpass flooding advisories during torrential weather with maximum submersion metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/40 via-brand-card to-cyan-950/40 border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-accent font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Source Verification Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              No false rumors. Only vetted road intelligence.
            </h3>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Every citizen report requires independent community confirmations or highway authority validation before high-priority broadcast.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('report')}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors"
            >
              Report a Road Issue
            </button>
            <button
              onClick={() => setCurrentView('how-it-works')}
              className="px-5 py-2.5 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-brand-border transition-colors"
            >
              Learn Verification Protocol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
