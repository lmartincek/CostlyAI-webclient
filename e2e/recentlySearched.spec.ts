import { test, expect } from '@playwright/test';

test.describe('Signup Modal', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should render products if clicked on card', async ({ page }) => {
    await expect(page.locator('.recently-searched__wrapper .card__text').first()).toBeVisible();

    await page.click('.recently-searched__wrapper .card__text');

    await expect(page.locator('.wrapper-data__table')).toBeVisible();
  });
})
