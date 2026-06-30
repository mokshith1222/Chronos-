import { test, expect } from '@playwright/test';

test('marketing page loads and can navigate to dashboard', async ({ page }) => {
  // Go to marketing page
  await page.goto('/');
  
  // Verify heading exists
  await expect(page.locator('h1')).toContainText('Time tracking for the');
  
  // Click launch app button
  await page.click('text=Launch App');
  
  // Verify we are on dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('can start the timer and see it floating', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Click start timer button
  await page.click('text=Start Timer');
  
  // Verify the floating timer appears
  const timerInput = page.getByPlaceholder('What are you working on?');
  await expect(timerInput).toBeVisible();
  
  // Type a description
  await timerInput.fill('Playwright Test Task');
  
  // Click the stop timer button (square icon button next to input)
  await page.getByRole('button', { name: 'Stop timer' }).click();
  
  // Navigate to Timesheet to see if it was saved
  await page.goto('/time');
  
  // We should see the test task in the list
  await expect(page.locator('text=Playwright Test Task')).toBeVisible();
});
