import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MissionRecord } from '../types';

export type ThemePreference = 'system' | 'dark' | 'light';

export interface Preferences {
  theme: ThemePreference;
  haptics: boolean;
  notifications: boolean;
}

export interface PersistedState {
  preferences: Preferences;
  history: MissionRecord[];
}

export const STORAGE_KEY = 'fateful-moment/state/v1';
export const MAX_HISTORY = 50;

export const DEFAULT_STATE: PersistedState = {
  preferences: { theme: 'dark', haptics: true, notifications: false },
  history: [],
};

const THEMES: readonly ThemePreference[] = ['system', 'dark', 'light'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isMissionRecord = (value: unknown): value is MissionRecord =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.scenarioId === 'string' &&
  typeof value.score === 'number' &&
  typeof value.rating === 'string' &&
  typeof value.completedAt === 'number';

/**
 * Parses whatever is on disk into a valid state. Unknown or corrupted fields fall back to
 * defaults field-by-field, so a bad write can never brick app start-up.
 */
export const sanitizeState = (raw: unknown): PersistedState => {
  if (!isRecord(raw)) return DEFAULT_STATE;

  const prefs = isRecord(raw.preferences) ? raw.preferences : {};
  const defaults = DEFAULT_STATE.preferences;

  return {
    preferences: {
      theme: THEMES.includes(prefs.theme as ThemePreference)
        ? (prefs.theme as ThemePreference)
        : defaults.theme,
      haptics: typeof prefs.haptics === 'boolean' ? prefs.haptics : defaults.haptics,
      notifications:
        typeof prefs.notifications === 'boolean' ? prefs.notifications : defaults.notifications,
    },
    history: Array.isArray(raw.history)
      ? raw.history.filter(isMissionRecord).slice(0, MAX_HISTORY)
      : [],
  };
};

export const loadState = async (): Promise<PersistedState> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? sanitizeState(JSON.parse(json)) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
};

export const saveState = async (state: PersistedState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort; the in-memory state stays authoritative for this session.
  }
};
