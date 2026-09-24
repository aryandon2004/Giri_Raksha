import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { NetworkStatusBadge } from '../components/NetworkStatusBadge';
import { OfflineBanner } from '../components/OfflineBanner';
import { RiskCard } from '../components/RiskCard';
import { WeatherCard } from '../components/WeatherCard';
import { AlertCard } from '../components/AlertCard';
import { RoadStatusCard } from '../components/RoadStatusCard';
import { ReportCard } from '../components/ReportCard';
import { DemoSimulationPanel } from '../components/DemoSimulationPanel';
import { t } from '../localization/i18n';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const {
    user,
    role,
    currentRisk,
    weather,
    alerts,
    roads,
    reports,
    isOnline,
    refreshAllData,
  } = useApp();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'DISASTER AUTHORITY COMMAND';
    if (role === 'field_officer') return 'FIELD OFFICER PORTAL';
    return 'CITIZEN SURVEILLANCE';
  };

  return (
    <View style={styles.container}>
      {/* Top App Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>{t('appName')}</Text>
          <Text style={styles.locationText}>
            📍 {currentRisk.location.area}, {currentRisk.location.state}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <NetworkStatusBadge />
        </View>
      </View>

      {/* Role Ribbon */}
      <View style={styles.roleRibbon}>
        <Text style={styles.roleRibbonText}>
          {getRoleTitle()} • {user?.name || 'Authorized Personnel'}
        </Text>
      </View>

      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* SIH 60-Second Demo Bar */}
      <DemoSimulationPanel />

      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Main Risk Prediction Card with XAI breakdown */}
        <RiskCard prediction={currentRisk} isOffline={!isOnline} />

        {/* Quick Actions Center */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionHeader}>{t('quickActions')}</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionButton, styles.reportBtn]}
              onPress={() => onNavigate('ReportHazard')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🚨</Text>
              <Text style={styles.actionText}>{t('reportHazard')}</Text>
              <Text style={styles.actionSub}>GPS + Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.mapBtn]}
              onPress={() => onNavigate('RiskMap')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionText}>{t('viewRiskMap')}</Text>
              <Text style={styles.actionSub}>GIS & Layers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.alertsBtn]}
              onPress={() => onNavigate('Alerts')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>⚠️</Text>
              <Text style={styles.actionText}>{t('alerts')}</Text>
              <Text style={styles.actionSub}>{alerts.length} Active</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.emergencyBtn]}
              onPress={() => onNavigate('Emergency')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🆘</Text>
              <Text style={styles.actionText}>{t('emergency')}</Text>
              <Text style={styles.actionSub}>112 / 108 SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather & Soil Moisture Card */}
        <WeatherCard weather={weather} />

        {/* Early Warnings & Alerts */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeader}>{t('alerts')}</Text>
            <TouchableOpacity onPress={() => onNavigate('Alerts')}>
              <Text style={styles.viewAllText}>View All ({alerts.length})</Text>
            </TouchableOpacity>
          </View>
          {alerts.slice(0, 2).map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onActionPress={() => onNavigate('Emergency')}
            />
          ))}
        </View>

        {/* NER Road Lifelines */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeader}>{t('roadStatus')}</Text>
            <TouchableOpacity onPress={() => onNavigate('Roads')}>
              <Text style={styles.viewAllText}>View All ({roads.length})</Text>
            </TouchableOpacity>
          </View>
          {roads.slice(0, 2).map((road) => (
            <RoadStatusCard key={road.id} road={road} />
          ))}
        </View>

        {/* Community & Field Hazard Reports */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeader}>{t('recentReports')}</Text>
            <TouchableOpacity onPress={() => onNavigate('Reports')}>
              <Text style={styles.viewAllText}>View All ({reports.length})</Text>
            </TouchableOpacity>
          </View>
          {reports.slice(0, 2).map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
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
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  brandTitle: {
    ...typography.hero,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  locationText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  roleRibbon: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  roleRibbonText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionHeader: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportBtn: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  mapBtn: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  alertsBtn: {
    borderColor: colors.warning,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  emergencyBtn: {
    borderColor: colors.riskCritical,
    backgroundColor: 'rgba(185, 28, 28, 0.12)',
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  actionText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  actionSub: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionBlock: {
    marginTop: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  viewAllText: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
  },
});
