import { test, expect } from 'playwright-test-coverage';

test('Use admin to create a franchise', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('azelenski123@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('Bearcats123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('pizzaDAO');
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('pizzadao@test.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'pizzaDAO' }).first()).toBeVisible();
  await page.getByRole('row', { name: 'pizzaDAO pizzaDAO Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('pizzaDAO')).not.toBeVisible();
});