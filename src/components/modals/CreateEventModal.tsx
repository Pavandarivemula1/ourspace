'use client';

import React, { useState } from 'react';
import { Calendar, X, Plus, Trash2, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI');
  const [date, setDate] = useState('2026-08-29');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:00');
  const [locationCity, setLocationCity] = useState('Hyderabad');
  const [capacity, setCapacity] = useState('60');

  // Resource requirements builder
  const [requirements, setRequirements] = useState([
    { requirementType: 'VENUE', title: '50-60 person Event Space in Hitec City', required: true, description: 'Auditorium with 4K projector and audio setup' },
    { requirementType: 'SPEAKER', title: 'Keynote Speaker: LLM Agent Reliability', required: true, description: '30-minute deep-dive talk on agent evaluation' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { requirementType: 'SPONSOR', title: 'Coffee & Snacks Sponsor', required: false, description: 'Refreshments for 50 attendees' },
    ]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, field: string, value: any) => {
    const updated = [...requirements];
    (updated[index] as any)[field] = value;
    setRequirements(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          date,
          startTime,
          endTime,
          locationCity,
          capacity: Number(capacity),
          requirements,
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
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Host Resource-Seeking Event</h2>
              <p className="text-xs text-slate-500">
                Define required venue, speakers, or sponsors. Event auto-confirms when fulfilled!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. AI Founders & Builders Meetup"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
                placeholder="What is this event about?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
              >
                <option value="AI">AI & Machine Learning</option>
                <option value="Web3">Web3 & Crypto</option>
                <option value="SaaS">SaaS & Enterprise</option>
                <option value="DeepTech">DeepTech</option>
                <option value="Fintech">Fintech</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Time (Start - End)</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expected Capacity (Seats)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="60"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Dynamic Resource Requirements Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Required Resources to Match & Fulfill
              </span>
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-800 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Resource Requirement</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={req.requirementType}
                      onChange={(e) => updateRequirement(idx, 'requirementType', e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900 font-semibold"
                    >
                      <option value="VENUE">Venue / Space</option>
                      <option value="SPEAKER">Keynote Speaker</option>
                      <option value="SPONSOR">Sponsor</option>
                      <option value="COMMUNITY">Community Partner</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        checked={req.required}
                        onChange={(e) => updateRequirement(idx, 'required', e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-0"
                      />
                      <span>Required</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={req.title}
                    onChange={(e) => updateRequirement(idx, 'title', e.target.value)}
                    placeholder="Requirement summary"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
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
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Publish Event & Seek Resources</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
