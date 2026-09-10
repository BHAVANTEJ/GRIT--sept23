import { useEffect, useRef, useState } from 'react';
import { TimeRemaining } from '../types/cohort.types';

const ZERO: TimeRemaining = { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };

const MS_SECOND = 1000;
const MS_MINUTE = MS_SECOND * 60;
const MS_HOUR = MS_MINUTE * 60;
const MS_DAY = MS_HOUR * 24;

/**
 * Computes the remaining time from the wall clock every tick.
 *
 * Deriving from `Date.now()` rather than decrementing a counter is what makes
 * the timer survive a refresh, a backgrounded tab (where browsers throttle
 * intervals), and a laptop coming back from sleep — the elapsed time is read,
 * never accumulated.
 */
const computeRemaining = (target: number): TimeRemaining => {
  const diff = target - Date.now();

  // Clamped at zero so the UI can never render negative values.
  if (Number.isNaN(diff) || diff <= 0) return ZERO;

  return {
    days: Math.floor(diff / MS_DAY),
    hours: Math.floor((diff % MS_DAY) / MS_HOUR),
    minutes: Math.floor((diff % MS_HOUR) / MS_MINUTE),
    seconds: Math.floor((diff % MS_MINUTE) / MS_SECOND),
    isComplete: false,
  };
};

/**
 * Ticks once per second toward `targetDate`, then stops.
 *
 * @param targetDate ISO 8601 string (include the UTC offset) or a Date.
 */
export const useCountdown = (targetDate: string | Date): TimeRemaining => {
  const targetTime =
    targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();

  const [remaining, setRemaining] = useState<TimeRemaining>(() => computeRemaining(targetTime));
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Recompute immediately so a changed target is reflected without a 1s delay.
    const initial = computeRemaining(targetTime);
    setRemaining(initial);

    if (initial.isComplete) return;

    intervalRef.current = window.setInterval(() => {
      const next = computeRemaining(targetTime);
      setRemaining(next);

      // Stop the interval once the target passes — no wasted ticks, and no
      // chance of drifting into negative territory.
      if (next.isComplete && intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetTime]);

  return remaining;
};
