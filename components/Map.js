'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { countries } from './data';

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