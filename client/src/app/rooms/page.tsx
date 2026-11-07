"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getRooms } from '@/lib/api';
import Link from 'next/link';
import { CAMPUS, LOCALITIES } from '@/lib/campus';
import { MapPin, Plus, List, Map as MapIcon } from 'lucide-react';

const RoomsMap = dynamic(() => import('@/components/RoomsMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-[#ffffff] border border-[#e7e5df] rounded-md flex items-center justify-center text-xs text-[#78716c]">
      Loading campus map...
    </div>
  ),
});

interface Room {
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
  images?: string[];
  owner: {
    name: string;
  };
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Filters
  const [locality, setLocality] = useState('');
  const [area, setArea] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState('');
  const [roomType, setRoomType] = useState('');
  const [furnished, setFurnished] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms({
        locality: locality || undefined,
        area: area || undefined,
        maxRent: maxRent || undefined,
        maxDistanceKm: maxDistanceKm || undefined,
        roomType: roomType || undefined,
        furnished: furnished || undefined,
      });
      setRooms(data.rooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [locality, area, maxRent, maxDistanceKm, roomType, furnished]);

  const hasActiveFilters = Boolean(locality || area || maxRent || maxDistanceKm || roomType || furnished);

  const clearFilters = () => {
    setLocality('');
    setArea('');
    setMaxRent('');
    setMaxDistanceKm('');
    setRoomType('');
    setFurnished('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 border-b border-[#e7e5df] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917]">
            Rooms near {CAMPUS.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#57534e]">
            Student flats, shared rooms, and PGs around Kursi Road, Dasauli, and Matiyari.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* List / Map Toggle */}
          <div className="inline-flex items-center p-0.5 bg-[#ffffff] border border-[#e7e5df] rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#1c1917] text-white'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#1c1917] text-white'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Map
            </button>
          </div>

          <Link
            href="/rooms/create"
            className="inline-flex items-center gap-1.5 bg-[#b4431e] hover:bg-[#963515] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors border border-[#b4431e]"
          >
            <Plus className="w-3.5 h-3.5" />
            Post a Room
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] p-3.5 rounded-md border border-[#e7e5df] mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          <select 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          >
            <option value="">All Localities</option>
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(e.target.value)}
          >
            <option value="">Distance from campus</option>
            <option value="0.5">Within 0.5 km</option>
            <option value="1">Within 1 km</option>
            <option value="2">Within 2 km</option>
            <option value="3">Within 3 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>

          <input 
            type="text" 
            placeholder="Landmark (e.g. Gate 2)" 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#b4431e]"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <input 
            type="number" 
            placeholder="Max Rent (₹)" 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#b4431e]"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
          />

          <select 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Any Room Type</option>
            <option value="PRIVATE">Private Room</option>
            <option value="SHARED">Shared Room</option>
            <option value="PG">PG</option>
          </select>

          <select 
            className="rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            value={furnished}
            onChange={(e) => setFurnished(e.target.value)}
          >
            <option value="">Any Furnishing</option>
            <option value="FULLY">Fully Furnished</option>
            <option value="SEMI">Semi Furnished</option>
            <option value="UNFURNISHED">Unfurnished</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-2.5 pt-2 border-t border-[#f0ede6] flex justify-between items-center text-xs">
            <span className="text-[#78716c]">Filters applied</span>
            <button
              onClick={clearFilters}
              className="text-[#b4431e] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-[#78716c]">
            <span>Showing {rooms.length} room{rooms.length === 1 ? '' : 's'} near campus</span>
            <span className="font-mono text-[11px]">Click pin to preview</span>
          </div>
          <RoomsMap rooms={rooms} />
        </div>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-[#ffffff] rounded-md border border-[#e7e5df] h-64 animate-pulse"></div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-[#ffffff] border border-[#e7e5df] rounded-md p-10 text-center max-w-lg mx-auto">
          <h3 className="text-sm font-bold text-[#1c1917] mb-1">No rooms match these filters</h3>
          <p className="text-xs text-[#57534e] leading-relaxed mb-4">
            Try loosening the distance limit or clearing the landmark filter. If you have an empty room near campus or need someone to take over a lease, list it here.
          </p>
          <div className="flex justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#57534e] border border-[#e7e5df] hover:border-[#d3cfc7] px-3 py-1.5 rounded-md"
              >
                Clear filters
              </button>
            )}
            <Link
              href="/rooms/create"
              className="text-xs text-white bg-[#b4431e] hover:bg-[#963515] px-3 py-1.5 rounded-md font-medium"
            >
              Post a room
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`} className="group block h-full">
              <div className="bg-[#ffffff] rounded-md border border-[#e7e5df] hover:border-[#d3cfc7] transition-all hover:shadow-sm overflow-hidden h-full flex flex-col justify-between">
                {/* Room Image Banner */}
                <div className="h-40 w-full relative bg-[#f5f5f4] overflow-hidden">
                  <img
                    src={room.images && room.images.length > 0 ? room.images[0] : '/student_room_hero.jpg'}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-mono text-[10px] font-semibold text-[#1c1917] bg-white/95 backdrop-blur-xs border border-[#e7e5df] px-2 py-0.5 rounded shadow-xs uppercase">
                      {room.roomType}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[11px] font-medium text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                      {room.locality || room.city || 'Near Campus'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-grow">
                  <h3 className="text-base font-bold text-[#1c1917] group-hover:text-[#b4431e] transition-colors leading-snug line-clamp-1">
                    {room.title}
                  </h3>

                  {room.distanceFromCampusKm !== undefined && (
                    <div className="mt-2.5 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium bg-[#fbf2ec] text-[#b4431e] border border-[#f5ded0]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{room.distanceFromCampusKm} km from campus</span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-[#1c1917]">₹{room.monthlyRent}</span>
                    <span className="text-xs text-[#78716c]">/month</span>
                  </div>
                  <p className="text-xs text-[#78716c] mt-0.5">Deposit: ₹{room.deposit}</p>
                </div>
                
                <div className="p-3 border-t border-[#e7e5df] bg-[#faf8f5] text-xs text-[#78716c] flex justify-between items-center">
                  <span className="capitalize">{room.furnished.toLowerCase().replace('_', ' ')} furnished</span>
                  <span className="font-medium text-[#1c1917]">{room.owner.name.split(' ')[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
