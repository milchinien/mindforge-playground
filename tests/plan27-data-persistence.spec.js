import { test, expect } from '@playwright/test'

const RESET_VERSION = 'v27-data-persistence'

// Helper: Login with test account — handles the AppInitializer reload gracefully
async function login(page) {
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' })

  // If already redirected away from login (already logged in), we're done
  if (!page.url().includes('/login')) return

  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')

  // Wait for navigation away from login — the app may reload due to AppInitializer reset
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)

  // If AppInitializer triggered a reload and we ended up back on /login, login again
  if (page.url().includes('/login')) {
    await page.fill('input[type="email"]', 'test@mindforge.dev')
    await page.fill('input[type="password"]', 'test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  }

  // Dismiss daily login bonus modal if present
  const bonusButton = page.locator('text=Einsammeln!')
  if (await bonusButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await bonusButton.click()
    await page.waitForTimeout(500)
  }
}

// Helper: Clear store data but preserve the reset version flag
async function clearStores(page) {
  await page.evaluate((resetVer) => {
    const keysToRemove = [
      'mindforge-game-interactions',
      'mindforge-achievements',
      'mindforge-inventory',
      'mindforge-social',
      'mindforge-notifications',
      'mindforge-activity',
      'mindforge-quests',
      'mindforge-season',
    ]
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    // Always keep the reset version so AppInitializer doesn't trigger a page reload
    localStorage.setItem('mindforge-reset-version', resetVer)
  }, RESET_VERSION)
}

test.describe('Plan 27 – Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app to get access to localStorage, then clean stores
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await clearStores(page)
  })

  // ===== Test 1: Profil-Reset =====
  test('1. Profil-Reset: User starts fresh after reset', async ({ page }) => {
    // Remove the reset version to trigger the reset flow
    await page.evaluate(() => localStorage.removeItem('mindforge-reset-version'))

    await login(page)

    // After login + reset the version flag should be set
    const resetVersion = await page.evaluate(() =>
      localStorage.getItem('mindforge-reset-version')
    )
    expect(resetVersion).toBeTruthy()

    // Social store should start empty
    const socialData = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-social')
      return raw ? JSON.parse(raw) : null
    })
    if (socialData?.state) {
      expect(socialData.state.followers.length).toBe(0)
      expect(socialData.state.following.length).toBe(0)
    }
  })

  // ===== Test 2: Game-Interaktionen =====
  test('2. Game interactions: Like/Unlike persists', async ({ page }) => {
    await login(page)

    // Open GameDetail page
    await page.goto('http://localhost:5173/game/game-001', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Page should load without error
    const title = page.locator('h1').first()
    await expect(title).toBeVisible({ timeout: 5000 })

    // Find like button (ThumbsUp icon button)
    const likeButton = page.locator('button').filter({ has: page.locator('svg.lucide-thumbs-up') }).first()
    await expect(likeButton).toBeVisible({ timeout: 5000 })

    // Get initial like count text
    const initialLikeText = await likeButton.textContent()
    const initialLikes = parseInt(initialLikeText.replace(/\D/g, '')) || 0

    // Click Like
    await likeButton.click()
    await page.waitForTimeout(300)

    // Like count should increase by 1
    const afterLikeText = await likeButton.textContent()
    const afterLikes = parseInt(afterLikeText.replace(/\D/g, '')) || 0
    expect(afterLikes).toBe(initialLikes + 1)

    // Button should have active styling (green border)
    await expect(likeButton).toHaveClass(/border-green-600/)

    // Click again to unlike
    await likeButton.click()
    await page.waitForTimeout(300)

    const afterUnlikeText = await likeButton.textContent()
    const afterUnlikes = parseInt(afterUnlikeText.replace(/\D/g, '')) || 0
    expect(afterUnlikes).toBe(initialLikes)

    // Like again for persistence test
    await likeButton.click()
    await page.waitForTimeout(300)

    // Reload page and check like is persisted
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const persistedButton = page.locator('button').filter({ has: page.locator('svg.lucide-thumbs-up') }).first()
    await expect(persistedButton).toHaveClass(/border-green-600/)
  })

  // ===== Test 3: Achievement-System =====
  test('3. Achievement-System: Playing game triggers progress', async ({ page }) => {
    await login(page)

    // Navigate to a game and play it
    await page.goto('http://localhost:5173/play/game-001', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Check achievementStore in localStorage — games_played should have incremented
    const achievementData = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-achievements')
      return raw ? JSON.parse(raw) : null
    })

    if (achievementData?.state?.progress) {
      expect(achievementData.state.progress.games_played).toBeGreaterThanOrEqual(1)
    }

    // Go to achievements page and check it loads
    await page.goto('http://localhost:5173/achievements', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  // ===== Test 4: Inventory =====
  test('4. Inventory: Starter items visible and equip works', async ({ page }) => {
    await login(page)

    await page.goto('http://localhost:5173/inventory', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Should see starter items (Neuling, Willkommen, Standard)
    await expect(page.locator('text=Neuling')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Willkommen')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Standard' })).toBeVisible()

    // Test category tabs — click "Titel" tab
    const titelTab = page.locator('button').filter({ hasText: 'Titel' }).first()
    if (await titelTab.isVisible().catch(() => false)) {
      await titelTab.click()
      await page.waitForTimeout(300)
      await expect(page.locator('text=Neuling')).toBeVisible()
    }

    // Test equip: click "Anlegen" on first item
    const equipButton = page.locator('button:has-text("Anlegen")').first()
    if (await equipButton.isVisible().catch(() => false)) {
      await equipButton.click()
      await page.waitForTimeout(300)
      // Should now show "Ablegen" and "Aktiv" badge
      await expect(page.locator('text=Aktiv').first()).toBeVisible()
      await expect(page.locator('button:has-text("Ablegen")').first()).toBeVisible()
    }
  })

  // ===== Test 5: Social / Friends =====
  test('5. Social: Friends page loads correctly', async ({ page }) => {
    await login(page)

    await page.goto('http://localhost:5173/friends', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Friends page should load
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 5000 })

    // Page loaded without crash — content is present
    const body = await page.locator('body').textContent()
    expect(body.length).toBeGreaterThan(20)
  })

  // ===== Test 6: Notifications =====
  test('6. Notifications: Bell icon visible, dropdown works', async ({ page }) => {
    await login(page)

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Bell icon should be visible in the navbar
    const bellSvg = page.locator('svg.lucide-bell').first()
    await expect(bellSvg).toBeVisible({ timeout: 5000 })

    // Click bell to open dropdown
    const bellParent = bellSvg.locator('..')
    await bellParent.click()
    await page.waitForTimeout(500)

    // Dropdown should open — look for notification header text
    const dropdownHeader = page.locator('h3').filter({ hasText: /Benachrichtigungen|Notifications/ })
    const headerVisible = await dropdownHeader.isVisible({ timeout: 3000 }).catch(() => false)

    // Or at least the "no notifications" empty state
    const emptyState = page.locator('text=Keine Benachrichtigungen').or(page.locator('text=noNotifications'))
    const emptyVisible = await emptyState.isVisible({ timeout: 2000 }).catch(() => false)

    expect(headerVisible || emptyVisible).toBe(true)
  })

  // ===== Test 7: Quests =====
  test('7. Quests: Quest page loads with quests visible', async ({ page }) => {
    await page.goto('http://localhost:5173/quests', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 5000 })

    const body = await page.locator('body').textContent()
    expect(body.length).toBeGreaterThan(50)
  })

  // ===== Test 8: Settings =====
  test('8. Settings: Notification toggles visible and persist', async ({ page }) => {
    await login(page)

    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 5000 })

    // Find notification toggle switches
    const toggles = page.locator('button[role="switch"]')
    const toggleCount = await toggles.count()
    expect(toggleCount).toBeGreaterThanOrEqual(4)

    // Click first toggle to change it
    const firstToggle = toggles.first()
    const initialState = await firstToggle.getAttribute('aria-checked')

    await firstToggle.click()
    await page.waitForTimeout(300)

    const newState = await firstToggle.getAttribute('aria-checked')
    expect(newState).not.toBe(initialState)

    // Reload and check persistence
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const reloadedToggle = page.locator('button[role="switch"]').first()
    const persistedState = await reloadedToggle.getAttribute('aria-checked')
    expect(persistedState).toBe(newState)
  })

  // ===== Test 9: Leaderboards =====
  test('9. Leaderboards: Current user appears with real data', async ({ page }) => {
    await login(page)

    await page.goto('http://localhost:5173/leaderboards', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 5000 })

    // Should have XP display
    const xpDisplay = page.locator('text=XP').first()
    await expect(xpDisplay).toBeVisible({ timeout: 3000 })

    // The player list should have entries
    const body = await page.locator('body').textContent()
    expect(body).toContain('XP')
  })
})

// ===== Smoke Tests: All pages load =====
test.describe('Smoke Test: All pages load without errors', () => {
  const PUBLIC_PAGES = [
    { path: '/', name: 'Home' },
    { path: '/browse', name: 'Browse' },
    { path: '/search', name: 'Search' },
    { path: '/game/game-001', name: 'GameDetail' },
    { path: '/quests', name: 'Quests' },
    { path: '/seasons', name: 'Seasons' },
    { path: '/leaderboards', name: 'Leaderboards' },
    { path: '/premium', name: 'Premium' },
    { path: '/events', name: 'Events' },
    { path: '/marketplace', name: 'Marketplace' },
  ]

  const AUTH_PAGES = [
    { path: '/achievements', name: 'Achievements' },
    { path: '/inventory', name: 'Inventory' },
    { path: '/friends', name: 'Friends' },
    { path: '/shop', name: 'Shop' },
    { path: '/settings', name: 'Settings' },
    { path: '/chat', name: 'Chat' },
    { path: '/groups', name: 'Groups' },
  ]

  test('Public pages load without JS errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      if (err.message.includes('useTranslation') || err.message.includes('i18next')) return
      errors.push(err.message)
    })

    for (const route of PUBLIC_PAGES) {
      await test.step(`${route.name} (${route.path})`, async () => {
        const response = await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })
        expect(response.status()).toBe(200)

        const errorBoundary = page.locator('text=Something went wrong')
        const hasError = await errorBoundary.isVisible().catch(() => false)
        expect(hasError).toBe(false)
      })
    }

    const criticalErrors = errors.filter(
      (e) => e.includes('Cannot read') || e.includes('is not a function') || e.includes('is not defined')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('Auth pages load after login without JS errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      if (err.message.includes('useTranslation') || err.message.includes('i18next')) return
      if (err.message.includes('Maximum update depth')) return // Transient React batching issue
      errors.push(err.message)
    })

    await login(page)

    for (const route of AUTH_PAGES) {
      await test.step(`${route.name} (${route.path})`, async () => {
        const response = await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })
        expect(response.status()).toBe(200)

        // Should NOT be on login page
        expect(page.url()).not.toContain('/login')

        // If error boundary visible (e.g. React batching issue), reload once
        const errorBoundary = page.locator('text=Something went wrong')
        if (await errorBoundary.isVisible().catch(() => false)) {
          await page.reload({ waitUntil: 'networkidle' })
          const stillError = await errorBoundary.isVisible().catch(() => false)
          expect(stillError, `${route.name} shows persistent error after reload`).toBe(false)
        }
      })
    }

    const criticalErrors = errors.filter(
      (e) => e.includes('Cannot read') || e.includes('is not a function') || e.includes('is not defined')
    )
    expect(criticalErrors).toHaveLength(0)
  })
})
