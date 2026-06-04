import { expect, test } from '@playwright/test';

test('updates an engineer skill level and persists it', async ({ page }) => {
  await page.goto('/engineers');
  await page.getByRole('link', { name: 'View Profile' }).first().click();

  await page.getByTestId('profile-skill-s1').selectOption('4');
  await page.getByTestId('save-profile-button').click();
  await page.reload();

  await expect(page.getByTestId('profile-skill-s1')).toHaveValue('4');
});
