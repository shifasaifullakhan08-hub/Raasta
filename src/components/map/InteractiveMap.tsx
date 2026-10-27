import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RoadIncident } from '../../types';
import { useApp } from '../../context/AppContext';
import { Layers, Key, ShieldCheck, MapPin } from 'lucide-react';

// Helper to create high-contrast custom SVG markers matching the reference image
const createCustomIcon = (category: string, severity: string, isSelected: boolean) => {
  let bgColor = '#10B981'; // Green default
  let iconSvg = '';

  if (category === 'roadblock') {
    bgColor = '#EF4444'; // Red
    iconSvg = `<circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="2.5"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2.5"/>`;
  } else if (category === 'maintenance') {
    bgColor = '#F59E0B'; // Amber
    iconSvg = `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="white"/>`;
  } else if (category === 'pothole') {
    bgColor = '#F97316'; // Orange
    iconSvg = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="white"/><line x1="12" y1="9" x2="12" y2="13" stroke="#1E293B" stroke-width="2"/><circle cx="12" cy="17" r="1" fill="#1E293B"/>`;
  } else if (category === 'diversion') {
    bgColor = '#3B82F6'; // Blue
    iconSvg = `<polyline points="16 3 21 3 21 8" stroke="white" stroke-width="2" fill="none"/><line x1="4" y1="20" x2="21" y2="3" stroke="white" stroke-width="2"/><polyline points="21 16 21 21 16 21" stroke="white" stroke-width="2" fill="none"/><line x1="15" y1="15" x2="21" y2="21" stroke="white" stroke-width="2"/>`;
  } else if (category === 'flooding') {
    bgColor = '#06B6D4'; // Cyan
    iconSvg = `<path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" stroke="white" stroke-width="2" fill="none"/>`;
  } else {
    // Traffic light / sensor icon
    bgColor = '#10B981';
    iconSvg = `<rect x="7" y="2" width="10" height="20" rx="4" fill="#0B111E"/><circle cx="12" cy="6" r="2" fill="#EF4444"/><circle cx="12" cy="12" r="2" fill="#F59E0B"/><circle cx="12" cy="18" r="2" fill="#10B981"/>`;
  }

  const pulseRing = severity === 'critical' ? `<span class="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-75"></span>` : '';
  const selectedBorder = isSelected ? 'border-4 border-white scale-125 z-50 shadow-glow-cyan' : 'border-2 border-slate-900';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200">
      ${pulseRing}
      <div style="background-color: ${bgColor};" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${selectedBorder}">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          ${iconSvg}
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-road-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

interface InteractiveMapProps {
  incidents: RoadIncident[];
  onSelectIncident?: (incident: RoadIncident) => void;
  selectedIncident?: RoadIncident | null;
  onMapClick?: (coords: [number, number]) => void;
  pinLocation?: [number, number] | null;
  showRoutes?: boolean;
  activeRouteGeometry?: [number, number][];
  className?: string;
  zoomLevel?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  incidents,
  onSelectIncident,
  selectedIncident,
  onMapClick,
  pinLocation,
  activeRouteGeometry,
  className = "w-full h-full min-h-[500px]",
  zoomLevel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const { selectedCity } = useApp();

  // Map Tile Style & API Key state
  const [mapStyle, setMapStyle] = useState<'carto-dark' | 'osm' | 'google-live'>('carto-dark');
  const [googleApiKey, setGoogleApiKey] = useState<string>(() => localStorage.getItem('raasta_gmaps_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: selectedCity.center,
        zoom: zoomLevel || selectedCity.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter / Positron tiles without requiring an API key, fallback to OpenStreetMap
      const defaultTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);
      tileLayerRef.current = defaultTile;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick([e.latlng.lat, e.latlng.lng]);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Style Switcher (Standard OSM, CartoDB Light/Dark, or Google Maps Tiles with API key)
  const switchMapStyle = (style: 'carto-dark' | 'osm' | 'google-live') => {
    setMapStyle(style);
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options: L.TileLayerOptions = { maxZoom: 19, subdomains: ['a', 'b', 'c'] };

    if (style === 'carto-dark') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      options = { maxZoom: 19, subdomains: 'abcd' };
    } else if (style === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      options = { maxZoom: 19, subdomains: ['a', 'b', 'c'] };
    } else if (style === 'google-live') {
      // Google Maps live traffic tiles / roadmap tiles
      const key = googleApiKey.trim() || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
      if (key) {
        url = `https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}&key=${key}`;
        options = { maxZoom: 20 };
      } else {
        url = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        options = { maxZoom: 20 };
      }
    }

    tileLayerRef.current = L.tileLayer(url, options).addTo(mapInstanceRef.current);
  };

  const saveApiKey = (key: string) => {
    setGoogleApiKey(key);
    localStorage.setItem('raasta_gmaps_key', key);
    if (mapStyle === 'google-live') {
      switchMapStyle('google-live');
    }
  };

  // Update center when city changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(selectedCity.center, zoomLevel || selectedCity.zoom);
    }
  }, [selectedCity, zoomLevel]);

  // Center on selected incident
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedIncident.coordinates, 15, {
        duration: 1.2
      });
    }
  }, [selectedIncident]);

  // Render Incident Markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    incidents.forEach(incident => {
      const isSelected = selectedIncident?.id === incident.id;
      const icon = createCustomIcon(incident.category, incident.severity, isSelected);

      const marker = L.marker(incident.coordinates, { icon });

      marker.on('click', () => {
        if (onSelectIncident) {
          onSelectIncident(incident);
        }
      });

      marker.bindTooltip(`
        <div class="font-sans text-xs font-semibold text-slate-800">
          <div>${incident.title}</div>
          <div class="text-[10px] text-slate-500 capitalize">${incident.category} &bull; ${incident.severity}</div>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.addTo(markersLayerRef.current!);
    });
  }, [incidents, selectedIncident, onSelectIncident]);

  // Render Pin marker if map picker is active
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }

    if (pinLocation) {
      const pinIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center animate-bounce">
            <div class="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-glow-rose border-2 border-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
        `,
        className: 'pin-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      pinMarkerRef.current = L.marker(pinLocation, { icon: pinIcon }).addTo(mapInstanceRef.current);
    }
  }, [pinLocation]);

  // Render Route geometry
  useEffect(() => {
    if (!routeLayerRef.current || !mapInstanceRef.current) return;
    routeLayerRef.current.clearLayers();

    if (activeRouteGeometry && activeRouteGeometry.length > 1) {
      const polyline = L.polyline(activeRouteGeometry, {
        color: '#2563EB',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      });

      const glowLine = L.polyline(activeRouteGeometry, {
        color: '#60A5FA',
        weight: 12,
        opacity: 0.3,
        lineCap: 'round'
      });

      glowLine.addTo(routeLayerRef.current);
      polyline.addTo(routeLayerRef.current);

      const startIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">A</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(activeRouteGeometry[0], { icon: startIcon }).addTo(routeLayerRef.current);

      const endIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">B</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(activeRouteGeometry[activeRouteGeometry.length - 1], { icon: endIcon }).addTo(routeLayerRef.current);

      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [activeRouteGeometry]);

  return (
    <div className={`relative ${className} overflow-hidden rounded-3xl border border-brand-border shadow-bubble`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* Map Overlay Controls / Telemetry Badge */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-brand-darkest/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-brand-border shadow-bubble flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              {selectedCity.name}, Karnataka
            </span>
          </div>
          <span className="text-[11px] text-brand-accent font-mono">
            {incidents.length} Active Hazards
          </span>
        </div>

        {/* Live Map Tile Layer Switcher */}
        <div className="bg-brand-darkest/90 backdrop-blur-md p-1.5 rounded-2xl border border-brand-border shadow-bubble flex items-center gap-1 text-[11px]">
          <button
            onClick={() => switchMapStyle('carto-dark')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
              mapStyle === 'carto-dark' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark Carto
          </button>
          <button
            onClick={() => switchMapStyle('google-live')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition-all flex items-center gap-1 ${
              mapStyle === 'google-live' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Live Traffic</span>
          </button>
          <button
            onClick={() => switchMapStyle('osm')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition-all ${
              mapStyle === 'osm' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            OSM
          </button>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-1 rounded-lg text-slate-400 hover:text-amber-400 transition-colors ml-1"
            title="Configure Map API Key"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Optional Custom API Key Modal/Input Popover */}
        {showKeyInput && (
          <div className="bg-brand-card/95 backdrop-blur-md p-3 rounded-2xl border border-brand-border shadow-2xl w-64 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Live Map API Key
              </span>
              <button onClick={() => setShowKeyInput(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Enter your Google Maps or Mapbox API key for live traffic & satellite layers in Belagavi.
            </p>
            <input
              type="password"
              placeholder="Paste Maps API Key..."
              value={googleApiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
            {googleApiKey && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Key active & saved in browser
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
