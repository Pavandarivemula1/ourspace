'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Users,
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/communities');
      const data = await res.json();
      if (data.communities) setCommunities(data.communities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filtered = communities.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Pill Header (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Ecosystem Communities</div>
                <div className="text-xs text-slate-500 truncate">
                  Grassroots developer networks, tech salons, and founder collectives building in Hyderabad.
                </div>
              </div>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search communities by name or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs text-slate-900 pl-9 pr-4 py-2.5 rounded-full focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {filtered.length} active communities & tech salons
            </h2>
            <span className="text-xs text-slate-500">Verified ecosystem networks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((comm) => {
              let categories: string[] = [];
              try {
                categories = JSON.parse(comm.categories || '[]');
              } catch {}

              return (
                <div
                  key={comm.id}
                  className="p-6 rounded-3xl border border-slate-200 space-y-4 hover:shadow-md transition bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{comm.name}</h3>
                        {comm.isVerified && <ShieldCheck className="w-4 h-4 text-teal-600" />}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {comm.locationCity}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {comm.memberCount}+ members
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{comm.description}</p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200"
                      >
                        #{cat}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">{comm.events?.length || 0} upcoming events</span>
                    <span className="text-purple-600 font-bold">Active Network →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
