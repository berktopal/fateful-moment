import { Platform, TextStyle } from 'react-native';

/** Figma HUD text ("SCENARIO BRIEFING", "0:00 min", "SYSTEM INTEGRITY") uses a monospace face. */
export const MONO_FONT = Platform.select({ ios: 'Menlo', default: 'monospace' });

type Gradient = readonly [string, string, ...string[]];

/**
 * Raw Figma palette. Components never read these directly — they go through the
 * semantic `colors` below so light and dark themes stay in sync.
 */
const PALETTE = {
  cyan400: '#00D3F3',
  cyan600: '#0891B2',
  cyan700: '#0092B8',
  red500: '#FB2C36',
  red600: '#DC2626',
  amber500: '#F59E0B',
  amber600: '#D97706',
  emerald500: '#10B981',
  emerald600: '#059669',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate700: '#334155',
  slate800: '#1D293D',
  slate800Alt: '#1E293B',
  slate900: '#0F172A',
  slate925: '#0A0F1E',
  slate950: '#020617',
  white: '#FFFFFF',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  /** Style-guide HUD panels (Standard Card, Interactive Selection). */
  surfaceHud: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  /** Low-alpha primary for selected icon tiles, tab highlights and soft buttons. */
  primaryTint: string;
  /** Solid fill of the selected Interactive Selection row. */
  primaryStrong: string;
  accent: string;
  danger: string;
  warning: string;
  success: string;
  /** Text/icons on saturated fills (danger, neutral buttons). */
  onAccent: string;
  /** High-contrast surface used by the Secondary button in light mode. */
  inverseSurface: string;
  onInverseSurface: string;
  switchThumbOff: string;
  shadow: string;
  /** Translucent "glass" fill + hairline border used by the Start buttons on imagery. */
  glass: string;
  glassBorder: string;
  timerGradient: Gradient;
}

/**
 * Colours for content drawn on top of photography. Figma renders these identically in
 * both themes because the imagery itself is always dark.
 */
export const MEDIA_COLORS = {
  base: PALETTE.slate950,
  scrim: ['rgba(2, 6, 23, 0.45)', 'rgba(2, 6, 23, 0.92)'] as Gradient,
  scrimBottom: ['transparent', 'rgba(2, 6, 23, 0.55)', 'rgba(2, 6, 23, 0.95)'] as Gradient,
  /** Figma cyan on imagery in both themes (the light theme's darker cyan is for light surfaces). */
  accent: PALETTE.cyan400,
  textPrimary: PALETTE.white,
  textSecondary: PALETTE.slate200,
  textMuted: PALETTE.slate400,
  passiveWash: 'rgba(226, 232, 240, 0.6)',
  /** Legibility backdrop for HUD text placed directly on imagery. */
  glass: 'rgba(2, 6, 23, 0.7)',
  /** Figma Card placeholder when no image is supplied. */
  placeholder: ['#E5E7EB', '#9CA3AF', PALETTE.slate950] as Gradient,
  placeholderIcon: '#52525B',
} as const;

/** Figma "Option" cards: diagonal sheen gradients shared by both themes, always white copy. */
export const OPTION_GRADIENTS = {
  active: ['#5E7F8E', '#3FB9CC', '#52E3F5', '#3FB9CC', '#5E7F8E'] as Gradient,
  passive: ['#B4BFCA', '#AEDDE6', '#B2F0F7', '#AEDDE6', '#B4BFCA'] as Gradient,
  default: ['#667085', '#667085'] as Gradient,
  activeBorder: 'rgba(0, 211, 243, 0.6)',
  text: PALETTE.white,
} as const;

export interface ThemeTokens {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; full: number };
  typography: {
    displayLarge: TextStyle;
    heading: TextStyle;
    title: TextStyle;
    body: TextStyle;
    hudMono: TextStyle;
    caption: TextStyle;
  };
}

const SPACING: ThemeTokens['spacing'] = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };

const RADIUS: ThemeTokens['radius'] = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, full: 9999 };

const TYPOGRAPHY: ThemeTokens['typography'] = {
  displayLarge: { fontSize: 32, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  heading: { fontSize: 22, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },
  title: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  hudMono: { fontFamily: MONO_FONT, fontSize: 11, fontWeight: '500', letterSpacing: 2 },
  caption: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
};

export const DARK_TOKENS: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: PALETTE.slate950,
    surface: PALETTE.slate900,
    surfaceElevated: PALETTE.slate800Alt,
    surfaceHud: PALETTE.slate925,
    border: PALETTE.slate800,
    textPrimary: PALETTE.slate100,
    textMuted: PALETTE.slate400,
    primary: PALETTE.cyan400,
    onPrimary: PALETTE.slate950,
    primaryTint: 'rgba(0, 211, 243, 0.14)',
    primaryStrong: PALETTE.cyan700,
    accent: PALETTE.red500,
    danger: PALETTE.red500,
    warning: PALETTE.amber500,
    success: PALETTE.emerald500,
    onAccent: PALETTE.white,
    inverseSurface: PALETTE.slate900,
    onInverseSurface: PALETTE.slate100,
    switchThumbOff: PALETTE.slate400,
    shadow: '#000000',
    glass: 'rgba(2, 6, 23, 0.55)',
    glassBorder: 'rgba(148, 163, 184, 0.35)',
    timerGradient: [PALETTE.cyan400, '#7C8BA1', PALETTE.red500],
  },
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
};

/** Light theme: same brand, WCAG AA contrast on light surfaces (Cyan 600 instead of 400). */
export const LIGHT_TOKENS: ThemeTokens = {
  mode: 'light',
  colors: {
    background: PALETTE.slate50,
    surface: PALETTE.white,
    surfaceElevated: PALETTE.slate100,
    surfaceHud: PALETTE.white,
    border: PALETTE.slate200,
    textPrimary: PALETTE.slate900,
    textMuted: PALETTE.slate500,
    primary: PALETTE.cyan600,
    onPrimary: PALETTE.white,
    primaryTint: 'rgba(8, 145, 178, 0.12)',
    primaryStrong: PALETTE.cyan600,
    accent: PALETTE.red600,
    danger: PALETTE.red600,
    warning: PALETTE.amber600,
    success: PALETTE.emerald600,
    onAccent: PALETTE.white,
    inverseSurface: PALETTE.slate900,
    onInverseSurface: PALETTE.white,
    switchThumbOff: PALETTE.slate300,
    shadow: PALETTE.slate700,
    glass: 'rgba(2, 6, 23, 0.55)',
    glassBorder: 'rgba(148, 163, 184, 0.35)',
    timerGradient: [PALETTE.cyan600, PALETTE.slate400, PALETTE.red600],
  },
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
};
