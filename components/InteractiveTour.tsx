'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { SPENDFLOW_STORAGE_KEYS } from '@/lib/constants/storage';

export function startSpendFlowTour() {
  if (typeof window === 'undefined') return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.75)',
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: 'spendflow-tour-popover',
    nextBtnText: 'Next →',
    prevBtnText: '← Back',
    doneBtnText: 'Complete Setup ✓',
    onDestroyStarted: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SPENDFLOW_STORAGE_KEYS.TUTORIAL_SEEN, 'true');
      }
      driverObj.destroy();
    },
    steps: [
      {
        element: '#tour-net-liquidity',
        popover: {
          title: '🏦 Net Liquidity Reserve',
          description: 'Your real-time checking and savings balance audit. Displays your net available liquidity reserve.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-add-expense',
        popover: {
          title: '➕ Log an Expenditure',
          description: 'Click here to log a new expense item, choose a category, and track cleared or pending status.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#tour-add-income',
        popover: {
          title: '↗ Register Income',
          description: 'Click here to log incoming revenue, salary earnings, or freelance project deposits.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#tour-cashflow-chart',
        popover: {
          title: '📈 Cashflow Dynamics',
          description: 'Interactive wave graph tracking spending curves over time. Toggle between Week, Month, and Year views.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#tour-expenditure-share',
        popover: {
          title: '📊 Expenditure Share',
          description: 'Percentage breakdown of your monthly budget allocations across active categories.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#tour-budget-caps',
        popover: {
          title: '🎯 Monthly Budget Caps',
          description: 'Monitor spending limits across Housing, Food, Dining, Utilities, and Subscriptions.',
          side: 'top',
          align: 'start',
        },
      },
      {
        element: '#tour-transaction-ledger',
        popover: {
          title: '🧾 Financial Ledger',
          description: 'Search, filter, batch-edit records, or export your complete ledger as CSV or JSON.',
          side: 'top',
          align: 'start',
        },
      },
    ],
  });

  driverObj.drive();
}

interface InteractiveTourProps {
  autoStartOnFirstVisit?: boolean;
}

export function InteractiveTour({ autoStartOnFirstVisit = true }: InteractiveTourProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && autoStartOnFirstVisit) {
      const seen = localStorage.getItem(SPENDFLOW_STORAGE_KEYS.TUTORIAL_SEEN);
      if (!seen) {
        const timer = setTimeout(() => {
          startSpendFlowTour();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [autoStartOnFirstVisit]);

  return null;
}
