import React, { useEffect, useRef } from 'react';

interface Props {
  center: { lat: number; lng: number };
  zoom?: number;
  markerColor?: string;
  markerPulseColor?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export const LeafletMap: React.FC<Props> = ({ 
    center, 
    zoom = 15, 
    markerColor = '#66BB6A', 
    markerPulseColor 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Determine pulse color (default to marker color if not provided)
  const pulseColor = markerPulseColor || markerColor;

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize Map
    if (!mapInstance.current) {
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true
      }).setView([center.lat, center.lng], zoom);

      // Use CartoDB Voyager tiles for a clean, modern look that matches the app better than standard OSM
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(mapInstance.current);
    } else {
        // Smooth fly to new location
        mapInstance.current.flyTo([center.lat, center.lng], zoom, {
            animate: true,
            duration: 1.5
        });
    }

    // Custom Icon HTML
    const iconHtml = `
      <div class="relative w-full h-full flex items-center justify-center">
        <div class="w-6 h-6 rounded-full border-4 border-white shadow-xl z-20 relative" style="background-color: ${markerColor}"></div>
        <div class="absolute w-20 h-20 rounded-full animate-ping opacity-60 z-10" style="background-color: ${pulseColor}"></div>
      </div>
    `;

    const customIcon = window.L.divIcon({
      className: 'custom-map-marker',
      html: iconHtml,
      iconSize: [80, 80],
      iconAnchor: [40, 40]
    });

    // Update Marker
    if (markerRef.current) {
        markerRef.current.setLatLng([center.lat, center.lng]);
        markerRef.current.setIcon(customIcon);
    } else {
        markerRef.current = window.L.marker([center.lat, center.lng], { icon: customIcon }).addTo(mapInstance.current);
    }

  }, [center.lat, center.lng, zoom, markerColor, pulseColor]);

  return <div ref={mapRef} className="w-full h-full absolute inset-0 z-0" />;
};