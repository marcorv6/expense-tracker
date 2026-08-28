'use client';

import React, { useState } from 'react';
import { Category, TransactionType } from '@/types/expense';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (input: { name: string; type: TransactionType; color: string; icon?: string; monthlyBudget?: number }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const PRESET_COLORS = ['#0f172a', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#ef4444', '#3b82f6'];

export function CategoryModal({
  isOpen,
  onClose,
  categories,
  onCreateCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const { t, formatCurrency } = usePreferences();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState('#0f172a');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setType('expense');
    setColor('#0f172a');
    setMonthlyBudget('');
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      await onCreateCategory({
        name,
        type,
        color,
        monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : 0,
      });
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-700" />
            {t.categoriesAndCaps}
          </h3>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Categories List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Categories</span>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-slate-900">{cat.name}</span>
                <span className="text-[10px] font-mono text-slate-500 capitalize">({cat.type})</span>
              </div>
              <div className="flex items-center gap-3">
                {cat.monthlyBudget > 0 && (
                  <span className="text-[11px] font-mono text-emerald-700 font-bold tabular-nums">
                    {formatCurrency(cat.monthlyBudget)}/mo
                  </span>
                )}
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-500'
              }`}
            >
              {t.expenseLabel}
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              {t.incomeLabel}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">{t.categoryLabel}</label>
            <input
              type="text"
              required
              placeholder="e.g. Subscriptions, Travel..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
            />
          </div>

          {type === 'expense' && (
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-600">Monthly Budget Cap ($)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-slate-900 focus:outline-none shadow-sm"
              />
            </div>
          )}

          {/* Color Picker */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-600">Accent Color Tag</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                    color === c ? 'scale-125 ring-2 ring-slate-900 shadow-md' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-md shadow-slate-900/10 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </form>
      </div>
    </div>
  );
}
