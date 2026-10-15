"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl tracking-tight text-orange-600">ROOMIE</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link href="/discover" className="text-gray-600 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Find Roomies
              </Link>
              <Link href="/rooms" className="text-gray-600 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Browse Rooms
              </Link>
              {user && (
                <Link href="/requests" className="text-gray-600 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Requests
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <>
                <Link href="/profile" className="text-sm font-medium text-gray-900">
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Log in
                </Link>
                <Link href="/register" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
