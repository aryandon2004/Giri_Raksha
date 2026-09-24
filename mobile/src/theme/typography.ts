import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  title3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  callout: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  metricLarge: {
    fontSize: 42,
    fontWeight: '900' as const,
    letterSpacing: -1,
  },
  metricMedium: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
};
