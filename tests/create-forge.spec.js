import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5174'

async function loginAsDev(page) {
  // Go to login page and log in with dev account
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  // Fill email input
  const emailInput = page.locator('input[placeholder*="DeinName"], input[type="email"], input[placeholder*="Email"]').first()
  await emailInput.waitFor({ timeout: 5000 })
  await emailInput.fill('dev@mindforge.dev')

  // Fill password
  const passwordInput = page.locator('input[type="password"]').first()
  await passwordInput.fill('dev1234')

  // Submit
  await page.locator('button[type="submit"]').click()

  // Wait for redirect
  await page.waitForURL('**/', { timeout: 10000 })
  await page.waitForTimeout(500)
}

test.describe('Create Page - Forge KI', () => {
  test('should show Forge KI chat interface with welcome message', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
    const page = await context.newPage()

    await loginAsDev(page)
    await page.goto(`${BASE}/create`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Check for Forge KI header
    await expect(page.locator('text=Forge KI').first()).toBeVisible({ timeout: 10000 })

    // Check for welcome text
    await expect(page.locator('text=Willkommen in der Schmiede').first()).toBeVisible({ timeout: 10000 })

    await context.close()
  })

  test('should show quick start chips and code editor tabs', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
    const page = await context.newPage()

    await loginAsDev(page)
    await page.goto(`${BASE}/create`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Suggestion chips
    await expect(page.locator('button:has-text("Quiz")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Memory")')).toBeVisible({ timeout: 10000 })

    // Chat input
    await expect(page.locator('textarea[placeholder*="Beschreibe"]')).toBeVisible({ timeout: 10000 })

    // File tabs
    await expect(page.locator('button:has-text("index.html")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("style.css")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("script.js")')).toBeVisible({ timeout: 10000 })

    await context.close()
  })

  test('should show top bar and open metadata panel', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
    const page = await context.newPage()

    await loginAsDev(page)
    await page.goto(`${BASE}/create`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Top bar elements
    await expect(page.locator('button:has-text("Publish")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Metadaten")')).toBeVisible({ timeout: 10000 })

    // Open metadata panel
    await page.click('button:has-text("Metadaten")')
    await page.waitForTimeout(500)
    await expect(page.locator('h2:has-text("Metadaten")')).toBeVisible({ timeout: 5000 })

    await context.close()
  })

  test('should NOT show old mode selector elements', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
    const page = await context.newPage()

    await loginAsDev(page)
    await page.goto(`${BASE}/create`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Old modes should be gone
    await expect(page.locator('text=Template-Modus')).not.toBeVisible()
    await expect(page.locator('text=Visual Builder')).not.toBeVisible()
    await expect(page.locator('text=ZIP Upload')).not.toBeVisible()

    await context.close()
  })
})
