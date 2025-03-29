import { test, expect } from '@playwright/test';

test.describe('Nomad Communities Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/communities');
  });

  test('should load more communities on scroll', async ({ page }) => {
    const initialCount = await page.locator('.list-item').count();
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const newCount = await page.locator('.list-item').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should toggle filter visibility on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 479, height: 800 });
    const toggleButton = page.locator('.toggle-filter');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
    await expect(page.locator('.communities-wrapper__inputs')).toHaveClass(/scrolled-up/);
  });
});
