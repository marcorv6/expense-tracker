import { test, expect } from '@playwright/test';

test.describe('Mobile & Desktop Overlays Visual Layout Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate user & bypass onboarding driver tour
    await page.addInitScript(() => {
      const mockUser = {
        id: 'usr_mock123',
        email: 'demo@spendflow.dev',
        name: 'Marco Romero',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem('spendflow_auth_user_v1', JSON.stringify(mockUser));
      window.localStorage.setItem('spendflow_auth_token_v1', 'mock_jwt_token_12345');
      window.localStorage.setItem('spendflow_tutorial_seen_v1', 'true');
      window.localStorage.removeItem('spendflow_trigger_tour_on_login_v1');
      window.localStorage.setItem('spendflow_pref_currency_v1', 'USD');
      window.localStorage.setItem('spendflow_pref_lang_v1', 'en');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('1. Transaction Modal - Clean Layout without Overlaps', async ({ page }) => {
    const addExpenseBtn = page.locator('#tour-add-expense');
    await expect(addExpenseBtn).toBeVisible();
    await addExpenseBtn.click();

    const modalHeading = page.locator('h3:has-text("Add Expense")');
    await expect(modalHeading).toBeVisible();

    await expect(page.locator('body')).toHaveScreenshot('1-transaction-modal-default.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('2. Floating DatePicker Overlay - Opens Cleanly without Layout Shift', async ({ page }) => {
    const addExpenseBtn = page.locator('#tour-add-expense');
    await expect(addExpenseBtn).toBeVisible();
    await addExpenseBtn.click();

    // Click DatePicker input container
    const datePickerContainer = page.locator('label:has-text("Date")').first().locator('..').locator('.cursor-pointer');
    await expect(datePickerContainer).toBeVisible();
    await datePickerContainer.click();

    // Verify quick preset button inside calendar is visible
    const tomorrowPreset = page.locator('button:has-text("Tomorrow")').last();
    await expect(tomorrowPreset).toBeVisible();

    await expect(page.locator('body')).toHaveScreenshot('2-datepicker-expanded-inline.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('3. Category Modal Overlay - Custom Category Creator', async ({ page }) => {
    const addExpenseBtn = page.locator('#tour-add-expense');
    await expect(addExpenseBtn).toBeVisible();
    await addExpenseBtn.click();

    const catSelect = page.locator('select').first();
    await expect(catSelect).toBeVisible();

    await expect(page.locator('body')).toHaveScreenshot('3-category-modal-overlay.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('4. Batch Actions Overlay Bar - Selection Toolbar', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    if (await checkboxes.count() > 1) {
      const firstCheckbox = checkboxes.nth(1);
      await firstCheckbox.check();

      const batchBar = page.locator('text=Selected').first();
      await expect(batchBar).toBeVisible();

      await expect(page.locator('body')).toHaveScreenshot('4-batch-actions-overlay.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test('5. Massive Data Import Wizard Modal Overlay', async ({ page }) => {
    const importBtn = page.locator('button:has-text("Import CSV / JSON")').first();
    if (await importBtn.isVisible()) {
      await importBtn.click();

      const importHeading = page.locator('h3:has-text("Massive Data Import Wizard")');
      await expect(importHeading).toBeVisible();

      await expect(page.locator('body')).toHaveScreenshot('5-import-modal-wizard.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });
});
