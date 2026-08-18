'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  Users,
  Building,
  Mic,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getStatusBadge, formatDate } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = activeCategory === 'ALL' ? '/api/events' : `/api/events?category=${activeCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  const categories = ['ALL', 'AI', 'Web3', 'SaaS', 'DeepTech', 'Fintech', 'General'];

  const filtered = events.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.locationCity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar onOpenEventModal={() => setIsEventModalOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Search & Action Pill Bar (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Resource-Driven Event Pipeline</div>
                <div className="text-xs text-slate-500 truncate">
                  Events automatically match, fulfill, and lock venues, keynote speakers, and partners.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="text-xs font-bold px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Host Event</span>
              </button>
            </div>
          </div>

          {/* Search Input and Category Pills */}
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title, topic, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 pl-9 pr-4 py-2.5 rounded-full focus:outline-none focus:border-teal-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition shadow-2xs ${
                    activeCategory === cat
                      ? 'bg-teal-600 text-white shadow-sm font-bold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {cat === 'ALL' ? 'All Events' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {filtered.length} upcoming ecosystem events
            </h2>
            <span className="text-xs text-slate-500">Resource matching in progress</span>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((evt) => {
              const statusBadge = getStatusBadge(evt.status);
              const confirmedCount = evt.requirements?.filter((r: any) => r.status === 'CONFIRMED').length || 0;
              const totalReqs = evt.requirements?.length || 0;

              return (
                <div
                  key={evt.id}
                  className="rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition bg-white shadow-sm"
                >
                  {/* Cover Image & Status Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {evt.coverImage ? (
                      <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border backdrop-blur-md ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/90 text-slate-900 border border-white/40 backdrop-blur-md shadow-2xs">
                        {evt.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base font-extrabold text-white line-clamp-1 drop-shadow-sm">{evt.title}</h3>
                      <div className="text-[11px] text-slate-200 flex items-center gap-3 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          {evt.startTime} - {evt.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          {evt.locationCity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>

                    {/* Requirements Progress Pill */}
                    {totalReqs > 0 && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">
                            Resource Requirements: {confirmedCount}/{totalReqs} Fulfilled
                          </span>
                          <span className="text-teal-700 font-bold">
                            {Math.round((confirmedCount / totalReqs) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(confirmedCount / totalReqs) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>
                          {evt.registrations?.length || 0} / {evt.capacity} registered
                        </span>
                      </div>

                      <Link
                        href={`/events/${evt.slug || evt.id}`}
                        className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white flex items-center gap-1.5 transition shadow-sm"
                      >
                        <span>Open Resource Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
