import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Road } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface RoadStatusCardProps {
  road: Road;
}

export const RoadStatusCard: React.FC<RoadStatusCardProps> = ({ road }) => {
  const getStatusColor = () => {
    if (road.status === 'BLOCKED') return colors.roadBlocked;
    if (road.status === 'PARTIALLY BLOCKED') return colors.roadPartial;
    return colors.roadOpen;
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      <View style={styles.topRow}>
        <View style={styles.codePill}>
          <Text style={styles.codeText}>{road.code}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}20`, borderColor: statusColor },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{road.status}</Text>
        </View>
      </View>

      <Text style={styles.nameText}>{road.name}</Text>
      <Text style={styles.routeText}>
        {road.from} ➔ {road.to}
      </Text>

      {road.cause && (
        <View style={styles.causeBox}>
          <Text style={styles.causeLabel}>DISRUPTION REASON:</Text>
          <Text style={styles.causeText}>{road.cause}</Text>
        </View>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.updatedText}>Updated {road.lastUpdated}</Text>
        <Text style={styles.reportsCount}>
          ⚠️ {road.reportsCount} corroborating reports
        </Text>
      </View>
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
    borderLeftWidth: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codePill: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...typography.captionBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  nameText: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 15,
  },
  routeText: {
    ...typography.callout,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  causeBox: {
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  causeLabel: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  causeText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatedText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  reportsCount: {
    ...typography.captionBold,
    fontSize: 11,
    color: colors.warning,
  },
});
