import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** True while the app is in the foreground; used to pause timers when it is backgrounded. */
export const useAppActive = (): boolean => {
  const [active, setActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) =>
      setActive(state === 'active')
    );
    return () => subscription.remove();
  }, []);

  return active;
};
