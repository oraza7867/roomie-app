"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PublicProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [myReviewId, setMyReviewId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Because we don't have a specific public /api/users/:id endpoint configured, 
        // we'll fetch matches and filter, or just rely on the reviews endpoint to exist
        // Let's assume the user data is partially known or we only show reviews
        const revData = await apiFetch(`/users/${id}/reviews`);
        setReviews(revData.reviews || []);
        setAverageRating(revData.averageRating || 0);
        
        // Find if current user already left a review
        const existing = revData.reviews?.find((r: any) => r.reviewer.id === user?.id);
        if (existing) {
          setMyReviewId(existing.id);
          setRating(existing.rating);
          setComment(existing.comment || '');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (myReviewId) {
        // Edit
        await apiFetch(`/reviews/${myReviewId}`, {
          method: 'PATCH',
          body: JSON.stringify({ rating, comment })
        });
        alert('Review updated');
      } else {
        // Create
        await apiFetch(`/reviews`, {
          method: 'POST',
          body: JSON.stringify({ reviewedUserId: id, rating, comment })
        });
        alert('Review posted');
      }
      window.location.reload(); // simple reload to update list
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!myReviewId) return;
    if (!confirm('Delete this review?')) return;
    try {
      await apiFetch(`/reviews/${myReviewId}`, { method: 'DELETE' });
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">User Profile & Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Reviews List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="text-2xl font-bold">{averageRating}</span>
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>
          
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-50 pb-4">
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

        {/* Leave a review box */}
        {user?.id !== id && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">{myReviewId ? 'Edit your review' : 'Leave a review'}</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="mt-1 block w-full rounded border-gray-300 py-1.5 px-3">
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Okay</option>
                  <option value={2}>2 - Bad</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea required value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="mt-1 block w-full rounded border-gray-300 py-1.5 px-3" placeholder="How was it living with them?" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
                  {myReviewId ? 'Update' : 'Post Review'}
                </button>
                {myReviewId && (
                  <button type="button" onClick={handleDeleteReview} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100">
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
