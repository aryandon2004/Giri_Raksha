import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { SensorCard } from '../components/SensorCard';

interface SensorsScreenProps {
  onBack: () => void;
}

export const SensorsScreen: React.FC<SensorsScreenProps> = ({ onBack }) => {
  const { sensors } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'CRITICAL'>('ALL');
  const [query, setQuery] = useState('');

  const total = sensors.length;
  const online = sensors.filter((s) => s.status === 'ONLINE').length;
  const offline = sensors.filter((s) => s.status === 'OFFLINE').length;
  const critical = sensors.filter((s) => s.status === 'CRITICAL').length;

  const filteredSensors = sensors.filter((s) => {
    if (filter !== 'ALL' && s.status !== filter) return false;
    if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.location.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SOIL MOISTURE SENSOR TELEMETRY</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: colors.primary }]}>
            <Text style={styles.statNum}>{total}</Text>
            <Text style={styles.statLabel}>TOTAL NODES</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.success }]}>
            <Text style={[styles.statNum, { color: colors.success }]}>{online}</Text>
            <Text style={styles.statLabel}>ONLINE</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.warning }]}>
            <Text style={[styles.statNum, { color: colors.warning }]}>{offline}</Text>
            <Text style={styles.statLabel}>OFFLINE</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.danger }]}>
            <Text style={[styles.statNum, { color: colors.danger }]}>{critical}</Text>
            <Text style={styles.statLabel}>SATURATED</Text>
          </View>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchBar}
          placeholder="Filter sensors by location or station ID..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        {/* Status Filter Chips */}
        <View style={styles.filterRow}>
          {(['ALL', 'ONLINE', 'CRITICAL', 'OFFLINE'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {filteredSensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
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
    fontSize: 12,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNum: {
    ...typography.headline,
    fontSize: 18,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.captionBold,
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchBar: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    color: colors.textPrimary,
    fontSize: 13,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
