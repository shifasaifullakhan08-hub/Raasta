import { CityConfig, RoadIncident, SavedRoute, UserNotification, UserProfile } from '../types';

export const CITIES: CityConfig[] = [
  {
    id: 'reading-uk',
    name: 'Reading',
    country: 'United Kingdom',
    center: [51.4543, -0.9781],
    zoom: 13,
    authorities: ['Reading Borough Council', 'Thames Valley Traffic Operations', 'National Highways']
  },
  {
    id: 'london-uk',
    name: 'London',
    country: 'United Kingdom',
    center: [51.5074, -0.1278],
    zoom: 12,
    authorities: ['Transport for London (TfL)', 'Metropolitan Police']
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    center: [37.7749, -122.4194],
    zoom: 13,
    authorities: ['SFMTA', 'Caltrans District 4']
  }
];

export const INITIAL_INCIDENTS: RoadIncident[] = [
  {
    id: 'inc-101',
    title: 'Severe Water Pipe Burst & Emergency Roadblock',
    category: 'roadblock',
    severity: 'critical',
    status: 'officially_confirmed',
    roadName: 'A329 Kings Road near Abbey Square',
    area: 'Central Reading',
    city: 'reading-uk',
    coordinates: [51.4538, -0.9675],
    description: 'Thames Water emergency repair following a 24-inch water main burst. Both eastbound lanes closed with major structural tarmac breakdown.',
    reportedAt: '2026-10-19T07:15:00Z',
    updatedAt: '2026-10-19T08:30:00Z',
    expectedResolution: '2026-10-21T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    sourceType: 'official',
    sourceName: 'Reading Borough Council Traffic Management',
    isDemo: true,
    estimatedDelayMinutes: 28,
    affectedRoutesCount: 142,
    confirmations: [
      { id: 'c1', type: 'confirm', timestamp: '2026-10-19T07:45:00Z' },
      { id: 'c2', type: 'still_happening', timestamp: '2026-10-19T08:15:00Z' },
    ],
    statusHistory: [
      { status: 'pending_review', timestamp: '2026-10-19T07:15:00Z', updatedBy: 'Emergency Feed' },
      { status: 'officially_confirmed', timestamp: '2026-10-19T07:30:00Z', updatedBy: 'Traffic Ops Duty Officer', reason: 'Highways Inspector on site' }
    ]
  },
  {
    id: 'inc-102',
    title: 'Scheduled Resurfacing & Single-Lane Flow',
    category: 'maintenance',
    severity: 'moderate',
    status: 'verified',
    roadName: 'A33 Relief Road (Rose Kiln Lane)',
    area: 'South Reading',
    city: 'reading-uk',
    coordinates: [51.4392, -0.9798],
    description: 'Highway resurfacing work and kerb repairs. Temporary 3-way traffic signals operational during daytime off-peak and night hours.',
    reportedAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-19T06:00:00Z',
    expectedResolution: '2026-10-25T17:00:00Z',
    sourceType: 'official',
    sourceName: 'National Highways Scheduled Works',
    isDemo: true,
    estimatedDelayMinutes: 12,
    affectedRoutesCount: 89,
    confirmations: [
      { id: 'c3', type: 'still_happening', timestamp: '2026-10-19T07:00:00Z' }
    ],
    statusHistory: [
      { status: 'verified', timestamp: '2026-10-18T10:00:00Z', updatedBy: 'System Import' }
    ]
  },
  {
    id: 'inc-103',
    title: 'Deep Hazardous Pothole cluster near Roundabout',
    category: 'pothole',
    severity: 'high',
    status: 'community_reported',
    roadName: 'Caversham Bridge approach (A4155)',
    area: 'Caversham',
    city: 'reading-uk',
    coordinates: [51.4655, -0.9760],
    description: 'Series of 3 sharp pothole cavities on the left cycling & car lane right before the bridge. Two motorists reported tire deflation.',
    reportedAt: '2026-10-19T06:45:00Z',
    updatedAt: '2026-10-19T08:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    sourceType: 'community',
    sourceName: 'Citizen Commuter #4912',
    isDemo: true,
    estimatedDelayMinutes: 8,
    affectedRoutesCount: 34,
    confirmations: [
      { id: 'c4', type: 'confirm', timestamp: '2026-10-19T07:10:00Z', comment: 'Hit one this morning, rim dented.' },
      { id: 'c5', type: 'still_happening', timestamp: '2026-10-19T08:00:00Z' },
      { id: 'c6', type: 'confirm', timestamp: '2026-10-19T08:10:00Z' }
    ],
    statusHistory: [
      { status: 'community_reported', timestamp: '2026-10-19T06:45:00Z', updatedBy: 'Mobile App Report' }
    ]
  },
  {
    id: 'inc-104',
    title: 'One-Way Diversion for Gas Pipeline Upgrades',
    category: 'diversion',
    severity: 'moderate',
    status: 'verified',
    roadName: 'Oxford Road (near West Reading Station)',
    area: 'West Reading',
    city: 'reading-uk',
    coordinates: [51.4582, -0.9950],
    description: 'Traffic diverted via Beresford Road and Portman Road. Inbound buses running on altered schedule with 10-15m delays.',
    reportedAt: '2026-10-17T09:00:00Z',
    updatedAt: '2026-10-19T07:30:00Z',
    expectedResolution: '2026-10-22T20:00:00Z',
    sourceType: 'official',
    sourceName: 'SGN Gas Networks',
    isDemo: true,
    estimatedDelayMinutes: 14,
    affectedRoutesCount: 65,
    confirmations: [
      { id: 'c7', type: 'confirm', timestamp: '2026-10-18T12:00:00Z' }
    ],
    statusHistory: [
      { status: 'verified', timestamp: '2026-10-17T09:00:00Z', updatedBy: 'Moderator Alex' }
    ]
  },
  {
    id: 'inc-105',
    title: 'Flash Flooding & Road Dip Waterlogging',
    category: 'flooding',
    severity: 'critical',
    status: 'officially_confirmed',
    roadName: 'Mill Lane Underpass near Oracle Centre',
    area: 'Town Centre',
    city: 'reading-uk',
    coordinates: [51.4510, -0.9702],
    description: 'Standing flood water over 40cm depth due to blocked storm drains following heavy downpour. Impassable for sedans and small vehicles.',
    reportedAt: '2026-10-19T06:10:00Z',
    updatedAt: '2026-10-19T08:20:00Z',
    expectedResolution: '2026-10-19T14:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    sourceType: 'official',
    sourceName: 'Environment Agency Flood Alert Unit',
    isDemo: true,
    estimatedDelayMinutes: 35,
    affectedRoutesCount: 118,
    confirmations: [
      { id: 'c8', type: 'still_happening', timestamp: '2026-10-19T07:55:00Z' },
      { id: 'c9', type: 'still_happening', timestamp: '2026-10-19T08:15:00Z' }
    ],
    statusHistory: [
      { status: 'officially_confirmed', timestamp: '2026-10-19T06:30:00Z', updatedBy: 'Highways Flood Unit' }
    ]
  },
  {
    id: 'inc-106',
    title: 'Faulty SCOOT Traffic Controller Signal Lights',
    category: 'maintenance',
    severity: 'minor',
    status: 'under_review',
    roadName: 'Forbury Road / Vastern Road Junction',
    area: 'Station Area',
    city: 'reading-uk',
    coordinates: [51.4590, -0.9690],
    description: 'Traffic signals flashing amber intermittently causing hesitation and minor queues during morning rush hour.',
    reportedAt: '2026-10-19T07:50:00Z',
    updatedAt: '2026-10-19T08:05:00Z',
    sourceType: 'sensor_ai',
    sourceName: 'Urban Traffic Control (SCOOT) Telemetry',
    isDemo: true,
    estimatedDelayMinutes: 5,
    affectedRoutesCount: 42,
    confirmations: [],
    statusHistory: [
      { status: 'under_review', timestamp: '2026-10-19T07:55:00Z', updatedBy: 'Telemetry Ingestion' }
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-demo-01',
  fullName: 'Alan Harrison',
  email: 'alan.harrison@mobility.io',
  role: 'commuter', // toggleable to admin/moderator for demo purposes!
  selectedCity: 'reading-uk',
  notificationPreferences: {
    email: true,
    push: true,
    inApp: true,
    criticalOnly: false,
    categories: ['roadblock', 'maintenance', 'pothole', 'diversion', 'flooding']
  },
  hasCompletedOnboarding: true
};

export const INITIAL_ROUTES: SavedRoute[] = [
  {
    id: 'rt-1',
    name: 'Home to Tech Campus (Daily Commute)',
    origin: {
      id: 'p-1',
      label: 'Home (Caversham Heights)',
      address: 'Woodcote Way, Caversham, Reading RG4 7EU',
      coordinates: [51.4740, -0.9850],
      icon: 'home'
    },
    destination: {
      id: 'p-2',
      label: 'Office (Green Park Campus)',
      address: '100 Longwater Ave, Green Park, Reading RG2 6GP',
      coordinates: [51.4230, -0.9820],
      icon: 'briefcase'
    },
    isFavorite: true,
    notificationsEnabled: true,
    preferredDepartureTime: '08:15',
    estimatedDurationMins: 22,
    distanceKm: 8.4
  },
  {
    id: 'rt-2',
    name: 'Home to University Sports Center',
    origin: {
      id: 'p-1',
      label: 'Home (Caversham Heights)',
      address: 'Woodcote Way, Caversham, Reading RG4 7EU',
      coordinates: [51.4740, -0.9850]
    },
    destination: {
      id: 'p-3',
      label: 'University Whiteknights Sports',
      address: 'Shinfield Rd, Reading RG6 6UR',
      coordinates: [51.4410, -0.9450],
      icon: 'dumbbell'
    },
    isFavorite: false,
    notificationsEnabled: false,
    preferredDepartureTime: '17:45',
    estimatedDurationMins: 18,
    distanceKm: 6.8
  }
];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    title: 'Severe Alert on your route: Home to Tech Campus',
    message: 'Kings Road burst pipe & Mill Lane flood may add ~28m to your morning journey. Alternate via A4155 recommended.',
    type: 'incident_alert',
    severity: 'critical',
    incidentId: 'inc-101',
    routeId: 'rt-1',
    timestamp: '15 mins ago',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Community Report Verified nearby',
    message: 'Caversham Bridge pothole report has been confirmed by 3 motorists and queued for inspection.',
    type: 'report_update',
    severity: 'high',
    incidentId: 'inc-103',
    timestamp: '42 mins ago',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Scheduled Night Maintenance Tonight',
    message: 'A33 Relief road resurfacing active from 21:00. Single lane restrictions.',
    type: 'route_warning',
    severity: 'moderate',
    incidentId: 'inc-102',
    timestamp: '2 hours ago',
    isRead: true
  }
];
