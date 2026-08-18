'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check, AlertCircle, ArrowRight, RefreshCw, Layers } from 'lucide-react';

interface NLPRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSuccess?: () => void;
}

export function NLPRequestModal({ isOpen, onClose, initialPrompt, onSuccess }: NLPRequestModalProps) {
  const [nlText, setNlText] = useState(
    initialPrompt ||
      'I want to conduct a 40-person AI meetup in Hyderabad next Saturday evening. I need a free venue and one AI speaker.'
  );

  React.useEffect(() => {
    if (initialPrompt) setNlText(initialPrompt);
  }, [initialPrompt]);

  const [isParsing, setIsParsing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'nlp' | 'manual'>('nlp');

  // Form fields for editing/review
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState('VENUE');
  const [locationCity, setLocationCity] = useState('Hyderabad');
  const [capacityNeeded, setCapacityNeeded] = useState<number | string>('40');
  const [targetDate, setTargetDate] = useState('');
  const [targetTimeSlot, setTargetTimeSlot] = useState('EVENING');
  const [budgetType, setBudgetType] = useState('FREE');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [category, setCategory] = useState('AI');

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!nlText.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch('/api/requests/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nlText }),
      });
      const data = await res.json();
      if (data.parsed) {
        const p = data.parsed;
        setParsedData(p);
        setTitle(p.title || 'Tech Meetup & Workshop');
        setRequestType(p.requestType || 'VENUE');
        setLocationCity(p.locationCity || 'Hyderabad');
        setCapacityNeeded(p.capacityNeeded || 40);
        setTargetDate(p.targetDate || '');
        setTargetTimeSlot(p.targetTimeSlot || 'EVENING');
        setBudgetType(p.budgetType || 'FREE');
        setDescription(nlText);
        setRequirementsInput(p.requirements ? p.requirements.join(', ') : '');
        setCategory(p.category || 'AI');
      }
    } catch (e) {
      console.error('Error parsing request:', e);
    } finally {
      setIsParsing(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const reqList = requirementsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          requestType,
          description: description || nlText,
          locationCity,
          capacityNeeded: capacityNeeded ? Number(capacityNeeded) : null,
          targetDate: targetDate || null,
          targetTimeSlot,
          budgetType,
          category,
          requirements: reqList,
        }),
      });

      if (res.ok) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e) {
      console.error('Error publishing request:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Ask What You Need
              </h2>
              <p className="text-xs text-slate-500">
                Describe your need in plain English or fill out the structured form.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-full text-xs font-semibold max-w-xs">
          <button
            type="button"
            onClick={() => setActiveTab('nlp')}
            className={`flex-1 py-1.5 rounded-full transition ${
              activeTab === 'nlp'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Natural Language
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 rounded-full transition ${
              activeTab === 'manual'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Manual Form
          </button>
        </div>

        {/* Tab 1: Natural Language Box & Entity Extraction */}
        {activeTab === 'nlp' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Natural Language Request Prompt
              </label>
              <textarea
                value={nlText}
                onChange={(e) => setNlText(e.target.value)}
                rows={3}
                placeholder="e.g. I want to conduct a 40-person AI meetup in Hyderabad next Saturday evening. I need a free venue and one AI speaker."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 leading-relaxed shadow-inner"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParse}
                disabled={isParsing || !nlText.trim()}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-full text-xs transition shadow-sm disabled:opacity-50"
              >
                {isParsing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Extract Structured Intent</span>
              </button>
            </div>

            {parsedData && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-600" />
                    Structured Intent Extracted Successfully
                  </span>
                  <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                    Confidence: {parsedData.confidence}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-teal-900">
                  <div>
                    <span className="text-teal-700 font-semibold">Type:</span> {parsedData.requestType}
                  </div>
                  <div>
                    <span className="text-teal-700 font-semibold">City:</span> {parsedData.locationCity}
                  </div>
                  <div>
                    <span className="text-teal-700 font-semibold">Capacity:</span> {parsedData.capacityNeeded}
                  </div>
                  <div>
                    <span className="text-teal-700 font-semibold">Time:</span> {parsedData.targetTimeSlot}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Structured Form (Review & Edit before publishing) */}
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pt-2 border-t border-slate-100">
            Request Parameters (Review & Publish)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. AI Founders Meetup & Keynote Space"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Request Type *</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="VENUE">Venue / Event Space</option>
                <option value="SPEAKER">Keynote Speaker</option>
                <option value="SPONSOR">Sponsor / Grant</option>
                <option value="MENTOR">Mentor / Technical Advisor</option>
                <option value="PARTNER">Co-founder / Strategic Partner</option>
                <option value="DESIGNER">Product Designer</option>
                <option value="DEVELOPER">Software Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Location City *</label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                required
                placeholder="Hyderabad"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Capacity Needed (Seats)</label>
              <input
                type="number"
                value={capacityNeeded}
                onChange={(e) => setCapacityNeeded(e.target.value)}
                placeholder="40"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Preferred Time Slot</label>
              <select
                value={targetTimeSlot}
                onChange={(e) => setTargetTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="EVENING">Evening (5 PM - 9 PM)</option>
                <option value="MORNING">Morning (9 AM - 1 PM)</option>
                <option value="AFTERNOON">Afternoon (1 PM - 5 PM)</option>
                <option value="FULL_DAY">Full Day</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Budget / Terms</label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="FREE">Free / Community-Sponsored</option>
                <option value="BARTER">Barter / Resource Trade</option>
                <option value="DISCOUNTED">Discounted Budget</option>
                <option value="PAID">Standard Commercial Rate</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="AI">Artificial Intelligence & LLMs</option>
                <option value="Web3">Web3 & Decentralized</option>
                <option value="SaaS">B2B SaaS</option>
                <option value="DeepTech">DeepTech & Hardware</option>
                <option value="Fintech">Fintech</option>
                <option value="General">General Startup</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Required Tags / Equipment (comma-separated)
            </label>
            <input
              type="text"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="e.g. AI Speaker, 4K Projector, Wireless Mics, Wi-Fi"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
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
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-md disabled:opacity-50"
            >
              {isPublishing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Publish Need & Find Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
