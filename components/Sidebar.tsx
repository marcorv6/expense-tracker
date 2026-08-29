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
  onOpenImportModal?: () => void;
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
  onOpenImportModal,
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
    <aside className="w-full lg:w-64 space-y-5 flex-shrink-0">
      {/* Mobile Quick Action Bar */}
      <div className="flex gap-2 sm:hidden">
        <button
          onClick={() => onOpenTransactionModal('expense')}
          className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>
        <button
          onClick={() => onOpenTransactionModal('income')}
          className="flex-1 py-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          <span>{t.addIncome}</span>
        </button>
      </div>

      {/* Main Glass Navigation Panel */}
      <div className="p-3 rounded-3xl glass-card space-y-1">
        <span className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
          {t.financialHub}
        </span>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categories & Budgets Filter Panel */}
      <div className="p-4 rounded-3xl glass-card space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
            {t.categoriesAndCaps}
          </span>
          <button
            onClick={onOpenCategoryModal}
            className="text-[11px] font-mono text-slate-900 hover:text-slate-700 font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            {t.manage}
          </button>
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-all cursor-pointer ${
              selectedCategory === ''
                ? 'bg-slate-100 font-extrabold text-slate-900 border border-slate-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-slate-700" />
              {t.allCategories}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 font-extrabold text-slate-900 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  {formatCurrency(cat.monthlyBudget)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export & Data Tools */}
      <div className="p-4 rounded-3xl glass-card space-y-2.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold px-1">
          {t.dataExport} & Backup
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onExport('csv')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.CSV</span>
          </button>

          <button
            onClick={() => onExport('json')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.JSON</span>
          </button>
        </div>

        {onOpenImportModal && (
          <button
            onClick={onOpenImportModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
          >
            <span>Import CSV / JSON</span>
          </button>
        )}
      </div>
    </aside>
  );
}
