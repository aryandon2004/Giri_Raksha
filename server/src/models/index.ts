import mongoose, { Schema, Document } from 'mongoose';

// 1. User Model
export interface IUser extends Document {
  name: string;
  mobile: string;
  email: string;
  passwordHash: string;
  role: 'citizen' | 'field_officer' | 'admin';
  state: string;
  district: string;
  designation?: string;
  createdAt: Date;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'field_officer', 'admin'], default: 'citizen' },
  state: { type: String, required: true },
  district: { type: String, required: true },
  designation: String,
  createdAt: { type: Date, default: Date.now },
});
UserSchema.index({ role: 1, state: 1, district: 1 });

// 2. RiskZone Model
export interface IRiskZone extends Document {
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  slopeDegrees: number;
  soilMoisturePct: number;
  rainfall24hMm: number;
  historicalIncidentsCount: number;
  lastUpdated: Date;
}
const RiskZoneSchema = new Schema<IRiskZone>({
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radiusKm: { type: Number, default: 2.5 },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH'], required: true },
  slopeDegrees: Number,
  soilMoisturePct: Number,
  rainfall24hMm: Number,
  historicalIncidentsCount: Number,
  lastUpdated: { type: Date, default: Date.now },
});
RiskZoneSchema.index({ latitude: 1, longitude: 1 });
RiskZoneSchema.index({ state: 1, district: 1, riskLevel: 1 });

// 3. RiskPrediction Model
export interface IRiskPrediction extends Document {
  zoneId?: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: string;
  probability: number;
  confidence: number;
  factors: Array<{ name: string; contribution: number; rawValue: string }>;
  modelName: string;
  timestamp: Date;
}
const RiskPredictionSchema = new Schema<IRiskPrediction>({
  zoneId: String,
  latitude: Number,
  longitude: Number,
  riskScore: Number,
  riskLevel: String,
  probability: Number,
  confidence: Number,
  factors: [{ name: String, contribution: Number, rawValue: String }],
  modelName: String,
  timestamp: { type: Date, default: Date.now },
});
RiskPredictionSchema.index({ timestamp: -1, riskLevel: 1 });

// 4. WeatherData Model
export interface IWeatherData extends Document {
  stationName: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rainfallCurrent: number;
  rainfall24h: number;
  rainfall72h: number;
  condition: string;
  timestamp: Date;
}
const WeatherDataSchema = new Schema<IWeatherData>({
  stationName: String,
  state: String,
  district: String,
  latitude: Number,
  longitude: Number,
  temperature: Number,
  humidity: Number,
  rainfallCurrent: Number,
  rainfall24h: Number,
  rainfall72h: Number,
  condition: String,
  timestamp: { type: Date, default: Date.now },
});
WeatherDataSchema.index({ state: 1, district: 1, timestamp: -1 });

// 5. Sensor Model
export interface ISensor extends Document {
  sensorCode: string;
  name: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  depthCm: number;
  status: 'ONLINE' | 'OFFLINE' | 'CRITICAL';
  batteryPct: number;
  latestMoisturePct: number;
  lastCommunication: Date;
}
const SensorSchema = new Schema<ISensor>({
  sensorCode: { type: String, unique: true, required: true },
  name: String,
  location: String,
  state: String,
  district: String,
  latitude: Number,
  longitude: Number,
  depthCm: Number,
  status: { type: String, enum: ['ONLINE', 'OFFLINE', 'CRITICAL'], default: 'ONLINE' },
  batteryPct: Number,
  latestMoisturePct: Number,
  lastCommunication: { type: Date, default: Date.now },
});
SensorSchema.index({ latitude: 1, longitude: 1, status: 1 });

// 6. SensorReading Model
export interface ISensorReading extends Document {
  sensorId: string;
  moisturePct: number;
  batteryPct: number;
  timestamp: Date;
}
const SensorReadingSchema = new Schema<ISensorReading>({
  sensorId: { type: String, required: true },
  moisturePct: Number,
  batteryPct: Number,
  timestamp: { type: Date, default: Date.now },
});
SensorReadingSchema.index({ sensorId: 1, timestamp: -1 });

// 7. HistoricalLandslide Model
export interface IHistoricalLandslide extends Document {
  date: Date;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  severity: string;
  rainfallMm: number;
  casualties: number;
  roadImpact: string;
  source: string;
}
const HistoricalLandslideSchema = new Schema<IHistoricalLandslide>({
  date: Date,
  location: String,
  state: String,
  district: String,
  latitude: Number,
  longitude: Number,
  severity: String,
  rainfallMm: Number,
  casualties: Number,
  roadImpact: String,
  source: String,
});
HistoricalLandslideSchema.index({ state: 1, district: 1, severity: 1, date: -1 });

// 8. HazardReport Model
export interface IHazardReport extends Document {
  userId: string;
  userName: string;
  userRole: string;
  hazardType: string;
  description: string;
  severity: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  locationName: string;
  state: string;
  district: string;
  photoUrl?: string;
  videoUrl?: string;
  status: 'SUBMITTED' | 'UNDER REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';
  verifiedBy?: string;
  fieldNotes?: string;
  priorityScore?: number;
  createdAt: Date;
}
const HazardReportSchema = new Schema<IHazardReport>({
  userId: String,
  userName: String,
  userRole: String,
  hazardType: String,
  description: String,
  severity: String,
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  locationName: String,
  state: String,
  district: String,
  photoUrl: String,
  videoUrl: String,
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED'],
    default: 'SUBMITTED',
  },
  verifiedBy: String,
  fieldNotes: String,
  priorityScore: Number,
  createdAt: { type: Date, default: Date.now },
});
HazardReportSchema.index({ latitude: 1, longitude: 1, status: 1, createdAt: -1 });

// 9. Alert Model
export interface IAlert extends Document {
  title: string;
  location: string;
  state: string;
  district: string;
  riskScore: number;
  riskLevel: string;
  severity: string;
  cause: string;
  recommendedAction: string;
  active: boolean;
  timestamp: Date;
}
const AlertSchema = new Schema<IAlert>({
  title: String,
  location: String,
  state: String,
  district: String,
  riskScore: Number,
  riskLevel: String,
  severity: String,
  cause: String,
  recommendedAction: String,
  active: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});
AlertSchema.index({ state: 1, district: 1, active: 1, timestamp: -1 });

// 10. Road Model
export interface IRoad extends Document {
  name: string;
  code: string;
  from: string;
  to: string;
  status: 'OPEN' | 'PARTIALLY BLOCKED' | 'BLOCKED';
  riskScore: number;
  cause?: string;
  reportsCount: number;
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}
const RoadSchema = new Schema<IRoad>({
  name: String,
  code: { type: String, unique: true },
  from: String,
  to: String,
  status: { type: String, enum: ['OPEN', 'PARTIALLY BLOCKED', 'BLOCKED'], default: 'OPEN' },
  riskScore: Number,
  cause: String,
  reportsCount: { type: Number, default: 0 },
  latitude: Number,
  longitude: Number,
  lastUpdated: { type: Date, default: Date.now },
});
RoadSchema.index({ status: 1, code: 1 });

// 11. ResponseTeam Model
export interface IResponseTeam extends Document {
  name: string;
  type: string;
  agency: string;
  contact: string;
  baseLocation: string;
  state: string;
  personnelCount: number;
  available: boolean;
}
const ResponseTeamSchema = new Schema<IResponseTeam>({
  name: String,
  type: String,
  agency: String,
  contact: String,
  baseLocation: String,
  state: String,
  personnelCount: Number,
  available: { type: Boolean, default: true },
});

// 12. ResponseAssignment Model
export interface IResponseAssignment extends Document {
  incidentId: string;
  incidentTitle: string;
  teamId: string;
  teamName: string;
  priorityScore: number;
  priorityLevel: string;
  status: 'ASSIGNED' | 'EN ROUTE' | 'ON SITE' | 'RESOLVED';
  location: string;
  actionTaken?: string;
  assignedAt: Date;
  updatedAt: Date;
}
const ResponseAssignmentSchema = new Schema<IResponseAssignment>({
  incidentId: String,
  incidentTitle: String,
  teamId: String,
  teamName: String,
  priorityScore: Number,
  priorityLevel: String,
  status: { type: String, enum: ['ASSIGNED', 'EN ROUTE', 'ON SITE', 'RESOLVED'], default: 'ASSIGNED' },
  location: String,
  actionTaken: String,
  assignedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
ResponseAssignmentSchema.index({ incidentId: 1, status: 1 });

// 13. FieldObservation Model
export interface IFieldObservation extends Document {
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
  rockfallActivity: string;
  waterSeepage: string;
  roadCondition: string;
  soilCondition: string;
  photoUrl?: string;
  notes: string;
  timestamp: Date;
}
const FieldObservationSchema = new Schema<IFieldObservation>({
  officerId: String,
  officerName: String,
  locationName: String,
  state: String,
  district: String,
  latitude: Number,
  longitude: Number,
  slopeCondition: String,
  cracksObserved: Boolean,
  cracksDepthCm: Number,
  rockfallActivity: String,
  waterSeepage: String,
  roadCondition: String,
  soilCondition: String,
  photoUrl: String,
  notes: String,
  timestamp: { type: Date, default: Date.now },
});
FieldObservationSchema.index({ state: 1, district: 1, timestamp: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
export const RiskZone = mongoose.model<IRiskZone>('RiskZone', RiskZoneSchema);
export const RiskPrediction = mongoose.model<IRiskPrediction>('RiskPrediction', RiskPredictionSchema);
export const WeatherData = mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
export const Sensor = mongoose.model<ISensor>('Sensor', SensorSchema);
export const SensorReading = mongoose.model<ISensorReading>('SensorReading', SensorReadingSchema);
export const HistoricalLandslide = mongoose.model<IHistoricalLandslide>('HistoricalLandslide', HistoricalLandslideSchema);
export const HazardReport = mongoose.model<IHazardReport>('HazardReport', HazardReportSchema);
export const Alert = mongoose.model<IAlert>('Alert', AlertSchema);
export const Road = mongoose.model<IRoad>('Road', RoadSchema);
export const ResponseTeam = mongoose.model<IResponseTeam>('ResponseTeam', ResponseTeamSchema);
export const ResponseAssignment = mongoose.model<IResponseAssignment>('ResponseAssignment', ResponseAssignmentSchema);
export const FieldObservation = mongoose.model<IFieldObservation>('FieldObservation', FieldObservationSchema);
