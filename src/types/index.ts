export type IncidentCategory = 
  | 'roadblock' 
  | 'maintenance' 
  | 'pothole' 
  | 'diversion' 
  | 'flooding';

export type IncidentSeverity = 'critical' | 'high' | 'moderate' | 'minor';

export type VerificationStatus = 
  | 'pending_review' 
  | 'community_reported' 
  | 'under_review' 
  | 'verified' 
  | 'officially_confirmed' 
  | 'resolved' 
  | 'rejected';

export interface IncidentConfirmation {
  id: string;
  userId?: string;
  type: 'confirm' | 'still_happening' | 'resolved' | 'inaccurate';
  timestamp: string;
  comment?: string;
}

export interface IncidentStatusHistory {
  status: VerificationStatus;
  timestamp: string;
  updatedBy: string;
  reason?: string;
}

export interface RoadIncident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: VerificationStatus;
  roadName: string;
  area: string;
  city: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  reportedAt: string;
  updatedAt: string;
  expectedResolution?: string;
  imageUrl?: string;
  sourceType: 'official' | 'community' | 'sensor_ai';
  sourceName: string;
  isDemo?: boolean;
  confirmations: IncidentConfirmation[];
  statusHistory: IncidentStatusHistory[];
  estimatedDelayMinutes?: number;
  affectedRoutesCount?: number;
}

export interface SavedPlace {
  id: string;
  label: string; // e.g., 'Home', 'Work', 'Gym'
  address: string;
  coordinates: [number, number];
  icon?: string;
}

export interface SavedRoute {
  id: string;
  name: string; // e.g. "Home to Office"
  origin: SavedPlace;
  destination: SavedPlace;
  waypoints?: [number, number][];
  isFavorite: boolean;
  notificationsEnabled: boolean;
  preferredDepartureTime?: string;
  estimatedDurationMins?: number;
  distanceKm?: number;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'incident_alert' | 'route_warning' | 'report_update' | 'system';
  severity?: IncidentSeverity;
  incidentId?: string;
  routeId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'commuter' | 'moderator' | 'admin';
  selectedCity: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    criticalOnly: boolean;
    categories: IncidentCategory[];
  };
  hasCompletedOnboarding: boolean;
}

export interface CityConfig {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  authorities: string[];
}
