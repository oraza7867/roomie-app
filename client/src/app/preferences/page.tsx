"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

type Preferences = {
  sleepSchedule: string;
  cleanliness: string;
  noiseTolerance: string;
  socialLevel: string;
  guestPreference: string;
  smokingPreference: string;
  foodPreference: string;
  studyHabits: string;
};

const QUESTIONS = [
  {
    id: 'sleepSchedule',
    title: 'Late-night studying or early-morning gym?',
    options: [
      { label: 'Asleep before 12 AM', value: 'EARLY_BIRD' },
      { label: 'Awake after 12 AM', value: 'NIGHT_OWL' },
      { label: 'It changes often', value: 'FLEXIBLE' },
    ]
  },
  {
    id: 'cleanliness',
    title: 'How clean is clean enough?',
    options: [
      { label: 'Basic tidy-up is fine', value: 'MESSY' },
      { label: 'Fairly clean', value: 'AVERAGE' },
      { label: 'Spotless', value: 'VERY_CLEAN' },
    ]
  },
  {
    id: 'noiseTolerance',
    title: "What's the acceptable noise level?",
    options: [
      { label: 'Keep it quiet', value: 'QUIET' },
      { label: 'Some background noise', value: 'MODERATE' },
      { label: "Doesn't matter much", value: 'LOUD' },
    ]
  },
  {
    id: 'socialLevel',
    title: 'How social are you at home?',
    options: [
      { label: 'I value my private time', value: 'INTROVERT' },
      { label: 'Somewhere in the middle', value: 'AMBIVERT' },
      { label: 'Very social, doors always open', value: 'EXTROVERT' },
    ]
  },
  {
    id: 'guestPreference',
    title: 'Okay with friends dropping by?',
    options: [
      { label: 'Prefer no guests', value: 'NO_GUESTS' },
      { label: 'Weekends only', value: 'WEEKENDS_ONLY' },
      { label: 'Anytime is fine', value: 'ANYTIME' },
    ]
  },
  {
    id: 'smokingPreference',
    title: 'What is your smoking preference?',
    options: [
      { label: 'Non-smoker', value: 'NON_SMOKER' },
      { label: 'Outside only', value: 'OUTSIDE_ONLY' },
      { label: 'Smoker friendly', value: 'SMOKER' },
    ]
  },
  {
    id: 'foodPreference',
    title: 'What are your food preferences?',
    options: [
      { label: 'Strictly Veg', value: 'VEG' },
      { label: 'Non-Veg is okay', value: 'NON_VEG' },
      { label: 'Anything goes', value: 'ANY' },
    ]
  },
  {
    id: 'studyHabits',
    title: 'How do you usually study?',
    options: [
      { label: 'Absolute silence', value: 'SILENCE' },
      { label: 'With background music', value: 'BACKGROUND_MUSIC' },
      { label: 'Group study / talking', value: 'GROUP_STUDY' },
    ]
  }
];

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Partial<Preferences>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Load existing preferences if any
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await apiFetch('/preferences/me');
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      } catch (err: any) {
        // If 404, it means they haven't set it yet, which is perfectly fine.
        if (!err.message.includes("not found")) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleSelect = (questionId: keyof Preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [questionId]: value }));
    setSuccess(''); // clear success message when making changes
  };

  const handleSave = async () => {
    // Basic validation to ensure all questions are answered
    if (Object.keys(preferences).length < QUESTIONS.length) {
      setError("Please answer all the questions to find your best match.");
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await apiFetch('/preferences/me', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      setSuccess("Your Living Vibe has been saved!");
      
      // Briefly show success, then redirect to discover
      setTimeout(() => {
        router.push('/discover');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Calculate progress
  const answeredCount = Object.keys(preferences).filter(k => 
    QUESTIONS.some(q => q.id === k)
  ).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Living Vibe</h1>
        <p className="mt-3 text-lg text-gray-600">
          Tell us how you live. We'll show you people who live similarly.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-gray-50 pt-4 pb-6 mb-8 border-b border-gray-200">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Completion</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-orange-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-8 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-center font-medium">
          {success}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-12">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {index + 1}. {q.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {q.options.map((opt) => {
                const isSelected = preferences[q.id as keyof Preferences] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(q.id as keyof Preferences, opt.value)}
                    className={`
                      text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-orange-600 bg-orange-50 text-orange-900 ring-1 ring-orange-600' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50/50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-4 h-4 rounded-full border flex items-center justify-center mr-3 flex-shrink-0
                        ${isSelected ? 'border-orange-600' : 'border-gray-300'}
                      `}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-orange-600"></div>}
                      </div>
                      <span className="font-medium text-sm">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-end border-t border-gray-100 pt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 text-white px-8 py-3 rounded font-semibold hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-70 flex items-center"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
