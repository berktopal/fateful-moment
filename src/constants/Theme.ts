import { COLORS } from './Colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 24,
    fontWeight: '900' as const,
    fontStyle: 'italic' as const,
    color: COLORS.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontStyle: 'italic' as const,
    color: COLORS.text,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    letterSpacing: 1.5,
    color: COLORS.primary,
  },
};

