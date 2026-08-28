# SpendFlow Multi-Agent Development Harness

Welcome to the **SpendFlow** repository. This document serves as the master operating manual and coordination harness for AI agents collaborating on the project.

---

## 🏗️ 4-Agent Team Architecture

Our development workflow is divided into four explicit, specialized agent roles:

```
                      +-------------------+
                      |   ORCHESTRATOR    |
                      | (Planner & Lead)  |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
     +---------------+                     +---------------+
     |    BUILDER    |                     |    TESTER     |
     | (Code & UI)   |                     | (Vitest & RTL)|
     +-------+-------+                     +-------+-------+
             |                                     |
             +------------------+------------------+
                                |
                                v
                      +-------------------+
                      |    COMMITTER      |
                      | (Verify & Push)   |
                      +-------------------+
```

---

### 1. 🎯 Orchestrator Agent (`.agent/roles/orchestrator.md`)
- **Primary Responsibility**: Requirements gathering, architectural design, task decomposition, and team workflow management.
- **Key Artifacts Managed**: `implementation_plan.md`, `.agent/feature_list.json`, `.agent/progress/current.md`.
- **Operating Guidelines**:
  - Reviews user requests and breaks down goals into unambiguous, actionable tasks.
  - Ensures changes align with SpendFlow architectural standards (PostgreSQL + Neon + Mock fallback, Tailwind CSS, clean TypeScript interfaces).
  - Coordinates execution between Builder, Tester, and Committer.

### 2. ⚡ Builder Agent (`.agent/roles/builder.md`)
- **Primary Responsibility**: Code implementation, component creation, API route handling, and state management.
- **Key Directories**: `components/`, `app/api/v1/`, `lib/`, `context/`, `types/`.
- **Operating Guidelines**:
  - Implements UI components with modern Tailwind CSS glass-card aesthetics (`rounded-3xl glass-card`, `font-mono`, `text-slate-900`).
  - Preserves dual-mode data layer integrity: PostgreSQL/Neon (`lib/db/`) and Mock offline fallback (`lib/api/mock-client.ts`).
  - Avoids synchronous `setState` in `useEffect` to adhere to React 19 / Next.js compiler purity rules.

### 3. 🧪 Tester Agent (`.agent/roles/tester.md`)
- **Primary Responsibility**: Unit test creation, Vitest execution, RTL matchers, and coverage enforcement.
- **Key Files**: `__tests__/*.test.tsx`, `vitest.config.mts`, `vitest.setup.ts`.
- **Operating Guidelines**:
  - Writes React Testing Library unit tests under `__tests__/` for all new and modified components.
  - Ensures 100% of test assertions pass.
  - Enforces coverage thresholds across lines, functions, statements, and branches using `npm run test:coverage`.

### 4. 🚀 Committer Agent (`.agent/roles/committer.md`)
- **Primary Responsibility**: Pre-push verification gate execution, code quality checks, clean git commits, and remote pushes.
- **Key Tooling**: `npm run verify` (`npm run test:coverage && npm run lint && npm run build`), `git status`, `git commit`.
- **Operating Guidelines**:
  - MUST run `npm run verify` before any git commit.
  - Inspects `git diff` to ensure zero unneeded files or temporary artifacts are committed.
  - Formats conventional commit messages (e.g. `feat(category): 🏷️ add general category`).
  - Pushes clean code directly to `origin main`.

---

## 🛠️ Verification & Pipeline Commands

All agents MUST use the standardized pipeline commands configured in `package.json`:

```bash
# Run unit test suite
npm run test

# Run unit tests with V8 coverage report
npm run test:coverage

# Run ESLint check
npm run lint

# Run Next.js production build
npm run build

# Master Verification Gate (MANDATORY BEFORE PUSH)
npm run verify
```

---

## 📂 Harness Directory Structure

```
.agent/
├── init.sh                  # Harness verification initializer script
├── navigation.md            # Repository structural map & entry points
├── feature_list.json        # Structured feature backlog and status
├── settings.json            # Harness configuration settings
├── checkpoints.md           # Work progress checkpoints
├── roles/
│   ├── orchestrator.md      # Role spec for Orchestrator Agent
│   ├── builder.md           # Role spec for Builder Agent
│   ├── tester.md            # Role spec for Tester Agent
│   └── committer.md         # Role spec for Committer Agent
├── progress/
│   ├── current.md           # Active iteration task state
│   └── history.md           # Completed task log
└── docs/
    ├── architecture.md      # System architecture & DB schemas
    ├── conventions.md       # Coding conventions & styling rules
    └── verification.md      # Testing and build verification guidelines
```
