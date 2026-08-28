# Repository Navigation Map

This document outlines the directory structure, primary entry points, and component responsibilities within the **SpendFlow** codebase.

---

## 🗺️ Key Entry Points & Folders

### 1. Application Layer (`app/`)
- `app/layout.tsx`: Root Next.js layout providing font variables, theme provider, and global metadata.
- `app/page.tsx`: Primary dashboard page orchestrating financial metric cards, cashflow charts, budget overview, and transaction ledger.
- `app/api/v1/`: Next.js REST API routes:
  - `auth/login`, `auth/register`, `auth/logout`: User authentication & JWT tokens.
  - `transactions/`, `transactions/[id]`, `transactions/batch`: Transaction CRUD & batch ops.
  - `categories/`, `categories/[id]`: Expense & income categories management.
  - `stats/`: Financial dashboard summaries and monthly trends.
  - `export/`: CSV and JSON ledger exports.

### 2. UI Component Library (`components/`)
- `Header.tsx`: Top bar with logo, help tour trigger, currency selector, and language switcher.
- `Sidebar.tsx`: Navigation menu, active tab switcher, and category cap progress list.
- `MetricCard.tsx`: Reusable balance/expense/income card with credit card styling.
- `SpendingCharts.tsx`: Interactive SVG wave cashflow chart and category breakdown pie chart.
- `BudgetOverview.tsx`: Monthly category cap progress indicators.
- `TransactionList.tsx`: Transaction table with search, type/category filters, sorting, and batch actions.
- `TransactionCard.tsx`: Individual transaction item card with edit/delete/status controls.
- `TransactionModal.tsx`: Modal form for logging/editing transactions.
- `CategoryModal.tsx`: Modal form for adding/editing expense categories and budget caps.
- `DatePicker.tsx`: Custom fintech date picker with quick presets (`Today`, `Tomorrow`, `+1 Week`, `+1 Month`).
- `Footer.tsx`: Footer copyright and system version label.

### 3. Context & State (`context/`)
- `PreferencesContext.tsx`: Manages active currency (`USD`, `EUR`, `MXN`, etc.), language (`en`, `es`), and theme settings.
- `AuthContext.tsx`: Manages user authentication state, token storage, and guest demo mode.

### 4. Data Layer & Utilities (`lib/`)
- `lib/db/index.ts`: PostgreSQL / Neon database connection pool and parameterized `query()` helper.
- `lib/api/client.ts`: Main API client routing requests to real REST endpoints or mock fallback.
- `lib/api/mock-client.ts`: In-memory and `localStorage` mock data client for offline demo.
- `lib/i18n/translations.ts`: Translations dictionary and currency formatting functions.
- `lib/constants/storage.ts`: Centralized `localStorage` storage keys.

### 5. Automated Test Suite (`__tests__/`)
- `TransactionModal.test.tsx`, `CategoryModal.test.tsx`, `TransactionCard.test.tsx`, `TransactionList.test.tsx`, `DatePicker.test.tsx`, `SpendingCharts.test.tsx`, `Header.test.tsx`, `Sidebar.test.tsx`, `BudgetOverview.test.tsx`, `MetricCard.test.tsx`, `Footer.test.tsx`, `i18n.test.ts`, `storage.test.ts`.
