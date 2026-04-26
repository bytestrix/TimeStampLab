# @timestamplab/react

React components for timestamp conversion and display.

```bash
npm install @timestamplab/react @timestamplab/core
```

## Usage

```tsx
import { TimestampConverter, WorldClock, TimeCalculator } from '@timestamplab/react';

function App() {
  return (
    <>
      <TimestampConverter 
        initialValue="1777187459"
        onChange={(timestamp) => console.log(timestamp)}
      />
      
      <WorldClock userTimezone="America/New_York" />
      
      <TimeCalculator 
        initialValue="1777187459"
        onChange={(result) => console.log(result)}
      />
    </>
  );
}
```

## Components

- **TimestampConverter** - Smart converter (1 input = convert, 2 = diff, 3+ = batch)
- **WorldClock** - Multi-timezone display with flags
- **TimeCalculator** - Add/subtract time
- **CopyButton** - Copy utility with feedback

See [main README](../../README.md) for full documentation.

## License

MIT © TimestampLab
