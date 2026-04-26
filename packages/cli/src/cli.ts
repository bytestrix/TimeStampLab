#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import {
  toMs,
  fmtAll,
  diffTimestamps,
  formatDiff,
  batchProcess,
  exportToCSV,
  parseFromText,
  type BatchResult,
} from 'timestamplab-core';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

const program = new Command();

program
  .name('tsl')
  .description('TimestampLab CLI - Timestamp utilities with auto-detection')
  .version('0.1.0');

// Convert command
program
  .command('convert <timestamp>')
  .description('Convert a timestamp to various formats')
  .option('-f, --format <format>', 'Output format (iso, utc, local, relative, all)', 'all')
  .option('-s, --seconds', 'Force interpret as seconds')
  .option('-m, --milliseconds', 'Force interpret as milliseconds')
  .action((timestamp, options) => {
    const ms = toMs(timestamp);
    if (ms === null) {
      console.error(chalk.red('Error: Invalid timestamp'));
      process.exit(1);
    }

    const formatted = fmtAll(ms);
    if (!formatted) {
      console.error(chalk.red('Error: Failed to format timestamp'));
      process.exit(1);
    }

    if (options.format === 'all') {
      console.log(chalk.bold('Timestamp Conversion:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.cyan('ISO 8601:  ') + formatted.iso);
      console.log(chalk.cyan('UTC:       ') + formatted.utc);
      console.log(chalk.cyan('Local:     ') + formatted.local);
      console.log(chalk.cyan('Relative:  ') + formatted.relative);
      console.log(chalk.cyan('Unix (s):  ') + formatted.unix_s);
      console.log(chalk.cyan('Unix (ms): ') + formatted.unix_ms);
    } else {
      const key = options.format as keyof typeof formatted;
      console.log(formatted[key] || formatted.iso);
    }
  });

// Now command
program
  .command('now')
  .description('Get the current timestamp')
  .option('-s, --seconds', 'Output in seconds')
  .option('-f, --format <format>', 'Output format (iso, utc, local, unix)')
  .action((options) => {
    const now = Date.now();

    if (options.format) {
      const formatted = fmtAll(now);
      if (formatted) {
        const key = options.format as keyof typeof formatted;
        console.log(formatted[key] || formatted.iso);
      }
    } else if (options.seconds) {
      console.log(Math.floor(now / 1000));
    } else {
      console.log(now);
    }
  });

// Diff command
program
  .command('diff <timestamp1> <timestamp2>')
  .description('Calculate the difference between two timestamps')
  .option('-u, --unit <unit>', 'Display unit (ms, s, m, h, d)')
  .option('-c, --compact', 'Compact output format')
  .action((timestamp1, timestamp2, options) => {
    const diff = diffTimestamps(timestamp1, timestamp2);
    if (!diff) {
      console.error(chalk.red('Error: Invalid timestamps'));
      process.exit(1);
    }

    if (options.unit) {
      const unitMap = {
        ms: diff.totalMs,
        s: diff.totalSeconds,
        m: diff.totalMinutes,
        h: diff.totalHours,
        d: diff.totalDays,
      };
      console.log(unitMap[options.unit as keyof typeof unitMap] || diff.totalMs);
    } else {
      console.log(chalk.bold('Time Difference:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.cyan('Formatted: ') + formatDiff(diff, options.compact));
      console.log(chalk.cyan('Days:      ') + diff.totalDays);
      console.log(chalk.cyan('Hours:     ') + diff.totalHours);
      console.log(chalk.cyan('Minutes:   ') + diff.totalMinutes);
      console.log(chalk.cyan('Seconds:   ') + diff.totalSeconds);
    }
  });

// Batch command
program
  .command('batch [file]')
  .description('Process multiple timestamps from a file or stdin')
  .option('-c, --csv <output>', 'Export to CSV file')
  .option('--stdin', 'Read from stdin')
  .action((file, options) => {
    let text = '';

    if (options.stdin || !file) {
      // Read from stdin (not implemented in this simple version)
      console.error(chalk.red('Error: stdin not yet implemented, please provide a file'));
      process.exit(1);
    } else {
      try {
        text = readFileSync(file, 'utf-8');
      } catch (error) {
        console.error(chalk.red(`Error: Could not read file ${file}`));
        process.exit(1);
      }
    }

    const timestamps = parseFromText(text);
    const results = batchProcess(timestamps);

    const valid = results.filter((r) => r.success).length;
    const invalid = results.filter((r) => !r.success).length;

    console.log(chalk.bold(`Batch Processing Results:`));
    console.log(chalk.green(`✓ ${valid} valid`) + chalk.gray(' | ') + chalk.red(`✗ ${invalid} invalid`));

    if (options.csv) {
      const csv = exportToCSV(results);
      writeFileSync(options.csv, csv);
      console.log(chalk.cyan(`\nExported to: ${options.csv}`));
    } else {
      console.log(chalk.gray('─'.repeat(50)));
      results.forEach((result, i) => {
        if (result.success && result.formatted) {
          console.log(chalk.cyan(`#${i + 1} `) + result.formatted.iso);
        } else {
          console.log(chalk.red(`#${i + 1} `) + result.error);
        }
      });
    }
  });

// Calc command
program
  .command('calc <timestamp> <operation>')
  .description('Perform time calculations (e.g., +1d, -2h30m)')
  .action((timestamp, operation) => {
    const ms = toMs(timestamp);
    if (ms === null) {
      console.error(chalk.red('Error: Invalid timestamp'));
      process.exit(1);
    }

    // Parse operation (e.g., +1d, -2h30m)
    const match = operation.match(/^([+-])(\d+)([smhdw])(\d+)?([smhdw])?$/);
    if (!match) {
      console.error(chalk.red('Error: Invalid operation format'));
      console.error(chalk.gray('Examples: +1d, -2h, +1d12h, -30m'));
      process.exit(1);
    }

    const [, sign, val1, unit1, val2, unit2] = match;
    const multiplier = sign === '+' ? 1 : -1;

    const unitMs: Record<string, number> = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000,
    };

    let delta = parseInt(val1) * unitMs[unit1] * multiplier;
    if (val2 && unit2) {
      delta += parseInt(val2) * unitMs[unit2] * multiplier;
    }

    const result = ms + delta;
    const formatted = fmtAll(result);

    if (formatted) {
      console.log(chalk.bold('Calculation Result:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.cyan('ISO 8601:  ') + formatted.iso);
      console.log(chalk.cyan('Unix (s):  ') + formatted.unix_s);
      console.log(chalk.cyan('Unix (ms): ') + formatted.unix_ms);
    }
  });

program.parse();
