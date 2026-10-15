"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface Room {
  id: string;
  title: string;
  city: string;
  area: string;
  monthlyRent: number;
  deposit: number;
  roomType: string;
  furnished: string;
  owner: {
    name: string;
  };
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [roomType, setRoomType] = useState('');
  const [furnished, setFurnished] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (city) query.append('city', city);
      if (area) query.append('area', area);
      if (maxRent) query.append('maxRent', maxRent);
      if (roomType) query.append('roomType', roomType);
      if (furnished) query.append('furnished', furnished);

      const data = await apiFetch(`/rooms?${query.toString()}`);
      setRooms(data.rooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [city, area, maxRent, roomType, furnished]); // auto-fetch when filters change

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="sm:flex sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Browse Rooms</h1>
          <p className="mt-2 text-sm text-gray-500">Find the perfect flat, PG, or shared room.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/rooms/create"
            className="inline-flex rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600 transition-colors"
          >
            Post a Listing
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="City (e.g. Lucknow)" 
          className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Locality / Area (e.g. Gomti Nagar)" 
          className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Max Rent (₹)" 
          className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        />
        <select 
          className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm bg-white"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option value="">Any Room Type</option>
          <option value="PRIVATE">Private Room</option>
          <option value="SHARED">Shared Room</option>
          <option value="PG">PG</option>
        </select>
        <select 
          className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm bg-white"
          value={furnished}
          onChange={(e) => setFurnished(e.target.value)}
        >
          <option value="">Any Furnishing</option>
          <option value="FULLY">Fully Furnished</option>
          <option value="SEMI">Semi Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => <div key={n} className="bg-white rounded-2xl border border-gray-200 h-64 animate-pulse"></div>)}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`} className="group block h-full">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col hover:border-orange-300 hover:shadow-md transition-all">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10">
                      {room.roomType}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">{room.city} • {room.area}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {room.title}
                  </h3>
                  
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-gray-900">₹{room.monthlyRent}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Deposit: ₹{room.deposit}</p>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600 flex justify-between">
                  <span>{room.furnished.toLowerCase().replace('_', ' ')} furnished</span>
                  <span className="font-medium text-gray-900">Listed by {room.owner.name.split(' ')[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
