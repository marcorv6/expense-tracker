'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

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
  glowClass?: string;
}

export function MetricCard({
  title,
  amount,
  subtext,
  trend,
  icon: Icon,
  badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  glowClass = 'group-hover:opacity-100 opacity-0 transition-opacity duration-500',
}: MetricCardProps) {
  const { formatCurrency } = usePreferences();

  return (
    <div className="relative p-5 rounded-2xl glass-card glass-card-hover overflow-hidden group space-y-3">
      {/* Ambient background glow gradient */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/15 blur-2xl rounded-full pointer-events-none ${glowClass}`} />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest font-semibold">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${badgeColor} backdrop-blur-md`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1 relative z-10">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono tabular-nums">
          {formatCurrency(amount)}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          {subtext && <span className="text-muted-foreground text-[11px] font-mono">{subtext}</span>}

          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-full border ${
                trend.isPositive
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
