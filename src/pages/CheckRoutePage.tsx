import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { SeverityBadge } from '../components/common/Badges';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Bookmark
} from 'lucide-react';

export const CheckRoutePage: React.FC = () => {
  const { 
    selectedCity, 
    activeCheckedRoute, 
    checkJourneyRoute, 
    addRoute, 
    user,
    setCurrentView 
  } = useApp();

  const [origin, setOrigin] = useState(activeCheckedRoute?.originName || 'Tilakwadi 2nd Gate, Belagavi');
  const [destination, setDestination] = useState(activeCheckedRoute?.destName || 'Belagavi Fort & Civil Hospital');
  const [departureTime, setDepartureTime] = useState('Now (09:00 AM IST)');
  const [activeTab, setActiveTab] = useState<'affected' | 'alternative'>('alternative');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    checkJourneyRoute(origin, destination);
  };

  // Generate realistic route coordinates around Belagavi (Tilakwadi to Fort via Chennamma Circle vs Camp Bypass)
  const primaryRouteCoords: [number, number][] = [
    [15.8390, 74.4980], // Tilakwadi
    [15.8450, 74.5020], // Bogarves
    [15.8576, 74.5074], // Rani Chennamma Circle (Blocked)
    [15.8600, 74.5120], // College Road
    [15.8610, 74.5180], // Fort
  ];

  const alternativeRouteCoords: [number, number][] = [
    [15.8390, 74.4980], // Tilakwadi
    [15.8500, 74.4930], // Camp Bypass via Khanapur Road
    [15.8580, 74.5010], // Golf Course Road
    [15.8640, 74.5120], // Military Mahadeva Temple road
    [15.8610, 74.5180], // Fort (Direct & Smooth)
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
      preferredDepartureTime: '09:00',
      estimatedDurationMins: 16,
      distanceKm: 5.8
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-brand-accent font-bold mb-1">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>BELAGAVI TRAVEL CORRIDOR ANALYZER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Check Any Belagavi Journey Route
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detect active roadblocks at Chennamma Circle, railway gate traffic, or underpass flooding before you leave home.
        </p>
      </div>

      {/* Origin / Destination Search Form */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-5 shadow-bubble">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 bg-brand-surface border border-brand-border rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Starting Point (Origin in Belagavi)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Tilakwadi 2nd Gate or Udyambag..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-4 bg-brand-surface border border-brand-border rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="w-full">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Destination (Belagavi / Surroundings)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Belagavi Fort, VTU, or Sambra Airport..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-brand-surface border border-brand-border rounded-2xl px-3.5 py-2.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              Departure Window
            </label>
            <select
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 outline-none cursor-pointer"
            >
              <option value="Now (09:00 AM IST)">Now (09:00 AM IST)</option>
              <option value="In 30 Minutes">In 30 Minutes</option>
              <option value="In 1 Hour">In 1 Hour</option>
              <option value="Evening Rush (06:00 PM IST)">Evening Rush (06:00 PM IST)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-bubble flex items-center justify-center gap-2 transition-all active:scale-95"
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
          <div className="bg-brand-card border border-brand-border rounded-3xl p-5 shadow-bubble space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                  BOTTLENECK DETECTED IN BELAGAVI
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Direct path disrupted near Chennamma Circle
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                +25m Delay
              </span>
            </div>

            {/* Travel Time Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setActiveTab('affected')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'affected'
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-glow-rose'
                    : 'bg-brand-surface border-brand-border'
                }`}
              >
                <div className="text-[11px] text-slate-400 font-medium">Direct Corridor</div>
                <div className="text-xl font-black text-rose-400 mt-1">41 mins</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Via Chennamma Circle (Drain blockage)</div>
              </div>

              <div 
                onClick={() => setActiveTab('alternative')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === 'alternative'
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-glow-emerald'
                    : 'bg-brand-surface border-brand-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-bold">Camp Bypass</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400 mt-1">16 mins</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Saves ~25 mins via Golf Course Rd</div>
              </div>
            </div>

            {/* Save Route Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleSaveRoute}
                disabled={isSaved}
                className="px-4 py-2.5 rounded-2xl bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                <Bookmark className="w-3.5 h-3.5 text-brand-accent" />
                <span>{isSaved ? 'Route Saved to Belagavi Profile!' : 'Save This Route for Belagavi Alerts'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Step Cards based on selected tab */}
          {activeTab === 'affected' ? (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-5 shadow-bubble space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Active Hazards on Direct Corridor</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-brand-surface border border-rose-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Rani Chennamma Circle Culvert Repair</span>
                    <SeverityBadge severity="critical" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Drainage overhaul blocking two main lanes towards College Road. Severe tailback.
                  </p>
                  <div className="text-[10px] text-rose-400 font-bold">
                    Adds approximately +18 mins
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-surface border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Bogarves Bridge Approach Potholes</span>
                    <SeverityBadge severity="high" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Sharp bitumen cavity near railway crossing. Vehicles braking abruptly.
                  </p>
                  <div className="text-[10px] text-amber-400 font-bold">
                    Adds approximately +7 mins
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-5 shadow-bubble space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Clear Alternative Corridor (Camp / Golf Course)</span>
                </h4>
                <span className="text-[11px] text-slate-400">Zero reported incidents</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-2xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-white">Depart Tilakwadi via Khanapur Road</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Smooth flow passing 1st/2nd Gate junctions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-2xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-white">Take Cantonment Camp Road to Fort Lake</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Completely avoids Chennamma Circle gridlock.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-brand-surface rounded-2xl border border-brand-border">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-white">Arrive at Belagavi Fort & Hospital Complex</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Estimated arrival: On schedule in 16 mins.</p>
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
