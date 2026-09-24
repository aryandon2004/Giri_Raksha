import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface PriorityCardProps {
  rank: number;
  incidentTitle: string;
  location: string;
  priorityScore: number;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  factorsText: string;
  teamAssigned?: string;
  status: string;
  onAssignPress?: () => void;
  onRespondPress?: () => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({
  rank,
  incidentTitle,
  location,
  priorityScore,
  priorityLevel,
  factorsText,
  teamAssigned,
  status,
  onAssignPress,
  onRespondPress,
}) => {
  const isCritical = priorityLevel === 'CRITICAL';
  const scoreColor = isCritical ? colors.danger : colors.warning;

  return (
    <View style={[styles.card, { borderLeftColor: scoreColor }]}>
      <View style={styles.topRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>

        <View style={styles.scoreGroup}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>{priorityScore}</Text>
          <Text style={styles.scoreMax}>/ 100</Text>
          <View style={[styles.levelPill, { backgroundColor: `${scoreColor}20`, borderColor: scoreColor }]}>
            <Text style={[styles.levelText, { color: scoreColor }]}>{priorityLevel}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{incidentTitle}</Text>
      <Text style={styles.location}>📍 {location}</Text>

      <View style={styles.factorsBox}>
        <Text style={styles.factorsLabel}>PRIORITY FACTORS CONSIDERED:</Text>
        <Text style={styles.factorsText}>{factorsText}</Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.teamText}>
          Team: <Text style={styles.teamBold}>{teamAssigned || 'Unassigned'}</Text>
        </Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {onAssignPress && (
          <TouchableOpacity style={[styles.actionBtn, styles.assignBtn]} onPress={onAssignPress} activeOpacity={0.8}>
            <Text style={styles.assignBtnText}>ASSIGN TEAM</Text>
          </TouchableOpacity>
        )}
        {onRespondPress && (
          <TouchableOpacity style={[styles.actionBtn, styles.respondBtn]} onPress={onRespondPress} activeOpacity={0.8}>
            <Text style={styles.respondBtnText}>MARK RESPONDED</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 8,
  },
  rankBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  rankText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 13,
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreNumber: {
    ...typography.headline,
    fontSize: 18,
  },
  scoreMax: {
    ...typography.caption,
    color: colors.textMuted,
  },
  levelPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: 4,
  },
  levelText: {
    ...typography.captionBold,
    fontSize: 9,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 2,
  },
  location: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 8,
  },
  factorsBox: {
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  factorsLabel: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  factorsText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  teamBold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignBtn: {
    backgroundColor: colors.primaryDark,
  },
  assignBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
  },
  respondBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  respondBtnText: {
    ...typography.captionBold,
    color: colors.success,
    fontSize: 11,
  },
});
