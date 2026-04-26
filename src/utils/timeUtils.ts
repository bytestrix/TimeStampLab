// ─── Epoch helpers ────────────────────────────────────────────────────────────
export const toUnix = (date: string) =>
    Math.floor(new Date(date).getTime() / 1000);

export const fromUnix = (timestamp: number) =>
    new Date(timestamp * 1000).toISOString();

// ─── Auto-detect ms vs seconds ────────────────────────────────────────────────
// JS/Java timestamps are 13-digit ms; Unix timestamps are 10-digit seconds.
export function detectAndNormaliseTimestamp(raw: number): {
    unit: 'ms' | 's';
    epochMs: number;
    epochS: number;
} {
    const isMs = Math.abs(raw) > 1e10;
    const epochMs = isMs ? raw : raw * 1000;
    const epochS = isMs ? Math.floor(raw / 1000) : raw;
    return { unit: isMs ? 'ms' : 's', epochMs, epochS };
}

// ─── Format presets ───────────────────────────────────────────────────────────
export type FormatPreset =
    | 'local'
    | 'iso8601'
    | 'rfc2822'
    | 'rfc3339'
    | 'utc'
    | 'unix'
    | 'unix_ms'
    | 'relative';

export interface FormatDefinition {
    key: FormatPreset;
    label: string;
    description: string;
    format: (d: Date) => string;
}

export const FORMAT_PRESETS: FormatDefinition[] = [
    {
        key: 'local',
        label: 'Local',
        description: 'Browser local date/time',
        format: (d) => d.toLocaleString(),
    },
    {
        key: 'iso8601',
        label: 'ISO 8601',
        description: 'e.g. 2024-01-15T14:30:00.000Z',
        format: (d) => d.toISOString(),
    },
    {
        key: 'rfc2822',
        label: 'RFC 2822',
        description: 'Used in HTTP & email headers',
        format: (d) => d.toUTCString(),
    },
    {
        key: 'rfc3339',
        label: 'RFC 3339',
        description: 'Strict subset of ISO 8601 with offset',
        format: (d) => {
            const pad = (n: number, w = 2) => String(n).padStart(w, '0');
            const offset = -d.getTimezoneOffset();
            const sign = offset >= 0 ? '+' : '-';
            const h = pad(Math.floor(Math.abs(offset) / 60));
            const m = pad(Math.abs(offset) % 60);
            return (
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
                `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
                `${sign}${h}:${m}`
            );
        },
    },
    {
        key: 'utc',
        label: 'UTC',
        description: 'Human-friendly UTC string',
        format: (d) =>
            d.toLocaleString('en-US', {
                timeZone: 'UTC',
                dateStyle: 'long',
                timeStyle: 'long',
            }),
    },
    {
        key: 'unix',
        label: 'Unix (s)',
        description: 'Seconds since epoch',
        format: (d) => String(Math.floor(d.getTime() / 1000)),
    },
    {
        key: 'unix_ms',
        label: 'Unix (ms)',
        description: 'Milliseconds since epoch (JS/Java)',
        format: (d) => String(d.getTime()),
    },
    {
        key: 'relative',
        label: 'Relative',
        description: '"3 hours ago", "in 2 days"',
        format: (d) => getRelativeTime(d),
    },
];

// ─── Relative time ────────────────────────────────────────────────────────────
const UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: 'day', ms: 24 * 60 * 60 * 1000 },
    { unit: 'hour', ms: 60 * 60 * 1000 },
    { unit: 'minute', ms: 60 * 1000 },
    { unit: 'second', ms: 1000 },
];

export function getRelativeTime(d: Date, from: Date = new Date()): string {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffMs = d.getTime() - from.getTime();
    for (const { unit, ms } of UNITS) {
        if (Math.abs(diffMs) >= ms || unit === 'second') {
            return rtf.format(Math.round(diffMs / ms), unit);
        }
    }
    return 'just now';
}

// ─── Timestamp diff ──────────────────────────────────────────────────────────
export interface TimeDiff {
    totalMs: number;
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ms: number;
}

export function diffTimestamps(a: Date, b: Date): TimeDiff {
    const totalMs = Math.abs(b.getTime() - a.getTime());
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalMs / 60_000);
    const totalHours = Math.floor(totalMs / 3_600_000);
    const totalDays = Math.floor(totalMs / 86_400_000);

    const days = totalDays;
    const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
    const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
    const seconds = Math.floor((totalMs % 60_000) / 1000);
    const ms = totalMs % 1000;

    return { totalMs, totalSeconds, totalMinutes, totalHours, totalDays, days, hours, minutes, seconds, ms };
}
