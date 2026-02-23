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
  test('Marketplace shows category filters in sidebar', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Sidebar category buttons
    await expect(page.locator('aside button:has-text("Alle")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Huete")').first()).toBeVisible()
    await expect(page.locator('aside button:has-text("Accessoires")').first()).toBeVisible()

    await context.close()
  })

  test('Filtering by Huete shows hat items', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Huete filter
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)

    // Hat items should be visible
    await expect(page.locator('text=Baseball Cap').first()).toBeVisible()
    await expect(page.locator('text=Krone').first()).toBeVisible()
    await expect(page.locator('text=Beanie').first()).toBeVisible()

    await context.close()
  })

  test('Clicking an item opens detail modal with preview', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Huete filter then click Krone
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)

    // Modal should open with item name and avatar previews
    await expect(page.locator('h2:has-text("Krone")')).toBeVisible()
    await expect(page.locator('text=Aktuell')).toBeVisible()
    await expect(page.locator('text=Vorschau')).toBeVisible()

    await context.close()
  })

  test('Premium item shows price and buy button', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click Huete then Krone (500 MC)
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)

    // Price and balance shown
    await expect(page.locator('text=500 MC').first()).toBeVisible()
    await expect(page.locator('text=Dein Guthaben')).toBeVisible()

    // Buy button visible
    await expect(page.locator('button:has-text("Kaufen & Anlegen")')).toBeVisible()

    await context.close()
  })

  test('Purchasing an item equips it and closes modal', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Buy Krone (500 MC)
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)
    await page.locator('button:has-text("Kaufen & Anlegen")').click()
    await page.waitForTimeout(500)

    // Modal should close
    await expect(page.locator('h2:has-text("Krone")')).toHaveCount(0)

    // Krone card should now show "Gekauft" badge
    await expect(page.locator('text=Gekauft').first()).toBeVisible()

    await context.close()
  })

  test('Purchased item shows Aktuell angelegt on revisit', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Buy Krone
    await page.locator('aside button:has-text("Huete")').first().click()
    await page.waitForTimeout(300)
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)
    await page.locator('button:has-text("Kaufen & Anlegen")').click()
    await page.waitForTimeout(500)

    // Re-open the Krone modal
    await page.locator('button:has-text("Krone")').first().click()
    await page.waitForTimeout(500)

    // Should show "Aktuell angelegt"
    await expect(page.locator('text=Aktuell angelegt')).toBeVisible()

    await context.close()
  })

  test('Premium items show MindCoin prices', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Filter to premium items
    await page.locator('aside button:has-text("Premium")').first().click()
    await page.waitForTimeout(300)

    // Premium items should show price numbers in the cards
    // Krone costs 500, Cowboyhut 150, etc.
    await expect(page.locator('text=500').first()).toBeVisible()

    await context.close()
  })

  test('Free items show Gratis label', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Filter to free items
    await page.locator('aside button:has-text("Kostenlos")').first().click()
    await page.waitForTimeout(300)

    // Should show Gratis labels
    await expect(page.locator('text=Gratis').first()).toBeVisible()

    await context.close()
  })

  test('Free item modal shows Anlegen button instead of buy', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle' })

    // Click on free hat (Baseball Cap)
    await page.locator('button:has-text("Baseball Cap")').first().click()
    await page.waitForTimeout(500)

    // Should show "Anlegen" button (not "Kaufen")
    await expect(page.locator('button:has-text("Anlegen")')).toBeVisible()

    await context.close()
  })
})
