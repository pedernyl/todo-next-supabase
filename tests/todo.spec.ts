
import { test, expect } from '@playwright/test';

// Use authentication state for all tests in this file
test.use({ storageState: 'storageState.json' });

// Adjust the URL if your dev server runs on a different port
const BASE_URL = 'http://localhost:3000';

test.describe('Todo App E2E', () => {
  test('should create a new todo', async ({ page }) => {
    await page.goto(BASE_URL);
    // Click 'Add Todo' link to reveal the form
    await page.click('text=Add Todo');
    // Now click the 'Add Todo' button if needed (remove if not present)
    // await page.click('button:has-text("Add Todo")');
    // Fill in the title and description
    await page.fill('input[name="title"]', 'Playwright Todo');
    await page.fill('textarea[name="description"]', 'Created by Playwright');
    // Submit the form
    await page.click('button:has-text("Add Todo")');
    // Check that the new todo appears in the list
    await expect(page.locator('text=Playwright Todo')).toBeVisible();
  });

  // test('should delete a todo', async ({ page }) => {
  //   await page.goto(BASE_URL);
  //   // Find the todo by text and click its delete button (adjust selector as needed)
  //   const todo = page.locator('text=Playwright Todo');
  //   await expect(todo).toBeVisible();
  //   // Click the delete button (adjust selector to match your UI)
  //   await todo.locator('button[aria-label="Delete"]').click();
  //   // Confirm deletion if prompted
  //   // await page.click('button:has-text("Confirm")'); // Uncomment if you have a confirm dialog
  //   // Check that the todo is gone
  //   await expect(page.locator('text=Playwright Todo')).not.toBeVisible();
  // });
});
