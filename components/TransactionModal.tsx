'use client';

import React, { useState } from 'react';
import { TransactionItem, Category, PaymentMethod, TransactionStatus, CreateTransactionInput } from '@/types/expense';
import { X, Save, Receipt } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTransactionInput) => Promise<void>;
  categories: Category[];
  initialData?: TransactionItem | null;
  defaultType?: 'expense' | 'income';
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
  defaultType = 'expense',
}: TransactionModalProps) {
  const { t } = usePreferences();

  const [type, setType] = useState<'expense' | 'income'>(initialData ? initialData.type : defaultType);
  const [amount, setAmount] = useState<string>(initialData ? initialData.amount.toString() : '');
  const [description, setDescription] = useState<string>(initialData ? initialData.description : '');
  const [categoryId, setCategoryId] = useState<string>(
    initialData
      ? initialData.categoryId
      : (categories.find((c) => c.type === defaultType)?.id || categories[0]?.id || '')
  );
  const [date, setDate] = useState<string>(
    initialData ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData ? initialData.paymentMethod : 'credit_card');
  const [status, setStatus] = useState<TransactionStatus>(initialData ? initialData.status : 'cleared');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) return;

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        amount: parseFloat(amount),
        description,
        categoryId,
        date: new Date(date).toISOString(),
        paymentMethod,
        status,
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl p-6 space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            {initialData ? 'Audit Transaction Entry' : `Log New ${type === 'expense' ? t.addExpense : t.addIncome}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Segmented Type Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const cat = categories.find((c) => c.type === 'expense');
                if (cat) setCategoryId(cat.id);
              }}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500/90 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.expenseLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                const cat = categories.find((c) => c.type === 'income');
                if (cat) setCategoryId(cat.id);
              }}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-500/90 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.incomeLabel}
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">{t.amountLabel}</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-white/10 bg-slate-950 text-white font-mono tabular-nums focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">{t.descriptionLabel}</label>
            <input
              type="text"
              required
              placeholder="e.g. Whole Foods Market, Office Rent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">{t.categoryLabel}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              >
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">{t.dateLabel}</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">{t.paymentChannel}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="digital_wallet">Digital Wallet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">{t.auditStatus}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              >
                <option value="cleared">{t.cleared}</option>
                <option value="pending">{t.pending}</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">{t.notesLabel}</label>
            <textarea
              rows={2}
              placeholder="Additional tags or transaction notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Dialog Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? t.processing : t.saveRecord}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
