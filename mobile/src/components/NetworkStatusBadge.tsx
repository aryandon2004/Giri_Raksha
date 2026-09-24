import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const NetworkStatusBadge: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulatedNetwork } = useApp();

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        {
          backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.18)' : 'rgba(249, 115, 22, 0.22)',
          borderColor: isOnline ? colors.online : colors.offline,
        },
      ]}
      onPress={toggleSimulatedNetwork}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: isOnline ? colors.online : colors.offline },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: isOnline ? colors.online : colors.offline },
        ]}
      >
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </Text>
      {isSimulatedOffline && (
        <Text style={styles.simulatedText}>(SIM)</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    ...typography.captionBold,
    fontSize: 11,
  },
  simulatedText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
});
