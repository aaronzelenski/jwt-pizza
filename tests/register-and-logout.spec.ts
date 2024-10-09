import { test, expect } from 'playwright-test-coverage';

test('Register a new user and logout', async ({ page }) => {

  
  // Mock the registration
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'POST') {
      const requestPayload = route.request().postDataJSON();
      const expectedRegisterReq = { name: 'Johnny Appleseed', email: 'johnnyb@test.com', password: 'j' };
      const mockRegisterRes = {
        user: { id: 1, name: 'Johnny Appleseed', email: 'johnnyb@test.com', roles: [{ role: 'diner' }] },
        token: 'jwt-token',
      };

      expect(requestPayload).toMatchObject(expectedRegisterReq);
      await route.fulfill({ json: mockRegisterRes });
    } else {
      const logoutRes = { user: null, token: null };
      await route.fulfill({ json: logoutRes });
    }
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  
  await page.getByPlaceholder('Full name').fill('Johnny Appleseed');
  await page.getByPlaceholder('Email address').fill('johnnyb@test.com');
  await page.getByPlaceholder('Password').fill('j');
  
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText("The web's best pizza", { exact: true })).toBeVisible();

  await expect(page.getByRole('link', { name: 'JA' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});
