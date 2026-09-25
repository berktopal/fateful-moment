import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/** Counts from 0 to `target` with an ease-out curve (e.g. the outcome score). */
export const useCountUp = (target: number, durationMs = 900, delayMs = 150): number => {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let start: number | null = null;
    const timeout = setTimeout(() => {
      const step = (now: number) => {
        start ??= now;
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delayMs);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, delayMs, reducedMotion]);

  return reducedMotion ? target : value;
};
