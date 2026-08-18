'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Compass,
  Sparkles,
  Building,
  User,
  Users,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Gift,
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FOUNDER');
  const [locationCity, setLocationCity] = useState('Hyderabad');
  const [building, setBuilding] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>(['Event Venue', 'AI Speaker']);
  const [canOffer, setCanOffer] = useState<string[]>(['AI Engineering']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { refreshUser } = useAuth();
  const router = useRouter();

  const lookingForOptions = [
    'Founders',
    'Customers',
    'Partnerships',
    'Event Venue',
    'AI Speaker',
    'Sponsor / Grant',
    'Mentorship',
    'Engineering Talent',
    'Design Partners',
    'Startup Resources',
  ];

  const canOfferOptions = [
    'Mentorship',
    'Keynote Speaking',
    'Office / Event Space',
    'AI Engineering',
    'Product Design',
    'Sponsorship',
    'Community Access',
    'Strategic Partnerships',
    'Startup Resources',
  ];

  const toggleItem = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          locationCity,
          building,
          lookingFor,
          canOffer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        await refreshUser();
        router.push('/');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 max-w-xl w-full space-y-6 shadow-xl relative z-10 my-8 bg-white">
        {/* Brand & Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Intent-First Onboarding
              </span>
            </div>
            <span className="text-xs font-mono text-teal-700 font-bold">Step {step} of 3</span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Who are you & Credentials */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">Who are you?</h2>
              <p className="text-slate-500">Select your primary role in the ecosystem and set your login details.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'FOUNDER', label: 'Founder', icon: Sparkles },
                { id: 'STARTUP', label: 'Startup / Org', icon: Building },
                { id: 'COMMUNITY', label: 'Community', icon: Users },
                { id: 'VENUE', label: 'Venue Space', icon: Building },
                { id: 'PROFESSIONAL', label: 'Professional', icon: User },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div>{r.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@neuralflow.ai"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City Location *</label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!name || !email || !password}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What are you looking for & What can you offer? */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">What are you looking for?</h2>
              <p className="text-slate-500">Select what you need (multiple selections allowed):</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {lookingForOptions.map((opt) => {
                const isSelected = lookingFor.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleItem(lookingFor, opt, setLookingFor)}
                    className={`px-3.5 py-1.5 rounded-full font-medium border transition ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 pt-3">
              <h2 className="text-base font-black text-slate-900">What can you offer?</h2>
              <p className="text-slate-500">Select resources you can provide to peers:</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canOfferOptions.map((opt) => {
                const isSelected = canOffer.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleItem(canOffer, opt, setCanOffer)}
                    className={`px-3.5 py-1.5 rounded-full font-medium border transition ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: What are you building? */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">What are you currently building?</h2>
              <p className="text-slate-500">
                Help ecosystem peers understand your startup, research, or venue mission.
              </p>
            </div>

            <div>
              <textarea
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                rows={4}
                placeholder="e.g. NeuralFlow AI — Building multi-agent workflows for healthcare informatics and clinical trials."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:border-teal-500 leading-relaxed"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Immediate Actionable Profile Ready
              </div>
              <p className="text-[11px] text-teal-800/80">
                Your profile will immediately start generating transparent matches based on your needs and offers.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCompleteRegistration}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-teal-600 text-white font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Launch Ecosystem Profile</span>
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-600 hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
