import { test, expect } from 'playwright-test-coverage';

test('Diner Dashboard navigation', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'admin@test.com', password: 'a' };
    const loginRes = { user: { id: 1, name: 'admin', email: 'admin@test.com', roles: [{ role: 'admin' }] }, token: 'admin-token1' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  // need to have a store in the list of stores to choose from 
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 1,
        name: 'PizzaCorp',
        stores: [
          { id: 1, name: 'Lehi' },
          { id: 2, name: 'Springville' },
          { id: 3, name: 'American Fork' },
        ],
      },
      { id: 2, name: 'LotaPizza', stores: [{ id: 4, name: 'Spanish Fork' }] },
      { id: 3, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('admin@test.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'a', exact: true }).click();
  await expect(page.getByText('Your pizza kitchen')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' })).toBeVisible();
  await page.getByRole('link', { name: 'a', exact: true }).click();
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();

  await page.getByRole('link', { name: 'Buy one' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});