import {expect, test} from "@playwright/test";

test.describe('Search costs logic with inputs', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should roll down suggestions in countries', async ({ page }) => {
    await expect(page.getByPlaceholder('Vietnam')).toBeVisible();
    await page.getByPlaceholder('Vietnam').fill('Slo')

    await expect(page.locator('.suggestions-list')).toBeVisible();
  });

  test('should show selected country products', async ({ page }) => {
    await expect(page.getByPlaceholder('Vietnam')).toBeVisible();
    await expect(page.getByPlaceholder('Hanoi')).toBeDisabled();

    await page.getByPlaceholder('Vietnam').fill('Slovakia')
    await page.click('.suggestions-list li')
    await expect(page.getByPlaceholder('Vietnam')).toHaveValue('Slovakia')
    await expect(page.getByPlaceholder('Hanoi')).not.toBeDisabled();
    await expect(page.locator('.suggestions-list')).not.toBeVisible();

    await page.click('.wrapper-control__button')
    await expect(page.locator('.spinner')).toBeVisible()
    await expect(page.locator('.table-wrapper').nth(1)).toBeVisible()
  });

  test('should show selected country with city products', async ({ page }) => {
    await expect(page.getByPlaceholder('Vietnam')).toBeVisible();
    await page.getByPlaceholder('Vietnam').fill('Australia')
    await page.click('.suggestions-list li')
    await expect(page.getByPlaceholder('Vietnam')).toHaveValue('Australia')
    await expect(page.locator('.suggestions-list')).not.toBeVisible();

    await expect(page.getByPlaceholder('Hanoi')).not.toBeDisabled();
    await page.getByPlaceholder('Hanoi').fill('Sydney')
    await page.click('.suggestions-list li')
    await expect(page.getByPlaceholder('Hanoi')).toHaveValue('Sydney')

    await page.click('.wrapper-control__button')
    await expect(page.locator('.spinner')).toBeVisible()
    await expect(page.locator('.table-wrapper').nth(1)).toBeVisible()
  });
})
