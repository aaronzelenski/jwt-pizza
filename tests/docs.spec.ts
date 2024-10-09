import { test, expect } from 'playwright-test-coverage';

test('Navigate to docs', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByText('JWT Pizza API')).toBeVisible();
});