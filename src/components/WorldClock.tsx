import { useState, useEffect, useMemo, useCallback } from 'react';
import WorldMap from './WorldMap';
import type { CountryFeature } from '../data/worldMap';
import { MULTI_TZ_COUNTRIES, type CityOption } from '../data/multiTzCountries';
import { X } from 'lucide-react';

const DEFAULT_CITIES = [
  { name: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸', country: 'USA' },
  { name: 'New York', tz: 'America/New_York', flag: '🇺🇸', country: 'USA' },
  { name: 'London', tz: 'Europe/London', flag: '🇬🇧', country: 'UK' },
  { name: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
  { name: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
  { name: 'Bangalore', tz: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
  { name: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
  { name: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
];

interface CityEntry { name: string; tz: string; flag: string; country: string; }

// Map IANA timezone prefix to country name for user country detection
function getCountryFromTimezone(tz: string): string | null {
  const map: Record<string, string> = {
    'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India',
    'America/New_York': 'United States of America', 'America/Chicago': 'United States of America',
    'America/Denver': 'United States of America', 'America/Los_Angeles': 'United States of America',
    'America/Anchorage': 'United States of America', 'Pacific/Honolulu': 'United States of America',
    'Europe/London': 'United Kingdom', 'Europe/Paris': 'France', 'Europe/Berlin': 'Germany',
    'Europe/Moscow': 'Russia', 'Asia/Tokyo': 'Japan', 'Asia/Shanghai': 'China',
    'Asia/Dubai': 'United Arab Emirates', 'Asia/Singapore': 'Singapore',
    'Australia/Sydney': 'Australia', 'Australia/Melbourne': 'Australia',
    'Australia/Brisbane': 'Australia', 'Australia/Perth': 'Australia',
    'America/Toronto': 'Canada', 'America/Vancouver': 'Canada',
    'America/Sao_Paulo': 'Brazil', 'America/Mexico_City': 'Mexico',
    'Asia/Karachi': 'Pakistan', 'Asia/Dhaka': 'Bangladesh',
    'Asia/Jakarta': 'Indonesia', 'Asia/Seoul': 'South Korea',
    'Africa/Cairo': 'Egypt', 'Africa/Lagos': 'Nigeria',
    'Africa/Johannesburg': 'South Africa', 'Asia/Riyadh': 'Saudi Arabia',
    'Asia/Tehran': 'Iran', 'Asia/Baghdad': 'Iraq',
    'Europe/Istanbul': 'Turkey', 'Asia/Taipei': 'Taiwan',
    'Asia/Bangkok': 'Thailand', 'Asia/Ho_Chi_Minh': 'Vietnam',
    'Asia/Manila': 'Philippines', 'Asia/Kuala_Lumpur': 'Malaysia',
    'Europe/Rome': 'Italy', 'Europe/Madrid': 'Spain',
    'Europe/Amsterdam': 'Netherlands', 'Europe/Warsaw': 'Poland',
    'Europe/Kiev': 'Ukraine', 'Europe/Stockholm': 'Sweden',
    'Europe/Oslo': 'Norway', 'Europe/Copenhagen': 'Denmark',
    'Europe/Helsinki': 'Finland', 'Europe/Zurich': 'Switzerland',
    'Europe/Vienna': 'Austria', 'Europe/Brussels': 'Belgium',
    'Europe/Lisbon': 'Portugal', 'Europe/Athens': 'Greece',
    'Europe/Prague': 'Czech Republic', 'Europe/Budapest': 'Hungary',
    'Europe/Bucharest': 'Romania', 'Europe/Sofia': 'Bulgaria',
    'Asia/Almaty': 'Kazakhstan', 'Asia/Tashkent': 'Uzbekistan',
    'Asia/Colombo': 'Sri Lanka', 'Asia/Kathmandu': 'Nepal',
    'Asia/Kabul': 'Afghanistan', 'Asia/Yerevan': 'Armenia',
    'Asia/Tbilisi': 'Georgia', 'Asia/Baku': 'Azerbaijan',
    'Pacific/Auckland': 'New Zealand',
  };
  return map[tz] ?? null;
}

function getUTCOffsetStr(tz: string, now: number) {
  try {
    const parts = Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date(now));
    return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

// City picker modal for multi-timezone countries
function CityPicker({ country, cities, flag, onPick, onClose }: {
  country: string; cities: CityOption[]; flag: string;
  onPick: (city: CityOption) => void; onClose: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '20px', minWidth: '260px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{flag}</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{country}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
            <X size={14} />
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px' }}>
          Select a city to add to your clock
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {cities.map(city => (
            <button
              key={city.tz + city.name}
              onClick={() => onPick(city)}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--r)', padding: '8px 12px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: 'var(--text)', fontSize: '13px', textAlign: 'left',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-border)';
                e.currentTarget.style.background = 'var(--accent-dim)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--card)';
              }}
            >
              <span>{city.name}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-3)' }}>
                {new Intl.DateTimeFormat('en-GB', {
                  timeZone: city.tz, hour: '2-digit', minute: '2-digit', hour12: false,
                }).format(new Date())}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorldClock() {
  const [tick, setTick] = useState(Date.now());
  const [cities, setCities] = useState<CityEntry[]>(DEFAULT_CITIES);
  const [selectedTz, setSelectedTz] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(true);
  const [cityPicker, setCityPicker] = useState<{ country: CountryFeature; cities: CityOption[] } | null>(null);

  const localTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const userCountry = useMemo(() => getCountryFromTimezone(localTz), [localTz]);

  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const addCity = useCallback((name: string, tz: string, flag: string, country: string) => {
    setSelectedTz(tz);
    setCities(prev => prev.some(c => c.tz === tz && c.name === name) ? prev : [
      ...prev, { name, tz, flag, country }
    ]);
  }, []);

  const handleCountrySelect = useCallback((country: CountryFeature) => {
    const multiCities = MULTI_TZ_COUNTRIES[country.name];
    if (multiCities) {
      // Show city picker for multi-tz countries
      setCityPicker({ country, cities: multiCities });
    } else {
      addCity(country.name, country.tz, country.flag, country.name);
    }
  }, [addCity]);

  const handleCityPick = useCallback((city: CityOption) => {
    if (!cityPicker) return;
    addCity(city.name, city.tz, cityPicker.country.flag, cityPicker.country.name);
    setCityPicker(null);
  }, [cityPicker, addCity]);

  const removeCity = useCallback((tz: string, name: string) => {
    setCities(prev => prev.filter(c => !(c.tz === tz && c.name === name)));
    if (selectedTz === tz) setSelectedTz(undefined);
  }, [selectedTz]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* City picker modal */}
      {cityPicker && (
        <CityPicker
          country={cityPicker.country.name}
          cities={cityPicker.cities}
          flag={cityPicker.country.flag}
          onPick={handleCityPick}
          onClose={() => setCityPicker(null)}
        />
      )}

      {/* Map */}
      <div className="card">
        <div className="card-hd" style={{ marginBottom: '12px' }}>
          <span className="card-title">World Map</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{localTz}</span>
            <button
              onClick={() => setShowMap(v => !v)}
              style={{
                fontSize: '11px', color: 'var(--text-3)', background: 'var(--elevated)',
                border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '2px 8px', cursor: 'pointer',
              }}
            >
              {showMap ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {showMap && (
          <>
            <WorldMap
              onSelect={handleCountrySelect}
              selectedTz={selectedTz}
              userCountry={userCountry ?? undefined}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', textAlign: 'center' }}>
              Click any country to add it · hover to see local time
            </p>
          </>
        )}
      </div>

      {/* Clocks grid */}
      <div className="card">
        <div className="card-hd" style={{ marginBottom: '12px' }}>
          <span className="card-title">World Clock</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{cities.length} cities</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
          {cities.map(city => {
            const isLocal = localTz === city.tz;
            const isSelected = selectedTz === city.tz;
            const now = new Date(tick);
            const timeStr = new Intl.DateTimeFormat('en-GB', {
              timeZone: city.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
            }).format(now);
            const dateStr = new Intl.DateTimeFormat('en-US', {
              timeZone: city.tz, weekday: 'short', month: 'short', day: 'numeric',
            }).format(now);
            const offset = getUTCOffsetStr(city.tz, tick);
            const isDefault = DEFAULT_CITIES.some(d => d.tz === city.tz && d.name === city.name);

            return (
              <div
                key={`${city.tz}-${city.name}`}
                onClick={() => setSelectedTz(city.tz)}
                style={{
                  background: isLocal ? 'var(--accent-dim)' : isSelected ? 'var(--elevated)' : 'var(--card)',
                  border: isLocal ? '1px solid var(--accent-border)' : isSelected ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)', padding: '14px 16px',
                  transition: 'all 0.14s', cursor: 'pointer', position: 'relative',
                }}
                onMouseEnter={e => { if (!isLocal) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {!isDefault && (
                  <button
                    onClick={e => { e.stopPropagation(); removeCity(city.tz, city.name); }}
                    style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--text-3)', padding: '2px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <X size={10} />
                  </button>
                )}
                <div style={{
                  fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{city.flag}</span>
                    <span>{city.name}</span>
                  </div>
                  {isLocal && (
                    <span style={{
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      border: '1px solid var(--accent-border)', borderRadius: '999px',
                      fontSize: '9px', fontWeight: 600, padding: '1px 6px',
                    }}>YOU</span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 600,
                  color: isLocal ? 'var(--accent)' : 'var(--text)', lineHeight: 1, marginBottom: '5px',
                }}>
                  {timeStr}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>{dateStr}</div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-3)',
                  marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <span>{offset}</span>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ fontFamily: 'var(--sans)' }}>{city.country}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
