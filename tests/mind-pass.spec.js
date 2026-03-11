import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5174'

test.describe('Mind Pass - Fortnite-Style Battle Pass', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
  })

  // ─── Layout & Full-Bleed Design ────────────────────────────

  test('renders full-bleed dark background page', async ({ page }) => {
    const passPage = page.locator('[data-testid="mind-pass-page"]')
    await expect(passPage).toBeVisible()
    const bg = await passPage.evaluate(el => getComputedStyle(el).background)
    expect(bg).toContain('linear-gradient')
  })

  test('shows Mind Pass title in header', async ({ page }) => {
    const title = page.locator('[data-testid="mind-pass-title"]')
    await expect(title).toBeVisible()
    await expect(title).toContainText('Mind Pass')
  })

  test('page uses full width', async ({ page }) => {
    const passPage = page.locator('[data-testid="mind-pass-page"]')
    const box = await passPage.boundingBox()
    expect(box.width).toBeGreaterThan(600)
  })

  // ─── Tabs ──────────────────────────────────────────────────

  test('has exactly 2 tabs - no Rangliste', async ({ page }) => {
    await expect(page.locator('[data-testid="tab-mindpass"]')).toBeVisible()
    await expect(page.locator('[data-testid="tab-challenges"]')).toBeVisible()
    await expect(page.locator('[data-testid="tab-leaderboard"]')).toHaveCount(0)
  })

  test('Mind Pass tab shows card strip by default', async ({ page }) => {
    await expect(page.locator('[data-testid="reward-card-strip"]')).toBeVisible()
  })

  test('can switch to Season-Aufgaben tab', async ({ page }) => {
    await page.locator('[data-testid="tab-challenges"]').click()
    await expect(page.getByText('Season-Aufgaben').first()).toBeVisible()
  })

  test('can switch back to Mind Pass tab', async ({ page }) => {
    await page.locator('[data-testid="tab-challenges"]').click()
    await page.locator('[data-testid="tab-mindpass"]').click()
    await expect(page.locator('[data-testid="reward-card-strip"]')).toBeVisible()
  })

  // ─── Battle Pass Track (6 cards per page) ──────────────────

  test('shows reward card strip with exactly 6 cards', async ({ page }) => {
    const strip = page.locator('[data-testid="reward-card-strip"]')
    const cards = strip.locator('button')
    const count = await cards.count()
    expect(count).toBe(6)
  })

  test('shows page navigation with 5 pages', async ({ page }) => {
    const indicator = page.locator('[data-testid="page-indicator"]')
    await expect(indicator).toContainText('/ 5')
  })

  test('can navigate to next page', async ({ page }) => {
    const indicator = page.locator('[data-testid="page-indicator"]')
    const initial = await indicator.textContent()
    await page.locator('[data-testid="page-next"]').click()
    await page.waitForTimeout(300)
    expect(await indicator.textContent()).not.toEqual(initial)
  })

  test('prev button disabled on first page', async ({ page }) => {
    const prev = page.locator('[data-testid="page-prev"]')
    const indicator = page.locator('[data-testid="page-indicator"]')
    for (let i = 0; i < 5; i++) {
      if ((await indicator.textContent()).includes('Seite 1')) break
      await prev.click()
      await page.waitForTimeout(200)
    }
    await expect(prev).toBeDisabled()
  })

  test('next button disabled on last page', async ({ page }) => {
    const next = page.locator('[data-testid="page-next"]')
    const indicator = page.locator('[data-testid="page-indicator"]')
    for (let i = 0; i < 5; i++) {
      if ((await indicator.textContent()).includes('Seite 5')) break
      await next.click()
      await page.waitForTimeout(200)
    }
    await expect(next).toBeDisabled()
  })

  test('clicking a card selects it with scale effect', async ({ page }) => {
    const strip = page.locator('[data-testid="reward-card-strip"]')
    const cards = strip.locator('button')
    if (await cards.count() >= 2) {
      await cards.nth(1).click()
      await expect(cards.nth(1)).toHaveClass(/scale/)
    }
  })

  test('featured display shows rarity label', async ({ page }) => {
    const labels = ['GEWOEHNLICH', 'UNGEWOEHNLICH', 'SELTEN', 'EPISCH', 'LEGENDAER']
    let found = false
    for (const label of labels) {
      if (await page.getByText(label, { exact: true }).count() > 0) { found = true; break }
    }
    expect(found).toBeTruthy()
  })

  test('featured display shows ANSEHEN button', async ({ page }) => {
    await expect(page.getByText('ANSEHEN')).toBeVisible()
  })

  test('featured display shows action state', async ({ page }) => {
    const actions = ['EINLOESEN', 'Eingeloest', 'Premium noetig', 'Gesperrt']
    let found = false
    for (const t of actions) {
      if (await page.getByText(t).count() > 0) { found = true; break }
    }
    expect(found).toBeTruthy()
  })

  test('shows hint text about clicking rewards', async ({ page }) => {
    await expect(page.getByText('Klicke')).toBeVisible()
  })

  // ─── Free vs Premium Rewards (6 per page: first & last = free) ──

  test('first and last cards on page are free rewards', async ({ page }) => {
    const strip = page.locator('[data-testid="reward-card-strip"]')
    const cards = strip.locator('button')
    const count = await cards.count()
    expect(count).toBe(6)

    // First card should have "free" in its testid
    const firstId = await cards.first().getAttribute('data-testid')
    expect(firstId).toContain('-free')

    // Last card should have "free" in its testid
    const lastId = await cards.last().getAttribute('data-testid')
    expect(lastId).toContain('-free')
  })

  test('page 2 has exactly 1 unclaimed free reward', async ({ page }) => {
    // Default page is 2 (user at tier 9). Tier 7 free is claimed, tier 12 free is NOT claimed.
    const indicator = page.locator('[data-testid="page-indicator"]')
    const text = await indicator.textContent()
    expect(text).toContain('Seite 2')

    const strip = page.locator('[data-testid="reward-card-strip"]')
    // "Free" tag only shows on unclaimed free rewards
    const freeCount = await strip.getByText('Free').count()
    expect(freeCount).toBe(1)
  })

  // ─── Level Progression Track ────────────────────────────────

  test('shows level indicators above cards', async ({ page }) => {
    // Level dots/numbers should be visible
    const lvTexts = await page.getByText(/^Lv \d+$/).count()
    expect(lvTexts).toBeGreaterThanOrEqual(4)
  })

  // ─── Premium Button ────────────────────────────────────────

  test('premium button visible when not logged in', async ({ page }) => {
    await expect(page.locator('[data-testid="premium-btn"]')).toBeVisible()
  })

  test('premium button shows toast when not logged in', async ({ page }) => {
    await page.locator('[data-testid="premium-btn"]').click()
    // Should show a toast warning (not a modal)
    await expect(page.getByText('Bitte melde dich an')).toBeVisible({ timeout: 3000 })
  })

  // ─── Season-Aufgaben Tab ───────────────────────────────────

  test('challenges tab shows current week challenges', async ({ page }) => {
    await page.locator('[data-testid="tab-challenges"]').click()
    // Week selector should be visible
    await expect(page.getByText('Woche 1')).toBeVisible()
    // Current week (4) should be auto-selected, showing week 4 challenges
    await expect(page.getByText('Spiele 8 Spiele')).toBeVisible()
  })

  test('can switch between challenge weeks', async ({ page }) => {
    await page.locator('[data-testid="tab-challenges"]').click()
    // Switch to week 1
    await page.getByText('Woche 1').click()
    await expect(page.getByText('Spiele 5 Mathe-Spiele')).toBeVisible()
    // Switch to week 2
    await page.getByText('Woche 2').click()
    await expect(page.getByText('Spiele 3 Sprach-Spiele')).toBeVisible()
  })

  test('challenges tab shows XP earned', async ({ page }) => {
    await page.locator('[data-testid="tab-challenges"]').click()
    await expect(page.getByText('XP').first()).toBeVisible()
  })

  // ─── Removed Elements ──────────────────────────────────────

  test('no "Naechstes Level" bar at bottom', async ({ page }) => {
    await expect(page.getByText('Naechstes Level')).toHaveCount(0)
  })

  test('no Rangliste anywhere', async ({ page }) => {
    await expect(page.getByText('Season-Rangliste')).toHaveCount(0)
  })

  // ─── Header ────────────────────────────────────────────────

  test('header shows season name', async ({ page }) => {
    // "Wissensdurst" should appear somewhere in the page
    const count = await page.getByText('Wissensdurst').count()
    expect(count).toBeGreaterThan(0)
  })

  // ─── Visual Quality ────────────────────────────────────────

  test('reward cards have gradient backgrounds', async ({ page }) => {
    const strip = page.locator('[data-testid="reward-card-strip"]')
    const firstCard = strip.locator('button').first()
    const bg = await firstCard.evaluate(el => {
      const bgDiv = el.querySelector('div')
      return bgDiv ? getComputedStyle(bgDiv).backgroundImage : ''
    })
    expect(bg).toContain('gradient')
  })

  test('no critical console errors', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    const critical = errors.filter(e =>
      !e.includes('favicon') && !e.includes('net::') && !e.includes('404')
    )
    expect(critical).toHaveLength(0)
  })

  // ─── Responsiveness ────────────────────────────────────────

  test('desktop layout (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="mind-pass-page"]')).toBeVisible()
    await expect(page.locator('[data-testid="reward-card-strip"]')).toBeVisible()
  })

  test('mobile layout (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="mind-pass-page"]')).toBeVisible()
    await expect(page.locator('[data-testid="tab-mindpass"]')).toBeVisible()
  })

  // ─── Screenshots for visual review ─────────────────────────

  test('screenshot: desktop full view', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'tests/screenshots/mind-pass-desktop.png', fullPage: false })
  })

  test('screenshot: page 1 rewards', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    // Navigate to page 1
    const prev = page.locator('[data-testid="page-prev"]')
    const indicator = page.locator('[data-testid="page-indicator"]')
    for (let i = 0; i < 5; i++) {
      if ((await indicator.textContent()).includes('Seite 1')) break
      await prev.click()
      await page.waitForTimeout(200)
    }
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'tests/screenshots/mind-pass-page1.png', fullPage: false })
  })

  test('screenshot: challenges tab', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto(`${BASE}/seasons`)
    await page.waitForLoadState('networkidle')
    await page.locator('[data-testid="tab-challenges"]').click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'tests/screenshots/mind-pass-challenges.png', fullPage: false })
  })
})
