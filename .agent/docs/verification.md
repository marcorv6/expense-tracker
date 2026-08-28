# Verification Guidelines & Quality Gates

## Overview
Every contribution to SpendFlow must pass automated verification before being merged or pushed to remote.

---

## 🚦 Verification Commands

### 1. Vitest Unit Test Suite
```bash
npm run test:coverage
```
- Executes all 38+ unit tests under `__tests__/`.
- Ensures 100% of test assertions pass.
- Validates V8 coverage report against threshold targets in `vitest.config.mts`.

### 2. ESLint Static Analysis
```bash
npm run lint
```
- Checks React Compiler purity rules, hook dependency arrays, unused variables, and type safety.

### 3. Next.js Production Build
```bash
npm run build
```
- Compiles TypeScript, verifies dynamic API routes, generates static page artifacts, and checks for SSR/hydration mismatches.

### 4. Master Pre-Push Verification Gate
```bash
npm run verify
```
- Runs `npm run test:coverage`, `npm run lint`, and `npm run build` in sequence.
- **MANDATORY**: Must exit with code 0 prior to any git commit or push.
