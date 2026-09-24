import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NER_STATES } from '../constants/nerRegions';
import { NERState, NERDistrict } from '../types';

interface RegionalViewScreenProps {
  onBack: () => void;
}

export const RegionalViewScreen: React.FC<RegionalViewScreenProps> = ({ onBack }) => {
  const [selectedState, setSelectedState] = useState<NERState>(NER_STATES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<NERDistrict | null>(
    NER_STATES[0].districts[0]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NER 8-STATE RISK MATRIX</Text>
      </View>

      {/* State Selector Horizontal Scroll */}
      <View style={styles.stateBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stateScroll}>
          {NER_STATES.map((st) => (
            <TouchableOpacity
              key={st.code}
              style={[
                styles.stateTab,
                selectedState.code === st.code && styles.stateTabActive,
              ]}
              onPress={() => {
                setSelectedState(st);
                setSelectedDistrict(st.districts[0]);
              }}
            >
              <Text
                style={[
                  styles.stateTabText,
                  selectedState.code === st.code && styles.stateTabTextActive,
                ]}
              >
                {st.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* State Summary Banner */}
        <View style={styles.stateBanner}>
          <View>
            <Text style={styles.stateName}>{selectedState.name.toUpperCase()}</Text>
            <Text style={styles.capitalText}>Capital: {selectedState.capital}</Text>
          </View>
          <View style={styles.contactsBox}>
            <Text style={styles.contactItem}>DEOC: {selectedState.deocContact}</Text>
            <Text style={styles.contactItem}>SDRF: {selectedState.sdrfContact}</Text>
          </View>
        </View>

        {/* District Matrix */}
        <Text style={styles.sectionTitle}>VULNERABLE DISTRICTS & SUSCEPTIBILITY</Text>
        <View style={styles.districtList}>
          {selectedState.districts.map((dist) => {
            const isSel = selectedDistrict?.id === dist.id;
            const isVeryHigh = dist.baselineSusceptibility === 'Very High';

            return (
              <TouchableOpacity
                key={dist.id}
                style={[styles.districtCard, isSel && styles.districtCardActive]}
                onPress={() => setSelectedDistrict(dist)}
              >
                <View style={styles.districtTop}>
                  <Text style={styles.districtName}>{dist.name}</Text>
                  <View
                    style={[
                      styles.susceptibilityPill,
                      {
                        backgroundColor: isVeryHigh
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.susceptibilityText,
                        { color: isVeryHigh ? colors.danger : colors.warning },
                      ]}
                    >
                      {dist.baselineSusceptibility} Susceptibility
                    </Text>
                  </View>
                </View>

                <Text style={styles.roadsLabel}>
                  Major Corridors: {dist.majorRoads.join(' • ')}
                </Text>
                <Text style={styles.coordText}>
                  Coordinates: {dist.latitude.toFixed(4)}° N, {dist.longitude.toFixed(4)}° E
                </Text>
              </TouchableOpacity>
            );
          })}
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
  stateBar: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stateScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  stateTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stateTabActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  stateTabText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 11,
  },
  stateTabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  stateBanner: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stateName: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16,
    letterSpacing: 1,
  },
  capitalText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  contactsBox: {
    alignItems: 'flex-end',
  },
  contactItem: {
    ...typography.captionBold,
    fontSize: 11,
    color: colors.accent,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  districtList: {
    gap: 10,
  },
  districtCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  districtCardActive: {
    borderColor: colors.primary,
  },
  districtTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  districtName: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 14,
  },
  susceptibilityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  susceptibilityText: {
    ...typography.captionBold,
    fontSize: 9,
  },
  roadsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  coordText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
});
