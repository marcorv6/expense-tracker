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
    <div className="p-6 rounded-3xl glass-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            {t.budgetCapsTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {t.budgetCapsDesc}
          </p>
        </div>

        <button
          onClick={onOpenCategoryModal}
          className="text-xs font-mono font-bold px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
        >
          {t.setBudgetLimits}
        </button>
      </div>

      {budgetedCategories.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
          <Target className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <p className="text-xs text-slate-500 font-mono">
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
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isExceeded
                    ? 'border-rose-300 bg-rose-50/50 shadow-sm'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                      {cat.name}
                    </span>
                  </div>

                  {isExceeded ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-700 font-bold px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> {t.exceeded}
                    </span>
                  ) : isWarning ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> 80%+ {t.used}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t.onTrack}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-slate-500 font-medium">
                      {formatCurrency(spent)} / {formatCurrency(cat.monthlyBudget)}
                    </span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
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
