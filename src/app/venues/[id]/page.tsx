'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VenueBookingModal } from '@/components/modals/VenueBookingModal';
import {
  Building,
  MapPin,
  Users,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = params?.id as string;
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/venues/${venueId}`);
      const data = await res.json();
      if (data.venue) setVenue(data.venue);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (venueId) fetchVenue();
  }, [venueId]);

  if (loading || !venue) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  let facilities: string[] = [];
  let eventTypes: string[] = [];
  let rulesObj: any = {};
  let photos: string[] = [];

  try {
    facilities = JSON.parse(venue.facilities || '[]');
    eventTypes = JSON.parse(venue.eventTypes || '[]');
    rulesObj = JSON.parse(venue.rules || '{}');
    photos = JSON.parse(venue.photos || '[]');
  } catch {}

  const primaryPhoto =
    photos[0] ||
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 bg-white shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {venue.pricingType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-slate-900">{venue.rating.toFixed(2)} ({venue.reviewCount} reviews)</span>
                  </div>
                  {venue.isVerified && (
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Verified Venue
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{venue.name}</h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{venue.description}</p>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition shadow-sm"
              >
                Request Booking
              </button>
            </div>

            {/* Photo Gallery Grid */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
              <img
                src={primaryPhoto}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Venue Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{venue.neighborhood}, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Max Capacity: {venue.capacity} seats</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Hours: {venue.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Building className="w-4 h-4 text-teal-600" />
                <span>Host: {venue.owner?.name}</span>
              </div>
            </div>
          </div>

          {/* Address Privacy Section */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-2xs">
                {venue.isAddressRevealed ? (
                  <Unlock className="w-5 h-5 text-teal-600" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {venue.isAddressRevealed ? 'Exact Address Unlocked' : 'Location Privacy Protected'}
                </div>
                <div className="text-xs text-slate-500">{venue.address}</div>
              </div>
            </div>
          </div>

          {/* Facilities & Rules Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facilities */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Facilities & AV Equipment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {facilities.map((fac, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Operating & Security Rules
              </h2>
              <div className="space-y-2.5 text-xs">
                {Object.entries(rulesObj).map(([key, val]) => (
                  <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="font-bold text-slate-900 capitalize">{key} Policy</div>
                    <div className="text-slate-600 leading-relaxed">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <VenueBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        venue={venue}
        onSuccess={fetchVenue}
      />
    </div>
  );
}
