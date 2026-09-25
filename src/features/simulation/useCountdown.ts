import { useEffect, useRef, useState } from 'react';

const TICK_MS = 100;

/**
 * Pausable countdown. Time is measured from wall-clock deltas rather than tick counts, so a
 * dropped frame or a slow JS thread never makes the timer run long.
 *
 * @param totalMs   Duration of one countdown.
 * @param running   Pauses when false (e.g. while reviewing, or when the app is backgrounded).
 * @param resetKey  Changing this restarts the countdown from `totalMs`.
 * @param onExpire  Called once when the countdown reaches zero while running.
 */
export const useCountdown = (
  totalMs: number,
  running: boolean,
  resetKey: string | number,
  onExpire: () => void
): number => {
  const [remaining, setRemaining] = useState(totalMs);
  const [activeKey, setActiveKey] = useState(resetKey);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  // Reset during render (React's "adjusting state when a prop changes" pattern).
  if (activeKey !== resetKey) {
    setActiveKey(resetKey);
    setRemaining(totalMs);
  }

  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = now - last;
      last = now;
      setRemaining((r) => Math.max(0, r - elapsed));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, resetKey]);

  useEffect(() => {
    if (running && remaining === 0) onExpireRef.current();
  }, [remaining, running]);

  return remaining;
};

/** "T-00:07" style HUD label. */
export const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `T-${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
