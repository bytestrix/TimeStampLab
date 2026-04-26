/**
 * Timestamp difference utilities
 */

import { toMs } from './convert';
import type { TimestampInput, TimestampDiff } from './types';

/**
 * Calculates the difference between two timestamps
 * @param t1 - First timestamp
 * @param t2 - Second timestamp
 * @returns Object with difference in various units
 * 
 * @example
 * diffTimestamps(1777187459000, 1777273859000)
 * // {
 * //   ms: 86400000,
 * //   seconds: 86400,
 * //   minutes: 1440,
 * //   hours: 24,
 * //   days: 1,
 * //   totalMs: 86400000,
 * //   totalSeconds: 86400,
 * //   totalMinutes: 1440,
 * //   totalHours: 24,
 * //   totalDays: 1
 * // }
 */
export function diffTimestamps(t1: TimestampInput, t2: TimestampInput): TimestampDiff | null {
  const ms1 = toMs(t1);
  const ms2 = toMs(t2);
  
  if (ms1 === null || ms2 === null) return null;
  
  const diffMs = Math.abs(ms2 - ms1);
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  // Breakdown into components
  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const ms = diffMs % 1000;
  
  return {
    ms,
    seconds,
    minutes,
    hours,
    days,
    totalMs: diffMs,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
  };
}

/**
 * Formats a timestamp difference as a human-readable string
 * @param diff - TimestampDiff object
 * @param compact - Use compact format (e.g., "1d 2h" vs "1 day 2 hours")
 * @returns Formatted string
 * 
 * @example
 * formatDiff({ days: 1, hours: 2, minutes: 30, seconds: 15 })
 * // "1d 2h 30m 15s"
 */
export function formatDiff(diff: TimestampDiff, compact = true): string {
  const parts: string[] = [];
  
  if (diff.days > 0) {
    parts.push(compact ? `${diff.days}d` : `${diff.days} day${diff.days !== 1 ? 's' : ''}`);
  }
  if (diff.hours > 0) {
    parts.push(compact ? `${diff.hours}h` : `${diff.hours} hour${diff.hours !== 1 ? 's' : ''}`);
  }
  if (diff.minutes > 0) {
    parts.push(compact ? `${diff.minutes}m` : `${diff.minutes} minute${diff.minutes !== 1 ? 's' : ''}`);
  }
  if (diff.seconds > 0 || parts.length === 0) {
    parts.push(compact ? `${diff.seconds}s` : `${diff.seconds} second${diff.seconds !== 1 ? 's' : ''}`);
  }
  
  return parts.join(compact ? ' ' : ', ');
}
