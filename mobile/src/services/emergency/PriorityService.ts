import { ReportSeverity } from '../../types';

export interface PriorityInput {
  riskScore: number; // 0 - 100
  severity: ReportSeverity; // LOW, MEDIUM, HIGH, CRITICAL
  populationAffected: number; // estimated people in area
  roadImportance: 'National Highway' | 'State Highway' | 'District Road' | 'Local Village Road';
  reportCount: number; // number of corroborating reports
  distanceToHospitalKm?: number;
  historicalIncidents?: number;
}

export class PriorityService {
  /**
   * Calculates an AI-assisted Emergency Priority Score (0 - 100)
   * used by District Emergency Operation Centers (DEOC) to rank disaster response.
   */
  public static calculatePriority(input: PriorityInput): {
    score: number;
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    breakdown: { factor: string; points: number }[];
  } {
    const {
      riskScore,
      severity,
      populationAffected,
      roadImportance,
      reportCount,
      distanceToHospitalKm = 5,
      historicalIncidents = 10,
    } = input;

    // 1. Base Landslide Risk Score (weight: 30%)
    const riskPoints = Math.round((riskScore / 100) * 30);

    // 2. Field Severity (weight: 25%)
    let severityPoints = 10;
    if (severity === 'CRITICAL') severityPoints = 25;
    else if (severity === 'HIGH') severityPoints = 20;
    else if (severity === 'MEDIUM') severityPoints = 14;

    // 3. Population Vulnerability (weight: 20%)
    let popPoints = 5;
    if (populationAffected > 10000) popPoints = 20;
    else if (populationAffected > 5000) popPoints = 16;
    else if (populationAffected > 1000) popPoints = 12;
    else if (populationAffected > 200) popPoints = 8;

    // 4. Transport Lifeline Disruption (weight: 15%)
    let roadPoints = 5;
    if (roadImportance === 'National Highway') roadPoints = 15;
    else if (roadImportance === 'State Highway') roadPoints = 11;
    else if (roadImportance === 'District Road') roadPoints = 8;

    // 5. Corroborating Field Reports & Proximity (weight: 10%)
    const reportPoints = Math.min(6, reportCount * 2);
    const hospitalBonus = distanceToHospitalKm < 3 ? 4 : 2;
    const validationPoints = reportPoints + hospitalBonus;

    const total = Math.min(
      100,
      Math.max(0, riskPoints + severityPoints + popPoints + roadPoints + validationPoints)
    );

    let level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (total >= 85) level = 'CRITICAL';
    else if (total >= 70) level = 'HIGH';
    else if (total >= 45) level = 'MEDIUM';

    return {
      score: total,
      level,
      breakdown: [
        { factor: 'AI Geotechnical Risk', points: riskPoints },
        { factor: 'Observed Field Severity', points: severityPoints },
        { factor: 'Vulnerable Population', points: popPoints },
        { factor: 'Lifeline Road Impact', points: roadPoints },
        { factor: 'Corroboration & Proximity', points: validationPoints },
      ],
    };
  }
}
