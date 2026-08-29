import { mockApiClient } from './mock-client';
import { httpClient } from './http-client';
import {
  TransactionItem,
  Category,
  CreateTransactionInput,
  UpdateTransactionInput,
  FinancialStats,
  BatchActionInput,
  FilterOptions,
} from '@/types/expense';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export interface ApiClientInterface {
  getCurrentUser(): User | null;
  getCurrentToken(): string | null;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  loginAsDemoGuest(): Promise<AuthResponse>;
  logout(): Promise<void>;

  getTransactions(filters?: Partial<FilterOptions>): Promise<{ data: TransactionItem[]; total: number }>;
  getTransactionById(id: string): Promise<TransactionItem>;
  createTransaction(input: CreateTransactionInput): Promise<TransactionItem>;
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<TransactionItem>;
  deleteTransaction(id: string): Promise<{ success: boolean; id: string }>;
  batchOperation(input: BatchActionInput): Promise<{ success: boolean; affectedCount: number }>;
  
  getCategories(): Promise<Category[]>;
  createCategory(input: { name: string; type: 'expense' | 'income'; color: string; icon?: string; monthlyBudget?: number }): Promise<Category>;
  deleteCategory(id: string): Promise<{ success: boolean }>;
  
  getStats(): Promise<FinancialStats>;
  exportData(format: 'csv' | 'json'): Promise<{ blob: Blob; filename: string }>;
  importTransactionsBatch(items: unknown[]): Promise<{ success: boolean; importedCount: number; totalReceived: number }>;
  resetToDefaults?(): void;
}

import { SPENDFLOW_STORAGE_KEYS } from '@/lib/constants/storage';

function isDemoUser(): boolean {
  if (typeof window === 'undefined') return false;
  const userStr = localStorage.getItem(SPENDFLOW_STORAGE_KEYS.AUTH_USER);
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return user?.isDemo === true || user?.id === 'demo-user-123';
  } catch {
    return false;
  }
}

function getActiveClient(): ApiClientInterface {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDemoUser()) {
    return mockApiClient;
  }
  return httpClient;
}

export const api: ApiClientInterface = {
  getCurrentUser() {
    return getActiveClient().getCurrentUser();
  },
  getCurrentToken() {
    return getActiveClient().getCurrentToken();
  },
  async login(credentials) {
    if (credentials.isDemo) {
      return mockApiClient.loginAsDemoGuest();
    }
    return httpClient.login(credentials);
  },
  async register(credentials) {
    return httpClient.register(credentials);
  },
  async loginAsDemoGuest() {
    return mockApiClient.loginAsDemoGuest();
  },
  async logout() {
    return getActiveClient().logout();
  },

  async getTransactions(filters) {
    return getActiveClient().getTransactions(filters);
  },
  async getTransactionById(id) {
    return getActiveClient().getTransactionById(id);
  },
  async createTransaction(input) {
    return getActiveClient().createTransaction(input);
  },
  async updateTransaction(id, input) {
    return getActiveClient().updateTransaction(id, input);
  },
  async deleteTransaction(id) {
    return getActiveClient().deleteTransaction(id);
  },
  async batchOperation(input) {
    return getActiveClient().batchOperation(input);
  },

  async getCategories() {
    return getActiveClient().getCategories();
  },
  async createCategory(input) {
    return getActiveClient().createCategory(input);
  },
  async deleteCategory(id) {
    return getActiveClient().deleteCategory(id);
  },

  async getStats() {
    return getActiveClient().getStats();
  },
  async exportData(format) {
    return getActiveClient().exportData(format);
  },
  async importTransactionsBatch(items: unknown[]) {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDemoUser()) {
      return mockApiClient.importTransactionsBatch(items);
    }
    return httpClient.importTransactionsBatch(items);
  },
};
