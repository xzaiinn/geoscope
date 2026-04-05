import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';

export const metadata = {
  title: 'GeoScope',
  description: 'Geopolitical Intelligence Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}