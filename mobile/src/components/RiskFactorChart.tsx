import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskFactor } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface RiskFactorChartProps {
  factors: RiskFactor[];
  modelName: string;
  confidence: number;
}

export const RiskFactorChart: React.FC<RiskFactorChartProps> = ({
  factors,
  modelName,
  confidence,
}) => {
  const maxContribution = 35; // Maximum theoretical single factor weight

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>EXPLAINABLE AI RISK BREAKDOWN</Text>
        <Text style={styles.confidencePill}>
          {Math.round(confidence * 100)}% CONFIDENCE
        </Text>
      </View>

      <Text style={styles.subtext}>
        Feature attribution computed via Random Forest tree decomposition:
      </Text>

      <View style={styles.factorList}>
        {factors.map((factor, index) => {
          const pct = Math.min(100, Math.round((factor.contribution / maxContribution) * 100));

          return (
            <View key={index} style={styles.factorItem}>
              <View style={styles.factorLabelRow}>
                <Text style={styles.factorName}>{factor.name}</Text>
                <Text style={styles.contributionText}>+{factor.contribution} pts</Text>
              </View>

              {/* Visual Progress Bar */}
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${pct}%`,
                      backgroundColor:
                        factor.contribution >= 25
                          ? colors.riskHigh
                          : factor.contribution >= 15
                          ? colors.riskModerate
                          : colors.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.factorDetailRow}>
                <Text style={styles.rawReading}>Telemetry: {factor.rawValue}</Text>
                <Text style={styles.factorDesc} numberOfLines={1}>
                  {factor.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.modelTag}>Model: {modelName}</Text>
        <Text style={styles.estimateBadge}>PROTOTYPE ESTIMATE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  confidencePill: {
    ...typography.captionBold,
    fontSize: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  factorList: {
    gap: 12,
  },
  factorItem: {
    gap: 4,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factorName: {
    ...typography.callout,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contributionText: {
    ...typography.callout,
    fontWeight: '700',
    color: colors.accent,
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  factorDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rawReading: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  factorDesc: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: '60%',
  },
  footerNote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modelTag: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  estimateBadge: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.warning,
    letterSpacing: 0.5,
  },
});
