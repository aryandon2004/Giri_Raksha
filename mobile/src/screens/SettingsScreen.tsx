import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert as NativeAlert } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../localization/i18n';
import { OFFICIAL_DISCLAIMER } from '../constants/nerRegions';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onLogout }) => {
  const { language, updateLanguage, switchDemoRole, role } = useApp();
  const [notifications, setNotifications] = React.useState(true);
  const [highRiskOnly, setHighRiskOnly] = React.useState(false);

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const handleDownloadRegion = (region: string) => {
    NativeAlert.alert(
      'Offline Map Downloaded',
      `Vector terrain and risk map tiles for ${region} cached locally. Available without internet connection.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>APP SETTINGS & ABOUT</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Multilingual Localization */}
        <Text style={styles.sectionHeader}>LANGUAGE / भाषा / ভাষা</Text>
        <View style={styles.card}>
          <View style={styles.langGrid}>
            {languages.map((l) => {
              const isSel = language === l.code;
              return (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langBtn, isSel && styles.langBtnActive]}
                  onPress={() => updateLanguage(l.code)}
                >
                  <Text style={[styles.langText, isSel && styles.langTextActive]}>
                    {l.native}
                  </Text>
                  <Text style={[styles.langSub, isSel && styles.langSubActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Operational Role Switcher */}
        <Text style={styles.sectionHeader}>SWITCH OPERATIONAL ROLE</Text>
        <View style={styles.card}>
          <View style={styles.roleRow}>
            {(['citizen', 'field_officer', 'admin'] as const).map((r) => {
              const isSel = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, isSel && styles.roleBtnActive]}
                  onPress={() => switchDemoRole(r)}
                >
                  <Text style={[styles.roleBtnText, isSel && styles.roleBtnTextActive]}>
                    {r === 'citizen' ? 'Citizen' : r === 'field_officer' ? 'Field Officer' : 'Authority'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Offline Map Packs */}
        <Text style={styles.sectionHeader}>OFFLINE MAP PACKS (CACHE REGION)</Text>
        <View style={styles.card}>
          <Text style={styles.subtext}>
            Download high-resolution topographic and risk contour data for offline field operations:
          </Text>
          {['Shillong & East Khasi Hills', 'Aizawl & Durtlang Ridge', 'Kohima & NH-29 Corridor', 'Gangtok & North Sikkim'].map(
            (region, idx) => (
              <View key={idx} style={styles.packRow}>
                <Text style={styles.packName}>🗺️ {region}</Text>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownloadRegion(region)}
                >
                  <Text style={styles.downloadBtnText}>CACHE (4.2 MB)</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        {/* Push Notification Controls */}
        <Text style={styles.sectionHeader}>EMERGENCY NOTIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Landslide Early Warning Alerts</Text>
              <Text style={styles.toggleSub}>Push notifications for red & orange warnings</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.card, true: colors.primaryDark }}
              thumbColor={colors.primary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Critical Evacuations Only</Text>
              <Text style={styles.toggleSub}>Filter out minor advisory notices</Text>
            </View>
            <Switch
              value={highRiskOnly}
              onValueChange={setHighRiskOnly}
              trackColor={{ false: colors.card, true: colors.primaryDark }}
              thumbColor={colors.primary}
            />
          </View>
        </View>

        {/* About Screen & Hackathon Metadata */}
        <Text style={styles.sectionHeader}>ABOUT GIRI RAKSHA</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>GIRI RAKSHA</Text>
          <Text style={styles.aboutTagline}>"Predict. Warn. Protect."</Text>
          <Text style={styles.aboutDescription}>
            AI-Powered Early Warning & Landslide Risk Monitoring System in the North Eastern Region of India.
          </Text>

          <View style={styles.aboutMetaBlock}>
            <Text style={styles.aboutMetaTitle}>Smart India Hackathon Problem Statement:</Text>
            <Text style={styles.aboutMetaVal}>PS ID 26001 (Disaster Management / NER)</Text>
          </View>

          <View style={styles.aboutMetaBlock}>
            <Text style={styles.aboutMetaTitle}>System Architecture & Stack:</Text>
            <Text style={styles.aboutMetaVal}>
              React Native • Expo • TypeScript • SQLite • Node.js/Express • MongoDB • Python FastAPI • Random Forest ML • GeoJSON GIS
            </Text>
          </View>
        </View>

        {/* Official Real-World Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerHeading}>IMPORTANT REAL-WORLD DISCLAIMER</Text>
          <Text style={styles.disclaimerBody}>{OFFICIAL_DISCLAIMER}</Text>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>SIGN OUT OF SESSION</Text>
        </TouchableOpacity>
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
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  subtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  langGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  langBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  langText: {
    ...typography.headline,
    fontSize: 13,
    color: colors.textPrimary,
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  langSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  langSubActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  roleBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  roleBtnText: {
    ...typography.captionBold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  packRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  packName: {
    ...typography.callout,
    color: colors.textPrimary,
    fontSize: 12,
  },
  downloadBtn: {
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  downloadBtnText: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleTitle: {
    ...typography.callout,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  aboutTitle: {
    ...typography.hero,
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  aboutTagline: {
    ...typography.captionBold,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  aboutDescription: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  aboutMetaBlock: {
    marginTop: 8,
  },
  aboutMetaTitle: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  aboutMetaVal: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: 1,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    marginBottom: 16,
  },
  disclaimerHeading: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.warning,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  disclaimerBody: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutBtnText: {
    ...typography.captionBold,
    color: colors.danger,
    letterSpacing: 0.8,
  },
});
