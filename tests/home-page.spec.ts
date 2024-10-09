import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order now' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});