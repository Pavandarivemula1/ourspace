'use client';

import React, { useState } from 'react';
import { UserCheck, X, RefreshCw, Send, ShieldCheck, Star } from 'lucide-react';

interface RequestIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient?: {
    id: string;
    name: string;
    headline?: string;
    role?: string;
    avatarUrl?: string;
    verificationLevel?: string;
  };
  requestId?: string;
  onSuccess?: () => void;
}

export function RequestIntroModal({
  isOpen,
  onClose,
  recipient,
  requestId,
  onSuccess,
}: RequestIntroModalProps) {
  const [reason, setReason] = useState('');
  const [context, setContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !recipient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/introductions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: recipient.id,
          requestId: requestId || null,
          reason,
          context,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send introduction request');
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
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Request Introduction</h2>
              <p className="text-xs text-slate-500">Every introduction requires an explicit intent reason.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center font-bold text-slate-700">
            {recipient.avatarUrl ? (
              <img src={recipient.avatarUrl} alt={recipient.name} className="w-full h-full object-cover" />
            ) : (
              recipient.name[0]
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              {recipient.name}
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                {recipient.role}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1">{recipient.headline}</div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Why do you want to connect? (Specific Objective) *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder="e.g. We are organizing the Hyderabad AI Meetup and would love to invite you as our Keynote Speaker on Agentic Architectures."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Additional Context / Links (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Event agenda: https://ecosystem.hyd/events/ai-meetup"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
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
              disabled={isSubmitting || !reason.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Introduction Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
