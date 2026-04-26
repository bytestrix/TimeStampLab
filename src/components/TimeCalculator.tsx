import { useState } from 'react';
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

const UNITS_MAP: Record<string, number> = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000,
    weeks: 604800000,
    months: 2629800000,
    years: 31557600000,
};

export default function TimeCalculator() {
    const [base, setBase] = useState('');
    const [op, setOp] = useState('+');
    const [amount, setAmount] = useState('5');
    const [unit, setUnit] = useState('hours');
    const [ckey, copy] = useCopy();

    const toMs = (raw: string): number | null => {
        const s = raw.trim();
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

    const baseMs = base.trim() ? toMs(base.trim()) : null;
    const baseOk = baseMs !== null && !isNaN(baseMs);
    const amt = parseFloat(amount);
    const amtOk = !isNaN(amt) && amt >= 0;

    let resultMs = null;
    if (baseOk && amtOk) {
        const delta = amt * UNITS_MAP[unit];
        resultMs = op === '+' ? baseMs + delta : baseMs - delta;
    }

    return (
        <div>
            <div className="card">
                <div className="card-hd"><span className="card-title">Base Date / Timestamp</span></div>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <input
                        className={`inp ${base && !baseOk ? 'err' : ''}`}
                        value={base}
                        onChange={e => setBase(e.target.value)}
                        placeholder="Unix timestamp, ISO date, or YYYY-MM-DD..."
                    />
                    <NowBtn label="Now" onClick={() => setBase(String(Math.floor(Date.now() / 1000)))} />
                </div>
                {baseOk && <p className="hint">= {new Date(baseMs).toLocaleString()}</p>}
                {base && !baseOk && <p className="hint" style={{ color: 'var(--error)' }}>Invalid — try a Unix timestamp or ISO date</p>}
            </div>

            <div className="card">
                <div className="card-hd"><span className="card-title">Add or Subtract</span></div>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {['+', '−'].map((o, i) => {
                        const val = i === 0 ? '+' : '-';
                        return (
                            <button
                                key={val}
                                className={`op-btn ${op === val ? 'active' : ''}`}
                                onClick={() => setOp(val)}
                            >
                                {o}
                            </button>
                        );
                    })}
                    <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{
                            width: '90px',
                            fontFamily: 'var(--mono)',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r)',
                            padding: '8px 11px',
                            fontSize: '12px',
                            color: 'var(--text)',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    <select
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                        style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r)',
                            padding: '8px 11px',
                            fontFamily: 'var(--sans)',
                            fontSize: '12px',
                            color: 'var(--text)',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {Object.keys(UNITS_MAP).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                {baseOk && amtOk && (
                    <p className="hint" style={{ marginTop: 10 }}>
                        {op === '+' ? `${amount} ${unit} after` : `${amount} ${unit} before`} the base date
                    </p>
                )}
            </div>

            {resultMs !== null && (
                <div className="card">
                    <div className="card-hd"><span className="card-title">Result</span></div>
                    <div className="results">
                        <RRow label="ISO 8601" value={new Date(resultMs).toISOString()} id="c_iso" ckey={ckey} copy={copy} />
                        <RRow label="Local" value={new Date(resultMs).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'medium' })} id="c_loc" ckey={ckey} copy={copy} />
                        <RRow label="Relative" value={getRelativeTime(new Date(resultMs))} id="c_rel" ckey={ckey} copy={copy} hi />
                        <RRow label="Unix (s)" value={String(Math.floor(resultMs / 1000))} id="c_s" ckey={ckey} copy={copy} blue />
                        <RRow label="Unix (ms)" value={String(resultMs)} id="c_ms" ckey={ckey} copy={copy} blue />
                    </div>
                </div>
            )}
        </div>
    );
}
