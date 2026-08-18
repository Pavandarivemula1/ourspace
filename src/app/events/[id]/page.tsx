'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import { RecordOutcomeModal } from '@/components/modals/RecordOutcomeModal';
import { MultiDimensionReviewModal } from '@/components/modals/MultiDimensionReviewModal';
import { MatchExplanationModal } from '@/components/modals/MatchExplanationModal';
import { VenueBookingModal } from '@/components/modals/VenueBookingModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  Mic,
  Sparkles,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Award,
  Star,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { getStatusBadge, formatDate, getScoreColor } from '@/lib/utils';

export default function EventResourceHubPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Modals
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ id?: string; name?: string; dimension: string }>({ dimension: 'ORGANIZER' });
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [bookingVenue, setBookingVenue] = useState<any>(null);
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      if (data.event) {
        setEvent(data.event);
        setIsRegistered(data.isRegistered);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId, user]);

  const handleRSVP = async () => {
    try {
      setRsvpLoading(true);
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
      });
      const data = await res.json();
      setIsRegistered(data.registered);
      fetchEvent();
    } catch (e) {
      console.error(e);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleConfirmRequirement = async (reqId: string, payload: { userId?: string; venueId?: string }) => {
    try {
      const res = await fetch(`/api/events/${event.id}/requirements/${reqId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchEvent();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdvanceStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/events/${event.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchEvent();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizerId || user?.role === 'ADMIN';
  const statusBadge = getStatusBadge(event.status);

  // States list for visual tracker
  const workflowStates = [
    { id: 'SEEKING_RESOURCES', label: '1. Seeking Resources' },
    { id: 'PARTIALLY_FULFILLED', label: '2. Partially Fulfilled' },
    { id: 'REGISTRATION_OPEN', label: '3. Resources Confirmed & RSVP Open' },
    { id: 'LIVE', label: '4. Live' },
    { id: 'COMPLETED', label: '5. Completed' },
    { id: 'OUTCOME_RECORDED', label: '6. Outcome Recorded' },
  ];

  const stateIndex = workflowStates.findIndex((s) => s.id === event.status);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 bg-white shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center flex-wrap gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {event.category}
                  </span>
                  {isOrganizer && (
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
                      You are Organizer
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{event.description}</p>
              </div>

              {/* RSVP / Action Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shrink-0 w-full sm:w-64">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Registered:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {event.registrations?.length || 0} / {event.capacity} seats
                  </span>
                </div>

                <button
                  onClick={handleRSVP}
                  disabled={rsvpLoading}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                    isRegistered
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                  }`}
                >
                  {rsvpLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : isRegistered ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  <span>{isRegistered ? 'RSVP Confirmed (Cancel)' : 'RSVP for Event'}</span>
                </button>

                {isOrganizer && event.status !== 'COMPLETED' && event.status !== 'OUTCOME_RECORDED' && (
                  <button
                    onClick={() => handleAdvanceStatus('COMPLETED')}
                    className="w-full py-2 rounded-full font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition"
                  >
                    Mark Event as Completed →
                  </button>
                )}

                {isOrganizer && (event.status === 'COMPLETED' || event.status === 'OUTCOME_PENDING') && (
                  <button
                    onClick={() => setIsOutcomeModalOpen(true)}
                    className="w-full py-2 rounded-full font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm"
                  >
                    Record Real Outcome →
                  </button>
                )}
              </div>
            </div>

            {/* Key Event Details Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{event.locationCity}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Building className="w-4 h-4 text-teal-600" />
                <span>{event.venue ? event.venue.name : 'Venue Seeking'}</span>
              </div>
            </div>

            {/* Live State Machine Tracker */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Event State Machine Progression
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-[11px]">
                {workflowStates.map((st, idx) => {
                  const isCurrent = event.status === st.id;
                  const isPast = stateIndex >= idx && stateIndex !== -1;

                  return (
                    <div
                      key={st.id}
                      className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                        isCurrent
                          ? 'bg-teal-100 border-teal-300 text-teal-900 shadow-xs font-bold'
                          : isPast
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {st.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RESOURCE REQUIREMENTS WORKSPACE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  Event Resource Requirements & Matching Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Fulfill required resources below. Once all required elements are approved, the event auto-confirms!
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {event.requirements?.map((req: any) => {
                const isConfirmed = req.status === 'CONFIRMED';
                const isVenue = req.requirementType === 'VENUE';
                const isSpeaker = req.requirementType === 'SPEAKER';

                return (
                  <div
                    key={req.id}
                    className={`p-6 rounded-3xl border transition space-y-4 bg-white shadow-sm ${
                      isConfirmed
                        ? 'border-teal-300 bg-teal-50/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            isVenue
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : isSpeaker
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isVenue ? <Building className="w-5 h-5" /> : isSpeaker ? <Mic className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                              {req.requirementType} REQUIREMENT
                            </span>
                            {req.required && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{req.title}</h3>
                          <p className="text-xs text-slate-500">{req.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3.5 py-1 rounded-full border ${
                            isConfirmed
                              ? 'bg-teal-100 text-teal-800 border-teal-300'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isConfirmed ? '✓ CONFIRMED' : '⏳ PENDING FULFILLMENT'}
                        </span>
                      </div>
                    </div>

                    {/* If NOT confirmed, show Matching Candidates */}
                    {!isConfirmed && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            Recommended Candidate Matches for this Requirement
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {isVenue ? (
                            <div className="p-4 rounded-2xl bg-white border border-teal-200/80 space-y-2 text-xs shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">
                                  T-Hub Catalyst Stage & Innovation Arena
                                </span>
                                <span className="font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                                  94% MATCH
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Capacity: 120 seats · Hitec City · 4K Laser Projector, Wireless Mics, Wi-Fi.
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  onClick={() =>
                                    setSelectedMatch({
                                      totalScore: 94,
                                      matchType: 'VENUE',
                                      factors: { location: 30, availability: 25, capacity: 20, facilities: 14, reputation: 5 },
                                      explanation: [
                                        'Same city (Hyderabad, Hitec City) +30',
                                        'Available on Saturday evening target date +25',
                                        'Capacity compatible (120 seats for 45 attendees) +20',
                                        'Has requested facilities (4K Projector, Mics, Wi-Fi) +14',
                                        'Ecosystem verified venue provider +5',
                                      ],
                                      candidateName: 'T-Hub Catalyst Stage',
                                    })
                                  }
                                  className="text-[11px] text-teal-700 hover:underline font-bold"
                                >
                                  Why 94%? →
                                </button>

                                <button
                                  onClick={() =>
                                    handleConfirmRequirement(req.id, { venueId: 'venue-thub' })
                                  }
                                  className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white transition shadow-sm"
                                >
                                  Approve & Fulfill Venue
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl bg-white border border-cyan-200/80 space-y-2 text-xs shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">Dr. Vikram Rao</span>
                                <span className="font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300">
                                  92% MATCH
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                AI Research Director @ IIIT Hyderabad · Keynote speaker on Agentic Architectures.
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  onClick={() =>
                                    setSelectedMatch({
                                      totalScore: 92,
                                      matchType: 'SPEAKER',
                                      factors: { expertise: 35, availability: 20, location: 15, experience: 12, reputation: 10 },
                                      explanation: [
                                        'Deep expertise in Agentic LLM Architectures & Transformers +35',
                                        'Available on weekend evenings +20',
                                        'Local in Hyderabad (IIIT Hyderabad) +15',
                                        '18+ years research & industry track record +12',
                                        'Ecosystem verified keynote speaker with 4.95 score +10',
                                      ],
                                      candidateName: 'Dr. Vikram Rao',
                                    })
                                  }
                                  className="text-[11px] text-cyan-700 hover:underline font-bold"
                                >
                                  Why 92%? →
                                </button>

                                <button
                                  onClick={() =>
                                    handleConfirmRequirement(req.id, { userId: 'user-vikram' })
                                  }
                                  className="text-xs font-bold px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-sm"
                                >
                                  Confirm Speaker Role
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* OUTCOMES & REVIEWS SECTION */}
          {event.outcomes && event.outcomes.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl border border-teal-200 space-y-4 bg-teal-50/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-700" />
                  <h2 className="text-base font-bold text-slate-900">Recorded Event Outcome</h2>
                </div>
                <button
                  onClick={() => {
                    setReviewTarget({
                      id: event.organizerId,
                      name: event.organizer?.name,
                      dimension: 'ORGANIZER',
                    });
                    setIsReviewModalOpen(true);
                  }}
                  className="text-xs font-bold px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center gap-1.5 transition shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Leave Verified Review</span>
                </button>
              </div>

              {event.outcomes.map((out: any) => (
                <div key={out.id} className="p-4 rounded-2xl bg-white border border-teal-200 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-teal-900">{out.title}</span>
                    <span className="text-slate-500 font-mono">{formatDate(out.completedAt)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{out.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* REGISTERED ATTENDEES LIST */}
          <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Confirmed Attendees ({event.registrations?.length || 0})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.registrations?.map((reg: any) => (
                <div
                  key={reg.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                    {reg.user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{reg.user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{reg.user.profile?.headline || reg.user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Modals */}
      <RecordOutcomeModal
        isOpen={isOutcomeModalOpen}
        onClose={() => setIsOutcomeModalOpen(false)}
        eventId={event.id}
        defaultTitle={`Outcome for ${event.title}`}
        onSuccess={fetchEvent}
      />
      <MultiDimensionReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        revieweeId={reviewTarget.id}
        revieweeName={reviewTarget.name}
        defaultDimension={reviewTarget.dimension}
        onSuccess={fetchEvent}
      />
      {selectedMatch && (
        <MatchExplanationModal
          isOpen={Boolean(selectedMatch)}
          onClose={() => setSelectedMatch(null)}
          match={selectedMatch}
        />
      )}
      {bookingVenue && (
        <VenueBookingModal
          isOpen={Boolean(bookingVenue)}
          onClose={() => setBookingVenue(null)}
          venue={bookingVenue}
          eventId={event.id}
          eventRequirementId={currentReqId || undefined}
          onSuccess={fetchEvent}
        />
      )}
    </div>
  );
}
