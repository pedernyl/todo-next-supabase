import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// test.describe('Category E2E', () => {
//   test('should create a new category', async ({ page }) => {
//     await page.goto(BASE_URL);
//     // Open the category dropdown (adjust selector as needed)
//     await page.click('button:has-text("Category")');
//     // Click the 'Add Category' or similar option
//     await page.click('button:has-text("Add Category")');
//     // Fill in the title and description
//     await page.fill('input[name="category-title"]', 'Playwright Category');
//     await page.fill('textarea[name="category-description"]', 'Created by Playwright');
//     // Submit the form
//     await page.click('button:has-text("Save")');
//     // Check that the new category appears in the dropdown
//     await page.click('button:has-text("Category")');
//     await expect(page.locator('text=Playwright Category')).toBeVisible();
//   });
// });
