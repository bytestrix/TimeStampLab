# @timestamplab/map

Interactive world map for timezone visualization.

```bash
npm install @timestamplab/map @timestamplab/core
```

## Usage

```tsx
import { TimezoneMap, TimezoneInfo } from '@timestamplab/map';

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <TimezoneMap
        onSelect={(timezone, coords) => setSelected({ timezone, coords })}
      />
      
      {selected && (
        <TimezoneInfo 
          timezone={selected.timezone}
          coords={selected.coords}
        />
      )}
    </>
  );
}
```

See [main README](../../README.md) for full documentation.

## License

MIT © TimestampLab
