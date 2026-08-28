'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { SupportedCurrency, SupportedLanguage, Translations, TRANSLATIONS } from '@/lib/i18n/translations';

interface PreferencesContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  language: SupportedLanguage;
  setLanguage: (l: SupportedLanguage) => void;
  t: Translations;
  formatCurrency: (amount: number) => string;
  isMounted: boolean;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    if (typeof window !== 'undefined') {
      const storedCurr = localStorage.getItem('spendflow_user_currency') as SupportedCurrency;
      if (storedCurr && ['USD', 'EUR', 'GBP', 'MXN', 'CAD', 'JPY', 'BRL', 'AUD'].includes(storedCurr)) {
        return storedCurr;
      }
    }
    return 'USD';
  });

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('spendflow_user_language') as SupportedLanguage;
      if (storedLang && ['en', 'es', 'fr', 'de', 'pt'].includes(storedLang)) {
        return storedLang;
      }
    }
    return 'en';
  });

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendflow_user_currency', c);
    }
  };

  const setLanguage = (l: SupportedLanguage) => {
    setLanguageState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendflow_user_language', l);
    }
  };

  const formatCurrency = (amount: number): string => {
    const localeMap: Record<SupportedLanguage, string> = {
      en: 'en-US',
      es: 'es-MX',
      fr: 'fr-FR',
      de: 'de-DE',
      pt: 'pt-BR',
    };

    return new Intl.NumberFormat(localeMap[language] || 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        t,
        formatCurrency,
        isMounted,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
