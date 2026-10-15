"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await apiFetch(`/rooms/${id}`);
        setRoom(data.room);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    setDeleting(true);
    try {
      await apiFetch(`/rooms/${id}`, { method: 'DELETE' });
      router.push('/rooms');
    } catch (err: any) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse bg-gray-200 h-96 rounded-xl"></div>;
  if (error || !room) return <div className="text-center py-20 text-red-600">{error || "Room not found"}</div>;

  const isOwner = user?.id === room.ownerId;
  const availableDate = new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10">
              {room.roomType}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${room.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'}`}>
              {room.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{room.title}</h1>
          <p className="text-gray-500 mt-1">{room.city} • {room.area}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2 shrink-0">
            {/* 
              We could add an edit button here that routes to /rooms/[id]/edit 
              For this phase, delete is implemented to satisfy "delete their own listing" requirement.
            */}
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete Listing'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">About this room</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{room.description}</p>
            
            <div className="grid grid-cols-2 gap-y-4 mt-8 pt-8 border-t border-gray-100">
              <div>
                <span className="block text-sm text-gray-500">Furnishing</span>
                <span className="font-medium text-gray-900">{room.furnished.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Available From</span>
                <span className="font-medium text-gray-900">{availableDate}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Preferred Gender</span>
                <span className="font-medium text-gray-900">{room.preferredGender}</span>
              </div>
            </div>
          </div>
          {/* Interactive Map Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🗺 Neighborhood & Campus Location</span>
            </h2>
            <p className="text-sm text-gray-500">
              Located near <span className="font-semibold text-gray-900">{room.area}, {room.city}</span>.
            </p>
            <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <iframe
                title="Room Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(room.area + ', ' + room.city + ', India')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <div className="flex items-baseline gap-2 border-b border-gray-100 pb-4 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">₹{room.monthlyRent}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="text-sm text-gray-700 mb-6">
              Security Deposit: <span className="font-semibold">₹{room.deposit}</span>
            </div>
            
            {!isOwner && (
              <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-sm">
                Message Owner
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Listed By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold">
                  {room.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{room.owner.name}</div>
                  <div className="text-xs text-gray-500">{room.owner.college}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
