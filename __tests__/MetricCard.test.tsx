import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from '@/components/MetricCard';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { Wallet } from 'lucide-react';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<PreferencesProvider>{ui}</PreferencesProvider>);
};

describe('MetricCard Component', () => {
  it('renders standard metric title and formatted amount', () => {
    renderWithProviders(
      <MetricCard
        title="Monthly Expenditures"
        amount={1250.75}
        icon={Wallet}
        subtext="Operating expenses"
      />
    );

    expect(screen.getByText('Monthly Expenditures')).toBeInTheDocument();
    expect(screen.getByText('Operating expenses')).toBeInTheDocument();
    expect(screen.getByText('$1,250.75')).toBeInTheDocument();
  });

  it('renders positive trend badge when provided', () => {
    renderWithProviders(
      <MetricCard
        title="Gross Revenue"
        amount={5000}
        icon={Wallet}
        trend={{ value: 18, isPositive: true }}
      />
    );

    expect(screen.getByText('+18%')).toBeInTheDocument();
  });

  it('renders luxury virtual credit card styling when isMainBalanceCard is true', () => {
    renderWithProviders(
      <MetricCard
        title="TOTAL NET LIQUIDITY"
        amount={18450}
        icon={Wallet}
        isMainBalanceCard={true}
      />
    );

    expect(screen.getByText('TOTAL NET LIQUIDITY')).toBeInTheDocument();
    expect(screen.getByText('$18,450.00')).toBeInTheDocument();
    expect(screen.getByText('Audited')).toBeInTheDocument();
  });
});
