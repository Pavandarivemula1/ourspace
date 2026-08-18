'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  UserCheck,
  UserPlus,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [intros, setIntros] = useState<{ received: any[]; sent: any[] }>({ received: [], sent: [] });
  const [activeTab, setActiveTab] = useState<'connections' | 'intros'>('connections');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [connRes, introRes] = await Promise.all([
        fetch('/api/connections'),
        fetch('/api/introductions'),
      ]);
      const [connData, introData] = await Promise.all([connRes.json(), introRes.json()]);

      if (connData.connections) setConnections(connData.connections);
      if (introData.received) setIntros(introData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRespondIntro = async (id: string, accept: boolean) => {
    try {
      await fetch(`/api/introductions/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accept }),
      });
      fetchData();
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
          {/* Top Pill Header (Matching /venues aesthetic) */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Connections & Peer Network</div>
                <div className="text-xs text-slate-500 truncate">
                  Direct introductions formed through explicit needs and verified event collaborations. Zero cold spam.
                </div>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs max-w-md">
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'connections'
                  ? 'bg-white text-purple-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Active Connections ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('intros')}
              className={`flex-1 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'intros'
                  ? 'bg-white text-purple-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Intro Requests ({intros.received.filter((i) => i.status === 'PENDING').length})
            </button>
          </div>

          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              {connections.length === 0 ? (
                <div className="p-12 rounded-3xl text-center space-y-2 text-xs text-slate-400 bg-white border border-slate-200 shadow-sm">
                  <UserCheck className="w-8 h-8 text-slate-300 m-auto" />
                  <div className="font-bold text-slate-700">No active connections yet. Request an introduction on any Need or Offer card.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {connections.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 rounded-3xl border border-slate-200 space-y-4 hover:shadow-md transition bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                            {c.partner.avatarUrl ? (
                              <img src={c.partner.avatarUrl} alt={c.partner.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                                {c.partner.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                              {c.partner.name}
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                                {c.partner.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">{c.partner.profile?.headline}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          {c.relationshipType}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Connected since {formatDate(c.connectedSince)}
                        </span>

                        <Link
                          href="/messages"
                          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Direct Chat</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Intros Tab */}
          {activeTab === 'intros' && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Received Requests</h2>

              {intros.received.length === 0 ? (
                <div className="p-8 rounded-3xl text-center text-xs text-slate-400 bg-white border border-slate-200 shadow-sm">
                  No received introduction requests.
                </div>
              ) : (
                intros.received.map((intro) => (
                  <div
                    key={intro.id}
                    className="p-5 rounded-3xl border border-slate-200 space-y-3 text-xs bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{intro.requester?.name}</span>
                        <span className="text-slate-500 font-medium">({intro.requester?.role})</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{formatDate(intro.createdAt)}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                      <span className="font-bold text-purple-800">Intent Reason:</span> &quot;{intro.reason}&quot;
                    </div>

                    {intro.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleRespondIntro(intro.id, false)}
                          className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespondIntro(intro.id, true)}
                          className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                        >
                          Accept & Unlock Chat
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-[11px] font-bold text-slate-500">Status: {intro.status}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
