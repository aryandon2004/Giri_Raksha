import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RiskMapScreen } from './src/screens/RiskMapScreen';
import { ReportHazardScreen } from './src/screens/ReportHazardScreen';
import { FieldOfficerScreen } from './src/screens/FieldOfficerScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { RegionalViewScreen } from './src/screens/RegionalViewScreen';
import { SensorsScreen } from './src/screens/SensorsScreen';
import { RoadsScreen } from './src/screens/RoadsScreen';
import { EmergencyScreen } from './src/screens/EmergencyScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const MainNavigator: React.FC = () => {
  const { role } = useApp();
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<string>('Home');

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (!onboardingDone) {
    return <OnboardingScreen onFinish={() => setOnboardingDone(true)} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'RiskMap':
        return <RiskMapScreen onBack={() => setCurrentScreen('Home')} />;
      case 'ReportHazard':
        return (
          <ReportHazardScreen
            onBack={() => setCurrentScreen('Home')}
            onSuccess={() => setCurrentScreen('Home')}
          />
        );
      case 'FieldOfficer':
        return <FieldOfficerScreen onBack={() => setCurrentScreen('Home')} />;
      case 'AdminDashboard':
        return (
          <AdminDashboardScreen
            onBack={() => setCurrentScreen('Home')}
            onNavigate={setCurrentScreen}
          />
        );
      case 'RegionalView':
        return <RegionalViewScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Sensors':
        return <SensorsScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Roads':
        return <RoadsScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Emergency':
        return <EmergencyScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Analytics':
        return <AnalyticsScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('Home')}
            onLogout={() => setIsAuthenticated(false)}
          />
        );
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  const isHomeOrMap =
    currentScreen === 'Home' ||
    currentScreen === 'RiskMap' ||
    currentScreen === 'Settings' ||
    currentScreen === 'FieldOfficer' ||
    currentScreen === 'AdminDashboard' ||
    currentScreen === 'Emergency';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>{renderScreen()}</View>

      {/* Modern Disaster Management Bottom Tab Bar */}
      {isHomeOrMap && (
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('Home')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'Home' && styles.tabIconActive]}>
              🏠
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'Home' && styles.tabLabelActive]}>
              HOME
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('RiskMap')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'RiskMap' && styles.tabIconActive]}>
              🗺️
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'RiskMap' && styles.tabLabelActive]}>
              RISK MAP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, styles.reportTabItem]}
            onPress={() => setCurrentScreen('ReportHazard')}
          >
            <View style={styles.reportBubble}>
              <Text style={styles.reportBubbleIcon}>🚨</Text>
            </View>
            <Text style={styles.reportBubbleLabel}>REPORT</Text>
          </TouchableOpacity>

          {/* Dynamic Role Tab */}
          {role === 'admin' ? (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('AdminDashboard')}
            >
              <Text style={[styles.tabIcon, currentScreen === 'AdminDashboard' && styles.tabIconActive]}>
                🏛️
              </Text>
              <Text style={[styles.tabLabel, currentScreen === 'AdminDashboard' && styles.tabLabelActive]}>
                COMMAND
              </Text>
            </TouchableOpacity>
          ) : role === 'field_officer' ? (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('FieldOfficer')}
            >
              <Text style={[styles.tabIcon, currentScreen === 'FieldOfficer' && styles.tabIconActive]}>
                👮
              </Text>
              <Text style={[styles.tabLabel, currentScreen === 'FieldOfficer' && styles.tabLabelActive]}>
                FIELD
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setCurrentScreen('Emergency')}
            >
              <Text style={[styles.tabIcon, currentScreen === 'Emergency' && styles.tabIconActive]}>
                🆘
              </Text>
              <Text style={[styles.tabLabel, currentScreen === 'Emergency' && styles.tabLabelActive]}>
                SOS
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('Settings')}
          >
            <Text style={[styles.tabIcon, currentScreen === 'Settings' && styles.tabIconActive]}>
              ⚙️
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'Settings' && styles.tabLabelActive]}>
              SETTINGS
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingBottom: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  reportTabItem: {
    marginTop: -16,
  },
  reportBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  reportBubbleIcon: {
    fontSize: 20,
  },
  reportBubbleLabel: {
    ...typography.captionBold,
    fontSize: 9,
    color: colors.danger,
    marginTop: 2,
  },
});
