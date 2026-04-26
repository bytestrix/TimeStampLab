/**
 * Formatting utilities
 */

import { toMs } from './convert';
import type { TimestampInput, FormattedTimestamp } from './types';

/**
 * Calculates relative time from now
 * @param input - Timestamp input
 * @param from - Reference timestamp (defaults to now)
 * @returns Human-readable relative time string
 * 
 * @example
 * relTime(Date.now() - 3600000) // "1 hour ago"
 * relTime(Date.now() + 86400000) // "in 1 day"
 */
export function relTime(input: TimestampInput, from?: TimestampInput): string {
  const ms = toMs(input);
  if (ms === null) return 'Invalid date';

  const fromMs = from ? toMs(from) : Date.now();
  if (fromMs === null) return 'Invalid date';

  const diff = fromMs - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;

  const fmt = (n: number, unit: string) => `${n} ${unit}${n !== 1 ? 's' : ''}`;

  if (abs < 5000) return 'just now';
  if (abs < 60000) {
    const s = Math.round(abs / 1000);
    return future ? `in ${fmt(s, 'second')}` : `${fmt(s, 'second')} ago`;
  }
  if (abs < 3600000) {
    const m = Math.round(abs / 60000);
    return future ? `in ${fmt(m, 'minute')}` : `${fmt(m, 'minute')} ago`;
  }
  if (abs < 86400000) {
    const h = Math.round(abs / 3600000);
    return future ? `in ${fmt(h, 'hour')}` : `${fmt(h, 'hour')} ago`;
  }
  if (abs < 2592000000) {
    const d = Math.round(abs / 86400000);
    return future ? `in ${fmt(d, 'day')}` : `${fmt(d, 'day')} ago`;
  }
  if (abs < 31536000000) {
    const mo = Math.round(abs / 2592000000);
    return future ? `in ${fmt(mo, 'month')}` : `${fmt(mo, 'month')} ago`;
  }
  const yr = Math.round(abs / 31536000000);
  return future ? `in ${fmt(yr, 'year')}` : `${fmt(yr, 'year')} ago`;
}

/**
 * Formats timestamp to all common formats
 * @param input - Timestamp input
 * @returns Object with all formatted versions
 * 
 * @example
 * fmtAll(1777187459000)
 * // {
 * //   iso: '2026-04-26T07:21:15.000Z',
 * //   utc: 'Sun, 26 Apr 2026 07:21:15 GMT',
 * //   local: 'April 26, 2026 at 12:51:15 PM',
 * //   relative: '2 hours ago',
 * //   unix_s: '1777187459',
 * //   unix_ms: '1777187459000'
 * // }
 */
export function fmtAll(input: TimestampInput): FormattedTimestamp | null {
  const ms = toMs(input);
  if (ms === null) return null;

  const date = new Date(ms);
  
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(undefined, { 
      dateStyle: 'long', 
      timeStyle: 'medium' 
    }),
    relative: relTime(ms),
    unix_s: String(Math.floor(ms / 1000)),
    unix_ms: String(ms),
  };
}

/**
 * Formats timestamp to ISO 8601 string
 * @param input - Timestamp input
 * @returns ISO 8601 formatted string
 */
export function toISO(input: TimestampInput): string | null {
  const ms = toMs(input);
  if (ms === null) return null;
  return new Date(ms).toISOString();
}

/**
 * Formats timestamp to UTC string
 * @param input - Timestamp input
 * @returns UTC formatted string
 */
export function toUTC(input: TimestampInput): string | null {
  const ms = toMs(input);
  if (ms === null) return null;
  return new Date(ms).toUTCString();
}

/**
 * Formats timestamp to localized string
 * @param input - Timestamp input
 * @param locale - Locale string (defaults to user's locale)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Localized formatted string
 */
export function toLocal(
  input: TimestampInput,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string | null {
  const ms = toMs(input);
  if (ms === null) return null;
  return new Date(ms).toLocaleString(locale, options);
}
