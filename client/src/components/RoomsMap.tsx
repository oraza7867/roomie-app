"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { CAMPUS } from '@/lib/campus';

interface RoomListingItem {
  id: string;
  title: string;
  locality?: string;
  city?: string;
  area: string;
  lat?: number;
  lng?: number;
  distanceFromCampusKm?: number;
  monthlyRent: number;
  deposit: number;
  roomType: string;
  furnished: string;
}

interface RoomsMapProps {
  rooms: RoomListingItem[];
}

function RecenterControl({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right" style={{ margin: '10px' }}>
      <button
        type="button"
        onClick={() => map.flyTo([lat, lng], 14, { duration: 0.8 })}
        className="bg-[#ffffff] border border-[#e7e5df] text-[#1c1917] hover:bg-[#faf8f5] text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm pointer-events-auto"
      >
        Center on Campus
      </button>
    </div>
  );
}

export default function RoomsMap({ rooms }: RoomsMapProps) {
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
        className: 'custom-campus-marker',
        html: `<div style="background-color:#1c1917;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace;border:1px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);display:flex;align-items:center;gap:5px;white-space:nowrap;"><span style="width:6px;height:6px;background-color:#22c55e;border-radius:50%;display:inline-block;"></span><span>${CAMPUS.short} CAMPUS</span></div>`,
        iconSize: [110, 26],
        iconAnchor: [55, 13],
      }),
    []
  );

  if (!mounted) {
    return (
      <div className="h-[520px] bg-[#ffffff] border border-[#e7e5df] rounded-md flex items-center justify-center text-xs text-[#78716c]">
        Loading campus map...
      </div>
    );
  }

  // Filter rooms with valid coordinates only
  const validRooms = rooms.filter(
    (r) => typeof r.lat === 'number' && typeof r.lng === 'number' && !isNaN(r.lat) && !isNaN(r.lng)
  );

  return (
    <div className="relative w-full h-[520px] rounded-md overflow-hidden border border-[#e7e5df] bg-[#ffffff] shadow-none">
      <MapContainer
        center={[CAMPUS.lat, CAMPUS.lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterControl lat={CAMPUS.lat} lng={CAMPUS.lng} />

        {/* Campus marker */}
        <Marker position={[CAMPUS.lat, CAMPUS.lng]} icon={campusIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1">
              <div className="font-bold text-xs text-[#1c1917]">{CAMPUS.name}</div>
              <p className="text-[11px] text-[#57534e] mt-0.5">
                Main Gate / Campus Center · Kursi Road
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Room markers — icons created inline to avoid module-level Leaflet init issues */}
        {validRooms.map((room) => (
          <Marker
            key={room.id}
            position={[room.lat!, room.lng!]}
            icon={L.divIcon({
              className: 'custom-room-marker',
              html: `<div style="background-color:#b4431e;color:#fff;padding:3px 6px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace;border:1px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);white-space:nowrap;cursor:pointer;">₹${room.monthlyRent}</div>`,
              iconSize: [60, 24],
              iconAnchor: [30, 12],
            })}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-[200px]">
                <div className="font-bold text-xs text-[#1c1917] line-clamp-1">
                  {room.title}
                </div>
                <div className="text-[11px] text-[#78716c] mt-0.5">
                  {room.locality || room.city || 'Near Campus'} · {room.area}
                </div>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="font-bold text-xs text-[#1c1917]">₹{room.monthlyRent}</span>
                  <span className="text-[10px] text-[#78716c]">/month</span>
                </div>
                {room.distanceFromCampusKm !== undefined && (
                  <div className="text-[11px] text-[#b4431e] font-medium mt-1">
                    {room.distanceFromCampusKm} km from campus
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-[#e7e5df]">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="inline-block text-[11px] font-medium text-[#b4431e] hover:underline"
                  >
                    View Room Listing &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
