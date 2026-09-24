import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert as NativeAlert,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { NER_STATES } from '../constants/nerRegions';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { setUser, switchDemoRole } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [selectedState, setSelectedState] = useState('Meghalaya');
  const [selectedDistrict, setSelectedDistrict] = useState('East Khasi Hills (Shillong)');

  const handleQuickDemoLogin = (role: UserRole) => {
    switchDemoRole(role);
    onSuccess();
  };

  const handleSubmit = () => {
    if (isRegister) {
      if (!name || !email || !mobile) {
        NativeAlert.alert('Validation Error', 'Please complete all required fields.');
        return;
      }
      setUser({
        id: `usr-${Date.now()}`,
        name,
        mobile,
        email,
        role: selectedRole,
        state: selectedState,
        district: selectedDistrict,
      });
    } else {
      if (!email || !password) {
        NativeAlert.alert('Validation Error', 'Please enter email and password.');
        return;
      }
      setUser({
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        mobile: '+91 98620 00000',
        email,
        role: selectedRole,
        state: selectedState,
        district: selectedDistrict,
      });
    }
    onSuccess();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <Text style={styles.brandEmoji}>⛰️</Text>
        <Text style={styles.brandTitle}>GIRI RAKSHA</Text>
        <Text style={styles.brandSub}>Government of India • NER Disaster Platform</Text>
      </View>

      {/* Quick 1-Tap Demo Evaluator Logins */}
      <View style={styles.demoCard}>
        <Text style={styles.demoHeading}>⚡ QUICK EVALUATOR DEMO LOGIN (1-TAP)</Text>
        <Text style={styles.demoSub}>Instantly load test credentials for each role:</Text>

        <View style={styles.demoButtonGrid}>
          <TouchableOpacity
            style={[styles.demoBtn, styles.citizenDemoBtn]}
            onPress={() => handleQuickDemoLogin('citizen')}
          >
            <Text style={styles.demoBtnRole}>👤 CITIZEN</Text>
            <Text style={styles.demoBtnUser}>Priya Sharma (Shillong)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, styles.officerDemoBtn]}
            onPress={() => handleQuickDemoLogin('field_officer')}
          >
            <Text style={styles.demoBtnRole}>👮 FIELD OFFICER</Text>
            <Text style={styles.demoBtnUser}>Officer T. Ao (Kohima)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, styles.adminDemoBtn]}
            onPress={() => handleQuickDemoLogin('admin')}
          >
            <Text style={styles.demoBtnRole}>🏛️ DISASTER AUTHORITY</Text>
            <Text style={styles.demoBtnUser}>Dr. H. Roy (NER Director)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Authentication Form */}
      <View style={styles.formCard}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, !isRegister && styles.activeTab]}
            onPress={() => setIsRegister(false)}
          >
            <Text style={[styles.tabText, !isRegister && styles.activeTabText]}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isRegister && styles.activeTab]}
            onPress={() => setIsRegister(true)}
          >
            <Text style={[styles.tabText, isRegister && styles.activeTabText]}>REGISTER</Text>
          </TouchableOpacity>
        </View>

        {isRegister && (
          <>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Biman Borah"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </>
        )}

        <Text style={styles.inputLabel}>OFFICIAL / PERSONAL EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="officer@disaster.gov.in"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.inputLabel}>SELECT OPERATIONAL ROLE</Text>
        <View style={styles.roleSelector}>
          {(['citizen', 'field_officer', 'admin'] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleOption, selectedRole === r && styles.roleOptionActive]}
              onPress={() => setSelectedRole(r)}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === r && styles.roleOptionTextActive,
                ]}
              >
                {r === 'citizen' ? 'Citizen' : r === 'field_officer' ? 'Field Officer' : 'Authority'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>
            {isRegister ? 'CREATE SECURE ACCOUNT' : 'SECURE SIGN IN'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 36,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  brandTitle: {
    ...typography.hero,
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  brandSub: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  demoCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  demoHeading: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  demoSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  demoButtonGrid: {
    gap: 8,
  },
  demoBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  citizenDemoBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.riskLow,
  },
  officerDemoBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: colors.riskModerate,
  },
  adminDemoBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderColor: colors.primary,
  },
  demoBtnRole: {
    ...typography.captionBold,
    color: colors.textPrimary,
    fontSize: 11,
  },
  demoBtnUser: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
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
  inputLabel: {
    ...typography.captionBold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  roleOptionActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  roleOptionText: {
    ...typography.captionBold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    ...typography.headline,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
