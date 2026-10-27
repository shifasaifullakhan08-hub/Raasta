import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { 
  CloudRain, 
  Sun,
  Cloud,
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
  Bookmark,
  Thermometer
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

  // Live Weather & Time State for Belagavi, Karnataka
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [liveWeather, setLiveWeather] = useState<{
    temperature: number;
    windspeed: number;
    weatherCode: number;
    conditionText: string;
    roadGrip: number;
    surfaceCondition: string;
  }>({
    temperature: 28,
    windspeed: 14,
    weatherCode: 1,
    conditionText: 'Clear Skies',
    roadGrip: 94,
    surfaceCondition: 'Dry Tarmac (Optimal)'
  });

  // Clock tick every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time weather from Open-Meteo for Belagavi (Lat: 15.8497, Lng: 74.4977)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=15.8497&longitude=74.4977&current_weather=true');
        if (res.ok) {
          const data = await res.json();
          const cw = data.current_weather;
          if (cw) {
            let cond = 'Clear / Sunny';
            let grip = 95;
            let surface = 'Dry & High Traction';

            // Weather code evaluation (WMO standard)
            if (cw.weathercode >= 51 && cw.weathercode <= 67) {
              cond = 'Rain Showers';
              grip = 74;
              surface = 'Wet Tarmac & Pooling';
            } else if (cw.weathercode >= 80 && cw.weathercode <= 99) {
              cond = 'Thunderstorm / Heavy Rain';
              grip = 62;
              surface = 'Slippery & Waterlogged Dips';
            } else if (cw.weathercode >= 1 && cw.weathercode <= 3) {
              cond = 'Partly Cloudy';
              grip = 92;
              surface = 'Dry Tarmac (Safe)';
            } else if (cw.weathercode >= 45 && cw.weathercode <= 48) {
              cond = 'Hazy / Foggy';
              grip = 86;
              surface = 'Moist Surface / Low Visibility';
            }

            setLiveWeather({
              temperature: Math.round(cw.temperature),
              windspeed: Math.round(cw.windspeed),
              weatherCode: cw.weathercode,
              conditionText: cond,
              roadGrip: grip,
              surfaceCondition: surface
            });
          }
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // refresh every 10 mins
    return () => clearInterval(interval);
  }, []);

  const cityIncidents = incidents.filter(i => i.city === selectedCity.id && i.status !== 'resolved');
  const criticalCount = cityIncidents.filter(i => i.severity === 'critical').length;
  const highCount = cityIncidents.filter(i => i.severity === 'high').length;

  // Format greeting based on current local time
  const hours = currentTime.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Header Banner with Live Time for Belagavi */}
      <div className="bg-gradient-to-r from-blue-900/30 via-brand-card to-cyan-950/20 border border-brand-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-bubble">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-accent">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>BELAGAVI MOBILITY MISSION CONTROL &bull; KARNATAKA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {user ? user.fullName.split(' ')[0] : 'Belagavi Commuter'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Live road conditions, real-time weather grip index, and traffic bottlenecks across Belagavi City.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 bg-brand-surface px-3 py-1 rounded-full border border-brand-border text-white">
              <Clock className="w-3.5 h-3.5 text-brand-accent" />
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} IST
            </span>
            <span>&bull;</span>
            <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('check-route')}
            className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-bubble flex items-center gap-2 transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Check Belagavi Journey</span>
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-5 py-2.5 rounded-full bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Configure Routes</span>
          </button>
        </div>
      </div>

      {/* Grid: Live Weather & Surface Grip Dial + Urban Control Telemetry + Daily Route Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Weather Impact Dial Widget for Belagavi */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-bubble relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-brand-accent" />
                <span>Live Belagavi Weather</span>
              </h3>
              <p className="text-[11px] text-slate-400">Road grip & tarmac condition</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
              {liveWeather.conditionText}
            </span>
          </div>

          {/* Circular dial widget with live API values */}
          <div className="my-4 relative flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-500/25 flex items-center justify-center relative">
              <div className="absolute -top-1 px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-border text-[10px] text-slate-300 font-mono">
                Wind {liveWeather.windspeed} km/h
              </div>
              <div className="absolute -right-3 px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-border text-[10px] text-slate-300 font-mono">
                Humidity 68%
              </div>
              <div className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-brand-surface border border-brand-border text-[10px] text-slate-300 font-mono">
                Grip {liveWeather.roadGrip}%
              </div>

              {/* Center capsule */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-brand-surface to-[#121418] border border-cyan-500/40 shadow-glow-cyan flex flex-col items-center justify-center text-center p-2">
                {liveWeather.weatherCode >= 51 ? (
                  <CloudRain className="w-6 h-6 text-brand-cyan mb-1 animate-bounce" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-400 mb-1 animate-pulse" />
                )}
                <span className="text-2xl font-black text-white">{liveWeather.temperature}°C</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Belagavi</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-3 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>{liveWeather.surfaceCondition}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold font-mono">Index {liveWeather.roadGrip}%</span>
          </div>
        </div>

        {/* Belagavi Traffic Controller & Junction Telemetry */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-bubble space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Belagavi Smart City Traffic Desk
              </h3>
              <p className="text-[11px] text-slate-400">Chennamma Circle & NH-48 Telemetry</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              Live Feed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl">
              <span className="text-xl font-black text-rose-500 block">{criticalCount}</span>
              <span className="font-semibold text-slate-200">Active Roadblocks</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Chennamma / Old PB RUB</span>
            </div>

            <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl">
              <span className="text-xl font-black text-amber-400 block">{highCount}</span>
              <span className="font-semibold text-slate-200">High Risk Hazards</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Tilakwadi 1st Gate potholes</span>
            </div>

            <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl">
              <span className="text-xl font-black text-emerald-400 block">48</span>
              <span className="font-semibold text-slate-200">Signals Operational</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">BSCL Adaptive system</span>
            </div>

            <div className="bg-brand-surface border border-brand-border p-3.5 rounded-2xl">
              <span className="text-xl font-black text-blue-400 block">0</span>
              <span className="font-semibold text-slate-200">Pending Emergencies</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Police wardens active</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('map')}
              className="w-full py-2.5 rounded-2xl bg-brand-surface hover:bg-slate-700 text-slate-200 border border-brand-border text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-accent" />
              <span>Explore Live Belagavi Map</span>
            </button>
          </div>
        </div>

        {/* Belagavi Daily Route Health */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-bubble space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Daily Route Health
              </h3>
              <p className="text-[11px] text-slate-400">Monitoring saved Belagavi corridors</p>
            </div>
            <button
              onClick={() => setCurrentView('routes')}
              className="text-xs text-brand-accent hover:underline font-bold"
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
                className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border hover:border-slate-500 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-brand-accent transition-colors truncate max-w-[180px]">
                    {r.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 shrink-0">
                    Disruption (+25m)
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{r.origin.label} &rarr; {r.destination.label}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-brand-border/40">
                  <span>Departure: {r.preferredDepartureTime || '08:45 AM'}</span>
                  <span className="text-emerald-400 font-semibold">Bypass Available</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('report')}
            className="w-full py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Spotted a Belagavi Road Hazard? Report It</span>
          </button>
        </div>
      </div>

      {/* Relevant Personalized Alerts Feed */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-bubble space-y-5">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Active Alerts on Belagavi Commute Corridors
            </h3>
            <p className="text-xs text-slate-400">
              Filtered based on registered routes in Tilakwadi, Camp, Fort Area & Old City
            </p>
          </div>
          <button
            onClick={() => setCurrentView('alerts')}
            className="text-xs text-brand-accent hover:underline font-bold"
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
              className="p-4 rounded-2xl bg-brand-surface border border-brand-border hover:border-slate-500 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <CategoryBadge category={inc.category} />
                <SeverityBadge severity={inc.severity} />
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                {inc.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span className="truncate">{inc.roadName}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-brand-border/50">
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
