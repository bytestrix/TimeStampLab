# @timestamplab/cli

Command-line tools for timestamp operations.

```bash
npm install -g @timestamplab/cli
```

## Usage

```bash
# Convert timestamp
tsl convert 1777187459

# Get current time
tsl now

# Calculate difference
tsl diff 1777187459 1777273859

# Batch convert
tsl batch timestamps.txt --csv output.csv

# Time calculator
tsl calc 1777187459 +1d      # Add 1 day
tsl calc 1777187459 -2h30m   # Subtract 2 hours 30 minutes
```

See [main README](../../README.md) for full documentation.

## License

MIT © TimestampLab
