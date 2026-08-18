'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Shield,
  Users,
  Building,
  Calendar,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [verifications, setVerifications] = useState<any>({ venues: [], users: [] });
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'moderation' | 'audit'>('verifications');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, verRes, repRes, logRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/verifications'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/audit-logs'),
      ]);

      const [statsData, verData, repData, logData] = await Promise.all([
        statsRes.json(),
        verRes.json(),
        repRes.json(),
        logRes.json(),
      ]);

      if (statsData.metrics) setStats(statsData.metrics);
      if (verData.venues) setVerifications(verData);
      if (repData.reports) setReports(repData.reports);
      if (logData.logs) setAuditLogs(logData.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (entityType: 'VENUE' | 'USER', entityId: string, isVerified: boolean) => {
    try {
      await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId, isVerified }),
      });
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (reportId: string, actionTaken: string) => {
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: 'RESOLVED', actionTaken }),
      });
      fetchAdminData();
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
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-slate-900">Platform Admin Operations & Governance</div>
                <div className="text-xs text-slate-500 truncate">
                  Verify ecosystem entities, investigate content reports, inspect platform audit history, and monitor successful collaborations.
                </div>
              </div>
            </div>
          </div>

          {/* KPI Analytics Cards */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Registered Users</div>
                <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
                <div className="text-[11px] text-teal-700 font-semibold">{stats.activeUsers} active</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Verified Venues</div>
                <div className="text-2xl font-black text-cyan-700">{stats.verifiedVenues} / {stats.totalVenues}</div>
                <div className="text-[11px] text-slate-500 font-medium">Innovation stages</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Collaborations</div>
                <div className="text-2xl font-black text-teal-700">{stats.completedCollabs}</div>
                <div className="text-[11px] text-slate-500 font-medium">Recorded outcomes</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Pending Moderation</div>
                <div className="text-2xl font-black text-rose-600">{stats.pendingReports}</div>
                <div className="text-[11px] text-slate-500 font-medium">Reports queue</div>
              </div>
            </div>
          )}

          {/* Admin Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs max-w-lg">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`flex-1 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'verifications' ? 'bg-white text-teal-900 shadow-sm font-bold' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verification Queue
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex-1 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'moderation' ? 'bg-white text-rose-900 shadow-sm font-bold' : 'text-slate-600'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Reports & Safety
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'audit' ? 'bg-white text-cyan-900 shadow-sm font-bold' : 'text-slate-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Audit Log
            </button>
          </div>

          {/* Tab 1: Verifications Queue */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Venues Verification Status
              </h2>

              <div className="space-y-3">
                {verifications.venues.map((v: any) => (
                  <div
                    key={v.id}
                    className="p-5 rounded-3xl border border-slate-200 flex items-center justify-between text-xs bg-white shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{v.name}</span>
                        {v.isVerified ? (
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200 font-bold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">
                        {v.neighborhood}, Hyderabad · Host: {v.owner?.name} ({v.owner?.email})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {v.isVerified ? (
                        <button
                          onClick={() => handleVerify('VENUE', v.id, false)}
                          className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify('VENUE', v.id, true)}
                          className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition"
                        >
                          Approve Verification
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Moderation & Reports */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Flagged Content & Reports
              </h2>

              {reports.length === 0 ? (
                <div className="p-12 rounded-3xl text-center text-xs text-slate-400 bg-white border border-slate-200 shadow-sm">
                  No active reports in queue. Clean ecosystem posture.
                </div>
              ) : (
                reports.map((rep) => (
                  <div key={rep.id} className="p-5 rounded-3xl border border-slate-200 space-y-2.5 text-xs bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-600 text-sm">{rep.reason}</span>
                      <span className="text-slate-500 font-medium">{rep.status}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rep.details}</p>
                    {rep.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'NONE')}
                          className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'USER_SUSPENDED')}
                          className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm transition"
                        >
                          Suspend User
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Platform Audit Log Stream */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Real-Time Audit Stream
              </h2>

              <div className="p-4 rounded-3xl border border-slate-200 divide-y divide-slate-100 max-h-96 overflow-y-auto bg-white shadow-sm">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">
                        <span className="text-teal-700">{log.actor?.name}</span> performed{' '}
                        <span className="font-mono text-cyan-700">{log.action}</span> on {log.entityType}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-lg">{log.details}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">{formatDate(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
