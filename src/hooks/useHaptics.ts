import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/AppStore';

/**
 * Haptic feedback that respects the Settings → "Haptic Feedback" toggle.
 * Failures (e.g. web, devices without a Taptic engine) are swallowed deliberately.
 */
export const useHaptics = () => {
  const { preferences } = useAppStore();
  const enabled = preferences.haptics;

  return useMemo(() => {
    const run = (fn: () => Promise<void>) => {
      if (enabled) fn().catch(() => {});
    };
    return {
      selection: () => run(() => Haptics.selectionAsync()),
      impact: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
      success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
      warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
    };
  }, [enabled]);
};
