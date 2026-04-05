'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const countries = [
    { code: 'US', name: 'United States', lat: 39.8, lng: -98.5, region: 'North America', color: '#4ECDC4' },
    { code: 'CN', name: 'China', lat: 35.8, lng: 104.1, region: 'East Asia', color: '#FFEAA7' },
    { code: 'RU', name: 'Russia', lat: 61.5, lng: 105.3, region: 'Eurasia', color: '#D5DBDB' },
    { code: 'GB', name: 'United Kingdom', lat: 55.3, lng: -3.4, region: 'Europe', color: '#96CEB4' },
    { code: 'IN', name: 'India', lat: 20.5, lng: 78.9, region: 'South Asia', color: '#DDA0DD' },
    { code: 'JP', name: 'Japan', lat: 36.2, lng: 138.2, region: 'East Asia', color: '#FFEAA7' },
    { code: 'DE', name: 'Germany', lat: 51.1, lng: 10.4, region: 'Europe', color: '#96CEB4' },
    { code: 'FR', name: 'France', lat: 46.2, lng: 2.2, region: 'Europe', color: '#96CEB4' },
    { code: 'BR', name: 'Brazil', lat: -14.2, lng: -51.9, region: 'South America', color: '#45B7D1' },
    { code: 'AU', name: 'Australia', lat: -25.2, lng: 133.7, region: 'Oceania', color: '#AED6F1' },
    { code: 'SA', name: 'Saudi Arabia', lat: 23.8, lng: 45.0, region: 'Middle East', color: '#F1948A' },
    { code: 'IR', name: 'Iran', lat: 32.4, lng: 53.6, region: 'Middle East', color: '#F1948A' },
    { code: 'TR', name: 'Turkey', lat: 38.9, lng: 35.2, region: 'Middle East/Europe', color: '#E8DAEF' },
    { code: 'UA', name: 'Ukraine', lat: 48.3, lng: 31.1, region: 'Europe', color: '#96CEB4' },
    { code: 'IL', name: 'Israel', lat: 31.0, lng: 34.8, region: 'Middle East', color: '#F1948A' },
    { code: 'TW', name: 'Taiwan', lat: 23.6, lng: 120.9, region: 'East Asia', color: '#FFEAA7' },
    { code: 'KR', name: 'South Korea', lat: 35.9, lng: 127.7, region: 'East Asia', color: '#FFEAA7' },
    { code: 'PK', name: 'Pakistan', lat: 30.3, lng: 69.3, region: 'South Asia', color: '#DDA0DD' },
    { code: 'NG', name: 'Nigeria', lat: 9.0, lng: 8.6, region: 'Africa', color: '#A9DFBF' },
    { code: 'EG', name: 'Egypt', lat: 26.8, lng: 30.8, region: 'Middle East/Africa', color: '#F5CBA7' },
    { code: 'ZA', name: 'South Africa', lat: -30.5, lng: 22.9, region: 'Africa', color: '#A9DFBF' },
    { code: 'MX', name: 'Mexico', lat: 23.6, lng: -102.5, region: 'North America', color: '#4ECDC4' },
    { code: 'CA', name: 'Canada', lat: 56.1, lng: -106.3, region: 'North America', color: '#4ECDC4' },
    { code: 'ID', name: 'Indonesia', lat: -0.7, lng: 113.9, region: 'Southeast Asia', color: '#F0B27A' },
    { code: 'AR', name: 'Argentina', lat: -38.4, lng: -63.6, region: 'South America', color: '#45B7D1' },
    { code: 'IT', name: 'Italy', lat: 41.8, lng: 12.5, region: 'Europe', color: '#96CEB4' },
    { code: 'ES', name: 'Spain', lat: 40.4, lng: -3.7, region: 'Europe', color: '#96CEB4' },
    { code: 'PL', name: 'Poland', lat: 51.9, lng: 19.1, region: 'Europe', color: '#96CEB4' },
    { code: 'AE', name: 'UAE', lat: 23.4, lng: 53.8, region: 'Middle East', color: '#F1948A' },
    { code: 'SG', name: 'Singapore', lat: 1.3, lng: 103.8, region: 'Southeast Asia', color: '#F0B27A' },
];

// Export so other components can use it
export { countries };

export default function Map({ onCountryClick, selectedCountry }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});

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
            const marker = L.circleMarker([country.lat, country.lng], {
                radius: 6,
                color: country.color,
                fillColor: country.color,
                fillOpacity: 0.8,
                weight: 1,
            }).addTo(mapInstance.current);

            marker.on('click', () => {
                if (onCountryClick) onCountryClick(country);
            });

            marker.on('mouseover', () => {
                marker.setStyle({ radius: 10, fillOpacity: 1 });
            });

            marker.on('mouseout', () => {
                const isSelected = selectedCountry?.code === country.code;
                marker.setStyle({
                    radius: isSelected ? 10 : 6,
                    fillOpacity: isSelected ? 1 : 0.8,
                });
            });

            markersRef.current[country.code] = marker;
        });
    }, []);

    // Update marker styles when selection changes
    useEffect(() => {
        Object.entries(markersRef.current).forEach(([code, marker]) => {
            const country = countries.find(c => c.code === code);
            if (code === selectedCountry?.code) {
                marker.setStyle({ radius: 10, fillOpacity: 1, weight: 2 });
            } else {
                marker.setStyle({ radius: 6, fillOpacity: 0.8, weight: 1 });
            }
        });
    }, [selectedCountry]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}