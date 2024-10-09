import { test, expect } from 'playwright-test-coverage';

test('Create a new store within a franchise', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByPlaceholder('Email address').fill('franchise@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('f');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Create store' }).click({ timeout: 5000 });

  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('store name');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'store name' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).first().click();

  await page.getByRole('combobox').selectOption('store name');
  await page.locator('.min-w-32 > .flex').first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

});