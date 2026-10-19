import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Trash2, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { SeverityBadge } from '../components/common/Badges';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification,
    setSelectedIncident,
    incidents,
    setCurrentView 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => filter === 'all' || !n.isRead);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.incidentId) {
      const inc = incidents.find(i => i.id === notif.incidentId);
      if (inc) {
        setSelectedIncident(inc);
        setCurrentView('map');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-cyan font-semibold mb-1">
            <Bell className="w-4 h-4 text-brand-cyan" />
            <span>DISRUPTION ADVISORY INBOX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time route warnings, community confirmation updates, and city alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 rounded-xl bg-brand-surface hover:bg-slate-700 text-slate-300 border border-brand-border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All As Read</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border/60 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-brand-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-brand-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-brand-card/40 border border-brand-border rounded-2xl text-slate-400 text-xs">
            No notifications in this folder.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                notif.isRead
                  ? 'bg-brand-card/70 border-brand-border/60 opacity-80'
                  : 'bg-brand-card border-brand-primary/40 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                  )}
                  {notif.severity && <SeverityBadge severity={notif.severity} />}
                  <span className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {notif.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notif.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-4">
                {notif.message}
              </p>

              {notif.incidentId && (
                <div className="pl-4 pt-1 flex items-center gap-1 text-[11px] text-brand-cyan font-semibold">
                  <span>View affected road details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
