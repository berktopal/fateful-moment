import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { DARK_TOKENS, LIGHT_TOKENS, ThemeTokens } from './tokens';

export type ThemePreference = 'system' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeTokens;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('dark'); // Default to dark per Figma spec

  const activeMode = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return preference;
  }, [preference, systemScheme]);

  const theme = useMemo(() => {
    return activeMode === 'light' ? LIGHT_TOKENS : DARK_TOKENS;
  }, [activeMode]);

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference,
      isDark: activeMode === 'dark',
    }),
    [theme, preference, activeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback to dark theme if rendered outside provider
    return {
      theme: DARK_TOKENS,
      preference: 'dark',
      setPreference: () => {},
      isDark: true,
    };
  }
  return context;
};

