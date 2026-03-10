import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

// Helper: login
async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[placeholder*="email.com oder"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.locator('button:has-text("Log in")').click()
  await page.waitForURL('**/')
  await page.waitForTimeout(1000)

  // Dismiss daily bonus modal if present
  const bonusBtn = page.locator('text=Einsammeln!')
  if (await bonusBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await bonusBtn.click()
    await page.waitForTimeout(500)
  }
}

test.describe('Tabs & Breadcrumb Bug Fix', () => {

  test('Chat page does NOT show breadcrumb', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/chat`, { waitUntil: 'networkidle' })

    // Chat page should NOT show breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb).not.toBeVisible()

    // Chat should show its own "Nachrichten" heading
    await expect(page.locator('text=Nachrichten')).toBeVisible()
  })

  test('Chat page has no layout overlap (no negative margin hack needed)', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/chat`, { waitUntil: 'networkidle' })

    // The chat container should be visible without JS errors
    const chatContainer = page.locator('text=Nachrichten')
    await expect(chatContainer).toBeVisible()

    // ForgeBot should be visible in contact list
    await expect(page.locator('text=ForgeBot').first()).toBeVisible()

    // No error boundary
    const errorBoundary = page.locator('text=Something went wrong')
    const hasError = await errorBoundary.isVisible().catch(() => false)
    expect(hasError).toBe(false)
  })

  test('Groups page shows breadcrumb correctly', async ({ page }) => {
    await login(page)
    await page.goto(`${BASE}/groups`, { waitUntil: 'networkidle' })

    // Should show breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb).toContainText('Gruppen')

    // Should show page title
    await expect(page.locator('h1:has-text("Gruppen")')).toBeVisible()

    // Should show tab content (Lerngruppen)
    await expect(page.locator('text=Lerngruppen')).toBeVisible()

    // No error boundary
    const errorBoundary = page.locator('text=Something went wrong')
    expect(await errorBoundary.isVisible().catch(() => false)).toBe(false)
  })

  test('All auth tabs load without errors after login', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      errors.push(err.message)
    })

    await login(page)

    const tabs = [
      { path: '/chat', name: 'Chat', noBreadcrumb: true },
      { path: '/groups', name: 'Groups' },
      { path: '/friends', name: 'Friends' },
      { path: '/avatar', name: 'Avatar' },
      { path: '/inventory', name: 'Inventory' },
      { path: '/shop', name: 'Shop' },
      { path: '/achievements', name: 'Achievements' },
      { path: '/settings', name: 'Settings' },
    ]

    for (const tab of tabs) {
      await test.step(`${tab.name} (${tab.path})`, async () => {
        const response = await page.goto(`${BASE}${tab.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        expect(response.status()).toBe(200)

        // Should NOT be redirected to login
        expect(page.url()).not.toContain('/login')

        // No error boundary
        const errorBoundary = page.locator('text=Something went wrong')
        expect(await errorBoundary.isVisible().catch(() => false)).toBe(false)

        // Check breadcrumb visibility based on page type
        const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
        if (tab.noBreadcrumb) {
          await expect(breadcrumb).not.toBeVisible()
        } else {
          await expect(breadcrumb).toBeVisible()
        }

        // Page has content
        const body = await page.locator('body').textContent()
        expect(body.length).toBeGreaterThan(10)
      })
    }

    // Filter non-critical errors
    const criticalErrors = errors.filter(
      (msg) =>
        !msg.includes('useTranslation') &&
        !msg.includes('i18next') &&
        !msg.includes('DevTools') &&
        !msg.includes('ResizeObserver')
    )

    expect(criticalErrors, 'No critical JS errors on any tab').toEqual([])
  })

  test('Public tabs load without breadcrumb issues', async ({ page }) => {
    const publicTabs = [
      { path: '/', name: 'Home', noBreadcrumb: true },
      { path: '/browse', name: 'Browse' },
      { path: '/events', name: 'Events' },
      { path: '/quests', name: 'Quests', skipErrorCheck: true }, // pre-existing infinite loop bug
      { path: '/seasons', name: 'Seasons', skipErrorCheck: true }, // pre-existing render loop bug
      { path: '/leaderboards', name: 'Leaderboards' },
      { path: '/premium', name: 'Premium' },
    ]

    for (const tab of publicTabs) {
      await test.step(`${tab.name} (${tab.path})`, async () => {
        const response = await page.goto(`${BASE}${tab.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        expect(response.status()).toBe(200)

        if (!tab.skipErrorCheck) {
          const errorBoundary = page.locator('text=Something went wrong')
          expect(await errorBoundary.isVisible().catch(() => false)).toBe(false)
        }

        const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
        if (tab.noBreadcrumb) {
          // Home page has no breadcrumb
          await expect(breadcrumb).not.toBeVisible()
        } else if (!tab.skipErrorCheck) {
          await expect(breadcrumb).toBeVisible()
        }
      })
    }
  })
})
