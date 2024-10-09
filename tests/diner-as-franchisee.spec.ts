import { test, expect } from 'playwright-test-coverage';

test('diner dashboard as franchisee', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {

    const loginReq = { email: 'franchisee@email.com', password: 'f' };
    const loginRes = { user: { id: 4, name: 'pizza franchisee', email: 'franchisee@email.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef' };

    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);

    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('franchisee@email.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('f');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

  await page.getByRole('link', { name: 'pf', exact: true }).click();

  
  await expect(page.getByRole('heading', { name: 'Your pizza kitchen' })).toBeVisible();
  await expect(page.getByText('Franchisee on')).toBeVisible();
});
