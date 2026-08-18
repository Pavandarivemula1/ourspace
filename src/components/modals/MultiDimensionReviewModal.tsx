'use client';

import React, { useState } from 'react';
import { Star, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface MultiDimensionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  revieweeId?: string;
  revieweeName?: string;
  outcomeId?: string;
  defaultDimension?: string;
  onSuccess?: () => void;
}

export function MultiDimensionReviewModal({
  isOpen,
  onClose,
  revieweeId,
  revieweeName = 'Collaborator',
  outcomeId,
  defaultDimension = 'COLLABORATOR',
  onSuccess,
}: MultiDimensionReviewModalProps) {
  const [dimension, setDimension] = useState(defaultDimension);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [wasPunctual, setWasPunctual] = useState(true);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcomeId: outcomeId || null,
          revieweeId,
          dimension,
          rating,
          content,
          wasPunctual,
          wouldRecommend,
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
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Leave Verified Review</h2>
              <p className="text-xs text-slate-500">Multi-dimensional reputation based on real collaboration.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reputation Dimension *</label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="COLLABORATOR">Collaborator / Technical Partner</option>
              <option value="SPEAKER">Keynote Speaker / Presenter</option>
              <option value="VENUE">Venue & Facility Host</option>
              <option value="ORGANIZER">Event Organizer</option>
              <option value="COMMUNITY">Community Host</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Rating (1 to 5 Stars) *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-slate-600 text-xs font-bold ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Feedback for {revieweeName} *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              required
              placeholder="How was the collaboration? Punctuality, communication, technical rigor, or venue experience?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={wasPunctual}
                onChange={(e) => setWasPunctual(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-0"
              />
              <span>Punctual & Responsive</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-0"
              />
              <span>Would Recommend</span>
            </label>
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
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
