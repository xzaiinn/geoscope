'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const countries = [
    { name: 'United States', lat: 39.8, lng: -98.5, color: '#4ECDC4' },
    { name: 'China', lat: 35.8, lng: 104.1, color: '#FFEAA7' },
    { name: 'Russia', lat: 61.5, lng: 105.3, color: '#D5DBDB' },
    { name: 'United Kingdom', lat: 55.3, lng: -3.4, color: '#96CEB4' },
    { name: 'India', lat: 20.5, lng: 78.9, color: '#DDA0DD' },
    { name: 'Japan', lat: 36.2, lng: 138.2, color: '#FFEAA7' },
    { name: 'Germany', lat: 51.1, lng: 10.4, color: '#96CEB4' },
    { name: 'France', lat: 46.2, lng: 2.2, color: '#96CEB4' },
    { name: 'Brazil', lat: -14.2, lng: -51.9, color: '#45B7D1' },
    { name: 'Australia', lat: -25.2, lng: 133.7, color: '#AED6F1' },
    { name: 'Saudi Arabia', lat: 23.8, lng: 45.0, color: '#F1948A' },
    { name: 'Iran', lat: 32.4, lng: 53.6, color: '#F1948A' },
    { name: 'Turkey', lat: 38.9, lng: 35.2, color: '#E8DAEF' },
    { name: 'Ukraine', lat: 48.3, lng: 31.1, color: '#96CEB4' },
    { name: 'Israel', lat: 31.0, lng: 34.8, color: '#F1948A' },
    { name: 'Taiwan', lat: 23.6, lng: 120.9, color: '#FFEAA7' },
    { name: 'South Korea', lat: 35.9, lng: 127.7, color: '#FFEAA7' },
    { name: 'Pakistan', lat: 30.3, lng: 69.3, color: '#DDA0DD' },
    { name: 'Nigeria', lat: 9.0, lng: 8.6, color: '#A9DFBF' },
    { name: 'Egypt', lat: 26.8, lng: 30.8, color: '#F5CBA7' },
    { name: 'South Africa', lat: -30.5, lng: 22.9, color: '#A9DFBF' },
    { name: 'Mexico', lat: 23.6, lng: -102.5, color: '#4ECDC4' },
    { name: 'Canada', lat: 56.1, lng: -106.3, color: '#4ECDC4' },
    { name: 'Indonesia', lat: -0.7, lng: 113.9, color: '#F0B27A' },
    { name: 'Argentina', lat: -38.4, lng: -63.6, color: '#45B7D1' },
    { name: 'Italy', lat: 41.8, lng: 12.5, color: '#96CEB4' },
    { name: 'Spain', lat: 40.4, lng: -3.7, color: '#96CEB4' },
    { name: 'Poland', lat: 51.9, lng: 19.1, color: '#96CEB4' },
    { name: 'UAE', lat: 23.4, lng: 53.8, color: '#F1948A' },
    { name: 'Singapore', lat: 1.3, lng: 103.8, color: '#F0B27A' },
];

export default function Map() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current, {
            center: [20, 0],
            zoom: 2,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap',
        }).addTo(mapInstance.current);

        countries.forEach((country) => {
            L.circleMarker([country.lat, country.lng], {
                radius: 6,
                color: country.color,
                fillColor: country.color,
                fillOpacity: 0.8,
                weight: 1,
            })
                .addTo(mapInstance.current)
                .bindPopup(`<strong>${country.name}</strong>`);
        });

    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}