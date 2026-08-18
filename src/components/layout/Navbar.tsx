'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Compass,
  Search,
  Plus,
  Sparkles,
  Building,
  Calendar,
  Layers,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  onOpenNLPModal?: () => void;
  onOpenOfferModal?: () => void;
  onOpenEventModal?: () => void;
}

export function Navbar({ onOpenNLPModal, onOpenOfferModal, onOpenEventModal }: NavbarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Compass className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                OUR SPACE
                <span className="text-[10px] font-black uppercase px-2 py-0.2 bg-teal-100 text-teal-800 rounded-full border border-teal-200">
                  HYDERABAD
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium hidden md:block">
                Unlock your space · Book and Create Anywhere
              </div>
            </div>
          </Link>
        </div>

        {/* Global Search Pill Bar (from design) */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Where to? Meeting, Hyderabad, Anytime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-200/90 hover:border-slate-300 text-xs text-slate-900 pl-9 pr-4 py-2 rounded-full focus:outline-none focus:border-teal-500 transition placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenNLPModal && (
            <button
              onClick={onOpenNLPModal}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-md shadow-teal-600/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask What You Need</span>
            </button>
          )}

          <NotificationDropdown />

          {/* User Profile Pill Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-800 transition shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0] || 'U'
                  )}
                </div>
                <span className="font-semibold hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl space-y-1 z-50 text-xs">
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="text-[10px] text-teal-600 font-semibold mt-0.5">{user.role}</div>
                  </div>

                  <Link
                    href={`/profiles/${user.id}`}
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>My Intent Profile</span>
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <Shield className="w-3.5 h-3.5 text-rose-600" />
                      <span>Admin Operations</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
