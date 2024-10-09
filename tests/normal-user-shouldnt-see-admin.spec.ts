import { test, expect } from 'playwright-test-coverage';

test('normal user shouldnt see admin tab', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'admin@test.com', password: 'a' };
    const loginRes = { user: { id: 1, name: 'admin', email: 'fakeadmin@test.com', roles: [{ role: 'diner' }] }, token: 'admin-token1' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('admin@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'a', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();

});