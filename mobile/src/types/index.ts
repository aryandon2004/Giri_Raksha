export type UserRole = 'citizen' | 'field_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  state: string;
  district: string;
  designation?: string;
  token?: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface RiskFactor {
  name: string;
  contribution: number; // e.g. +28, +22
  unit: string;
  rawValue: number | string;
  description: string;
}

export interface RiskPrediction {
  score: number; // 0 - 100
  probability: number; // 0.0 - 1.0
  riskLevel: RiskLevel;
  confidence: number; // e.g. 0.87
  factors: RiskFactor[];
  modelName: string;
  timestamp: string;
  location: {
    state: string;
    district: string;
    area: string;
    latitude: number;
    longitude: number;
  };
  isEstimate: boolean;
}

export interface WeatherData {
  temperature: number; // in Celsius
  humidity: number; // percentage
  rainfallCurrent: number; // mm/h
  rainfall24h: number; // mm
  rainfall72h: number; // mm
  rainfall7d: number; // mm
  windSpeed: number; // km/h
  condition: string;
  forecast: {
    day: string;
    rainfall: number;
    temp: number;
    risk: RiskLevel;
  }[];
  timestamp: string;
  isDemo: boolean;
}

export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'CRITICAL';

export interface SoilMoistureSensor {
  id: string;
  name: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  soilMoisture: number; // %
  battery: number; // %
  lastCommunication: string;
  status: SensorStatus;
  depthCm: number;
  trend: 'rising' | 'stable' | 'falling';
}

export type HazardType =
  | 'Landslide'
  | 'Road Blockage'
  | 'Slope Crack'
  | 'Rockfall'
  | 'Flash Flood'
  | 'Soil Movement'
  | 'Infrastructure Damage'
  | 'Other';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESOLVED';

export interface HazardReport {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  hazardType: HazardType;
  description: string;
  severity: ReportSeverity;
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  locationName: string;
  state: string;
  district: string;
  photoUri?: string;
  videoUri?: string;
  createdAt: string;
  syncStatus: SyncStatus;
  status: ReportStatus;
  verifiedBy?: string;
  fieldNotes?: string;
  associatedRoadId?: string;
  priorityScore?: number;
}

export interface FieldObservation {
  id: string;
  officerId: string;
  officerName: string;
  locationName: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  slopeCondition: string;
  cracksObserved: boolean;
  cracksDepthCm?: number;
  rockfallActivity: 'None' | 'Minor' | 'Active' | 'Severe';
  waterSeepage: 'Dry' | 'Damp' | 'Trickle' | 'Heavy Seepage';
  roadCondition: 'Normal' | 'Cracked' | 'Subsided' | 'Impending Failure';
  soilCondition: 'Dry' | 'Moist' | 'Saturated' | 'Fluidized';
  photoUri?: string;
  notes: string;
  timestamp: string;
  syncStatus: SyncStatus;
}

export type AlertSeverity = 'ADVISORY' | 'WATCH' | 'WARNING' | 'EMERGENCY';

export interface Alert {
  id: string;
  title: string;
  location: string;
  state: string;
  district: string;
  riskScore: number;
  riskLevel: RiskLevel;
  severity: AlertSeverity;
  cause: string;
  recommendedAction: string;
  timestamp: string;
  active: boolean;
  broadcastChannel: 'ALL' | 'FIELD_ONLY' | 'HIGH_RISK_ZONES';
}

export type RoadStatus = 'OPEN' | 'PARTIALLY BLOCKED' | 'BLOCKED';

export interface Road {
  id: string;
  name: string;
  code: string; // e.g. NH-6
  from: string;
  to: string;
  status: RoadStatus;
  riskScore: number;
  lastUpdated: string;
  cause?: string;
  reportsCount: number;
  latitude: number;
  longitude: number;
  estimatedClearanceHours?: number;
}

export interface HistoricalLandslide {
  id: string;
  date: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  severity: 'Minor' | 'Moderate' | 'Major' | 'Catastrophic';
  rainfallMm: number;
  casualties: number;
  roadImpact: string;
  source: string;
  slopeAngleDeg: number;
}

export type TeamType =
  | 'Search & Rescue'
  | 'Road Clearance'
  | 'Medical'
  | 'Fire & Emergency'
  | 'Disaster Response';

export interface ResponseTeam {
  id: string;
  name: string;
  type: TeamType;
  agency: string; // NDRF, SDRF, PWD, BRO
  contact: string;
  baseLocation: string;
  state: string;
  personnelCount: number;
  available: boolean;
}

export type AssignmentStatus = 'ASSIGNED' | 'EN ROUTE' | 'ON SITE' | 'RESOLVED';

export interface ResponseAssignment {
  id: string;
  incidentId: string;
  incidentTitle: string;
  teamId: string;
  teamName: string;
  priorityScore: number; // 0 - 100
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: AssignmentStatus;
  assignedAt: string;
  updatedAt: string;
  location: string;
  actionTaken?: string;
}

export interface RiskZone {
  id: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  riskScore: number;
  riskLevel: RiskLevel;
  slopeDegrees: number;
  soilMoisturePct: number;
  rainfall24hMm: number;
  historicalIncidentsCount: number;
  lastUpdated: string;
  vulnerablePopulation: number;
}

export interface NERDistrict {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  baselineSusceptibility: 'High' | 'Very High' | 'Moderate';
  majorRoads: string[];
}

export interface NERState {
  code: string;
  name: string;
  capital: string;
  latitude: number;
  longitude: number;
  deocContact: string;
  sdrfContact: string;
  districts: NERDistrict[];
}
