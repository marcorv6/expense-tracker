#!/usr/bin/env bash
# SpendFlow Harness Initialization & Verification Script

set -e

echo "=== 🚀 SpendFlow Agent Harness Initializer ==="

# 1. Environment & Tools Verification
echo "[1/4] Checking Node.js and NPM environment..."
node -v
npm -v

# 2. Dependencies Check
if [ ! -d "node_modules" ]; then
  echo "Installing project dependencies..."
  npm ci
fi

# 3. Master Verification Execution
echo "[2/4] Running Vitest Unit Test Suite & Coverage..."
npm run test:coverage

echo "[3/4] Running ESLint Code Quality Gate..."
npm run lint

echo "[4/4] Building Next.js Production Bundle..."
npm run build

echo "=== ✅ All Agent Verification Gates Passed Successfully! ==="
