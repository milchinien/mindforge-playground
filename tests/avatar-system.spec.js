import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Avatar System - Roblox Style Editor', () => {
  test('Avatar page loads with title and sidebar categories', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Page title
    await expect(page.getByRole('heading', { name: 'Avatar anpassen' })).toBeVisible()

    // Sidebar category buttons with tooltips
    const sidebar = page.locator('.w-14')
    await expect(sidebar).toBeVisible()

    // Check all 8 category buttons exist
    const categoryButtons = sidebar.locator('button')
    await expect(categoryButtons).toHaveCount(8)

    // Save status indicator
    await expect(page.locator('text=Gespeichert')).toBeVisible()

    await context.close()
  })

  test('Avatar page shows live preview with username', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Live preview section
    await expect(page.locator('text=Live-Vorschau')).toBeVisible()

    // SVG avatar is rendered (at least one svg present)
    const svgs = page.locator('svg')
    expect(await svgs.count()).toBeGreaterThan(0)

    // Username shown
    await expect(page.getByRole('main').getByText('DevAccount')).toBeVisible()

    await context.close()
  })

  test('Presets tab shows preset cards', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Default category is Presets
    await expect(page.locator('text=Waehle ein Preset')).toBeVisible()

    // Check some presets exist
    await expect(page.locator('text=Krieger')).toBeVisible()
    await expect(page.locator('text=Gelehrter')).toBeVisible()
    await expect(page.locator('text=Hacker')).toBeVisible()

    await context.close()
  })

  test('Clicking skin category shows skin color pickers', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click skin category (2nd button in sidebar)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(1).click()

    // Skin color picker visible (use h4 to avoid matching tooltip and heading)
    await expect(page.locator('h4:text("Hautfarbe")')).toBeVisible()

    // 7 skin color buttons exist
    const skinLabel = page.locator('h4', { hasText: 'Hautfarbe' })
    const skinContainer = skinLabel.locator('..')
    const skinButtons = skinContainer.locator('button')
    await expect(skinButtons).toHaveCount(7)

    await context.close()
  })

  test('Hair category shows hair styles and hair color picker', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click hair category (3rd button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(2).click()

    await expect(page.locator('text=Frisur')).toBeVisible()
    await expect(page.locator('text=Haarfarbe')).toBeVisible()

    // Hair style options
    await expect(page.locator('button:text("Kurz")')).toBeVisible()
    await expect(page.locator('button:text("Lang")')).toBeVisible()
    await expect(page.locator('button:text("Lockig")')).toBeVisible()

    await context.close()
  })

  test('Face category shows eye types, eye color, eyebrows, and mouth', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click face category (4th button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(3).click()

    await expect(page.locator('text=Augenform')).toBeVisible()
    await expect(page.locator('text=Augenfarbe')).toBeVisible()
    await expect(page.locator('text=Augenbrauen')).toBeVisible()
    await expect(page.locator('text=Mund')).toBeVisible()

    await context.close()
  })

  test('Hats category shows free and premium hats', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click hats category (5th button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(4).click()

    // Hat description text
    await expect(page.locator('text=Kostenlose und Premium-Huete')).toBeVisible()

    // Free hats
    await expect(page.locator('text=Baseball Cap')).toBeVisible()
    await expect(page.locator('text=Beanie')).toBeVisible()

    // Premium hats with prices
    await expect(page.locator('text=Zylinder')).toBeVisible()
    await expect(page.locator('text=Krone')).toBeVisible()

    // Check "Gratis" labels exist for free hats
    const gratisLabels = page.locator('text=Gratis')
    expect(await gratisLabels.count()).toBeGreaterThanOrEqual(3) // none, baseball, beanie

    await context.close()
  })

  test('Clothing category shows clothing styles and colors', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click clothing category (6th button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(5).click()

    await expect(page.locator('text=Kleidungsstil')).toBeVisible()
    await expect(page.locator('text=Kleidungsfarbe')).toBeVisible()

    // Clothing options
    await expect(page.locator('button:text("T-Shirt")')).toBeVisible()
    await expect(page.locator('button:text("Hoodie")')).toBeVisible()
    await expect(page.locator('button:text("Jacke")')).toBeVisible()

    await context.close()
  })

  test('Accessories category shows free and premium accessories', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click accessories category (7th button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(6).click()

    await expect(page.locator('text=Accessoires fuer deinen Avatar')).toBeVisible()

    // Free accessories (use exact match to avoid "Sonnenbrille" matching "Brille")
    await expect(page.getByRole('button', { name: 'Brille Gratis', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sonnenbrille Gratis' })).toBeVisible()

    await context.close()
  })

  test('Background category shows background options', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click background category (8th button)
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(7).click()

    await expect(page.locator('h4:text("Hintergrund")')).toBeVisible()

    // Background options
    await expect(page.locator('text=Grau')).toBeVisible()
    await expect(page.locator('text=Galaxy')).toBeVisible()
    await expect(page.locator('text=Neon')).toBeVisible()

    await context.close()
  })

  test('Auto-save triggers after changing an option', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Go to hair category
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(2).click()
    await page.waitForTimeout(200)

    // Click a different hair style
    await page.click('button:text("Lockig")')

    // Should show "Ungespeichert" briefly
    await expect(page.locator('text=Ungespeichert')).toBeVisible({ timeout: 500 })

    // After debounce, should show "Gespeichert"
    await expect(page.locator('text=Gespeichert')).toBeVisible({ timeout: 3000 })

    await context.close()
  })

  test('Applying a preset updates the avatar preview', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click "Hacker" preset
    await page.click('text=Hacker')

    // Should trigger save
    await expect(page.locator('text=Ungespeichert')).toBeVisible({ timeout: 500 })
    await expect(page.locator('text=Gespeichert')).toBeVisible({ timeout: 3000 })

    await context.close()
  })

  test('MindCoin balance is displayed in header', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // MindCoin display should be visible
    const coinDisplay = page.locator('.rounded-full', { hasText: /\d/ })
    expect(await coinDisplay.count()).toBeGreaterThan(0)

    await context.close()
  })

  test('Category switching preserves avatar config', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Go to hair, change to Lockig
    const sidebar = page.locator('.w-14')
    await sidebar.locator('button').nth(2).click()
    await page.click('button:text("Lockig")')
    await page.waitForTimeout(200)

    // Switch to face
    await sidebar.locator('button').nth(3).click()
    await page.waitForTimeout(200)

    // Switch back to hair
    await sidebar.locator('button').nth(2).click()

    // Lockig should still be selected
    const lockigBtn = page.locator('button:text("Lockig")')
    await expect(lockigBtn).toHaveClass(/accent/)

    await context.close()
  })
})
