import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert as NativeAlert,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { ReportCard } from '../components/ReportCard';
import { NetworkStatusBadge } from '../components/NetworkStatusBadge';
import { ReportService } from '../services/reports/ReportService';

interface FieldOfficerScreenProps {
  onBack: () => void;
}

export const FieldOfficerScreen: React.FC<FieldOfficerScreenProps> = ({ onBack }) => {
  const { user, reports, isOnline, refreshAllData } = useApp();
  const [activeTab, setActiveTab] = useState<'verification' | 'observation'>('verification');

  // Field Observation Form State
  const [slopeCondition, setSlopeCondition] = useState('Active Creep / Debris Movement');
  const [cracksObserved, setCracksObserved] = useState(true);
  const [cracksDepth, setCracksDepth] = useState('14');
  const [rockfallActivity, setRockfallActivity] = useState<'None' | 'Minor' | 'Active' | 'Severe'>('Active');
  const [waterSeepage, setWaterSeepage] = useState<'Dry' | 'Damp' | 'Trickle' | 'Heavy Seepage'>('Heavy Seepage');
  const [roadCondition, setRoadCondition] = useState<'Normal' | 'Cracked' | 'Subsided' | 'Impending Failure'>('Subsided');
  const [soilCondition, setSoilCondition] = useState<'Dry' | 'Moist' | 'Saturated' | 'Fluidized'>('Saturated');
  const [notes, setNotes] = useState('Observed 14cm tension cracks propagating towards culvert toe.');

  const handleVerify = async (reportId: string) => {
    await ReportService.updateReportStatus(
      reportId,
      'VERIFIED',
      user?.name || 'Officer T. Ao',
      'Geotechnical hazard confirmed on site. Priority response recommended.'
    );
    await refreshAllData();
    NativeAlert.alert('Report Verified', `Hazard report ${reportId.substring(0, 7)} verified.`);
  };

  const handleReject = async (reportId: string) => {
    await ReportService.updateReportStatus(
      reportId,
      'REJECTED',
      user?.name || 'Officer T. Ao',
      'No imminent landslide danger identified at these coordinates.'
    );
    await refreshAllData();
    NativeAlert.alert('Report Rejected', `Report marked as non-hazardous.`);
  };

  const handleSubmitObservation = async () => {
    await ReportService.submitFieldObservation({
      officerId: user?.id || 'fo-1',
      officerName: user?.name || 'Field Officer',
      locationName: 'Shillong Sector 4 Escarpment Cut',
      state: user?.state || 'Meghalaya',
      district: user?.district || 'East Khasi Hills (Shillong)',
      latitude: 25.5788,
      longitude: 91.8933,
      slopeCondition,
      cracksObserved,
      cracksDepthCm: parseFloat(cracksDepth) || 10,
      rockfallActivity,
      waterSeepage,
      roadCondition,
      soilCondition,
      notes,
    });

    NativeAlert.alert(
      '✓ Observation Logged',
      isOnline
        ? 'Ground-truth observation synchronized with State Emergency Operations Center.'
        : 'Observation saved locally in SQLite pending queue (Offline Mode).'
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← HOME</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIELD OFFICER OPERATIONS</Text>
        <NetworkStatusBadge />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'verification' && styles.activeTab]}
          onPress={() => setActiveTab('verification')}
        >
          <Text style={[styles.tabText, activeTab === 'verification' && styles.activeTabText]}>
            VERIFICATION QUEUE ({reports.filter((r) => r.status === 'SUBMITTED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'observation' && styles.activeTab]}
          onPress={() => setActiveTab('observation')}
        >
          <Text style={[styles.tabText, activeTab === 'observation' && styles.activeTabText]}>
            + LOG FIELD SURVEY
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {activeTab === 'verification' ? (
          <>
            <Text style={styles.sectionHeader}>CITIZEN HAZARD REPORTS AWAITING VERIFICATION</Text>
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onVerify={handleVerify}
                onReject={handleReject}
              />
            ))}
          </>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.sectionHeader}>GROUND-TRUTH GEOLOGICAL SURVEY</Text>

            <Text style={styles.inputLabel}>SLOPE BEHAVIOR / CONDITION</Text>
            <TextInput
              style={styles.input}
              value={slopeCondition}
              onChangeText={setSlopeCondition}
            />

            <Text style={styles.inputLabel}>TENSION CRACK DEPTH (CM)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cracksDepth}
              onChangeText={setCracksDepth}
            />

            <Text style={styles.inputLabel}>ROCKFALL INTENSITY</Text>
            <View style={styles.selectorRow}>
              {(['None', 'Minor', 'Active', 'Severe'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, rockfallActivity === r && styles.chipActive]}
                  onPress={() => setRockfallActivity(r)}
                >
                  <Text style={[styles.chipText, rockfallActivity === r && styles.chipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>GROUNDWATER / SEEPAGE</Text>
            <View style={styles.selectorRow}>
              {(['Dry', 'Damp', 'Trickle', 'Heavy Seepage'] as const).map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[styles.chip, waterSeepage === w && styles.chipActive]}
                  onPress={() => setWaterSeepage(w)}
                >
                  <Text style={[styles.chipText, waterSeepage === w && styles.chipTextActive]}>
                    {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>SOIL SATURATION STATE</Text>
            <View style={styles.selectorRow}>
              {(['Dry', 'Moist', 'Saturated', 'Fluidized'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, soilCondition === s && styles.chipActive]}
                  onPress={() => setSoilCondition(s)}
                >
                  <Text style={[styles.chipText, soilCondition === s && styles.chipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>GEOLOGICAL FIELD NOTES</Text>
            <TextInput
              style={[styles.input, styles.notesArea]}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.submitSurveyBtn} onPress={handleSubmitObservation}>
              <Text style={styles.submitSurveyText}>
                {isOnline ? 'SUBMIT OFFICIAL OBSERVATION' : 'SAVE OFFLINE SURVEY (SQLITE)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'space-between',
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 11,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingVertical: 12,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textPrimary,
    fontSize: 13,
  },
  notesArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitSurveyBtn: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitSurveyText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
