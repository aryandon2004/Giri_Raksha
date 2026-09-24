import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { EMERGENCY_NUMBERS } from '../constants/nerRegions';

interface EmergencyScreenProps {
  onBack: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onBack }) => {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMERGENCY SOS & PROTOCOLS</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Instant SOS Dialers */}
        <Text style={styles.sectionHeader}>INSTANT EMERGENCY HOTLINES</Text>
        <View style={styles.sosGrid}>
          <TouchableOpacity
            style={[styles.sosCard, styles.sos112]}
            onPress={() => handleCall(EMERGENCY_NUMBERS.nationalEmergency)}
            activeOpacity={0.8}
          >
            <Text style={styles.sosEmoji}>🚨</Text>
            <Text style={styles.sosNum}>112</Text>
            <Text style={styles.sosLabel}>NATIONAL EMERGENCY</Text>
            <Text style={styles.sosSub}>Police / Fire / Disaster</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sosCard, styles.sos108]}
            onPress={() => handleCall(EMERGENCY_NUMBERS.ambulance)}
            activeOpacity={0.8}
          >
            <Text style={styles.sosEmoji}>🚑</Text>
            <Text style={styles.sosNum}>108</Text>
            <Text style={styles.sosLabel}>MEDICAL & AMBULANCE</Text>
            <Text style={styles.sosSub}>Trauma Response</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subHotlinesCard}>
          <View style={styles.hotlineRow}>
            <View>
              <Text style={styles.hotlineName}>State Disaster Response Force (SDRF)</Text>
              <Text style={styles.hotlineDesc}>State emergency operations center</Text>
            </View>
            <TouchableOpacity
              style={styles.callSmallBtn}
              onPress={() => handleCall(EMERGENCY_NUMBERS.disasterManagement)}
            >
              <Text style={styles.callSmallText}>CALL 1070</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.hotlineRow}>
            <View>
              <Text style={styles.hotlineName}>Border Roads Organisation (BRO)</Text>
              <Text style={styles.hotlineDesc}>Lifeline highway clearance taskforce</Text>
            </View>
            <TouchableOpacity
              style={styles.callSmallBtn}
              onPress={() => handleCall(EMERGENCY_NUMBERS.broControlRoom)}
            >
              <Text style={styles.callSmallText}>CALL HQ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* What To Do During a Landslide */}
        <Text style={styles.sectionHeader}>WHAT TO DO DURING A LANDSLIDE</Text>
        <View style={styles.guidelineCard}>
          <View style={styles.guideItem}>
            <Text style={styles.guideIcon}>✓</Text>
            <Text style={styles.guideText}>
              Stay alert for rumbling sounds, snapping trees, or rapid changes in water flow.
            </Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideIcon}>✓</Text>
            <Text style={styles.guideText}>
              Move out of the path of the landslide or debris flow immediately to high, stable ground.
            </Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideIcon}>✓</Text>
            <Text style={styles.guideText}>
              If escape is not possible, curl into a tight ball and protect your head and neck.
            </Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideIcon}>✓</Text>
            <Text style={styles.guideText}>
              Check for injured or trapped persons without entering the direct slide path.
            </Text>
          </View>
        </View>

        {/* What NOT to Do */}
        <Text style={styles.sectionHeader}>WHAT NOT TO DO</Text>
        <View style={[styles.guidelineCard, styles.dontCard]}>
          <View style={styles.guideItem}>
            <Text style={[styles.guideIcon, { color: colors.danger }]}>✗</Text>
            <Text style={styles.guideText}>
              DO NOT walk, drive, or shelter in valleys, riverbeds, or drainage channels.
            </Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={[styles.guideIcon, { color: colors.danger }]}>✗</Text>
            <Text style={styles.guideText}>
              DO NOT attempt to cross flooded roads or bridges affected by debris flows.
            </Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={[styles.guideIcon, { color: colors.danger }]}>✗</Text>
            <Text style={styles.guideText}>
              DO NOT re-enter damaged buildings until authorized by SDRF inspectors.
            </Text>
          </View>
        </View>

        {/* Evacuation Shelters */}
        <Text style={styles.sectionHeader}>DESIGNATED RELIEF SHELTERS</Text>
        <View style={styles.shelterCard}>
          <Text style={styles.shelterName}>1. Shillong District Community Relief Center</Text>
          <Text style={styles.shelterLoc}>📍 Polo Grounds Indoor Stadium, Shillong • Capacity: 1,500</Text>
          <Text style={styles.shelterName}>2. Durtlang High School Evacuation Center</Text>
          <Text style={styles.shelterLoc}>📍 North Ridge Camp, Aizawl • Capacity: 800</Text>
          <Text style={styles.shelterName}>3. Haflong Town Hall Disaster Relief Post</Text>
          <Text style={styles.shelterLoc}>📍 Haflong Main Square, Dima Hasao • Capacity: 1,200</Text>
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
    paddingBottom: 40,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 8,
  },
  sosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sosCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  sos112: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: colors.danger,
  },
  sos108: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: colors.warning,
  },
  sosEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  sosNum: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
  },
  sosLabel: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sosSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  subHotlinesCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  hotlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotlineName: {
    ...typography.callout,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  hotlineDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  callSmallBtn: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  callSmallText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  guidelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: 14,
    gap: 10,
  },
  dontCard: {
    borderColor: colors.danger,
  },
  guideItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  guideIcon: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.success,
    marginTop: 1,
  },
  guideText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  shelterCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  shelterName: {
    ...typography.callout,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  shelterLoc: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
    marginBottom: 6,
  },
});
