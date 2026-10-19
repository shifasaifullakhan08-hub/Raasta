import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Heart, Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, selectedCity, isDemoMode, setIsDemoMode } = useApp();

  return (
    <footer className="bg-brand-darkest border-t border-brand-border text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-brand-cyan" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">RAASTA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Know the road before you go. Raasta combines official highways authority telemetry with real-time community validation to prevent travel disruption.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Current Metro: <strong className="text-white">{selectedCity.name}</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('map')} className="hover:text-brand-cyan transition-colors">
                  Interactive Road Map
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('alerts')} className="hover:text-brand-cyan transition-colors">
                  Active Road Closures & Alerts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('check-route')} className="hover:text-brand-cyan transition-colors">
                  Check Journey Route
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('report')} className="hover:text-brand-cyan transition-colors">
                  Report a Road Issue
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-brand-cyan transition-colors">
                  Commuter Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Trust & Data Integrity</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-brand-cyan transition-colors">
                  How Raasta Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('about')} className="hover:text-brand-cyan transition-colors">
                  Project Mission & Background
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('faq')} className="hover:text-brand-cyan transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-brand-cyan transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div className="bg-brand-card border border-brand-border p-5 rounded-3xl space-y-3 shadow-bubble">
            <div className="flex items-center gap-2 text-brand-accent">
              <Shield className="w-4 h-4" />
              <span className="font-bold text-white text-xs">Verified Road Platform</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time road incident alerts, community verification protocols, and alternative routing across active municipal corridors.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Raasta Mobility Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Configurable Launch City Architecture</span>
            <span>&bull;</span>
            <span>Multi-source Verification Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
