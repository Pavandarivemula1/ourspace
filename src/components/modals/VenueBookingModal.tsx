'use client';

import React, { useState } from 'react';
import { Building, X, RefreshCw, Calendar, Users, MapPin, CheckCircle2 } from 'lucide-react';

interface VenueBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: {
    id: string;
    name: string;
    capacity: number;
    locationCity?: string;
    neighborhood?: string;
    pricingType?: string;
  };
  eventId?: string;
  eventRequirementId?: string;
  onSuccess?: () => void;
}

export function VenueBookingModal({
  isOpen,
  onClose,
  venue,
  eventId,
  eventRequirementId,
  onSuccess,
}: VenueBookingModalProps) {
  const [targetDate, setTargetDate] = useState('2026-08-29');
  const [timeSlot, setTimeSlot] = useState('EVENING');
  const [attendeeCount, setAttendeeCount] = useState<number | string>('45');
  const [purpose, setPurpose] = useState('AI Founders & Builders Meetup: Agents in Production');
  const [specialRequirements, setSpecialRequirements] = useState('4K Projector, 2 Wireless Mics, Wi-Fi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !venue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/venues/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          eventId: eventId || null,
          eventRequirementId: eventRequirementId || null,
          targetDate,
          timeSlot,
          attendeeCount: Number(attendeeCount),
          purpose,
          specialRequirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit venue booking inquiry');
      } else {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Building className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Request Venue Space</h2>
              <p className="text-xs text-slate-500">Book structured space for your startup event.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Venue Summary */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900">{venue.name}</h3>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
              {venue.pricingType}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 flex items-center gap-3">
            <span>Capacity: up to {venue.capacity} seats</span>
            <span>·</span>
            <span>{venue.neighborhood || 'Hitec City'}, Hyderabad</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Date *</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Time Slot *</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="EVENING">Evening (5 PM - 9 PM)</option>
                <option value="MORNING">Morning (9 AM - 1 PM)</option>
                <option value="AFTERNOON">Afternoon (1 PM - 5 PM)</option>
                <option value="FULL_DAY">Full Day</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Expected Attendee Count *</label>
            <input
              type="number"
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              required
              max={venue.capacity}
              placeholder="e.g. 45"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Event Purpose & Format *</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              required
              placeholder="Brief description of the event agenda, audience, and community."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Special AV & Equipment Needs</label>
            <input
              type="text"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. 4K Projector, 2 Mics, Power Strips"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !purpose.trim()}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Booking Inquiry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
