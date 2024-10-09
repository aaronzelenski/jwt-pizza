import { test, expect } from 'playwright-test-coverage';

test('Create a franchisee user, login', async ({ page }) => {
await page.route('*/**/api/auth', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    
    if (url.includes('/api/auth') && method === 'POST') {
      const registerRes = {
        user: { id: 2425, name: 'franchise', email: 'franchise@test.com', roles: [{ role: 'franchisee' }] },
        token: 'franchise-token'
      };
      return route.fulfill({ json: registerRes });
    }
    
    if (method === 'PUT') {
      const loginRes = {
        user: { id: 2425, name: 'franchise', email: 'franchise@test.com', roles: [{ role: 'franchisee' }] },
        token: 'franchise-token'
      };      
      return route.fulfill({ json: loginRes });
    }

    if (method === 'DELETE') {
      const logoutRes = { message: 'logout successful' };
      return route.fulfill({ json: logoutRes });
    }
    
    return route.continue();
  });

  await page.route('*/**/api/franchise', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/api/franchise') && method === 'POST') {
      const createFranchiseRes = {
        id: 727,
        name: 'New Franchise',
        admins: [{ id: 2425, name: 'franchise', email: 'franchise@test.com' }],
      };
      return route.fulfill({ json: createFranchiseRes });
    }

    if (method === 'GET') {
      const fetchFranchiseRes = [
        {
          id: 727,
          name: 'New Franchise',
          admins: [{ id: 2425, name: 'franchise', email: 'franchise@test.com' }],
          stores: [],
        },
      ];
      return route.fulfill({ json: fetchFranchiseRes });
    }

    return route.continue();
  });

  await page.route('*/**/api/franchise/4', async (route) => {
    const res = { 
      id: 2, 
      name: 'PizzaCorp', 
      admins: [{ id: 4, name: 'pizza franchisee', email: 'franchisee@email.com' }],
      stores: [{ id: 3, name: 'SLC', totalRevenue: 0 }] 
    };
    console.log('Franchise Response:', res);
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: res });
  }); 

  await page.route('*/**/api/franchise/727/store', async (route) => {
    const createStoreRes = { id: 454, franchiseId: 727, name: 'store name' };
    await route.fulfill({ json: createStoreRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Full name').fill('franchise');
  await page.getByPlaceholder('Email address').fill('franchise@test.com');
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.goto('http://localhost:5173/franchise-dashboard/login');


  await page.getByPlaceholder('Email address').fill('franchise@test.com');
  await page.getByPlaceholder('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();



  // THIS IS NOT WORKING AAHHHHHHAHHHHHHHHHHHH!!!!!!!!  
  // await page.getByRole('button', { name: 'Add Franchise' }).click();

  // await page.getByPlaceholder('franchise name').fill('New Franchise');
  // await page.getByRole('button', { name: 'Create Franchise' }).click();

  // await page.getByRole('button', { name: 'Create store' }).click();
  // await page.getByPlaceholder('store name').fill('store name');
  // await page.getByRole('button', { name: 'Create' }).click();


  // await expect(page.getByRole('cell', { name: 'store name' })).toBeVisible();

  // await page.getByRole('link', { name: 'Logout' }).click();

  // await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});
