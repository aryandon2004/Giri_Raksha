import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      emoji: '🧠',
      title: 'Predict Risk Before Disaster',
      description:
        'Giri Raksha uses machine learning algorithms combining rainfall, pore-water soil saturation, slope gradient, and historical landslide data to predict slope failure risk before tragedy strikes.',
      badge: 'EXPLAINABLE AI ENGINE',
    },
    {
      emoji: '📸',
      title: 'Report What You See',
      description:
        'Citizens and field personnel can instantly capture geo-tagged photos and videos of ground cracks, rockfalls, and road blockages with automatic sub-meter GPS positioning.',
      badge: 'COMMUNITY & FIELD REPORTING',
    },
    {
      emoji: '📡',
      title: 'Stay Protected Even Offline',
      description:
        'Engineered for remote North Eastern terrain with zero network connectivity. Reports and field observations save securely to your local SQLite database and sync automatically once signal returns.',
      badge: 'OFFLINE-FIRST SYNCHRONIZATION',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <Text style={styles.brandTitle}>GIRI RAKSHA</Text>
        {currentSlide < slides.length - 1 ? (
          <TouchableOpacity onPress={onFinish}>
            <Text style={styles.skipBtn}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>{slide.emoji}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{slide.badge}</Text>
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      {/* Pagination Dots & Navigation */}
      <View style={styles.footer}>
        <View style={styles.paginationRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                currentSlide === idx ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>
            {currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  brandTitle: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 1,
    fontSize: 12,
  },
  skipBtn: {
    ...typography.callout,
    color: colors.textMuted,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 48,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  badgeText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  title: {
    ...typography.title1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 30,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    gap: 20,
    paddingBottom: 20,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: colors.borderLight,
  },
  primaryBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...typography.headline,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
