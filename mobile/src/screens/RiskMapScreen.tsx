import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { RiskMap } from '../components/RiskMap';
import { NetworkStatusBadge } from '../components/NetworkStatusBadge';

interface RiskMapScreenProps {
  onBack: () => void;
}

export const RiskMapScreen: React.FC<RiskMapScreenProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← HOME</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIS RISK & TERRAIN SURVEILLANCE</Text>
        <NetworkStatusBadge />
      </View>

      <View style={styles.mapContainer}>
        <RiskMap />
      </View>
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
  mapContainer: {
    flex: 1,
  },
});
