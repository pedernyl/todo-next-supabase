
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
  await page.waitForSelector('form button[type="submit"]');
  await page.click('form button[type="submit"]');
    // Check that the new todo appears in the list
    await expect(page.locator('text=Playwright Todo')).toBeVisible();
  });

  // test('should delete a todo', async ({ page }) => {
  //   await page.goto(BASE_URL);
  //   await page.pause(); // Pause for interactive debugging
  //   // Find the todo container <li> by its text
  // const todoItem = page.locator('li:has-text("Playwright Todo")').first();
  // await expect(todoItem).toBeVisible();
  // // Click 'Show Description' within this todo
  // await todoItem.getByText('Show Description').click();
  // // Wait for animation/expansion
  // await page.waitForTimeout(300);
  // // Click the 'Delete' link within the expanded description
  // const deleteLink = todoItem.locator('a', { hasText: 'Delete' });
  // console.log('Delete link locator:', await deleteLink.evaluateAll(el => el.map(e => e.outerHTML)));
  // await expect(deleteLink).toBeVisible();
  // await deleteLink.scrollIntoViewIfNeeded();
  // await expect(deleteLink).toBeEnabled();
  // await page.pause(); // Pause for interactive debugging
  // await deleteLink.click({ force: true });
  //   await page.waitForTimeout(300);
  //
  // // Confirm deletion dialog
  // await page.click('button:has-text("OK")');
  // // Wait for the todo to be removed
  // await expect(todoItem).not.toBeVisible();
  // });
});
