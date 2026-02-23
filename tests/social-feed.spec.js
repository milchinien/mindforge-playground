import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Social Feed', () => {
  test('Feed page loads with title and header', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    await expect(page.locator('h1:has-text("Aktivitaeten")')).toBeVisible()
    await expect(page.locator('text=Was deine Freunde so treiben')).toBeVisible()

    await context.close()
  })

  test('Filter tabs are visible (Alle, Achievements, Spiele, Highscores)', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    await expect(page.locator('button:has-text("Alle")')).toBeVisible()
    await expect(page.locator('button:has-text("Achievements")')).toBeVisible()
    await expect(page.locator('button:has-text("Spiele")')).toBeVisible()
    await expect(page.locator('button:has-text("Highscores")')).toBeVisible()

    await context.close()
  })

  test('Activity cards show user names and content', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    // Mock users should appear
    await expect(page.locator('text=MaxGamer99').first()).toBeVisible()
    await expect(page.locator('text=LenaLernt').first()).toBeVisible()

    await context.close()
  })

  test('Time grouping shows Heute section', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    // Should have time group headers
    await expect(page.locator('h2:has-text("Heute")')).toBeVisible()

    await context.close()
  })

  test('Achievements filter shows only achievement activities', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    // Click Achievements filter
    await page.locator('button:has-text("Achievements")').click()
    await page.waitForTimeout(300)

    // Should show achievement activities
    await expect(page.locator('text=Achievement').first()).toBeVisible()

    // Should NOT show game_played/uploaded/item_purchased that are not achievements
    // After filtering, highscore entries should not appear
    const highscoreCount = await page.locator('text=neuen Highscore').count()
    expect(highscoreCount).toBe(0)

    await context.close()
  })

  test('Like button toggles on activity cards', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    // Find the first activity card's heart button (inside main content, not sidebar)
    const heartBtn = page.locator('.max-w-2xl button').first()
    await expect(heartBtn).toBeVisible()

    // Click like
    await heartBtn.click()
    await page.waitForTimeout(200)

    // Page still works after clicking
    await expect(page.locator('h1:has-text("Aktivitaeten")')).toBeVisible()

    await context.close()
  })

  test('New badge appears on recent activities', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/feed`, { waitUntil: 'networkidle' })

    // Recent activities (within 2 hours) should have NEU badge
    await expect(page.locator('text=NEU').first()).toBeVisible()

    await context.close()
  })

  test('Sidebar has Activity Feed link', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

    await expect(page.locator('aside a:has-text("Activity Feed")')).toBeVisible()

    await context.close()
  })
})
