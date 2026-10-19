import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon, CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { 
  CloudRain, 
  Wind, 
  Compass, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  TrendingDown,
  Sparkles,
  Bookmark
} from 'lucide-react';

export const CommuterDashboard: React.FC = () => {
  const { 
    user, 
    routes, 
    incidents, 
    selectedCity, 
    setSelectedIncident, 
    setCurrentView,
    checkJourneyRoute,
    setIsOnboardingOpen
  } = useApp();

  const cityIncidents = incidents.filter(i => i.city === selectedCity.id && i.status !== 'resolved');
  const criticalCount = cityIncidents.filter(i => i.severity === 'critical').length;
  const highCount = cityIncidents.filter(i => i.severity === 'high').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-brand-card to-cyan-950/30 border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-cyan">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>COMMUTER MISSION CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {user ? user.fullName.split(' ')[0] : 'Commuter'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Here are the road conditions and weather impacts affecting your daily journeys across {selectedCity.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('check-route')}
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Check a Journey</span>
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Configure Routes</span>
          </button>
        </div>
      </div>

      {/* Grid: Weather & Road Weather Impact Dial (Directly inspired by reference screenshot 1) + Equipment Telemetry (Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Impact Dial Widget */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Surface & Weather Telemetry
              </h3>
              <p className="text-[11px] text-slate-400">Road grip & water accumulation</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              Moderate Rain
            </span>
          </div>

          {/* Circular dial inspired by user reference 1 */}
          <div className="my-4 relative flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-500/20 flex items-center justify-center relative">
              {/* Outer dial indicators */}
              <div className="absolute -top-1 px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-[10px] text-slate-300">
                08:00 &bull; Rain
              </div>
              <div className="absolute -right-3 px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-[10px] text-slate-300">
                12:00 &bull; Mist
              </div>
              <div className="absolute -bottom-1 px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-[10px] text-slate-300">
                16:00 &bull; Clear
              </div>

              {/* Center capsule */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-brand-surface to-[#0B111E] border border-cyan-500/40 shadow-glow-cyan flex flex-col items-center justify-center text-center p-2">
                <CloudRain className="w-6 h-6 text-brand-cyan mb-1 animate-bounce" />
                <span className="text-xl font-black text-white">12°C</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Tarmac Wet</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface/50 border border-brand-border/60 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>Grip Index: 78% (Safe)</span>
            </div>
            <span className="text-[10px] text-slate-400">Braking distance +15%</span>
          </div>
        </div>

        {/* Traffic Controller & Incident Pulse (Inspired by Yunex reference UI) */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {selectedCity.name} Urban Traffic Control
              </h3>
              <p className="text-[11px] text-slate-400">SCOOT Junctions & Sensor Fleet</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Live Link
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-brand-surface/60 border border-brand-border p-3.5 rounded-xl">
              <span className="text-xl font-black text-rose-500 block">{criticalCount}</span>
              <span className="font-semibold text-slate-200">Active Roadblocks</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Underpass / Pipe burst</span>
            </div>

            <div className="bg-brand-surface/60 border border-brand-border p-3.5 rounded-xl">
              <span className="text-xl font-black text-amber-400 block">{highCount}</span>
              <span className="font-semibold text-slate-200">High Risk Hazards</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Deep potholes & works</span>
            </div>

            <div className="bg-brand-surface/60 border border-brand-border p-3.5 rounded-xl">
              <span className="text-xl font-black text-emerald-400 block">262</span>
              <span className="font-semibold text-slate-200">Normal Controllers</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Operating normally</span>
            </div>

            <div className="bg-brand-surface/60 border border-brand-border p-3.5 rounded-xl">
              <span className="text-xl font-black text-blue-400 block">0</span>
              <span className="font-semibold text-slate-200">Unconfirmed Faults</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">All sensors audited</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('map')}
              className="w-full py-2.5 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-cyan" />
              <span>Inspect Full Network on Map</span>
            </button>
          </div>
        </div>

        {/* Quick Route Status Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Daily Route Health
              </h3>
              <p className="text-[11px] text-slate-400">Monitoring your saved corridors</p>
            </div>
            <button
              onClick={() => setCurrentView('routes')}
              className="text-xs text-brand-accent hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {routes.slice(0, 2).map(r => (
              <div 
                key={r.id}
                onClick={() => {
                  checkJourneyRoute(r.origin.address, r.destination.address);
                  setCurrentView('check-route');
                }}
                className="p-3.5 rounded-xl bg-brand-surface border border-brand-border hover:border-slate-500 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {r.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                    Disruption (+28m)
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{r.origin.label} &rarr; {r.destination.label}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-brand-border/40">
                  <span>Departure: {r.preferredDepartureTime || '08:30'}</span>
                  <span className="text-emerald-400 font-semibold">Bypass Available</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('report')}
            className="w-full py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Spotted a New Hazard? Report It</span>
          </button>
        </div>
      </div>

      {/* Relevant Personalized Alerts Feed */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Personalized Alerts For Your Saved Commutes
            </h3>
            <p className="text-xs text-slate-400">
              Filtered based on your registered paths and travel times
            </p>
          </div>
          <button
            onClick={() => setCurrentView('alerts')}
            className="text-xs text-brand-accent hover:underline font-semibold"
          >
            View all {cityIncidents.length} alerts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityIncidents.slice(0, 4).map(inc => (
            <div
              key={inc.id}
              onClick={() => {
                setSelectedIncident(inc);
                setCurrentView('map');
              }}
              className="p-4 rounded-xl bg-brand-surface/70 border border-brand-border hover:border-slate-500 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <CategoryBadge category={inc.category} />
                <SeverityBadge severity={inc.severity} />
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">
                {inc.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="truncate">{inc.roadName}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-brand-border/50">
                <StatusBadge status={inc.status} />
                <span className="font-semibold text-amber-400">+{inc.estimatedDelayMinutes || 15}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
