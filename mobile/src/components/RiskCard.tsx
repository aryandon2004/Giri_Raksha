import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RiskPrediction } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RiskGauge } from './RiskGauge';
import { RiskFactorChart } from './RiskFactorChart';
import { t } from '../localization/i18n';

interface RiskCardProps {
  prediction: RiskPrediction;
  isOffline?: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({ prediction, isOffline }) => {
  const [showXai, setShowXai] = useState(true);

  const getBorderColor = () => {
    if (prediction.riskLevel === 'HIGH') return colors.riskHigh;
    if (prediction.riskLevel === 'MODERATE') return colors.riskModerate;
    return colors.riskLow;
  };

  return (
    <View style={[styles.card, { borderColor: getBorderColor() }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.headerLabel}>{t('currentRiskTitle')}</Text>
          <Text style={styles.locationSub}>
            {prediction.location.area}, {prediction.location.district}
          </Text>
        </View>

        {isOffline ? (
          <View style={styles.offlinePill}>
            <Text style={styles.offlinePillText}>CACHED DATA</Text>
          </View>
        ) : (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>AI INFERENCE ACTIVE</Text>
          </View>
        )}
      </View>

      {/* Primary Gauge */}
      <RiskGauge score={prediction.score} level={prediction.riskLevel} />

      {/* Summary Contributors Snippet */}
      <View style={styles.contributorsRow}>
        <View style={styles.contributorItem}>
          <Text style={styles.contribLabel}>{t('rainfall')}</Text>
          <Text style={styles.contribVal}>
            +{prediction.factors.find((f) => f.name.includes('Rainfall'))?.contribution || 28}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.contributorItem}>
          <Text style={styles.contribLabel}>{t('soilMoisture')}</Text>
          <Text style={styles.contribVal}>
            +{prediction.factors.find((f) => f.name.includes('Moisture'))?.contribution || 22}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.contributorItem}>
          <Text style={styles.contribLabel}>{t('slope')}</Text>
          <Text style={styles.contribVal}>
            +{prediction.factors.find((f) => f.name.includes('Slope'))?.contribution || 17}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.contributorItem}>
          <Text style={styles.contribLabel}>History</Text>
          <Text style={styles.contribVal}>
            +{prediction.factors.find((f) => f.name.includes('Historical'))?.contribution || 9}
          </Text>
        </View>
      </View>

      {/* Toggle Explainable AI Breakdown */}
      <TouchableOpacity
        style={styles.xaiToggleBtn}
        onPress={() => setShowXai(!showXai)}
        activeOpacity={0.7}
      >
        <Text style={styles.xaiToggleText}>
          {showXai ? '▲ HIDE EXPLAINABLE AI ANALYSIS' : '▼ VIEW EXPLAINABLE AI ANALYSIS (WHY?)'}
        </Text>
      </TouchableOpacity>

      {showXai && (
        <RiskFactorChart
          factors={prediction.factors}
          modelName={prediction.modelName}
          confidence={prediction.confidence}
        />
      )}

      {/* Disclaimer */}
      <Text style={styles.disclaimerText}>
        * {t('disclaimer')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  locationSub: {
    ...typography.headline,
    color: colors.textPrimary,
    marginTop: 2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.success,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  livePillText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.success,
  },
  offlinePill: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.offline,
  },
  offlinePillText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.offline,
  },
  contributorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  contributorItem: {
    alignItems: 'center',
  },
  contribLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  contribVal: {
    ...typography.headline,
    color: colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  xaiToggleBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  xaiToggleText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  disclaimerText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
});
