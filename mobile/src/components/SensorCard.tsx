import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SoilMoistureSensor } from '../types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SensorCardProps {
  sensor: SoilMoistureSensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const getStatusColor = () => {
    if (sensor.status === 'CRITICAL') return colors.danger;
    if (sensor.status === 'OFFLINE') return colors.warning;
    return colors.success;
  };

  const statusColor = getStatusColor();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.idGroup}>
          <Text style={styles.sensorId}>{sensor.id}</Text>
          <Text style={styles.sensorName}>{sensor.name}</Text>
        </View>

        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{sensor.status}</Text>
        </View>
      </View>

      <Text style={styles.locationText}>📍 {sensor.location}</Text>

      {/* Moisture & Battery Bar */}
      <View style={styles.metricGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Soil Moisture Saturation</Text>
          <Text
            style={[
              styles.metricValue,
              { color: sensor.soilMoisture > 75 ? colors.danger : colors.primary },
            ]}
          >
            {sensor.soilMoisture}%
          </Text>
          {/* Progress bar */}
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${sensor.soilMoisture}%`,
                  backgroundColor:
                    sensor.soilMoisture > 75
                      ? colors.danger
                      : sensor.soilMoisture > 50
                      ? colors.warning
                      : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Battery Life</Text>
          <Text style={styles.metricValue}>{sensor.battery}%</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${sensor.battery}%`,
                  backgroundColor: sensor.battery < 20 ? colors.danger : colors.success,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Telemetry Depth: {sensor.depthCm} cm</Text>
        <Text style={styles.footerText}>Last ping: {sensor.lastCommunication}</Text>
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  idGroup: {
    flex: 1,
  },
  sensorId: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 12,
  },
  sensorName: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 14,
    marginTop: 1,
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...typography.captionBold,
    fontSize: 10,
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 8,
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    ...typography.headline,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  barTrack: {
    height: 5,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
});
