import { test, expect } from 'playwright-test-coverage';

test('Admin views franchises and creates a new franchise', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const requestBody = route.request().postDataJSON();
    
    if (requestBody && requestBody.email === 'a@jwt.com') {
      const adminLoginRes = { 
        user: { id: 1, name: 'Admin User', roles: [{ role: 'admin' }] }, 
        token: 'admin-token' 
      };
      await route.fulfill({ json: adminLoginRes });
    }

    if (route.request().method() === 'DELETE') {
      const logoutRes = { user: null, token: null };
      await route.fulfill({ json: logoutRes });
    }
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'GET') {
      const franchisesRes = [
        { id: 1, name: 'pizzaPocket', admins: [{ name: 'Franchise User', email: 'f@jwt.com' }], stores: [] }
      ];
      await route.fulfill({ json: franchisesRes });
    }

    if (route.request().method() === 'POST') {
      const createFranchiseRes = { 
        id: 2, 
        name: 'pizzaHouse', 
        admins: [{ id: 2, name: 'New Franchisee', email: 'new@franchise.com' }] 
      };
      await route.fulfill({ json: createFranchiseRes });
    }
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('cell', { name: 'pizzaPocket' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').fill('pizzaHouse');
  await page.getByPlaceholder('franchisee admin email').fill('new@franchise.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.route('*/**/api/franchise', async (route) => {
    const franchisesRes = [
      { id: 1, name: 'pizzaPocket', admins: [{ name: 'Franchise User', email: 'f@jwt.com' }], stores: [] },
      { id: 2, name: 'pizzaHouse', admins: [{ name: 'New Franchisee', email: 'new@franchise.com' }], stores: [] }
    ];
    await route.fulfill({ json: franchisesRes });
  });

  await page.reload();
  await expect(page.getByRole('cell', { name: 'pizzaHouse' })).toBeVisible();

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('Franchisee creates a store', async ({ page }) => {
  // Log all network requests for debugging
  // await page.route('**', (route) => {
  //   console.log(`Request made to: ${route.request().method()} ${route.request().url()}`);
  //   route.continue();
  // });

  await page.route('**/api/auth', async (route) => {
    const requestBody = route.request().postDataJSON();

    if (requestBody && requestBody.email === 'f@jwt.com') {
      const franchiseeLoginRes = {
        user: {
          id: 4,
          name: 'Franchisee User',
          email: 'f@jwt.com',
          roles: [{ role: 'franchisee', objectId: 1 }],
        },
        token: 'franchise-token',
      };
      await route.fulfill({ json: franchiseeLoginRes });
    } else if (route.request().method() === 'DELETE') {
      // Mock logout
      const logoutRes = { user: null, token: null };
      await route.fulfill({ json: logoutRes });
    }
  });

  await page.route('**/api/franchise/**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method === 'GET') {
      if (url.match(/\/api\/franchise\/\d+$/)) {
        const franchisesRes = [
          {
            id: 1,
            name: 'pizzaPocket',
            admins: [{ id: 4, name: 'Franchisee User', email: 'f@jwt.com' }],
            stores: [],
          },
        ];
        await route.fulfill({ json: franchisesRes });
      }
    } else if (method === 'POST' && url.endsWith('/store')) {
      const createStoreRes = { id: 1, franchiseId: 1, name: 'Lehi Store' };
      await route.fulfill({ json: createStoreRes });
    }
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('f@jwt.com');
  await page.getByPlaceholder('Password').fill('franchise');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Franchise' }).nth(0).click();

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').fill('Lehi Store');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});
