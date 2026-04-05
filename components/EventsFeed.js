'use client';

import { useState, useEffect } from 'react';

const FRAMEWORKS = [
    { id: 'none', label: 'Objective' },
    { id: 'realist', label: 'Realist' },
    { id: 'liberal', label: 'Liberal' },
    { id: 'constructivist', label: 'Constructivist' },
    { id: 'marxist', label: 'Marxist' },
];

const SEVERITY_COLORS = {
    1: '#556677',
    2: '#4ECDC4',
    3: '#FFD93D',
    4: '#FF9F43',
    5: '#FF6B6B',
};

const CATEGORY_ICONS = {
    conflict: '⚔',
    diplomacy: '🤝',
    trade: '📊',
    politics: '🏛',
    security: '🛡',
    humanitarian: '🚨',
};

export default function EventsFeed({ onEventClick, selectedCountry }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [framework, setFramework] = useState('none');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [fromCache, setFromCache] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async (fw) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/events?framework=${fw}`);
            const data = await res.json();
            if (data.error && data.events.length === 0) {
                setError(data.error);
            } else {
                setEvents(data.events || []);
                setLastUpdated(data.lastUpdated);
                setFromCache(data.fromCache || false);
            }
        } catch (err) {
            setError('Failed to fetch events');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents(framework);
    }, []);

    const handleFrameworkChange = (fw) => {
        setFramework(fw);
        setSelectedEvent(null);
        fetchEvents(fw);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        if (onEventClick) onEventClick(event);
    };

    // Filter events by selected country if one is selected
    const displayEvents = selectedCountry
        ? events.filter((e) => e.countries?.includes(selectedCountry.code))
        : events;

    return (
        <div
            style={{
                width: 320,
                background: 'rgba(10, 14, 23, 0.95)',
                borderRight: '1px solid rgba(78, 205, 196, 0.15)',
                fontFamily: "'JetBrains Mono', monospace",
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '16px',
                    borderBottom: '1px solid rgba(78, 205, 196, 0.1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                            style={{
                                fontSize: 11,
                                color: '#4ECDC4',
                                letterSpacing: 3,
                                fontWeight: 700,
                            }}
                        >
                            LIVE EVENTS
                        </span>
                        {fromCache && (
                            <span
                                style={{
                                    fontSize: 8,
                                    color: '#556677',
                                    background: 'rgba(78, 205, 196, 0.08)',
                                    padding: '2px 5px',
                                    borderRadius: 2,
                                    letterSpacing: 1,
                                }}
                            >
                                CACHED
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => fetchEvents(framework)}
                        disabled={loading}
                        style={{
                            background: 'rgba(78, 205, 196, 0.1)',
                            border: '1px solid rgba(78, 205, 196, 0.2)',
                            color: '#4ECDC4',
                            padding: '4px 8px',
                            borderRadius: 3,
                            fontSize: 9,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            letterSpacing: 1,
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        {loading ? 'LOADING...' : 'REFRESH'}
                    </button>
                </div>

                {/* Framework selector */}
                <div
                    style={{
                        fontSize: 9,
                        color: '#556677',
                        letterSpacing: 2,
                        marginBottom: 6,
                    }}
                >
                    FRAMEWORK
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {FRAMEWORKS.map((fw) => (
                        <button
                            key={fw.id}
                            onClick={() => handleFrameworkChange(fw.id)}
                            style={{
                                padding: '4px 8px',
                                background:
                                    framework === fw.id
                                        ? 'rgba(78, 205, 196, 0.15)'
                                        : 'rgba(78, 205, 196, 0.04)',
                                border:
                                    framework === fw.id
                                        ? '1px solid rgba(78, 205, 196, 0.4)'
                                        : '1px solid rgba(78, 205, 196, 0.1)',
                                color: framework === fw.id ? '#4ECDC4' : '#556677',
                                borderRadius: 3,
                                fontSize: 9,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                letterSpacing: 1,
                            }}
                        >
                            {fw.label}
                        </button>
                    ))}
                </div>

                {lastUpdated && (
                    <div style={{ fontSize: 9, color: '#556677', marginTop: 8 }}>
                        Updated: {new Date(lastUpdated).toLocaleTimeString()}
                        {fromCache && ' (cached)'}
                    </div>
                )}
            </div>

            {/* Country filter indicator */}
            {selectedCountry && (
                <div
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(78, 205, 196, 0.05)',
                        borderBottom: '1px solid rgba(78, 205, 196, 0.1)',
                        fontSize: 10,
                        color: '#556677',
                    }}
                >
                    Filtered:{' '}
                    <span style={{ color: selectedCountry.color, fontWeight: 600 }}>
                        {selectedCountry.name}
                    </span>
                    <span style={{ marginLeft: 4 }}>
                        ({displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''})
                    </span>
                </div>
            )}

            {/* Events list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {error && (
                    <div
                        style={{
                            padding: '20px 12px',
                            textAlign: 'center',
                            color: '#FF6B6B',
                            fontSize: 11,
                        }}
                    >
                        {error}
                    </div>
                )}

                {loading && events.length === 0 && (
                    <div style={{ padding: '40px 12px', textAlign: 'center' }}>
                        <div
                            style={{
                                display: 'inline-block',
                                width: 20,
                                height: 20,
                                border: '2px solid rgba(78, 205, 196, 0.2)',
                                borderTopColor: '#4ECDC4',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}
                        />
                        <div
                            style={{
                                fontSize: 10,
                                color: '#556677',
                                marginTop: 8,
                                letterSpacing: 2,
                            }}
                        >
                            SCANNING NEWS...
                        </div>
                    </div>
                )}

                {!loading && displayEvents.length === 0 && !error && (
                    <div
                        style={{
                            padding: '40px 12px',
                            textAlign: 'center',
                            color: '#556677',
                            fontSize: 11,
                        }}
                    >
                        {selectedCountry
                            ? `No events involving ${selectedCountry.name}`
                            : 'No events found'}
                    </div>
                )}

                {displayEvents.map((event, i) => (
                    <div
                        key={i}
                        onClick={() => handleEventClick(event)}
                        style={{
                            padding: '12px',
                            marginBottom: 6,
                            background:
                                selectedEvent === event
                                    ? 'rgba(78, 205, 196, 0.1)'
                                    : 'rgba(78, 205, 196, 0.03)',
                            borderRadius: 6,
                            borderLeft: `3px solid ${SEVERITY_COLORS[event.severity] || '#556677'}`,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'rgba(78, 205, 196, 0.08)')
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                            selectedEvent === event
                                ? 'rgba(78, 205, 196, 0.1)'
                                : 'rgba(78, 205, 196, 0.03)')
                        }
                    >
                        {/* Header row */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: 6,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 12 }}>
                                    {CATEGORY_ICONS[event.category] || '◆'}
                                </span>
                                <span
                                    style={{
                                        fontSize: 9,
                                        color: SEVERITY_COLORS[event.severity],
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontWeight: 600,
                                    }}
                                >
                                    {event.category}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        style={{
                                            width: 4,
                                            height: 10,
                                            borderRadius: 1,
                                            background:
                                                level <= event.severity
                                                    ? SEVERITY_COLORS[event.severity]
                                                    : 'rgba(78, 205, 196, 0.1)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#c8d6e5',
                                marginBottom: 6,
                                lineHeight: 1.4,
                            }}
                        >
                            {event.title}
                        </div>

                        {/* Summary */}
                        <div
                            style={{
                                fontSize: 11,
                                color: '#8899aa',
                                lineHeight: 1.6,
                                marginBottom: 8,
                            }}
                        >
                            {event.summary}
                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {event.countries?.map((code) => (
                                    <span
                                        key={code}
                                        style={{
                                            fontSize: 9,
                                            padding: '2px 6px',
                                            background: 'rgba(78, 205, 196, 0.08)',
                                            border: '1px solid rgba(78, 205, 196, 0.15)',
                                            borderRadius: 2,
                                            color: '#4ECDC4',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        {code}
                                    </span>
                                ))}
                            </div>
                            <span style={{ fontSize: 9, color: '#556677' }}>{event.source}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
