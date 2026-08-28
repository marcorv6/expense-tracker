export type TransactionType = 'expense' | 'income';
export type TransactionStatus = 'cleared' | 'pending';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  monthlyBudget: number;
  spentThisMonth?: number;
}

export interface TransactionItem {
  id: string;
  userId: string;
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  description: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  date?: string;
  description: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>;

export interface CategoryBreakdown {
  categoryId: string;
  name: string;
  color: string;
  type: TransactionType;
  total: number;
  percentage: number;
  monthlyBudget: number;
}

export interface FinancialStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
  savingsRate: number;
  pendingTransactionsCount: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export interface FilterOptions {
  type: 'all' | TransactionType;
  categoryId: string;
  startDate: string;
  endDate: string;
  search: string;
  paymentMethod: string;
  status: string;
  sortBy: 'date' | 'amount' | 'description';
  sortOrder: 'asc' | 'desc';
}

export interface BatchActionInput {
  ids: string[];
  action: 'delete' | 'mark_cleared' | 'mark_pending';
}
