'use client';

import React, { useState } from 'react';
import { Gift, X, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateOfferModal({ isOpen, onClose, onSuccess }: CreateOfferModalProps) {
  const [title, setTitle] = useState('');
  const [offerType, setOfferType] = useState('EVENT_VENUE');
  const [category, setCategory] = useState('Workspace');
  const [description, setDescription] = useState('');
  const [locationCity, setLocationCity] = useState('Hyderabad');
  const [capacity, setCapacity] = useState<number | string>('50');
  const [pricingType, setPricingType] = useState('FREE');
  const [availability, setAvailability] = useState('Available Saturdays & Weekdays after 6pm');
  const [requirementsInput, setRequirementsInput] = useState('Projector, Wi-Fi, AC');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const reqList = requirementsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          offerType,
          category,
          description,
          locationCity,
          capacity: capacity ? Number(capacity) : null,
          pricingType,
          availability,
          requirements: reqList,
        }),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Publish Ecosystem Offer</h2>
              <p className="text-xs text-slate-500">Provide office space, talks, mentorship, or startup services.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Offer Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Free 50-Seat Auditorium on Saturdays"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Offer Type *</label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
              >
                <option value="EVENT_VENUE">Event Space / Office</option>
                <option value="SPEAKING">Keynote Speaking</option>
                <option value="MENTORSHIP">Mentorship & Architecture</option>
                <option value="ENGINEERING">Engineering Support</option>
                <option value="DESIGN">Design & UX</option>
                <option value="SPONSORSHIP">Sponsorship</option>
                <option value="COMMUNITY_ACCESS">Community Access</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pricing Model *</label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
              >
                <option value="FREE">100% Free for Startups</option>
                <option value="BARTER">Barter / Skill Exchange</option>
                <option value="DISCOUNTED">Discounted / Subsidized</option>
                <option value="PAID">Standard Commercial Rate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">What are you offering? *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              placeholder="Describe your space, expertise, or resources in detail..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">City Location *</label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Capacity / Seats</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Availability Schedule</label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekend evenings, 2 hours/week"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Included Amenities / Tags</label>
            <input
              type="text"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="e.g. Projector, Wireless Mics, Fiber Wi-Fi"
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
              disabled={isPublishing || !title.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Publish Offer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
