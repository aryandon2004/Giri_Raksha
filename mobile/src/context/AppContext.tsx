import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  RiskPrediction,
  WeatherData,
  SoilMoistureSensor,
  Alert,
  Road,
  HazardReport,
} from '../types';
import { SecureStorageManager } from '../storage/secureStorage';
import { DatabaseManager } from '../database/sqlite';
import { SyncService } from '../services/sync/SyncService';
import { RiskPredictionService } from '../services/ai/RiskPredictionService';
import { WeatherDataService } from '../services/weather/WeatherDataService';
import { SoilMoistureService } from '../services/sensors/SoilMoistureService';
import { RoadService } from '../services/roads/RoadService';
import { AlertService } from '../services/alerts/AlertService';
import { ReportService } from '../services/reports/ReportService';
import { SupportedLanguage, setLanguage, getLanguage } from '../localization/i18n';

interface AppContextType {
  user: User | null;
  role: UserRole;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  syncMessage: string;
  currentRisk: RiskPrediction;
  weather: WeatherData | null;
  sensors: SoilMoistureSensor[];
  roads: Road[];
  alerts: Alert[];
  reports: HazardReport[];
  language: SupportedLanguage;
  setUser: (u: User | null) => void;
  switchDemoRole: (r: UserRole) => void;
  toggleSimulatedNetwork: () => void;
  triggerManualSync: () => Promise<void>;
  updateLanguage: (lang: SupportedLanguage) => void;
  runHeavyRainfallDemo: () => Promise<void>;
  resetDemoState: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const defaultCitizenUser: User = {
  id: 'usr-cit-01',
  name: 'Priya Sharma',
  mobile: '+91 98620 12345',
  email: 'priya.sharma@example.com',
  role: 'citizen',
  state: 'Meghalaya',
  district: 'East Khasi Hills (Shillong)',
};

const defaultOfficerUser: User = {
  id: 'usr-fo-02',
  name: 'Officer T. Ao',
  mobile: '+91 94360 54321',
  email: 't.ao@sdrf.gov.in',
  role: 'field_officer',
  state: 'Nagaland',
  district: 'Kohima',
  designation: 'Sub-Divisional Disaster Officer (SDDO)',
};

const defaultAdminUser: User = {
  id: 'usr-adm-03',
  name: 'Dr. H. Roy (Director)',
  mobile: '+91 94350 98765',
  email: 'director@ne-deoc.gov.in',
  role: 'admin',
  state: 'Meghalaya',
  district: 'East Khasi Hills (Shillong)',
  designation: 'NER Disaster Management Authority',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultCitizenUser);
  const [role, setRole] = useState<UserRole>('citizen');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncMessage, setSyncMessage] = useState<string>('System Ready');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [sensors, setSensors] = useState<SoilMoistureSensor[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [language, setLangState] = useState<SupportedLanguage>('en');

  // Baseline risk prediction for Shillong (Score: 58 MODERATE)
  const [currentRisk, setCurrentRisk] = useState<RiskPrediction>(() =>
    RiskPredictionService.calculateRisk({
      rainfall24h: 120,
      rainfall72h: 210,
      rainfall7d: 350,
      soilMoisture: 60,
      slope: 38,
      area: 'Shillong Sector 4',
      district: 'East Khasi Hills (Shillong)',
      state: 'Meghalaya',
    })
  );

  useEffect(() => {
    const bootstrap = async () => {
      await DatabaseManager.initDatabase();
      SyncService.init();

      // Listen for sync updates
      const unsub = SyncService.addListener((state) => {
        setIsOnline(state.isOnline);
        setIsSyncing(state.isSyncing);
        setPendingCount(state.pendingCount);
        setSyncMessage(state.message);
      });

      // Load initial state
      await refreshAllData();

      return () => unsub();
    };
    bootstrap();
  }, []);

  const refreshAllData = async () => {
    const w = await WeatherDataService.getWeatherForLocation(25.5788, 91.8933);
    setWeather(w);

    const s = SoilMoistureService.getSensors();
    setSensors([...s]);

    const r = await RoadService.getRoads();
    setRoads([...r]);

    const a = await AlertService.getAlerts();
    setAlerts([...a]);

    const rep = await ReportService.getReports();
    setReports([...rep]);
  };

  const switchDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'citizen') {
      setUser(defaultCitizenUser);
    } else if (newRole === 'field_officer') {
      setUser(defaultOfficerUser);
    } else if (newRole === 'admin') {
      setUser(defaultAdminUser);
    }
  };

  const toggleSimulatedNetwork = () => {
    const next = !isSimulatedOffline;
    setIsSimulatedOffline(next);
    SyncService.setSimulatedOffline(next);
  };

  const triggerManualSync = async () => {
    await SyncService.syncNow();
    await refreshAllData();
  };

  const updateLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setLangState(lang);
  };

  /**
   * Complete SIH Heavy Rainfall Simulation Runner:
   * 1. Rainfall increases 120 -> 220 mm
   * 2. Soil moisture increases 60% -> 82%
   * 3. AI prediction increases 58 -> 84 (HIGH)
   * 4. High Risk Alert is generated
   * 5. Weather telemetry updates
   */
  const runHeavyRainfallDemo = async () => {
    // 1. Simulate weather
    const updatedWeather = await WeatherDataService.simulateHeavyRainfall();
    setWeather(updatedWeather);

    // 2. Simulate sensors
    SoilMoistureService.simulateSaturation();
    setSensors([...SoilMoistureService.getSensors()]);

    // 3. AI Prediction jumps to 84 (HIGH)
    const escalated = RiskPredictionService.calculateRisk({
      rainfall24h: 220,
      rainfall72h: 340,
      rainfall7d: 510,
      soilMoisture: 82,
      slope: 38,
      area: 'Shillong Sector 4 (Upper Ridge)',
      district: 'East Khasi Hills (Shillong)',
      state: 'Meghalaya',
    });
    setCurrentRisk(escalated);

    // 4. Trigger High Risk Alert
    await AlertService.simulateHighRiskAlert();
    const updatedAlerts = await AlertService.getAlerts();
    setAlerts([...updatedAlerts]);

    // 5. Update Road Impact
    await RoadService.simulateRoadBlockage();
    const updatedRoads = await RoadService.getRoads();
    setRoads([...updatedRoads]);

    // Cache updated risk
    await DatabaseManager.saveLastKnownRisk({
      score: escalated.score,
      level: escalated.riskLevel,
      updatedAt: new Date().toISOString(),
      location: escalated.location.area,
    });
  };

  const resetDemoState = async () => {
    const w = await WeatherDataService.resetWeather();
    setWeather(w);

    SoilMoistureService.resetSensors();
    setSensors([...SoilMoistureService.getSensors()]);

    await RoadService.resetRoads();
    setRoads([...(await RoadService.getRoads())]);

    await AlertService.resetAlerts();
    setAlerts([...(await AlertService.getAlerts())]);

    const baseline = RiskPredictionService.calculateRisk({
      rainfall24h: 120,
      rainfall72h: 210,
      rainfall7d: 350,
      soilMoisture: 60,
      slope: 38,
      area: 'Shillong Sector 4',
      district: 'East Khasi Hills (Shillong)',
      state: 'Meghalaya',
    });
    setCurrentRisk(baseline);

    setIsSimulatedOffline(false);
    SyncService.setSimulatedOffline(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isOnline,
        isSimulatedOffline,
        isSyncing,
        pendingCount,
        syncMessage,
        currentRisk,
        weather,
        sensors,
        roads,
        alerts,
        reports,
        language,
        setUser,
        switchDemoRole,
        toggleSimulatedNetwork,
        triggerManualSync,
        updateLanguage,
        runHeavyRainfallDemo,
        resetDemoState,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
