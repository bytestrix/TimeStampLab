/**
 * Auto-detection utilities
 */

import type { TimestampUnit, TimestampInfo } from './types';

/**
 * Detects if a timestamp is in seconds or milliseconds
 * @param value - Numeric timestamp
 * @returns 's' for seconds, 'ms' for milliseconds
 * 
 * @example
 * detectUnit(1777187459) // 's'
 * detectUnit(1777187459000) // 'ms'
 */
export function detectUnit(value: number): TimestampUnit {
  const abs = Math.abs(value);
  // Timestamps > 10 billion are milliseconds (year 2286 in seconds, year 1970 in ms)
  // This works because: 10^10 seconds = year 2286, 10^10 ms = 1970
  return abs > 1e10 ? 'ms' : 's';
}

/**
 * Normalizes a timestamp to milliseconds with auto-detection
 * @param value - Timestamp in seconds or milliseconds
 * @returns Object with unit and epoch in both formats
 * 
 * @example
 * detectAndNormalise(1777187459) // { unit: 's', epochMs: 1777187459000, epochS: 1777187459 }
 * detectAndNormalise(1777187459000) // { unit: 'ms', epochMs: 1777187459000, epochS: 1777187459 }
 */
export function detectAndNormalise(value: number): TimestampInfo {
  const unit = detectUnit(value);
  const epochMs = unit === 'ms' ? value : value * 1000;
  const epochS = unit === 's' ? value : Math.floor(value / 1000);
  
  return { unit, epochMs, epochS };
}

/**
 * Checks if a value is a valid timestamp
 * @param value - Value to check
 * @returns true if valid timestamp
 * 
 * @example
 * isValidTimestamp(1777187459) // true
 * isValidTimestamp('not a timestamp') // false
 */
export function isValidTimestamp(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  if (isNaN(value) || !isFinite(value)) return false;
  
  // Check if it's a reasonable timestamp (between 1970 and 2100)
  const info = detectAndNormalise(value);
  const year = new Date(info.epochMs).getFullYear();
  return year >= 1970 && year <= 2100;
}
