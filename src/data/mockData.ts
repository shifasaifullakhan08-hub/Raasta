import { CityConfig, RoadIncident, SavedRoute, UserNotification, UserProfile } from '../types';

export const CITIES: CityConfig[] = [
  {
    id: 'belagavi-in',
    name: 'Belagavi',
    country: 'Karnataka, India',
    center: [15.8497, 74.4977],
    zoom: 13,
    authorities: [
      'Belagavi City Police Traffic Division',
      'Belagavi Smart City Corporation (BSCL)',
      'Public Works Department (PWD) Belagavi',
      'National Highways Authority of India (NHAI)'
    ]
  }
];

export const INITIAL_INCIDENTS: RoadIncident[] = [
  {
    id: 'inc-bgm-101',
    title: 'Emergency Drainage Repair & Roadblock at Chennamma Circle',
    category: 'roadblock',
    severity: 'critical',
    status: 'officially_confirmed',
    roadName: 'Rani Chennamma Circle towards College Road',
    area: 'Central Belagavi',
    city: 'belagavi-in',
    coordinates: [15.8576, 74.5074],
    description: 'Smart City storm-water drain overhaul and culvert reconstruction. Both north-bound lanes blocked with traffic police diverting via Kaktives Road.',
    reportedAt: '2026-10-27T08:15:00Z',
    updatedAt: '2026-10-27T09:40:00Z',
    expectedResolution: '2026-10-29T18:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    sourceType: 'official',
    sourceName: 'Belagavi City Police Traffic Division',
    isDemo: false,
    estimatedDelayMinutes: 25,
    affectedRoutesCount: 168,
    confirmations: [
      { id: 'c1', type: 'confirm', timestamp: '2026-10-27T08:45:00Z' },
      { id: 'c2', type: 'still_happening', timestamp: '2026-10-27T09:30:00Z' },
    ],
    statusHistory: [
      { status: 'pending_review', timestamp: '2026-10-27T08:15:00Z', updatedBy: 'Traffic Control Room' },
      { status: 'officially_confirmed', timestamp: '2026-10-27T08:35:00Z', updatedBy: 'ACP Traffic Belagavi', reason: 'Inspector confirmed on-site barricading' }
    ]
  },
  {
    id: 'inc-bgm-102',
    title: 'Flyover Pillar Maintenance & Single-Lane Flow',
    category: 'maintenance',
    severity: 'moderate',
    status: 'verified',
    roadName: 'NH 48 Pune-Bengaluru Highway (near Fort Lake)',
    area: 'Belagavi Bypass / Killa',
    city: 'belagavi-in',
    coordinates: [15.8625, 74.5230],
    description: 'Expansion joint replacement on NH-48 flyover arm. Heavy transport vehicles restricted to single-lane passage with warning reflectors.',
    reportedAt: '2026-10-26T10:00:00Z',
    updatedAt: '2026-10-27T07:15:00Z',
    expectedResolution: '2026-10-31T20:00:00Z',
    sourceType: 'official',
    sourceName: 'NHAI Project Implementation Unit Dharwad-Belagavi',
    isDemo: false,
    estimatedDelayMinutes: 15,
    affectedRoutesCount: 94,
    confirmations: [
      { id: 'c3', type: 'still_happening', timestamp: '2026-10-27T08:00:00Z' }
    ],
    statusHistory: [
      { status: 'verified', timestamp: '2026-10-26T10:00:00Z', updatedBy: 'NHAI Engineer' }
    ]
  },
  {
    id: 'inc-bgm-103',
    title: 'Cluster of Deep Potholes near Bogarves Bridge Approach',
    category: 'pothole',
    severity: 'high',
    status: 'community_reported',
    roadName: 'Bogarves Road towards Tilakwadi 1st Gate',
    area: 'Bogarves / Tilakwadi',
    city: 'belagavi-in',
    coordinates: [15.8450, 74.5020],
    description: 'Series of sharp bitumen potholes on the left carriage lane following rain showers. Two two-wheelers reported skidding incidents.',
    reportedAt: '2026-10-27T07:30:00Z',
    updatedAt: '2026-10-27T09:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    sourceType: 'community',
    sourceName: 'Citizen Commuter (Rohan K.)',
    isDemo: false,
    estimatedDelayMinutes: 10,
    affectedRoutesCount: 52,
    confirmations: [
      { id: 'c4', type: 'confirm', timestamp: '2026-10-27T08:10:00Z', comment: 'Very deep cavity right beside railway gate curb.' },
      { id: 'c5', type: 'still_happening', timestamp: '2026-10-27T08:50:00Z' },
      { id: 'c6', type: 'confirm', timestamp: '2026-10-27T09:10:00Z' }
    ],
    statusHistory: [
      { status: 'community_reported', timestamp: '2026-10-27T07:30:00Z', updatedBy: 'Citizen App Submission' }
    ]
  },
  {
    id: 'inc-bgm-104',
    title: 'Market Day Diversion around Khade Bazar & Ganpat Galli',
    category: 'diversion',
    severity: 'moderate',
    status: 'verified',
    roadName: 'Khade Bazar Main Corridor',
    area: 'Old City Belagavi',
    city: 'belagavi-in',
    coordinates: [15.8540, 74.5120],
    description: 'Temporary vehicular entry diversion for festive bazaar stalls and pedestrian safety. Four-wheelers diverted via Ramdev Galli.',
    reportedAt: '2026-10-25T09:00:00Z',
    updatedAt: '2026-10-27T08:30:00Z',
    expectedResolution: '2026-10-28T22:00:00Z',
    sourceType: 'official',
    sourceName: 'Belagavi City Corporation (BCC)',
    isDemo: false,
    estimatedDelayMinutes: 12,
    affectedRoutesCount: 78,
    confirmations: [
      { id: 'c7', type: 'confirm', timestamp: '2026-10-26T12:00:00Z' }
    ],
    statusHistory: [
      { status: 'verified', timestamp: '2026-10-25T09:00:00Z', updatedBy: 'BCC Ward Inspector' }
    ]
  },
  {
    id: 'inc-bgm-105',
    title: 'Waterlogging & Dip Flooding near Old PB Road Underpass',
    category: 'flooding',
    severity: 'critical',
    status: 'officially_confirmed',
    roadName: 'Old PB Road Railway Underbridge (RUB)',
    area: 'Shahapur / Vadgaon',
    city: 'belagavi-in',
    coordinates: [15.8360, 74.5090],
    description: 'Standing water level exceeding 1.5 feet under the railway bridge. Auto-rickshaws and bikes stalled; pump teams deployed by city corporation.',
    reportedAt: '2026-10-27T06:50:00Z',
    updatedAt: '2026-10-27T09:20:00Z',
    expectedResolution: '2026-10-27T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    sourceType: 'official',
    sourceName: 'Disaster Management Cell Belagavi',
    isDemo: false,
    estimatedDelayMinutes: 30,
    affectedRoutesCount: 135,
    confirmations: [
      { id: 'c8', type: 'still_happening', timestamp: '2026-10-27T08:15:00Z' },
      { id: 'c9', type: 'still_happening', timestamp: '2026-10-27T09:05:00Z' }
    ],
    statusHistory: [
      { status: 'officially_confirmed', timestamp: '2026-10-27T07:10:00Z', updatedBy: 'Disaster Response Officer' }
    ]
  },
  {
    id: 'inc-bgm-106',
    title: 'Traffic Signal Sensor Calibration at Dharmveer Sambhaji Chowk',
    category: 'maintenance',
    severity: 'minor',
    status: 'under_review',
    roadName: 'Sambhaji Circle (Bogarves to Camp Junction)',
    area: 'Camp / Belagavi Cantonment',
    city: 'belagavi-in',
    coordinates: [15.8510, 74.5005],
    description: 'Adaptive sensor sync during peak morning traffic. Traffic wardens manually regulating movement with brief 3-5m pauses.',
    reportedAt: '2026-10-27T08:30:00Z',
    updatedAt: '2026-10-27T09:15:00Z',
    sourceType: 'sensor_ai',
    sourceName: 'Belagavi Smart City Intelligent Traffic Control System',
    isDemo: false,
    estimatedDelayMinutes: 5,
    affectedRoutesCount: 45,
    confirmations: [],
    statusHistory: [
      { status: 'under_review', timestamp: '2026-10-27T08:35:00Z', updatedBy: 'Smart City Control Room' }
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-bgm-01',
  fullName: 'Praveen Kulkarni',
  email: 'praveen.belagavi@raasta.io',
  role: 'commuter',
  selectedCity: 'belagavi-in',
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
    id: 'rt-bgm-1',
    name: 'Tilakwadi to Belagavi Fort & Civil Hospital (Daily Commute)',
    origin: {
      id: 'p-1',
      label: 'Home (Tilakwadi 2nd Gate)',
      address: 'Congress Road, Tilakwadi, Belagavi, Karnataka 590006',
      coordinates: [15.8390, 74.4980],
      icon: 'home'
    },
    destination: {
      id: 'p-2',
      label: 'Belagavi Fort Tech Park & BIMS',
      address: 'Fort Road, Camp, Belagavi, Karnataka 590016',
      coordinates: [15.8610, 74.5180],
      icon: 'briefcase'
    },
    isFavorite: true,
    notificationsEnabled: true,
    preferredDepartureTime: '08:45',
    estimatedDurationMins: 16,
    distanceKm: 5.8
  },
  {
    id: 'rt-bgm-2',
    name: 'Camp to VTU Machhe Campus',
    origin: {
      id: 'p-1',
      label: 'Home (Tilakwadi / Camp)',
      address: 'Camp Area, Belagavi 590001',
      coordinates: [15.8500, 74.4980]
    },
    destination: {
      id: 'p-3',
      label: 'Visvesvaraya Technological University (VTU)',
      address: 'Jnana Sangama, Machhe, Belagavi, Karnataka 590018',
      coordinates: [15.8070, 74.4620],
      icon: 'graduation-cap'
    },
    isFavorite: false,
    notificationsEnabled: false,
    preferredDepartureTime: '09:15',
    estimatedDurationMins: 22,
    distanceKm: 9.4
  }
];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    title: 'Severe Alert on your route: Tilakwadi to Fort Area',
    message: 'Chennamma Circle drainage roadblock & Old PB Road RUB waterlogging may add ~25m. Alternate via Khanapur Road / Camp bypass recommended.',
    type: 'incident_alert',
    severity: 'critical',
    incidentId: 'inc-bgm-101',
    routeId: 'rt-bgm-1',
    timestamp: '15 mins ago',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Community Pothole Report Confirmed in Tilakwadi',
    message: 'Bogarves bridge approach pothole confirmed by 3 motorists. Tagged for Belagavi City Corporation (BCC) patch repair.',
    type: 'report_update',
    severity: 'high',
    incidentId: 'inc-bgm-103',
    timestamp: '42 mins ago',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'NH-48 Flyover Night Maintenance Planned',
    message: 'Flyover joint work active from 21:00 near Fort Lake. Expect single-lane restrictions.',
    type: 'route_warning',
    severity: 'moderate',
    incidentId: 'inc-bgm-102',
    timestamp: '2 hours ago',
    isRead: true
  }
];
