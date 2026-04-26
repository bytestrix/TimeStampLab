import { describe, it, expect } from 'vitest';
import { relTime, fmtAll, toISO, toUTC, toLocal } from './format';

describe('relTime', () => {
  const now = 1777187459000;

  it('shows "just now" for very recent times', () => {
    expect(relTime(now, now)).toBe('just now');
    expect(relTime(now - 4000, now)).toBe('just now');
  });

  it('shows seconds ago', () => {
    expect(relTime(now - 30000, now)).toBe('30 seconds ago');
    expect(relTime(now - 5000, now)).toBe('5 seconds ago');
  });

  it('shows minutes ago', () => {
    expect(relTime(now - 60000, now)).toBe('1 minute ago');
    expect(relTime(now - 120000, now)).toBe('2 minutes ago');
  });

  it('shows hours ago', () => {
    expect(relTime(now - 3600000, now)).toBe('1 hour ago');
    expect(relTime(now - 7200000, now)).toBe('2 hours ago');
  });

  it('shows days ago', () => {
    expect(relTime(now - 86400000, now)).toBe('1 day ago');
    expect(relTime(now - 172800000, now)).toBe('2 days ago');
  });

  it('shows future times', () => {
    expect(relTime(now + 60000, now)).toBe('in 1 minute');
    expect(relTime(now + 3600000, now)).toBe('in 1 hour');
    expect(relTime(now + 86400000, now)).toBe('in 1 day');
  });

  it('handles invalid inputs', () => {
    expect(relTime('invalid')).toBe('Invalid date');
  });
});

describe('fmtAll', () => {
  it('formats timestamp to all formats', () => {
    const result = fmtAll(1777187459000);
    expect(result).toBeTruthy();
    expect(result?.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(result?.unix_s).toBe('1777187459');
    expect(result?.unix_ms).toBe('1777187459000');
  });

  it('returns null for invalid inputs', () => {
    expect(fmtAll('invalid')).toBe(null);
  });
});

describe('toISO', () => {
  it('formats to ISO 8601', () => {
    const result = toISO(1777187459000);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('returns null for invalid inputs', () => {
    expect(toISO('invalid')).toBe(null);
  });
});

describe('toUTC', () => {
  it('formats to UTC string', () => {
    const result = toUTC(1777187459000);
    expect(result).toContain('GMT');
  });

  it('returns null for invalid inputs', () => {
    expect(toUTC('invalid')).toBe(null);
  });
});

describe('toLocal', () => {
  it('formats to local string', () => {
    const result = toLocal(1777187459000);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('returns null for invalid inputs', () => {
    expect(toLocal('invalid')).toBe(null);
  });
});
