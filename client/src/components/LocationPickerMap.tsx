"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CAMPUS } from '@/lib/campus';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      const newLat = Math.round(e.latlng.lat * 10000) / 10000;
      const newLng = Math.round(e.latlng.lng * 10000) / 10000;
      onChange(newLat, newLng);
    },
  });
  return null;
}

export default function LocationPickerMap({ lat, lng, onChange }: LocationPickerMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Icons MUST be created inside the component with useMemo (not at module level).
  // Module-level L.divIcon() calls run before Leaflet's DOM panes are ready,
  // causing "this.getPane().appendChild" / "getPane is undefined" errors.
  const campusIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-campus-picker-marker',
        html: `<div style="background-color:#1c1917;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;border:1px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);white-space:nowrap;">${CAMPUS.short} Campus</div>`,
        iconSize: [80, 22],
        iconAnchor: [40, 11],
      }),
    []
  );

  const pinIcon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-selected-picker-marker',
        html: `<div style="background-color:#b4431e;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace;border:1px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.3);white-space:nowrap;cursor:grab;">Room Location</div>`,
        iconSize: [95, 26],
        iconAnchor: [47, 13],
      }),
    []
  );

  if (!mounted) {
    return (
      <div className="h-[280px] bg-[#faf8f5] border border-[#e7e5df] rounded-md flex items-center justify-center text-xs text-[#78716c]">
        Loading location picker...
      </div>
    );
  }

  const currentLat = lat || CAMPUS.lat;
  const currentLng = lng || CAMPUS.lng;

  return (
    <div className="space-y-2">
      <div className="relative w-full h-[300px] rounded-md overflow-hidden border border-[#e7e5df] bg-[#ffffff]">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-0 cursor-crosshair"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onChange={onChange} />

          {/* Campus orientation marker */}
          <Marker position={[CAMPUS.lat, CAMPUS.lng]} icon={campusIcon}>
            <Popup>
              <span className="text-xs font-semibold">{CAMPUS.name} Center</span>
            </Popup>
          </Marker>

          {/* Draggable selected location marker */}
          <Marker
            position={[currentLat, currentLng]}
            icon={pinIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target;
                const pos = marker.getLatLng();
                const newLat = Math.round(pos.lat * 10000) / 10000;
                const newLng = Math.round(pos.lng * 10000) / 10000;
                onChange(newLat, newLng);
              },
            }}
          >
            <Popup>
              <span className="text-xs">Selected Location</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="flex justify-between items-center text-xs text-[#78716c]">
        <span>Click on map or drag pin to choose room location</span>
        <span className="font-mono text-[11px] bg-[#ffffff] border border-[#e7e5df] px-2 py-0.5 rounded">
          {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
