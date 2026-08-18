'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { getStatusBadge, formatDate } from '@/lib/utils';

export default function VenueRequestsQueuePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/venues/bookings?filter=received');
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/venues/bookings/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseNotes: 'Booking approved. Looking forward to hosting you!' }),
      });
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/venues/bookings/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Slot already booked for maintenance.' }),
      });
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Pill Header */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Venue Booking Inquiries Queue</div>
                <div className="text-xs text-slate-500 truncate">
                  Review incoming space booking inquiries. Approved bookings automatically fulfill event requirements.
                </div>
              </div>
            </div>

            <Link
              href="/venues"
              className="text-xs font-bold px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
            >
              Browse Venues →
            </Link>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="p-12 rounded-3xl text-center space-y-2 text-xs text-slate-400 bg-white border border-slate-200 shadow-sm">
                <Building className="w-8 h-8 text-slate-300 m-auto" />
                <div className="font-bold text-slate-700">No booking inquiries received right now.</div>
              </div>
            ) : (
              bookings.map((b) => {
                const statusBadge = getStatusBadge(b.status);

                return (
                  <div
                    key={b.id}
                    className="p-6 rounded-3xl border border-slate-200 space-y-4 hover:shadow-md transition text-xs bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                          <span className="text-slate-400 font-mono">Inquiry ID: {b.id.slice(0, 8)}</span>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">{b.venue?.name}</h2>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{b.targetDate} ({b.timeSlot})</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">Requester:</span>
                        <span className="text-teal-700 font-semibold">{b.requester?.name}</span>
                        <span className="text-[10px] text-slate-500">({b.requester?.role})</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Purpose:</span>{' '}
                        <span className="text-slate-700">&quot;{b.purpose}&quot;</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="font-bold text-slate-800">Attendees:</span> {b.attendeeCount} people
                      </div>
                      {b.specialRequirements && (
                        <div className="text-slate-600">
                          <span className="font-bold text-slate-800">Special Needs:</span> {b.specialRequirements}
                        </div>
                      )}
                    </div>

                    {b.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleReject(b.id)}
                          className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition flex items-center gap-1 border border-slate-200"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Booking</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
