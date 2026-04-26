import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { WORLD_FEATURES, type CountryFeature } from '../data/worldMap';
import { coordsToPath, unproject, pointInGeometry, getBBox } from '../utils/mapUtils';

interface Props {
  onSelect: (country: CountryFeature) => void;
  selectedTz?: string;
  userCountry?: string; // name of user's country to highlight
}

// Pre-compute bounding boxes once
const BBOXES = WORLD_FEATURES.map(f => getBBox(f.geometry));

function findCountry(lng: number, lat: number): CountryFeature | null {
  const candidates: number[] = [];
  for (let i = 0; i < WORLD_FEATURES.length; i++) {
    const [minLng, minLat, maxLng, maxLat] = BBOXES[i];
    if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) {
      candidates.push(i);
    }
  }
  for (const i of candidates) {
    if (pointInGeometry(lng, lat, WORLD_FEATURES[i].geometry)) {
      return WORLD_FEATURES[i];
    }
  }
  return null;
}

function getLocalTime(tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date());
  } catch { return ''; }
}

function getOffsetStr(tz: string): string {
  try {
    const parts = Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset'
    }).formatToParts(new Date());
    return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

export default function WorldMap({ onSelect, selectedTz, userCountry }: Props) {
  const [hovered, setHovered] = useState<CountryFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tick, setTick] = useState(Date.now());
  const svgRef = useRef<SVGSVGElement>(null);

  // Tick every second for live time in tooltip
  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const paths = useMemo(() =>
    WORLD_FEATURES.map(f => ({
      ...f,
      d: coordsToPath(
        f.geometry.type === 'Polygon'
          ? (f.geometry.coordinates as number[][][])
          : (f.geometry.coordinates as number[][][][]).flat()
      )
    })), []);

  const getSVGCoords = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (800 / rect.width);
    const svgY = (e.clientY - rect.top) * (400 / rect.height);
    return unproject(svgX, svgY);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoords(e);
    if (!coords) return;
    const country = findCountry(coords[0], coords[1]);
    setHovered(country);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, [getSVGCoords]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoords(e);
    if (!coords) return;
    const country = findCountry(coords[0], coords[1]);
    if (country) onSelect(country);
  }, [getSVGCoords, onSelect]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        width="100%"
        style={{
          display: 'block',
          background: 'var(--map-ocean)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border)',
          cursor: hovered ? 'pointer' : 'crosshair',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={handleClick}
      >
        {/* Graticule */}
        <g stroke="var(--border)" strokeWidth="0.3" opacity="0.4">
          {[-60, -30, 0, 30, 60].map(lat => (
            <line key={lat} x1="0" y1={(90 - lat) * (400 / 180)} x2="800" y2={(90 - lat) * (400 / 180)} />
          ))}
          {[-120, -60, 0, 60, 120].map(lng => (
            <line key={lng} x1={(lng + 180) * (800 / 360)} y1="0" x2={(lng + 180) * (800 / 360)} y2="400" />
          ))}
        </g>

        {/* Countries */}
        {paths.map(({ tz, name, d }) => {
          const isUserCountry = name === userCountry;
          const isSelected = selectedTz === tz;
          const isHovered = hovered?.name === name;

          let fill = 'var(--map-land)';
          if (isSelected) fill = 'var(--accent)';
          else if (isUserCountry) fill = 'var(--map-user)';
          else if (isHovered) fill = 'var(--map-hover)';

          return (
            <path
              key={`${name}-${tz}`}
              d={d}
              fill={fill}
              stroke="var(--map-border)"
              strokeWidth="0.4"
              style={{ transition: 'fill 0.1s' }}
            />
          );
        })}
      </svg>

      {/* Tooltip with live time */}
      {hovered && (
        <div
          key={tick} // re-render on tick
          style={{
            position: 'fixed',
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            padding: '8px 12px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
            minWidth: '160px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <span style={{ fontSize: '18px' }}>{hovered.flag}</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>{hovered.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-3)' }}>
                {hovered.tz}
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 600,
            color: 'var(--accent)', letterSpacing: '-0.02em',
          }}>
            {getLocalTime(hovered.tz)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
            {getOffsetStr(hovered.tz)} · click to add
          </div>
        </div>
      )}
    </div>
  );
}
