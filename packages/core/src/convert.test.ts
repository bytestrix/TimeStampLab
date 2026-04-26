import { describe, it, expect } from 'vitest';
import { toMs, toSeconds, msToSeconds, secondsToMs } from './convert';

describe('toMs', () => {
  it('converts seconds to milliseconds', () => {
    expect(toMs(1777187459)).toBe(1777187459000);
  });

  it('keeps milliseconds as-is', () => {
    expect(toMs(1777187459000)).toBe(1777187459000);
  });

  it('handles decimal timestamps', () => {
    expect(toMs(1777187459.664)).toBe(1777187459664);
  });

  it('parses ISO date strings', () => {
    const result = toMs('2026-04-26T07:21:15.000Z');
    expect(result).toBe(1777387275000);
  });

  it('handles Date objects', () => {
    const date = new Date('2026-04-26T07:21:15.000Z');
    expect(toMs(date)).toBe(date.getTime());
  });

  it('returns null for invalid inputs', () => {
    expect(toMs('invalid')).toBe(null);
    expect(toMs(NaN)).toBe(null);
    expect(toMs(Infinity)).toBe(null);
  });

  it('handles string numbers', () => {
    expect(toMs('1777187459')).toBe(1777187459000);
    expect(toMs('1777187459000')).toBe(1777187459000);
  });
});

describe('toSeconds', () => {
  it('converts milliseconds to seconds', () => {
    expect(toSeconds(1777187459000)).toBe(1777187459);
  });

  it('keeps seconds as-is', () => {
    expect(toSeconds(1777187459)).toBe(1777187459);
  });

  it('floors decimal results', () => {
    expect(toSeconds(1777187459999)).toBe(1777187459);
  });

  it('returns null for invalid inputs', () => {
    expect(toSeconds('invalid')).toBe(null);
  });
});

describe('msToSeconds', () => {
  it('converts milliseconds to seconds', () => {
    expect(msToSeconds(1000)).toBe(1);
    expect(msToSeconds(1500)).toBe(1);
    expect(msToSeconds(1999)).toBe(1);
  });
});

describe('secondsToMs', () => {
  it('converts seconds to milliseconds', () => {
    expect(secondsToMs(1)).toBe(1000);
    expect(secondsToMs(1.5)).toBe(1500);
  });
});
