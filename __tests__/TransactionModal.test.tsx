import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionModal } from '@/components/TransactionModal';
import { Category, TransactionItem } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Housing & Rent', type: 'expense', color: '#0f172a', monthlyBudget: 1500 },
  { id: 'cat-2', name: 'Salary & Earnings', type: 'income', color: '#10b981', monthlyBudget: 0 },
];

const mockInitialTx: TransactionItem = {
  id: 'tx-1',
  userId: 'user-1',
  type: 'expense',
  amount: 250,
  description: 'Groceries',
  categoryId: 'cat-1',
  categoryName: 'Housing & Rent',
  categoryColor: '#0f172a',
  date: '2026-08-28T00:00:00.000Z',
  paymentMethod: 'credit_card',
  status: 'cleared',
  notes: 'Organic groceries',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('TransactionModal Component', () => {
  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <TransactionModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={mockCategories}
      />
    );
    expect(screen.queryByText(/Log New/i)).not.toBeInTheDocument();
  });

  it('renders correctly when open and populates default fields', () => {
    renderWithProviders(
      <TransactionModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={mockCategories}
        defaultType="expense"
      />
    );

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Whole Foods Market/i)).toBeInTheDocument();
  });

  it('switches between Expense and Income types', () => {
    renderWithProviders(
      <TransactionModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={mockCategories}
        defaultType="expense"
      />
    );

    const incomeBtn = screen.getByRole('button', { name: /Income|Ingreso/i });
    fireEvent.click(incomeBtn);

    expect(incomeBtn).toHaveClass('bg-emerald-500');
  });

  it('resets form fields on submit', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    renderWithProviders(
      <TransactionModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        categories={mockCategories}
        defaultType="expense"
      />
    );

    const amountInput = screen.getByPlaceholderText('0.00');
    const descInput = screen.getByPlaceholderText(/Whole Foods Market/i);

    fireEvent.change(amountInput, { target: { value: '120.50' } });
    fireEvent.change(descInput, { target: { value: 'Electric Bill' } });

    const submitBtn = screen.getByRole('button', { name: /Save Record/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'expense',
          amount: 120.5,
          description: 'Electric Bill',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('triggers onClose when Cancel button is clicked', () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <TransactionModal
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        categories={mockCategories}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it('populates initialData when editing an existing transaction', () => {
    renderWithProviders(
      <TransactionModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        categories={mockCategories}
        initialData={mockInitialTx}
      />
    );

    expect(screen.getByDisplayValue('250')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Organic groceries')).toBeInTheDocument();
  });
});
