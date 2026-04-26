import { useState, useEffect, useRef } from 'react';
import { getRelativeTime } from '../utils/timeUtils';

function useCopy() {
    const [key, setKey] = useState<string | null>(null);
    const copy = (text: string, id: string) => {
        try { navigator.clipboard.writeText(text); } catch (_) { }
        setKey(id);
        setTimeout(() => setKey(null), 1600);
    };
    return [key, copy] as const;
}

function CopyBtn({ text, id, ckey, copy }: { text: string; id: string; ckey: string | null; copy: (text: string, id: string) => void }) {
    const ok = ckey === id;
    return (
        <button className={`btn-copy ${ok ? 'ok' : ''}`} onClick={() => copy(text, id)}>
            {ok ? '✓ Copied' : 'Copy'}
        </button>
    );
}

function RRow({ label, value, id, ckey, copy, hi, blue }: { label: string; value: string; id: string; ckey: string | null; copy: (text: string, id: string) => void; hi?: boolean; blue?: boolean }) {
    if (!value) return null;
    return (
        <div className="rrow">
            <span className="rlabel">{label}</span>
            <span className={`rval ${hi ? 'hi' : blue ? 'blue' : ''}`}>{value}</span>
            <CopyBtn text={value} id={id} ckey={ckey} copy={copy} />
        </div>
    );
}

function NowBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return <button className="btn btn-ghost" onClick={onClick}>{label}</button>;
}

export default function TimestampConverter() {
    const [raw, setRaw] = useState('');
    const [dateInp, setDateInp] = useState('');
    const [tick, setTick] = useState(Date.now());
    const [ckey, copy] = useCopy();
    const [timeFormat, setTimeFormat] = useState<'s' | 'ms'>('s'); // Toggle between seconds and milliseconds
    const taRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const t = setInterval(() => setTick(Date.now()), 100);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const handler = (e: globalThis.KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                setRaw(String(Math.floor(Date.now() / 1000)));
                taRef.current && taRef.current.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const toMs = (rawStr: string): number | null => {
        const s = rawStr.trim();
        if (!s) return null;
        if (s.includes('-') || s.includes('T') || s.includes('/')) {
            const d = new Date(s);
            return isNaN(d.getTime()) ? null : d.getTime();
        }
        const n = parseFloat(s);
        if (isNaN(n)) return null;
        const detectUnit = Math.abs(n) > 2e12 ? 'ms' : 's';
        return detectUnit === 'ms' ? n : n * 1000;
    };

    const detectUnit = (rawStr: string) => {
        const n = Math.abs(parseFloat(rawStr.trim()));
        if (isNaN(n) || n === 0) return 's';
        return n > 2e12 ? 'ms' : 's';
    };

    const fmtAll = (ms: number) => {
        const d = new Date(ms);
        return {
            iso: d.toISOString(),
            utc: d.toUTCString(),
            local: d.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'medium' }),
            relative: getRelativeTime(d),
            unix_s: String(Math.floor(ms / 1000)),
            unix_ms: String(ms),
        };
    };

    // Split on newlines OR commas
    const tokens = raw.trim()
        ? raw.trim().split(/[\n,]+/).map(t => t.trim()).filter(Boolean)
        : [];

    const mode = tokens.length === 0 ? 'empty'
        : tokens.length === 1 ? 'single'
            : tokens.length === 2 ? 'diff'
                : 'batch';

    const parsed = tokens.map(t => {
        const ms = toMs(t);
        return { input: t, ms, ok: ms !== null && !isNaN(ms) };
    });

    const nowSec = Math.floor(tick / 1000);
    const frac = String(tick % 1000).padStart(3, '0');

    // Single mode
    const singleMs = mode === 'single' && parsed[0]?.ok ? parsed[0].ms : null;
    const results = singleMs !== null ? fmtAll(singleMs) : null;
    const isErr = mode === 'single' && tokens.length > 0 && !parsed[0]?.ok;
    const unit = mode === 'single' && parsed[0]?.ok ? detectUnit(tokens[0]) : null;

    // Diff mode
    let diff = null;
    if (mode === 'diff' && parsed[0]?.ok && parsed[1]?.ok) {
        const d = Math.abs(parsed[1].ms! - parsed[0].ms!);
        const days = Math.floor(d / 86400000);
        const hrs = Math.floor((d % 86400000) / 3600000);
        const mins = Math.floor((d % 3600000) / 60000);
        const secs = Math.floor((d % 60000) / 1000);
        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hrs) parts.push(`${hrs}h`);
        if (mins) parts.push(`${mins}m`);
        if (secs) parts.push(`${secs}s`);
        diff = {
            ms: d,
            secs: Math.floor(d / 1000),
            mins: Math.floor(d / 60000),
            hrs: Math.floor(d / 3600000),
            days,
            summary: parts.join(' ') || '< 1s',
            direction: parsed[0].ms! < parsed[1].ms! ? 'line 2 is later' : parsed[0].ms! > parsed[1].ms! ? 'line 1 is later' : 'same moment',
        };
    }

    // Batch mode
    const batchRows = mode === 'batch' ? parsed.map(p => {
        if (!p.ok) return { input: p.input, err: true, unit: null, iso: '', local: '', relative: '', ms: null };
        const d = new Date(p.ms!);
        return { input: p.input, unit: detectUnit(p.input), iso: d.toISOString(), local: d.toLocaleString(), relative: getRelativeTime(d), err: false, ms: p.ms };
    }) : [];

    // Calculate batch time span
    let batchSpan = null;
    let consecutiveDiffs: Array<{ from: number; to: number; span: string; fromIdx: number; toIdx: number }> = [];
    if (mode === 'batch' && batchRows.length > 0) {
        const validRows = batchRows.filter(r => !r.err && r.ms !== null);
        if (validRows.length >= 2) {
            const timestamps = validRows.map(r => r.ms!).sort((a, b) => a - b);
            const earliest = timestamps[0];
            const latest = timestamps[timestamps.length - 1];
            const spanMs = latest - earliest;
            const days = Math.floor(spanMs / 86400000);
            const hrs = Math.floor((spanMs % 86400000) / 3600000);
            const mins = Math.floor((spanMs % 3600000) / 60000);
            const parts = [];
            if (days) parts.push(`${days}d`);
            if (hrs) parts.push(`${hrs}h`);
            if (mins) parts.push(`${mins}m`);
            batchSpan = {
                earliest: new Date(earliest).toISOString(),
                latest: new Date(latest).toISOString(),
                span: parts.join(' ') || '< 1m',
                spanMs
            };

            // Calculate consecutive differences
            for (let i = 0; i < validRows.length - 1; i++) {
                const fromMs = validRows[i].ms!;
                const toMs = validRows[i + 1].ms!;
                const diffMs = Math.abs(toMs - fromMs);
                const d = Math.floor(diffMs / 86400000);
                const h = Math.floor((diffMs % 86400000) / 3600000);
                const m = Math.floor((diffMs % 3600000) / 60000);
                const diffParts = [];
                if (d) diffParts.push(`${d}d`);
                if (h) diffParts.push(`${h}h`);
                if (m) diffParts.push(`${m}m`);
                consecutiveDiffs.push({
                    from: fromMs,
                    to: toMs,
                    span: diffParts.join(' ') || '< 1m',
                    fromIdx: batchRows.findIndex(r => r.ms === fromMs),
                    toIdx: batchRows.findIndex(r => r.ms === toMs)
                });
            }
        }
    }

    const exportCSV = () => {
        const hdr = 'input,unit,iso,local,relative';
        const csvLines = batchRows.map(r =>
            r.err ? `${r.input},error,,,` : `${r.input},${r.unit},${r.iso},"${r.local}","${r.relative}"`
        );
        const blob = new Blob([[hdr, ...csvLines].join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'timestamps.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const dateMs = dateInp ? new Date(dateInp).getTime() : null;
    const dateOk = dateMs !== null && !isNaN(dateMs);

    const modeBadge: Record<string, { label: string; cls: string }> = {
        single: { label: 'Convert', cls: 'badge-g' },
        diff: { label: 'Diff — 2 timestamps', cls: 'badge-b' },
        batch: { label: `Batch — ${tokens.length} timestamps`, cls: 'badge-g' },
    };

    const displayTime = timeFormat === 's' ? nowSec : tick;

    return (
        <div>
            {/* Live NOW */}
            <div className="now-panel">
                <div>
                    <div className="now-ts-main">
                        {timeFormat === 's' ? (
                            <>{nowSec}<span className="now-ts-frac">.{frac}</span></>
                        ) : (
                            <>{tick}</>
                        )}
                    </div>
                    <div className="now-sub">
                        Live Unix timestamp · {timeFormat === 's' ? 'seconds.milliseconds' : 'milliseconds'}
                    </div>
                </div>
                <div className="now-actions">
                    <button
                        className={`btn ${timeFormat === 's' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => {
                            setTimeFormat('s');
                            setRaw(String(nowSec));
                        }}
                    >
                        Seconds
                    </button>
                    <button
                        className={`btn ${timeFormat === 'ms' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => {
                            setTimeFormat('ms');
                            setRaw(String(tick));
                        }}
                    >
                        Milliseconds
                    </button>
                </div>
            </div>

            {/* Smart input */}
            <div className="card">
                <div className="card-hd">
                    <span className="card-title">
                        Timestamp Input
                        {mode !== 'empty' && (
                            <span className={`badge ${modeBadge[mode].cls}`} style={{ marginLeft: 8 }}>
                                {modeBadge[mode].label}
                            </span>
                        )}
                        {isErr && <span className="badge badge-e" style={{ marginLeft: 8 }}>invalid input</span>}
                    </span>
                    {unit && <span className={`badge ${unit === 'ms' ? 'badge-b' : 'badge-g'}`}>{unit === 'ms' ? 'milliseconds' : 'seconds'} auto-detected</span>}
                </div>
                <textarea
                    ref={taRef}
                    className={`textarea ${isErr ? 'err' : ''}`}
                    value={raw}
                    onChange={e => setRaw(e.target.value)}
                    placeholder={"1 timestamp  → convert to all formats\n2 timestamps → diff them  (newline or comma-separated)\n3+ timestamps → batch convert + CSV export\n\ne.g.  1777186107\ne.g.  1775001600, 1777188075"}
                    style={{ minHeight: mode === 'batch' ? 100 : 76, resize: 'vertical' }}
                />
                {mode === 'empty' && (
                    <p className="hint">Smart mode — adapts automatically · <span className="kbd">Ctrl+L</span> to insert current time</p>
                )}
            </div>

            {/* Single: all formats */}
            {mode === 'single' && results && (
                <div className="card">
                    <div className="card-hd"><span className="card-title">Converted Formats</span></div>
                    <div className="results">
                        <RRow label="ISO 8601" value={results.iso} id="iso" ckey={ckey} copy={copy} />
                        <RRow label="UTC" value={results.utc} id="utc" ckey={ckey} copy={copy} />
                        <RRow label="Local" value={results.local} id="loc" ckey={ckey} copy={copy} />
                        <RRow label="Relative" value={results.relative} id="rel" ckey={ckey} copy={copy} hi />
                        <RRow label="Unix (s)" value={results.unix_s} id="us" ckey={ckey} copy={copy} blue />
                        <RRow label="Unix (ms)" value={results.unix_ms} id="um" ckey={ckey} copy={copy} blue />
                    </div>
                </div>
            )}

            {/* Diff: 2 timestamps */}
            {mode === 'diff' && (
                <div className="card">
                    <div className="card-hd">
                        <span className="card-title">Time Difference</span>
                        {diff && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{diff.direction}</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                        {parsed.map((p, i) => (
                            <div className="rrow" key={i}>
                                <span className="rlabel">Line {i + 1}</span>
                                <span className="rval" style={{ color: p.ok ? 'var(--text)' : 'var(--error)' }}>
                                    {p.ok ? `${p.input}  →  ${new Date(p.ms!).toISOString()}` : `${p.input}  —  invalid timestamp`}
                                </span>
                            </div>
                        ))}
                    </div>
                    {diff ? (
                        <>
                            <div style={{ textAlign: 'center', padding: '12px 0 18px' }}>
                                <div style={{
                                    fontFamily: 'var(--mono)',
                                    fontSize: '38px',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1
                                }}>
                                    {diff.summary}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>total elapsed time</div>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                gap: '8px'
                            }}>
                                {[
                                    { v: diff.days.toLocaleString(), u: 'Days' },
                                    { v: diff.hrs.toLocaleString(), u: 'Hours' },
                                    { v: diff.mins.toLocaleString(), u: 'Minutes' },
                                    { v: diff.secs.toLocaleString(), u: 'Seconds' },
                                    { v: diff.ms.toLocaleString(), u: 'Milliseconds' },
                                ].map(({ v, u }) => (
                                    <div key={u} style={{
                                        background: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--r-lg)',
                                        padding: '14px 12px',
                                        textAlign: 'center',
                                        minWidth: 0
                                    }}>
                                        <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 600, color: 'var(--text)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{v}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="results" style={{ marginTop: 12 }}>
                                <RRow label="Summary" value={diff.summary} id="dsum" ckey={ckey} copy={copy} hi />
                                <RRow label="Milliseconds" value={diff.ms.toLocaleString()} id="dms" ckey={ckey} copy={copy} />
                            </div>
                        </>
                    ) : (
                        <p className="hint" style={{ color: 'var(--error)' }}>One or both timestamps are invalid</p>
                    )}
                </div>
            )}

            {/* Batch: 3+ timestamps */}
            {mode === 'batch' && (
                <div className="card">
                    <div className="card-hd">
                        <span className="card-title">
                            Batch Results
                            <span style={{ fontFamily: 'var(--mono)', fontWeight: 400, marginLeft: 8 }}>
                                <span style={{ color: 'var(--accent)' }}>{batchRows.filter(r => !r.err).length} valid</span>
                                {batchRows.filter(r => r.err).length > 0 && (
                                    <span style={{ color: 'var(--error)', marginLeft: 6 }}>{batchRows.filter(r => r.err).length} errors</span>
                                )}
                            </span>
                        </span>
                        {batchRows.some(r => !r.err) && <button className="btn btn-ghost" onClick={exportCSV}>Export CSV</button>}
                    </div>
                    
                    {/* Time span info */}
                    {batchSpan && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                background: 'var(--accent-dim)',
                                border: '1px solid var(--accent-border)',
                                borderRadius: 'var(--r)',
                                padding: '10px 13px',
                                fontSize: '11px',
                                color: 'var(--text-2)',
                                marginBottom: '8px'
                            }}>
                                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Total span: {batchSpan.span}</span>
                                {' '}· from {new Date(batchSpan.earliest).toLocaleString()} to {new Date(batchSpan.latest).toLocaleString()}
                            </div>
                            
                            {/* Consecutive differences */}
                            {consecutiveDiffs.length > 0 && (
                                <div style={{
                                    background: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--r)',
                                    padding: '10px 13px',
                                    fontSize: '11px'
                                }}>
                                    <div style={{ color: 'var(--text-3)', marginBottom: '6px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consecutive Differences</div>
                                    {consecutiveDiffs.map((diff, idx) => (
                                        <div key={idx} style={{ color: 'var(--text-2)', marginBottom: idx < consecutiveDiffs.length - 1 ? '4px' : 0 }}>
                                            <span style={{ color: 'var(--text-3)' }}>#{diff.fromIdx + 1} → #{diff.toIdx + 1}:</span>{' '}
                                            <span style={{ color: 'var(--blue)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{diff.span}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div style={{ overflowX: 'auto', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        textAlign: 'left', padding: '8px 12px',
                                        fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        color: 'var(--text-3)',
                                        background: 'var(--card)',
                                        borderBottom: '1px solid var(--border)'
                                    }}>Input</th>
                                    <th style={{
                                        textAlign: 'left', padding: '8px 12px',
                                        fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        color: 'var(--text-3)',
                                        background: 'var(--card)',
                                        borderBottom: '1px solid var(--border)'
                                    }}>ISO 8601</th>
                                    <th style={{
                                        textAlign: 'left', padding: '8px 12px',
                                        fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        color: 'var(--text-3)',
                                        background: 'var(--card)',
                                        borderBottom: '1px solid var(--border)'
                                    }}>Relative</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batchRows.map((r, i) => r.err ? (
                                    <tr key={i}>
                                        <td style={{
                                            padding: '8px 12px',
                                            fontFamily: 'var(--mono)',
                                            fontSize: '11px',
                                            color: 'var(--text)',
                                            borderBottom: i === batchRows.length - 1 ? 'none' : '1px solid var(--border)'
                                        }}>{r.input}</td>
                                        <td colSpan={2} style={{
                                            padding: '8px 12px',
                                            color: 'var(--error)',
                                            fontFamily: 'var(--sans)',
                                            fontSize: '11px',
                                            borderBottom: i === batchRows.length - 1 ? 'none' : '1px solid var(--border)'
                                        }}>Invalid — could not parse</td>
                                    </tr>
                                ) : (
                                    <tr key={i}>
                                        <td style={{
                                            padding: '8px 12px',
                                            fontFamily: 'var(--mono)',
                                            fontSize: '11px',
                                            color: 'var(--text-2)',
                                            borderBottom: i === batchRows.length - 1 ? 'none' : '1px solid var(--border)'
                                        }}>{r.input}</td>
                                        <td style={{
                                            padding: '8px 12px',
                                            fontFamily: 'var(--mono)',
                                            fontSize: '11px',
                                            color: 'var(--text)',
                                            borderBottom: i === batchRows.length - 1 ? 'none' : '1px solid var(--border)'
                                        }}>{r.iso}</td>
                                        <td style={{
                                            padding: '8px 12px',
                                            color: 'var(--text-2)',
                                            fontFamily: 'var(--sans)',
                                            fontSize: '11px',
                                            borderBottom: i === batchRows.length - 1 ? 'none' : '1px solid var(--border)'
                                        }}>{r.relative}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Date → Unix (always visible) */}
            <div className="card">
                <div className="card-hd"><span className="card-title">Date Picker → Unix</span></div>
                <label className="label">Pick a date & time (local timezone)</label>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <input type="datetime-local" className="inp" value={dateInp} onChange={e => setDateInp(e.target.value)} style={{ flex: 1 }} />
                    <NowBtn label="Now" onClick={() => {
                        const n = new Date();
                        setDateInp(new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                    }} />
                </div>
                {dateOk && (
                    <div className="results">
                        <RRow label="Unix (s)" value={String(Math.floor(dateMs / 1000))} id="d_s" ckey={ckey} copy={copy} hi />
                        <RRow label="Unix (ms)" value={String(dateMs)} id="d_ms" ckey={ckey} copy={copy} blue />
                        <RRow label="ISO 8601" value={new Date(dateMs).toISOString()} id="d_iso" ckey={ckey} copy={copy} />
                    </div>
                )}
            </div>
        </div>
    );
}
