import { useState, useEffect } from 'react';
import TimestampConverter from './components/TimestampConverter';
import WorldClock from './components/WorldClock';
import TimeCalculator from './components/TimeCalculator';
import { Moon, Sun, Zap, Globe, Calculator } from 'lucide-react';
import './App.css';

type Tab = 'converter' | 'calculator' | 'worldclock';

const TABS: { id: Tab; label: string; icon: React.ReactNode; shortcut?: string }[] = [
    { id: 'converter', label: 'Converter', icon: <Zap size={16} />, shortcut: '1' },
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={16} />, shortcut: '2' },
    { id: 'worldclock', label: 'World Clock', icon: <Globe size={16} />, shortcut: '3' },
];

export default function App() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tsl-theme');
            return saved ? saved === 'dark' : true;
        }
        return true;
    });
    const [activeTab, setActiveTab] = useState<Tab>('converter');
    const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));
    const [currentMs, setCurrentMs] = useState(Date.now() % 1000);

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.remove('light');
            localStorage.setItem('tsl-theme', 'dark');
        } else {
            root.classList.add('light');
            localStorage.setItem('tsl-theme', 'light');
        }
    }, [darkMode]);

    // Live clock ticker
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setCurrentUnix(Math.floor(now / 1000));
            setCurrentMs(now % 1000);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Global keyboard shortcuts: Alt+1…5 to switch tabs
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.altKey) {
                const tab = TABS.find((t) => t.shortcut === e.key);
                if (tab) {
                    e.preventDefault();
                    setActiveTab(tab.id);
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 20px',
                height: '52px',
                borderBottom: '1px solid var(--border)',
                background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
                backdropFilter: 'blur(16px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: '14px', letterSpacing: '-0.01em' }}>
                    <div style={{
                        width: '26px',
                        height: '26px',
                        background: 'var(--accent)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--mono)',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#07080b',
                        letterSpacing: '-0.04em',
                        flexShrink: 0
                    }}>
                        TSL
                    </div>
                    TimestampLab
                </div>

                {/* Live ticker */}
                <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontFamily: 'var(--mono)',
                    fontSize: '12px',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: '999px',
                    padding: '4px 12px 4px 8px'
                }}>
                    <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        animation: 'blink 1.8s ease-in-out infinite',
                        flexShrink: 0
                    }} />
                    <span style={{ color: 'var(--text-3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>now</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '-0.02em' }}>{currentUnix}</span>
                    <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>.{String(currentMs).padStart(3, '0')}</span>
                </div>

                <button
                    onClick={() => setDarkMode((d) => !d)}
                    style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--r)',
                        background: 'transparent',
                        color: 'var(--text-2)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--elevated)';
                        e.currentTarget.style.color = 'var(--text)';
                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-2)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                    aria-label="Toggle dark mode"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                </button>
            </header>

            {/* Tab bar */}
            <nav style={{
                display: 'flex',
                gap: '2px',
                padding: '8px 20px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface)',
                overflowX: 'auto',
                flexShrink: 0
            }} className="scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 13px',
                            borderRadius: 'var(--r)',
                            border: activeTab === tab.id ? '1px solid var(--accent-border)' : '1px solid transparent',
                            background: activeTab === tab.id ? 'var(--accent-dim)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-2)',
                            fontFamily: 'var(--sans)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.14s'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== tab.id) {
                                e.currentTarget.style.color = 'var(--text)';
                                e.currentTarget.style.background = 'var(--elevated)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== tab.id) {
                                e.currentTarget.style.color = 'var(--text-2)';
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                        aria-label={`${tab.label} (Alt+${tab.shortcut})`}
                        id={`tab-${tab.id}`}
                    >
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>{tab.icon}</span>
                        {tab.label}
                        {tab.shortcut && (
                            <span style={{
                                fontFamily: 'var(--mono)',
                                fontSize: '9px',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                background: activeTab === tab.id ? 'var(--accent-glow)' : 'var(--elevated)',
                                border: activeTab === tab.id ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-3)',
                                display: window.innerWidth >= 768 ? 'inline' : 'none'
                            }}>
                                Alt+{tab.shortcut}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '20px',
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto'
            }}>
                {activeTab === 'converter' && <TimestampConverter />}
                {activeTab === 'calculator' && <TimeCalculator />}
                {activeTab === 'worldclock' && <WorldClock />}
            </main>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid var(--border)',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-3)',
                flexShrink: 0,
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                <span>TimestampLab · Open source · Built with React & Tailwind CSS</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', color: 'var(--text-3)' }}>Alt+1–3</span>
                    <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>switch tabs</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', color: 'var(--text-3)' }}>Ctrl+L</span>
                    <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>use now</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', color: 'var(--text-3)' }}>Enter</span>
                    <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>convert</span>
                </div>
            </footer>
        </div>
    );
}
