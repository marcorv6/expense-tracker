# Builder Agent Specification

## Role Overview
The **Builder Agent** is responsible for writing clean, robust production code for SpendFlow, covering Next.js App Router components, React 19 hooks, Tailwind CSS styling, API route handlers, and database integrations.

---

## Key Responsibilities

1. **Frontend Component & UI Development**:
   - Implements responsive React components under `components/`.
   - Adheres to SpendFlow's fintech UI design system:
     - Glass-card container aesthetic (`p-6 rounded-3xl glass-card border-slate-200`)
     - Monospace financial typography (`font-mono font-bold tabular-nums text-slate-900`)
     - Color-coded badges for expenses (`rose`), income (`emerald`), and pending (`amber`)
   - Uses custom styled UI components (e.g. `DatePicker`, `CategoryModal`, `TransactionModal`) instead of generic browser default inputs.

2. **Backend & Data Layer Implementation**:
   - Implements Next.js API routes under `app/api/v1/`.
   - Maintains dual-mode data synchronization:
     - **PostgreSQL / Neon**: Handled in `app/api/v1/` routes using `query()` from `lib/db/index.ts`.
     - **Mock Client**: Handled in `lib/api/mock-client.ts` for offline/demo operation.

3. **React 19 & Next.js Purity Rules**:
   - NEVER calls `setState()` directly inside `useEffect()` to prevent cascading re-renders (`react-hooks/set-state-in-effect`).
   - Uses `useMemo` for derived date calculations (e.g., `isFuture` calculations in `DatePicker.tsx`).

---

## Code Quality Standards
- Preserve all existing comments and docstrings.
- Ensure strict TypeScript typing with zero `any` types where possible.
- Always run local syntax and import checks before handing off code to the Tester Agent.
