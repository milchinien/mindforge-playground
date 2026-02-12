import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Avatar System', () => {
  test('Avatar page loads with tabs', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Page title
    await expect(page.getByRole('heading', { name: 'Avatar anpassen' })).toBeVisible()

    // Three tabs visible
    const tabs = page.locator('button', { hasText: /^(Basis|Gesicht|Style)$/ })
    await expect(tabs).toHaveCount(3)

    // Status indicator shows "Gespeichert"
    await expect(page.locator('text=Gespeichert')).toBeVisible()

    await context.close()
  })

  test('Avatar page shows live preview', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Live preview section is visible
    await expect(page.locator('text=Live-Vorschau')).toBeVisible()

    // Username shown under preview (in main content area)
    await expect(page.getByRole('main').getByText('DevAccount')).toBeVisible()

    await context.close()
  })

  test('Basis tab shows skin color, hair color, and hair style pickers', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Default tab is Basis
    await expect(page.locator('text=Hautfarbe')).toBeVisible()
    await expect(page.locator('text=Haarfarbe')).toBeVisible()
    await expect(page.locator('text=Frisur')).toBeVisible()

    // Skin color buttons exist (7 colors)
    const skinLabel = page.locator('label', { hasText: 'Hautfarbe' })
    const skinContainer = skinLabel.locator('..')
    const skinButtons = skinContainer.locator('button')
    await expect(skinButtons).toHaveCount(7)

    await context.close()
  })

  test('Gesicht tab shows eye, eyebrow, and mouth pickers', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click Gesicht tab
    await page.click('button:text("Gesicht")')

    await expect(page.locator('text=Augenform')).toBeVisible()
    await expect(page.locator('text=Augenbrauen')).toBeVisible()
    await expect(page.locator('text=Mund')).toBeVisible()

    // Eyebrow options
    await expect(page.locator('button:text("Keine")')).toBeVisible()
    await expect(page.locator('button:text("Normal")')).toBeVisible()
    await expect(page.locator('button:text("Dick")')).toBeVisible()
    await expect(page.locator('button:text("Geschwungen")')).toBeVisible()

    // Mouth options
    await expect(page.locator('button:text("Laecheln")')).toBeVisible()
    await expect(page.locator('button:text("Neutral")')).toBeVisible()
    await expect(page.locator('button:text("Offen")')).toBeVisible()

    await context.close()
  })

  test('Style tab shows accessory and background pickers', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click Style tab
    await page.click('button:text("Style")')

    await expect(page.locator('text=Accessoire')).toBeVisible()
    await expect(page.locator('text=Hintergrund')).toBeVisible()

    // Accessory options
    await expect(page.getByRole('button', { name: 'Brille', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sonnenbrille' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ohrring' })).toBeVisible()

    await context.close()
  })

  test('Auto-save triggers after changing an option', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Click a different hair style
    await page.click('button:text("Lockig")')

    // Should show "Ungespeichert" briefly
    await expect(page.locator('text=Ungespeichert')).toBeVisible({ timeout: 500 })

    // After debounce (800ms), it should show "Speichere..." then "Gespeichert"
    await expect(page.locator('text=Gespeichert')).toBeVisible({ timeout: 3000 })

    await context.close()
  })

  test('Tab switching preserves selected options', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })

    // Change hair style to Lockig
    await page.click('button:text("Lockig")')
    await page.waitForTimeout(200)

    // Switch to Gesicht tab
    await page.click('button:text("Gesicht")')
    await page.waitForTimeout(200)

    // Switch back to Basis tab
    await page.click('button:text("Basis")')

    // Lockig should still be selected (has bg-accent class)
    const lockigBtn = page.locator('button:text("Lockig")')
    await expect(lockigBtn).toHaveClass(/bg-accent/)

    await context.close()
  })
})
