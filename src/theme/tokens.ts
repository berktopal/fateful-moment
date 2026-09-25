import { Platform, TextStyle } from 'react-native';

/**
 * Figma `font-secondary` is Menlo Bold (HUD text: "SCENARIO BRIEFING", "0:00 min"). Menlo ships
 * with iOS; Android falls back to its system monospace face.
 */
export const MONO_FONT = Platform.select({ ios: 'Menlo', default: 'monospace' });

type Gradient = readonly [string, string, ...string[]];

/**
 * Raw palette. Values come from the Figma variables (names in comments); components never
 * read these directly — they go through the semantic `colors` below.
 */
const PALETTE = {
  cyan400: '#00D3F3', // colors/on-brand/primary/pri-500 [base]
  cyan600: '#0891B2',
  cyan700: '#0092B8',
  red500: '#FB2C36', // Accent / Red 500
  red600: '#DC2626',
  amber500: '#F59E0B',
  amber600: '#D97706',
  emerald500: '#10B981',
  emerald600: '#059669',
  slate50: '#F8FAFC', // sec-100
  slate100: '#F1F5F9',
  slate200: '#E2E8F0', // sec-200
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slateTab: '#62748E', // inactive tab icon
  slate500: '#64748B',
  grey400: '#90A1B9', // sec-400 (disabled border)
  grey500: '#8F99A6', // utility/grey/grey-500 (disabled fill/text)
  slate700: '#314158', // sec-700 (nav bar divider)
  slate800: '#1D293D', // sec-800 (card border)
  slate800Alt: '#1E293B',
  slate900: '#0F172B', // sec-900 (pressed / secondary button)
  slate925: '#0A0F1E',
  slate950: '#020618', // colors/base/background
  white: '#FFFFFF',
  black: '#000000',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  /** Style-guide HUD panels (Standard Card, Interactive Selection). */
  surfaceHud: string;
  border: string;
  /** Nav bar bottom divider. */
  divider: string;
  textPrimary: string;
  textMuted: string;
  /** Inactive icons (tab bar, icon buttons). */
  iconMuted: string;
  primary: string;
  onPrimary: string;
  /** Selected icon tiles and tab highlights (Figma Icon Button, active). */
  primaryTint: string;
  /** Solid fill of the selected Interactive Selection row. */
  primaryStrong: string;
  accent: string;
  danger: string;
  warning: string;
  success: string;
  /** Text/icons on saturated fills (danger, dark buttons). */
  onAccent: string;
  /** Figma "Secondary Button" / pressed state fill. */
  inverseSurface: string;
  onInverseSurface: string;
  /** Figma Primary Glass: translucent cyan fill + cyan label. */
  glassFill: string;
  glassText: string;
  /** Figma Ghost button. */
  ghostFill: string;
  ghostBorder: string;
  ghostText: string;
  /** Figma disabled state (fill, border, label on outlined variants). */
  disabledFill: string;
  disabledBorder: string;
  disabledText: string;
  switchThumbOff: string;
  shadow: string;
  timerGradient: Gradient;
}

/**
 * Colours for content drawn on top of photography. Figma renders these identically in
 * both themes because the imagery itself is always dark.
 */
export const MEDIA_COLORS = {
  base: PALETTE.slate950,
  /** sec-800 card outline — cards on imagery keep it in both themes. */
  border: PALETTE.slate800,
  /** Scenario Container (hero): background → 40% at mid-height → clear, bottom-up. */
  scrimHero: ['rgba(2, 6, 24, 0)', 'rgba(2, 6, 24, 0.4)', PALETTE.slate950] as Gradient,
  /** Card: background → 30% at mid-height → clear, bottom-up. */
  scrimCard: ['rgba(2, 6, 24, 0)', 'rgba(2, 6, 24, 0.3)', PALETTE.slate950] as Gradient,
  /** List cards carry longer copy, so they get a slightly denser scrim for legibility. */
  scrimList: ['rgba(2, 6, 24, 0.35)', 'rgba(2, 6, 24, 0.7)', 'rgba(2, 6, 24, 0.94)'] as Gradient,
  accent: PALETTE.cyan400,
  glassFill: 'rgba(0, 184, 219, 0.14)',
  textPrimary: PALETTE.slate50, // sec-100
  textSecondary: PALETTE.slate200, // sec-200
  textMuted: PALETTE.slate400,
  /** Legibility backdrop for HUD text placed directly on imagery. */
  glass: 'rgba(2, 6, 23, 0.7)',
  /** Figma Card placeholder when no image is supplied. */
  placeholder: ['#E5E7EB', '#9CA3AF', PALETTE.slate950] as Gradient,
  placeholderIcon: '#52525B',
} as const;

/**
 * Figma "Option Card". The fills are translucent, so the same values read correctly on both
 * the dark and the light background (Figma's own canvas is light).
 */
export const OPTION_CARD = {
  fill: 'rgba(15, 23, 43, 0.63)',
  selectedGradient: [
    'rgba(15, 23, 43, 0.63)',
    'rgba(0, 211, 243, 0.63)',
    'rgba(15, 23, 43, 0.63)',
  ] as Gradient,
  border: PALETTE.slate50, // sec-100
  /** Passive = the selected treatment at 48% opacity. */
  passiveOpacity: 0.48,
  text: PALETTE.white,
} as const;

/** Figma text styles (`typhography/*` variables): size / line height. */
const TYPE_SCALE = {
  caption02: { fontSize: 11, lineHeight: 16 },
  caption01: { fontSize: 12, lineHeight: 16 },
  subhead: { fontSize: 14, lineHeight: 20 },
  body: { fontSize: 16, lineHeight: 24 },
  headline: { fontSize: 16, lineHeight: 24 },
  title01: { fontSize: 28, lineHeight: 34 },
} as const;

export interface ThemeTokens {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    hero: number;
    full: number;
  };
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

// Figma radius/rd-16 (cards, buttons, option cards) and radius/rd-24 (Scenario Container).
const RADIUS: ThemeTokens['radius'] = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  hero: 24,
  full: 9999,
};

const TYPOGRAPHY: ThemeTokens['typography'] = {
  displayLarge: { ...TYPE_SCALE.title01, fontWeight: '900', fontStyle: 'italic' },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: '900', fontStyle: 'italic' },
  title: { ...TYPE_SCALE.headline, fontWeight: '600' },
  body: { ...TYPE_SCALE.subhead, fontWeight: '400' },
  hudMono: { ...TYPE_SCALE.caption02, fontFamily: MONO_FONT, fontWeight: '700', letterSpacing: 1 },
  caption: { ...TYPE_SCALE.caption02, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
};

export { TYPE_SCALE };

export const DARK_TOKENS: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: PALETTE.slate950,
    surface: PALETTE.slate900,
    surfaceElevated: PALETTE.slate800Alt,
    surfaceHud: PALETTE.slate925,
    border: PALETTE.slate800,
    divider: PALETTE.slate700,
    textPrimary: PALETTE.slate100,
    textMuted: PALETTE.slate400,
    iconMuted: PALETTE.slateTab,
    primary: PALETTE.cyan400,
    onPrimary: PALETTE.black,
    primaryTint: 'rgba(0, 184, 219, 0.1)',
    primaryStrong: PALETTE.cyan700,
    accent: PALETTE.red500,
    danger: PALETTE.red500,
    warning: PALETTE.amber500,
    success: PALETTE.emerald500,
    onAccent: PALETTE.slate100,
    inverseSurface: PALETTE.slate900,
    onInverseSurface: PALETTE.slate100,
    glassFill: 'rgba(0, 211, 243, 0.14)',
    glassText: PALETTE.cyan400,
    ghostFill: 'rgba(243, 244, 245, 0.1)',
    ghostBorder: PALETTE.white,
    ghostText: PALETTE.white,
    disabledFill: PALETTE.grey500,
    disabledBorder: PALETTE.grey400,
    disabledText: PALETTE.grey500,
    switchThumbOff: PALETTE.slate400,
    shadow: PALETTE.black,
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
    divider: PALETTE.slate200,
    textPrimary: PALETTE.slate900,
    textMuted: PALETTE.slate500,
    iconMuted: PALETTE.slateTab,
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
    glassFill: 'rgba(8, 145, 178, 0.12)',
    glassText: PALETTE.cyan600,
    ghostFill: 'rgba(15, 23, 43, 0.04)',
    ghostBorder: PALETTE.slate900,
    ghostText: PALETTE.slate900,
    disabledFill: PALETTE.grey500,
    disabledBorder: PALETTE.grey400,
    disabledText: PALETTE.grey500,
    switchThumbOff: PALETTE.slate300,
    shadow: PALETTE.slate700,
    timerGradient: [PALETTE.cyan600, PALETTE.slate400, PALETTE.red600],
  },
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
};
