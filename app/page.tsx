'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MetricCard } from '@/components/MetricCard';
import { SpendingCharts } from '@/components/SpendingCharts';
import { BudgetOverview } from '@/components/BudgetOverview';
import { TransactionList } from '@/components/TransactionList';
import { TransactionModal } from '@/components/TransactionModal';
import { CategoryModal } from '@/components/CategoryModal';
import { AuthModal } from '@/components/AuthModal';
import { InteractiveTour, startSpendFlowTour } from '@/components/InteractiveTour';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { api } from '@/lib/api/client';
import { TransactionItem, Category, FinancialStats, TransactionType, CreateTransactionInput, FilterOptions } from '@/types/expense';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: isAuthLoading, isMounted: isAuthMounted } = useAuth();
  const { t, isMounted: isPrefMounted } = usePreferences();

  const isMounted = isAuthMounted && isPrefMounted;

  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<FinancialStats | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalDefaultType, setTxModalDefaultType] = useState<'expense' | 'income'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    try {
      const [txRes, catRes, statRes] = await Promise.all([
        api.getTransactions({
          search: searchQuery,
          type: typeFilter as FilterOptions['type'],
          categoryId: selectedCategory,
          sortBy,
          sortOrder,
        }),
        api.getCategories(),
        api.getStats(),
      ]);

      setTransactions(txRes.data);
      setCategories(catRes);
      setStats(statRes);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    if (!isAuthenticated || !isMounted) return;

    const loadAsync = async () => {
      try {
        const [txRes, catRes, statRes] = await Promise.all([
          api.getTransactions({
            search: searchQuery,
            type: typeFilter as FilterOptions['type'],
            categoryId: selectedCategory,
            sortBy,
            sortOrder,
          }),
          api.getCategories(),
          api.getStats(),
        ]);

        if (isSubscribed) {
          setTransactions(txRes.data);
          setCategories(catRes);
          setStats(statRes);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    loadAsync();

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, isMounted, searchQuery, typeFilter, selectedCategory, sortBy, sortOrder]);

  // Handlers
  const handleSaveTransaction = async (data: CreateTransactionInput) => {
    try {
      if (editingTransaction) {
        await api.updateTransaction(editingTransaction.id, data);
        toast.success('Transaction record updated');
      } else {
        await api.createTransaction(data);
        toast.success('New transaction logged successfully');
      }
      setEditingTransaction(null);
      await fetchDashboardData();
    } catch {
      toast.error('Failed to save transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      toast.success('Transaction deleted');
      await fetchDashboardData();
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const handleStatusToggle = async (tx: TransactionItem) => {
    try {
      const nextStatus = tx.status === 'cleared' ? 'pending' : 'cleared';
      await api.updateTransaction(tx.id, { status: nextStatus });
      toast.info(`Status updated to ${nextStatus}`);
      await fetchDashboardData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleBatchAction = async (
    ids: string[],
    action: 'delete' | 'mark_cleared' | 'mark_pending'
  ) => {
    try {
      await api.batchOperation({ ids, action });
      toast.success(`Batch ${action.replace('_', ' ')} completed`);
      await fetchDashboardData();
    } catch {
      toast.error('Batch operation failed');
    }
  };

  const handleCreateCategory = async (input: {
    name: string;
    type: TransactionType;
    color: string;
    monthlyBudget?: number;
  }) => {
    try {
      await api.createCategory(input);
      toast.success(`Category "${input.name}" created`);
      await fetchDashboardData();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      toast.success('Category removed');
      await fetchDashboardData();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const { blob, filename } = await api.exportData(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported data as ${filename}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const openTxModal = (type?: 'expense' | 'income', txToEdit?: TransactionItem) => {
    if (txToEdit) {
      setEditingTransaction(txToEdit);
      setTxModalDefaultType(txToEdit.type);
    } else {
      setEditingTransaction(null);
      setTxModalDefaultType(type || 'expense');
    }
    setIsTxModalOpen(true);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f0f2f6] text-slate-900 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 animate-pulse">
          <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <span>Initializing SpendFlow Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-background text-foreground flex flex-col font-sans">
      <Header
        onOpenTransactionModal={(type) => openTxModal(type)}
        onOpenCategoryModal={() => setIsCatModalOpen(true)}
        onStartTour={() => startSpendFlowTour()}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenTransactionModal={(type) => openTxModal(type)}
            onOpenCategoryModal={() => setIsCatModalOpen(true)}
            onExport={handleExport}
          />

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-8">
            {/* KPI Metrics & Virtual Credit Card Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Net Liquidity Available Reserve Display */}
              <div id="tour-net-liquidity">
                <MetricCard
                  title={t.netLiquidity}
                  amount={stats?.totalBalance ?? 0}
                  icon={Wallet}
                  isMainBalanceCard={true}
                />
              </div>

              <MetricCard
                title={t.grossIncome}
                amount={stats?.monthlyIncome ?? 0}
                subtext={t.salaryEarnings}
                icon={ArrowUpRight}
                trend={{ value: 24, isPositive: true }}
                badgeColor="text-emerald-700 bg-emerald-50 border-emerald-200"
              />

              <MetricCard
                title={t.monthlyExpenditures}
                amount={stats?.monthlyExpenses ?? 0}
                subtext={t.operatingExpenses}
                icon={ArrowDownLeft}
                trend={{ value: -42, isPositive: false }}
                badgeColor="text-rose-700 bg-rose-50 border-rose-200"
              />
            </div>

            {/* Views switching based on Active Tab */}
            {activeTab === 'overview' && (
              <>
                <SpendingCharts
                  categoryBreakdown={stats?.categoryBreakdown || []}
                  monthlyTrends={stats?.monthlyTrends || []}
                  transactions={transactions}
                />
                <BudgetOverview
                  categories={categories}
                  onOpenCategoryModal={() => setIsCatModalOpen(true)}
                />
                <TransactionList
                  transactions={transactions}
                  categories={categories}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  onEdit={(tx) => openTxModal(tx.type, tx)}
                  onDelete={handleDeleteTransaction}
                  onStatusToggle={handleStatusToggle}
                  onBatchAction={handleBatchAction}
                  onOpenTransactionModal={(type) => openTxModal(type)}
                />
              </>
            )}

            {activeTab === 'expenses' && (
              <TransactionList
                transactions={transactions.filter((t) => t.type === 'expense')}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter="expense"
                setTypeFilter={setTypeFilter}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onEdit={(tx) => openTxModal('expense', tx)}
                onDelete={handleDeleteTransaction}
                onStatusToggle={handleStatusToggle}
                onBatchAction={handleBatchAction}
                onOpenTransactionModal={() => openTxModal('expense')}
              />
            )}

            {activeTab === 'income' && (
              <TransactionList
                transactions={transactions.filter((t) => t.type === 'income')}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter="income"
                setTypeFilter={setTypeFilter}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onEdit={(tx) => openTxModal('income', tx)}
                onDelete={handleDeleteTransaction}
                onStatusToggle={handleStatusToggle}
                onBatchAction={handleBatchAction}
                onOpenTransactionModal={() => openTxModal('income')}
              />
            )}

            {activeTab === 'budgets' && (
              <BudgetOverview
                categories={categories}
                onOpenCategoryModal={() => setIsCatModalOpen(true)}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <TransactionModal
        key={editingTransaction ? editingTransaction.id : txModalDefaultType}
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        initialData={editingTransaction}
        defaultType={txModalDefaultType}
      />

      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <InteractiveTour autoStartOnFirstVisit={isAuthenticated} />

      {/* Mandatory Auth Modal Overlay */}
      {!isAuthenticated && !isAuthLoading && (
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          forceAuth={true}
        />
      )}
    </div>
  );
}
