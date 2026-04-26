import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { WORLD_FEATURES, type CountryFeature } from './countryData';
import { MAP_CITIES, MULTI_TZ_COUNTRIES, type CityOption } from './cities';
import { coordsToPath, unproject, pointInGeometry, getBBox, project } from './mapUtils';

interface Props {
  onCountryClick: (country: CountryFeature, cities: CityOption[]) => void;
  onCityClick: (city: CityOption) => void;
  selectedTz?: string;
  userCountry?: string;
}

const BBOXES = WORLD_FEATURES.map(f => getBBox(f.geometry));

function findCountry(lng: number, lat: number): CountryFeature | null {
  const candidates: number[] = [];
  for (let i = 0; i < WORLD_FEATURES.length; i++) {
    const [minLng, minLat, maxLng, maxLat] = BBOXES[i];
    if (lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat) candidates.push(i);
  }
  for (const i of candidates) {
    if (pointInGeometry(lng, lat, WORLD_FEATURES[i].geometry)) return WORLD_FEATURES[i];
  }
  return null;
}

function getLocalTime(tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date());
  } catch { return ''; }
}

function getOffsetStr(tz: string): string {
  try {
    const parts = Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date());
    return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

export default function WorldMap({ onCountryClick, onCityClick, selectedTz, userCountry }: Props) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryFeature | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityOption | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(Date.now());
  const svgRef = useRef<SVGSVGElement>(null);

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
    return unproject(
      (e.clientX - rect.left) * (800 / rect.width),
      (e.clientY - rect.top) * (400 / rect.height)
    );
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoords(e);
    if (!coords) return;
    setHoveredCountry(findCountry(coords[0], coords[1]));
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, [getSVGCoords]);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSVGCoords(e);
    if (!coords) return;
    const country = findCountry(coords[0], coords[1]);
    if (!country) return;
    const multiCities = MULTI_TZ_COUNTRIES[country.name] ?? [];
    onCountryClick(country, multiCities);
  }, [getSVGCoords, onCountryClick]);

  const tooltipData = hoveredCity
    ? { name: hoveredCity.name, tz: hoveredCity.tz, flag: hoveredCity.flag, country: hoveredCity.country }
    : hoveredCountry
    ? { name: hoveredCountry.name, tz: hoveredCountry.tz, flag: hoveredCountry.flag, country: hoveredCountry.name }
    : null;

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
          cursor: hoveredCountry ? 'pointer' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoveredCountry(null); setHoveredCity(null); }}
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
        {paths.map(({ name, tz, d }) => {
          const isUser = name === userCountry;
          const isActive = selectedTz === tz;
          const isHovered = hoveredCountry?.name === name;
          let fill = 'var(--map-land)';
          if (isActive) fill = 'var(--accent)';
          else if (isUser) fill = 'var(--map-user)';
          else if (isHovered) fill = 'var(--map-hover)';
          return (
            <path key={`${name}-${tz}`} d={d} fill={fill}
              stroke="var(--map-border)" strokeWidth="0.4"
              style={{ transition: 'fill 0.1s' }}
            />
          );
        })}

        {/* City dots */}
        {MAP_CITIES.map(city => {
          const [cx, cy] = project(city.lng, city.lat);
          const isActive = selectedTz === city.tz;
          return (
            <circle
              key={city.name}
              cx={cx} cy={cy}
              r={isActive ? 4.5 : 3}
              fill={isActive ? 'var(--accent)' : 'var(--map-dot)'}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.8"
              style={{ cursor: 'pointer', transition: 'all 0.1s' }}
              onMouseEnter={e => {
                e.stopPropagation();
                setHoveredCity(city);
                setHoveredCountry(null);
                setTooltipPos({ x: e.clientX, y: e.clientY });
                if (!isActive) e.currentTarget.setAttribute('r', '5');
              }}
              onMouseMove={e => { e.stopPropagation(); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={e => {
                setHoveredCity(null);
                if (!isActive) e.currentTarget.setAttribute('r', '3');
              }}
              onClick={e => { e.stopPropagation(); onCityClick(city); }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <div
          key={`${tooltipData.name}-${tick}`}
          style={{
            position: 'fixed',
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r)',
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            {tooltipData.flag && <span style={{ fontSize: '18px' }}>{tooltipData.flag}</span>}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>{tooltipData.name}</div>
              {tooltipData.country && tooltipData.country !== tooltipData.name && (
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{tooltipData.country}</div>
              )}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 600, color: 'var(--accent)' }}>
            {getLocalTime(tooltipData.tz)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
            {getOffsetStr(tooltipData.tz)} · click to add
          </div>
        </div>
      )}
    </div>
  );
}
