import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5180'

test.describe('Username Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto(BASE)
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
      localStorage.removeItem('mindforge_dev_firestore')
      localStorage.removeItem('mindforge_dev_credentials')
    })
  })

  test('login with username "TestPlayer" (test account)', async ({ page }) => {
    await page.goto(`${BASE}/login`)

    // Fill in username instead of email
    const identifierInput = page.locator('input[placeholder*="DeinName"]')
    await expect(identifierInput).toBeVisible({ timeout: 5000 })
    await identifierInput.fill('TestPlayer')

    // Fill password
    await page.locator('input[type="password"]').first().fill('test1234')

    // Click login
    await page.locator('button[type="submit"]').click()

    // Should redirect to home
    await page.waitForURL(`${BASE}/`, { timeout: 5000 })
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('login with username case-insensitive "testplayer"', async ({ page }) => {
    await page.goto(`${BASE}/login`)

    const identifierInput = page.locator('input[placeholder*="DeinName"]')
    await expect(identifierInput).toBeVisible({ timeout: 5000 })
    await identifierInput.fill('testplayer')

    await page.locator('input[type="password"]').first().fill('test1234')
    await page.locator('button[type="submit"]').click()

    await page.waitForURL(`${BASE}/`, { timeout: 5000 })
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('register new account, logout, then login with username', async ({ page }) => {
    // Step 1: Register
    await page.goto(`${BASE}/register`)

    const usernameInput = page.locator('input[placeholder*="MindForge"]').or(page.locator('input').nth(0))
    await expect(usernameInput.first()).toBeVisible({ timeout: 5000 })

    // Find the username, email, password, confirmPassword fields
    const inputs = page.locator('form input')
    const usernameField = inputs.nth(0)
    const emailField = inputs.nth(1)
    const passwordField = inputs.nth(2)
    const confirmField = inputs.nth(3)

    await usernameField.fill('NewTestUser')
    await emailField.fill('newuser@test.dev')
    await passwordField.fill('password123')
    await confirmField.fill('password123')

    // Submit registration
    await page.locator('button[type="submit"]').click()

    // Should redirect to home
    await page.waitForURL(`${BASE}/`, { timeout: 5000 })

    // Step 2: Logout
    // Navigate to a page with logout or clear session
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
    })
    await page.goto(`${BASE}/login`)

    // Step 3: Login with the new username
    const identifierInput = page.locator('input[placeholder*="DeinName"]')
    await expect(identifierInput).toBeVisible({ timeout: 5000 })
    await identifierInput.fill('NewTestUser')

    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('button[type="submit"]').click()

    // Should redirect to home
    await page.waitForURL(`${BASE}/`, { timeout: 5000 })
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('login with wrong username shows error', async ({ page }) => {
    await page.goto(`${BASE}/login`)

    const identifierInput = page.locator('input[placeholder*="DeinName"]')
    await expect(identifierInput).toBeVisible({ timeout: 5000 })
    await identifierInput.fill('NonExistentUser')

    await page.locator('input[type="password"]').first().fill('test1234')
    await page.locator('button[type="submit"]').click()

    // Should stay on login page and show an error
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/\/login/)
  })
})
