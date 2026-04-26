# @timestamplab/core

Lightweight timestamp utilities with automatic seconds/milliseconds detection. Zero dependencies, ~3KB gzipped.

```bash
npm install @timestamplab/core
```

## Usage

```typescript
import { toMs, fmtAll, diffTimestamps } from '@timestamplab/core';

// Auto-detect and convert
toMs(1777187459);      // → 1777187459000 (detected seconds)
toMs(1777187459000);   // → 1777187459000 (detected milliseconds)

// Format
const formatted = fmtAll(1777187459);
console.log(formatted.iso);       // 2026-04-26T07:21:15.000Z
console.log(formatted.relative);  // 2 hours ago

// Calculate difference
const diff = diffTimestamps(1777187459, 1777273859);
console.log(diff.days);  // 1
```

## API

**Detection**: `detectUnit()`, `detectAndNormalise()`, `isValidTimestamp()`  
**Conversion**: `toMs()`, `toSeconds()`, `msToSeconds()`, `secondsToMs()`  
**Formatting**: `fmtAll()`, `relTime()`, `toISO()`, `toUTC()`, `toLocal()`  
**Difference**: `diffTimestamps()`, `formatDiff()`  
**Batch**: `batchProcess()`, `exportToCSV()`, `parseFromText()`

See [main README](../../README.md) for full documentation.

## License

MIT © TimestampLab
