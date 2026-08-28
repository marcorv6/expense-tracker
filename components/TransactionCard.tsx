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
      className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 group ${
        isSelected
          ? 'bg-slate-100 border-slate-400 shadow-sm'
          : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Checkbox & Soft Merchant Circle Avatar */}
      <div className="flex items-center gap-3.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectToggle(transaction.id)}
          className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
        />

        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
          style={{
            backgroundColor: transaction.categoryColor || (isExpense ? '#0f172a' : '#10b981'),
          }}
        >
          {isExpense ? <ArrowDownLeft className="w-5 h-5 text-white" /> : <ArrowUpRight className="w-5 h-5 text-white" />}
        </div>

        {/* Details */}
        <div className="space-y-0.5 max-w-[220px] sm:max-w-md">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {transaction.description}
            </h4>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 font-semibold truncate">
              {transaction.categoryName || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
            {transaction.notes && (
              <>
                <span>•</span>
                <span className="truncate italic max-w-[120px] sm:max-w-xs">{transaction.notes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount & Status Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div
            className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
              isExpense ? 'text-slate-900' : 'text-emerald-600'
            }`}
          >
            {isExpense ? `-${formatCurrency(transaction.amount)}` : `+${formatCurrency(transaction.amount)}`}
          </div>

          <button
            onClick={() => onStatusToggle(transaction)}
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer transition-colors ${
              isCleared ? 'text-emerald-600' : 'text-amber-600'
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
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
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
