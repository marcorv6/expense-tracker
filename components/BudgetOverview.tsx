'use client';

import React from 'react';
import { Category } from '@/types/expense';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface BudgetOverviewProps {
  categories: Category[];
  onOpenCategoryModal: () => void;
}

export function BudgetOverview({ categories, onOpenCategoryModal }: BudgetOverviewProps) {
  const { t, formatCurrency } = usePreferences();

  const budgetedCategories = categories.filter(
    (c) => c.type === 'expense' && c.monthlyBudget > 0
  );

  return (
    <div className="p-6 rounded-2xl glass-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            {t.budgetCapsTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t.budgetCapsDesc}
          </p>
        </div>

        <button
          onClick={onOpenCategoryModal}
          className="text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl bg-accent/80 border border-white/10 text-foreground hover:bg-accent transition-all cursor-pointer"
        >
          {t.setBudgetLimits}
        </button>
      </div>

      {budgetedCategories.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-border/80 text-center space-y-2">
          <Target className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
          <p className="text-xs text-muted-foreground font-mono">
            {t.noBudgetsConfigured}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetedCategories.map((cat) => {
            const spent = cat.spentThisMonth || 0;
            const pct = Math.round((spent / cat.monthlyBudget) * 100);
            const isExceeded = spent > cat.monthlyBudget;
            const isWarning = pct >= 80 && !isExceeded;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isExceeded
                    ? 'border-rose-500/40 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                    : isWarning
                    ? 'border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'border-border/80 bg-accent/30 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
                      {cat.name}
                    </span>
                  </div>

                  {isExceeded ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3" /> {t.exceeded}
                    </span>
                  ) : isWarning ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" /> 80%+ {t.used}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> {t.onTrack}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-muted-foreground font-medium">
                      {formatCurrency(spent)} / {formatCurrency(cat.monthlyBudget)}
                    </span>
                    <span className="font-bold text-foreground">{pct}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isExceeded ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : isWarning ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
