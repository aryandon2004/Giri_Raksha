import { Alert } from '../../types';
import { DatabaseManager } from '../../database/sqlite';
import { mockAlerts } from '../../mock/mockData';

export class AlertService {
  public static async getAlerts(): Promise<Alert[]> {
    return await DatabaseManager.getCachedAlerts();
  }

  public static async triggerAlert(alert: Alert): Promise<Alert[]> {
    const list = await this.getAlerts();
    list.unshift(alert);
    await DatabaseManager.saveCachedAlerts(list);
    return list;
  }

  public static async simulateHighRiskAlert(): Promise<Alert> {
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      title: 'HIGH LANDSLIDE RISK — Shillong Sector 4',
      location: 'Upper Shillong & Laitkor Slopes, East Khasi Hills',
      state: 'Meghalaya',
      district: 'East Khasi Hills (Shillong)',
      riskScore: 84,
      riskLevel: 'HIGH',
      severity: 'WARNING',
      cause: 'Heavy rainfall escalation (220mm) + saturated soil (82%) on 38° slope.',
      recommendedAction:
        'Avoid vulnerable hillside roads, keep emergency supplies handy, and monitor local district warnings.',
      timestamp: 'Just now',
      active: true,
      broadcastChannel: 'ALL',
    };
    await this.triggerAlert(alert);
    return alert;
  }

  public static async resetAlerts(): Promise<Alert[]> {
    await DatabaseManager.saveCachedAlerts(mockAlerts);
    return mockAlerts;
  }
}
