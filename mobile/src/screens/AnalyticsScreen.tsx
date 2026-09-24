import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface AnalyticsScreenProps {
  onBack: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack }) => {
  const weeklyTrend = [
    { day: 'Mon', rain: 45, risk: 38 },
    { day: 'Tue', rain: 60, risk: 44 },
    { day: 'Wed', rain: 95, risk: 52 },
    { day: 'Thu', rain: 120, risk: 58 },
    { day: 'Fri', rain: 180, risk: 74 },
    { day: 'Sat', rain: 220, risk: 84 },
    { day: 'Sun', rain: 160, risk: 78 },
  ];

  const stateIncidents = [
    { state: 'Sikkim', count: 38, pct: 26 },
    { state: 'Assam (Dima Hasao)', count: 31, pct: 21 },
    { state: 'Meghalaya', count: 28, pct: 19 },
    { state: 'Mizoram', count: 22, pct: 15 },
    { state: 'Nagaland', count: 17, pct: 12 },
    { state: 'Manipur', count: 10, pct: 7 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DISASTER RISK ANALYTICS</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiVal}>94.2%</Text>
            <Text style={styles.kpiLabel}>VERIFICATION ACCURACY</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiVal}>18 mins</Text>
            <Text style={styles.kpiLabel}>AVG. DEOC RESPONSE</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiVal, { color: colors.danger }]}>62%</Text>
            <Text style={styles.kpiLabel}>HIGH-RISK CORRIDORS</Text>
          </View>
        </View>

        {/* Rainfall vs Risk Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>7-DAY PRECIPITATION VS. AI RISK SCORE</Text>
          <Text style={styles.chartSub}>Shows high correlation between rainfall spikes and landslide probability:</Text>

          <View style={styles.barChartContainer}>
            {weeklyTrend.map((item, idx) => (
              <View key={idx} style={styles.barCol}>
                {/* Risk Height Bar */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.risk}%`,
                        backgroundColor:
                          item.risk > 70
                            ? colors.riskHigh
                            : item.risk > 40
                            ? colors.riskModerate
                            : colors.riskLow,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barScore}>{item.risk}</Text>
                <Text style={styles.barDay}>{item.day}</Text>
                <Text style={styles.barRain}>{item.rain}mm</Text>
              </View>
            ))}
          </View>
        </View>

        {/* State Incident Frequency */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>HISTORICAL LANDSLIDES BY NER STATE</Text>
          <Text style={styles.chartSub}>Distribution from GSI National Landslide Susceptibility Mapping:</Text>

          <View style={styles.stateBars}>
            {stateIncidents.map((s, idx) => (
              <View key={idx} style={styles.stateBarItem}>
                <View style={styles.stateBarHeader}>
                  <Text style={styles.stateBarName}>{s.state}</Text>
                  <Text style={styles.stateBarCount}>{s.count} incidents ({s.pct}%)</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${s.pct * 3}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingVertical: 4,
    marginRight: 12,
  },
  backBtnText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 12,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiVal: {
    ...typography.headline,
    fontSize: 16,
    color: colors.textPrimary,
  },
  kpiLabel: {
    ...typography.captionBold,
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  chartTitle: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  chartSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
    marginTop: 2,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: colors.card,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barScore: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textPrimary,
    marginTop: 4,
  },
  barDay: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  barRain: {
    ...typography.caption,
    fontSize: 9,
    color: colors.primary,
  },
  stateBars: {
    gap: 12,
  },
  stateBarItem: {
    gap: 4,
  },
  stateBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stateBarName: {
    ...typography.callout,
    color: colors.textPrimary,
    fontSize: 12,
  },
  stateBarCount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.card,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
