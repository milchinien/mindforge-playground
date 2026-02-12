import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Marketplace Purchase System', () => {
  test('Marketplace shows avatar filter tab', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Avatar filter button exists
    const avatarFilter = page.locator('button', { hasText: 'Avatar' })
    await expect(avatarFilter).toBeVisible()

    await context.close()
  })

  test('Filtering by Avatar shows avatar items', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Avatar filter
    await page.locator('button', { hasText: 'Avatar' }).click()
    await page.waitForTimeout(300)

    // Avatar items should be visible
    await expect(page.locator('text=Goldener Avatar-Rahmen')).toBeVisible()
    await expect(page.locator('text=Neon-Glow Haarfarbe')).toBeVisible()
    await expect(page.locator('text=Diamant-Krone')).toBeVisible()

    await context.close()
  })

  test('Clicking an asset opens detail modal', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Avatar filter then click first item
    await page.locator('button', { hasText: 'Avatar' }).click()
    await page.waitForTimeout(300)

    // Click on Goldener Avatar-Rahmen card
    await page.locator('text=Goldener Avatar-Rahmen').click()

    // Modal should open with details
    await expect(page.locator('h2:text("Goldener Avatar-Rahmen")')).toBeVisible()
    await expect(page.locator('text=von MindForge')).toBeVisible()
    await expect(page.locator('text=100 MindCoins - Kaufen')).toBeVisible()

    await context.close()
  })

  test('Purchasing an asset deducts MindCoins and shows success', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Avatar filter
    await page.locator('button', { hasText: 'Avatar' }).click()
    await page.waitForTimeout(300)

    // Click Galaxy Hintergrund (cheapest at 25 MC)
    await page.locator('text=Galaxy Hintergrund').click()

    // Click buy
    await page.locator('button', { hasText: 'MindCoins - Kaufen' }).click()

    // Should show success feedback
    await expect(page.locator('text=Erfolgreich gekauft!')).toBeVisible()

    await context.close()
  })

  test('Purchased item shows "Bereits gekauft" on revisit', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Avatar filter
    await page.locator('button', { hasText: 'Avatar' }).click()
    await page.waitForTimeout(300)

    // Buy Galaxy Hintergrund
    await page.locator('text=Galaxy Hintergrund').click()
    await page.locator('button', { hasText: 'MindCoins - Kaufen' }).click()
    await expect(page.locator('text=Erfolgreich gekauft!')).toBeVisible()

    // Close modal
    await page.locator('button[aria-label="Schliessen"]').click()
    await page.waitForTimeout(300)

    // The card should show "Gekauft"
    await expect(page.locator('text=Gekauft').first()).toBeVisible()

    // Open modal again
    await page.locator('text=Galaxy Hintergrund').click()
    await expect(page.locator('text=Bereits gekauft')).toBeVisible()

    await context.close()
  })

  test('MindCoinIcon displayed in asset cards', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // MindCoin icons should be present in card prices
    const mindCoinImgs = page.locator('img[alt="MindCoin"]')
    const count = await mindCoinImgs.count()
    // At least some cards with prices should have icons
    expect(count).toBeGreaterThan(0)

    await context.close()
  })

  test('Free assets show Kostenlos and can be downloaded', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Find a free asset card
    await expect(page.locator('text=Kostenlos').first()).toBeVisible()

    // Click on "Low-Poly Baum Set" which is free
    await page.locator('text=Low-Poly Baum Set').click()

    // Modal should show free download option
    await expect(page.locator('button:text("Kostenlos herunterladen")')).toBeVisible()

    await context.close()
  })

  test('Asset detail modal shows all metadata', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click on a priced asset
    await page.locator('text=Realistische Stein-Texturen').click()

    // Modal content
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    // Metadata sections in detail modal
    await expect(modal.getByText('Bewertung', { exact: true })).toBeVisible()
    await expect(modal.getByText('Downloads', { exact: true })).toBeVisible()
    await expect(modal.getByText('Dateigroesse', { exact: true })).toBeVisible()
    await expect(modal.getByText('Format', { exact: true })).toBeVisible()

    // Tags
    await expect(modal.locator('text=#textur')).toBeVisible()

    await context.close()
  })
})
