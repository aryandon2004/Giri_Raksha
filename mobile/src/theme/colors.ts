export const colors = {
  // Risk Levels
  riskLow: '#10B981', // Emerald green (0 - 30)
  riskLowBg: 'rgba(16, 185, 129, 0.15)',
  riskLowBorder: '#059669',

  riskModerate: '#F59E0B', // Amber orange (31 - 70)
  riskModerateBg: 'rgba(245, 158, 11, 0.15)',
  riskModerateBorder: '#D97706',

  riskHigh: '#EF4444', // Coral red (71 - 100)
  riskHighBg: 'rgba(239, 68, 68, 0.15)',
  riskHighBorder: '#DC2626',

  riskCritical: '#B91C1C', // Crimson red for emergencies
  riskCriticalBg: 'rgba(185, 28, 28, 0.25)',

  // Brand and Technical Theme
  primary: '#38BDF8', // Sky blue / Tech accent
  primaryDark: '#0284C7',
  primaryGlow: 'rgba(56, 189, 248, 0.2)',
  secondary: '#06B6D4',
  accent: '#F97316',

  // Surfaces & Backgrounds
  background: '#0B132B', // Deep technical dark slate
  surface: '#141E3C', // Card surface
  surfaceHover: '#1C284E',
  surfaceLight: '#243356',
  card: '#182346',
  overlay: 'rgba(11, 19, 43, 0.85)',

  // Borders & Dividers
  border: '#2A3B66',
  borderLight: '#3B4D7E',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B132B',

  // Statuses
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  // Network & Sync
  online: '#10B981',
  offline: '#F97316',
  syncing: '#38BDF8',

  // Road Statuses
  roadOpen: '#10B981',
  roadPartial: '#F59E0B',
  roadBlocked: '#EF4444',

  // Response Teams
  teamAssigned: '#38BDF8',
  teamEnRoute: '#F59E0B',
  teamOnSite: '#A855F7',
  teamResolved: '#10B981',
} as const;

export type Colors = typeof colors;
