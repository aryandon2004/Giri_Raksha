import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RiskZone, Road, HazardReport, HistoricalLandslide } from '../types';
import { mockRiskZones, mockRoads, mockHazardReports, mockHistoricalLandslides } from '../mock/mockData';
import { useApp } from '../context/AppContext';

interface RiskMapProps {
  onZoneSelect?: (zone: RiskZone) => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({ onZoneSelect }) => {
  const { currentRisk } = useApp();
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(mockRiskZones[0]);
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [showLayersModal, setShowLayersModal] = useState(false);

  // Layer Toggles
  const [layers, setLayers] = useState({
    riskZones: true,
    roads: true,
    reports: true,
    historical: true,
    sensors: true,
    shelters: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getRiskColor = (level: string) => {
    if (level === 'HIGH') return colors.riskHigh;
    if (level === 'MODERATE') return colors.riskModerate;
    return colors.riskLow;
  };

  // Filtered zones
  const displayedZones = mockRiskZones.map((z) => {
    // If this is Shillong, reflect reactive currentRisk
    if (z.district.includes('Shillong')) {
      return {
        ...z,
        riskScore: currentRisk.score,
        riskLevel: currentRisk.riskLevel,
        rainfall24hMm: currentRisk.factors.find((f) => f.name.includes('Rainfall'))?.rawValue
          ? parseInt(String(currentRisk.factors.find((f) => f.name.includes('Rainfall'))?.rawValue), 10) || z.rainfall24hMm
          : z.rainfall24hMm,
      };
    }
    return z;
  }).filter((z) => filterLevel === 'ALL' || z.riskLevel === filterLevel);

  return (
    <View style={styles.container}>
      {/* Top Filter & Layer Bar */}
      <View style={styles.controlBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, filterLevel === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilterLevel('ALL')}
          >
            <Text style={[styles.filterChipText, filterLevel === 'ALL' && styles.filterChipTextActive]}>
              ALL ZONES ({mockRiskZones.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterLevel === 'HIGH' && styles.filterChipActiveHigh]}
            onPress={() => setFilterLevel('HIGH')}
          >
            <Text style={[styles.filterChipText, filterLevel === 'HIGH' && styles.filterChipTextActive]}>
              🔴 HIGH RISK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterLevel === 'MODERATE' && styles.filterChipActiveMod]}
            onPress={() => setFilterLevel('MODERATE')}
          >
            <Text style={[styles.filterChipText, filterLevel === 'MODERATE' && styles.filterChipTextActive]}>
              🟠 MODERATE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterLevel === 'LOW' && styles.filterChipActiveLow]}
            onPress={() => setFilterLevel('LOW')}
          >
            <Text style={[styles.filterChipText, filterLevel === 'LOW' && styles.filterChipTextActive]}>
              🟢 LOW
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.layersBtn}
          onPress={() => setShowLayersModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.layersBtnText}>☰ LAYERS</Text>
        </TouchableOpacity>
      </View>

      {/* GIS Interactive Topographic Canvas */}
      <View style={styles.gisCanvas}>
        {/* Topographic Background Simulation */}
        <View style={styles.topoGrid}>
          <View style={styles.contourCircle1} />
          <View style={styles.contourCircle2} />
          <View style={styles.contourCircle3} />
          <Text style={styles.nerWatermark}>NORTH EASTERN REGION GIS</Text>
        </View>

        {/* Render Risk Zone Nodes */}
        {layers.riskZones && (
          <View style={styles.zoneNodesContainer}>
            {displayedZones.map((zone) => {
              const zoneColor = getRiskColor(zone.riskLevel);
              const isSelected = selectedZone?.id === zone.id;

              return (
                <TouchableOpacity
                  key={zone.id}
                  style={[
                    styles.zoneNode,
                    {
                      borderColor: zoneColor,
                      backgroundColor: isSelected ? `${zoneColor}40` : `${zoneColor}20`,
                      transform: [{ scale: isSelected ? 1.08 : 1 }],
                    },
                  ]}
                  onPress={() => {
                    setSelectedZone(zone);
                    if (onZoneSelect) onZoneSelect(zone);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.zonePill, { backgroundColor: zoneColor }]}>
                    <Text style={styles.zoneScoreText}>{zone.riskScore}</Text>
                  </View>
                  <Text style={styles.zoneNameText} numberOfLines={1}>
                    {zone.district.split('(')[0]}
                  </Text>
                  <Text style={[styles.zoneLevelLabel, { color: zoneColor }]}>
                    {zone.riskLevel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Legend Overlay */}
        <View style={styles.legendBox}>
          <Text style={styles.legendTitle}>GIS RISK LEGEND</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.riskHigh }]} />
            <Text style={styles.legendLabel}>High (71-100)</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.riskModerate }]} />
            <Text style={styles.legendLabel}>Moderate (31-70)</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.riskLow }]} />
            <Text style={styles.legendLabel}>Low (0-30)</Text>
          </View>
        </View>
      </View>

      {/* Selected Zone Bottom Sheet Inspector */}
      {selectedZone && (
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetLocation}>{selectedZone.name}</Text>
              <Text style={styles.sheetDistrict}>
                📍 {selectedZone.district}, {selectedZone.state}
              </Text>
            </View>
            <View
              style={[
                styles.sheetRiskBadge,
                { backgroundColor: getRiskColor(selectedZone.riskLevel) },
              ]}
            >
              <Text style={styles.sheetScore}>{selectedZone.riskScore}</Text>
              <Text style={styles.sheetLevel}>{selectedZone.riskLevel}</Text>
            </View>
          </View>

          {/* Environmental Attributes Grid */}
          <View style={styles.attrGrid}>
            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>24h Rainfall</Text>
              <Text style={styles.attrValue}>{selectedZone.rainfall24hMm} mm</Text>
            </View>
            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Soil Moisture</Text>
              <Text style={styles.attrValue}>{selectedZone.soilMoisturePct}%</Text>
            </View>
            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Slope Angle</Text>
              <Text style={styles.attrValue}>{selectedZone.slopeDegrees}°</Text>
            </View>
            <View style={styles.attrBox}>
              <Text style={styles.attrLabel}>Past Incidents</Text>
              <Text style={styles.attrValue}>{selectedZone.historicalIncidentsCount}</Text>
            </View>
          </View>

          <View style={styles.sheetFooter}>
            <Text style={styles.vulnerablePop}>
              👥 Vulnerable Population: ~{selectedZone.vulnerablePopulation.toLocaleString()}
            </Text>
            <Text style={styles.lastUpdateText}>Updated: {selectedZone.lastUpdated.substring(11, 16)}</Text>
          </View>
        </View>
      )}

      {/* Layer Toggle Modal */}
      <Modal visible={showLayersModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>GIS MAP LAYERS</Text>
            <Text style={styles.modalSub}>Toggle thematic vector overlays:</Text>

            {Object.entries(layers).map(([key, enabled]) => (
              <TouchableOpacity
                key={key}
                style={styles.layerItem}
                onPress={() => toggleLayer(key as keyof typeof layers)}
              >
                <Text style={styles.layerName}>
                  {key === 'riskZones'
                    ? '🎯 Landslide Risk Zones'
                    : key === 'roads'
                    ? '🛣️ Highway Status & Blockages'
                    : key === 'reports'
                    ? '📷 Citizen & Field Hazard Reports'
                    : key === 'historical'
                    ? '📜 GSI Historical Incidents'
                    : key === 'sensors'
                    ? '📡 Soil Moisture Sensor Telemetry'
                    : '🏥 Designated Relief Shelters'}
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    { backgroundColor: enabled ? colors.primary : colors.surfaceLight },
                  ]}
                >
                  {enabled && <Text style={styles.checkText}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowLayersModal(false)}
            >
              <Text style={styles.closeModalBtnText}>CLOSE</Text>
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
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  filterChipActiveHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: colors.riskHigh,
  },
  filterChipActiveMod: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: colors.riskModerate,
  },
  filterChipActiveLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: colors.riskLow,
  },
  filterChipText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  layersBtn: {
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  layersBtnText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.primary,
  },
  gisCanvas: {
    flex: 1,
    backgroundColor: '#091026',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 280,
  },
  topoGrid: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
  contourCircle1: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1.5,
    borderColor: colors.primary,
    position: 'absolute',
  },
  contourCircle2: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: colors.primary,
    position: 'absolute',
  },
  contourCircle3: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: colors.primary,
    position: 'absolute',
  },
  nerWatermark: {
    ...typography.captionBold,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 180,
  },
  zoneNodesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 12,
    gap: 10,
  },
  zoneNode: {
    width: '46%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    marginBottom: 6,
  },
  zonePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  zoneScoreText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 12,
  },
  zoneNameText: {
    ...typography.headline,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  zoneLevelLabel: {
    ...typography.captionBold,
    fontSize: 9,
    marginTop: 2,
  },
  legendBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  legendTitle: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.primary,
    marginBottom: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetLocation: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 15,
  },
  sheetDistrict: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sheetRiskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  sheetScore: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 18,
  },
  sheetLevel: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 9,
  },
  attrGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  attrBox: {
    alignItems: 'center',
    flex: 1,
  },
  attrLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  attrValue: {
    ...typography.headline,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vulnerablePop: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  lastUpdateText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    ...typography.headline,
    color: colors.primary,
    marginBottom: 2,
  },
  modalSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  layerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  layerName: {
    ...typography.callout,
    color: colors.textPrimary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  closeModalBtn: {
    marginTop: 18,
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
