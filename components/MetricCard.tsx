'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
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
  isMainBalanceCard?: boolean;
}

export function MetricCard({
  title,
  amount,
  subtext,
  trend,
  icon: Icon,
  badgeColor = 'text-slate-700 bg-slate-100 border-slate-200',
  isMainBalanceCard = false,
}: MetricCardProps) {
  const { formatCurrency } = usePreferences();

  if (isMainBalanceCard) {
    return (
      <div className="p-6 rounded-3xl glass-card glass-card-hover space-y-4 flex flex-col justify-between h-52">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Icon className="w-4.5 h-4.5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-extrabold block">
                {title}
              </span>
              <span className="text-xs text-slate-400 font-mono">Checking + Savings Balance</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Audited
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
            {formatCurrency(amount)}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {subtext || 'Total available net liquidity reserve'}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold">Reserve Allocation</span>
          <span className="font-extrabold text-slate-900">100% Secure</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl glass-card glass-card-hover flex flex-col justify-between space-y-4 h-52">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-extrabold">
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
