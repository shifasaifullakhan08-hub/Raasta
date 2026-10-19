import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Compass
} from 'lucide-react';
import { IncidentCategory } from '../../types';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, selectedCity, addRoute, updateProfile } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [homeAddress, setHomeAddress] = useState('Woodcote Way, Caversham');
  const [workAddress, setWorkAddress] = useState('Green Park Business Park');
  const [departureTime, setDepartureTime] = useState('08:15');
  const [selectedCategories, setSelectedCategories] = useState<IncidentCategory[]>([
    'roadblock', 'maintenance', 'pothole', 'flooding'
  ]);

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    // Save route
    addRoute({
      name: 'Daily Commute (Home to Work)',
      origin: {
        id: `p-${Date.now()}`,
        label: 'Home',
        address: homeAddress,
        coordinates: [selectedCity.center[0] + 0.015, selectedCity.center[1] - 0.012]
      },
      destination: {
        id: `p-${Date.now() + 1}`,
        label: 'Work',
        address: workAddress,
        coordinates: [selectedCity.center[0] - 0.020, selectedCity.center[1] + 0.015]
      },
      isFavorite: true,
      notificationsEnabled: true,
      preferredDepartureTime: departureTime,
      estimatedDurationMins: 22,
      distanceKm: 8.4
    });

    // Update preferences
    updateProfile({
      hasCompletedOnboarding: true,
      notificationPreferences: {
        email: true,
        push: true,
        inApp: true,
        criticalOnly: false,
        categories: selectedCategories
      }
    });

    setIsOnboardingOpen(false);
  };

  const toggleCategory = (cat: IncidentCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-brand-border bg-brand-surface/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/20 text-brand-cyan border border-brand-primary/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Welcome to Raasta &bull; Step {step} of 4
              </h2>
              <p className="text-[11px] text-slate-400">Personalize your road awareness in {selectedCity.name}</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-brand-darkest h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Set Your Starting Location</h3>
                <p className="text-xs text-slate-300">
                  Where do you usually depart from for your morning commute or daily travel?
                </p>
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-xl p-3.5 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Home or Departure Area</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Enter street, suburb or postal code..."
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Add Frequent Destination</h3>
                <p className="text-xs text-slate-300">
                  Enter your office, college campus, or frequent workplace to monitor.
                </p>
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-xl p-3.5 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Destination Address</label>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-rose-400 shrink-0" />
                  <input
                    type="text"
                    value={workAddress}
                    onChange={(e) => setWorkAddress(e.target.value)}
                    placeholder="e.g. Green Park Business Park or University"
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border rounded-xl p-3.5 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Usual Morning Departure Window</label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Choose Incident Categories</h3>
                <p className="text-xs text-slate-300">
                  Select which conditions should trigger high-priority alerts on your route:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'roadblock', label: 'Emergency Roadblocks' },
                  { id: 'maintenance', label: 'Scheduled Maintenance' },
                  { id: 'pothole', label: 'Potholes & Broken Tarmac' },
                  { id: 'diversion', label: 'Sudden Detours / Diversions' },
                  { id: 'flooding', label: 'Flooding & Deep Water' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCategory(item.id as IncidentCategory)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      selectedCategories.includes(item.id as IncidentCategory)
                        ? 'bg-brand-primary/10 border-brand-primary text-white shadow-glow-cyan'
                        : 'bg-brand-surface border-brand-border text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-emerald">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">You're All Set!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Raasta will continuously track your commute between <strong className="text-white">{homeAddress}</strong> and <strong className="text-white">{workAddress}</strong> in {selectedCity.name}.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-brand-border bg-brand-surface/40 flex items-center justify-between">
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Skip for now
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-brand-surface"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Launch Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
