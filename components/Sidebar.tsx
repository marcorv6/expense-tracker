'use client';

import React from 'react';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  FolderKanban,
  Download,
  Plus,
} from 'lucide-react';
import { Category } from '@/types/expense';
import { usePreferences } from '@/context/PreferencesContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  onOpenTransactionModal: (type?: 'expense' | 'income') => void;
  onOpenCategoryModal: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  categories,
  selectedCategory,
  setSelectedCategory,
  onOpenTransactionModal,
  onOpenCategoryModal,
  onExport,
}: SidebarProps) {
  const { t, formatCurrency } = usePreferences();

  const mainNav = [
    { id: 'overview', label: t.overview, icon: LayoutDashboard },
    { id: 'expenses', label: t.expenditures, icon: ArrowDownLeft },
    { id: 'income', label: t.incomeAccounts, icon: ArrowUpRight },
    { id: 'budgets', label: t.budgetTargets, icon: PieChart },
  ];

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      {/* Mobile Quick Action Bar */}
      <div className="flex gap-2 sm:hidden">
        <button
          onClick={() => onOpenTransactionModal('expense')}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>
        <button
          onClick={() => onOpenTransactionModal('income')}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{t.addIncome}</span>
        </button>
      </div>

      {/* Main Glass Navigation Panel */}
      <div className="p-3 rounded-2xl glass-card space-y-1">
        <span className="px-3 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-semibold">
          {t.financialHub}
        </span>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categories & Budgets Filter Panel */}
      <div className="p-3.5 rounded-2xl glass-card space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-semibold">
            {t.categoriesAndCaps}
          </span>
          <button
            onClick={onOpenCategoryModal}
            className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            {t.manage}
          </button>
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              selectedCategory === ''
                ? 'bg-accent/80 font-bold text-foreground border border-white/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              {t.allCategories}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-accent/80 font-bold text-foreground border border-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="truncate">{cat.name}</span>
              </span>
              {cat.monthlyBudget > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground font-medium">
                  {formatCurrency(cat.monthlyBudget)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export & Data Tools */}
      <div className="p-3.5 rounded-2xl glass-card space-y-2.5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-semibold px-1">
          {t.dataExport}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onExport('csv')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-border hover:bg-accent/70 text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>.CSV</span>
          </button>

          <button
            onClick={() => onExport('json')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-border hover:bg-accent/70 text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>.JSON</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
