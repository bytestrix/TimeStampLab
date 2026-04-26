import { describe, it, expect } from 'vitest';
import { diffTimestamps, formatDiff } from './diff';

describe('diffTimestamps', () => {
  it('calculates difference between two timestamps', () => {
    const t1 = 1777187459000;
    const t2 = 1777273859000; // +1 day
    const diff = diffTimestamps(t1, t2);
    
    expect(diff).toBeTruthy();
    expect(diff?.days).toBe(1);
    expect(diff?.hours).toBe(0);
    expect(diff?.totalDays).toBe(1);
    expect(diff?.totalHours).toBe(24);
  });

  it('handles timestamps in seconds', () => {
    const diff = diffTimestamps(1777187459, 1777273859);
    expect(diff?.days).toBe(1);
  });

  it('calculates absolute difference', () => {
    const diff1 = diffTimestamps(1000, 2000);
    const diff2 = diffTimestamps(2000, 1000);
    expect(diff1?.totalMs).toBe(diff2?.totalMs);
  });

  it('handles complex differences', () => {
    const t1 = 1777187459000;
    const t2 = t1 + (2 * 86400000) + (3 * 3600000) + (15 * 60000) + 30000; // +2d 3h 15m 30s
    const diff = diffTimestamps(t1, t2);
    
    expect(diff?.days).toBe(2);
    expect(diff?.hours).toBe(3);
    expect(diff?.minutes).toBe(15);
    expect(diff?.seconds).toBe(30);
  });

  it('returns null for invalid inputs', () => {
    expect(diffTimestamps('invalid', 1777187459000)).toBe(null);
    expect(diffTimestamps(1777187459000, 'invalid')).toBe(null);
  });
});

describe('formatDiff', () => {
  it('formats compact difference', () => {
    const diff = {
      ms: 0,
      seconds: 15,
      minutes: 30,
      hours: 2,
      days: 1,
      totalMs: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
    expect(formatDiff(diff)).toBe('1d 2h 30m 15s');
  });

  it('formats verbose difference', () => {
    const diff = {
      ms: 0,
      seconds: 1,
      minutes: 1,
      hours: 1,
      days: 1,
      totalMs: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
    expect(formatDiff(diff, false)).toBe('1 day, 1 hour, 1 minute, 1 second');
  });

  it('handles zero values', () => {
    const diff = {
      ms: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      totalMs: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
    expect(formatDiff(diff)).toBe('0s');
  });

  it('skips zero components', () => {
    const diff = {
      ms: 0,
      seconds: 30,
      minutes: 0,
      hours: 2,
      days: 0,
      totalMs: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      totalHours: 0,
      totalDays: 0,
    };
    expect(formatDiff(diff)).toBe('2h 30s');
  });
});
