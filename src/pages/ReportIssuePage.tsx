import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { CategoryIcon } from '../components/common/Badges';
import { IncidentCategory, IncidentSeverity } from '../types';
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Info, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportIssuePage: React.FC = () => {
  const { selectedCity, addReport, setCurrentView, user } = useApp();

  const [category, setCategory] = useState<IncidentCategory>('pothole');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [roadName, setRoadName] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [pinCoords, setPinCoords] = useState<[number, number]>(selectedCity.center);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const categories: { id: IncidentCategory; label: string; desc: string }[] = [
    { id: 'roadblock', label: 'Roadblock / Full Closure', desc: 'Fallen trees, police barricade, accident' },
    { id: 'maintenance', label: 'Emergency or Unmarked Works', desc: 'Open trenches, utility works, missing signs' },
    { id: 'pothole', label: 'Hazardous Pothole', desc: 'Cavity deep enough to cause vehicle or rim damage' },
    { id: 'diversion', label: 'Sudden Diversion / One-Way', desc: 'Unannounced detour or traffic reversal' },
    { id: 'flooding', label: 'Submerged Road / Flash Flood', desc: 'Water depth impassable or hazardous for vehicles' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadName.trim() || !description.trim()) return;

    const refId = addReport({
      title: `${category.toUpperCase()}: ${roadName.trim()}`,
      category,
      severity,
      status: 'pending_review',
      roadName: roadName.trim(),
      area: area.trim() || `${selectedCity.name} Central`,
      city: selectedCity.id,
      coordinates: pinCoords,
      description: description.trim(),
      imageUrl: imagePreview || undefined,
      sourceType: 'community',
      sourceName: user ? `Citizen: ${user.fullName}` : 'Anonymous Verified Citizen',
      isDemo: false,
      estimatedDelayMinutes: severity === 'critical' ? 25 : severity === 'high' ? 15 : 5
    });

    setSubmittedRef(refId);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>COMMUNITY ROAD OBSERVATION DESK</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Report a Road Issue or Hazard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Help fellow motorists, cyclists, and pedestrians avoid dangerous roadblocks and damaged tarmac in {selectedCity.name}.
        </p>
      </div>

      {submittedRef ? (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-emerald">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Report Submitted to Operations</h2>
            <p className="text-xs text-slate-400">
              Reference Tracker ID: <strong className="text-brand-cyan font-mono">#{submittedRef}</strong>
            </p>
          </div>

          <div className="max-w-md mx-auto bg-brand-surface/70 border border-brand-border p-4 rounded-xl text-xs text-slate-300 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Road Location:</span>
              <span className="font-semibold text-white">{roadName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Status:</span>
              <span className="text-amber-400 font-medium">Pending Review & Validation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Metro:</span>
              <span className="font-semibold text-white">{selectedCity.name}</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-brand-border/60">
              Your submission is immediately queued in the Traffic Ops moderation console and displayed on the community layer.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('map')}
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs transition-colors"
            >
              View on Live Map
            </button>
            <button
              onClick={() => {
                setSubmittedRef(null);
                setRoadName('');
                setDescription('');
                setImagePreview(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-brand-border transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl space-y-6">
          {/* 1. Incident Category */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              1. What type of road condition or hazard is it?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    category === cat.id
                      ? 'bg-brand-primary/10 border-brand-primary shadow-glow-cyan'
                      : 'bg-brand-surface/50 border-brand-border hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon category={cat.id} className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">{cat.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Interactive Map Pin & Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                2. Pinpoint Exact Location on Map
              </label>
              <span className="text-[11px] text-slate-400">Click anywhere on the map to position pin</span>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-brand-border">
              <InteractiveMap
                incidents={[]}
                pinLocation={pinCoords}
                onMapClick={(coords) => setPinCoords(coords)}
                className="w-full h-full"
                zoomLevel={14}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                  Road / Highway Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A329 Kings Road or Bath Road junction"
                  value={roadName}
                  onChange={(e) => setRoadName(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                  Neighborhood / Locality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Caversham or West Reading"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Severity & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 space-y-1">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Severity Impact
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-brand-surface border border-brand-border text-xs sm:text-sm text-white rounded-xl px-3 py-2.5 outline-none cursor-pointer"
              >
                <option value="critical">Critical (Impassable / Full blockage)</option>
                <option value="high">High (Dangerous / Damage risk)</option>
                <option value="moderate">Moderate (Slow queue / 1 lane open)</option>
                <option value="minor">Minor (Caution only)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Description & Guidance <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what you see: depth of water, lane affected, emergency services on site, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border text-xs sm:text-sm text-white rounded-xl p-3 placeholder-slate-500 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
          </div>

          {/* 4. Photo Evidence (Optional) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Photo Evidence (Optional)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="cursor-pointer px-4 py-3 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-300 border border-dashed border-brand-border hover:border-slate-400 text-xs font-semibold flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-brand-cyan" />
                <span>Upload Camera Snapshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 text-[10px]"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Abuse prevention notice */}
          <div className="bg-brand-surface/40 border border-brand-border/60 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <span>
              All submissions are subject to Raasta's anti-abuse heuristics. False or spam reports will lead to temporary IP suspension.
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Submit Report for Operations Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
