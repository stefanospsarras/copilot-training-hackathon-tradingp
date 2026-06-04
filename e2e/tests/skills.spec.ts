import { expect, test } from '@playwright/test';

test('adds and deletes a skill from the inventory', async ({ page }) => {
  const skillName = 'Playwright Skill';

  await page.goto('/skills');
  await page.getByTestId('skill-name-input').fill(skillName);
  await page.getByTestId('skill-category-input').fill('Testing');
  await page.getByTestId('skill-level-input').selectOption('4');
  await page.getByTestId('add-skill-button').click();

  await expect(page.getByText(skillName)).toBeVisible();
  const row = page.locator('tr', { hasText: skillName });
  await row.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(skillName)).toHaveCount(0);
});
