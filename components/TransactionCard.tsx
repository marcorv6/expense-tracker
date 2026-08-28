'use client';

import React from 'react';
import { TransactionItem } from '@/types/expense';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
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
      className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 group ${
        isSelected
          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
          : 'glass-card hover:border-white/20'
      }`}
    >
      {/* Checkbox & Category Icon */}
      <div className="flex items-center gap-3.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectToggle(transaction.id)}
          className="w-4 h-4 rounded border-border bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md transition-transform group-hover:scale-105"
          style={{
            backgroundColor: transaction.categoryColor || (isExpense ? '#ef4444' : '#10b981'),
            boxShadow: `0 0 12px ${transaction.categoryColor || '#6366f1'}40`,
          }}
        >
          {isExpense ? <ArrowDownLeft className="w-5 h-5 text-white" /> : <ArrowUpRight className="w-5 h-5 text-white" />}
        </div>

        {/* Details */}
        <div className="space-y-0.5 max-w-[220px] sm:max-w-md">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
              {transaction.description}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-accent/50 text-muted-foreground font-medium truncate">
              {transaction.categoryName || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground">
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

      {/* Amount & Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div
            className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
              isExpense ? 'text-foreground' : 'text-emerald-400'
            }`}
          >
            {isExpense ? `-${formatCurrency(transaction.amount)}` : `+${formatCurrency(transaction.amount)}`}
          </div>

          <button
            onClick={() => onStatusToggle(transaction)}
            className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
              isCleared ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isCleared ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.cleared}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{t.pending}</span>
              </>
            )}
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={t.edit}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 rounded-lg border border-border hover:bg-rose-500/10 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
