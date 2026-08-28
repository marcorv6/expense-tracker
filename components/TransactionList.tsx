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
    <div id="tour-transaction-ledger" className="p-6 rounded-3xl glass-card space-y-5">
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-700" />
            {t.ledgerTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {t.ledgerDesc}
          </p>
        </div>

        <button
          onClick={() => onOpenTransactionModal('expense')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono transition-all shadow-md shadow-slate-900/10 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newEntry}</span>
        </button>
      </div>

      {/* Command Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono shadow-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono shadow-sm"
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
            className="w-full px-3 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono shadow-sm"
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
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
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
            className="w-full px-3 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono shadow-sm"
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
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 flex flex-wrap items-center justify-between gap-3 animate-in fade-in shadow-sm">
          <span className="text-xs font-mono text-slate-900 font-bold">
            {selectedIds.length} entry(s) selected
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBatchAction(selectedIds, 'mark_cleared')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold hover:bg-emerald-100 transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.markCleared}
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'mark_pending')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              {t.markPending}
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'delete')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold hover:bg-rose-100 transition-all cursor-pointer shadow-sm"
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
          <Receipt className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h4 className="text-sm font-semibold text-slate-800">{t.noTransactionsFound}</h4>
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-900/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createTransaction}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-[11px] font-mono text-slate-500 uppercase font-bold">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.length === transactions.length && transactions.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
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
