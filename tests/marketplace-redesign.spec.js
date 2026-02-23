// @ts-check
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

test.describe('Marketplace Redesign', () => {
  test('marketplace page loads with sidebar and grid layout', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Page title from Layout
    await expect(page.locator('text=Marketplace').first()).toBeVisible()

    // Sidebar category section header
    await expect(page.locator('aside h3:has-text("Kategorie")')).toBeVisible()

    // Sidebar price section header
    await expect(page.locator('aside h3:has-text("Preis")')).toBeVisible()
  })

  test('sidebar shows all category filters', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Category buttons in sidebar
    await expect(page.locator('aside button:has-text("Alle")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Huete")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Haare")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Accessoires")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Kleidung")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Hintergrund")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Gesicht")').first()).toBeVisible()
  })

  test('sidebar shows price filters', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await expect(page.locator('aside button:has-text("Alle Items")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Kostenlos")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Premium")').first()).toBeVisible()
  })

  test('search bar is visible and functional', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    const searchInput = page.locator('input[placeholder="Items durchsuchen..."]')
    await expect(searchInput).toBeVisible()

    // Search for a hat
    await searchInput.fill('Krone')
    await page.waitForTimeout(300)

    // Should show only Krone
    await expect(page.locator('text=Krone').first()).toBeVisible()
    // Result count should be shown
    await expect(page.locator('text=/1 Item/')).toBeVisible()
  })

  test('search shows relevant results', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    const searchInput = page.locator('input[placeholder="Items durchsuchen..."]')
    await searchInput.fill('Baseball')
    await page.waitForTimeout(300)

    await expect(page.locator('text=Baseball Cap').first()).toBeVisible()
  })

  test('search can be cleared', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    const searchInput = page.locator('input[placeholder="Items durchsuchen..."]')
    await searchInput.fill('Krone')
    await page.waitForTimeout(300)

    // Click the X button to clear
    await page.locator('input[placeholder="Items durchsuchen..."] + button').click()
    await page.waitForTimeout(300)

    // Search should be empty, all items visible again
    await expect(searchInput).toHaveValue('')
  })

  test('category filter works - hats', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Click Huete in sidebar
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(500)

    // Hat items should be visible
    await expect(page.locator('text=Baseball Cap').first()).toBeVisible()
    await expect(page.locator('text=Krone').first()).toBeVisible()

    // Results label should mention Huete
    await expect(page.locator('text=/Items in Huete/')).toBeVisible()
  })

  test('category filter works - accessories', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await page.locator('aside button:has-text("Accessoires")').first().click()
    await page.waitForTimeout(500)

    await expect(page.locator('text=Brille').first()).toBeVisible()
    await expect(page.locator('text=Sonnenbrille').first()).toBeVisible()
  })

  test('price filter - kostenlos shows only free items', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Click Kostenlos in sidebar
    await page.locator('aside button:has-text("Kostenlos")').first().click()
    await page.waitForTimeout(500)

    // Should have some gratis items
    await expect(page.locator('span:has-text("Gratis")').first()).toBeVisible()

    // Results label should mention Kostenlos
    await expect(page.locator('p:has-text("(Kostenlos)")')).toBeVisible()
  })

  test('price filter - premium shows only paid items', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Click Premium in sidebar
    await page.locator('aside button:has-text("Premium")').first().click()
    await page.waitForTimeout(500)

    // Results label should mention Premium
    await expect(page.locator('p:has-text("(Premium)")')).toBeVisible()

    // Krone (500 MC) should be visible
    await expect(page.locator('text=Krone').first()).toBeVisible()
  })

  test('combined filters: category + price', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Select Huete category
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)

    // Select Kostenlos price filter
    await page.locator('aside button:has-text("Kostenlos")').first().click()
    await page.waitForTimeout(300)

    // Should show only free hats (Baseball Cap, Beanie)
    await expect(page.locator('text=Baseball Cap').first()).toBeVisible()
    await expect(page.locator('text=Beanie').first()).toBeVisible()

    // Premium hats should NOT be visible
    await expect(page.locator('button:has-text("Krone")')).toHaveCount(0)
  })

  test('sort dropdown is present', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    const sortDropdown = page.locator('select[aria-label="Sortierung"]')
    await expect(sortDropdown).toBeVisible()

    await sortDropdown.selectOption('price-desc')
    await page.waitForTimeout(300)
  })

  test('clicking item opens detail modal', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await page.locator('button:has-text("Baseball Cap")').first().click()
    await page.waitForTimeout(500)

    // Modal with item name
    await expect(page.locator('h2:has-text("Baseball Cap")')).toBeVisible()
    // Avatar preview
    await expect(page.locator('text=Aktuell')).toBeVisible()
    await expect(page.locator('text=Vorschau')).toBeVisible()
  })

  test('premium item shows price in modal', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Click on Huete, then Krone
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)

    await expect(page.locator('text=500 MC').first()).toBeVisible()
    await expect(page.locator('text=Dein Guthaben')).toBeVisible()
  })

  test('modal closes on Escape', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await page.locator('button:has-text("Baseball Cap")').first().click()
    await page.waitForTimeout(500)
    await expect(page.locator('h2:has-text("Baseball Cap")')).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(page.locator('h2:has-text("Baseball Cap")')).toHaveCount(0)
  })

  test('no old asset types visible', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await expect(page.locator('button:has-text("3D-Modell")')).toHaveCount(0)
    await expect(page.locator('button:has-text("Textur")')).toHaveCount(0)
    await expect(page.locator('button:has-text("Audio")')).toHaveCount(0)
    await expect(page.locator('button:has-text("Script")')).toHaveCount(0)
  })

  test('items have prices - some hair and clothing cost MindCoins', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // Filter to premium only
    await page.locator('aside button:has-text("Premium")').first().click()
    await page.waitForTimeout(500)

    // Filter to hair
    await page.locator('aside button:has-text("Haare")').first().click()
    await page.waitForTimeout(300)

    // Some hair styles should have prices now
    await expect(page.locator('text=Irokese').first()).toBeVisible()
  })

  test('MindCoin balance is shown in header', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=MC').first()).toBeVisible()
  })

  test('separator line between sidebar and grid', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)

    // The separator div should exist
    const separator = page.locator('.w-px.bg-gray-700\\/40')
    await expect(separator).toBeVisible()
  })

  // Screenshots
  test('screenshot - marketplace overview', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1500)
    await page.screenshot({ path: 'tests/screenshots/marketplace-redesign.png', fullPage: true })
  })

  test('screenshot - hats filter with sidebar', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tests/screenshots/marketplace-hats.png', fullPage: true })
  })

  test('screenshot - premium filter', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)
    await page.locator('aside button:has-text("Premium")').first().click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tests/screenshots/marketplace-premium.png', fullPage: true })
  })

  test('screenshot - search results', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)
    await page.locator('input[placeholder="Items durchsuchen..."]').fill('Krone')
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tests/screenshots/marketplace-search.png', fullPage: true })
  })

  test('screenshot - item detail modal', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Baseball Cap")').first().click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tests/screenshots/marketplace-detail-modal.png', fullPage: true })
  })
})
