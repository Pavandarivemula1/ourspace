'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface HeroIntentSearchCardProps {
  onTriggerNLP?: (prompt: string) => void;
}

export function HeroIntentSearchCard({ onTriggerNLP }: HeroIntentSearchCardProps) {
  const [whereTo, setWhereTo] = useState('Hyderabad, Hitec City');
  const [activity, setActivity] = useState('');
  const [when, setWhen] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (onTriggerNLP && activity.trim()) {
      const generatedPrompt = `I am looking for a space in ${whereTo || 'Hyderabad'} for ${activity}${
        when ? ` on ${when}` : ''
      }.`;
      onTriggerNLP(generatedPrompt);
    } else {
      const query = [activity, whereTo, when].filter(Boolean).join(' ');
      router.push(`/venues?q=${encodeURIComponent(query || 'Hyderabad')}`);
    }
  };

  return (
    <div className="intent-search-pod p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl relative">
      <form onSubmit={handleSearch} className="space-y-3.5">
        {/* Section 1: Where to ? */}
        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-900">
            Where to ?
          </label>
          <div className="relative">
            <input
              type="text"
              value={whereTo}
              onChange={(e) => setWhereTo(e.target.value)}
              placeholder="Enter city or neighborhood"
              className="w-full text-xs font-semibold text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-zinc-200" />

        {/* Section 2: What are you planning ? */}
        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-900">
            What are you planning ?
          </label>
          <div className="relative">
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. AI Meetup, Founder Pitch, Keynote, Workshop"
              className="w-full text-xs font-semibold text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-zinc-200" />

        {/* Section 3: When ? */}
        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-900">
            When ?
          </label>
          <div className="relative">
            <input
              type="text"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="Anytime (e.g. Next Saturday evening)"
              className="w-full text-xs font-semibold text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg active:scale-[0.99]"
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span>Search Spaces & Resources</span>
          </button>
        </div>
      </form>
    </div>
  );
}
