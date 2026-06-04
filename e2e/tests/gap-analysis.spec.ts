import { expect, test } from '@playwright/test';

test('shows sorted gap analysis data', async ({ page }) => {
  await page.goto('/gap-analysis');

  const rows = page.locator('tbody tr');
  await expect(rows.first()).toBeVisible();
  await expect(rows.first()).toContainText('React');
  await expect(rows.first()).toContainText('1');
  await expect(rows.nth(1)).toContainText('PostgreSQL');
});
