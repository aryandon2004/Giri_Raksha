import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { t } from '../localization/i18n';

interface WeatherCardProps {
  weather: WeatherData | null;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>{t('weatherCardTitle')}</Text>
          <Text style={styles.conditionText}>{weather.condition}</Text>
        </View>

        {weather.isDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>{t('demoDataBadge')}</Text>
          </View>
        )}
      </View>

      {/* Primary Metrics Grid */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.metricLabel}>{t('temperature')}</Text>
          <Text style={styles.metricValue}>{weather.temperature}°C</Text>
          <Text style={styles.metricSub}>Ambient</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.metricLabel}>{t('humidity')}</Text>
          <Text style={styles.metricValue}>{weather.humidity}%</Text>
          <Text style={styles.metricSub}>RH Saturation</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.metricLabel}>{t('rainfall24h')}</Text>
          <Text
            style={[
              styles.metricValue,
              { color: weather.rainfall24h > 150 ? colors.danger : colors.primary },
            ]}
          >
            {weather.rainfall24h} mm
          </Text>
          <Text style={styles.metricSub}>Trigger: 100mm</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.metricLabel}>{t('rainfall72h')}</Text>
          <Text style={styles.metricValue}>{weather.rainfall72h} mm</Text>
          <Text style={styles.metricSub}>Antecedent</Text>
        </View>
      </View>

      {/* Precipitation Forecast Strip */}
      <View style={styles.forecastSection}>
        <Text style={styles.forecastTitle}>{t('forecast')}</Text>
        <View style={styles.forecastRow}>
          {weather.forecast.map((item, idx) => (
            <View key={idx} style={styles.forecastDay}>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <Text
                style={[
                  styles.dayRain,
                  { color: item.risk === 'HIGH' ? colors.riskHigh : colors.riskModerate },
                ]}
              >
                {item.rainfall}mm
              </Text>
              <View
                style={[
                  styles.riskDot,
                  {
                    backgroundColor:
                      item.risk === 'HIGH'
                        ? colors.riskHigh
                        : item.risk === 'MODERATE'
                        ? colors.riskModerate
                        : colors.riskLow,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  conditionText: {
    ...typography.headline,
    color: colors.textPrimary,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  demoBadgeText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.warning,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.headline,
    fontSize: 16,
    color: colors.textPrimary,
    marginVertical: 3,
  },
  metricSub: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textSecondary,
  },
  forecastSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  forecastTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  dayRain: {
    ...typography.callout,
    fontWeight: '700',
    marginVertical: 2,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
