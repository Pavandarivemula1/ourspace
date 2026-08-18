'use client';

import React from 'react';
import { Building, Users, Coffee, Cpu, Briefcase } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: string;
  image: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'conference',
    name: 'Conference Room & Stage',
    count: '8 stages',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80',
    icon: Building,
  },
  {
    id: 'flex',
    name: 'Flex & Coworking Space',
    count: '14 halls',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    icon: Users,
  },
  {
    id: 'cafe',
    name: 'Founder Cafe & Lounge',
    count: '6 spaces',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    icon: Coffee,
  },
  {
    id: 'deeptech',
    name: 'AI & DeepTech Lab',
    count: '5 labs',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    icon: Cpu,
  },
  {
    id: 'boardroom',
    name: 'Executive Boardroom',
    count: '7 rooms',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80',
    icon: Briefcase,
  },
];

interface SpaceCategoryCarouselProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
  title?: string;
  showTitle?: boolean;
  actionElement?: React.ReactNode;
}

export function SpaceCategoryCarousel({
  activeCategory,
  onSelectCategory,
  title = 'What type of space do you seek?',
  showTitle = true,
  actionElement,
}: SpaceCategoryCarouselProps) {
  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          {actionElement ? (
            actionElement
          ) : (
            <span className="text-xs text-slate-400 font-medium">Horizontal scroll →</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`category-card shrink-0 w-36 sm:w-44 text-left rounded-2xl overflow-hidden border transition-all ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-600/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              <div className="h-24 sm:h-28 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-2.5 space-y-0.5 bg-white">
                <div className="font-bold text-xs text-slate-900 truncate">{cat.name}</div>
                <div className="text-[10px] text-slate-500">{cat.count}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
