'use client';
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { countries } from './data';

export default function Map({ onCountryClick, selectedCountry, highlightedCountries = [] }) {
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
                marker.bindTooltip(country.name, {
                    className: 'geo-tooltip',
                    direction: 'top',
                    offset: [0, -10],
                }).openTooltip();
            });

            marker.on('mouseout', () => {
                const isSelected = selectedCountry?.code === country.code;
                const isHighlighted = highlightedCountries.includes(country.code);
                marker.setStyle({
                    radius: isSelected ? 10 : isHighlighted ? 9 : 6,
                    fillOpacity: isSelected ? 1 : isHighlighted ? 1 : 0.8,
                });
                marker.closeTooltip();
            });

            markersRef.current[country.code] = marker;
        });
    }, []);

    // Update marker styles when selection or highlights change
    useEffect(() => {
        Object.entries(markersRef.current).forEach(([code, marker]) => {
            const country = countries.find((c) => c.code === code);
            if (code === selectedCountry?.code) {
                marker.setStyle({
                    radius: 10,
                    fillOpacity: 1,
                    weight: 2,
                    color: country.color,
                    fillColor: country.color,
                });
            } else if (highlightedCountries.includes(code)) {
                marker.setStyle({
                    radius: 9,
                    fillOpacity: 1,
                    weight: 2,
                    color: '#FFD93D',
                    fillColor: '#FFD93D',
                });
            } else {
                marker.setStyle({
                    radius: 6,
                    fillOpacity: 0.8,
                    weight: 1,
                    color: country.color,
                    fillColor: country.color,
                });
            }
        });
    }, [selectedCountry, highlightedCountries]);

    return (
        <>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            <style>{`
        .geo-tooltip {
          background: rgba(10, 14, 23, 0.9) !important;
          border: 1px solid rgba(78, 205, 196, 0.3) !important;
          color: #4ECDC4 !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          box-shadow: none !important;
        }
        .geo-tooltip::before {
          border-top-color: rgba(78, 205, 196, 0.3) !important;
        }
      `}</style>
        </>
    );
}