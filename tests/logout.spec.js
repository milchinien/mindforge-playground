import { test, expect } from '@playwright/test'

test('login and logout via settings', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="text"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })

  // Navigate to settings
  await page.goto('http://localhost:5173/settings')
  await expect(page.getByRole('heading', { name: /Settings|Einstellungen/i })).toBeVisible()

  // Click the Account & Security tab first
  const accountTab = page.getByRole('button', { name: /Account|Konto/i })
  await accountTab.click()

  // Find and click logout button
  const logoutButton = page.locator('button', { hasText: /Log out|Abmelden/ })
  await expect(logoutButton).toBeVisible()
  await logoutButton.click()

  // Should redirect to login page
  await page.waitForURL('**/login', { timeout: 5000 })
  await expect(page).toHaveURL(/\/login/)
})
