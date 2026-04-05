import Image from "next/image";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e17',
      color: '#c8d6e5',
      fontFamily: "'JetBrains Mono', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: '#4ECDC4',
        boxShadow: '0 0 20px #4ECDC4',
        marginBottom: 24,
      }} />
      <h1 style={{
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: 8,
        color: '#4ECDC4',
        margin: 0,
      }}>
        GEOSCOPE
      </h1>
      <p style={{
        fontSize: 12,
        letterSpacing: 4,
        color: '#556677',
        marginTop: 8,
      }}>
        GEOPOLITICAL INTELLIGENCE PLATFORM
      </p>
      <p style={{
        fontSize: 14,
        color: '#556677',
        marginTop: 40,
      }}>
        v0.1 — launching soon
      </p>
    </div>
  );
}