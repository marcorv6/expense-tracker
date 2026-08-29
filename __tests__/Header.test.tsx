import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { AuthProvider } from '@/context/AuthContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <PreferencesProvider>{ui}</PreferencesProvider>
    </AuthProvider>
  );
};

describe('Header Component', () => {
  it('renders app name and taglines', () => {
    renderWithProviders(
      <Header
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    expect(screen.getByText('SpendFlow')).toBeInTheDocument();
  });

  it('triggers onStartTour when help icon button is clicked', () => {
    const handleStartTour = vi.fn();
    renderWithProviders(
      <Header
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onStartTour={handleStartTour}
      />
    );

    const helpBtn = screen.getByTitle('Take Tour & Help Setup');
    fireEvent.click(helpBtn);

    expect(handleStartTour).toHaveBeenCalled();
  });

  it('allows changing currency select', () => {
    renderWithProviders(
      <Header
        onOpenTransactionModal={vi.fn()}
        onOpenCategoryModal={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    const currencySelect = screen.getByTitle('Select Currency');
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    expect(currencySelect).toHaveValue('USD');
  });

  it('triggers onOpenTransactionModal for expense and income', () => {
    const handleOpenTx = vi.fn();
    renderWithProviders(
      <Header
        onOpenTransactionModal={handleOpenTx}
        onOpenCategoryModal={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    const addExpenseBtns = screen.getAllByRole('button', { name: /Add Expense|Agregar Gasto/i });
    const addIncomeBtn = screen.getByRole('button', { name: /Add Income|Agregar Ingreso/i });

    fireEvent.click(addExpenseBtns[0]);
    expect(handleOpenTx).toHaveBeenCalledWith('expense');

    fireEvent.click(addExpenseBtns[1]);
    expect(handleOpenTx).toHaveBeenCalledWith('expense');

    fireEvent.click(addIncomeBtn);
    expect(handleOpenTx).toHaveBeenCalledWith('income');
  });
});
