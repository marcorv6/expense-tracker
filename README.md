# SpendFlow - Full-Stack Personal Expense & Financial Tracker

SpendFlow is a high-performance full-stack personal finance and expense management platform built with Next.js 16 App Router, serverless PostgreSQL on Neon, JWT authentication, internationalization (i18n multi-currency), and audited REST API specifications.

## Features
- **Cashflow Management**: Track income & expense records with category color-coding, payment methods, and status tags (cleared vs pending).
- **Monthly Budget Targets**: Define monthly spending limits by category with real-time percentage progress bars and warning alerts (>80%, >100%).
- **Financial Analytics**: High-level KPI metric summary (Net Liquidity, Monthly Income, Expenditures, Savings Rate %) + custom responsive SVG wave charts.
- **Internationalization (i18n)**: Switch between 8 currencies (`USD`, `EUR`, `GBP`, `MXN`, `CAD`, `JPY`, `BRL`, `AUD`) and 5 languages (`EN`, `ES`, `FR`, `DE`, `PT`).
- **Dual API Layer**: Serverless PostgreSQL (Neon) database queries + local fallback mock client for immediate offline/demo access.
- **Interactive Recruiter Mode**: 1-Click Demo Guest sign-in pre-populated with realistic financial data.
- **Exporting**: Instant export of transactions register to `.CSV` and `.JSON`.

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Sonner.
- **Backend & DB**: Next.js API Routes (`/api/v1/...`), Neon PostgreSQL (`@neondatabase/serverless`), JWT (`jsonwebtoken`, `bcryptjs`).
- **Contracts**: OpenAPI 3.0 specification (`contracts/openapi.yaml`) & SQL schema (`database/schema.sql`).

## License
Released under the open-source [MIT License](LICENSE).
