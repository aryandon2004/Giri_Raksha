import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { t } from '../localization/i18n';

export const DemoSimulationPanel: React.FC = () => {
  const {
    currentRisk,
    weather,
    isOnline,
    pendingCount,
    runHeavyRainfallDemo,
    resetDemoState,
    toggleSimulatedNetwork,
    triggerManualSync,
    switchDemoRole,
    role,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const handleSimulateRainfall = async () => {
    setIsRunning(true);
    setStepMessage('1/4 Ingesting IMD 220mm rainfall & 82% soil moisture...');
    await new Promise((r) => setTimeout(r, 600));

    setStepMessage('2/4 Running Random Forest Geotechnical Model...');
    await new Promise((r) => setTimeout(r, 600));

    await runHeavyRainfallDemo();

    setStepMessage('3/4 Escalating Shillong GIS Zone: Orange ➔ Red (Risk 84)...');
    await new Promise((r) => setTimeout(r, 600));

    setStepMessage('4/4 Generated High Risk Alert & Blocked NH-6 Lane!');
    await new Promise((r) => setTimeout(r, 500));

    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(true);
    setStepMessage('Restoring baseline state (58 Moderate)...');
    await resetDemoState();
    await new Promise((r) => setTimeout(r, 400));
    setIsRunning(false);
    setStepMessage(null);
  };

  return (
    <>
      {/* Persistent Floating SIH Demo Launcher Button */}
      <TouchableOpacity
        style={styles.floatingTrigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingTriggerText}>⚡</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>CONTROLLER</Text>
                <Text style={styles.subTitle}>Real-Time Evaluation</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Current Real-Time Metrics Strip */}
            <View style={styles.metricsStrip}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Rainfall</Text>
                <Text style={styles.metricVal}>{weather?.rainfall24h || 120} mm</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Soil Sat.</Text>
                <Text style={styles.metricVal}>
                  {currentRisk.factors.find((f) => f.name.includes('Moisture'))?.rawValue || '60%'}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Risk Score</Text>
                <Text
                  style={[
                    styles.metricVal,
                    { color: currentRisk.riskLevel === 'HIGH' ? colors.riskHigh : colors.riskModerate },
                  ]}
                >
                  {currentRisk.score} ({currentRisk.riskLevel})
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Network</Text>
                <Text
                  style={[
                    styles.metricVal,
                    { color: isOnline ? colors.online : colors.offline },
                  ]}
                >
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </View>
            </View>

            {/* Step Progress Message */}
            {stepMessage && (
              <View style={styles.stepBox}>
                {isRunning && <ActivityIndicator size="small" color={colors.primary} />}
                <Text style={styles.stepText}>{stepMessage}</Text>
              </View>
            )}

            {/* Actions Section */}
            <View style={styles.actionSection}>
              <Text style={styles.sectionHeading}>1. SIMULATE MONSOON TRIGGER</Text>
              <TouchableOpacity
                style={[styles.bigBtn, styles.rainBtn, isRunning && styles.btnDisabled]}
                onPress={handleSimulateRainfall}
                disabled={isRunning}
                activeOpacity={0.85}
              >
                <Text style={styles.bigBtnText}>🌧️ {t('simulateRainfall')}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionHeading}>2. OFFLINE & AUTO-SYNC VERIFICATION</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: isOnline ? colors.offline : colors.online }]}
                  onPress={toggleSimulatedNetwork}
                >
                  <Text style={styles.smallBtnText}>
                    {isOnline ? 'CUT NETWORK (OFFLINE)' : 'RESTORE NETWORK (ONLINE)'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallBtn, styles.syncBtn]}
                  onPress={triggerManualSync}
                >
                  <Text style={styles.smallBtnText}>
                    SYNC QUEUE ({pendingCount})
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionHeading}>3. SWITCH EVALUATOR ROLE</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleChip, role === 'citizen' && styles.roleChipActive]}
                  onPress={() => switchDemoRole('citizen')}
                >
                  <Text style={[styles.roleChipText, role === 'citizen' && styles.roleChipTextActive]}>
                    CITIZEN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleChip, role === 'field_officer' && styles.roleChipActive]}
                  onPress={() => switchDemoRole('field_officer')}
                >
                  <Text style={[styles.roleChipText, role === 'field_officer' && styles.roleChipTextActive]}>
                    FIELD OFFICER
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleChip, role === 'admin' && styles.roleChipActive]}
                  onPress={() => switchDemoRole('admin')}
                >
                  <Text style={[styles.roleChipText, role === 'admin' && styles.roleChipTextActive]}>
                    AUTHORITY
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                disabled={isRunning}
              >
                <Text style={styles.resetBtnText}>↺ RESET TO BASELINE STATE (58 MODERATE)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingTrigger: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingTriggerText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 16,
  },
  subTitle: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 11,
  },
  closeText: {
    fontSize: 20,
    color: colors.textMuted,
    padding: 4,
  },
  metricsStrip: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  metricVal: {
    ...typography.headline,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 2,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  stepText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    flex: 1,
  },
  actionSection: {
    gap: 8,
  },
  sectionHeading: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  bigBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rainBtn: {
    backgroundColor: colors.riskHigh,
  },
  bigBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBtn: {
    backgroundColor: colors.primaryDark,
  },
  smallBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  roleChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  roleChipText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  resetBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  resetBtnText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
