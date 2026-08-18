import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(date);
  }
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; glow: string } {
  if (score >= 90) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    };
  }
  if (score >= 75) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    };
  }
  return {
    text: 'text-blue-400',
    bg: 'bg-blue-950/60',
    border: 'border-blue-500/40',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
  };
}

export function getStatusBadge(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    // Event states
    DRAFT: { label: 'Draft', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
    SEEKING_RESOURCES: { label: 'Seeking Resources', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    PARTIALLY_FULFILLED: { label: 'Partially Fulfilled', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    RESOURCES_FULFILLED: { label: 'Resources Fulfilled', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    REGISTRATION_OPEN: { label: 'Registration Open', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    REGISTRATION_CLOSED: { label: 'Registration Closed', color: 'bg-zinc-700/40 text-zinc-300 border-zinc-600' },
    LIVE: { label: 'Happening Live', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' },
    COMPLETED: { label: 'Completed', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
    OUTCOME_PENDING: { label: 'Outcome Pending', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    OUTCOME_RECORDED: { label: 'Outcome Recorded', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-500/15 text-red-400 border-red-500/30' },

    // Request states
    PUBLISHED: { label: 'Published & Matching', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
    ACCEPTED: { label: 'Accepted', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },

    // Booking states
    PENDING: { label: 'Pending Review', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    APPROVED: { label: 'Approved', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    REJECTED: { label: 'Rejected', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },

    // Verification
    ECOSYSTEM_VERIFIED: { label: 'Ecosystem Verified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    IDENTITY_VERIFIED: { label: 'ID Verified', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    EMAIL_VERIFIED: { label: 'Email Verified', color: 'bg-zinc-700 text-zinc-300 border-zinc-600' },
    UNVERIFIED: { label: 'Unverified', color: 'bg-zinc-800 text-zinc-500 border-zinc-700' },
  };

  return map[status] || { label: status, color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
}
