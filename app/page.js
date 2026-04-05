'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';
import EventsFeed from '../components/EventsFeed';
import { countries } from '../components/data';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [highlightedCountries, setHighlightedCountries] = useState([]);

  const handleEventClick = (event) => {
    // Highlight countries involved in the event on the map
    if (event.countries && event.countries.length > 0) {
      setHighlightedCountries(event.countries);

      // If only one country involved, select it
      if (event.countries.length === 1) {
        const country = countries.find((c) => c.code === event.countries[0]);
        if (country) setSelectedCountry(country);
      }
    }
  };

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
          background:
            'linear-gradient(180deg, rgba(78, 205, 196, 0.05) 0%, transparent 100%)',
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
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              color: '#4ECDC4',
            }}
          >
            GEOSCOPE
          </span>
          <span style={{ fontSize: 10, color: '#556677', letterSpacing: 2 }}>
            LIVE GEOPOLITICAL SCREENER
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {selectedCountry && (
            <div style={{ fontSize: 11, color: '#556677' }}>
              VIEWING:{' '}
              <span style={{ color: selectedCountry.color, fontWeight: 600 }}>
                {selectedCountry.name}
              </span>
            </div>
          )}
          {highlightedCountries.length > 0 && !selectedCountry && (
            <div style={{ fontSize: 11, color: '#556677' }}>
              EVENT:{' '}
              <span style={{ color: '#FFD93D', fontWeight: 600 }}>
                {highlightedCountries.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content: 3-column layout */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left: Events Feed */}
        <EventsFeed
          onEventClick={handleEventClick}
          selectedCountry={selectedCountry}
        />

        {/* Center: Map */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <Map
            onCountryClick={(country) => {
              setSelectedCountry(country);
              setHighlightedCountries([]);
            }}
            selectedCountry={selectedCountry}
            highlightedCountries={highlightedCountries}
          />
        </div>

        {/* Right: Country Sidebar */}
        {selectedCountry && (
          <Sidebar
            country={selectedCountry}
            countries={countries}
            onClose={() => {
              setSelectedCountry(null);
              setHighlightedCountries([]);
            }}
          />
        )}
      </div>
    </div>
  );
}
