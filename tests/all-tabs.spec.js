import { test, expect } from '@playwright/test'

const PUBLIC_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/quests', name: 'Quests' },
  { path: '/seasons', name: 'Seasons' },
  { path: '/events', name: 'Events' },
  { path: '/leaderboards', name: 'Leaderboards' },
  { path: '/quiz', name: 'Quiz Arena' },
  { path: '/feed', name: 'Activity Feed' },
  { path: '/browse', name: 'Mindbrowser' },
  { path: '/marketplace', name: 'Marketplace' },
  { path: '/templates', name: 'Template Marketplace' },
  { path: '/premium', name: 'Premium' },
]

const AUTH_ROUTES = [
  { path: '/chat', name: 'Chat' },
  { path: '/groups', name: 'Gruppen' },
  { path: '/friends', name: 'Friends' },
  { path: '/avatar', name: 'Avatar' },
  { path: '/inventory', name: 'Inventory' },
  { path: '/shop', name: 'Shop' },
  { path: '/gift', name: 'Verschenken' },
  { path: '/achievements', name: 'Achievements' },
  { path: '/settings', name: 'Settings' },
]

test.describe('All tabs load without errors', () => {
  test('Public routes load correctly', async ({ page }) => {
    const errors = []

    page.on('pageerror', (err) => {
      errors.push({ type: 'js-error', message: err.message })
    })

    for (const route of PUBLIC_ROUTES) {
      await test.step(`${route.name} (${route.path})`, async () => {
        const response = await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        expect(response.status(), `${route.name} should return 200`).toBe(200)

        // Check no React error boundary is shown
        const errorBoundary = page.locator('text=Something went wrong')
        const hasError = await errorBoundary.isVisible().catch(() => false)
        expect(hasError, `${route.name} should not show error boundary`).toBe(false)

        // Check page has content (not blank)
        const body = await page.locator('body').textContent()
        expect(body.length, `${route.name} should have content`).toBeGreaterThan(10)
      })
    }

    // Filter out known non-critical warnings
    const criticalErrors = errors.filter(
      (e) =>
        !e.message.includes('useTranslation') &&
        !e.message.includes('i18next') &&
        !e.message.includes('DevTools')
    )

    if (criticalErrors.length > 0) {
      console.log('JS Errors found:', criticalErrors)
    }
  })

  test('Auth routes redirect to login when not logged in', async ({ page }) => {
    for (const route of AUTH_ROUTES) {
      await test.step(`${route.name} (${route.path}) redirects to /login`, async () => {
        await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        // Auth routes should redirect to login
        expect(page.url()).toContain('/login')
      })
    }
  })

  test('Auth routes load correctly after login', async ({ page }) => {
    const errors = []

    page.on('pageerror', (err) => {
      errors.push({ type: 'js-error', message: err.message })
    })

    // Login first
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test@mindforge.dev')
    await page.fill('input[type="password"]', 'test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/') // Wait for redirect after login
    await page.waitForTimeout(1000) // Wait for auth state to settle

    // Dismiss daily login bonus modal if present
    const bonusButton = page.locator('text=Einsammeln!')
    if (await bonusButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await bonusButton.click()
      await page.waitForTimeout(500)
    }

    for (const route of AUTH_ROUTES) {
      await test.step(`${route.name} (${route.path})`, async () => {
        const response = await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        })

        expect(response.status(), `${route.name} should return 200`).toBe(200)

        // Should NOT be on login page
        expect(page.url(), `${route.name} should not redirect to login`).not.toContain('/login')

        // Check no React error boundary
        const errorBoundary = page.locator('text=Something went wrong')
        const hasError = await errorBoundary.isVisible().catch(() => false)
        expect(hasError, `${route.name} should not show error boundary`).toBe(false)

        // Check page has content
        const body = await page.locator('body').textContent()
        expect(body.length, `${route.name} should have content`).toBeGreaterThan(10)
      })
    }

    const criticalErrors = errors.filter(
      (e) =>
        !e.message.includes('useTranslation') &&
        !e.message.includes('i18next') &&
        !e.message.includes('DevTools')
    )

    if (criticalErrors.length > 0) {
      console.log('JS Errors found:', criticalErrors)
    }
  })

  test('Sidebar navigation links work', async ({ page }) => {
    // Login first for full access
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test@mindforge.dev')
    await page.fill('input[type="password"]', 'test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/')
    await page.waitForTimeout(1000)

    // Dismiss daily login bonus modal if present
    const bonusButton = page.locator('text=Einsammeln!')
    if (await bonusButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await bonusButton.click()
      await page.waitForTimeout(500)
    }

    // Ensure sidebar is visible (desktop width)
    await page.setViewportSize({ width: 1280, height: 720 })

    const sidebarTabs = [
      { label: 'Home', expectedPath: '/' },
      { label: 'Quests', expectedPath: '/quests' },
      { label: 'Chat', expectedPath: '/chat' },
      { label: 'Gruppen', expectedPath: '/groups' },
      { label: 'Friends', expectedPath: '/friends' },
      { label: 'Avatar', expectedPath: '/avatar' },
      { label: 'Inventory', expectedPath: '/inventory' },
      { label: 'Shop', expectedPath: '/shop' },
    ]

    for (const tab of sidebarTabs) {
      await test.step(`Click sidebar tab: ${tab.label}`, async () => {
        const sidebar = page.locator('aside[aria-label="Sidebar navigation"]')
        const link = sidebar.locator(`a:has-text("${tab.label}")`).first()

        await expect(link, `Sidebar should have "${tab.label}" link`).toBeVisible({ timeout: 5000 })
        await link.click()
        await page.waitForLoadState('networkidle')

        expect(
          page.url().includes(tab.expectedPath),
          `Clicking ${tab.label} should navigate to ${tab.expectedPath}, got ${page.url()}`
        ).toBe(true)
      })
    }
  })
})
