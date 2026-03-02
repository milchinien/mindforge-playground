import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Leaderboards', () => {
  test('Leaderboards page loads with tabs', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Time range tabs should be visible
    await expect(page.locator('button:has-text("Overall")')).toBeVisible()
    await expect(page.locator('button:has-text("This Week")')).toBeVisible()
    await expect(page.locator('button:has-text("This Month")')).toBeVisible()
    await context.close()
  })

  test('Time range tabs switch data', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Click weekly tab
    await page.locator('button:has-text("This Week")').click()
    await page.waitForTimeout(200)

    // QuizKoenig should be #1 in weekly
    await expect(page.locator('text=QuizKoenig').first()).toBeVisible()

    await context.close()
  })

  test('Player list shows XP and player names', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Top players visible
    await expect(page.locator('text=PixelMaster').first()).toBeVisible()
    await expect(page.locator('text=BrainStorm99').first()).toBeVisible()
    await expect(page.locator('text=48.750').first()).toBeVisible()

    await context.close()
  })

  test('Current user is highlighted with You badge', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    await expect(page.locator('text=DevAccount').first()).toBeVisible()
    await expect(page.locator('span:has-text("You")').first()).toBeVisible()

    await context.close()
  })

  test('Game filter dropdown works', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Click to open dropdown
    await page.locator('button:has-text("All Games")').click()
    await page.waitForTimeout(300)

    // Game list should appear
    const dropdownItems = page.locator('.absolute button')
    const count = await dropdownItems.count()
    expect(count).toBeGreaterThan(1)

    await context.close()
  })
})
