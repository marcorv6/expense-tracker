import { ApiClientInterface } from './client';
import {
  TransactionItem,
  Category,
  CreateTransactionInput,
  FinancialStats,
} from '@/types/expense';
import { User } from '@/types/auth';

const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'recruiter@demo.com',
  name: 'Alex Vance',
  currency: 'USD',
  isDemo: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-housing', userId: DEMO_USER.id, name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'home', monthlyBudget: 2200 },
  { id: 'cat-food', userId: DEMO_USER.id, name: 'Food & Groceries', type: 'expense', color: '#10b981', icon: 'shopping-cart', monthlyBudget: 800 },
  { id: 'cat-dining', userId: DEMO_USER.id, name: 'Dining Out', type: 'expense', color: '#f59e0b', icon: 'utensils', monthlyBudget: 400 },
  { id: 'cat-utilities', userId: DEMO_USER.id, name: 'Utilities & Internet', type: 'expense', color: '#06b6d4', icon: 'zap', monthlyBudget: 300 },
  { id: 'cat-tech', userId: DEMO_USER.id, name: 'Tech & Subscriptions', type: 'expense', color: '#8b5cf6', icon: 'laptop', monthlyBudget: 250 },
  { id: 'cat-transp', userId: DEMO_USER.id, name: 'Transportation', type: 'expense', color: '#ec4899', icon: 'car', monthlyBudget: 350 },
  { id: 'cat-salary', userId: DEMO_USER.id, name: 'Salary & Earnings', type: 'income', color: '#22c55e', icon: 'briefcase', monthlyBudget: 0 },
  { id: 'cat-freelance', userId: DEMO_USER.id, name: 'Freelance Work', type: 'income', color: '#14b8a6', icon: 'code', monthlyBudget: 0 },
  { id: 'cat-invest', userId: DEMO_USER.id, name: 'Dividends & Stock', type: 'income', color: '#3b82f6', icon: 'trending-up', monthlyBudget: 0 },
];

const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    userId: DEMO_USER.id,
    categoryId: 'cat-salary',
    categoryName: 'Salary & Earnings',
    categoryColor: '#22c55e',
    categoryIcon: 'briefcase',
    type: 'income',
    amount: 6500.00,
    currency: 'USD',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: 'Monthly Engineering Salary Direct Deposit',
    notes: 'Base salary payout',
    paymentMethod: 'bank_transfer',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-2',
    userId: DEMO_USER.id,
    categoryId: 'cat-housing',
    categoryName: 'Housing & Rent',
    categoryColor: '#6366f1',
    categoryIcon: 'home',
    type: 'expense',
    amount: 2100.00,
    currency: 'USD',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: 'Downtown Apartment Monthly Lease',
    notes: 'Includes reserved parking space',
    paymentMethod: 'bank_transfer',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-3',
    userId: DEMO_USER.id,
    categoryId: 'cat-food',
    categoryName: 'Food & Groceries',
    categoryColor: '#10b981',
    categoryIcon: 'shopping-cart',
    type: 'expense',
    amount: 184.50,
    currency: 'USD',
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    description: 'Whole Foods Market Weekly Stockup',
    notes: 'Organic produce & meal prep essentials',
    paymentMethod: 'credit_card',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-4',
    userId: DEMO_USER.id,
    categoryId: 'cat-freelance',
    categoryName: 'Freelance Work',
    categoryColor: '#14b8a6',
    categoryIcon: 'code',
    type: 'income',
    amount: 1450.00,
    currency: 'USD',
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    description: 'Frontend React Architecture Consulting',
    notes: 'Milestone 2 payout',
    paymentMethod: 'digital_wallet',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-5',
    userId: DEMO_USER.id,
    categoryId: 'cat-tech',
    categoryName: 'Tech & Subscriptions',
    categoryColor: '#8b5cf6',
    categoryIcon: 'laptop',
    type: 'expense',
    amount: 49.00,
    currency: 'USD',
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    description: 'Vercel Pro & GitHub Copilot Subscriptions',
    paymentMethod: 'credit_card',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-6',
    userId: DEMO_USER.id,
    categoryId: 'cat-dining',
    categoryName: 'Dining Out',
    categoryColor: '#f59e0b',
    categoryIcon: 'utensils',
    type: 'expense',
    amount: 88.20,
    currency: 'USD',
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    description: 'Sushi Dinner with Engineering Team',
    paymentMethod: 'credit_card',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-7',
    userId: DEMO_USER.id,
    categoryId: 'cat-utilities',
    categoryName: 'Utilities & Internet',
    categoryColor: '#06b6d4',
    categoryIcon: 'zap',
    type: 'expense',
    amount: 142.10,
    currency: 'USD',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    description: 'Gigabit Fiber Internet & Power Utility',
    paymentMethod: 'debit_card',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tx-8',
    userId: DEMO_USER.id,
    categoryId: 'cat-transp',
    categoryName: 'Transportation',
    categoryColor: '#ec4899',
    categoryIcon: 'car',
    type: 'expense',
    amount: 65.00,
    currency: 'USD',
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
    description: 'EV Charging Station Refill',
    paymentMethod: 'credit_card',
    status: 'cleared',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const str = localStorage.getItem('spendflow_categories_mock_v1');
  if (!str) {
    localStorage.setItem('spendflow_categories_mock_v1', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  try {
    return JSON.parse(str);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function getStoredTransactions(): TransactionItem[] {
  if (typeof window === 'undefined') return DEFAULT_TRANSACTIONS;
  const str = localStorage.getItem('spendflow_transactions_mock_v1');
  if (!str) {
    localStorage.setItem('spendflow_transactions_mock_v1', JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  }
  try {
    return JSON.parse(str);
  } catch {
    return DEFAULT_TRANSACTIONS;
  }
}

function setStoredTransactions(txs: TransactionItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spendflow_transactions_mock_v1', JSON.stringify(txs));
  }
}

function setStoredCategories(cats: Category[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spendflow_categories_mock_v1', JSON.stringify(cats));
  }
}

export const mockApiClient: ApiClientInterface = {
  getCurrentUser() {
    if (typeof window === 'undefined') return DEMO_USER;
    const userStr = localStorage.getItem('spendflow_auth_user_v1');
    try {
      return userStr ? JSON.parse(userStr) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  },

  getCurrentToken() {
    if (typeof window === 'undefined') return 'mock-jwt-token-guest';
    return localStorage.getItem('spendflow_auth_token_v1') || 'mock-jwt-token-guest';
  },

  async login(credentials) {
    const user = { ...DEMO_USER, email: credentials.email || DEMO_USER.email };
    const token = 'mock-jwt-token-user';
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendflow_auth_token_v1', token);
      localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(user));
    }
    return { user, token };
  },

  async register(credentials) {
    const user: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      currency: credentials.currency || 'USD',
      createdAt: new Date().toISOString(),
    };
    const token = `mock-jwt-token-${user.id}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendflow_auth_token_v1', token);
      localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(user));
    }
    return { user, token };
  },

  async loginAsDemoGuest() {
    const token = 'mock-jwt-token-recruiter-demo';
    if (typeof window !== 'undefined') {
      localStorage.setItem('spendflow_auth_token_v1', token);
      localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(DEMO_USER));
    }
    return { user: DEMO_USER, token };
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spendflow_auth_token_v1');
      localStorage.removeItem('spendflow_auth_user_v1');
    }
  },

  async getTransactions(filters) {
    let list = [...getStoredTransactions()];
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((t) => t.type === filters.type);
    }
    if (filters?.categoryId) {
      list = list.filter((t) => t.categoryId === filters.categoryId);
    }
    if (filters?.status) {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters?.paymentMethod) {
      list = list.filter((t) => t.paymentMethod === filters.paymentMethod);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          (t.categoryName && t.categoryName.toLowerCase().includes(q))
      );
    }

    if (filters?.sortBy === 'amount') {
      list.sort((a, b) => (filters.sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount));
    } else if (filters?.sortBy === 'description') {
      list.sort((a, b) =>
        filters.sortOrder === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description)
      );
    } else {
      list.sort((a, b) =>
        filters?.sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return { data: list, total: list.length };
  },

  async getTransactionById(id) {
    const list = getStoredTransactions();
    const found = list.find((t) => t.id === id);
    if (!found) throw new Error('Transaction not found');
    return found;
  },

  async createTransaction(input: CreateTransactionInput) {
    const categories = getStoredCategories();
    const cat = categories.find((c) => c.id === input.categoryId);
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      userId: DEMO_USER.id,
      categoryId: input.categoryId,
      categoryName: cat?.name || 'General',
      categoryColor: cat?.color || '#3b82f6',
      categoryIcon: cat?.icon || 'wallet',
      type: input.type,
      amount: Number(input.amount),
      currency: input.currency || 'USD',
      date: input.date || new Date().toISOString(),
      description: input.description,
      notes: input.notes,
      paymentMethod: input.paymentMethod || 'credit_card',
      status: input.status || 'cleared',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const list = [newTx, ...getStoredTransactions()];
    setStoredTransactions(list);
    return newTx;
  },

  async updateTransaction(id, input) {
    const list = getStoredTransactions();
    const categories = getStoredCategories();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');

    const cat = input.categoryId ? categories.find((c) => c.id === input.categoryId) : undefined;
    const updated: TransactionItem = {
      ...list[idx],
      ...input,
      categoryName: cat ? cat.name : list[idx].categoryName,
      categoryColor: cat ? cat.color : list[idx].categoryColor,
      categoryIcon: cat ? cat.icon : list[idx].categoryIcon,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    setStoredTransactions(list);
    return updated;
  },

  async deleteTransaction(id) {
    const list = getStoredTransactions().filter((t) => t.id !== id);
    setStoredTransactions(list);
    return { success: true, id };
  },

  async batchOperation({ ids, action }) {
    let list = getStoredTransactions();
    if (action === 'delete') {
      list = list.filter((t) => !ids.includes(t.id));
    } else if (action === 'mark_cleared') {
      list = list.map((t) => (ids.includes(t.id) ? { ...t, status: 'cleared' } : t));
    } else if (action === 'mark_pending') {
      list = list.map((t) => (ids.includes(t.id) ? { ...t, status: 'pending' } : t));
    }
    setStoredTransactions(list);
    return { success: true, affectedCount: ids.length };
  },

  async getCategories() {
    const categories = getStoredCategories();
    const transactions = getStoredTransactions();

    return categories.map((cat) => {
      const spentThisMonth = transactions
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, spentThisMonth };
    });
  },

  async createCategory(input) {
    const categories = getStoredCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      userId: DEMO_USER.id,
      name: input.name,
      type: input.type,
      color: input.color || '#3b82f6',
      icon: input.icon || 'wallet',
      monthlyBudget: input.monthlyBudget || 0,
      spentThisMonth: 0,
    };
    const updated = [...categories, newCat];
    setStoredCategories(updated);
    return newCat;
  },

  async deleteCategory(id) {
    const updated = getStoredCategories().filter((c) => c.id !== id);
    setStoredCategories(updated);
    return { success: true };
  },

  async getStats(): Promise<FinancialStats> {
    const transactions = getStoredTransactions();
    const categories = getStoredCategories();

    const monthlyIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;
    const pendingTransactionsCount = transactions.filter((t) => t.status === 'pending').length;

    // Breakdown by category
    const categoryBreakdown = categories
      .filter((c) => c.type === 'expense')
      .map((cat) => {
        const total = transactions
          .filter((t) => t.categoryId === cat.id)
          .reduce((sum, t) => sum + t.amount, 0);
        const percentage = monthlyExpenses > 0 ? (total / monthlyExpenses) * 100 : 0;
        return {
          categoryId: cat.id,
          name: cat.name,
          color: cat.color,
          type: cat.type,
          total,
          percentage,
          monthlyBudget: cat.monthlyBudget,
        };
      })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    // Monthly trends sample
    const monthlyTrends = [
      { month: 'Apr', income: 6200, expense: 2800 },
      { month: 'May', income: 7100, expense: 3100 },
      { month: 'Jun', income: 6800, expense: 2950 },
      { month: 'Jul', income: 7400, expense: 3050 },
      { month: 'Aug', income: monthlyIncome, expense: monthlyExpenses },
    ];

    return {
      totalBalance: 18450.00 + netSavings,
      monthlyIncome,
      monthlyExpenses,
      netSavings,
      savingsRate: Number(savingsRate.toFixed(1)),
      pendingTransactionsCount,
      categoryBreakdown,
      monthlyTrends,
    };
  },

  async exportData(format) {
    const list = getStoredTransactions();
    let content = '';
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(list, null, 2);
      mimeType = 'application/json';
    } else {
      const headers = ['ID', 'Date', 'Type', 'Description', 'Category', 'Amount', 'Currency', 'Payment Method', 'Status'];
      const rows = list.map((t) => [
        t.id,
        t.date,
        t.type,
        `"${t.description.replace(/"/g, '""')}"`,
        `"${(t.categoryName || '').replace(/"/g, '""')}"`,
        t.amount,
        t.currency,
        t.paymentMethod,
        t.status,
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const filename = `spendflow-export-${new Date().toISOString().slice(0, 10)}.${format}`;
    return { blob, filename };
  },

  resetToDefaults() {
    setStoredTransactions(DEFAULT_TRANSACTIONS);
    setStoredCategories(DEFAULT_CATEGORIES);
  },
};
