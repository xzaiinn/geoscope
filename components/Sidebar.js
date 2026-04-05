'use client';

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

export { relationships };

const REL_COLORS = {
  alliance: '#4ECDC4',
  rivalry: '#FF6B6B',
  conflict: '#FF0000',
  complex: '#FFD93D',
};

export default function Sidebar({ country, onClose, countries }) {
  if (!country) return null;

  const countryRels = relationships.filter(
    (r) => r.from === country.code || r.to === country.code
  );

  const getCountryName = (code) => {
    const c = countries?.find((c) => c.code === code);
    return c ? c.name : code;
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
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(78, 205, 196, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: country.color,
                letterSpacing: 1,
              }}
            >
              {country.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#556677',
                marginTop: 4,
                letterSpacing: 3,
              }}
            >
              {country.region.toUpperCase()}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#FF6B6B',
              width: 28,
              height: 28,
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Relationships */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            fontSize: 10,
            color: '#556677',
            letterSpacing: 3,
            marginBottom: 12,
          }}
        >
          KEY RELATIONSHIPS
        </div>

        {countryRels.length > 0 ? (
          countryRels.map((rel, i) => {
            const otherCode = rel.from === country.code ? rel.to : rel.from;
            const otherName = getCountryName(otherCode);
            return (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  marginBottom: 6,
                  background: 'rgba(78, 205, 196, 0.04)',
                  borderRadius: 4,
                  borderLeft: `3px solid ${REL_COLORS[rel.type]}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#c8d6e5' }}>{otherName}</span>
                  <span
                    style={{
                      fontSize: 9,
                      color: REL_COLORS[rel.type],
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontWeight: 600,
                    }}
                  >
                    {rel.type}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#556677', marginTop: 4 }}>
                  {rel.label}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ fontSize: 12, color: '#556677', fontStyle: 'italic' }}>
            No tracked relationships yet
          </div>
        )}
      </div>

      {/* AI Briefing button (coming tomorrow) */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(78, 205, 196, 0.1)',
            border: '1px solid rgba(78, 205, 196, 0.3)',
            color: '#4ECDC4',
            borderRadius: 4,
            fontSize: 11,
            cursor: 'pointer',
            letterSpacing: 2,
            fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          ◆ AI BRIEFING — COMING SOON
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(78, 205, 196, 0.1)',
          marginTop: 'auto',
        }}
      >
        <div style={{ fontSize: 9, color: '#556677', letterSpacing: 2, marginBottom: 8 }}>
          LEGEND
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries(REL_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 3, background: color, borderRadius: 1 }} />
              <span style={{ fontSize: 9, color: '#556677', textTransform: 'uppercase', letterSpacing: 1 }}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}