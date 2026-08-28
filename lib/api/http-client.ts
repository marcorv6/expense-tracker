import axios from 'axios';
import { ApiClientInterface } from './client';
import { mockApiClient } from './mock-client';

const API_BASE = '/api/v1';

function getHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('spendflow_auth_token_v1');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const httpClient: ApiClientInterface = {
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('spendflow_auth_user_v1');
    try {
      return userStr ? JSON.parse(userStr) : mockApiClient.getCurrentUser();
    } catch {
      return mockApiClient.getCurrentUser();
    }
  },

  getCurrentToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('spendflow_auth_token_v1') || mockApiClient.getCurrentToken();
  },

  async login(credentials) {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, credentials);
      const { token, user } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spendflow_auth_token_v1', token);
        localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(user));
      }
      return { token, user };
    } catch {
      return mockApiClient.login(credentials);
    }
  },

  async register(credentials) {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, credentials);
      const { token, user } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spendflow_auth_token_v1', token);
        localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(user));
      }
      return { token, user };
    } catch {
      return mockApiClient.register(credentials);
    }
  },

  async loginAsDemoGuest() {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { isDemo: true });
      const { token, user } = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('spendflow_auth_token_v1', token);
        localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(user));
      }
      return { token, user };
    } catch {
      return mockApiClient.loginAsDemoGuest();
    }
  },

  async logout() {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { headers: getHeaders() });
    } catch {
      // Ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('spendflow_auth_token_v1');
        localStorage.removeItem('spendflow_auth_user_v1');
      }
      await mockApiClient.logout();
    }
  },

  async getTransactions(filters) {
    try {
      const res = await axios.get(`${API_BASE}/transactions`, {
        params: filters,
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.getTransactions(filters);
    }
  },

  async getTransactionById(id) {
    try {
      const res = await axios.get(`${API_BASE}/transactions/${id}`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.getTransactionById(id);
    }
  },

  async createTransaction(input) {
    try {
      const res = await axios.post(`${API_BASE}/transactions`, input, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.createTransaction(input);
    }
  },

  async updateTransaction(id, input) {
    try {
      const res = await axios.put(`${API_BASE}/transactions/${id}`, input, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.updateTransaction(id, input);
    }
  },

  async deleteTransaction(id) {
    try {
      const res = await axios.delete(`${API_BASE}/transactions/${id}`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.deleteTransaction(id);
    }
  },

  async batchOperation(input) {
    try {
      const res = await axios.post(`${API_BASE}/transactions/batch`, input, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.batchOperation(input);
    }
  },

  async getCategories() {
    try {
      const res = await axios.get(`${API_BASE}/categories`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.getCategories();
    }
  },

  async createCategory(input) {
    try {
      const res = await axios.post(`${API_BASE}/categories`, input, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.createCategory(input);
    }
  },

  async deleteCategory(id) {
    try {
      const res = await axios.delete(`${API_BASE}/categories/${id}`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.deleteCategory(id);
    }
  },

  async getStats() {
    try {
      const res = await axios.get(`${API_BASE}/stats`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch {
      return mockApiClient.getStats();
    }
  },

  async exportData(format) {
    try {
      const res = await axios.get(`${API_BASE}/export`, {
        params: { format },
        headers: getHeaders(),
        responseType: 'blob',
      });
      const filename = `spendflow-export-${new Date().toISOString().slice(0, 10)}.${format}`;
      return { blob: res.data, filename };
    } catch {
      return mockApiClient.exportData(format);
    }
  },
};
