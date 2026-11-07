"use client";

import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile, getUserReviews } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CAMPUS, COURSES, HOSTELS, LOCALITIES } from '@/lib/campus';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profData, revData] = await Promise.all([
          getMyProfile(),
          user?.id ? getUserReviews(user.id) : Promise.resolve({ reviews: [], averageRating: 0 })
        ]);
        setProfile(profData.profile);
        setFormData(profData.profile);
        setReviews(revData.reviews || []);
        setAverageRating(revData.averageRating || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectLookingFor = async (val: 'ROOM_AND_ROOMMATE' | 'ROOMMATE_ONLY') => {
    if (isEditing) {
      setFormData({ ...formData, lookingFor: val });
    } else {
      try {
        const res = await updateMyProfile({ lookingFor: val });
        setProfile(res.profile);
        setFormData(res.profile);
      } catch (err: any) {
        alert(err.message || 'Failed to update status');
      }
    }
  };

  const handleSave = async () => {
    try {
      const { id, email, college, createdAt, updatedAt, ...rest } = formData;
      const payload = {
        ...rest,
        age: formData.age ? parseInt(formData.age) : undefined,
        lookingFor: formData.lookingFor || 'ROOM_AND_ROOMMATE',
      };
      const res = await updateMyProfile(payload);
      setProfile(res.profile);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-orange-600 font-semibold text-sm hover:text-orange-700">Edit Profile</button>
        ) : (
          <div className="space-x-4">
            <button onClick={() => setIsEditing(false)} className="text-gray-500 font-semibold text-sm">Cancel</button>
            <button onClick={handleSave} className="bg-orange-600 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm hover:bg-orange-700">Save</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form / Info */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {/* 2-Card Selector for LookingFor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                What are you looking for?
              </label>
              <span className="text-xs text-gray-400">
                {isEditing ? 'Click card to select' : 'Tap to switch anytime'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1 */}
              <button
                type="button"
                onClick={() => handleSelectLookingFor('ROOM_AND_ROOMMATE')}
                className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                  (isEditing ? formData.lookingFor : profile?.lookingFor) === 'ROOM_AND_ROOMMATE'
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">🏠</span>
                    {(isEditing ? formData.lookingFor : profile?.lookingFor) === 'ROOM_AND_ROOMMATE' && (
                      <span className="inline-flex items-center rounded-full bg-orange-600 text-white px-2 py-0.5 text-xs font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    I need a room + roommate
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Looking for accommodation near campus and peers to share it with.
                  </p>
                </div>
              </button>

              {/* Card 2 */}
              <button
                type="button"
                onClick={() => handleSelectLookingFor('ROOMMATE_ONLY')}
                className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                  (isEditing ? formData.lookingFor : profile?.lookingFor) === 'ROOMMATE_ONLY'
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">🔑</span>
                    {(isEditing ? formData.lookingFor : profile?.lookingFor) === 'ROOMMATE_ONLY' && (
                      <span className="inline-flex items-center rounded-full bg-orange-600 text-white px-2 py-0.5 text-xs font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    I have a room, need a roommate
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Already have a room or flat near campus, looking for a roommate to move in.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              {isEditing ? <input name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" /> : <p className="font-semibold text-gray-900 text-lg">{profile?.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Age</label>
              {isEditing ? <input name="age" type="number" value={formData.age || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" /> : <p className="font-semibold text-gray-900 text-lg">{profile?.age || 'Not set'}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Campus</label>
              <div className="mt-1 block w-full rounded border border-gray-200 bg-gray-50 py-1.5 px-3 text-sm text-gray-800 font-medium">
                {CAMPUS.name} ({CAMPUS.short})
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Course & Year</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <select
                    name="course"
                    value={formData.course || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3 text-sm bg-white"
                  >
                    <option value="">Select course</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input name="year" placeholder="Year (e.g. 2nd)" value={formData.year || ''} onChange={handleChange} className="mt-1 block w-28 rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3 text-sm" />
                </div>
              ) : <p className="text-gray-900">{profile?.course || 'No course set'} {profile?.year && `• ${profile.year}`}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Hostel / Locality</label>
              {isEditing ? (
                <div>
                  <input
                    name="hostelOrLocality"
                    list="hostel-locality-list"
                    placeholder="e.g. Hall 1, Dasauli, Kursi Road"
                    value={formData.hostelOrLocality || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3 text-sm"
                  />
                  <datalist id="hostel-locality-list">
                    {HOSTELS.map((h) => (
                      <option key={h} value={h} />
                    ))}
                    {LOCALITIES.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </div>
              ) : (
                <p className="text-gray-900">{profile?.hostelOrLocality || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">City</label>
              {isEditing ? <input name="city" value={formData.city || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3 text-sm" /> : <p className="text-gray-900">{profile?.city || 'Lucknow'}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Bio</label>
            {isEditing ? <textarea name="bio" rows={4} value={formData.bio || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" /> : <p className="text-gray-700 whitespace-pre-wrap">{profile?.bio || 'Add a bio to help people know you better.'}</p>}
          </div>
          
          {!isEditing && (
             <div className="mt-6 border-t border-gray-100 pt-6">
                <Link href="/preferences" className="text-orange-600 font-semibold hover:underline">
                  Update Living Vibe Preferences &rarr;
                </Link>
             </div>
          )}
        </div>

        {/* Right Column: Reviews */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold">{averageRating}</span>
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
            
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex text-yellow-400 text-sm mb-1">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                    <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                    <p className="text-xs text-gray-400 mt-2">— {review.reviewer.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
