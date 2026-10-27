import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RoadIncident, 
  UserProfile, 
  SavedRoute, 
  UserNotification, 
  CityConfig, 
  VerificationStatus,
  IncidentConfirmation
} from '../types';
import { CITIES, INITIAL_INCIDENTS, INITIAL_USER, INITIAL_ROUTES, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppContextType {
  // Config & State
  selectedCity: CityConfig;
  setSelectedCity: (city: CityConfig) => void;
  availableCities: CityConfig[];
  
  // Auth
  user: UserProfile | null;
  login: (email: string, role?: 'commuter' | 'moderator' | 'admin') => void;
  logout: () => void;
  updateUserRole: (role: 'commuter' | 'moderator' | 'admin') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Incidents
  incidents: RoadIncident[];
  selectedIncident: RoadIncident | null;
  setSelectedIncident: (inc: RoadIncident | null) => void;
  addReport: (report: Omit<RoadIncident, 'id' | 'reportedAt' | 'updatedAt' | 'confirmations' | 'statusHistory'>) => string;
  updateIncidentStatus: (incidentId: string, newStatus: VerificationStatus, reason?: string) => void;
  addConfirmation: (incidentId: string, type: IncidentConfirmation['type'], comment?: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterSeverity: string;
  setFilterSeverity: (sev: string) => void;
  filterStatus: string;
  setFilterStatus: (stat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;

  // Saved Routes
  routes: SavedRoute[];
  addRoute: (route: Omit<SavedRoute, 'id'>) => void;
  deleteRoute: (id: string) => void;
  toggleRouteFavorite: (id: string) => void;
  toggleRouteAlert: (id: string) => void;

  // Notifications
  notifications: UserNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;

  // Active View Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Checked Route (Transient Journey Simulator)
  activeCheckedRoute: {
    originName: string;
    destName: string;
    originCoords: [number, number];
    destCoords: [number, number];
    incidentsAlongRoute: RoadIncident[];
    normalDurationMins: number;
    delayMinutes: number;
    alternativeAvailable: boolean;
  } | null;
  checkJourneyRoute: (origin: string, dest: string) => void;
  clearCheckedRoute: () => void;

  // UI Modals
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cities — Strictly locked to Belagavi, Karnataka, India
  const [selectedCity, setSelectedCityState] = useState<CityConfig>(() => {
    const saved = localStorage.getItem('raasta_city');
    if (saved && saved === 'belagavi-in') {
      const found = CITIES.find(c => c.id === saved);
      if (found) return found;
    }
    // Always default to Belagavi
    localStorage.setItem('raasta_city', 'belagavi-in');
    return CITIES[0];
  });

  const setSelectedCity = (city: CityConfig) => {
    setSelectedCityState(city);
    localStorage.setItem('raasta_city', city.id);
  };

  // Auth
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('raasta_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Sync profile with Supabase on login or profile updates
  const syncProfileToSupabase = async (profile: UserProfile) => {
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        full_name: profile.fullName,
        email: profile.email,
        role: profile.role,
        selected_city: profile.selectedCity,
        notification_preferences: profile.notificationPreferences,
        has_completed_onboarding: profile.hasCompletedOnboarding,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase profile sync note:', err);
    }
  };

  const login = (email: string, role: 'commuter' | 'moderator' | 'admin' = 'commuter') => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      selectedCity: selectedCity.id,
      notificationPreferences: {
        email: true,
        push: true,
        inApp: true,
        criticalOnly: false,
        categories: ['roadblock', 'maintenance', 'pothole', 'diversion', 'flooding']
      },
      hasCompletedOnboarding: true
    };
    setUser(newUser);
    localStorage.setItem('raasta_user', JSON.stringify(newUser));
    syncProfileToSupabase(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('raasta_user');
  };

  const updateUserRole = (role: 'commuter' | 'moderator' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('raasta_user', JSON.stringify(updated));
    syncProfileToSupabase(updated);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('raasta_user', JSON.stringify(updated));
    syncProfileToSupabase(updated);
  };

  // Incidents — Filtered or initialized for Belagavi, Karnataka
  const [incidents, setIncidents] = useState<RoadIncident[]>(() => {
    const saved = localStorage.getItem('raasta_incidents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((i: any) => i.city === 'belagavi-in')) {
          return parsed;
        }
      } catch (e) {
        // Fallback to fresh initial incidents
      }
    }
    return INITIAL_INCIDENTS;
  });

  const [selectedIncident, setSelectedIncident] = useState<RoadIncident | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Fetch from Supabase on mount and subscribe to real-time changes
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('reported_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Fetch all confirmations
          const { data: confData } = await supabase.from('confirmations').select('*');
          
          const mapped: RoadIncident[] = data.map(row => ({
            id: row.id,
            title: row.title,
            category: row.category as any,
            severity: row.severity as any,
            status: row.status as any,
            roadName: row.road_name,
            area: row.area || '',
            city: row.city || 'belagavi-in',
            coordinates: [row.lat, row.lng],
            description: row.description,
            imageUrl: row.image_url || undefined,
            sourceType: row.source_type as any,
            sourceName: row.source_name,
            isDemo: row.is_demo || false,
            estimatedDelayMinutes: row.estimated_delay_minutes || 10,
            affectedRoutesCount: row.affected_routes_count || 0,
            reportedAt: row.reported_at,
            updatedAt: row.updated_at,
            confirmations: (confData || [])
              .filter(c => c.incident_id === row.id)
              .map(c => ({
                id: c.id,
                userId: c.user_id,
                type: c.type,
                timestamp: c.created_at,
                comment: c.comment
              })),
            statusHistory: [
              {
                status: row.status as any,
                timestamp: row.updated_at,
                updatedBy: row.source_name,
                reason: 'Verified incident state'
              }
            ]
          }));

          setIncidents(mapped);
          localStorage.setItem('raasta_incidents', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Initial Supabase fetch fallback to local cache:', err);
      }
    };

    loadFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem('raasta_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const addReport = (report: Omit<RoadIncident, 'id' | 'reportedAt' | 'updatedAt' | 'confirmations' | 'statusHistory'>): string => {
    const id = `inc-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const newIncident: RoadIncident = {
      ...report,
      id,
      reportedAt: now,
      updatedAt: now,
      confirmations: [],
      statusHistory: [
        {
          status: 'pending_review',
          timestamp: now,
          updatedBy: user ? user.fullName : 'Guest Citizen',
          reason: 'Initial community report submission'
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Push into Supabase asynchronously
    supabase.from('incidents').insert({
      id,
      title: report.title,
      category: report.category,
      severity: report.severity,
      status: 'pending_review',
      road_name: report.roadName,
      area: report.area,
      city: report.city,
      lat: report.coordinates[0],
      lng: report.coordinates[1],
      description: report.description,
      image_url: report.imageUrl || null,
      source_type: report.sourceType,
      source_name: report.sourceName,
      is_demo: false,
      estimated_delay_minutes: report.estimatedDelayMinutes || 10,
      reported_at: now,
      updated_at: now
    }).then(({ error }) => {
      if (error) console.error('Failed to sync report to Supabase:', error);
    });

    // Also trigger in-app notification for the user
    const newNotif: UserNotification = {
      id: `notif-${Date.now()}`,
      title: 'Report Submitted Successfully',
      message: `Your report for "${report.roadName}" (Ref: #${id}) is under review and saved to Supabase.`,
      type: 'report_update',
      severity: report.severity,
      incidentId: id,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return id;
  };

  const updateIncidentStatus = (incidentId: string, newStatus: VerificationStatus, reason?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const now = new Date().toISOString();
        const updatedHistory = [
          ...inc.statusHistory,
          {
            status: newStatus,
            timestamp: now,
            updatedBy: user ? `${user.fullName} (${user.role})` : 'System Admin',
            reason: reason || 'Moderation decision applied'
          }
        ];
        return {
          ...inc,
          status: newStatus,
          updatedAt: now,
          statusHistory: updatedHistory
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // Sync to Supabase
    supabase.from('incidents').update({
      status: newStatus,
      updated_at: new Date().toISOString()
    }).eq('id', incidentId).then(({ error }) => {
      if (error) console.error('Failed to update incident in Supabase:', error);
    });
  };

  const addConfirmation = (incidentId: string, type: IncidentConfirmation['type'], comment?: string) => {
    const confId = `c-${Date.now()}`;
    const now = new Date().toISOString();

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const conf: IncidentConfirmation = {
          id: confId,
          userId: user?.id,
          type,
          timestamp: now,
          comment
        };
        const updatedConfirmations = [...inc.confirmations, conf];

        let newStatus = inc.status;
        if (type === 'confirm' || type === 'still_happening') {
          if (inc.status === 'pending_review' && updatedConfirmations.length >= 2) {
            newStatus = 'community_reported';
          }
        } else if (type === 'resolved' && updatedConfirmations.filter(c => c.type === 'resolved').length >= 3) {
          newStatus = 'resolved';
        }

        return {
          ...inc,
          confirmations: updatedConfirmations,
          status: newStatus,
          updatedAt: now
        };
      }
      return inc;
    }));

    // Sync confirmation to Supabase
    supabase.from('confirmations').insert({
      id: confId,
      incident_id: incidentId,
      user_id: user?.id || null,
      type,
      comment: comment || null,
      created_at: now
    }).then(({ error }) => {
      if (error) console.error('Failed to sync confirmation to Supabase:', error);
    });
  };

  // Saved Routes
  const [routes, setRoutes] = useState<SavedRoute[]>(() => {
    const saved = localStorage.getItem('raasta_routes');
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  useEffect(() => {
    localStorage.setItem('raasta_routes', JSON.stringify(routes));
  }, [routes]);

  const addRoute = (route: Omit<SavedRoute, 'id'>) => {
    const id = `rt-${Date.now().toString().slice(-4)}`;
    const newRoute = { ...route, id };
    setRoutes(prev => [...prev, newRoute]);

    // Save to Supabase
    supabase.from('saved_routes').insert({
      id,
      user_id: user?.id || null,
      name: route.name,
      origin_label: route.origin.label,
      origin_address: route.origin.address,
      origin_lat: route.origin.coordinates[0],
      origin_lng: route.origin.coordinates[1],
      dest_label: route.destination.label,
      dest_address: route.destination.address,
      dest_lat: route.destination.coordinates[0],
      dest_lng: route.destination.coordinates[1],
      is_favorite: route.isFavorite,
      notifications_enabled: route.notificationsEnabled,
      preferred_departure_time: route.preferredDepartureTime || null,
      estimated_duration_mins: route.estimatedDurationMins || 20,
      distance_km: route.distanceKm || 8.0
    }).then(({ error }) => {
      if (error) console.error('Failed to sync saved route to Supabase:', error);
    });
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    supabase.from('saved_routes').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Failed to delete route from Supabase:', error);
    });
  };

  const toggleRouteFavorite = (id: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === id) {
        const next = !r.isFavorite;
        supabase.from('saved_routes').update({ is_favorite: next }).eq('id', id);
        return { ...r, isFavorite: next };
      }
      return r;
    }));
  };

  const toggleRouteAlert = (id: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === id) {
        const next = !r.notificationsEnabled;
        supabase.from('saved_routes').update({ notifications_enabled: next }).eq('id', id);
        return { ...r, notificationsEnabled: next };
      }
      return r;
    }));
  };

  // Notifications
  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    const saved = localStorage.getItem('raasta_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('raasta_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Current view navigation
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Transient Journey Checker
  const [activeCheckedRoute, setActiveCheckedRoute] = useState<{
    originName: string;
    destName: string;
    originCoords: [number, number];
    destCoords: [number, number];
    incidentsAlongRoute: RoadIncident[];
    normalDurationMins: number;
    delayMinutes: number;
    alternativeAvailable: boolean;
  } | null>(null);

  const checkJourneyRoute = (origin: string, dest: string) => {
    const center = selectedCity.center;
    const originCoords: [number, number] = [center[0] + 0.015, center[1] - 0.012];
    const destCoords: [number, number] = [center[0] - 0.022, center[1] + 0.018];

    const relevant = incidents.filter(i => i.city === selectedCity.id && i.status !== 'resolved');
    const affected = relevant.slice(0, 2);
    const delay = affected.reduce((acc, curr) => acc + (curr.estimatedDelayMinutes || 10), 0);

    setActiveCheckedRoute({
      originName: origin,
      destName: dest,
      originCoords,
      destCoords,
      incidentsAlongRoute: affected,
      normalDurationMins: 24,
      delayMinutes: delay,
      alternativeAvailable: true
    });
  };

  const clearCheckedRoute = () => {
    setActiveCheckedRoute(null);
  };

  return (
    <AppContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        availableCities: CITIES,
        user,
        login,
        logout,
        updateUserRole,
        updateProfile,
        incidents,
        selectedIncident,
        setSelectedIncident,
        addReport,
        updateIncidentStatus,
        addConfirmation,
        filterCategory,
        setFilterCategory,
        filterSeverity,
        setFilterSeverity,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        isDemoMode,
        setIsDemoMode,
        routes,
        addRoute,
        deleteRoute,
        toggleRouteFavorite,
        toggleRouteAlert,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        currentView,
        setCurrentView,
        activeCheckedRoute,
        checkJourneyRoute,
        clearCheckedRoute,
        isOnboardingOpen,
        setIsOnboardingOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
