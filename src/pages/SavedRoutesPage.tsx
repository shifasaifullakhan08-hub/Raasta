import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation, 
  Plus, 
  Trash2, 
  Star, 
  Bell, 
  BellOff, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SavedRoute } from '../types';

export const SavedRoutesPage: React.FC = () => {
  const { 
    routes, 
    addRoute, 
    deleteRoute, 
    toggleRouteFavorite, 
    toggleRouteAlert,
    checkJourneyRoute,
    setCurrentView,
    selectedCity
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [originLabel, setOriginLabel] = useState('Home');
  const [originAddress, setOriginAddress] = useState('');
  const [destLabel, setDestLabel] = useState('Office');
  const [destAddress, setDestAddress] = useState('');
  const [departureTime, setDepartureTime] = useState('08:30');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originAddress.trim() || !destAddress.trim()) return;

    addRoute({
      name: name.trim() || `${originLabel} to ${destLabel}`,
      origin: {
        id: `p-${Date.now()}`,
        label: originLabel,
        address: originAddress.trim(),
        coordinates: [selectedCity.center[0] + 0.015, selectedCity.center[1] - 0.012]
      },
      destination: {
        id: `p-${Date.now() + 1}`,
        label: destLabel,
        address: destAddress.trim(),
        coordinates: [selectedCity.center[0] - 0.020, selectedCity.center[1] + 0.015]
      },
      isFavorite: false,
      notificationsEnabled: true,
      preferredDepartureTime: departureTime,
      estimatedDurationMins: 20,
      distanceKm: 7.5
    });

    setIsAdding(false);
    setName('');
    setOriginAddress('');
    setDestAddress('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-cyan font-semibold mb-1">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>SAVED TRAVEL CORRIDORS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Routes & Regular Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your daily commutes and configure proactive push / in-app notifications before departure.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Saved Route</span>
        </button>
      </div>

      {/* Add Route Form Modal / Drawer */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Configure New Commute Corridor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Route Nickname
              </label>
              <input
                type="text"
                placeholder="e.g. Home to College"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Origin Place (Address)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Woodcote Way, Caversham"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Destination Place (Address)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Green Park Business Park"
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs shadow-md"
            >
              Save Route & Enable Monitoring
            </button>
          </div>
        </form>
      )}

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-brand-card/40 border border-brand-border rounded-2xl text-slate-400 text-xs">
            No saved routes yet. Add your daily commute to receive proactive alerts before disruptions!
          </div>
        ) : (
          routes.map(r => (
            <div
              key={r.id}
              className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-500 transition-all"
            >
              <div className="flex items-start justify-between gap-2 border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRouteFavorite(r.id)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${r.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {r.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRouteAlert(r.id)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      r.notificationsEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-brand-surface border-brand-border text-slate-500'
                    }`}
                    title={r.notificationsEnabled ? 'Alerts Enabled' : 'Alerts Muted'}
                  >
                    {r.notificationsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => deleteRoute(r.id)}
                    className="p-1.5 rounded-lg bg-brand-surface hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-brand-border transition-colors"
                    title="Delete Route"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Waypoint details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">{r.origin.label}:</span>
                  <span className="text-slate-400 truncate">{r.origin.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-semibold text-white">{r.destination.label}:</span>
                  <span className="text-slate-400 truncate">{r.destination.address}</span>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>~{r.distanceKm || 8.4} km</span>
                  <span>&bull;</span>
                  <span>Standard: {r.estimatedDurationMins || 22}m</span>
                </div>

                <button
                  onClick={() => {
                    checkJourneyRoute(r.origin.address, r.destination.address);
                    setCurrentView('check-route');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <span>Scan Route Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
