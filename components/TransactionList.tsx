'use client';

import React, { useState } from 'react';
import { TransactionItem, Category } from '@/types/expense';
import { TransactionCard } from './TransactionCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  CheckCircle2,
  Clock,
  Receipt,
  Plus,
} from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface TransactionListProps {
  transactions: TransactionItem[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  sortBy: 'date' | 'amount' | 'description';
  setSortBy: (s: 'date' | 'amount' | 'description') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (o: 'asc' | 'desc') => void;
  onEdit: (tx: TransactionItem) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (tx: TransactionItem) => void;
  onBatchAction: (ids: string[], action: 'delete' | 'mark_cleared' | 'mark_pending') => void;
  onOpenTransactionModal: (type?: 'expense' | 'income') => void;
}

export function TransactionList({
  transactions,
  categories,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onEdit,
  onDelete,
  onStatusToggle,
  onBatchAction,
  onOpenTransactionModal,
}: TransactionListProps) {
  const { t } = usePreferences();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 rounded-2xl glass-card space-y-6">
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            {t.ledgerTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t.ledgerDesc}
          </p>
        </div>

        <button
          onClick={() => onOpenTransactionModal('expense')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold font-mono transition-all shadow-lg shadow-indigo-600/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newEntry}</span>
        </button>
      </div>

      {/* Command Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-slate-950 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-slate-950 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          >
            <option value="all">{t.allTypes}</option>
            <option value="expense">{t.expensesOnly}</option>
            <option value="income">{t.incomeOnly}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-slate-950 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          >
            <option value="">{t.allCategories}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as [
                'date' | 'amount' | 'description',
                'asc' | 'desc'
              ];
              setSortBy(by);
              setSortOrder(order);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-slate-950 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          >
            <option value="date-desc">{t.newestFirst}</option>
            <option value="date-asc">{t.oldestFirst}</option>
            <option value="amount-desc">{t.highestAmount}</option>
            <option value="amount-asc">{t.lowestAmount}</option>
            <option value="description-asc">{t.descriptionAZ}</option>
          </select>
        </div>
      </div>

      {/* Batch Operations Floating Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in shadow-lg">
          <span className="text-xs font-mono text-indigo-400 font-bold">
            {selectedIds.length} entry(s) selected
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBatchAction(selectedIds, 'mark_cleared')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.markCleared}
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'mark_pending')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              {t.markPending}
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'delete')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.deleteSelected}
            </button>
          </div>
        </div>
      )}

      {/* Register List */}
      {transactions.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <Receipt className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
          <h4 className="text-sm font-semibold text-foreground">{t.noTransactionsFound}</h4>
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createTransaction}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.length === transactions.length && transactions.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-border bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>{t.selectAll}</span>
            </div>
            <span>{transactions.length} {t.totalRecords}</span>
          </div>

          {transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              isSelected={selectedIds.includes(tx.id)}
              onSelectToggle={toggleSelectOne}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusToggle={onStatusToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
