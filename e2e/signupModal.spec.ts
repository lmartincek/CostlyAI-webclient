import { test, expect } from '@playwright/test';

test.describe('Signup Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page where the modal can be triggered
    await page.goto('/');
    // Trigger the modal (e.g., by clicking a button that opens the modal)
    await page.click('.wrapper__auth--login');
  });

  test('should render the modal with correct content', async ({ page }) => {
    // Verify the modal is visible
    await expect(page.locator('.modal-overlay')).toBeVisible();

    // Verify the header text
    await expect(page.locator('.signup-wrapper__header h2')).toHaveText('Welcome to CostlyAI');
    await expect(page.locator('.signup-wrapper__header p')).toHaveText('Access personalized options');

    // Verify the "Sign In" and "Sign Up" tabs are present
    await expect(page.locator('.sign-in')).toHaveText('Sign In');
    await expect(page.locator('.sign-up')).toHaveText('Sign Up');
  });

  test('should switch between Sign In and Sign Up tabs', async ({ page }) => {
    // Click the "Sign Up" tab
    await page.click('.sign-up');
    await expect(page.locator('.sign-up')).toHaveClass(/active/);

    // Click the "Sign In" tab
    await page.click('.sign-in');
    await expect(page.locator('.sign-in')).toHaveClass(/active/);
  });

  test('should validate email input', async ({ page }) => {
    // Test empty email
    await page.fill('#email input', '');
    await page.click('button[type="submit"]');

    await expect(page.locator('.input-wrapper:has(#email) .error')).toContainText('Email is required');
    // Test invalid email
    await page.fill('#email input', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('.input-wrapper:has(#email) .error')).toContainText('Email is invalid');

    // Test valid email
    await page.fill('#email input', 'valid@example.com');
    await expect(page.locator('.input-wrapper:has(#email) .error')).toBeHidden();
  });

  test('should validate password input', async ({ page }) => {
    const errors = page.locator('.input-wrapper:has(#password) .error')
    const count = await errors.count()

    // Test empty password
    await page.fill('#password input', '');
    for (let i = 0; i < count; ++i) {
      await expect(page.locator('.input-wrapper:has(#password) .error').nth(i)).not.toHaveClass('fulfilled');
    }
    
    // Test password has at least 8 characters, 1 lowercase character, 1 uppercase character and one number
    await page.fill('#password input', 'abcD1abc');
    for (let i = 0; i < count; ++i) {
      await expect(page.locator('.input-wrapper:has(#password) .error').nth(i)).toHaveClass('error fulfilled');
    }
  });

  test('should close the modal when clicking outside or on the close button', async ({ page }) => {
    // Click outside the modal
    await page.mouse.click(10, 10);
    await expect(page.locator('.modal-overlay')).toBeHidden();

    // Reopen the modal
    await page.click('.wrapper__auth--login');

    // Click the close button
    await page.click('.close-button');
    await expect(page.locator('.modal-overlay')).toBeHidden();
  });
});
