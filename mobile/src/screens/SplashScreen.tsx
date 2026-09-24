import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Topographic Contour Background Lines */}
      <View style={styles.contourCircleBig} />
      <View style={styles.contourCircleMid} />

      {/* Mountain Contour Symbol */}
      <View style={styles.mountainIconBox}>
        <Text style={styles.mountainEmoji}>⛰️</Text>
      </View>

      <Text style={styles.title}>GIRI RAKSHA</Text>
      <Text style={styles.subTitle}>AI-POWERED LANDSLIDE EARLY WARNING</Text>

      <View style={styles.taglineBox}>
        <Text style={styles.tagline}>"Predict. Warn. Protect."</Text>
        <Text style={styles.meaning}>Giri = Mountain • Raksha = Protection</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.sihText}>SMART INDIA HACKATHON • PS ID 26001</Text>
        <Text style={styles.nerText}>North Eastern Region of India (NER)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  contourCircleBig: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.1)',
  },
  contourCircleMid: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  mountainIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  mountainEmoji: {
    fontSize: 40,
  },
  title: {
    ...typography.hero,
    fontSize: 34,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  subTitle: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 1.5,
    marginTop: 6,
    fontSize: 11,
  },
  taglineBox: {
    marginTop: 24,
    alignItems: 'center',
  },
  tagline: {
    ...typography.title3,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  meaning: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  sihText: {
    ...typography.captionBold,
    color: colors.accent,
    fontSize: 10,
    letterSpacing: 1,
  },
  nerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
