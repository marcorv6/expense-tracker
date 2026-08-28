'use client';

import React from 'react';
import { ShieldCheck, Palette, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        {/* Project Branding & License */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <span className="font-bold text-slate-900">SpendFlow</span>
          <span>• Open-Source Developer Portfolio Showcase (MIT License)</span>
        </div>

        {/* Design Attribution & Educational Disclaimer */}
        <div className="flex items-center gap-2 text-center md:text-right text-[11px] text-slate-500">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span>
            UI Design inspired by public Dribbble fintech concepts. Built for technical demonstration only.
          </span>
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
