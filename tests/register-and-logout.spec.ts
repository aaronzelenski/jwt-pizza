import { test, expect } from 'playwright-test-coverage';

test('Register a new user and logout', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Full name').click();
  await page.getByPlaceholder('Full name').fill('Johnny Appleseed');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('johnny@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('j');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'JA' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});