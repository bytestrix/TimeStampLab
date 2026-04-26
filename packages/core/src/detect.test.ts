import { describe, it, expect } from 'vitest';
import { detectUnit, detectAndNormalise, isValidTimestamp } from './detect';

describe('detectUnit', () => {
  it('detects seconds for timestamps < 2e12', () => {
    expect(detectUnit(1777187459)).toBe('s');
    expect(detectUnit(1000000000)).toBe('s');
  });

  it('detects milliseconds for timestamps > 2e12', () => {
    expect(detectUnit(1777187459000)).toBe('ms');
    expect(detectUnit(2000000000000)).toBe('ms');
  });

  it('handles negative timestamps', () => {
    expect(detectUnit(-1000000000)).toBe('s');
    expect(detectUnit(-2000000000000)).toBe('ms');
  });
});

describe('detectAndNormalise', () => {
  it('normalizes seconds to both formats', () => {
    const result = detectAndNormalise(1777187459);
    expect(result.unit).toBe('s');
    expect(result.epochS).toBe(1777187459);
    expect(result.epochMs).toBe(1777187459000);
  });

  it('normalizes milliseconds to both formats', () => {
    const result = detectAndNormalise(1777187459000);
    expect(result.unit).toBe('ms');
    expect(result.epochS).toBe(1777187459);
    expect(result.epochMs).toBe(1777187459000);
  });

  it('handles decimal milliseconds', () => {
    const result = detectAndNormalise(1777187459123.456);
    expect(result.unit).toBe('ms');
    expect(result.epochMs).toBe(1777187459123.456);
    expect(result.epochS).toBe(1777187459);
  });
});

describe('isValidTimestamp', () => {
  it('validates correct timestamps', () => {
    expect(isValidTimestamp(1777187459)).toBe(true);
    expect(isValidTimestamp(1777187459000)).toBe(true);
  });

  it('rejects non-numeric values', () => {
    expect(isValidTimestamp('not a number')).toBe(false);
    expect(isValidTimestamp(null)).toBe(false);
    expect(isValidTimestamp(undefined)).toBe(false);
  });

  it('rejects invalid numbers', () => {
    expect(isValidTimestamp(NaN)).toBe(false);
    expect(isValidTimestamp(Infinity)).toBe(false);
  });

  it('rejects timestamps outside 1970-2100 range', () => {
    expect(isValidTimestamp(0)).toBe(true); // 1970
    expect(isValidTimestamp(-1000000000)).toBe(false); // before 1970
    expect(isValidTimestamp(5000000000000)).toBe(false); // after 2100
  });
});
