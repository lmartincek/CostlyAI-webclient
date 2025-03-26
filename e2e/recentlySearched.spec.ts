import { test, expect } from '@playwright/test';

test.describe('Recently searched places', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should render products if clicked on card', async ({ page }) => {
    await expect(page.locator('.recent-searches__card-wrapper .card').first()).toBeVisible();

    await page.click('.recent-searches__card-wrapper .card');

    await expect(page.locator('.wrapper-data__table')).toBeVisible();
  });
})
