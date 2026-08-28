import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpendingCharts } from '@/components/SpendingCharts';
import { CategoryBreakdownItem, MonthlyTrendItem, TransactionItem } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockBreakdown: CategoryBreakdownItem[] = [
  { categoryId: 'cat-1', categoryName: 'Housing & Rent', color: '#0f172a', totalAmount: 1200, percentage: 60 },
];

const mockTrends: MonthlyTrendItem[] = [
  { month: 'Jun', income: 4000, expense: 2000 },
  { month: 'Jul', income: 4500, expense: 2200 },
];

const mockTransactions: TransactionItem[] = [
  {
    id: 'tx-1',
    userId: 'u1',
    type: 'expense',
    amount: 150,
    description: 'Electric Bill',
    categoryId: 'cat-1',
    categoryName: 'Housing & Rent',
    date: '2026-08-28T00:00:00.000Z',
    paymentMethod: 'bank_transfer',
    status: 'cleared',
    createdAt: '2026-08-28T00:00:00.000Z',
    updatedAt: '2026-08-28T00:00:00.000Z',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('SpendingCharts Component', () => {
  it('renders cashflow dynamics and expenditure share cards', () => {
    renderWithProviders(
      <SpendingCharts
        categoryBreakdown={mockBreakdown}
        monthlyTrends={mockTrends}
        transactions={mockTransactions}
      />
    );

    expect(screen.getByText(/Cashflow Liquidity Dynamics/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenditure Share by Category/i)).toBeInTheDocument();
  });

  it('switches timeframe filters when Week, Month, Year buttons are clicked', () => {
    renderWithProviders(
      <SpendingCharts
        categoryBreakdown={mockBreakdown}
        monthlyTrends={mockTrends}
        transactions={mockTransactions}
      />
    );

    const weekBtn = screen.getByRole('button', { name: /Week/i });
    const monthBtn = screen.getByRole('button', { name: /Month/i });
    const yearBtn = screen.getByRole('button', { name: /Year/i });

    fireEvent.click(weekBtn);
    expect(weekBtn).toHaveClass('bg-slate-900');

    fireEvent.click(yearBtn);
    expect(yearBtn).toHaveClass('bg-slate-900');

    fireEvent.click(monthBtn);
    expect(monthBtn).toHaveClass('bg-slate-900');
  });
});
