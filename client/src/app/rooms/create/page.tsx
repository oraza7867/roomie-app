"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createRoom } from '@/lib/api';
import { CAMPUS, LOCALITIES } from '@/lib/campus';
import { ArrowLeft, Link2, Locate, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Extracts latitude and longitude from any Google Maps share URL.
 * Supports formats:
 *   https://maps.google.com/?q=26.9586,81.0001
 *   https://www.google.com/maps/@26.9586,81.0001,17z
 *   https://www.google.com/maps/place/.../@26.9586,81.0001,...
 *   https://maps.app.goo.gl/... (short links — cannot be parsed client-side, returns null)
 */
function parseGoogleMapsLink(url: string): { lat: number; lng: number } | null {
  try {
    // Format: ?q=LAT,LNG or ?q=LAT%2CLNG
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

    // Format: /@LAT,LNG,ZOOM  (Google Maps view)
    const atMatch = url.match(/\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

    // Format: /place/.../data=...!3dLAT!4dLNG
    const dataMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dataMatch) return { lat: parseFloat(dataMatch[1]), lng: parseFloat(dataMatch[2]) };

    // Format: ?ll=LAT,LNG (older Google Maps)
    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

    return null;
  } catch {
    return null;
  }
}

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] bg-[#faf8f5] border border-[#e7e5df] rounded-md flex items-center justify-center text-xs text-[#78716c]">
      Loading map picker...
    </div>
  ),
});

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Maps link state
  const [gmapsLink, setGmapsLink] = useState('');
  const [gmapsStatus, setGmapsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locality: LOCALITIES[0] as string,
    area: '',
    lat: CAMPUS.lat,
    lng: CAMPUS.lng,
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

  // Parse Google Maps link and update pin
  const handleGmapsLink = (url: string) => {
    setGmapsLink(url);
    if (!url.trim()) { setGmapsStatus('idle'); return; }
    const coords = parseGoogleMapsLink(url);
    if (coords) {
      setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }));
      setGmapsStatus('success');
    } else {
      setGmapsStatus('error');
    }
  };

  // Use browser GPS to get current location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsLoading(true);
    setGpsStatus('idle');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lng = Math.round(pos.coords.longitude * 10000) / 10000;
        setFormData(prev => ({ ...prev, lat, lng }));
        setGpsLoading(false);
        setGpsStatus('success');
        // clear google maps link if GPS is used
        setGmapsLink('');
        setGmapsStatus('idle');
      },
      () => {
        setGpsLoading(false);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const rent = parseFloat(formData.monthlyRent);
    const dep = parseFloat(formData.deposit);

    if (isNaN(rent) || rent <= 0) {
      setError('Please enter a valid monthly rent.');
      setLoading(false);
      return;
    }
    if (isNaN(dep) || dep < 0) {
      setError('Please enter a valid deposit amount.');
      setLoading(false);
      return;
    }
    if (!formData.availableFrom) {
      setError('Please select an available from date.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        lat: Number(formData.lat) || CAMPUS.lat,
        lng: Number(formData.lng) || CAMPUS.lng,
        monthlyRent: rent,
        deposit: dep,
        // Send as plain date string — server converts to Date object
        availableFrom: formData.availableFrom,
      };

      const res = await createRoom(payload);
      router.push(`/rooms/${res.room.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create listing. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">
      <div className="mb-6">
        <Link 
          href="/rooms" 
          className="inline-flex items-center gap-1.5 text-xs text-[#78716c] hover:text-[#1c1917] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to rooms
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#1c1917]">Post a Room Listing</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#57534e]">
          List what is available near {CAMPUS.name}. Another student can browse and contact you directly.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-[#ffffff] border border-[#e7e5df] rounded-md p-6 sm:p-8 space-y-5">
        {error && (
          <div className="bg-[#fef2f2] text-[#991b1b] p-3 rounded-md text-xs border border-[#fecaca]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#1c1917] mb-1">Listing Title</label>
          <input 
            required 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.g. Furnished 2BHK room — 5 min walk from Gate 1" 
            className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] focus:outline-none focus:border-[#b4431e]" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1c1917] mb-1">Description</label>
          <textarea 
            required 
            name="description" 
            rows={4} 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe room condition, Wi-Fi, kitchen access, electricity bill sharing, and preferred flatmate routine..." 
            className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] focus:outline-none focus:border-[#b4431e]" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Locality (near campus)</label>
            <select 
              required 
              name="locality" 
              value={formData.locality} 
              onChange={handleChange} 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            >
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Area / Landmark</label>
            <input 
              required 
              type="text" 
              name="area" 
              value={formData.area} 
              onChange={handleChange} 
              placeholder="e.g. Behind Gate 2, near Royal Cafe" 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] focus:outline-none focus:border-[#b4431e]" 
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="pt-2 space-y-3">
          <label className="block text-xs font-semibold text-[#1c1917]">
            Pin Your Building Location
          </label>

          {/* Method 1: Paste Google Maps Link */}
          <div className="bg-[#faf8f5] border border-[#e7e5df] rounded-md p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#1c1917]">
              <Link2 className="w-3.5 h-3.5 text-[#b4431e]" />
              Option 1 — Paste a Google Maps link
            </div>
            <p className="text-[11px] text-[#78716c]">
              Open Google Maps on your phone, search your building, tap <strong>Share</strong>, copy the link, and paste it here.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={gmapsLink}
                onChange={(e) => handleGmapsLink(e.target.value)}
                placeholder="https://maps.google.com/... or https://maps.app.goo.gl/..."
                className="flex-1 rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#b4431e] bg-white"
              />
            </div>
            {gmapsStatus === 'success' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Location extracted — pin updated on map below!
              </div>
            )}
            {gmapsStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
                Could not read coordinates from this link. Try a full Google Maps URL (not a short goo.gl link) or use GPS below.
              </div>
            )}
          </div>

          {/* Method 2: Use GPS */}
          <div className="bg-[#faf8f5] border border-[#e7e5df] rounded-md p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#1c1917]">
              <Locate className="w-3.5 h-3.5 text-[#b4431e]" />
              Option 2 — Use my current GPS location
            </div>
            <p className="text-[11px] text-[#78716c]">
              Stand inside or in front of your building and tap the button. Your browser will ask for location permission.
            </p>
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 bg-[#1c1917] hover:bg-[#2c2927] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-60"
            >
              <Locate className="w-3.5 h-3.5" />
              {gpsLoading ? 'Getting location...' : 'Use My Current Location'}
            </button>
            {gpsStatus === 'success' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                GPS location captured — pin updated on map below!
              </div>
            )}
            {gpsStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
                Location access denied or unavailable. Please allow location or use the Google Maps link above.
              </div>
            )}
          </div>

          {/* Method 3: Click/Drag on Map */}
          <div>
            <p className="text-[11px] text-[#78716c] mb-2">
              Option 3 — Or click anywhere on the map / drag the pin to fine-tune position.
              Current pin: <span className="font-mono text-[#1c1917]">{Number(formData.lat).toFixed(4)}, {Number(formData.lng).toFixed(4)}</span>
            </p>
            <LocationPickerMap
              lat={Number(formData.lat) || CAMPUS.lat}
              lng={Number(formData.lng) || CAMPUS.lng}
              onChange={(lat, lng) => {
                setFormData(prev => ({ ...prev, lat, lng }));
                setGmapsStatus('idle');
                setGpsStatus('idle');
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Monthly Rent (₹)</label>
            <input 
              required 
              type="number" 
              min="0" 
              name="monthlyRent" 
              value={formData.monthlyRent} 
              onChange={handleChange} 
              placeholder="e.g. 6500" 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] font-mono focus:outline-none focus:border-[#b4431e]" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Security Deposit (₹)</label>
            <input 
              required 
              type="number" 
              min="0" 
              name="deposit" 
              value={formData.deposit} 
              onChange={handleChange} 
              placeholder="e.g. 10000" 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] font-mono focus:outline-none focus:border-[#b4431e]" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1c1917] mb-1">Available From</label>
          <input 
            required 
            type="date" 
            name="availableFrom" 
            value={formData.availableFrom} 
            onChange={handleChange} 
            className="w-full rounded-md border border-[#e7e5df] py-1.5 px-3 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#e7e5df] pt-4">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Room Type</label>
            <select 
              name="roomType" 
              value={formData.roomType} 
              onChange={handleChange} 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            >
              <option value="PRIVATE">Private Room</option>
              <option value="SHARED">Shared Room</option>
              <option value="PG">PG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Furnishing</label>
            <select 
              name="furnished" 
              value={formData.furnished} 
              onChange={handleChange} 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            >
              <option value="FULLY">Fully Furnished</option>
              <option value="SEMI">Semi Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">Preferred Gender</label>
            <select 
              name="preferredGender" 
              value={formData.preferredGender} 
              onChange={handleChange} 
              className="w-full rounded-md border border-[#e7e5df] py-1.5 px-2.5 text-xs text-[#1c1917] bg-[#ffffff] focus:outline-none focus:border-[#b4431e]"
            >
              <option value="ANY">Any</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-[#b4431e] hover:bg-[#963515] text-white px-5 py-2 rounded-md text-xs font-medium transition-colors border border-[#b4431e] disabled:opacity-70"
          >
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
