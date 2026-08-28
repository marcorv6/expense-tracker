import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CategoryModal } from '@/components/CategoryModal';
import { Category } from '@/types/expense';
import { PreferencesProvider } from '@/context/PreferencesContext';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Housing & Rent', type: 'expense', color: '#0f172a', monthlyBudget: 1500 },
  { id: 'cat-2', name: 'Salary & Earnings', type: 'income', color: '#10b981', monthlyBudget: 0 },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('CategoryModal Component', () => {
  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <CategoryModal
        isOpen={false}
        onClose={vi.fn()}
        categories={mockCategories}
        onCreateCategory={vi.fn()}
        onDeleteCategory={vi.fn()}
      />
    );
    expect(screen.queryByText(/Categories/i)).not.toBeInTheDocument();
  });

  it('renders categories list and input fields when open', () => {
    renderWithProviders(
      <CategoryModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        onCreateCategory={vi.fn()}
        onDeleteCategory={vi.fn()}
      />
    );

    expect(screen.getByText('Housing & Rent')).toBeInTheDocument();
    expect(screen.getByText('Salary & Earnings')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Subscriptions, Travel/i)).toBeInTheDocument();
  });

  it('submits a new category and resets form inputs', async () => {
    const handleCreate = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CategoryModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        onCreateCategory={handleCreate}
        onDeleteCategory={vi.fn()}
      />
    );

    const nameInput = screen.getByPlaceholderText(/Subscriptions, Travel/i);
    const budgetInput = screen.getByPlaceholderText(/500/i);

    fireEvent.change(nameInput, { target: { value: 'Fitness & Gym' } });
    fireEvent.change(budgetInput, { target: { value: '85' } });

    const createBtn = screen.getByRole('button', { name: /Create Category/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(handleCreate).toHaveBeenCalledWith({
        name: 'Fitness & Gym',
        type: 'expense',
        color: '#0f172a',
        monthlyBudget: 85,
      });
      expect(nameInput).toHaveValue('');
      expect(budgetInput).toHaveValue(null);
    });
  });

  it('calls onDeleteCategory when delete icon is clicked', () => {
    const handleDelete = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CategoryModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        onCreateCategory={vi.fn()}
        onDeleteCategory={handleDelete}
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete category');
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith('cat-1');
  });
});
