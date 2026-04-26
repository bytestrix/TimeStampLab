import { describe, it, expect } from 'vitest';
import { batchProcess, exportToCSV, parseFromText } from './batch';

describe('batchProcess', () => {
  it('processes valid timestamps', () => {
    const results = batchProcess([1777187459, 1777273859]);
    
    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(true);
    expect(results[0].timestamp?.epochS).toBe(1777187459);
    expect(results[1].success).toBe(true);
  });

  it('handles mixed valid and invalid inputs', () => {
    const results = batchProcess([1777187459, 'invalid', 1777273859]);
    
    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[1].error).toBeTruthy();
    expect(results[2].success).toBe(true);
  });

  it('handles string timestamps', () => {
    const results = batchProcess(['1777187459', '1777273859']);
    
    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
  });

  it('handles ISO date strings', () => {
    const results = batchProcess(['2026-04-26T07:21:15.000Z']);
    
    expect(results).toHaveLength(1);
    expect(results[0].success).toBe(true);
  });
});

describe('exportToCSV', () => {
  it('exports batch results to CSV', () => {
    const results = batchProcess([1777187459, 1777273859]);
    const csv = exportToCSV(results);
    
    expect(csv).toContain('Input,Unit,ISO 8601,UTC,Local,Unix (s),Unix (ms)');
    expect(csv).toContain('1777187459');
    expect(csv).toContain('1777273859');
  });

  it('handles empty results', () => {
    const csv = exportToCSV([]);
    expect(csv).toBe('Input,Unit,ISO 8601,UTC,Local,Unix (s),Unix (ms)');
  });

  it('skips failed results', () => {
    const results = batchProcess(['invalid']);
    const csv = exportToCSV(results);
    
    const lines = csv.split('\n');
    expect(lines).toHaveLength(1); // Only header
  });
});

describe('parseFromText', () => {
  it('parses timestamps from multi-line text', () => {
    const text = '1777187459\n1777273859\n1777360259';
    const parsed = parseFromText(text);
    
    expect(parsed).toEqual(['1777187459', '1777273859', '1777360259']);
  });

  it('trims whitespace', () => {
    const text = '  1777187459  \n  1777273859  ';
    const parsed = parseFromText(text);
    
    expect(parsed).toEqual(['1777187459', '1777273859']);
  });

  it('filters empty lines', () => {
    const text = '1777187459\n\n1777273859\n\n';
    const parsed = parseFromText(text);
    
    expect(parsed).toEqual(['1777187459', '1777273859']);
  });

  it('handles single line', () => {
    const parsed = parseFromText('1777187459');
    expect(parsed).toEqual(['1777187459']);
  });
});
