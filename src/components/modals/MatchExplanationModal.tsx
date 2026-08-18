'use client';

import React from 'react';
import { Sparkles, X, CheckCircle2, ShieldCheck, MapPin, Calendar, Users, Layers, Award } from 'lucide-react';
import { getScoreColor } from '@/lib/utils';

interface MatchExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    totalScore: number;
    matchType: string;
    factors: string | Record<string, number>;
    explanation: string | string[];
    candidateName?: string;
  };
}

export function MatchExplanationModal({ isOpen, onClose, match }: MatchExplanationModalProps) {
  if (!isOpen) return null;

  let factorsObj: Record<string, number> = {};
  try {
    factorsObj = typeof match.factors === 'string' ? JSON.parse(match.factors) : match.factors || {};
  } catch {
    factorsObj = {};
  }

  let explanationsList: string[] = [];
  try {
    explanationsList = typeof match.explanation === 'string' ? JSON.parse(match.explanation) : match.explanation || [];
  } catch {
    explanationsList = [];
  }

  const getFactorIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'location':
        return <MapPin className="w-4 h-4 text-cyan-600" />;
      case 'availability':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'capacity':
        return <Users className="w-4 h-4 text-teal-600" />;
      case 'facilities':
      case 'expertise':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'reputation':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Transparent Match Breakdown</h2>
              <p className="text-xs text-slate-500">Why was this recommendation generated?</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Header */}
        <div className="p-4 rounded-2xl border flex items-center justify-between bg-teal-50 border-teal-200">
          <div>
            <div className="text-xs text-teal-800 font-bold uppercase tracking-wider">Calculated Match Compatibility</div>
            <div className="text-xs text-slate-700 mt-0.5">
              Candidate: <span className="font-bold text-slate-900">{match.candidateName || 'Candidate'}</span>
            </div>
          </div>
          <div className="text-2xl font-black text-teal-800">
            {match.totalScore}%
          </div>
        </div>

        {/* Factor Breakdown Weights */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Scoring Factor Points
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(factorsObj).map(([key, points]) => (
              <div
                key={key}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 capitalize text-slate-800 font-medium">
                  {getFactorIcon(key)}
                  <span>{key}</span>
                </div>
                <span className="font-mono font-bold text-teal-700">+{points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Explanation Points */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Match Rationale
          </div>
          <div className="space-y-1.5">
            {explanationsList.map((exp, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
