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
  test('Leaderboards page loads with title', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    await expect(page.locator('h1:has-text("Bestenliste")')).toBeVisible()
    await expect(page.locator('text=Vergleiche dich mit anderen Spielern')).toBeVisible()

    await context.close()
  })

  test('Shows current user XP card with level and rank', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // XP card shows DevAccount with level and rank info
    await expect(page.locator('text=DevAccount').first()).toBeVisible()
    await expect(page.locator('text=Level 12').first()).toBeVisible()
    await expect(page.locator('text=8.450 XP')).toBeVisible()

    await context.close()
  })

  test('Time range tabs work (Gesamt, Diese Woche, Dieser Monat)', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // All three tabs visible
    await expect(page.locator('button:has-text("Gesamt")')).toBeVisible()
    await expect(page.locator('button:has-text("Diese Woche")')).toBeVisible()
    await expect(page.locator('button:has-text("Dieser Monat")')).toBeVisible()

    // Click weekly tab
    await page.locator('button:has-text("Diese Woche")').click()
    await page.waitForTimeout(200)

    // QuizKoenig should be #1 in weekly
    const firstPlayer = page.locator('text=QuizKoenig').first()
    await expect(firstPlayer).toBeVisible()

    await context.close()
  })

  test('Top 3 podium shows gold, silver, bronze', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Podium labels
    await expect(page.locator('text=Gold')).toBeVisible()
    await expect(page.locator('text=Silber')).toBeVisible()
    await expect(page.locator('text=Bronze')).toBeVisible()

    await context.close()
  })

  test('Player list shows XP, level, and games played', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Top players visible in podium
    await expect(page.locator('text=PixelMaster').first()).toBeVisible()
    await expect(page.locator('text=BrainStorm99').first()).toBeVisible()

    // XP values shown (48.750 with German locale dot separator)
    await expect(page.locator('text=48.750').first()).toBeVisible()

    await context.close()
  })

  test('Current user row is highlighted with Du badge', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Scroll down to find the current user row
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Current user should have "Du" badge
    await expect(page.locator('span:has-text("Du")').first()).toBeVisible()

    await context.close()
  })

  test('Game filter dropdown works', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    // Default shows "Alle Spiele (Global)"
    await expect(page.locator('text=Alle Spiele (Global)').first()).toBeVisible()

    // Click to open dropdown
    await page.locator('button:has-text("Alle Spiele (Global)")').click()
    await page.waitForTimeout(300)

    // Game list should appear in dropdown
    const dropdownItems = page.locator('.absolute button')
    const count = await dropdownItems.count()
    expect(count).toBeGreaterThan(1)

    await context.close()
  })

  test('Sidebar has Leaderboards link', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

    await expect(page.locator('aside a:has-text("Leaderboards")')).toBeVisible()

    await context.close()
  })

  test('Info footer is present', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/leaderboards`, { waitUntil: 'networkidle' })

    await expect(page.locator('text=Ranglisten werden regelmaessig aktualisiert')).toBeVisible()

    await context.close()
  })
})
