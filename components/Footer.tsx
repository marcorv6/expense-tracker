'use client';

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        {/* Project Branding & License */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-900" />
          <span className="font-extrabold text-slate-900">SpendFlow</span>
          <span>• Full-Stack Financial Platform (MIT License)</span>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Encrypted Session • All Financial Ledger Records Audited</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for Engineering Excellence</span>
        </div>
      </div>
    </footer>
  );
}
