export interface ThemeTokens {
  mode: 'dark' | 'light';
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceSubtle: string;
    border: string;
    borderActive: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    onPrimary: string;
    accent: string;
    danger: string;
    beaconGreen: string;
    beaconRed: string;
    overlay: string;
    cardOverlayGradient: readonly [string, string];
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    displayLarge: {
      fontSize: number;
      fontWeight: '900';
      fontStyle: 'italic';
      letterSpacing: number;
    };
    heading: {
      fontSize: number;
      fontWeight: 'bold';
      fontStyle: 'italic';
      letterSpacing: number;
    };
    title: {
      fontSize: number;
      fontWeight: '700';
      letterSpacing: number;
    };
    body: {
      fontSize: number;
      fontWeight: '400';
      lineHeight: number;
    };
    hudMono: {
      fontSize: number;
      fontWeight: '700';
      letterSpacing: number;
    };
    caption: {
      fontSize: number;
      fontWeight: '600';
      letterSpacing: number;
    };
  };
}

export const DARK_TOKENS: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#020617', // Slate 950 (Figma Style Guide)
    surface: '#0F172A', // Slate 900
    surfaceElevated: '#1E293B', // Slate 800
    surfaceSubtle: 'rgba(15, 23, 42, 0.6)',
    border: '#1D293D', // Slate 800 (Figma exact)
    borderActive: '#00D3F3', // Cyan 400
    textPrimary: '#F1F5F9', // Slate 100
    textSecondary: '#CBD5E1', // Slate 300
    textMuted: '#94A3B8', // Slate 400
    primary: '#00D3F3', // Cyan 400
    onPrimary: '#020617', // Contrast on Cyan
    accent: '#FB2C36', // Red 500 (Figma exact)
    danger: '#FB2C36',
    beaconGreen: '#10B981',
    beaconRed: '#FB2C36',
    overlay: 'rgba(2, 6, 23, 0.75)',
    cardOverlayGradient: ['rgba(2,6,23,0.2)', 'rgba(2,6,23,0.92)'] as const,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    displayLarge: {
      fontSize: 28,
      fontWeight: '900',
      fontStyle: 'italic',
      letterSpacing: 0.5,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      fontStyle: 'italic',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    hudMono: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 2,
    },
    caption: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
    },
  },
};

export const LIGHT_TOKENS: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF', // Pure White
    surfaceElevated: '#F1F5F9', // Slate 100
    surfaceSubtle: 'rgba(241, 245, 249, 0.8)',
    border: '#E2E8F0', // Slate 200
    borderActive: '#0891B2', // Cyan 600 (Accessible on light)
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#334155', // Slate 700
    textMuted: '#64748B', // Slate 500
    primary: '#0891B2', // Cyan 600 for AA contrast
    onPrimary: '#FFFFFF',
    accent: '#DC2626', // Red 600
    danger: '#DC2626',
    beaconGreen: '#059669',
    beaconRed: '#DC2626',
    overlay: 'rgba(15, 23, 42, 0.4)',
    cardOverlayGradient: ['rgba(15,23,42,0.3)', 'rgba(15,23,42,0.92)'] as const,
  },
  spacing: DARK_TOKENS.spacing,
  radius: DARK_TOKENS.radius,
  typography: DARK_TOKENS.typography,
};

