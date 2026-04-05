'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import { countries } from '../components/Map';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: '#0a0e17',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(78, 205, 196, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(78, 205, 196, 0.05) 0%, transparent 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4ECDC4',
              boxShadow: '0 0 10px #4ECDC4',
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, color: '#4ECDC4' }}>
            GEOSCOPE
          </span>
          <span style={{ fontSize: 10, color: '#556677', letterSpacing: 2 }}>
            INTELLIGENCE PLATFORM v0.1
          </span>
        </div>

        {selectedCountry && (
          <div style={{ fontSize: 11, color: '#556677' }}>
            VIEWING: <span style={{ color: selectedCountry.color, fontWeight: 600 }}>{selectedCountry.name}</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Map */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <Map
            onCountryClick={(country) => setSelectedCountry(country)}
            selectedCountry={selectedCountry}
          />
        </div>

        {/* Sidebar */}
        {selectedCountry && (
          <Sidebar
            country={selectedCountry}
            countries={countries}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </div>
    </div>
  );
}