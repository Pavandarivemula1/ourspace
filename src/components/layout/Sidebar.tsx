'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import {
  LayoutDashboard,
  Sparkles,
  Gift,
  Calendar,
  Building,
  Users,
  UserCheck,
  MessageSquare,
  Activity,
  Shield,
  Search,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Needs & Requests', href: '/requests', icon: Sparkles, badge: 'Intent' },
    { name: 'Offers & Resources', href: '/offers', icon: Gift },
    { name: 'Events & Resources', href: '/events', icon: Calendar },
    { name: 'Venues & Spaces', href: '/venues', icon: Building },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Connections & Intros', href: '/connections', icon: UserCheck },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Activity Timeline', href: '/activity', icon: Activity },
    { name: 'Global Search', href: '/search', icon: Search },
  ];

  if (user?.role === 'ADMIN') {
    navigation.push({
      name: 'Admin Command',
      href: '/admin',
      icon: Shield,
      badge: 'Admin',
    });
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 bg-white/70 backdrop-blur-md p-4 space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Ecosystem Navigation
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border-l-2 border-teal-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-teal-200/80 text-teal-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 space-y-1 text-xs">
        <div className="font-bold text-teal-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Need-to-Outcome Engine</span>
        </div>
        <p className="text-[11px] text-teal-800/80 leading-relaxed">
          The network matches by explicit needs, resource fulfillment, and verified reviews.
        </p>
      </div>
    </aside>
  );
}
