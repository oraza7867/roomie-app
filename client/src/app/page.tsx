"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CAMPUS, LOCALITIES } from '@/lib/campus';
import { ArrowRight, Check, MapPin, Users, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-[#faf8f5] text-[#1c1917]">

      {/* ── HERO (Left-aligned, asymmetrical, honest copy) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#e7e5df]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            {/*<div className="inline-flex items-center gap-2 border border-[#e7e5df] bg-[#ffffff] px-2.5 py-1 rounded-md text-xs font-mono text-[#57534e] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b4431e]"></span>
              Built for {CAMPUS.name} ({CAMPUS.short}) students
            </div>*/}

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1917] leading-[1.15]">
              Find a roommate near campus who won&apos;t drive you crazy.
            </h1>

            <p className="mt-5 text-[#57534e] text-base sm:text-lg leading-relaxed max-w-xl">
              Moving out of Hall 1–5 or hunting for a flat on Kursi Road? 
              Don&apos;t gamble on random WhatsApp groups. We match you on when you sleep, 
              how often you clean, and whether you mind guests before you sign a 11-month lease.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={user ? "/discover" : "/register"}
                className="inline-flex items-center gap-2 bg-[#b4431e] hover:bg-[#963515] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors border border-[#b4431e]"
              >
                {user ? 'Find Roommates' : 'Sign Up Free'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1917] hover:text-[#b4431e] px-4 py-2.5 rounded-md border border-[#e7e5df] bg-[#ffffff] hover:border-[#d3cfc7] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#78716c]" />
                Browse Rooms Near Campus
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e7e5df] flex items-center gap-6 text-xs text-[#78716c]">
              <span>Zero broker spam</span>
              <span>•</span>
              <span>Only verified university emails</span>
              <span>•</span>
              <span>Free for students</span>
            </div>
          </div>

          {/* Student Hero Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#e7e5df] shadow-md bg-white group">
              <img
                src="/student_room_hero.jpg"
                alt="Student flat and study space"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2.5 py-1 rounded text-[11px] font-mono font-medium bg-[#b4431e] text-white uppercase tracking-wider">
                    Verified Campus Housing
                  </span>
                  <span className="text-[11px] font-mono text-white/80 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                    Kursi Road &amp; Dasauli
                  </span>
                </div>
                <h3 className="text-white text-lg font-bold leading-snug">
                  Affordable rooms &amp; compatible flatmates around Integral University
                </h3>
                <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>No broker fees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Student-only network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── THE TELEGRAM PROBLEM ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 border-b border-[#e7e5df]">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917]">
            Why campus WhatsApp groups don&apos;t cut it.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#57534e] leading-relaxed">
            Every semester someone posts: &quot;Need 1 flatmate near Kursi Road, non-smoker, vegetarian preferred, rent 4000.&quot;
            That tells you nothing about what day-to-day life will be like.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#ffffff] border border-[#e7e5df] p-5 rounded-md">
            <div className="text-xs font-mono uppercase text-[#b4431e] font-semibold mb-2">01 / Sleep Schedules</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-2">Lights-out clashes</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              If you have 9 AM labs in Block 2 and your flatmate plays games with Discord open until 4 AM, your semester is ruined. We check this first.
            </p>
          </div>

          <div className="bg-[#ffffff] border border-[#e7e5df] p-5 rounded-md">
            <div className="text-xs font-mono uppercase text-[#b4431e] font-semibold mb-2">02 / Kitchen &amp; Cleanliness</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-2">The dishes standoff</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              Some people wash their tea cups immediately. Others leave Maggi bowls in the sink until Thursday. Find someone on your wavelength.
            </p>
          </div>

          <div className="bg-[#ffffff] border border-[#e7e5df] p-5 rounded-md">
            <div className="text-xs font-mono uppercase text-[#b4431e] font-semibold mb-2">03 / Visitors &amp; Guests</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-2">Hostel vs Flat culture</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              Some want the flat to be a social hub where friends chill till late. Others treat it as a quiet retreat. Know what you&apos;re signing up for.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 border-b border-[#e7e5df]">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917]">
            How this works
          </h2>
          <p className="mt-2 text-sm text-[#57534e]">
            Three simple steps: answer key lifestyle questions, get algorithmic compatibility scores, and connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-t border-[#e7e5df] pt-4">
            <div className="text-xs font-mono text-[#78716c] mb-1">Step 1</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-1">Answer 6 lifestyle questions</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              Takes 2 minutes. When you sleep, cleanliness, guests, noise level, and whether you smoke.
            </p>
          </div>

          <div className="border-t border-[#e7e5df] pt-4">
            <div className="text-xs font-mono text-[#78716c] mb-1">Step 2</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-1">Review matches with breakdown</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              See peers filtered by whether they already have a flat or need one, plus exact points where your routines line up.
            </p>
          </div>

          <div className="border-t border-[#e7e5df] pt-4">
            <div className="text-xs font-mono text-[#78716c] mb-1">Step 3</div>
            <h3 className="font-bold text-base text-[#1c1917] mb-1">Connect and chat safely</h3>
            <p className="text-xs text-[#57534e] leading-relaxed">
              Send a request. Once accepted, chat in-app to meet at Central Canteen or Gate 1 before making any deposit.
            </p>
          </div>
        </div>
      </section>

      {/* ── LOCALITIES COVERED ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 border-b border-[#e7e5df]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1c1917]">
              Rooms and flats around campus
            </h2>
            <p className="mt-1 text-sm text-[#57534e]">
              Filtered by actual distance from Integral University gates.
            </p>
          </div>
          <Link
            href="/rooms"
            className="text-xs font-medium text-[#b4431e] hover:underline"
          >
            View all listings &rarr;
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {LOCALITIES.map((area) => (
            <Link
              key={area}
              href={`/rooms?locality=${encodeURIComponent(area)}`}
              className="text-xs bg-[#ffffff] border border-[#e7e5df] hover:border-[#b4431e] text-[#57534e] hover:text-[#1c1917] px-3 py-1.5 rounded-md transition-colors"
            >
              {area}
            </Link>
          ))}
        </div>
      </section>

      {/* ── SIMPLE BOTTOM CALLOUT WITH COMMUNITY IMAGE ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-[#ffffff] border border-[#e7e5df] rounded-lg overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-8 sm:p-12 lg:col-span-7">
            <span className="inline-block px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#fbf2ec] text-[#b4431e] border border-[#f5ded0] mb-4">
              Join the student community
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
              Moving out next semester?
            </h2>
            <p className="mt-3 text-sm text-[#57534e] leading-relaxed max-w-lg">
              Create your lifestyle profile in 2 minutes. Free forever for {CAMPUS.name} students.
              Connect directly with verified students and skip broker commissions entirely.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={user ? "/discover" : "/register"}
                className="bg-[#b4431e] hover:bg-[#963515] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors border border-[#b4431e]"
              >
                {user ? 'Browse Matches' : 'Get Started'}
              </Link>
              <Link
                href="/rooms"
                className="text-sm font-medium text-[#57534e] hover:text-[#1c1917] px-4 py-2.5 rounded-md border border-[#e7e5df] bg-[#faf8f5] hover:bg-white transition-colors"
              >
                Check Available Rooms
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 lg:h-full relative min-h-[260px]">
            <img
              src="/students_community.jpg"
              alt="Students enjoying community life together"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e7e5df] bg-[#faf8f5] py-8 text-xs text-[#78716c]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1c1917] font-display">roomie.</span>
            <span>· Made by students at {CAMPUS.name} ({CAMPUS.short})</span>
          </div>
          <div>Kursi Road, Lucknow · Non-commercial campus project</div>
        </div>
      </footer>

    </div>
  );
}

