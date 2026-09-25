import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_STATE,
  loadState,
  MAX_HISTORY,
  PersistedState,
  sanitizeState,
  saveState,
  STORAGE_KEY,
} from '../storage';

const record = (id: string) => ({
  id,
  scenarioId: 'global-crisis',
  score: 60,
  rating: 'CONTAINED',
  completedAt: 1,
});

describe('sanitizeState', () => {
  it('returns defaults for garbage', () => {
    expect(sanitizeState(null)).toEqual(DEFAULT_STATE);
    expect(sanitizeState('nope')).toEqual(DEFAULT_STATE);
  });

  it('keeps valid fields and repairs invalid ones individually', () => {
    const state = sanitizeState({
      preferences: { theme: 'light', haptics: 'yes', notifications: true },
      history: [record('a'), { id: 42 }],
    });
    expect(state.preferences).toEqual({ theme: 'light', haptics: true, notifications: true });
    expect(state.history.map((r) => r.id)).toEqual(['a']);
  });

  it('rejects unknown themes', () => {
    expect(sanitizeState({ preferences: { theme: 'neon' } }).preferences.theme).toBe('dark');
  });

  it('caps history length', () => {
    const history = Array.from({ length: MAX_HISTORY + 10 }, (_, i) => record(String(i)));
    expect(sanitizeState({ history }).history).toHaveLength(MAX_HISTORY);
  });
});

describe('persistence', () => {
  beforeEach(() => AsyncStorage.clear());

  it('round-trips state through AsyncStorage', async () => {
    const state: PersistedState = {
      ...DEFAULT_STATE,
      preferences: { ...DEFAULT_STATE.preferences, theme: 'system' },
    };
    await saveState(state);
    await expect(loadState()).resolves.toEqual(state);
  });

  it('falls back to defaults on corrupted JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{not json');
    await expect(loadState()).resolves.toEqual(DEFAULT_STATE);
  });
});
