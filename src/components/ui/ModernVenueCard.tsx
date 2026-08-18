'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Users, Zap, Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface ModernVenueCardProps {
  venue: {
    id: string;
    name: string;
    description?: string;
    neighborhood?: string;
    capacity: number;
    pricingType: string;
    hourlyRate?: number | null;
    rating: number;
    reviewCount?: number;
    photos?: string;
    approvalRequired?: boolean;
    isVerified?: boolean;
  };
  onBook?: (venue: any) => void;
}

export function ModernVenueCard({ venue, onBook }: ModernVenueCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  let photosList: string[] = [];
  try {
    photosList = JSON.parse(venue.photos || '[]');
  } catch {
    photosList = [];
  }

  const primaryPhoto =
    photosList[0] ||
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80';

  const priceLabel =
    venue.pricingType === 'COMMUNITY_SPONSORED'
      ? 'Community-Sponsored (Free)'
      : venue.pricingType === 'FREE'
      ? 'Free for Builders'
      : venue.hourlyRate
      ? `from ₹${venue.hourlyRate.toLocaleString()}/hr`
      : 'Flexible Terms';

  return (
    <div className="listing-card-modern flex flex-col justify-between group bg-white border border-slate-200">
      <div>
        {/* Photo Container with Top Overlay */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={primaryPhoto}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-Right Favorite Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:scale-110 transition active:scale-95"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>

          {/* Pricing Tag Overlay */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-teal-800 border border-slate-200 shadow-sm">
              {venue.pricingType}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          {/* Badges Row from Design: Capacity | Instant Book | Rating */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                {venue.capacity}
              </span>

              {!venue.approvalRequired ? (
                <span className="flex items-center gap-1 font-bold text-sky-600">
                  <Zap className="w-3.5 h-3.5 fill-sky-600 text-sky-600" />
                  Instant Book
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-teal-700 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Space
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="text-slate-900">{venue.rating ? venue.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <Link href={`/venues/${venue.id}`} className="hover:underline">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                {venue.name}
              </h3>
            </Link>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{venue.neighborhood || 'Hyderabad'}, Hyderabad</span>
            </div>
          </div>

          {/* Pricing Label */}
          <div className="text-xs font-semibold text-slate-700">
            <span className="text-slate-500 font-normal">Pricing: </span>
            <span className="font-bold text-teal-700">{priceLabel}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
        <Link
          href={`/venues/${venue.id}`}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          View Details →
        </Link>

        {onBook ? (
          <button
            onClick={() => onBook(venue)}
            className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
          >
            <span>Book Space</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <Link
            href={`/venues/${venue.id}`}
            className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition"
          >
            Request Booking
          </Link>
        )}
      </div>
    </div>
  );
}
