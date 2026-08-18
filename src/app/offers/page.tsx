'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateOfferModal } from '@/components/modals/CreateOfferModal';
import { RequestIntroModal } from '@/components/modals/RequestIntroModal';
import {
  Gift,
  Search,
  Building,
  User,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [introRecipient, setIntroRecipient] = useState<any>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const url = activeType === 'ALL' ? '/api/offers' : `/api/offers?type=${activeType}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.offers) {
        setOffers(data.offers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [activeType]);

  const offerTypes = [
    { id: 'ALL', label: 'All Offers' },
    { id: 'EVENT_VENUE', label: 'Event Spaces & Offices' },
    { id: 'SPEAKING', label: 'Keynote Speaking' },
    { id: 'MENTORSHIP', label: 'Startup Mentorship' },
    { id: 'ENGINEERING', label: 'Engineering Support' },
    { id: 'DESIGN', label: 'Design & UX' },
    { id: 'SPONSORSHIP', label: 'Sponsorships' },
  ];

  const filtered = offers.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.locationCity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar onOpenOfferModal={() => setIsOfferModalOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Search & Action Pill Bar (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Ecosystem Offers & Resources</div>
                <div className="text-xs text-slate-500 truncate">
                  Explore available event venues, technical keynote speakers, mentorship, and equipment.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="text-xs font-bold px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20 transition flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Offer</span>
              </button>
            </div>
          </div>

          {/* Search Input and Filter Pills */}
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search offers by title, skill, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-900 pl-9 pr-4 py-2.5 rounded-full focus:outline-none focus:border-purple-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {offerTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition shadow-2xs ${
                    activeType === t.id
                      ? 'bg-purple-600 text-white shadow-sm font-bold'
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
              {filtered.length} resources & offers available
            </h2>
            <span className="text-xs text-slate-500">Verified ecosystem offerings</span>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((offer) => {
              let reqTags: string[] = [];
              try {
                reqTags = JSON.parse(offer.requirements || '[]');
              } catch {
                reqTags = [];
              }

              return (
                <div
                  key={offer.id}
                  className="p-6 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition bg-white shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-2xs">
                          {offer.user.avatarUrl ? (
                            <img src={offer.user.avatarUrl} alt={offer.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                              {offer.user.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {offer.user.name}
                            {offer.user.profile?.verificationLevel === 'ECOSYSTEM_VERIFIED' && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{offer.user.profile?.headline}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        {offer.pricingType}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">{offer.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{offer.description}</p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {offer.locationCity}
                      </span>
                      {offer.capacity && (
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                          <Users className="w-3 h-3 text-slate-400" />
                          Capacity: {offer.capacity}
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-700 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {offer.availability}
                      </span>
                      {reqTags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{offer.category}</span>
                    <button
                      onClick={() =>
                        setIntroRecipient({
                          id: offer.userId,
                          name: offer.user.name,
                          headline: offer.user.profile?.headline,
                          role: offer.user.role,
                          avatarUrl: offer.user.avatarUrl,
                        })
                      }
                      className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-600 text-white transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Connect / Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={fetchOffers}
      />
      {introRecipient && (
        <RequestIntroModal
          isOpen={Boolean(introRecipient)}
          onClose={() => setIntroRecipient(null)}
          recipient={introRecipient}
          onSuccess={fetchOffers}
        />
      )}
    </div>
  );
}
