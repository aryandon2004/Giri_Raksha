import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { t } from '../localization/i18n';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, isSyncing, syncMessage, triggerManualSync } = useApp();

  // If online and no pending reports, show brief synced status if syncing, or null
  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: isOnline ? 'rgba(56, 189, 248, 0.15)' : 'rgba(249, 115, 22, 0.2)',
          borderColor: isOnline ? colors.primary : colors.offline,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.statusTitle,
              { color: isOnline ? colors.primary : colors.offline },
            ]}
          >
            {isOnline ? 'CLOUD SYNC' : t('offline')}
          </Text>
          {pendingCount > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{pendingCount} PENDING</Text>
            </View>
          )}
        </View>
        <Text style={styles.messageText}>
          {isSyncing ? syncMessage : !isOnline ? t('offlineModeNotice') : syncMessage}
        </Text>
      </View>

      {isOnline && (
        <TouchableOpacity
          style={[styles.syncBtn, isSyncing && styles.syncBtnDisabled]}
          onPress={triggerManualSync}
          disabled={isSyncing}
          activeOpacity={0.8}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.syncBtnText}>{t('syncNow')}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  leftContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  statusTitle: {
    ...typography.captionBold,
    letterSpacing: 0.5,
  },
  countPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textPrimary,
  },
  messageText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  syncBtn: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  syncBtnDisabled: {
    opacity: 0.6,
  },
  syncBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
  },
});
