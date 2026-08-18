'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import { RequestIntroModal } from '@/components/modals/RequestIntroModal';
import {
  User,
  MapPin,
  Sparkles,
  Gift,
  Building,
  Star,
  ShieldCheck,
  Award,
  Calendar,
  Layers,
  MessageSquare,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfileDetailPage() {
  const params = useParams();
  const profileId = params?.id as string;
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profiles/${profileId}`);
      const data = await res.json();
      if (data.user) setProfileData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) fetchProfile();
  }, [profileId]);

  if (loading || !profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  const u = profileData.user;
  const p = u.profile || {};
  let lookingForTags: string[] = [];
  let canOfferTags: string[] = [];
  let skillsTags: string[] = [];

  try {
    lookingForTags = JSON.parse(p.lookingFor || '[]');
    canOfferTags = JSON.parse(p.canOffer || '[]');
    skillsTags = JSON.parse(p.skills || '[]');
  } catch {}

  const isOwn = profileData.isOwnProfile;
  const isConnected = profileData.isConnected;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 bg-white shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="font-black text-xl text-slate-600">
                      {u.name[0]}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900">{u.name}</h1>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {u.role}
                    </span>
                    {p.verificationLevel === 'ECOSYSTEM_VERIFIED' && (
                      <span className="text-xs font-bold text-teal-700 flex items-center gap-1 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{p.headline}</p>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.locationCity}, {p.locationCountry}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {!isOwn && (
                  isConnected ? (
                    <Link
                      href="/messages"
                      className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Direct Chat</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsIntroModalOpen(true)}
                      className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition shadow-sm"
                    >
                      Request Introduction
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Multi-Dimensional Reputation Deck */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Multi-Dimensional Verified Reputation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5 text-center shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Collaborator</div>
                  <div className="text-sm font-black text-teal-700 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                    {p.collaboratorScore?.toFixed(2) || '5.00'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5 text-center shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Speaker</div>
                  <div className="text-sm font-black text-cyan-700 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-cyan-600 text-cyan-600" />
                    {p.speakerScore?.toFixed(2) || '5.00'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5 text-center shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Organizer</div>
                  <div className="text-sm font-black text-purple-700 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                    {p.organizerScore?.toFixed(2) || '5.00'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5 text-center shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Venue Host</div>
                  <div className="text-sm font-black text-amber-600 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {p.venueScore?.toFixed(2) || '5.00'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5 text-center shadow-2xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Collaborations</div>
                  <div className="text-sm font-black text-slate-900">
                    {p.collaborationsCount || 0} completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Intent Triad: Building / Needs / Offers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. What I am building */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-3 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-800">
                <Building className="w-4 h-4 text-cyan-600" />
                What I&apos;m Building
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {p.building || p.bio || 'Building deep tech products in Hyderabad startup ecosystem.'}
              </p>
            </div>

            {/* 2. What I Need */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-3 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Sparkles className="w-4 h-4 text-teal-600" />
                What I Need
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lookingForTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. What I Can Offer */}
            <div className="p-6 rounded-3xl border border-slate-200 space-y-3 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                <Gift className="w-4 h-4 text-purple-600" />
                What I Can Offer
              </div>
              <div className="flex flex-wrap gap-1.5">
                {canOfferTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Reviews Section */}
          {u.reviewsReceived && u.reviewsReceived.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Verified Collaboration Reviews ({u.reviewsReceived.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {u.reviewsReceived.map((rev: any) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.reviewer?.name}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed">&quot;{rev.content}&quot;</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Dimension: {rev.dimension} · {formatDate(rev.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <RequestIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => setIsIntroModalOpen(false)}
        recipient={u}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
