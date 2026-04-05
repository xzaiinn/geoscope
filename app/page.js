'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#0a0e17',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#4ECDC4', boxShadow: '0 0 10px #4ECDC4',
        }} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, color: '#4ECDC4' }}>
          GEOSCOPE
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Map />
      </div>
    </div>
  );
}