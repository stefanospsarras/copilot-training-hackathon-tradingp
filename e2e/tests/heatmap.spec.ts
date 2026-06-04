import { expect, test } from '@playwright/test';

test('updates a heatmap cell inline', async ({ page }) => {
  await page.goto('/heatmap');

  const cell = page.getByTestId('heatmap-cell-e1-s2');
  await cell.click();
  await page.getByTestId('heatmap-editor-e1-s2').selectOption('5');

  await expect(cell).toContainText('5');
  await expect(cell).toHaveCSS('background-color', 'rgb(74, 222, 128)');
});
