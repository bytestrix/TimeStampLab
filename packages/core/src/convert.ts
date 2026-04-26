/**
 * Conversion utilities
 */

import { detectAndNormalise } from './detect';
import type { TimestampInput } from './types';

/**
 * Converts any timestamp input to milliseconds
 * Auto-detects seconds vs milliseconds for numbers
 * 
 * @param input - Timestamp as number, string, or Date
 * @returns Milliseconds since epoch, or null if invalid
 * 
 * @example
 * toMs(1777187459) // 1777187459000 (auto-detected seconds)
 * toMs(1777187459000) // 1777187459000 (auto-detected milliseconds)
 * toMs('2024-01-01') // 1704067200000 (parsed ISO date)
 * toMs(new Date()) // current timestamp in ms
 */
export function toMs(input: TimestampInput): number | null {
  // Handle Date objects
  if (input instanceof Date) {
    const ms = input.getTime();
    return isNaN(ms) ? null : ms;
  }

  // Handle string inputs
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Try parsing as ISO date or date string
    if (trimmed.includes('-') || trimmed.includes('T') || trimmed.includes('/')) {
      const date = new Date(trimmed);
      const ms = date.getTime();
      return isNaN(ms) ? null : ms;
    }

    // Try parsing as number
    const num = parseFloat(trimmed);
    if (isNaN(num)) return null;
    
    const { epochMs } = detectAndNormalise(num);
    return epochMs;
  }

  // Handle number inputs
  if (typeof input === 'number') {
    if (isNaN(input) || !isFinite(input)) return null;
    const { epochMs } = detectAndNormalise(input);
    return epochMs;
  }

  return null;
}

/**
 * Converts any timestamp input to seconds
 * Auto-detects seconds vs milliseconds for numbers
 * 
 * @param input - Timestamp as number, string, or Date
 * @returns Seconds since epoch, or null if invalid
 * 
 * @example
 * toSeconds(1777187459) // 1777187459 (auto-detected seconds)
 * toSeconds(1777187459000) // 1777187459 (auto-detected milliseconds, converted)
 * toSeconds('2024-01-01') // 1704067200 (parsed ISO date)
 */
export function toSeconds(input: TimestampInput): number | null {
  const ms = toMs(input);
  return ms !== null ? Math.floor(ms / 1000) : null;
}

/**
 * Converts milliseconds to seconds
 * @param ms - Milliseconds
 * @returns Seconds (floored)
 */
export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

/**
 * Converts seconds to milliseconds
 * @param seconds - Seconds
 * @returns Milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}
