import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { DARK_TOKENS, LIGHT_TOKENS, ThemeTokens } from './tokens';
import { useAppStore } from '../store/AppStore';
import type { ThemePreference } from '../store/storage';

export type { ThemePreference };

interface ThemeContextType {
  theme: ThemeTokens;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Resolves the persisted preference (+ OS scheme for "system") into concrete tokens. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const { preferences, setPreference } = useAppStore();
  const preference = preferences.theme;

  const value = useMemo<ThemeContextType>(() => {
    const mode =
      preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;
    return {
      theme: mode === 'light' ? LIGHT_TOKENS : DARK_TOKENS,
      preference,
      setPreference: (next) => setPreference('theme', next),
      isDark: mode === 'dark',
    };
  }, [preference, systemScheme, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const FALLBACK: ThemeContextType = {
  theme: DARK_TOKENS,
  preference: 'dark',
  setPreference: () => {},
  isDark: true,
};

/** Falls back to the dark (Figma baseline) theme so components render in isolation, e.g. tests. */
export const useTheme = (): ThemeContextType => useContext(ThemeContext) ?? FALLBACK;
