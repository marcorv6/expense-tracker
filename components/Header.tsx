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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Live Sync Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-foreground font-sans">
                {t.appName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {t.fintechTag}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">{t.encryptedSession}</span>
            </div>
          </div>
        </div>

        {/* Currency & Language Selectors & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 pointer-events-none" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="pl-7 pr-2 py-1.5 text-xs font-mono font-bold rounded-xl border border-white/10 bg-slate-950 text-foreground hover:border-white/20 transition-all focus:outline-none cursor-pointer"
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
            <Globe className="w-3.5 h-3.5 text-indigo-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="pl-7 pr-2 py-1.5 text-xs font-mono font-bold rounded-xl border border-white/10 bg-slate-950 text-foreground hover:border-white/20 transition-all focus:outline-none cursor-pointer uppercase"
              title="Select Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold font-mono transition-all shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal('income')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t.addIncome}</span>
          </button>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-accent/60 border border-border">
                {user?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {user?.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold block text-foreground leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono block font-semibold">
                    {currency} Wallet
                  </span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="p-2.5 rounded-xl border border-border hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-muted-foreground transition-all cursor-pointer"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => loginAsDemoGuest()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.recruiterDemo}</span>
                <span className="sm:hidden">Demo</span>
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold transition-all cursor-pointer"
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
