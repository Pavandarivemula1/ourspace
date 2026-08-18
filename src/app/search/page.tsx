'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Search as SearchIcon,
  User,
  Building,
  Calendar,
  Sparkles,
  Gift,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>({
    people: [],
    venues: [],
    events: [],
    requests: [],
    offers: [],
    communities: [],
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="space-y-6">
      {/* Top Pill Header (Matching /venues aesthetic) */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <SearchIcon className="w-5 h-5 text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-sm text-slate-900">Global Ecosystem Search</div>
            <div className="text-xs text-slate-500 truncate">
              Search across People, Startups, Venues, Events, Requests, Offers, and Communities.
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl">
        <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, expertise, location, venue type, or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 text-sm text-slate-900 pl-11 pr-24 py-3 rounded-full focus:outline-none focus:border-teal-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition"
        >
          Search
        </button>
      </form>

      {/* Results Deck */}
      <div className="space-y-8">
        {/* People */}
        {results.people?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" />
              People & Founders ({results.people.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.people.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/profiles/${p.id}`}
                  className="p-5 rounded-3xl border border-slate-200 flex items-center gap-3.5 hover:shadow-md transition bg-white shadow-sm"
                >
                  <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                        {p.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {p.name}
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {p.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{p.profile?.headline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Venues */}
        {results.venues?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-cyan-600" />
              Venues & Spaces ({results.venues.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.venues.map((v: any) => (
                <Link
                  key={v.id}
                  href={`/venues/${v.id}`}
                  className="p-5 rounded-3xl border border-slate-200 space-y-1.5 hover:shadow-md transition block text-xs bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{v.name}</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {v.rating.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-slate-500">{v.neighborhood}, Hyderabad · Up to {v.capacity} seats</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {results.events?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              Events ({results.events.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.events.map((e: any) => (
                <Link
                  key={e.id}
                  href={`/events/${e.slug || e.id}`}
                  className="p-5 rounded-3xl border border-slate-200 space-y-1.5 hover:shadow-md transition block text-xs bg-white shadow-sm"
                >
                  <div className="font-bold text-slate-900 text-sm">{e.title}</div>
                  <div className="text-slate-500">{e.date} · {e.locationCity}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <Suspense fallback={<div className="text-xs text-slate-400">Loading search...</div>}>
            <SearchContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
