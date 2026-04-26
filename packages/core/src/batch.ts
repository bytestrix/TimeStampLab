/**
 * Batch processing utilities
 */

import { toMs } from './convert';
import { detectAndNormalise, isValidTimestamp } from './detect';
import { fmtAll } from './format';
import type { TimestampInput, BatchResult } from './types';

/**
 * Processes multiple timestamps at once
 * @param inputs - Array of timestamp inputs
 * @returns Array of batch results with success/error info
 * 
 * @example
 * batchProcess(['1777187459', '1777273859', 'invalid'])
 * // [
 * //   { input: '1777187459', success: true, timestamp: {...}, formatted: {...} },
 * //   { input: '1777273859', success: true, timestamp: {...}, formatted: {...} },
 * //   { input: 'invalid', success: false, error: 'Invalid timestamp' }
 * // ]
 */
export function batchProcess(inputs: TimestampInput[]): BatchResult[] {
  return inputs.map(input => {
    try {
      const inputStr = String(input);
      
      // Try to convert to milliseconds
      const ms = toMs(input);
      if (ms === null) {
        return {
          input: inputStr,
          success: false,
          error: 'Invalid timestamp',
        };
      }
      
      // Validate the timestamp
      if (!isValidTimestamp(ms)) {
        return {
          input: inputStr,
          success: false,
          error: 'Timestamp out of valid range',
        };
      }
      
      // Get timestamp info and formatting
      const timestamp = detectAndNormalise(ms);
      const formatted = fmtAll(ms);
      
      if (!formatted) {
        return {
          input: inputStr,
          success: false,
          error: 'Failed to format timestamp',
        };
      }
      
      return {
        input: inputStr,
        success: true,
        timestamp,
        formatted,
      };
    } catch (error) {
      return {
        input: String(input),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}

/**
 * Exports batch results to CSV format
 * @param results - Array of batch results
 * @returns CSV string
 * 
 * @example
 * const results = batchProcess(['1777187459', '1777273859']);
 * exportToCSV(results);
 * // "Input,Unit,ISO 8601,UTC,Local,Unix (s),Unix (ms)\n..."
 */
export function exportToCSV(results: BatchResult[]): string {
  const headers = ['Input', 'Unit', 'ISO 8601', 'UTC', 'Local', 'Unix (s)', 'Unix (ms)'];
  const rows = [headers.join(',')];
  
  for (const result of results) {
    if (result.success && result.timestamp && result.formatted) {
      const row = [
        `"${result.input}"`,
        result.timestamp.unit,
        `"${result.formatted.iso}"`,
        `"${result.formatted.utc}"`,
        `"${result.formatted.local}"`,
        result.formatted.unix_s,
        result.formatted.unix_ms,
      ];
      rows.push(row.join(','));
    }
  }
  
  return rows.join('\n');
}

/**
 * Parses timestamps from text (one per line)
 * @param text - Multi-line text with timestamps
 * @returns Array of parsed timestamps
 * 
 * @example
 * parseFromText("1777187459\n1777273859\n1777360259")
 * // ['1777187459', '1777273859', '1777360259']
 */
export function parseFromText(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}
