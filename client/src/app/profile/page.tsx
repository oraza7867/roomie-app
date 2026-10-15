"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
          apiFetch('/profile/me'),
          apiFetch(`/users/${user?.id}/reviews`) // assuming this route is public or accessible
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      };
      const res = await apiFetch('/profile/me', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
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
              <label className="block text-sm font-medium text-gray-500">College</label>
              {isEditing ? <input name="college" value={formData.college || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" /> : <p className="text-gray-900">{profile?.college}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Course & Year</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input name="course" placeholder="Course" value={formData.course || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" />
                  <input name="year" placeholder="Year" value={formData.year || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" />
                </div>
              ) : <p className="text-gray-900">{profile?.course} {profile?.year && `• ${profile.year}`}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">City</label>
            {isEditing ? <input name="city" value={formData.city || ''} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 ring-1 ring-gray-300 py-1.5 px-3" /> : <p className="text-gray-900">{profile?.city || 'Not set'}</p>}
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
