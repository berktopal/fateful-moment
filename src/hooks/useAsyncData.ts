import { DependencyList, useCallback, useEffect, useState } from 'react';
import { useI18n } from '../i18n';

interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads data from an async repository with loading / error states and a retry handle.
 * Results that resolve after unmount (or after a newer reload) are discarded. When `deps`
 * change (e.g. the app language) the data is reloaded in place, keeping the previous result
 * on screen instead of flashing the loading state.
 */
export const useAsyncData = <T>(load: () => Promise<T>, deps: DependencyList = []): AsyncData<T> => {
  const { t } = useI18n();
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFailed(false);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `load` may be an inline closure; `attempt` and `deps` decide when to run it again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  const reload = useCallback(() => {
    setLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  return { data, loading, error: failed ? t.common.loadError : null, reload };
};
