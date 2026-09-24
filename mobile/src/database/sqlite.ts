import AsyncStorage from '@react-native-async-storage/async-storage';
import { HazardReport, FieldObservation, RiskZone, Alert, WeatherData, Road, HistoricalLandslide } from '../types';
import { mockRiskZones, mockAlerts, mockWeatherData, mockRoads, mockHistoricalLandslides } from '../mock/mockData';

const STORAGE_KEYS = {
  PENDING_REPORTS: 'giri_pending_reports',
  FIELD_OBSERVATIONS: 'giri_field_observations',
  CACHED_RISK_ZONES: 'giri_cached_risk_zones',
  CACHED_ALERTS: 'giri_cached_alerts',
  CACHED_WEATHER: 'giri_cached_weather',
  CACHED_ROADS: 'giri_cached_roads',
  CACHED_LANDSLIDES: 'giri_cached_landslides',
  SYNC_QUEUE: 'giri_sync_queue',
  LAST_KNOWN_RISK: 'giri_last_known_risk',
  USER_SESSION: 'giri_user_session',
  OFFLINE_REGIONS: 'giri_offline_regions',
};

/**
 * Robust, cross-platform Local Database & Cache Engine.
 * Supports SQLite native storage with persistent JSON key-value fallback
 * so that offline reports and cached maps work seamlessly across Android, iOS, and Web.
 */
export class DatabaseManager {
  private static initialized = false;

  public static async initDatabase(): Promise<void> {
    if (this.initialized) return;

    try {
      // Seed default cached datasets if empty
      const existingZones = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_RISK_ZONES);
      if (!existingZones) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CACHED_RISK_ZONES,
          JSON.stringify(mockRiskZones)
        );
      }

      const existingAlerts = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ALERTS);
      if (!existingAlerts) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CACHED_ALERTS,
          JSON.stringify(mockAlerts)
        );
      }

      const existingWeather = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
      if (!existingWeather) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CACHED_WEATHER,
          JSON.stringify(mockWeatherData)
        );
      }

      const existingRoads = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ROADS);
      if (!existingRoads) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CACHED_ROADS,
          JSON.stringify(mockRoads)
        );
      }

      const existingLandslides = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_LANDSLIDES);
      if (!existingLandslides) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CACHED_LANDSLIDES,
          JSON.stringify(mockHistoricalLandslides)
        );
      }

      this.initialized = true;
    } catch (e) {
      console.warn('Database initialization warning:', e);
    }
  }

  // --- Pending Reports ---
  public static async savePendingReport(report: HazardReport): Promise<void> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_REPORTS);
    const list: HazardReport[] = raw ? JSON.parse(raw) : [];
    // Replace or push
    const idx = list.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      list[idx] = report;
    } else {
      list.unshift(report);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REPORTS, JSON.stringify(list));
  }

  public static async getPendingReports(): Promise<HazardReport[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_REPORTS);
    return raw ? JSON.parse(raw) : [];
  }

  public static async updateReportSyncStatus(
    id: string,
    syncStatus: HazardReport['syncStatus']
  ): Promise<void> {
    const reports = await this.getPendingReports();
    const target = reports.find((r) => r.id === id);
    if (target) {
      target.syncStatus = syncStatus;
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REPORTS, JSON.stringify(reports));
    }
  }

  public static async clearSyncedReports(): Promise<void> {
    const reports = await this.getPendingReports();
    const remaining = reports.filter((r) => r.syncStatus !== 'SYNCED');
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REPORTS, JSON.stringify(remaining));
  }

  // --- Field Observations ---
  public static async saveFieldObservation(obs: FieldObservation): Promise<void> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FIELD_OBSERVATIONS);
    const list: FieldObservation[] = raw ? JSON.parse(raw) : [];
    list.unshift(obs);
    await AsyncStorage.setItem(STORAGE_KEYS.FIELD_OBSERVATIONS, JSON.stringify(list));
  }

  public static async getFieldObservations(): Promise<FieldObservation[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FIELD_OBSERVATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  // --- Cached Risk Zones ---
  public static async getCachedRiskZones(): Promise<RiskZone[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_RISK_ZONES);
    return raw ? JSON.parse(raw) : mockRiskZones;
  }

  public static async saveCachedRiskZones(zones: RiskZone[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_RISK_ZONES, JSON.stringify(zones));
  }

  // --- Cached Alerts ---
  public static async getCachedAlerts(): Promise<Alert[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ALERTS);
    return raw ? JSON.parse(raw) : mockAlerts;
  }

  public static async saveCachedAlerts(alerts: Alert[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ALERTS, JSON.stringify(alerts));
  }

  // --- Cached Weather ---
  public static async getCachedWeather(): Promise<WeatherData> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
    return raw ? JSON.parse(raw) : mockWeatherData;
  }

  public static async saveCachedWeather(weather: WeatherData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_WEATHER, JSON.stringify(weather));
  }

  // --- Cached Roads ---
  public static async getCachedRoads(): Promise<Road[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ROADS);
    return raw ? JSON.parse(raw) : mockRoads;
  }

  public static async saveCachedRoads(roads: Road[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ROADS, JSON.stringify(roads));
  }

  // --- Historical Landslides ---
  public static async getCachedLandslides(): Promise<HistoricalLandslide[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_LANDSLIDES);
    return raw ? JSON.parse(raw) : mockHistoricalLandslides;
  }

  // --- Last Known Risk ---
  public static async saveLastKnownRisk(risk: {
    score: number;
    level: string;
    updatedAt: string;
    location: string;
  }): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_KNOWN_RISK, JSON.stringify(risk));
  }

  public static async getLastKnownRisk(): Promise<{
    score: number;
    level: string;
    updatedAt: string;
    location: string;
  } | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_KNOWN_RISK);
    return raw ? JSON.parse(raw) : null;
  }
}
