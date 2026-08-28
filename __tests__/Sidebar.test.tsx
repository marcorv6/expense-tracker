import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '@/components/Sidebar';
import { Category } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Housing & Rent', type: 'expense', color: '#0f172a', monthlyBudget: 1500 },
  { id: 'cat-2', name: 'Salary & Earnings', type: 'income', color: '#10b981', monthlyBudget: 0 },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('Sidebar Component', () => {
  it('renders navigation tabs and category caps', () => {
    renderWithProviders(
      <Sidebar
        activeTab="overview"
        setActiveTab={vi.fn()}
        categories={mockCategories}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onExport={vi.fn()}
      />
    );

    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
    expect(screen.getByText('Housing & Rent')).toBeInTheDocument();
  });

  it('triggers setActiveTab when tab item is clicked', () => {
    const handleTabChange = vi.fn();
    renderWithProviders(
      <Sidebar
        activeTab="overview"
        setActiveTab={handleTabChange}
        categories={mockCategories}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onExport={vi.fn()}
      />
    );

    const expensesTab = screen.getByText('Expenditures Ledger');
    fireEvent.click(expensesTab);

    expect(handleTabChange).toHaveBeenCalledWith('expenses');
  });

  it('triggers onExport when CSV or JSON export buttons are clicked', () => {
    const handleExport = vi.fn();
    renderWithProviders(
      <Sidebar
        activeTab="overview"
        setActiveTab={vi.fn()}
        categories={mockCategories}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onExport={handleExport}
      />
    );

    const csvBtn = screen.getByRole('button', { name: /CSV/i });
    const jsonBtn = screen.getByRole('button', { name: /JSON/i });

    fireEvent.click(csvBtn);
    expect(handleExport).toHaveBeenCalledWith('csv');

    fireEvent.click(jsonBtn);
    expect(handleExport).toHaveBeenCalledWith('json');
  });
});
