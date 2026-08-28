'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/context/AuthContext';

interface MetricCardProps {
  title: string;
  amount: number;
  subtext?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  badgeColor?: string;
  isVirtualCard?: boolean;
}

export function MetricCard({
  title,
  amount,
  subtext,
  trend,
  icon: Icon,
  badgeColor = 'text-slate-700 bg-slate-100 border-slate-200',
  isVirtualCard = false,
}: MetricCardProps) {
  const { formatCurrency } = usePreferences();
  const { user } = useAuth();

  if (isVirtualCard) {
    return (
      <div className="relative p-6 rounded-3xl credit-card-gradient text-white shadow-xl overflow-hidden flex flex-col justify-between h-52 group">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-10 -bottom-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block font-semibold">
              Good Day!
            </span>
            <span className="text-sm font-extrabold text-white tracking-tight">
              {user?.name || 'Alex Vance'}
            </span>
          </div>
          <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Main Balance Display */}
        <div className="space-y-1 relative z-10 my-auto">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-white tabular-nums">
            {formatCurrency(amount)}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">Total Account Balance</span>
          {/* Accent colored indicator line */}
          <div className="w-24 h-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 mt-2" />
        </div>

        {/* Bottom Card Details & MasterCard Logo */}
        <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/10 text-xs font-mono text-slate-300">
          <span>•••• •••• 4028</span>
          {/* Overlapping Circles MasterCard Logo */}
          <div className="flex items-center -space-x-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 opacity-90" />
            <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl glass-card glass-card-hover flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl border ${badgeColor} shadow-sm`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
          {formatCurrency(amount)}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          {subtext && <span className="text-slate-500 text-[11px] font-mono font-medium">{subtext}</span>}

          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
                trend.isPositive
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/80'
                  : 'text-rose-700 bg-rose-50 border border-rose-200/80'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
