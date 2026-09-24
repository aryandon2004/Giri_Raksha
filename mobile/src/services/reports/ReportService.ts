import { HazardReport, FieldObservation, ReportStatus, ReportSeverity } from '../../types';
import { DatabaseManager } from '../../database/sqlite';
import { SyncService } from '../sync/SyncService';
import { mockHazardReports } from '../../mock/mockData';

export class ReportService {
  private static reports: HazardReport[] = [...mockHazardReports];

  public static async getReports(): Promise<HazardReport[]> {
    const offlinePending = await DatabaseManager.getPendingReports();
    // Combine offline pending with main list (avoiding duplicate IDs)
    const pendingIds = new Set(offlinePending.map((p) => p.id));
    const merged = [
      ...offlinePending,
      ...this.reports.filter((r) => !pendingIds.has(r.id)),
    ];
    return merged;
  }

  public static async submitReport(reportData: Omit<HazardReport, 'id' | 'createdAt' | 'syncStatus' | 'status'>): Promise<HazardReport> {
    const isOnline = SyncService.isOnline();
    const newReport: HazardReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: 'Just now',
      syncStatus: isOnline ? 'SYNCED' : 'PENDING',
      status: 'SUBMITTED',
      priorityScore: reportData.severity === 'CRITICAL' ? 92 : reportData.severity === 'HIGH' ? 84 : 65,
    };

    // Always persist to local SQLite queue
    await DatabaseManager.savePendingReport(newReport);

    if (isOnline) {
      this.reports.unshift(newReport);
    }

    return newReport;
  }

  public static async updateReportStatus(
    id: string,
    status: ReportStatus,
    verifiedBy: string,
    fieldNotes?: string,
    newSeverity?: ReportSeverity
  ): Promise<HazardReport | null> {
    const all = await this.getReports();
    const target = all.find((r) => r.id === id);
    if (target) {
      target.status = status;
      target.verifiedBy = verifiedBy;
      if (fieldNotes) target.fieldNotes = fieldNotes;
      if (newSeverity) target.severity = newSeverity;
      await DatabaseManager.savePendingReport(target);
      return target;
    }
    return null;
  }

  public static async submitFieldObservation(
    obsData: Omit<FieldObservation, 'id' | 'timestamp' | 'syncStatus'>
  ): Promise<FieldObservation> {
    const isOnline = SyncService.isOnline();
    const newObs: FieldObservation = {
      ...obsData,
      id: `obs-${Date.now()}`,
      timestamp: 'Just now',
      syncStatus: isOnline ? 'SYNCED' : 'PENDING',
    };
    await DatabaseManager.saveFieldObservation(newObs);
    return newObs;
  }

  public static async getFieldObservations(): Promise<FieldObservation[]> {
    return await DatabaseManager.getFieldObservations();
  }
}
