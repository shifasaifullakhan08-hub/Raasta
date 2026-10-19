import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  Share2, 
  ShieldCheck, 
  ChevronRight,
  PlusCircle,
  ThumbsUp
} from 'lucide-react';
import { IncidentCategory } from '../types';

export const RoadAlertsPage: React.FC = () => {
  const { 
    incidents, 
    selectedCity, 
    setSelectedIncident, 
    setCurrentView,
    checkJourneyRoute,
    addConfirmation
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSeverity, setActiveSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cityIncidents = incidents.filter(i => i.city === selectedCity.id);

  const filteredIncidents = cityIncidents.filter(inc => {
    if (activeCategory !== 'all' && inc.category !== activeCategory) return false;
    if (activeSeverity !== 'all' && inc.severity !== activeSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoad = inc.roadName.toLowerCase().includes(q);
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchArea = inc.area.toLowerCase().includes(q);
      if (!matchRoad && !matchTitle && !matchArea) return false;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Alerts' },
    { id: 'roadblock', label: 'Roadblocks' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'pothole', label: 'Potholes' },
    { id: 'diversion', label: 'Diversions' },
    { id: 'flooding', label: 'Flooding' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-accent font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>METRO FEED: {selectedCity.name.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Active Road Alerts & Disruptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showing verified roadblocks, scheduled works, damaged roads, and weather impacts.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 self-start md:self-auto transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Road Issue</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={`Search alerts by road name, area or keyword...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">Severity:</span>
            <select
              value={activeSeverity}
              onChange={(e) => setActiveSeverity(e.target.value)}
              className="bg-brand-surface border border-brand-border text-xs text-slate-200 rounded-xl px-3 py-2 outline-none w-full sm:w-auto cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Closures</option>
              <option value="high">High Priority</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor Cautions</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-primary text-white shadow-md shadow-blue-500/20'
                  : 'bg-brand-surface hover:bg-slate-700 text-slate-300 border border-brand-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-20 bg-brand-card/50 border border-brand-border rounded-2xl text-slate-400">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-white">No matching alerts found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or category filters.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              className="bg-brand-card border border-brand-border hover:border-slate-500/80 rounded-2xl p-5 shadow-xl transition-all duration-200 space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={inc.category} />
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reported {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Title and location */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {inc.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span className="font-semibold">{inc.roadName}</span>
                  <span className="text-slate-500">&bull;</span>
                  <span>{inc.area}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {inc.description}
              </p>

              {/* Impact and Actions Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Estimated Delay</span>
                    <strong className="text-amber-400">+{inc.estimatedDelayMinutes || 10} mins</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Community Trust</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {inc.confirmations.length} Confirmations
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => addConfirmation(inc.id, 'confirm')}
                    className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-slate-700 text-slate-300 border border-brand-border text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirm Still There</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedIncident(inc);
                      setCurrentView('map');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-surface hover:bg-slate-700 text-brand-cyan border border-brand-border text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View on Live Map</span>
                  </button>

                  <button
                    onClick={() => {
                      checkJourneyRoute('My Location', inc.roadName);
                      setCurrentView('check-route');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Check Alternative</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
