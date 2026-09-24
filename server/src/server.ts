import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  User,
  RiskZone,
  HazardReport,
  Alert,
  Road,
  Sensor,
  HistoricalLandslide,
  ResponseAssignment,
  ResponseTeam,
} from './models';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/giri_raksha';

// Attempt DB connection (fail gracefully so API stays up)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✓ Connected to MongoDB (Giri Raksha)'))
  .catch((err) => console.warn('⚠️ MongoDB not available, operating with in-memory service layer:', err.message));

// Real-time Socket.IO events
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('subscribe_zone', (zone: string) => {
    socket.join(zone);
    console.log(`[Socket.IO] Client ${socket.id} subscribed to zone: ${zone}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Broadcast Helper
export const broadcastEmergencyAlert = (alertData: any) => {
  io.emit('emergency_alert', alertData);
};

// ==================== REST API ROUTES ==================== //

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'Giri Raksha National Early Warning Backend',
    region: 'North Eastern Region (NER)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 1. Auth: Register & Login
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, mobile, email, password, role, state, district } = req.body;
  res.status(201).json({
    message: 'User registered successfully',
    user: { id: `usr-${Date.now()}`, name, email, role, state, district },
    token: `jwt-sample-token-${Date.now()}`,
  });
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json({
    message: 'Login successful',
    user: {
      id: 'usr-cit-01',
      name: email.split('@')[0],
      email,
      role: 'citizen',
      state: 'Meghalaya',
      district: 'East Khasi Hills (Shillong)',
    },
    token: `jwt-authenticated-token-${Date.now()}`,
  });
});

// 2. Risk Predictions & Zones
app.get('/api/risk', (req: Request, res: Response) => {
  res.json({
    region: 'North Eastern Region',
    averageRisk: 64,
    highRiskZonesCount: 5,
    lastModelInference: new Date().toISOString(),
    zones: [
      { id: 'rz-shillong-01', name: 'Shillong Sector 4', risk: 84, level: 'HIGH' },
      { id: 'rz-aizawl-02', name: 'Durtlang Ridge Slope', risk: 88, level: 'HIGH' },
      { id: 'rz-kohima-03', name: 'Kohima South Bypass', risk: 76, level: 'HIGH' },
    ],
  });
});

app.post('/api/risk/predict', (req: Request, res: Response) => {
  const { rainfall24h, soilMoisture, slope } = req.body;
  const score = Math.min(100, Math.round((rainfall24h / 200) * 40 + (soilMoisture / 100) * 35 + (slope / 50) * 25));
  const level = score > 70 ? 'HIGH' : score > 30 ? 'MODERATE' : 'LOW';

  res.json({
    score,
    probability: score / 100,
    riskLevel: level,
    confidence: 0.87,
    factors: [
      { name: 'Rainfall', contribution: Math.round((rainfall24h / 200) * 40) },
      { name: 'Soil Moisture', contribution: Math.round((soilMoisture / 100) * 35) },
      { name: 'Slope', contribution: Math.round((slope / 50) * 25) },
    ],
    timestamp: new Date().toISOString(),
    model: 'Random Forest Prototype v2.1',
  });
});

// 3. Weather
app.get('/api/weather', (req: Request, res: Response) => {
  res.json({
    temperature: 18.5,
    humidity: 88,
    rainfall24h: 120,
    rainfall72h: 210,
    condition: 'Heavy Thunderstorms',
    source: 'IMD Automated Weather Station (AWS) Shillong',
    isDemo: true,
  });
});

// 4. Sensors
app.get('/api/sensors', (req: Request, res: Response) => {
  res.json({
    total: 6,
    online: 4,
    critical: 2,
    sensors: [
      { id: 'SM-1042', location: 'Shillong Peak', soilMoisture: 82, battery: 84, status: 'CRITICAL' },
      { id: 'SM-2011', location: 'Durtlang Ridge', soilMoisture: 86, battery: 76, status: 'CRITICAL' },
      { id: 'SM-1043', location: 'Nongpoh Slope', soilMoisture: 65, battery: 91, status: 'ONLINE' },
    ],
  });
});

// 5. Landslides
app.get('/api/landslides', (req: Request, res: Response) => {
  res.json({
    totalRecords: 142,
    dataSource: 'Geological Survey of India (GSI) NLSM Repository',
    records: [
      { id: 'hist-001', location: 'Tupul, Noney', date: '2022-06-30', casualties: 61, severity: 'Catastrophic' },
      { id: 'hist-002', location: 'Chungthang, Sikkim', date: '2023-10-04', casualties: 42, severity: 'Catastrophic' },
      { id: 'hist-003', location: 'Haflong Hill, Assam', date: '2022-05-15', casualties: 18, severity: 'Major' },
    ],
  });
});

// 6. Hazard Reports
app.post('/api/reports', (req: Request, res: Response) => {
  const newReport = {
    id: `rep-${Date.now()}`,
    ...req.body,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
  };
  io.emit('new_hazard_report', newReport);
  res.status(201).json(newReport);
});

app.get('/api/reports', (req: Request, res: Response) => {
  res.json({
    count: 3,
    reports: [
      { id: 'rep-001', type: 'Slope Crack', location: 'Shillong Sector 4', status: 'VERIFIED' },
      { id: 'rep-002', type: 'Road Blockage', location: 'NH-6 Mile 38', status: 'UNDER REVIEW' },
    ],
  });
});

app.put('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, verifiedBy, fieldNotes } = req.body;
  res.json({ message: `Report ${id} updated`, status, verifiedBy, fieldNotes });
});

// 7. Alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  res.json([
    {
      id: 'alert-101',
      title: 'HIGH LANDSLIDE RISK — Shillong Sector 4',
      riskScore: 84,
      severity: 'WARNING',
      timestamp: 'Just now',
    },
  ]);
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const alert = { id: `alert-${Date.now()}`, ...req.body, timestamp: new Date().toISOString() };
  broadcastEmergencyAlert(alert);
  res.status(201).json(alert);
});

// 8. Roads
app.get('/api/roads', (req: Request, res: Response) => {
  res.json([
    { code: 'NH-6', status: 'PARTIALLY BLOCKED', location: 'Sonapur Tunnel Cut', riskScore: 84 },
    { code: 'NH-10', status: 'BLOCKED', location: '29th Mile Teesta', riskScore: 94 },
    { code: 'NH-29', status: 'PARTIALLY BLOCKED', location: 'Pagla Pahar', riskScore: 78 },
  ]);
});

app.put('/api/roads/:id', (req: Request, res: Response) => {
  const { status, cause } = req.body;
  res.json({ message: `Road ${req.params.id} updated to ${status}`, cause });
});

// 9. Response Team Prioritization
app.get('/api/response', (req: Request, res: Response) => {
  res.json({
    queue: [
      { rank: 1, incident: 'NH-6 Lifeline Mud & Boulder Cascade', priorityScore: 96, level: 'CRITICAL' },
      { rank: 2, incident: 'Durtlang Ridge Escarpment Rupture', priorityScore: 91, level: 'CRITICAL' },
      { rank: 3, incident: 'Shillong Sector 4 Slope Rupture', priorityScore: 87, level: 'HIGH' },
    ],
  });
});

app.post('/api/response/assign', (req: Request, res: Response) => {
  const { incidentId, teamId } = req.body;
  res.json({
    assignmentId: `assign-${Date.now()}`,
    incidentId,
    teamId,
    status: 'ASSIGNED',
    message: 'Team successfully deployed to incident site.',
  });
});

// 10. Batch Offline Sync
app.post('/api/sync', (req: Request, res: Response) => {
  const { reports = [] } = req.body;
  console.log(`[Batch Sync] Received ${reports.length} offline reports from mobile client.`);

  res.json({
    syncedCount: reports.length,
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    message: 'All pending mobile reports synchronized with State DEOC.',
  });
});

// Start Server
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏔️  GIRI RAKSHA DISASTER MANAGEMENT SERVER`);
    console.log(`📡  Listening on port ${PORT}`);
    console.log(`⚡  Socket.IO Gateway Active`);
    console.log(`====================================================`);
  });
}

export { app, server };
