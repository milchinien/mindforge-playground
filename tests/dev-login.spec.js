import { test, expect } from '@playwright/test'

test('login with dev test account', async ({ page }) => {
  await page.goto('http://localhost:5173/login')

  // Wait for the login form
  await expect(page.locator('h1')).toContainText('MindForge')

  // Fill in test credentials
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')

  // Click login button
  await page.click('button[type="submit"]')

  // Should redirect to home page after login
  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })

  // Verify we're logged in (no longer on login page)
  await expect(page).not.toHaveURL(/\/login/)
})
