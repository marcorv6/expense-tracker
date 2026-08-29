'use client';

import React, { useState } from 'react';
import { TransactionItem, Category, PaymentMethod, TransactionStatus, CreateTransactionInput } from '@/types/expense';
import { X, Save, Receipt } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { DatePicker } from './DatePicker';

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
  const { t, formatCurrency } = usePreferences();

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

  const resetForm = () => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setCategoryId(initialData.categoryId);
      setDate(new Date(initialData.date).toISOString().slice(0, 10));
      setPaymentMethod(initialData.paymentMethod);
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setAmount('');
      setDescription('');
      const defaultCat = categories.find((c) => c.type === defaultType)?.id || categories[0]?.id || '';
      setCategoryId(defaultCat);
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('credit_card');
      setStatus('cleared');
      setNotes('');
    }
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

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
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);
  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-700" />
            {initialData ? 'Audit Transaction Entry' : (type === 'expense' ? t.addExpense : t.addIncome)}
          </h3>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Segmented Type Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const cat = categories.find((c) => c.type === 'expense');
                if (cat) setCategoryId(cat.id);
              }}
              className={`py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
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
              className={`py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.incomeLabel}
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">{t.amountLabel}</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 text-base rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold tabular-nums focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">{t.descriptionLabel}</label>
            <input
              type="text"
              required
              placeholder="e.g. Whole Foods Market, Office Rent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-600">{t.categoryLabel}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono shadow-sm"
              >
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <DatePicker
              label={t.dateLabel}
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
                const isFutureDate = new Date(newDate + 'T00:00:00').getTime() > Date.now();
                if (isFutureDate) {
                  setStatus('pending');
                }
              }}
            />
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-600">{t.paymentChannel}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono shadow-sm"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="digital_wallet">Digital Wallet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-600">{t.auditStatus}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono shadow-sm"
              >
                <option value="cleared">{t.cleared}</option>
                <option value="pending">{t.pending}</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">{t.notesLabel}</label>
            <textarea
              rows={2}
              placeholder="Additional tags or transaction notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none resize-none shadow-sm"
            />
          </div>

          {/* Dark Matte Summary Banner Footer matching reference screenshot */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between mt-4 shadow-lg">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">Total Entry</span>
              <span className="text-base font-extrabold font-mono tabular-nums text-white">
                {formatCurrency(numericAmount)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-slate-900" />
                <span>{isSubmitting ? t.processing : t.saveRecord}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
