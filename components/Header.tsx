'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { SupportedCurrency, SupportedLanguage } from '@/lib/i18n/translations';
import { AuthModal } from './AuthModal';
import {
  Wallet,
  Sparkles,
  LogOut,
  User as UserIcon,
  Plus,
  ArrowUpRight,
  Globe,
  Coins,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  onOpenTransactionModal: (type?: 'expense' | 'income') => void;
  onOpenCategoryModal: () => void;
  onOpenImportModal?: () => void;
  onStartTour?: () => void;
}

export function Header({ onOpenTransactionModal, onOpenImportModal, onStartTour }: HeaderProps) {
  const { user, isAuthenticated, logout, loginAsDemoGuest } = useAuth();
  const { currency, setCurrency, language, setLanguage, t } = usePreferences();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Brand Logo & Greeting */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-sans">
                {t.appName}
              </span>
              <span className="hidden xs:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                {t.fintechTag}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-slate-500 font-medium truncate max-w-[110px] sm:max-w-none">
                {user ? user.name : t.encryptedSession}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Language Selectors & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Tutorial Button */}
          <button
            id="tour-help-button"
            onClick={() => onStartTour?.()}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
            title="Take Tour & Help Setup"
          >
            <HelpCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-600" />
          </button>

          {/* Currency Selector */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none hidden sm:block" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="px-2 sm:pl-8 sm:pr-2.5 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer shadow-sm"
              title="Select Currency"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="MXN">MXN ($)</option>
              <option value="CAD">CAD ($)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none hidden sm:block" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="px-2 sm:pl-8 sm:pr-2.5 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer uppercase shadow-sm"
              title="Select Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {/* Desktop Quick Action Buttons */}
          <button
            id="tour-add-expense"
            onClick={() => onOpenTransactionModal('expense')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono transition-all shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>

          <button
            id="tour-add-income"
            onClick={() => onOpenTransactionModal('income')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-700 text-xs font-bold font-mono transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>{t.addIncome}</span>
          </button>

          {onOpenImportModal && (
            <button
              onClick={onOpenImportModal}
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-50 border border-cyan-200/80 hover:bg-cyan-100 text-cyan-700 text-xs font-bold font-mono transition-all active:scale-95 cursor-pointer"
              title="Bulk import CSV / JSON records"
            >
              <span>Import Data</span>
            </button>
          )}

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 border-l border-slate-200">
              <div className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
                {user?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-slate-300"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {user?.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden xl:block">
                  <span className="text-xs font-bold block text-slate-900 leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-cyan-600 font-mono block font-semibold">
                    {currency} Wallet
                  </span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 transition-all cursor-pointer"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => loginAsDemoGuest()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-mono font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t.recruiterDemo}</span>
                <span className="sm:hidden">Demo</span>
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.signIn}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
