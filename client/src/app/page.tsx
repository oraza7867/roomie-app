"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div>
            <p className="text-sm font-medium text-orange-600 mb-4">
              For students in Lucknow
            </p>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Roommates, not randoms.
            </h1>

            <p className="mt-5 text-gray-600 text-lg leading-relaxed max-w-lg">
              Sharing rent is easy. Living together is hard. We match you with
              people based on sleep timing, cleanliness, noise — the things
              that actually start fights between flatmates.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href={user ? "/discover" : "/register"}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors shadow-sm"
              >
                {user ? 'Find roomies' : 'Sign up free'}
              </Link>
              <Link
                href="/rooms"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              >
                Browse rooms →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md aspect-[4/3]">
            <img
              src="/student_room_hero.jpg"
              alt="Student shared living space"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ── WHAT IT DOES (simple, no fluff) ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Fill out your habits</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                When do you sleep? How clean are you? Do you mind guests? 
                Takes about 2 minutes.
              </p>
            </div>

            <div>
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Browse your matches</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                We show you people whose daily routine actually lines up with yours.
                Each card tells you exactly what you agree on and where you differ.
              </p>
            </div>

            <div>
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Send a request, start chatting</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Liked someone? Send them a request. Once they accept, you 
                can chat in-app and figure out the rest.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY NOT JUST USE TELEGRAM / OLX ── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md aspect-[4/3]">
              <img
                src="/students_community.jpg"
                alt="College students in common area"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Telegram groups tell you nothing useful.
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                "Looking for flatmate near Gomti Nagar, male, non-smoker" — that's 
                what every post looks like. But none of that tells you if someone 
                sleeps at 10pm or 3am, or if they'll leave dishes in the sink for 
                three days.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                ROOMIE compares <span className="font-medium text-gray-900">sleep schedules, 
                cleanliness, noise tolerance, study habits, guest preferences</span> and 
                more — so you know what living with someone will actually be like 
                before you commit.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Hazratganj', 'Gomti Nagar', 'Jankipuram', 'Aliganj', 'Indira Nagar', 'Chinhat', 'Rajajipuram', 'Mahanagar'].map((area) => (
                  <span
                    key={area}
                    className="bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES (compact, no emoji icons) ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            What you get
          </h2>
          <p className="text-gray-600 mb-12 max-w-xl">
            Everything you need to find the right person — nothing you don't.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Compatibility scores',
                desc: 'Every match gets a percentage based on how closely your daily habits line up. Plus a clear breakdown of what matched and what didn\'t.',
              },
              {
                title: 'Locality filters',
                desc: 'Search by Lucknow areas — Gomti Nagar, Hazratganj, Jankipuram, wherever your college is. Only see people relevant to you.',
              },
              {
                title: 'In-app messaging',
                desc: 'Chat directly inside the app. No need to share your number with someone you haven\'t even met yet.',
              },
              {
                title: 'Room listings',
                desc: 'Already have a flat? Post it. Looking for one? Browse available rooms with rent, deposit, and furnishing details.',
              },
              {
                title: 'Student profiles',
                desc: 'Every profile shows college, course, year, and bio. You\'re not talking to a blank name on a classifieds page.',
              },
              {
                title: 'Request system',
                desc: 'Send a request, wait for them to accept. No spam, no random messages. Both sides have to say yes.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find someone you can actually live with.
          </h2>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Takes 2 minutes to set up. Free forever. Built for Lucknow students.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={user ? "/discover" : "/register"}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors shadow-sm"
            >
              {user ? 'Find roomies' : 'Get started'}
            </Link>
            <Link
              href="/discover"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              See how matching works
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <span className="font-bold text-gray-900">ROOMIE</span>
          <span>Built for students, by students · Lucknow</span>
        </div>
      </footer>

    </div>
  );
}
