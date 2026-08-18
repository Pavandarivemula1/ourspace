'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { NLPRequestModal } from '@/components/modals/NLPRequestModal';
import { MatchExplanationModal } from '@/components/modals/MatchExplanationModal';
import { RequestIntroModal } from '@/components/modals/RequestIntroModal';
import { VenueBookingModal } from '@/components/modals/VenueBookingModal';
import {
  Sparkles,
  Search,
  Building,
  User,
  Clock,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
  Plus,
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatDate, getScoreColor } from '@/lib/utils';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNLPModalOpen, setIsNLPModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [introRecipient, setIntroRecipient] = useState<any>(null);
  const [bookingVenue, setBookingVenue] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = activeType === 'ALL' ? '/api/requests' : `/api/requests?type=${activeType}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeType]);

  const requestTypes = [
    { id: 'ALL', label: 'All Needs' },
    { id: 'VENUE', label: 'Venues & Spaces' },
    { id: 'SPEAKER', label: 'AI Keynote Speakers' },
    { id: 'SPONSOR', label: 'Sponsors & Grants' },
    { id: 'MENTOR', label: 'Mentors & Advisors' },
    { id: 'PARTNER', label: 'Co-founders & Partners' },
    { id: 'DESIGNER', label: 'Product Designers' },
    { id: 'DEVELOPER', label: 'Engineers & Builders' },
  ];

  const filtered = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.locationCity.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar onOpenNLPModal={() => setIsNLPModalOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Search & Action Pill Bar (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">What do you need for your startup?</div>
                <div className="text-xs text-slate-500 truncate">
                  Ask in plain English or browse open founder requests in Hyderabad.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsNLPModalOpen(true)}
                className="text-xs font-bold px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Ask What You Need</span>
              </button>
            </div>
          </div>

          {/* Search Input and Filter Pills */}
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests by keyword, topic, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 pl-9 pr-4 py-2.5 rounded-full focus:outline-none focus:border-teal-500 shadow-sm"
              />
            </div>

            {/* Type Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {requestTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition shadow-2xs ${
                    activeType === t.id
                      ? 'bg-teal-600 text-white shadow-sm font-bold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {filtered.length} active needs & requests
            </h2>
            <span className="text-xs text-slate-500">Matching with verified ecosystem providers</span>
          </div>

          {/* Requests Grid */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="p-12 rounded-3xl text-center space-y-3 bg-white border border-slate-200 shadow-sm">
                <Sparkles className="w-8 h-8 text-slate-400 m-auto" />
                <div className="text-sm font-bold text-slate-800">No requests found</div>
                <p className="text-xs text-slate-500">Be the first to publish what you need for your startup.</p>
                <button
                  onClick={() => setIsNLPModalOpen(true)}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Create a Request →
                </button>
              </div>
            ) : (
              filtered.map((req) => {
                let reqTags: string[] = [];
                try {
                  reqTags = JSON.parse(req.requirements || '[]');
                } catch {
                  reqTags = [];
                }

                return (
                  <div
                    key={req.id}
                    className="p-6 rounded-3xl border border-slate-200 space-y-4 hover:shadow-md transition bg-white shadow-sm"
                  >
                    {/* Top Row: Requester info & badges */}
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-2xs">
                          {req.user.avatarUrl ? (
                            <img src={req.user.avatarUrl} alt={req.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                              {req.user.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {req.user.name}
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              {req.user.role}
                            </span>
                            {req.user.profile?.verificationLevel === 'ECOSYSTEM_VERIFIED' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{req.user.profile?.headline}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {req.requestType} NEED
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {req.budgetType}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
                    </div>

                    {/* Metadata & Requirements tags */}
                    <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {req.locationCity}
                      </span>
                      {req.targetDate && (
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {req.targetDate} ({req.targetTimeSlot || 'Evening'})
                        </span>
                      )}
                      {req.capacityNeeded && (
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                          <Users className="w-3 h-3 text-slate-400" />
                          Capacity: {req.capacityNeeded} seats
                        </span>
                      )}

                      {reqTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Matching Candidates Section */}
                    {req.matches && req.matches.length > 0 && (
                      <div className="mt-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                            Platform Calculated Matches ({req.matches.length})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {req.matches.map((m: any) => {
                            const candName =
                              req.requestType === 'VENUE'
                                ? 'T-Hub Catalyst Stage'
                                : 'Dr. Vikram Rao';

                            return (
                              <div
                                key={m.id}
                                className="p-3.5 rounded-2xl bg-white border border-teal-200/80 flex items-center justify-between text-xs shadow-2xs"
                              >
                                <div className="space-y-1">
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{candName}</span>
                                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                                      {m.totalScore}%
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setSelectedMatch({
                                        totalScore: m.totalScore,
                                        matchType: m.matchType,
                                        factors: m.factors,
                                        explanation: m.explanation,
                                        candidateName: candName,
                                      })
                                    }
                                    className="text-[11px] text-teal-700 hover:text-teal-800 font-bold"
                                  >
                                    Why this match? →
                                  </button>
                                </div>

                                <div>
                                  {req.requestType === 'VENUE' ? (
                                    <button
                                      onClick={() =>
                                        setBookingVenue({
                                          id: m.matchedVenueId || 'venue-thub',
                                          name: 'T-Hub Catalyst Stage & Innovation Arena',
                                          capacity: 120,
                                          locationCity: 'Hyderabad',
                                          neighborhood: 'Hitec City',
                                          pricingType: 'COMMUNITY_SPONSORED',
                                        })
                                      }
                                      className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white transition shadow-sm"
                                    >
                                      Book Venue
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setIntroRecipient({
                                          id: m.matchedUserId || 'user-vikram',
                                          name: 'Dr. Vikram Rao',
                                          headline: 'AI Research Director @ IIIT Hyderabad',
                                          role: 'PROFESSIONAL',
                                        })
                                      }
                                      className="text-xs font-bold px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                                    >
                                      Request Intro
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <NLPRequestModal
        isOpen={isNLPModalOpen}
        onClose={() => setIsNLPModalOpen(false)}
        onSuccess={fetchRequests}
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
          onSuccess={fetchRequests}
        />
      )}
      {bookingVenue && (
        <VenueBookingModal
          isOpen={Boolean(bookingVenue)}
          onClose={() => setBookingVenue(null)}
          venue={bookingVenue}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
}
