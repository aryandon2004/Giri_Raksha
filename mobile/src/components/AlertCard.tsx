import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Alert } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface AlertCardProps {
  alert: Alert;
  onActionPress?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onActionPress }) => {
  const isEmergency = alert.severity === 'EMERGENCY';
  const borderColor = isEmergency ? colors.riskCritical : colors.riskModerate;
  const bgBadge = isEmergency ? colors.riskCriticalBg : colors.riskModerateBg;

  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.topRow}>
        <View style={[styles.severityPill, { backgroundColor: bgBadge, borderColor }]}>
          <Text style={[styles.severityText, { color: isEmergency ? colors.riskCritical : colors.riskModerate }]}>
            {alert.severity} • RISK {alert.riskScore}%
          </Text>
        </View>
        <Text style={styles.timestamp}>{alert.timestamp}</Text>
      </View>

      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.locationText}>📍 {alert.location}</Text>

      <View style={styles.causeBox}>
        <Text style={styles.sectionLabel}>CAUSE:</Text>
        <Text style={styles.causeText}>{alert.cause}</Text>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.sectionLabel}>RECOMMENDED ACTION:</Text>
        <Text style={styles.actionText}>{alert.recommendedAction}</Text>
      </View>

      {onActionPress && (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isEmergency ? colors.riskCritical : colors.primaryDark }]}
          onPress={onActionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>
            {isEmergency ? 'VIEW EVACUATION ROUTE' : 'VIEW SAFETY PROTOCOLS'}
          </Text>
        </TouchableOpacity>
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
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  severityText: {
    ...typography.captionBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.headline,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationText: {
    ...typography.callout,
    color: colors.primary,
    marginBottom: 10,
  },
  causeBox: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  sectionLabel: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  causeText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    marginBottom: 10,
  },
  actionText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  actionBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
