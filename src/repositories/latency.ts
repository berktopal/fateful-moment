/**
 * Repositories are async so the UI is already shaped for a real backend (loading states,
 * error handling). In development a small delay keeps that path visible; release builds (the
 * APK) resolve at once, so screens backed by local data don't show a spinner on every visit.
 */
export const simulateLatency = (ms = __DEV__ ? 250 : 0) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
