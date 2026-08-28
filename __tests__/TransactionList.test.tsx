import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionList } from '@/components/TransactionList';
import { Category, TransactionItem } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Housing & Rent', type: 'expense', color: '#0f172a', monthlyBudget: 1500 },
];

const mockTransactions: TransactionItem[] = [
  {
    id: 'tx-10',
    userId: 'u1',
    type: 'expense',
    amount: 120,
    description: 'Utility Bill',
    categoryId: 'cat-1',
    categoryName: 'Housing & Rent',
    date: '2026-08-28T00:00:00.000Z',
    paymentMethod: 'bank_transfer',
    status: 'cleared',
    createdAt: '2026-08-28T00:00:00.000Z',
    updatedAt: '2026-08-28T00:00:00.000Z',
  },
  {
    id: 'tx-11',
    userId: 'u1',
    type: 'expense',
    amount: 50,
    description: 'Internet Bill',
    categoryId: 'cat-1',
    categoryName: 'Housing & Rent',
    date: '2026-08-27T00:00:00.000Z',
    paymentMethod: 'credit_card',
    status: 'pending',
    createdAt: '2026-08-27T00:00:00.000Z',
    updatedAt: '2026-08-27T00:00:00.000Z',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('TransactionList Component', () => {
  it('renders search input, filter controls, and transaction card items', () => {
    renderWithProviders(
      <TransactionList
        transactions={mockTransactions}
        categories={mockCategories}
        searchQuery=""
        setSearchQuery={vi.fn()}
        typeFilter="all"
        setTypeFilter={vi.fn()}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        sortBy="date"
        setSortBy={vi.fn()}
        sortOrder="desc"
        setSortOrder={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusToggle={vi.fn()}
        onBatchAction={vi.fn()}
        onOpenTransactionModal={vi.fn()}
      />
    );

    expect(screen.getByText('Utility Bill')).toBeInTheDocument();
    expect(screen.getByText('Internet Bill')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search description, notes.../i)).toBeInTheDocument();
  });

  it('handles batch selection and triggers onBatchAction', () => {
    const handleBatch = vi.fn();
    renderWithProviders(
      <TransactionList
        transactions={mockTransactions}
        categories={mockCategories}
        searchQuery=""
        setSearchQuery={vi.fn()}
        typeFilter="all"
        setTypeFilter={vi.fn()}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        sortBy="date"
        setSortBy={vi.fn()}
        sortOrder="desc"
        setSortOrder={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusToggle={vi.fn()}
        onBatchAction={handleBatch}
        onOpenTransactionModal={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText(/2 entry\(s\) selected/i)).toBeInTheDocument();

    const markClearedBtn = screen.getByRole('button', { name: /Mark Cleared/i });
    const markPendingBtn = screen.getByRole('button', { name: /Mark Pending/i });
    const deleteSelectedBtn = screen.getByRole('button', { name: /Delete Selected/i });

    fireEvent.click(markClearedBtn);
    expect(handleBatch).toHaveBeenCalledWith(['tx-10', 'tx-11'], 'mark_cleared');

    fireEvent.click(markPendingBtn);
    expect(handleBatch).toHaveBeenCalledWith(['tx-10', 'tx-11'], 'mark_pending');

    fireEvent.click(deleteSelectedBtn);
    expect(handleBatch).toHaveBeenCalledWith(['tx-10', 'tx-11'], 'delete');
  });

  it('triggers new entry modal when create button is clicked', () => {
    const handleOpenTx = vi.fn();
    renderWithProviders(
      <TransactionList
        transactions={mockTransactions}
        categories={mockCategories}
        searchQuery=""
        setSearchQuery={vi.fn()}
        typeFilter="all"
        setTypeFilter={vi.fn()}
        selectedCategory=""
        setSelectedCategory={vi.fn()}
        sortBy="date"
        setSortBy={vi.fn()}
        sortOrder="desc"
        setSortOrder={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusToggle={vi.fn()}
        onBatchAction={vi.fn()}
        onOpenTransactionModal={handleOpenTx}
      />
    );

    const newEntryBtn = screen.getByRole('button', { name: /New Entry/i });
    fireEvent.click(newEntryBtn);

    expect(handleOpenTx).toHaveBeenCalledWith('expense');
  });
});
