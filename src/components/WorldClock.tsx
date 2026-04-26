import { useState, useEffect, useMemo } from 'react';

const CITIES = [
    { name: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🇺🇸', country: 'USA' },
    { name: 'New York', tz: 'America/New_York', flag: '🇺🇸', country: 'USA' },
    { name: 'London', tz: 'Europe/London', flag: '🇬🇧', country: 'UK' },
    { name: 'Paris', tz: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
    { name: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
    { name: 'Bangalore', tz: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
    { name: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
    { name: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
    { name: 'Berlin', tz: 'Europe/Berlin', flag: '🇩🇪', country: 'Germany' },
    { name: 'Toronto', tz: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
];

function getUTCOffsetStr(tz: string, now: number) {
    try {
        const parts = Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date(now));
        const off = parts.find(p => p.type === 'timeZoneName');
        return off ? off.value : '';
    } catch (_) { return ''; }
}

export default function WorldClock() {
    const [tick, setTick] = useState(Date.now());
    const localTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

    useEffect(() => {
        const t = setInterval(() => setTick(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div>
            <div className="card">
                <div className="card-hd">
                    <span className="card-title">World Clock</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                        Your timezone: {localTz}
                    </span>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px'
                }}>
                    {CITIES.map(city => {
                        const isLocal = localTz === city.tz;
                        const now = new Date(tick);
                        const timeStr = new Intl.DateTimeFormat('en-GB', {
                            timeZone: city.tz,
                            hour: '2-digit', minute: '2-digit', second: '2-digit',
                            hour12: false,
                        }).format(now);
                        const dateStr = new Intl.DateTimeFormat('en-US', {
                            timeZone: city.tz,
                            weekday: 'short', month: 'short', day: 'numeric',
                        }).format(now);
                        const offset = getUTCOffsetStr(city.tz, tick);

                        return (
                            <div
                                key={city.tz}
                                style={{
                                    background: isLocal ? 'var(--accent-dim)' : 'var(--card)',
                                    border: isLocal ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                                    borderRadius: 'var(--r-lg)',
                                    padding: '14px 16px',
                                    transition: 'border-color 0.14s, transform 0.14s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLocal) {
                                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLocal) {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                    color: 'var(--text-3)',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '16px' }}>{city.flag}</span>
                                        <span>{city.name}</span>
                                    </div>
                                    {isLocal && (
                                        <span style={{
                                            background: 'var(--accent-dim)',
                                            color: 'var(--accent)',
                                            border: '1px solid var(--accent-border)',
                                            borderRadius: '999px',
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            padding: '1px 6px',
                                            letterSpacing: '0.05em'
                                        }}>YOU</span>
                                    )}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--mono)',
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: isLocal ? 'var(--accent)' : 'var(--text)',
                                    lineHeight: 1,
                                    marginBottom: '5px'
                                }}>
                                    {timeStr}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>{dateStr}</div>
                                <div style={{ 
                                    fontFamily: 'var(--mono)', 
                                    fontSize: '10px', 
                                    color: 'var(--text-3)', 
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
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
