'use client';

import React, { useState } from 'react';
import { Award, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RecordOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborationId?: string;
  eventId?: string;
  defaultTitle?: string;
  onSuccess?: () => void;
}

export function RecordOutcomeModal({
  isOpen,
  onClose,
  collaborationId,
  eventId,
  defaultTitle,
  onSuccess,
}: RecordOutcomeModalProps) {
  const [outcomeType, setOutcomeType] = useState('EVENT_COMPLETED');
  const [title, setTitle] = useState(defaultTitle || 'Completed Event Session / Initiative');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState('{"attendees": 42, "deliverables": "Production MVP"}');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let parsedMetrics: any = null;
      try {
        parsedMetrics = JSON.parse(metrics);
      } catch {
        parsedMetrics = { summary: metrics };
      }

      const res = await fetch(`/api/collaborations/${collaborationId || 'none'}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcomeType,
          title,
          description,
          metrics: parsedMetrics,
          eventId,
        }),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
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
              <Award className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Record Real-World Outcome</h2>
              <p className="text-xs text-slate-500">The platform optimizes for completed outcomes, not vanity metrics.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Outcome Type *</label>
            <select
              value={outcomeType}
              onChange={(e) => setOutcomeType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
            >
              <option value="EVENT_COMPLETED">Event Successfully Completed</option>
              <option value="PARTNERSHIP_CREATED">Strategic Partnership Formed</option>
              <option value="MENTORSHIP_STARTED">Mentorship & Architecture Completed</option>
              <option value="SPEAKER_CONFIRMED">Speaker Keynote Delivered</option>
              <option value="VENUE_USED">Venue Space Utilized</option>
              <option value="CUSTOMER_INTRODUCED">Customer / Design Partner Introduced</option>
              <option value="RESOURCE_SHARED">Startup Resource Successfully Shared</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Outcome Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">What was achieved / completed? *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              placeholder="e.g. 42 builders attended the meetup at T-Hub, 3 open-source pull requests merged, and follow-up hackathon teams formed."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Key Metrics / Outputs (JSON or summary)</label>
            <input
              type="text"
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder='e.g. {"attendees": 42, "rating": 4.9}'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800 focus:outline-none focus:border-teal-500"
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
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Record Outcome & Open Reviews</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
