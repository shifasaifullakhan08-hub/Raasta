import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Compass, Users, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const StaticPages: React.FC<{ type: 'how-it-works' | 'about' | 'faq' | 'privacy' }> = ({ type }) => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {type === 'how-it-works' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-brand-accent tracking-widest">
              Platform Architecture
            </span>
            <h1 className="text-3xl font-extrabold text-white">How Raasta Works</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Raasta is built to eliminate road travel uncertainty by bridging municipal telemetry feeds with verified community reports.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-brand-cyan text-xs flex items-center justify-center font-bold">1</span>
                <span>Data Ingestion from Multiple Sources</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We ingest data from municipal traffic control services (like SCOOT controllers, emergency pipe burst logs, and environmental flood sensors) as well as citizen commuter reports.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
                <span>Verification and Anti-Abuse Heuristics</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No single unvetted claim triggers emergency alarms. Newly reported incidents require either verified status from authorized moderators or independent confirmations from multiple local motorists.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">3</span>
                <span>Personalized Delivery & Alternative Routing</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than bombarding users with irrelevant citywide sirens, Raasta filters notifications by your exact saved corridor and estimated departure time, providing viable alternate paths before you set off.
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'about' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-brand-accent tracking-widest">
              Our Mission
            </span>
            <h1 className="text-3xl font-extrabold text-white">About Raasta</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every day, millions of travelers, delivery partners, students, and families waste hours sitting in unpredictable road gridlocks caused by unannounced utility excavations, sudden flash floods, and broken tarmac.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Raasta ("The Path") was founded on a simple principle: <strong>Know the road before you go.</strong>
            </p>
            <p>
              By combining real-time municipal telemetry with grassroots citizen participation, we provide an intuitive early warning system designed for mobile devices and modern desktop dashboards.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('map')}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow flex items-center gap-2"
              >
                <span>Explore the Live Prototype</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {type === 'faq' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h1>
          <div className="space-y-4">
            <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-sm">How is Raasta different from standard navigation apps?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standard GPS maps typically react to traffic slow-downs after thousands of cars have already piled up. Raasta alerts you before departure regarding planned maintenance, water main works, and community-flagged potholes with verified evidence.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-sm">Can I use Raasta as a guest without creating an account?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes! You can explore the interactive road map, check any journey corridor, and even submit community road reports as an anonymous citizen. Creating an account lets you save routes and receive proactive alerts.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-sm">How do you prevent spam or fake reports?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submissions start in a "Pending Review" status. Reports require multi-user consensus or moderator sign-off before being elevated to "Verified" or "Officially Confirmed".
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'privacy' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy & Terms</h1>
          <div className="bg-brand-card border border-brand-border p-6 rounded-2xl space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              At Raasta, we believe privacy is fundamental. We do not track background GPS location when you are not actively interacting with the map.
            </p>
            <p>
              Your saved places (such as Home and Work addresses) are used strictly for matching relevant road disruptions on your corridor and are never shared or sold to advertising networks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
