import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert as NativeAlert,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { PriorityCard } from '../components/PriorityCard';
import { NetworkStatusBadge } from '../components/NetworkStatusBadge';
import { ResponseTeamService } from '../services/emergency/ResponseTeamService';
import { mockRiskZones } from '../mock/mockData';

interface AdminDashboardScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onBack, onNavigate }) => {
  const { currentRisk, alerts, roads, reports, sensors } = useApp();

  const [assignments, setAssignments] = useState(ResponseTeamService.getAssignments());
  const teams = ResponseTeamService.getTeams();
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);

  const highRiskCount = mockRiskZones.filter((z) => z.riskLevel === 'HIGH').length + (currentRisk.riskLevel === 'HIGH' ? 1 : 0);
  const blockedRoadsCount = roads.filter((r) => r.status === 'BLOCKED' || r.status === 'PARTIALLY BLOCKED').length;
  const onlineSensorsCount = sensors.filter((s) => s.status === 'ONLINE').length;

  const handleOpenDispatch = (incident: any) => {
    setSelectedIncident(incident);
    setDispatchModalVisible(true);
  };

  const handleAssignTeam = (teamId: string) => {
    if (!selectedIncident) return;
    const newAssign = ResponseTeamService.assignTeam({
      incidentId: selectedIncident.id,
      incidentTitle: selectedIncident.title,
      teamId,
      priorityScore: selectedIncident.score,
      priorityLevel: selectedIncident.level,
      location: selectedIncident.location,
    });
    setAssignments([...ResponseTeamService.getAssignments()]);
    setDispatchModalVisible(false);
    NativeAlert.alert('Unit Dispatched', `${newAssign.teamName} dispatched to ${selectedIncident.location}`);
  };

  const handleUpdateStatus = (assignId: string) => {
    ResponseTeamService.updateAssignmentStatus(assignId, 'EN ROUTE', 'Unit mobile on corridor');
    setAssignments([...ResponseTeamService.getAssignments()]);
    NativeAlert.alert('Status Updated', 'Unit status set to EN ROUTE');
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← HOME</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DISASTER AUTHORITY COMMAND</Text>
        <NetworkStatusBadge />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Command Summary Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: colors.danger }]}>
            <Text style={styles.statNumber}>{highRiskCount}</Text>
            <Text style={styles.statLabel}>HIGH RISK ZONES</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.warning }]}>
            <Text style={styles.statNumber}>{alerts.length}</Text>
            <Text style={styles.statLabel}>ACTIVE ALERTS</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.roadBlocked }]}>
            <Text style={styles.statNumber}>{blockedRoadsCount}</Text>
            <Text style={styles.statLabel}>BLOCKED ROADS</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.primary }]}>
            <Text style={styles.statNumber}>{onlineSensorsCount}</Text>
            <Text style={styles.statLabel}>ONLINE SENSORS</Text>
          </View>
        </View>

        {/* AI Emergency Incident Prioritization Queue */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>AI-ASSISTED INCIDENT PRIORITIZATION QUEUE</Text>
          <Text style={styles.algoPill}>NER-PRIORITY-ML</Text>
        </View>
        <Text style={styles.sectionSub}>
          Ranked dynamically considering geotechnical risk, road importance, and population impact:
        </Text>

        {/* Incident #1 */}
        <PriorityCard
          rank={1}
          incidentTitle="NH-6 Lifeline Mud & Boulder Cascade (Mile 38)"
          location="Ri-Bhoi / East Khasi Hills Corridor"
          priorityScore={96}
          priorityLevel="CRITICAL"
          factorsText="Lifeline National Highway blocked + 220mm extreme precipitation trigger + 18,000 daily commuters affected."
          teamAssigned={assignments.find((a) => a.incidentTitle.includes('NH-6'))?.teamName}
          status={assignments.find((a) => a.incidentTitle.includes('NH-6'))?.status || 'PENDING DISPATCH'}
          onAssignPress={() =>
            handleOpenDispatch({
              id: 'inc-01',
              title: 'NH-6 Mud & Boulder Cascade (Mile 38)',
              score: 96,
              level: 'CRITICAL',
              location: 'NH-6 Corridor, Mile 38',
            })
          }
          onRespondPress={() => {
            const assign = assignments.find((a) => a.incidentTitle.includes('NH-6'));
            if (assign) handleUpdateStatus(assign.id);
          }}
        />

        {/* Incident #2 */}
        <PriorityCard
          rank={2}
          incidentTitle="Durtlang Ridge Tension Cracks (12cm Rupture)"
          location="Durtlang North Escarpment, Aizawl, Mizoram"
          priorityScore={91}
          priorityLevel="CRITICAL"
          factorsText="12cm widening crack directly upslope of 40 residential homes + continuous 195mm rainfall."
          teamAssigned="SDRF Mizoram Search & Rescue"
          status="ON SITE"
          onAssignPress={() =>
            handleOpenDispatch({
              id: 'inc-02',
              title: 'Durtlang Ridge Tension Cracks',
              score: 91,
              level: 'CRITICAL',
              location: 'Durtlang Ridge, Aizawl',
            })
          }
        />

        {/* Incident #3 */}
        <PriorityCard
          rank={3}
          incidentTitle="Shillong Sector 4 Slope Rupture (15m Crack)"
          location="Upper Shillong Ridge Trail, Meghalaya"
          priorityScore={87}
          priorityLevel="HIGH"
          factorsText="Ground rupture + active groundwater bubbling + 38° slope inclination."
          teamAssigned="SDRF 1st Quick Response Battalion"
          status="ASSIGNED"
          onAssignPress={() =>
            handleOpenDispatch({
              id: 'inc-03',
              title: 'Shillong Sector 4 Slope Rupture',
              score: 87,
              level: 'HIGH',
              location: 'Shillong Sector 4',
            })
          }
        />

        {/* Quick Navigation to Subsystems */}
        <View style={styles.subsystemsRow}>
          <TouchableOpacity
            style={styles.subsystemBtn}
            onPress={() => onNavigate('Sensors')}
          >
            <Text style={styles.subsystemIcon}>📡</Text>
            <Text style={styles.subsystemText}>SENSOR MONITOR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subsystemBtn}
            onPress={() => onNavigate('Analytics')}
          >
            <Text style={styles.subsystemIcon}>📊</Text>
            <Text style={styles.subsystemText}>RISK ANALYTICS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subsystemBtn}
            onPress={() => onNavigate('RegionalView')}
          >
            <Text style={styles.subsystemIcon}>🗺️</Text>
            <Text style={styles.subsystemText}>8-STATE MATRIX</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Team Dispatch Modal */}
      <Modal visible={dispatchModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DISPATCH EMERGENCY TEAM</Text>
            <Text style={styles.modalSub}>{selectedIncident?.title}</Text>

            <Text style={styles.teamSelectLabel}>SELECT FIRST-RESPONSE UNIT:</Text>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                style={styles.teamOption}
                onPress={() => handleAssignTeam(team.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamDetails}>
                    {team.agency} • {team.personnelCount} Personnel • Base: {team.baseLocation}
                  </Text>
                </View>
                <Text style={styles.dispatchPill}>DISPATCH</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setDispatchModalVisible(false)}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 12,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingVertical: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    ...typography.metricLarge,
    fontSize: 28,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  algoPill: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.accent,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sectionSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 2,
  },
  subsystemsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 30,
  },
  subsystemBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  subsystemIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  subsystemText: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  modalTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  modalSub: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 14,
  },
  teamSelectLabel: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 8,
  },
  teamOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 8,
  },
  teamName: {
    ...typography.callout,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  teamDetails: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dispatchPill: {
    ...typography.captionBold,
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
});
