'use client';

import { useState } from 'react';

const relationships = [
  { from: 'US', to: 'GB', type: 'alliance', label: 'Special Relationship / NATO' },
  { from: 'US', to: 'JP', type: 'alliance', label: 'Security Treaty' },
  { from: 'US', to: 'KR', type: 'alliance', label: 'Mutual Defense' },
  { from: 'US', to: 'CN', type: 'rivalry', label: 'Strategic Competition' },
  { from: 'US', to: 'RU', type: 'rivalry', label: 'Geopolitical Rivalry' },
  { from: 'US', to: 'TW', type: 'alliance', label: 'Taiwan Relations Act' },
  { from: 'US', to: 'IL', type: 'alliance', label: 'Strategic Partnership' },
  { from: 'US', to: 'SA', type: 'complex', label: 'Oil & Security Partnership' },
  { from: 'US', to: 'AU', type: 'alliance', label: 'AUKUS / Five Eyes' },
  { from: 'US', to: 'IN', type: 'alliance', label: 'QUAD Partnership' },
  { from: 'CN', to: 'RU', type: 'alliance', label: 'Strategic Partnership' },
  { from: 'CN', to: 'TW', type: 'rivalry', label: 'Territorial Claim' },
  { from: 'CN', to: 'IN', type: 'rivalry', label: 'Border Disputes' },
  { from: 'CN', to: 'JP', type: 'rivalry', label: 'Regional Competition' },
  { from: 'RU', to: 'UA', type: 'conflict', label: 'Active Conflict' },
  { from: 'RU', to: 'DE', type: 'complex', label: 'Energy Dependency (Historical)' },
  { from: 'IN', to: 'PK', type: 'rivalry', label: 'Kashmir Dispute' },
  { from: 'IL', to: 'IR', type: 'rivalry', label: 'Regional Confrontation' },
  { from: 'SA', to: 'IR', type: 'rivalry', label: 'Sectarian & Regional Rivalry' },
  { from: 'DE', to: 'FR', type: 'alliance', label: 'EU Core / Franco-German Motor' },
  { from: 'GB', to: 'AU', type: 'alliance', label: 'AUKUS / Five Eyes' },
  { from: 'JP', to: 'AU', type: 'alliance', label: 'QUAD Partnership' },
  { from: 'TR', to: 'RU', type: 'complex', label: 'Pragmatic Engagement' },
  { from: 'BR', to: 'CN', type: 'complex', label: 'BRICS / Trade' },
  { from: 'EG', to: 'SA', type: 'alliance', label: 'Arab Alignment' },
];

const REL_COLORS = {
  alliance: '#4ECDC4',
  rivalry: '#FF6B6B',
  conflict: '#FF0000',
  complex: '#FFD93D',
};

const MODULES = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'Historical' },
  { id: 'economy', label: 'Economic' },
  { id: 'military', label: 'Military' },
  { id: 'alliances', label: 'Alliances' },
];

export default function Sidebar({ country, onClose, countries }) {
  const [activeTab, setActiveTab] = useState('relations');
  const [activeModule, setActiveModule] = useState('overview');
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!country) return null;

  const countryRels = relationships.filter(
    (r) => r.from === country.code || r.to === country.code
  );

  const getCountryName = (code) => {
    const c = countries?.find((c) => c.code === code);
    return c ? c.name : code;
  };

  const fetchBriefing = async (mod) => {
    setLoading(true);
    setBriefing(null);
    setActiveModule(mod);
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: country.name, module: mod }),
      });
      const data = await res.json();
      setBriefing(data.briefing);
    } catch (err) {
      setBriefing('Error generating briefing.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: 340,
        background: 'rgba(10, 14, 23, 0.95)',
        borderLeft: '1px solid rgba(78, 205, 196, 0.15)',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(78, 205, 196, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: country.color, letterSpacing: 1 }}>
              {country.name}
            </div>
            <div style={{ fontSize: 10, color: '#556677', marginTop: 4, letterSpacing: 3 }}>
              {country.region.toUpperCase()}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#FF6B6B',
              width: 28, height: 28, borderRadius: 4,
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(78, 205, 196, 0.1)' }}>
        {[
          { id: 'relations', label: '⟷ RELATIONS' },
          { id: 'briefing', label: '◆ BRIEFING' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'briefing' && !briefing && !loading) {
                fetchBriefing('overview');
              }
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: activeTab === tab.id ? 'rgba(78, 205, 196, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4ECDC4' : '2px solid transparent',
              color: activeTab === tab.id ? '#4ECDC4' : '#556677',
              fontSize: 10, cursor: 'pointer', letterSpacing: 2,
              fontFamily: 'inherit', fontWeight: activeTab === tab.id ? 700 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {activeTab === 'relations' && (
          <div>
            <div style={{ fontSize: 10, color: '#556677', letterSpacing: 3, marginBottom: 12 }}>
              KEY RELATIONSHIPS
            </div>
            {countryRels.length > 0 ? (
              countryRels.map((rel, i) => {
                const otherCode = rel.from === country.code ? rel.to : rel.from;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px', marginBottom: 6,
                      background: 'rgba(78, 205, 196, 0.04)', borderRadius: 4,
                      borderLeft: `3px solid ${REL_COLORS[rel.type]}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#c8d6e5' }}>{getCountryName(otherCode)}</span>
                      <span style={{
                        fontSize: 9, color: REL_COLORS[rel.type],
                        textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600,
                      }}>
                        {rel.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#556677', marginTop: 4 }}>{rel.label}</div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: 12, color: '#556677', fontStyle: 'italic' }}>
                No tracked relationships yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'briefing' && (
          <div>
            {/* Module selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
              {MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => fetchBriefing(mod.id)}
                  style={{
                    padding: '6px 10px',
                    background: activeModule === mod.id ? 'rgba(78, 205, 196, 0.15)' : 'rgba(78, 205, 196, 0.04)',
                    border: activeModule === mod.id
                      ? '1px solid rgba(78, 205, 196, 0.4)'
                      : '1px solid rgba(78, 205, 196, 0.1)',
                    color: activeModule === mod.id ? '#4ECDC4' : '#556677',
                    borderRadius: 3, fontSize: 10, cursor: 'pointer',
                    fontFamily: 'inherit', letterSpacing: 1,
                  }}
                >
                  {mod.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 10, color: '#556677', letterSpacing: 2 }}>
                  GENERATING BRIEFING...
                </div>
              </div>
            ) : briefing ? (
              <div style={{ fontSize: 12, lineHeight: 1.8, color: '#c8d6e5', whiteSpace: 'pre-wrap' }}>
                {briefing}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#556677', fontSize: 11 }}>
                Select a module above
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}