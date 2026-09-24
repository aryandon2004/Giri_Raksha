import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HazardReport } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';

interface ReportCardProps {
  report: HazardReport;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onVerify, onReject }) => {
  const { role } = useApp();
  const canVerify = (role === 'field_officer' || role === 'admin') && report.status === 'SUBMITTED';

  const getSeverityColor = () => {
    if (report.severity === 'CRITICAL') return colors.danger;
    if (report.severity === 'HIGH') return colors.riskHigh;
    if (report.severity === 'MEDIUM') return colors.warning;
    return colors.success;
  };

  const getStatusBg = () => {
    if (report.status === 'VERIFIED') return 'rgba(16, 185, 129, 0.15)';
    if (report.status === 'REJECTED') return 'rgba(239, 68, 68, 0.15)';
    return 'rgba(245, 158, 11, 0.15)';
  };

  const sevColor = getSeverityColor();

  return (
    <View style={styles.card}>
      {/* Header: Hazard Type & Sync / Status */}
      <View style={styles.topRow}>
        <View style={styles.hazardBadge}>
          <Text style={styles.hazardText}>{report.hazardType}</Text>
        </View>

        <View style={styles.badgeGroup}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBg() }]}>
            <Text style={styles.statusText}>{report.status}</Text>
          </View>
          <View
            style={[
              styles.syncBadge,
              {
                backgroundColor:
                  report.syncStatus === 'SYNCED'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(249, 115, 22, 0.2)',
              },
            ]}
          >
            <Text
              style={[
                styles.syncText,
                { color: report.syncStatus === 'SYNCED' ? colors.online : colors.offline },
              ]}
            >
              {report.syncStatus}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.desc}>{report.description}</Text>

      {/* Photo Preview if available */}
      {report.photoUri && (
        <Image
          source={{ uri: report.photoUri }}
          style={styles.photo}
          resizeMode="cover"
        />
      )}

      {/* Geo-tag & Telemetry Details */}
      <View style={styles.metaBox}>
        <Text style={styles.metaItem}>
          📍 {report.locationName || `${report.latitude.toFixed(4)}°N, ${report.longitude.toFixed(4)}°E`}
        </Text>
        <Text style={styles.accuracyText}>Accuracy: ±{report.accuracy.toFixed(1)}m</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.authorText}>
          Reported by: <Text style={styles.authorBold}>{report.userName}</Text>
        </Text>
        <Text style={[styles.sevText, { color: sevColor }]}>{report.severity} SEVERITY</Text>
      </View>

      {report.verifiedBy && (
        <View style={styles.verifiedBox}>
          <Text style={styles.verifiedText}>✓ Verified by: {report.verifiedBy}</Text>
          {report.fieldNotes && <Text style={styles.fieldNotes}>"{report.fieldNotes}"</Text>}
        </View>
      )}

      {/* Field Officer / Admin Action Buttons */}
      {canVerify && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => onReject && onReject(report.id)}
          >
            <Text style={styles.rejectBtnText}>REJECT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.verifyBtn]}
            onPress={() => onVerify && onVerify(report.id)}
          >
            <Text style={styles.verifyBtnText}>VERIFY AS OFFICIAL</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hazardBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hazardText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textPrimary,
  },
  syncBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  syncText: {
    ...typography.captionBold,
    fontSize: 9,
  },
  desc: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: colors.card,
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  metaItem: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
    flex: 1,
  },
  accuracyText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  authorBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sevText: {
    ...typography.captionBold,
    fontSize: 11,
  },
  verifiedBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  verifiedText: {
    ...typography.captionBold,
    color: colors.success,
    fontSize: 11,
  },
  fieldNotes: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  rejectBtnText: {
    ...typography.captionBold,
    color: colors.danger,
    fontSize: 11,
  },
  verifyBtn: {
    backgroundColor: colors.success,
  },
  verifyBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
  },
});
