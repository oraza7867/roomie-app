"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface Match {
  user: {
    id: string;
    name: string;
    college?: string;
    city?: string;
    age?: number;
    bio?: string;
  };
  compatibility: number;
  whyYouMatch: string[];
  differences: string[];
}

export default function DiscoverPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsPreferences, setNeedsPreferences] = useState(false);

  const fetchMatches = async () => {
    try {
      const matchData = await apiFetch('/matches');
      setMatches(matchData.matches || []);
    } catch (err: any) {
      if (err.message.includes('Living Vibe')) {
        setNeedsPreferences(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSendRequest = async (userId: string) => {
    try {
      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify({ receiverId: userId }),
      });
      // Immediately remove the user card from Discover matching list
      setMatches(prev => prev.filter(m => m.user.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemoveFromDiscover = (userId: string) => {
    setMatches(prev => prev.filter(m => m.user.id !== userId));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-gray-200 h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (needsPreferences) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete your Living Vibe first</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We can't find your matches until we know how you like to live! Answer a few quick questions about your habits to unlock your compatibility scores.
          </p>
          <Link 
            href="/preferences" 
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
          >
            Set up Preferences
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600">
        <p>Error loading matches: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">See who actually fits your lifestyle</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Compatibility is based entirely on the lifestyle preferences you selected.
          </p>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {matches.length} potential matches
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No new matches right now</h3>
          <p className="mt-1 text-sm text-gray-500">You've connected with or reviewed all available candidates!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <div key={match.user.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-gray-300 transition-colors relative group">
              
              {/* Dismiss / Remove Option */}
              <button
                onClick={() => handleRemoveFromDiscover(match.user.id)}
                title="Dismiss candidate"
                className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 text-sm p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>

              <div className="p-6 flex-grow">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pr-6">
                  <div>
                    <Link href={`/users/${match.user.id}`} className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                      {match.user.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {match.user.college && <span>{match.user.college}</span>}
                      {match.user.city && <span> • {match.user.city}</span>}
                      {match.user.age && <span> • {match.user.age} yrs</span>}
                    </p>
                  </div>
                  <div className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-lg text-sm border border-green-100">
                    {match.compatibility}%
                  </div>
                </div>

                {/* Bio */}
                {match.user.bio && (
                  <p className="text-gray-700 text-sm italic mb-6">"{match.user.bio}"</p>
                )}

                {/* Why You Match */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Why you match</h4>
                  <ul className="space-y-2">
                    {match.whyYouMatch.slice(0, 3).map((reason, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2 font-bold">✓</span>
                        {reason}
                      </li>
                    ))}
                    {match.whyYouMatch.length > 3 && (
                      <li className="text-xs text-gray-500 italic ml-5">
                        + {match.whyYouMatch.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Differences */}
                {match.differences.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Differences</h4>
                    <ul className="space-y-2">
                      {match.differences.slice(0, 2).map((diff, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-orange-500 mr-2 font-bold">•</span>
                          {diff}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => handleSendRequest(match.user.id)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Send Request
                </button>
                <button 
                  onClick={() => handleRemoveFromDiscover(match.user.id)}
                  className="px-3 py-2 text-gray-400 hover:text-red-600 rounded text-sm font-medium transition-colors"
                  title="Remove from matches"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
