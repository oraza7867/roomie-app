"use client";

import { useState, useEffect } from 'react';
import { getMatches, sendRoomieRequest } from '@/lib/api';
import Link from 'next/link';
import { CAMPUS } from '@/lib/campus';

interface Match {
  user: {
    id: string;
    name: string;
    college?: string;
    course?: string;
    year?: string;
    hostelOrLocality?: string;
    city?: string;
    age?: number;
    bio?: string;
    lookingFor?: 'ROOM_AND_ROOMMATE' | 'ROOMMATE_ONLY' | string;
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
  const [lookingForFilter, setLookingForFilter] = useState('');

  const fetchMatches = async (filter?: string) => {
    setLoading(true);
    try {
      const matchData = await getMatches(filter ? { lookingFor: filter } : undefined);
      setMatches(matchData.matches || []);
    } catch (err: any) {
      if (err.message && err.message.includes('Living Vibe')) {
        setNeedsPreferences(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(lookingForFilter);
  }, [lookingForFilter]);

  const handleSendRequest = async (userId: string) => {
    try {
      await sendRoomieRequest(userId);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-6 w-40 bg-[#e7e5df] rounded mb-8 animate-pulse"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-[#ffffff] rounded-md border border-[#e7e5df] h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (needsPreferences) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-[#ffffff] border border-[#e7e5df] rounded-md p-6 sm:p-8">
          <div className="text-xs font-mono uppercase text-[#b4431e] font-semibold mb-2">Step required</div>
          <h2 className="text-xl font-bold text-[#1c1917] mb-2">You haven&apos;t set your habits yet</h2>
          <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-6">
            We calculate roommate compatibility by comparing sleep routines, kitchen cleanliness, noise tolerance, and guest preferences. Without your answers, we can&apos;t rank candidates for you.
          </p>
          <Link 
            href="/preferences" 
            className="inline-flex items-center gap-2 bg-[#b4431e] hover:bg-[#963515] text-white px-4 py-2 rounded-md text-xs font-medium border border-[#b4431e] transition-colors"
          >
            Answer 6 lifestyle questions &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-[#ffffff] border border-[#fecaca] rounded-md p-6 text-sm text-[#991b1b]">
          <div className="font-bold mb-1">Could not load roommates</div>
          <p className="text-xs text-[#7f1d1d]">{error}. Your connection might have flickered — try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-20">
      <div className="mb-6 border-b border-[#e7e5df] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917]">
            Roommates at {CAMPUS.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#57534e]">
            Students moving out of hostels or looking for flatmates near campus, ranked by daily habit overlap.
          </p>
        </div>
        <span className="font-mono text-xs text-[#78716c] border border-[#e7e5df] bg-[#ffffff] px-2.5 py-1 rounded-md">
          {matches.length} candidates
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-[#78716c] uppercase tracking-wider mr-1">
          Filter:
        </span>
        {[
          { label: 'All Roommates', value: '' },
          { label: 'Needs Room + Roommate', value: 'ROOM_AND_ROOMMATE' },
          { label: 'Has Room, Needs Roommate', value: 'ROOMMATE_ONLY' },
        ].map((chip) => {
          const isActive = lookingForFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => setLookingForFilter(chip.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
                isActive
                  ? 'bg-[#1c1917] text-white border-[#1c1917]'
                  : 'bg-[#ffffff] border-[#e7e5df] text-[#57534e] hover:border-[#d3cfc7] hover:text-[#1c1917]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {matches.length === 0 ? (
        <div className="bg-[#ffffff] border border-[#e7e5df] rounded-md p-10 text-center max-w-lg mx-auto">
          <h3 className="text-sm font-bold text-[#1c1917] mb-1">No candidates match this filter right now</h3>
          <p className="text-xs text-[#57534e] leading-relaxed mb-4">
            Either everyone in this category is already sorted, or no new posts have been created yet.
            Try toggling between filters or check back before semester begins.
          </p>
          {lookingForFilter && (
            <button
              onClick={() => setLookingForFilter('')}
              className="text-xs text-[#b4431e] font-medium hover:underline"
            >
              Reset filter to all roommates &rarr;
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <div 
              key={match.user.id} 
              className="bg-[#ffffff] rounded-md border border-[#e7e5df] hover:border-[#d3cfc7] transition-colors flex flex-col justify-between relative"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <Link 
                      href={`/users/${match.user.id}`} 
                      className="text-base font-bold text-[#1c1917] hover:text-[#b4431e] transition-colors"
                    >
                      {match.user.name}
                    </Link>
                    <p className="text-xs text-[#78716c] mt-0.5">
                      {[
                        match.user.course,
                        match.user.year,
                        match.user.hostelOrLocality || match.user.city,
                        match.user.age ? `${match.user.age}y` : null,
                      ].filter(Boolean).join(' · ') || match.user.college || CAMPUS.short}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#faf8f5] text-[#1c1917] border border-[#e7e5df]">
                    {match.compatibility}% match
                  </span>
                </div>

                {/* LookingFor Badge */}
                <div className="mb-3">
                  {match.user.lookingFor === 'ROOMMATE_ONLY' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]">
                      Has a room · Needs roommate
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-[#bfdbfe] bg-[#eff6ff] text-[#1e40af]">
                      Needs room + roommate
                    </span>
                  )}
                </div>

                {/* Bio */}
                {match.user.bio && (
                  <p className="text-xs text-[#57534e] italic mb-4 line-clamp-2">
                    &quot;{match.user.bio}&quot;
                  </p>
                )}

                {/* Why You Match */}
                <div className="mb-4">
                  <div className="text-[11px] font-mono uppercase text-[#78716c] font-semibold mb-2">
                    Agreements
                  </div>
                  <ul className="space-y-1.5">
                    {match.whyYouMatch.slice(0, 3).map((reason, i) => (
                      <li key={i} className="flex items-start text-xs text-[#57534e] gap-2">
                        <span className="text-[#b4431e] font-bold shrink-0">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Differences */}
                {match.differences.length > 0 && (
                  <div>
                    <div className="text-[11px] font-mono uppercase text-[#78716c] font-semibold mb-1.5">
                      Friction points
                    </div>
                    <ul className="space-y-1">
                      {match.differences.slice(0, 2).map((diff, i) => (
                        <li key={i} className="flex items-start text-xs text-[#78716c] gap-2">
                          <span className="text-[#a8a29e] shrink-0">—</span>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-[#e7e5df] bg-[#faf8f5] flex items-center justify-between gap-2">
                <button 
                  onClick={() => handleSendRequest(match.user.id)}
                  className="flex-1 bg-[#b4431e] hover:bg-[#963515] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-[#b4431e]"
                >
                  Connect
                </button>
                <button 
                  onClick={() => handleRemoveFromDiscover(match.user.id)}
                  className="border border-[#e7e5df] hover:border-[#d3cfc7] bg-[#ffffff] text-[#78716c] hover:text-[#1c1917] px-2.5 py-1.5 rounded-md text-xs transition-colors"
                  title="Pass"
                >
                  Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
