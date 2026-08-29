'use client';

import React from 'react';
import { TransactionItem } from '@/types/expense';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface TransactionCardProps {
  transaction: TransactionItem;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onEdit: (transaction: TransactionItem) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (transaction: TransactionItem) => void;
}

export function TransactionCard({
  transaction,
  isSelected,
  onSelectToggle,
  onEdit,
  onDelete,
  onStatusToggle,
}: TransactionCardProps) {
  const { t, formatCurrency } = usePreferences();

  const isExpense = transaction.type === 'expense';
  const isCleared = transaction.status === 'cleared';

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group overflow-hidden ${
        isSelected
          ? 'bg-slate-100 border-slate-400 shadow-sm'
          : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Header Row (Mobile) / Left Side (Desktop) */}
      <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0 w-full sm:w-auto">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectToggle(transaction.id)}
            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0"
          />

          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105"
            style={{
              backgroundColor: transaction.categoryColor || (isExpense ? '#0f172a' : '#10b981'),
            }}
          >
            {isExpense ? <ArrowDownLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" /> : <ArrowUpRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />}
          </div>

          {/* Details */}
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[130px] xs:max-w-[170px] sm:max-w-xs">
                {transaction.description}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 font-semibold truncate shrink-0">
                {transaction.categoryName || 'General'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-600 font-medium truncate">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Mobile Amount Right Header */}
        <div className="text-right sm:hidden shrink-0">
          <div
            className={`text-xs font-extrabold font-mono tabular-nums ${
              isExpense ? 'text-slate-900' : 'text-emerald-700'
            }`}
          >
            {isExpense ? `-${formatCurrency(transaction.amount)}` : `+${formatCurrency(transaction.amount)}`}
          </div>
        </div>
      </div>

      {/* Actions & Status Row */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <button
          onClick={() => onStatusToggle(transaction)}
          className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer transition-colors ${
            isCleared ? 'text-emerald-700' : 'text-amber-700'
          }`}
        >
          {isCleared ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{t.cleared}</span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{t.pending}</span>
            </>
          )}
        </button>

        {/* Desktop Amount */}
        <div className="hidden sm:block text-right">
          <div
            className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
              isExpense ? 'text-slate-900' : 'text-emerald-600'
            }`}
          >
            {isExpense ? `-${formatCurrency(transaction.amount)}` : `+${formatCurrency(transaction.amount)}`}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title={t.edit}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
