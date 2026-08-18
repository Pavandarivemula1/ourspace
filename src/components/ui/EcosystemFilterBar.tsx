'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface EcosystemFilterBarProps {
  pricingValue?: string;
  onPricingChange?: (val: string) => void;
  capacityValue?: string;
  onCapacityChange?: (val: string) => void;
  styleValue?: string;
  onStyleChange?: (val: string) => void;
}

export function EcosystemFilterBar({
  pricingValue = 'ALL',
  onPricingChange,
  capacityValue = 'ALL',
  onCapacityChange,
  styleValue = 'ALL',
  onStyleChange,
}: EcosystemFilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
      {/* Pricing Filter */}
      <div className="relative shrink-0">
        <select
          value={pricingValue}
          onChange={(e) => onPricingChange && onPricingChange(e.target.value)}
          className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-teal-500 cursor-pointer transition shadow-sm"
        >
          <option value="ALL">Price & Terms ⌄</option>
          <option value="COMMUNITY_SPONSORED">Community-Sponsored</option>
          <option value="FREE">100% Free for Meetups</option>
          <option value="BARTER">Barter / Resource Exchange</option>
          <option value="DISCOUNTED">Discounted Rate</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Capacity Filter */}
      <div className="relative shrink-0">
        <select
          value={capacityValue}
          onChange={(e) => onCapacityChange && onCapacityChange(e.target.value)}
          className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-teal-500 cursor-pointer transition shadow-sm"
        >
          <option value="ALL">Capacity Size ⌄</option>
          <option value="SMALL">Up to 30 seats</option>
          <option value="MEDIUM">30 - 75 seats</option>
          <option value="LARGE">75 - 150 seats</option>
          <option value="AUDITORIUM">150+ Auditorium</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Style Filter */}
      <div className="relative shrink-0">
        <select
          value={styleValue}
          onChange={(e) => onStyleChange && onStyleChange(e.target.value)}
          className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-teal-500 cursor-pointer transition shadow-sm"
        >
          <option value="ALL">Space Style ⌄</option>
          <option value="STAGE">Innovation Stage</option>
          <option value="COWORKING">Flex & Coworking</option>
          <option value="CAFE">Founder Cafe & Terrace</option>
          <option value="LAB">DeepTech Lab</option>
          <option value="BOARDROOM">Executive Boardroom</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
