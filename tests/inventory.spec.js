import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Inventory System', () => {
  test('Inventory page loads with starter items', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: 'Inventar' })).toBeVisible()

    // Default items should be visible
    await expect(page.locator('text=Goldener Rahmen')).toBeVisible()
    await expect(page.locator('text=Feuer-Haarfarbe')).toBeVisible()
    await expect(page.locator('text=Sternen-Hintergrund')).toBeVisible()

    await context.close()
  })

  test('Inventory shows three tabs', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    await expect(page.locator('button', { hasText: 'Avatar Items' })).toBeVisible()
    await expect(page.locator('button', { hasText: 'Gekaufte Spiele' })).toBeVisible()
    await expect(page.locator('button', { hasText: 'Assets' })).toBeVisible()

    await context.close()
  })

  test('Games tab shows empty state', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    await page.click('button:text("Gekaufte Spiele")')

    await expect(page.locator('text=Keine gekauften Spiele')).toBeVisible()
    await expect(page.locator('text=Zum Marketplace')).toBeVisible()

    await context.close()
  })

  test('Assets tab shows empty state', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    await page.click('button:text("Assets")')

    await expect(page.locator('text=Keine Assets')).toBeVisible()
    await expect(page.locator('text=Assets durchsuchen')).toBeVisible()

    await context.close()
  })

  test('Rarity badges are displayed correctly', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    // Rarity badges should be present
    await expect(page.locator('text=Selten').first()).toBeVisible()
    await expect(page.locator('text=Gewoehnlich').first()).toBeVisible()

    await context.close()
  })

  test('Item cards show source info', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    // Starter items show source
    await expect(page.locator('text=Starterset').first()).toBeVisible()

    await context.close()
  })

  test('Inventory always shows default starter items', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    // Default items should always be present
    await expect(page.locator('text=Goldener Rahmen')).toBeVisible()
    await expect(page.locator('text=Feuer-Haarfarbe')).toBeVisible()
    await expect(page.locator('text=Sternen-Hintergrund')).toBeVisible()

    // Each has an Anlegen button
    const anlegenButtons = page.locator('button:text("Anlegen")')
    const count = await anlegenButtons.count()
    expect(count).toBeGreaterThanOrEqual(3)

    await context.close()
  })

  test('Item count updates in tab badge', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/inventory`, { waitUntil: 'networkidle' })

    // Avatar Items tab should show count >= 3 (default items)
    const tabBtn = page.locator('button', { hasText: 'Avatar Items' })
    const countBadge = tabBtn.locator('span')
    const countText = await countBadge.textContent()
    const count = parseInt(countText.trim())
    expect(count).toBeGreaterThanOrEqual(3)

    await context.close()
  })
})
