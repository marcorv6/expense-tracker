# SpendFlow System Architecture

## Overview
SpendFlow is a modern full-stack personal finance and expense tracking application built on **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Vitest**, and **PostgreSQL / Neon**.

---

## 🏛️ Architectural Principles

### 1. Dual-Mode Data Layer Strategy
SpendFlow operates seamlessly in two environments:
- **Production Mode**: Next.js API routes (`app/api/v1/`) query PostgreSQL database hosted on **Neon Lakebase Postgres** via `lib/db/index.ts`.
- **Offline / Recruiter Demo Mode**: When running without backend credentials, `lib/api/mock-client.ts` uses `localStorage` to simulate full CRUD persistence, batch transactions, custom categories, and dashboard metrics.

### 2. Automatic Future-Date Pending Logic
- Any transaction logged with a future date (`date > now`) automatically receives a `status: 'pending'`.
- Whenever transactions are requested via API (`GET /api/v1/transactions` or `mockApiClient.getTransactions`), pending transactions whose future date has arrived are automatically updated to `status: 'cleared'`.

### 3. Fintech Design System
- UI components use glassmorphic cards (`glass-card bg-white/90 backdrop-blur-xl border-slate-200`).
- Strict typography rules: Monospace tabular numbers (`font-mono tabular-nums`) for currency amounts to prevent visual layout shifts.
- Color coding:
  - Income / Positive: `emerald-500`
  - Expense / Negative: `slate-900` / `rose-500`
  - Pending Status: `amber-500` / `amber-50`
