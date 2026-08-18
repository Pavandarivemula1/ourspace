'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { VenueBookingModal } from '@/components/modals/VenueBookingModal';
import { SpaceCategoryCarousel } from '@/components/ui/SpaceCategoryCarousel';
import { ModernVenueCard } from '@/components/ui/ModernVenueCard';
import { EcosystemFilterBar } from '@/components/ui/EcosystemFilterBar';
import {
  Building,
  Search,
  MapPin,
  Users,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

function VenuesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'ALL';

  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePricing, setActivePricing] = useState('ALL');
  const [activeCapacity, setActiveCapacity] = useState('ALL');
  const [activeStyle, setActiveStyle] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [bookingVenue, setBookingVenue] = useState<any>(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const url = activePricing === 'ALL' ? '/api/venues' : `/api/venues?pricing=${activePricing}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.venues) setVenues(data.venues);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [activePricing]);

  const filtered = venues.filter((v) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.neighborhood?.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Capacity filter
    if (activeCapacity === 'SMALL' && v.capacity > 30) return false;
    if (activeCapacity === 'MEDIUM' && (v.capacity <= 30 || v.capacity > 75)) return false;
    if (activeCapacity === 'LARGE' && (v.capacity <= 75 || v.capacity > 150)) return false;
    if (activeCapacity === 'AUDITORIUM' && v.capacity <= 150) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Search Pill Bar (from design) */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-xs text-slate-900">Where to ?</div>
            <div className="text-[11px] text-slate-500 truncate">
              {searchQuery || 'Startup Event, Hyderabad, Next Saturday, Anytime'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/venues/requests"
            className="text-xs font-bold px-4 py-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Booking Requests Queue</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar Pills */}
      <EcosystemFilterBar
        pricingValue={activePricing}
        onPricingChange={setActivePricing}
        capacityValue={activeCapacity}
        onCapacityChange={setActiveCapacity}
        styleValue={activeStyle}
        onStyleChange={setActiveStyle}
      />

      {/* Category Carousel (From Design) */}
      <SpaceCategoryCarousel
        activeCategory={activeStyle}
        onSelectCategory={(id) => {
          setActiveStyle(activeStyle === id ? 'ALL' : id);
        }}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
          {filtered.length} meeting & event spaces in Hyderabad
        </h2>
        <span className="text-xs text-slate-500">Showing verified venues</span>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((venue) => (
          <ModernVenueCard
            key={venue.id}
            venue={venue}
            onBook={(target) => setBookingVenue(target)}
          />
        ))}
      </div>

      {bookingVenue && (
        <VenueBookingModal
          isOpen={Boolean(bookingVenue)}
          onClose={() => setBookingVenue(null)}
          venue={bookingVenue}
          onSuccess={fetchVenues}
        />
      )}
    </div>
  );
}

export default function VenuesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <Suspense fallback={<div className="text-xs text-slate-400">Loading spaces...</div>}>
            <VenuesContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
