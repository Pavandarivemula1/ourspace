'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import { NLPRequestModal } from '@/components/modals/NLPRequestModal';
import { CreateOfferModal } from '@/components/modals/CreateOfferModal';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import { MatchExplanationModal } from '@/components/modals/MatchExplanationModal';
import { RequestIntroModal } from '@/components/modals/RequestIntroModal';
import { VenueBookingModal } from '@/components/modals/VenueBookingModal';
import { HeroIntentSearchCard } from '@/components/ui/HeroIntentSearchCard';
import { SpaceCategoryCarousel } from '@/components/ui/SpaceCategoryCarousel';
import { ModernVenueCard } from '@/components/ui/ModernVenueCard';
import {
  Sparkles,
  Building,
  Calendar,
  Gift,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import { getScoreColor, getStatusBadge, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [intros, setIntros] = useState<{ received: any[]; sent: any[] }>({ received: [], sent: [] });
  const [venueBookings, setVenueBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNLPModalOpen, setIsNLPModalOpen] = useState(false);
  const [nlpPreFill, setNlpPreFill] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [introRecipient, setIntroRecipient] = useState<any>(null);
  const [bookingVenue, setBookingVenue] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reqRes, evtRes, venRes, introRes, bookRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/events'),
        fetch('/api/venues'),
        fetch('/api/introductions'),
        fetch('/api/venues/bookings'),
      ]);

      const [reqData, evtData, venData, introData, bookData] = await Promise.all([
        reqRes.json(),
        evtRes.json(),
        venRes.json(),
        introRes.json(),
        bookRes.json(),
      ]);

      if (reqData.requests) setRequests(reqData.requests);
      if (evtData.events) setEvents(evtData.events);
      if (venData.venues) setVenues(venData.venues);
      if (introData.received) setIntros(introData);
      if (bookData.bookings) setVenueBookings(bookData.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await fetch(`/api/venues/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseNotes: 'Approved. Looking forward to hosting your event!' }),
      });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerNLPFromHero = (prompt: string) => {
    setNlpPreFill(prompt);
    setIsNLPModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar
        onOpenNLPModal={() => {
          setNlpPreFill('');
          setIsNLPModalOpen(true);
        }}
        onOpenOfferModal={() => setIsOfferModalOpen(true)}
        onOpenEventModal={() => setIsEventModalOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* OUR SPACE LIGHT-THEME HERO BANNER (Matches Our Space reference aesthetics) */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-gradient-to-br from-teal-50/70 via-white to-sky-50/60 p-6 sm:p-10 shadow-sm">
            {/* Subtle decorative background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Tagline & Quick Action Triggers */}
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hyderabad Startup Ecosystem Network</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Unlock your space <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                    Book and Create Anywhere
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                  Don&apos;t ask who you know. Ask what you need. Match directly with verified stages, AI keynote speakers, and collaborative partners.
                </p>

                {/* Fast Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      setNlpPreFill('I need a free venue for a 40 person AI meetup in Hitec City');
                      setIsNLPModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 shadow-sm transition active:scale-95"
                  >
                    🏢 Find a Venue
                  </button>
                  <button
                    onClick={() => {
                      setNlpPreFill('Looking for an AI Keynote Speaker on Agentic Architectures in Hyderabad');
                      setIsNLPModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 shadow-sm transition active:scale-95"
                  >
                    🎙️ AI Keynote Speaker
                  </button>
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="px-3.5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-sm shadow-teal-600/20 transition active:scale-95"
                  >
                    📅 Host Event
                  </button>
                </div>
              </div>

              {/* Floating White Intent-Search Pod (From Design Reference) */}
              <div className="w-full lg:w-auto shrink-0 flex justify-center">
                <HeroIntentSearchCard onTriggerNLP={handleTriggerNLPFromHero} />
              </div>
            </div>
          </section>

          {/* SPACE CATEGORY CAROUSEL (From Design System) */}
          <section>
            <SpaceCategoryCarousel
              onSelectCategory={(id) => {
                window.location.href = `/venues?category=${id}`;
              }}
              actionElement={
                <Link href="/venues" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  View All Categories →
                </Link>
              }
            />
          </section>

          {/* ATTENTION DECK: Actionable Items */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Attention & Actionable Items
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Real-world outcomes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Flagship Active Request & High-Compatibility Matches */}
              {requests.slice(0, 2).map((req) => {
                const topMatch = req.matches && req.matches[0];
                return (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {req.requestType} NEED
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{req.title}</h3>
                      </div>
                    </div>

                    {/* Top Calculated Match */}
                    {topMatch ? (
                      <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-bold text-slate-800">
                              Top Match Recommended
                            </span>
                          </div>
                          <span className="text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300">
                            {topMatch.totalScore}% MATCH
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {topMatch.explanation ? JSON.parse(topMatch.explanation)[0] : 'High compatibility match'}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() =>
                              setSelectedMatch({
                                totalScore: topMatch.totalScore,
                                matchType: topMatch.matchType,
                                factors: topMatch.factors,
                                explanation: topMatch.explanation,
                                candidateName: req.requestType === 'VENUE' ? 'T-Hub Catalyst Stage' : 'Dr. Vikram Rao',
                              })
                            }
                            className="text-xs text-teal-700 hover:text-teal-800 font-bold transition"
                          >
                            Why this match? →
                          </button>

                          <div className="flex-1" />

                          {req.requestType === 'VENUE' ? (
                            <button
                              onClick={() =>
                                setBookingVenue({
                                  id: topMatch.matchedVenueId || 'venue-thub',
                                  name: 'T-Hub Catalyst Stage & Innovation Arena',
                                  capacity: 120,
                                  locationCity: 'Hyderabad',
                                  neighborhood: 'Hitec City',
                                  pricingType: 'COMMUNITY_SPONSORED',
                                })
                              }
                              className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white transition shadow-sm"
                            >
                              Request Venue Space
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setIntroRecipient({
                                  id: topMatch.matchedUserId || 'user-vikram',
                                  name: 'Dr. Vikram Rao',
                                  headline: 'AI Research Director @ IIIT Hyderabad',
                                  role: 'PROFESSIONAL',
                                })
                              }
                              className="text-xs font-bold px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                            >
                              Request Introduction
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Matching candidates currently being evaluated...</div>
                    )}
                  </div>
                );
              })}

              {/* Pending Inquiries for Venue Managers */}
              {venueBookings.filter((b) => b.status === 'PENDING').length > 0 && (
                <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Pending Venue Inquiries ({venueBookings.filter((b) => b.status === 'PENDING').length})
                    </h3>
                  </div>

                  {venueBookings
                    .filter((b) => b.status === 'PENDING')
                    .slice(0, 1)
                    .map((booking) => (
                      <div key={booking.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{booking.venue?.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{booking.targetDate}</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          <span className="font-semibold text-teal-700">{booking.requester?.name}:</span> &quot;
                          {booking.purpose}&quot; ({booking.attendeeCount} attendees)
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleApproveBooking(booking.id)}
                            className="text-xs font-bold px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm"
                          >
                            Approve Booking & Unlock Address
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* VERIFIED ECOSYSTEM SPACES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Verified Ecosystem Spaces in Hyderabad
                </h2>
                <p className="text-xs text-slate-500">Structured spaces with clear capacity, AV equipment, and instant confirmation.</p>
              </div>
              <Link href="/venues" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                Browse All Venues →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {venues.slice(0, 3).map((v) => (
                <ModernVenueCard
                  key={v.id}
                  venue={v}
                  onBook={(target) => setBookingVenue(target)}
                />
              ))}
            </div>
          </section>

          {/* FLAGSHIP EVENT RESOURCE TRACKER */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Resource-Driven Event Pipeline
                </h2>
                <p className="text-xs text-slate-500">Flagship events seeking verified venues, keynote speakers, and partners.</p>
              </div>
              <Link href="/events" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                View All Events →
              </Link>
            </div>

            {events.slice(0, 1).map((evt) => {
              const statusBadge = getStatusBadge(evt.status);
              return (
                <div key={evt.id} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {evt.date} · {evt.startTime} - {evt.endTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">{evt.description}</p>
                    </div>

                    <Link
                      href={`/events/${evt.slug || evt.id}`}
                      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 border border-slate-200 transition"
                    >
                      <span>Open Event Resource Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Requirements Progress Checklist */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Event Resource Fulfillment Checklist
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {evt.requirements?.map((req: any) => {
                        const isConfirmed = req.status === 'CONFIRMED';
                        return (
                          <div
                            key={req.id}
                            className={`p-3 rounded-2xl border text-xs space-y-1 ${
                              isConfirmed
                                ? 'bg-teal-50/80 border-teal-200 text-teal-900'
                                : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold uppercase text-[10px] tracking-wider">
                                {req.requirementType}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                                  isConfirmed
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {req.status}
                              </span>
                            </div>
                            <div className="font-semibold text-slate-900 line-clamp-1">{req.title}</div>
                            <div className="text-[11px] text-slate-500 truncate">{req.description}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>

      {/* Modals */}
      <NLPRequestModal
        isOpen={isNLPModalOpen}
        onClose={() => setIsNLPModalOpen(false)}
        initialPrompt={nlpPreFill}
        onSuccess={fetchDashboardData}
      />
      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      {selectedMatch && (
        <MatchExplanationModal
          isOpen={Boolean(selectedMatch)}
          onClose={() => setSelectedMatch(null)}
          match={selectedMatch}
        />
      )}
      {introRecipient && (
        <RequestIntroModal
          isOpen={Boolean(introRecipient)}
          onClose={() => setIntroRecipient(null)}
          recipient={introRecipient}
          onSuccess={fetchDashboardData}
        />
      )}
      {bookingVenue && (
        <VenueBookingModal
          isOpen={Boolean(bookingVenue)}
          onClose={() => setBookingVenue(null)}
          venue={bookingVenue}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
}
