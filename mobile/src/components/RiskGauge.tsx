import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 150 }) => {
  const getColor = () => {
    if (level === 'HIGH') return colors.riskHigh;
    if (level === 'MODERATE') return colors.riskModerate;
    return colors.riskLow;
  };

  const getBgColor = () => {
    if (level === 'HIGH') return colors.riskHighBg;
    if (level === 'MODERATE') return colors.riskModerateBg;
    return colors.riskLowBg;
  };

  const mainColor = getColor();
  const ringBg = getBgColor();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: mainColor,
          backgroundColor: ringBg,
        },
      ]}
    >
      <View
        style={[
          styles.innerCircle,
          {
            width: size - 22,
            height: size - 22,
            borderRadius: (size - 22) / 2,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Text style={[styles.scoreText, { color: mainColor }]}>{score}</Text>
        <Text style={styles.maxText}>/ 100</Text>
        <View style={[styles.levelPill, { backgroundColor: mainColor }]}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 12,
  },
  innerCircle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  scoreText: {
    ...typography.metricLarge,
    lineHeight: 46,
  },
  maxText: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginTop: -2,
    marginBottom: 4,
  },
  levelPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  levelText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
