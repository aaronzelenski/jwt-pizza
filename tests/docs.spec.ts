import { test, expect } from 'playwright-test-coverage';

test('Navigate to docs', async ({ page }) => {
await page.goto('http://localhost:5173/docs');
await expect(page.getByText('JWT Pizza API')).toBeVisible();
await expect(page.getByRole('heading', { name: '[POST] /api/auth' })).toBeVisible();
await expect(page.getByRole('heading', { name: '[PUT] /api/auth', exact: true })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/auth/:userId' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [DELETE] /api/auth' })).toBeVisible();
await expect(page.getByRole('heading', { name: '[GET] /api/order/menu' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [PUT] /api/order/menu' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [GET] /api/order' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [POST] /api/order' })).toBeVisible();
await expect(page.getByRole('heading', { name: '[GET] /api/franchise', exact: true })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [GET] /api/franchise/:' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [POST] /api/franchise', exact: true })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [DELETE] /api/franchise/:franchiseId', exact: true })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [POST] /api/franchise/:' })).toBeVisible();
await expect(page.getByRole('heading', { name: '🔐 [DELETE] /api/franchise/:franchiseId/store/:storeId' })).toBeVisible();
});