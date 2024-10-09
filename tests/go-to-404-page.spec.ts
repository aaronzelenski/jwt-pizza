import { test, expect } from 'playwright-test-coverage';

test('constant pages', async ({ page }) => {
  await page.goto('/');
  await page.goto('/non-existing-page');
  await expect(page.locator('h2')).toContainText('Oops');
  await expect(page.getByText('It looks like we have dropped')).toBeVisible();
});