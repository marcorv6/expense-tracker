import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 75,
        functions: 60,
        branches: 60,
        statements: 75,
      },
      include: [
        'components/**/*.{ts,tsx}',
        'lib/i18n/**/*.{ts,tsx}',
        'lib/constants/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/**',
        '.next/**',
        'scripts/**',
        'components/InteractiveTour.tsx',
        'components/OnboardingTutorial.tsx',
        'components/AuthModal.tsx',
        'components/theme-provider.tsx',
        '**/*.d.ts',
        '**/*.config.*',
        'vitest.setup.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './'),
    },
  },
});
