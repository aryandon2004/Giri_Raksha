import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert as NativeAlert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { HazardType, ReportSeverity } from '../types';
import { ReportService } from '../services/reports/ReportService';
import { NetworkStatusBadge } from '../components/NetworkStatusBadge';

interface ReportHazardScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

const HAZARD_TYPES: HazardType[] = [
  'Landslide',
  'Road Blockage',
  'Slope Crack',
  'Rockfall',
  'Flash Flood',
  'Soil Movement',
  'Infrastructure Damage',
  'Other',
];

const SEVERITIES: ReportSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const ReportHazardScreen: React.FC<ReportHazardScreenProps> = ({ onBack, onSuccess }) => {
  const { user, isOnline, refreshAllData } = useApp();

  const [selectedHazard, setSelectedHazard] = useState<HazardType>('Slope Crack');
  const [selectedSeverity, setSelectedSeverity] = useState<ReportSeverity>('HIGH');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('25.5788');
  const [longitude, setLongitude] = useState('91.8933');
  const [accuracy, setAccuracy] = useState('3.2');
  const [locationName, setLocationName] = useState('Upper Shillong Ridge Trail');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600&auto=format&fit=crop'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleFetchGps = () => {
    setIsGettingGps(true);
    setTimeout(() => {
      setLatitude('25.5802');
      setLongitude('91.8945');
      setAccuracy('2.8');
      setLocationName('Shillong Sector 4 Escarpment');
      setIsGettingGps(false);
    }, 600);
  };

  const handleCapturePhoto = () => {
    // Allows toggling realistic test field photo evidence
    const samples = [
      'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600&auto=format&fit=crop', // Ground crack
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop', // Road blockage
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop', // Mountain slope
    ];
    const nextPhoto = samples[(samples.indexOf(photoUri || '') + 1) % samples.length];
    setPhotoUri(nextPhoto);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      NativeAlert.alert('Required', 'Please enter a description of the observed hazard.');
      return;
    }

    setSubmitting(true);

    try {
      const report = await ReportService.submitReport({
        userId: user?.id || 'usr-anon',
        userName: user?.name || 'Citizen Reporter',
        userRole: user?.role || 'citizen',
        hazardType: selectedHazard,
        description,
        severity: selectedSeverity,
        latitude: parseFloat(latitude) || 25.5788,
        longitude: parseFloat(longitude) || 91.8933,
        accuracy: parseFloat(accuracy) || 3.0,
        locationName,
        state: user?.state || 'Meghalaya',
        district: user?.district || 'East Khasi Hills (Shillong)',
        photoUri: photoUri || undefined,
      });

      await refreshAllData();
      setSubmitting(false);

      if (isOnline) {
        NativeAlert.alert(
          '✓ Report Transmitted',
          `Hazard report ${report.id.substring(0, 7)} uploaded and forwarded to DEOC.`,
          [{ text: 'OK', onPress: onSuccess }]
        );
      } else {
        NativeAlert.alert(
          '📶 Offline Mode Active',
          `No network connection. Report saved locally in SQLite pending queue. It will automatically synchronize once connectivity returns.`,
          [{ text: 'OK', onPress: onSuccess }]
        );
      }
    } catch (e) {
      setSubmitting(false);
      NativeAlert.alert('Error', 'Could not save report locally.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>REPORT HAZARD</Text>
        <NetworkStatusBadge />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Offline notice if offline */}
        {!isOnline && (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineBoxTitle}>⚠️ OFFLINE REPORTING MODE</Text>
            <Text style={styles.offlineBoxSub}>
              This report will be securely stored in SQLite on your device and automatically synced when signal returns.
            </Text>
          </View>
        )}

        {/* 1. Hazard Type Selector */}
        <Text style={styles.sectionLabel}>1. SELECT HAZARD PHENOMENON</Text>
        <View style={styles.hazardGrid}>
          {HAZARD_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.hazardChip,
                selectedHazard === type && styles.hazardChipActive,
              ]}
              onPress={() => setSelectedHazard(type)}
            >
              <Text
                style={[
                  styles.hazardChipText,
                  selectedHazard === type && styles.hazardChipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Severity Selector */}
        <Text style={styles.sectionLabel}>2. FIELD SEVERITY ASSESSMENT</Text>
        <View style={styles.severityRow}>
          {SEVERITIES.map((sev) => {
            const isSel = selectedSeverity === sev;
            const col =
              sev === 'CRITICAL'
                ? colors.danger
                : sev === 'HIGH'
                  ? colors.riskHigh
                  : sev === 'MEDIUM'
                    ? colors.warning
                    : colors.success;

            return (
              <TouchableOpacity
                key={sev}
                style={[
                  styles.severityBtn,
                  isSel && { backgroundColor: `${col}25`, borderColor: col },
                ]}
                onPress={() => setSelectedSeverity(sev)}
              >
                <Text style={[styles.severityBtnText, isSel && { color: col, fontWeight: '700' }]}>
                  {sev}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Description */}
        <Text style={styles.sectionLabel}>3. OBSERVATION DETAILS</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe ground cracks, rock movements, bubbling water, road blockage..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* 4. GPS Geolocation Card */}
        <Text style={styles.sectionLabel}>4. GEO-TAGGED LOCATION</Text>
        <View style={styles.gpsCard}>
          <View style={styles.gpsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsCoord}>
                {latitude}° N, {longitude}° E
              </Text>
              <Text style={styles.gpsLocName}>{locationName}</Text>
              <Text style={styles.gpsAccuracy}>GPS Accuracy: ±{accuracy} meters</Text>
            </View>
            <TouchableOpacity
              style={styles.gpsBtn}
              onPress={handleFetchGps}
              disabled={isGettingGps}
            >
              {isGettingGps ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.gpsBtnText}>REFRESH GPS</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Photographic Evidence */}
        <Text style={styles.sectionLabel}>5. PHOTO / VIDEO EVIDENCE</Text>
        <View style={styles.mediaCard}>
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity style={styles.changePhotoBtn} onPress={handleCapturePhoto}>
                <Text style={styles.changePhotoText}>📷 UPLOAD / CAPTURE PHOTO</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadPlaceholder} onPress={handleCapturePhoto}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>TAP TO CAPTURE PHOTO / VIDEO</Text>
              <Text style={styles.uploadSub}>Compressed automatically before upload</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isOnline ? 'TRANSMIT HAZARD REPORT' : 'SAVE OFFLINE REPORT (LOCAL DB)'}
            </Text>
          )}
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
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  offlineBox: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: colors.offline,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  offlineBoxTitle: {
    ...typography.captionBold,
    color: colors.offline,
    marginBottom: 4,
  },
  offlineBoxSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 8,
  },
  hazardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  hazardChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  hazardChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  hazardChipText: {
    ...typography.captionBold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  hazardChipTextActive: {
    color: '#FFFFFF',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  severityBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  severityBtnText: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  gpsCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 10,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gpsCoord: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 14,
  },
  gpsLocName: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  gpsAccuracy: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  gpsBtn: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gpsBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    fontSize: 10,
  },
  mediaCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  changePhotoBtn: {
    marginTop: 8,
    paddingVertical: 6,
  },
  changePhotoText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
  },
  uploadPlaceholder: {
    paddingVertical: 24,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 8,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  uploadText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 12,
  },
  uploadSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
