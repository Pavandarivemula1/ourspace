'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Activity,
  Sparkles,
  Gift,
  Calendar,
  Building,
  UserCheck,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ActivityPage() {
  const [data, setData] = useState<any>({
    requests: [],
    offers: [],
    sentIntros: [],
    receivedIntros: [],
    bookings: [],
    collabs: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activity');
      const json = await res.json();
      if (json.requests) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Pill Header (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Operational Activity Timeline</div>
                <div className="text-xs text-slate-500 truncate">
                  Your complete history of requests, matches, venue bookings, collaborations, and outcomes.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Requests */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Published Needs ({data.requests.length})
              </h2>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {data.requests.map((r: any) => (
                  <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{r.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(r.createdAt)}</span>
                    </div>
                    <div className="text-[11px] text-teal-700 font-semibold">{r.matches?.length || 0} candidate matches found</div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Events */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-cyan-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" />
                Hosted Events ({data.events.length})
              </h2>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {data.events.map((e: any) => (
                  <div key={e.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{e.title}</span>
                      <span className="text-[10px] text-cyan-800 font-extrabold bg-cyan-100 px-2 py-0.2 rounded-full">{e.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{e.date} · {e.locationCity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborations & Outcomes */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                Collaborations & Outcomes ({data.collabs.length})
              </h2>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {data.collabs.map((c: any) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.title}</span>
                      <span className="text-[10px] text-teal-800 font-extrabold bg-teal-100 px-2 py-0.2 rounded-full">{c.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{c.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Bookings */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600" />
                Venue Booking Operations ({data.bookings.length})
              </h2>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {data.bookings.map((b: any) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.venue?.name}</span>
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full">{b.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{b.targetDate} · {b.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
