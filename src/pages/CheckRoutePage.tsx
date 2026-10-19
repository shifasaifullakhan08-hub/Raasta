import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Share2,
  Bookmark
} from 'lucide-react';

export const CheckRoutePage: React.FC = () => {
  const { 
    selectedCity, 
    activeCheckedRoute, 
    checkJourneyRoute, 
    clearCheckedRoute, 
    addRoute, 
    user,
    setCurrentView 
  } = useApp();

  const [origin, setOrigin] = useState(activeCheckedRoute?.originName || 'Caversham Heights, Reading');
  const [destination, setDestination] = useState(activeCheckedRoute?.destName || 'Green Park Tech Campus');
  const [departureTime, setDepartureTime] = useState('Now (08:30 AM)');
  const [activeTab, setActiveTab] = useState<'affected' | 'alternative'>('alternative');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    checkJourneyRoute(origin, destination);
  };

  // Generate route coordinates around selected city center
  const center = selectedCity.center;
  const primaryRouteCoords: [number, number][] = [
    [center[0] + 0.018, center[1] - 0.014],
    [center[0] + 0.009, center[1] - 0.008],
    [center[0] - 0.002, center[1] - 0.004], // Hits Kings Road area
    [center[0] - 0.015, center[1] + 0.005],
    [center[0] - 0.024, center[1] + 0.016],
  ];

  const alternativeRouteCoords: [number, number][] = [
    [center[0] + 0.018, center[1] - 0.014],
    [center[0] + 0.012, center[1] + 0.012], // Western bypass via A4155
    [center[0] - 0.008, center[1] + 0.022],
    [center[0] - 0.020, center[1] + 0.020],
    [center[0] - 0.024, center[1] + 0.016],
  ];

  const handleSaveRoute = () => {
    if (!user) {
      setCurrentView('signup');
      return;
    }
    addRoute({
      name: `${origin.split(',')[0]} to ${destination.split(',')[0]}`,
      origin: {
        id: `p-${Date.now()}`,
        label: origin.split(',')[0],
        address: origin,
        coordinates: primaryRouteCoords[0]
      },
      destination: {
        id: `p-${Date.now() + 1}`,
        label: destination.split(',')[0],
        address: destination,
        coordinates: primaryRouteCoords[primaryRouteCoords.length - 1]
      },
      isFavorite: true,
      notificationsEnabled: true,
      preferredDepartureTime: '08:30',
      estimatedDurationMins: 22,
      distanceKm: 8.4
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-brand-accent font-semibold mb-1">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>TRIP DISRUPTION ANALYZER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Check Any Travel Corridor
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Validate whether roadworks, water main bursts, or flood bottlenecks lie on your path before departing.
        </p>
      </div>

      {/* Origin / Destination Search Form */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 bg-brand-surface border border-brand-border/70 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Starting Point (Origin)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter address, junction, or place..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-4 bg-brand-surface border border-brand-border/70 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Final Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination office, school, or venue..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-brand-surface border border-brand-border/70 rounded-xl px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              Departure Window
            </label>
            <select
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 outline-none cursor-pointer"
            >
              <option value="Now (08:30 AM)">Now (08:30 AM)</option>
              <option value="In 30 Minutes">In 30 Minutes</option>
              <option value="In 1 Hour">In 1 Hour</option>
              <option value="Evening Rush (17:30)">Evening Rush (17:30)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Scan Corridor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Results & Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Disruption Analysis and Alternative Options */}
        <div className="lg:col-span-5 space-y-4">
          {/* Corridor Assessment Status Card */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                  DISRUPTED CORRIDOR DETECTED
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Direct route impacted by 2 major road hazards
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                +28m Delay
              </span>
            </div>

            {/* Travel Time Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setActiveTab('affected')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeTab === 'affected'
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-glow-rose'
                    : 'bg-brand-surface/40 border-brand-border'
                }`}
              >
                <div className="text-[11px] text-slate-400 font-medium">Standard Corridor</div>
                <div className="text-xl font-black text-rose-400 mt-1">52 mins</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct via Kings Rd (Heavy delay)</div>
              </div>

              <div 
                onClick={() => setActiveTab('alternative')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activeTab === 'alternative'
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow-emerald'
                    : 'bg-brand-surface/40 border-brand-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-bold">Recommended Bypass</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400 mt-1">24 mins</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Saves ~28 mins via A4155</div>
              </div>
            </div>

            {/* Save Route Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleSaveRoute}
                disabled={isSaved}
                className="px-4 py-2 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                <Bookmark className="w-3.5 h-3.5 text-brand-accent" />
                <span>{isSaved ? 'Route Saved to Profile!' : 'Save This Route for Daily Alerts'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Step Cards based on selected tab */}
          {activeTab === 'affected' ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Identified Road Hazards on Direct Route</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-brand-surface border border-rose-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">A329 Kings Road Pipe Burst</span>
                    <SeverityBadge severity="critical" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Both eastbound lanes closed. Emergency maintenance crew on site with 200m queue.
                  </p>
                  <div className="text-[10px] text-rose-400 font-semibold">
                    Adds approximately +18 mins
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand-surface border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Mill Lane Underpass Flooding</span>
                    <SeverityBadge severity="high" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Dip submersion requires slow single-file bypass. Sedans advised to avoid.
                  </p>
                  <div className="text-[10px] text-amber-400 font-semibold">
                    Adds approximately +10 mins
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Clear Alternative Corridor</span>
                </h4>
                <span className="text-[11px] text-slate-400">Zero reported incidents</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-brand-surface/70 rounded-xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-white">Depart Caversham Heights via A4155</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Smooth flow across bridge, sensors report green signal status.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-surface/70 rounded-xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-white">Take Western Bypass to Rose Kiln Lane</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Completely avoids Kings Road pipe burst and town center gridlock.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-surface/70 rounded-xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-white">Arrive at Green Park Campus on time</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Estimated arrival: 08:54 AM (Expected on-time)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Map Tracing Visualization */}
        <div className="lg:col-span-7 h-[560px]">
          <InteractiveMap
            incidents={activeTab === 'affected' ? (activeCheckedRoute?.incidentsAlongRoute || []) : []}
            activeRouteGeometry={activeTab === 'affected' ? primaryRouteCoords : alternativeRouteCoords}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
