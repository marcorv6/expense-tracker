import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, formatCurrencyAmount } from '@/lib/i18n/translations';

describe('i18n Utilities', () => {
  it('contains valid translations for English and Spanish', () => {
    expect(TRANSLATIONS.en.appName).toBe('SpendFlow');
    expect(TRANSLATIONS.es.appName).toBe('SpendFlow');
    expect(TRANSLATIONS.en.netLiquidity).toBe('Total Net Liquidity');
    expect(TRANSLATIONS.es.netLiquidity).toBe('Liquidez Neta Total');
  });

  it('formats USD currency correctly', () => {
    const formatted = formatCurrencyAmount(1250.5, 'USD');
    expect(formatted).toBe('$1,250.50');
  });

  it('formats EUR currency correctly', () => {
    const formatted = formatCurrencyAmount(500, 'EUR');
    expect(formatted).toBe('€500.00');
  });

  it('formats MXN currency correctly', () => {
    const formatted = formatCurrencyAmount(3200, 'MXN');
    expect(formatted).toBe('MX$3,200.00');
  });
});
