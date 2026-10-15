"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    area: '',
    monthlyRent: '',
    deposit: '',
    availableFrom: '',
    roomType: 'PRIVATE',
    furnished: 'SEMI',
    preferredGender: 'ANY'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        monthlyRent: parseInt(formData.monthlyRent),
        deposit: parseInt(formData.deposit),
        availableFrom: new Date(formData.availableFrom).toISOString(),
      };

      const res = await apiFetch('/rooms', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      router.push(`/rooms/${res.room.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Post a Room Listing</h1>
        <p className="mt-2 text-sm text-gray-500">Looking for a flatmate? Let people know what's available.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Listing Title</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. 2BHK — 10 min from campus" className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Description</label>
          <textarea required name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe the room, amenities, and what kind of flatmate you're looking for..." className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Area / Locality</label>
            <input required type="text" name="area" value={formData.area} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Monthly Rent (₹)</label>
            <input required type="number" min="0" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Security Deposit (₹)</label>
            <input required type="number" min="0" name="deposit" value={formData.deposit} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Available From</label>
          <input required type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Room Type</label>
            <select name="roomType" value={formData.roomType} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm bg-white">
              <option value="PRIVATE">Private Room</option>
              <option value="SHARED">Shared Room</option>
              <option value="PG">PG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Furnishing</label>
            <select name="furnished" value={formData.furnished} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm bg-white">
              <option value="FULLY">Fully Furnished</option>
              <option value="SEMI">Semi Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Preferred Gender</label>
            <select name="preferredGender" value={formData.preferredGender} onChange={handleChange} className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm bg-white">
              <option value="ANY">Any</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:opacity-70">
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
