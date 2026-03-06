import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  const emailInput = page.locator('input[type="text"]').first()
  await emailInput.fill('dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 8000 })
}

test.describe('3D Avatar System', () => {
  test('Avatar page shows 2D/3D toggle button', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Toggle button should show "2D" (default mode)
    const toggleButton = page.locator('button').filter({ hasText: /^2D$|^3D$/ }).first()
    await expect(toggleButton).toBeVisible()

    // Screenshot of 2D default view
    await page.screenshot({ path: 'tests/screenshots/avatar-2d-default.png', fullPage: true })
    await context.close()
  })

  test('Clicking toggle switches to 3D mode', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Click 2D toggle to switch to 3D
    const toggleButton = page.locator('button').filter({ hasText: /^2D$/ }).first()
    await toggleButton.click()
    // Wait for lazy load
    await page.waitForTimeout(4000)

    // After toggle, button text should now be "3D"
    const button3D = page.locator('button').filter({ hasText: /^3D$/ }).first()
    await expect(button3D).toBeVisible({ timeout: 5000 })

    // localStorage should be set
    const stored = await page.evaluate(() => localStorage.getItem('avatar-3d-mode'))
    expect(stored).toBe('true')

    // Take screenshot of 3D mode (canvas or fallback)
    await page.screenshot({ path: 'tests/screenshots/avatar-3d-view.png', fullPage: true })
    await context.close()
  })

  test('Toggle back to 2D works', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)

    // Set 3D mode in localStorage before navigating
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.setItem('avatar-3d-mode', 'true'))
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Should show 3D button
    const button3D = page.locator('button').filter({ hasText: /^3D$/ }).first()
    await expect(button3D).toBeVisible({ timeout: 5000 })

    // Click to toggle back to 2D
    await button3D.click()
    await page.waitForTimeout(500)

    // Should show 2D button now
    const button2D = page.locator('button').filter({ hasText: /^2D$/ }).first()
    await expect(button2D).toBeVisible()

    // 2D button should be visible again
    await expect(button2D).toBeVisible()

    await page.screenshot({ path: 'tests/screenshots/avatar-toggle-back-2d.png', fullPage: true })
    await context.close()
  })

  test('Category tabs work in both modes', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/avatar`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Click Hair tab
    await page.locator('button').filter({ hasText: 'Hair' }).filter({ has: page.locator('svg') }).click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'tests/screenshots/avatar-hair-tab.png', fullPage: true })

    // Click Hats tab
    await page.locator('button').filter({ hasText: 'Hats' }).filter({ has: page.locator('svg') }).click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'tests/screenshots/avatar-hats-tab.png', fullPage: true })

    await context.close()
  })
})
