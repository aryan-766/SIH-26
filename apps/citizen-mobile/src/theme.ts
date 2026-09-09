/**
 * GramUdyam Mobile App — Design System
 * Centralized theme tokens for consistent UI across all screens.
 */

export const COLORS = {
  // Primary Green (Rural theme)
  primary: '#16a34a',
  primaryDark: '#15803d',
  primaryLight: '#bbf7d0',
  primaryBg: '#f0fdf4',

  // Accent
  accent: '#7c3aed',
  accentLight: '#ede9fe',

  // Semantic
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',

  // Neutrals
  white: '#ffffff',
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',

  // Bottom Tab
  tabActive: '#16a34a',
  tabInactive: '#94a3b8',
  tabBg: '#ffffff',

  // Status colors
  statusApplied: '#3b82f6',
  statusVerified: '#22c55e',
  statusPending: '#f59e0b',
  statusRejected: '#ef4444',
  statusDisbursed: '#7c3aed',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  shimmer: '#e2e8f0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT = {
  regular: 'System',
  bold: 'System',
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  hero: 28,
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    hero: 28,
  },
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const SHADOW = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};
