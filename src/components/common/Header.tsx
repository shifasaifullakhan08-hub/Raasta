import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  ShieldAlert, 
  Bell, 
  PlusCircle, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Navigation2, 
  Shield, 
  ChevronDown,
  Layers,
  Sparkles,
  User,
  Check,
  Clock,
  MapPin
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    user, 
    login,
    logout, 
    updateUserRole,
    notifications, 
    setIsOnboardingOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerTime, setHeaderTime] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Live IST Clock for Belagavi in Header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHeaderTime(now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-brand-darkest/95 backdrop-blur-xl border-b border-brand-border/70">
      {/* Main Chrome-like Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-teal-400 p-0.5 shadow-bubble group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-brand-card rounded-full flex items-center justify-center">
              <Compass className="w-6 h-6 text-brand-accent group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                RAASTA
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-brand-surface text-brand-accent border border-brand-border/60">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Know the road before you go.
            </p>
          </div>
        </div>

        {/* Belagavi, Karnataka Live Location & IST Time Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-brand-card/90 border border-brand-border/80 shadow-inner text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-white">Belagavi, Karnataka</span>
          </div>
          <span className="w-1 h-3 border-r border-brand-border/80" />
          <div className="flex items-center gap-1.5 text-slate-300 font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>{headerTime || 'IST'}</span>
          </div>
        </div>

        {/* Central Bubbly Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-brand-card/80 p-1.5 rounded-full border border-brand-border/80 shadow-bubble">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              currentView === 'landing' 
                ? 'text-white bg-brand-surface shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentView('map')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'map' 
                ? 'text-brand-accent bg-brand-surface shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-accent" />
            <span>Explore Map</span>
          </button>

          <button
            onClick={() => setCurrentView('alerts')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'alerts' 
                ? 'text-white bg-brand-surface shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Road Alerts</span>
          </button>

          <button
            onClick={() => setCurrentView('check-route')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'check-route' 
                ? 'text-white bg-brand-surface shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
            }`}
          >
            <Navigation2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Check Route</span>
          </button>

          {user && (
            <>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentView === 'dashboard' 
                    ? 'text-emerald-400 bg-brand-surface shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('routes')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  currentView === 'routes' 
                    ? 'text-white bg-brand-surface shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-brand-surface/50'
                }`}
              >
                Saved Routes
              </button>
            </>
          )}

          {(user?.role === 'moderator' || user?.role === 'admin') && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'admin' 
                  ? 'text-rose-400 bg-rose-500/15' 
                  : 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Ops Console</span>
            </button>
          )}
        </nav>

        {/* Right Corner: Quick Action + Notifications + Chrome-style Profile Icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('report')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-glow-rose hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>

          {/* Notifications Trigger */}
          {user && (
            <button
              onClick={() => setCurrentView('notifications')}
              className="relative p-2.5 rounded-full bg-brand-card hover:bg-brand-surface text-slate-300 hover:text-white border border-brand-border/70 transition-all shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* CHROME-STYLE TOP-RIGHT PROFILE ICON WITH ROLE BADGE */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-brand-card hover:bg-brand-surface border border-brand-border/80 shadow-bubble transition-all duration-200 group active:scale-95"
                title={`${user.fullName} (${user.role})`}
              >
                {/* Circular Chrome-like Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  {user.fullName.charAt(0)}
                </div>

                {/* Role Pill Badge */}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-accent capitalize tracking-wide">
                    {user.role}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="w-9 h-9 rounded-full bg-brand-card hover:bg-brand-surface border border-brand-border text-slate-300 hover:text-white flex items-center justify-center shadow-bubble transition-all"
                title="Sign In"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-72 bg-brand-card border border-brand-border rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User card header */}
                <div className="p-3 bg-brand-surface/70 rounded-2xl border border-brand-border/60 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Switch Role Inside Chrome Dropdown */}
                  <div className="mt-3 pt-2.5 border-t border-brand-border/60">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                      Switch Role Profile:
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-brand-darkest/70 p-1 rounded-full border border-brand-border/60 text-[11px]">
                      {(['commuter', 'moderator', 'admin'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => updateUserRole(r)}
                          className={`py-1 rounded-full capitalize font-semibold transition-all ${
                            user.role === r 
                              ? 'bg-brand-primary text-white shadow-sm' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-2xl text-slate-200 hover:bg-brand-surface flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Commuter Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('routes');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-2xl text-slate-200 hover:bg-brand-surface flex items-center gap-2.5 transition-colors"
                  >
                    <Navigation2 className="w-4 h-4 text-brand-accent" />
                    <span>My Saved Routes</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsOnboardingOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-2xl text-slate-200 hover:bg-brand-surface flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Route Setup Wizard</span>
                  </button>

                  {(user.role === 'moderator' || user.role === 'admin') && (
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors font-semibold"
                    >
                      <Shield className="w-4 h-4 text-rose-400" />
                      <span>Traffic Ops Console</span>
                    </button>
                  )}

                  <div className="border-t border-brand-border/60 my-1.5" />

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                      setCurrentView('landing');
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-2xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-brand-card border border-brand-border text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-card border-b border-brand-border px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-brand-surface"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('map'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-accent hover:bg-brand-surface flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Explore Live Map</span>
          </button>
          <button
            onClick={() => { setCurrentView('alerts'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-brand-surface flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Road Alerts</span>
          </button>
          <button
            onClick={() => { setCurrentView('check-route'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-brand-surface flex items-center gap-2"
          >
            <Navigation2 className="w-4 h-4 text-emerald-400" />
            <span>Check Route</span>
          </button>

          {user && (
            <>
              <button
                onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-brand-surface flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
              <button
                onClick={() => { setCurrentView('routes'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-brand-surface"
              >
                Saved Routes
              </button>
            </>
          )}

          {(user?.role === 'moderator' || user?.role === 'admin') && (
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Ops Console</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
