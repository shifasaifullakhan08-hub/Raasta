import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { IncidentDetailDrawer } from '../components/map/IncidentDetailDrawer';
import { CategoryIcon, CategoryBadge, SeverityBadge, StatusBadge } from '../components/common/Badges';
import { IncidentCategory, IncidentSeverity, VerificationStatus } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  PlusCircle, 
  SlidersHorizontal, 
  Layers, 
  RefreshCw,
  Clock,
  X
} from 'lucide-react';

export const MapExplorerPage: React.FC = () => {
  const { 
    incidents, 
    selectedCity, 
    selectedIncident, 
    setSelectedIncident,
    setCurrentView
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(true);

  // Filter incidents for this city
  const cityIncidents = incidents.filter(i => i.city === selectedCity.id);

  const filteredIncidents = cityIncidents.filter(inc => {
    if (categoryFilter !== 'all' && inc.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoad = inc.roadName.toLowerCase().includes(q);
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchArea = inc.area.toLowerCase().includes(q);
      if (!matchRoad && !matchTitle && !matchArea) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setCategoryFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col overflow-hidden relative">
      {/* Top Filter and Search Bar */}
      <div className="bg-brand-card/95 border-b border-brand-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search roads or areas in ${selectedCity.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-brand-surface border border-brand-border text-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-600"
          >
            <option value="all">All Disruption Types</option>
            <option value="roadblock">Roadblocks & Closures</option>
            <option value="maintenance">Maintenance Works</option>
            <option value="pothole">Potholes & Broken Tarmac</option>
            <option value="diversion">One-Way / Diversions</option>
            <option value="flooding">Flooding & Waterlogging</option>
          </select>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-brand-surface border border-brand-border text-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-600"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Priority</option>
            <option value="moderate">Moderate</option>
            <option value="minor">Minor</option>
          </select>

          {/* Verification Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-surface border border-brand-border text-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-slate-600 hidden sm:block"
          >
            <option value="all">All Statuses</option>
            <option value="officially_confirmed">Officially Confirmed</option>
            <option value="verified">Verified</option>
            <option value="community_reported">Community Confirmed</option>
            <option value="resolved">Resolved</option>
          </select>

          {(categoryFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-xs text-brand-accent hover:underline flex items-center gap-1 px-2 py-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('report')}
            className="ml-auto px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Report</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Side Panel */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* The Leaflet Map taking full view */}
        <div className="flex-1 h-full">
          <InteractiveMap
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setSidePanelOpen(true);
            }}
            className="w-full h-full rounded-none border-none"
          />
        </div>

        {/* Collapsible Left/Right Side Panel */}
        {sidePanelOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-brand-darkest/95 backdrop-blur-md border-l border-brand-border z-30 flex flex-col shadow-2xl">
            {selectedIncident ? (
              <div className="p-4 h-full overflow-y-auto">
                <IncidentDetailDrawer
                  incident={selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-brand-border flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-cyan" />
                      <span>{filteredIncidents.length} Road Disruptions</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Showing active conditions in {selectedCity.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSidePanelOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-brand-surface"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* List of Incidents in Side Panel */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {filteredIncidents.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      No road disruptions matching selected filters.
                      <div className="mt-2">
                        <button
                          onClick={clearFilters}
                          className="text-brand-accent hover:underline font-semibold"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredIncidents.map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className="p-3 rounded-xl bg-brand-card/90 border border-brand-border hover:border-slate-500 cursor-pointer transition-all duration-150 group shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <CategoryBadge category={inc.category} />
                          <SeverityBadge severity={inc.severity} />
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug">
                          {inc.title}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{inc.roadName}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-brand-border/40">
                          <StatusBadge status={inc.status} />
                          <span>+{inc.estimatedDelayMinutes || 10}m delay</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating toggle button when side panel is closed */}
        {!sidePanelOpen && (
          <button
            onClick={() => setSidePanelOpen(true)}
            className="absolute right-4 top-4 z-20 px-3.5 py-2 bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-xl text-xs font-semibold text-white shadow-xl hover:bg-brand-surface flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-brand-cyan" />
            <span>Show Incident List ({filteredIncidents.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};
