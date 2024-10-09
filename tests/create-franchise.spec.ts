import { test, expect } from 'playwright-test-coverage';

test('Use admin to create a franchise', async ({ page }) => {
  // Mock authentication
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = { user: { id: 1, name: 'Admin User', roles: [{ role: 'admin' }] }, token: 'admin-token' };
    await route.fulfill({ json: loginRes });
  });

  // Mock franchise creation
  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const createFranchiseReq = { name: 'pizzaPocket', admins: [{ email: 'f@jwt.com' }] };
      const createFranchiseRes = { id: 1, name: 'pizzaPocket', admins: [{ email: 'f@jwt.com', id: 4, name: 'pizza franchisee' }] };
      await route.fulfill({ json: createFranchiseRes });
    } else if (route.request().method() === 'GET') {
      const franchisesRes = [
        { id: 1, name: 'pizzaPocket', admins: [{ name: 'pizza franchisee', email: 'f@jwt.com' }], stores: [{ name: 'SLC', totalRevenue: 0 }] }
      ];
      await route.fulfill({ json: franchisesRes });
    }
  });

  // Mock Franchisee deletion
  await page.route('*/**/api/franchise/1', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
    }
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').fill('pizzaPocket');
  await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('cell', { name: 'pizzaPocket' })).toBeVisible();
  
  // delete the franchise
  await page.getByRole('row', { name: 'pizzaPocket pizza franchisee' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.reload();
  await expect(page.getByRole('cell', { name: 'pizzaPocket' })).not.toBeVisible();

});
