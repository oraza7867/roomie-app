"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CAMPUS } from '@/lib/campus';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-[#faf8f5] border-b border-[#e7e5df] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="font-extrabold text-xl tracking-tight text-[#1c1917] group-hover:text-[#b4431e] transition-colors font-display">
                roomie<span className="text-[#b4431e]">.</span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716c] border border-[#e7e5df] px-1.5 py-0.2 rounded-sm bg-[#ffffff]">
                {CAMPUS.short}
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-6 text-sm">
              <Link 
                href="/discover" 
                className="text-[#57534e] hover:text-[#1c1917] font-medium transition-colors"
              >
                Find Roommates
              </Link>
              <Link 
                href="/rooms" 
                className="text-[#57534e] hover:text-[#1c1917] font-medium transition-colors"
              >
                Browse Rooms
              </Link>
              {user && (
                <Link 
                  href="/requests" 
                  className="text-[#57534e] hover:text-[#1c1917] font-medium transition-colors"
                >
                  Requests
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-sm font-medium text-[#1c1917] hover:text-[#b4431e] transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-[#78716c] hover:text-[#1c1917] text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link 
                  href="/login" 
                  className="text-[#57534e] hover:text-[#1c1917] text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#b4431e] hover:bg-[#963515] text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#b4431e]"
                >
                  Join
                </Link>
              </>
            ) : (
              <div className="h-4 w-16 bg-[#e7e5df] rounded"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
