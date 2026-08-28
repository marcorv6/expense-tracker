'use client';

import React from 'react';
import { CategoryBreakdown } from '@/types/expense';
import { PieChart, DollarSign, Activity } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface SpendingChartsProps {
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: { month: string; income: number; expense: number }[];
}

export function SpendingCharts({
  categoryBreakdown,
  monthlyTrends,
}: SpendingChartsProps) {
  const { t, formatCurrency } = usePreferences();

  const maxTrend = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.income, t.expense)),
    1000
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Monthly Cash Flow Trends */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              {t.cashflowDynamics}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.cashflowDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] inline-block" />
              {t.incomeLabel}
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)] inline-block" />
              {t.expenseLabel}
            </span>
          </div>
        </div>

        {/* Custom SVG Gradient Bar */}
        <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-border/80 relative">
          {monthlyTrends.map((item) => {
            const incomeHeight = (item.income / maxTrend) * 100;
            const expenseHeight = (item.expense / maxTrend) * 100;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                  {/* Income Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-emerald-600/80 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 relative shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    style={{ height: `${Math.max(incomeHeight, 8)}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 font-mono text-[10px] px-2 py-1 rounded-lg shadow-xl border border-emerald-500/30 pointer-events-none whitespace-nowrap z-20 transition-all duration-200">
                      +{formatCurrency(item.income)}
                    </div>
                  </div>

                  {/* Expense Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-rose-600/80 to-rose-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125 relative shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                    style={{ height: `${Math.max(expenseHeight, 8)}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-rose-400 font-mono text-[10px] px-2 py-1 rounded-lg shadow-xl border border-rose-500/30 pointer-events-none whitespace-nowrap z-20 transition-all duration-200">
                      -{formatCurrency(item.expense)}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground font-semibold transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Expense Distribution */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            {t.expenditureShare}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t.budgetComposition}
          </p>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <DollarSign className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-xs font-mono">{t.noExpenseRecords}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            {categoryBreakdown.map((cat) => (
              <div key={cat.categoryId} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {formatCurrency(cat.total)} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-accent/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: cat.color,
                      boxShadow: `0 0 10px ${cat.color}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
