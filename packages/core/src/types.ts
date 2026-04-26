/**
 * Core types for TimestampLab
 */

export type TimestampUnit = 's' | 'ms';

export interface TimestampInfo {
  unit: TimestampUnit;
  epochMs: number;
  epochS: number;
}

export interface FormattedTimestamp {
  iso: string;
  utc: string;
  local: string;
  relative: string;
  unix_s: string;
  unix_ms: string;
}

export interface TimestampDiff {
  ms: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  totalMs: number;
}

export interface BatchResult {
  input: string;
  success: boolean;
  timestamp?: TimestampInfo;
  formatted?: FormattedTimestamp;
  error?: string;
}

export type TimestampInput = string | number | Date;
