import {test, expect, Page} from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fillCredentials(page: Page) {
  await page.fill('#input-email', process.env.TEST_EMAIL);
  await page.fill('#input-password', process.env.TEST_PASSWORD);
}
test.describe('Signup modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('.wrapper__auth--login');
  });

  test('should render the modal with correct content', async ({ page }) => {
    await expect(page.locator('.modal-overlay')).toBeVisible();

    await expect(page.locator('.signup-wrapper__header h2')).toHaveText('Welcome to CostlyAI');
    await expect(page.locator('.signup-wrapper__header p')).toHaveText('Access personalized options');

    await expect(page.locator('.sign-in')).toHaveText('Sign In');
    await expect(page.locator('.sign-up')).toHaveText('Sign Up');
  });

  test('should switch between Sign In and Sign Up tabs', async ({ page }) => {
    await page.click('.sign-up');
    await expect(page.locator('.sign-up')).toHaveClass(/active/);

    await page.click('.sign-in');
    await expect(page.locator('.sign-in')).toHaveClass(/active/);
  });

  test('should validate email input', async ({ page }) => {
    await page.fill('#input-email', '');
    await page.click('button[type="submit"]');

    await expect(page.locator('.input-wrapper:has(#input-email) .error')).toContainText('Email is required');
    await page.fill('#input-email', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('.input-wrapper:has(#input-email) .error')).toContainText('Email is invalid');

    await page.fill('#input-email', 'valid@example.com');
    await expect(page.locator('.input-wrapper:has(#input-email) .error')).toBeHidden();
  });

  test('should validate password input', async ({ page }) => {
    await page.fill('#input-password', '');
    await page.click('button[type="submit"]');
    await expect(page.locator('.input-wrapper:has(#input-password) .error')).toContainText('Password is required');

    await page.click('.sign-up');
    await page.click('button[type="submit"]');

    const errors = page.locator('.input-wrapper:has(#input-password) .error')
    const count = await errors.count()
    for (let i = 0; i < count; ++i) {
      await expect(page.locator('.input-wrapper:has(#input-password) .error').nth(i)).not.toHaveClass('fulfilled');
    }

    await page.fill('#input-password', 'abcD1abc');
    for (let i = 0; i < count; ++i) {
      await expect(page.locator('.input-wrapper:has(#input-password) .error').nth(i)).toHaveClass('error fulfilled');
    }
  });

  test('should successfully login with credentials', async ({ page }) => {
    await fillCredentials(page)
    await page.click('button[type="submit"]');

    await expect(page.locator('.wrapper__auth--login')).not.toBeAttached()
    await expect(page.locator('.wrapper__auth--profile')).toBeVisible()
  });

  test('should validate email in use on signup', async ({ page }) => {
    await page.click('.sign-up');
    await fillCredentials(page)
    await page.click('button[type="submit"]');

    await expect(page.locator('.notification')).toHaveClass(/error/)
    await expect(page.locator('.wrapper__auth--login')).toBeVisible()
  });

  test('should close the modal when clicking outside or on the close button', async ({ page }) => {
    await page.mouse.click(10, 10);
    await expect(page.locator('.modal-overlay')).toBeHidden();

    await page.click('.wrapper__auth--login');

    await page.click('.close-button');
    await expect(page.locator('.modal-overlay')).toBeHidden();
  });
});
