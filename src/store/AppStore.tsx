import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MissionRecord } from '../types';
import {
  DEFAULT_STATE,
  loadState,
  MAX_HISTORY,
  PersistedState,
  Preferences,
  saveState,
} from './storage';

interface AppStoreValue {
  /** False until the persisted state has been read; the splash screen stays up until then. */
  hydrated: boolean;
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  history: MissionRecord[];
  recordMission: (record: MissionRecord) => void;
  clearHistory: () => void;
}

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  // Guards against a hydration read resolving after the user already changed something.
  const dirty = useRef(false);

  useEffect(() => {
    let mounted = true;
    loadState().then((stored) => {
      if (!mounted) return;
      if (!dirty.current) setState(stored);
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const update = useCallback((updater: (prev: PersistedState) => PersistedState) => {
    dirty.current = true;
    setState(updater);
  }, []);

  const setPreference = useCallback<AppStoreValue['setPreference']>(
    (key, value) =>
      update((prev) => ({ ...prev, preferences: { ...prev.preferences, [key]: value } })),
    [update]
  );

  const recordMission = useCallback(
    (record: MissionRecord) =>
      update((prev) => ({
        ...prev,
        // Newest first; re-recording the same run id (e.g. a re-render) is a no-op.
        history: [record, ...prev.history.filter((r) => r.id !== record.id)].slice(0, MAX_HISTORY),
      })),
    [update]
  );

  const clearHistory = useCallback(() => update((prev) => ({ ...prev, history: [] })), [update]);

  const value = useMemo<AppStoreValue>(
    () => ({
      hydrated,
      preferences: state.preferences,
      setPreference,
      history: state.history,
      recordMission,
      clearHistory,
    }),
    [hydrated, state, setPreference, recordMission, clearHistory]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = (): AppStoreValue => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside <AppStoreProvider>.');
  }
  return context;
};
