'use client';

import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Sparkles, Shield, User, ChevronDown, Check, Building, MapPin, Users } from 'lucide-react';

export function DemoBanner() {
  const { user, isDemoMode, personas, switchDemoPersona } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isDemoMode || personas.length === 0) return null;

  const currentPersona = personas.find((p) => p.id === user?.id) || personas[0];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'FOUNDER':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'VENUE':
        return <Building className="w-3.5 h-3.5 text-emerald-600" />;
      case 'PROFESSIONAL':
        return <User className="w-3.5 h-3.5 text-cyan-600" />;
      case 'COMMUNITY':
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <User className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50 relative">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full border border-amber-300">
          <Sparkles className="w-3 h-3 text-amber-700" />
          DEMO MODE
        </span>
        <span className="text-amber-900/80 hidden sm:inline font-medium">
          Switch test personas to experience cross-user flows (venue approvals, matching, speaker invites, admin controls).
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-amber-300 text-slate-800 px-3 py-1 rounded-full transition font-semibold shadow-sm"
        >
          <span className="text-slate-500">Acting as:</span>
          <span className="flex items-center gap-1.5 text-slate-900">
            {getRoleIcon(currentPersona.role)}
            {currentPersona.name} ({currentPersona.role})
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Select Seeded Persona
            </div>
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {personas.map((p) => {
                const isSelected = p.id === currentPersona.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchDemoPersona(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition ${
                      isSelected ? 'bg-amber-50/80 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">{getRoleIcon(p.role)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.role}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{p.profile?.headline || p.email}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
