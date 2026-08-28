import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionCard } from '@/components/TransactionCard';
import { TransactionItem } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockTx: TransactionItem = {
  id: 'tx-99',
  userId: 'user-1',
  type: 'expense',
  amount: 45.99,
  description: 'Starbucks Coffee',
  categoryId: 'cat-3',
  categoryName: 'Dining Out',
  categoryColor: '#f59e0b',
  date: '2026-08-28T00:00:00.000Z',
  paymentMethod: 'credit_card',
  status: 'cleared',
  notes: 'Team meeting',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('TransactionCard Component', () => {
  it('renders transaction details, category, and formatted amount', () => {
    renderWithProviders(
      <TransactionCard
        transaction={mockTx}
        isSelected={false}
        onSelectToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Starbucks Coffee')).toBeInTheDocument();
    expect(screen.getByText('Dining Out')).toBeInTheDocument();
    expect(screen.getAllByText('-$45.99').length).toBeGreaterThan(0);
    expect(screen.getByText('Cleared')).toBeInTheDocument();
  });

  it('triggers onSelectToggle when checkbox is clicked', () => {
    const handleSelect = vi.fn();
    renderWithProviders(
      <TransactionCard
        transaction={mockTx}
        isSelected={false}
        onSelectToggle={handleSelect}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusToggle={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleSelect).toHaveBeenCalledWith('tx-99');
  });

  it('triggers onEdit and onDelete callbacks', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(
      <TransactionCard
        transaction={mockTx}
        isSelected={false}
        onSelectToggle={vi.fn()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusToggle={vi.fn()}
      />
    );

    const editBtn = screen.getByTitle('Edit');
    const deleteBtn = screen.getByTitle('Delete');

    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockTx);

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith('tx-99');
  });
});
