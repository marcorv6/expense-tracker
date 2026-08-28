import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BudgetOverview } from '@/components/BudgetOverview';
import { Category } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Housing & Rent', type: 'expense', color: '#0f172a', monthlyBudget: 1500 },
  { id: 'cat-2', name: 'Food & Groceries', type: 'expense', color: '#10b981', monthlyBudget: 500 },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('BudgetOverview Component', () => {
  it('renders budget caps title and category items', () => {
    renderWithProviders(
      <BudgetOverview
        categories={mockCategories}
        onOpenCategoryModal={vi.fn()}
      />
    );

    expect(screen.getByText('Housing & Rent')).toBeInTheDocument();
    expect(screen.getByText('Food & Groceries')).toBeInTheDocument();
  });

  it('triggers onOpenCategoryModal when set limit button is clicked', () => {
    const handleOpenCat = vi.fn();
    renderWithProviders(
      <BudgetOverview
        categories={mockCategories}
        onOpenCategoryModal={handleOpenCat}
      />
    );

    const btn = screen.getByRole('button', { name: /Set Budget Limits/i });
    fireEvent.click(btn);

    expect(handleOpenCat).toHaveBeenCalled();
  });
});
