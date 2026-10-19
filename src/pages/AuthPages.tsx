import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Mail, Lock, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const AuthPages: React.FC<{ initialMode?: 'login' | 'signup' }> = ({ initialMode = 'login' }) => {
  const { login, setCurrentView, setIsOnboardingOpen } = useApp();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'commuter' | 'moderator' | 'admin'>('commuter');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    login(email, role);
    if (isSignUp) {
      setIsOnboardingOpen(true);
    }
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-0.5 mx-auto shadow-lg shadow-blue-500/25">
            <div className="w-full h-full bg-brand-darkest rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-brand-cyan" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Create your Raasta Account' : 'Welcome Back to Raasta'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp 
              ? 'Get proactive road disruption alerts on your daily routes' 
              : 'Sign in to access your saved routes and notifications'}
          </p>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="bg-brand-surface/60 border border-brand-border/60 p-3 rounded-xl text-xs space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Quick Demo Sign-in:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('alan.harrison@mobility.io');
                setRole('commuter');
              }}
              className="px-2.5 py-1 rounded bg-brand-card hover:bg-slate-700 text-slate-300 text-[11px] border border-brand-border"
            >
              Daily Commuter
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('ops.controller@reading.gov.uk');
                setRole('moderator');
              }}
              className="px-2.5 py-1 rounded bg-brand-card hover:bg-slate-700 text-amber-400 text-[11px] border border-brand-border"
            >
              Traffic Moderator
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@raasta.tech');
                setRole('admin');
              }}
              className="px-2.5 py-1 rounded bg-brand-card hover:bg-slate-700 text-rose-400 text-[11px] border border-brand-border"
            >
              City Administrator
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alan Harrison"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Access Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-brand-surface border border-brand-border text-xs sm:text-sm text-white rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="commuter">Regular Commuter / Motorist</option>
              <option value="moderator">Traffic Moderator / Operator</option>
              <option value="admin">Highways Authority Administrator</option>
            </select>
          </div>

          {isSignUp && (
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="rounded text-brand-primary focus:ring-0"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{isSignUp ? 'Create Account & Continue' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-brand-border/60 text-xs text-slate-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-brand-accent hover:underline font-semibold"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-brand-accent hover:underline font-semibold"
              >
                Sign up free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
