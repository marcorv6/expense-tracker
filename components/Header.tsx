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
} from 'lucide-react';

interface HeaderProps {
  onOpenTransactionModal: (type?: 'expense' | 'income') => void;
  onOpenCategoryModal: () => void;
}

export function Header({ onOpenTransactionModal }: HeaderProps) {
  const { user, isAuthenticated, logout, loginAsDemoGuest } = useAuth();
  const { currency, setCurrency, language, setLanguage, t } = usePreferences();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Greeting */}
        <div className="flex items-center gap-3">
          {/* New Electric Teal / Royal Violet Gradient Logo Badge */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
                {t.appName}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                {t.fintechTag}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                {user ? `Good Day, ${user.name}` : t.encryptedSession}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Language Selectors & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer shadow-sm"
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
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer uppercase shadow-sm"
              title="Select Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono transition-all shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal('income')}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-700 text-xs font-bold font-mono transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>{t.addIncome}</span>
          </button>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
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
                <div className="text-left hidden lg:block">
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
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 transition-all cursor-pointer"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemoGuest()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-mono font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t.recruiterDemo}</span>
                <span className="sm:hidden">Demo</span>
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
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
