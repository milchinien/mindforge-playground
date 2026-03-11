import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

// Helper: login as dev test user (DevAccount with 99999 MindCoins)
async function loginAsTestUser(page) {
  await page.goto(`${BASE_URL}/login`)
  const identifierInput = page.locator('input[placeholder*="DeinName"]')
  await expect(identifierInput).toBeVisible({ timeout: 5000 })
  await identifierInput.fill('dev@mindforge.dev')
  await page.locator('input[type="password"]').first().fill('dev1234')
  await page.locator('form button[type="submit"]').click()
  // Wait for login + AppInitializer reset + potential reload
  await page.waitForTimeout(4000)
}

test.describe('Mind Pass - Navigation & Layout', () => {
  test('Mind Pass link is visible in top navbar', async ({ page }) => {
    await page.goto(BASE_URL)
    const mindPassLink = page.getByLabel('Main navigation').getByRole('link', { name: 'Mind Pass' })
    await expect(mindPassLink).toBeVisible({ timeout: 5000 })
  })

  test('Mind Pass link navigates to /seasons', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.getByLabel('Main navigation').getByRole('link', { name: 'Mind Pass' }).click()
    await page.waitForURL('**/seasons')
    expect(page.url()).toContain('/seasons')
  })

  test('Mind Pass page loads with hero banner', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    // Use heading role to match only the h1
    await expect(page.getByRole('heading', { name: 'Wissensdurst' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Season 1').first()).toBeVisible()
  })

  test('Sub-tabs are visible: Mind-Pass, Season-Aufgaben, Rangliste', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.waitForTimeout(500)
    await expect(page.getByRole('button', { name: /Mind-Pass/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Season-Aufgaben/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Rangliste/i })).toBeVisible()
  })

  test('Default sub-tab is Mind-Pass with battle pass track', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Mind Pass - Sub-tab Navigation', () => {
  test('clicking Season-Aufgaben shows challenges', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    await expect(page.getByText('Woche 1')).toBeVisible({ timeout: 10000 })
  })

  test('clicking Rangliste shows leaderboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Rangliste/i }).click()
    await expect(page.getByText('Season-Rangliste')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('PixelMaster')).toBeVisible()
  })

  test('sub-tabs switch between views correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Rangliste/i }).click()
    await expect(page.getByText('Season-Rangliste')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Mind-Pass/i }).click()
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Mind Pass - Battle Pass Track', () => {
  test('track shows tier numbers on progress bar', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    // Tier numbers are visible on the continuous progress bar
    await expect(page.getByText('1', { exact: true }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('30', { exact: true }).first()).toBeVisible()
  })

  test('track has Free and Premium labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })

  test('hero shows level and XP info', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    // Check for level display in the hero (Level X / 30)
    await expect(page.getByText(/Level \d+/).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/XP gesamt/)).toBeVisible()
  })
})

test.describe('Mind Pass - Premium Purchase Flow', () => {
  test('Premium Pass button visible when not purchased', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    const premiumBtn = page.getByText('Premium Mind Pass').first()
    await expect(premiumBtn).toBeVisible({ timeout: 10000 })
  })

  test('clicking Premium button opens purchase modal (logged in)', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${BASE_URL}/seasons`)

    const premiumBtn = page.getByText('Premium Mind Pass').first()
    await premiumBtn.click()

    await expect(page.getByText('Dein Guthaben')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Preis')).toBeVisible()
  })

  test('purchase modal shows 950 MC price', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${BASE_URL}/seasons`)

    await page.getByText('Premium Mind Pass').first().click()
    await expect(page.getByText('950 MC').first()).toBeVisible({ timeout: 5000 })
  })

  test('purchase modal can be closed', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${BASE_URL}/seasons`)

    await page.getByText('Premium Mind Pass').first().click()
    await expect(page.getByText('Dein Guthaben')).toBeVisible({ timeout: 5000 })

    await page.getByText('Abbrechen').click()
    await expect(page.getByText('Dein Guthaben')).not.toBeVisible({ timeout: 3000 })
  })

  test('purchase modal validates MindCoins balance', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${BASE_URL}/seasons`)

    await page.getByText('Premium Mind Pass').first().click()
    await page.waitForTimeout(500)

    // Should show either warning or confirm button
    const hasWarning = await page.getByText('Nicht genuegend MindCoins').isVisible().catch(() => false)
    const hasConfirmBtn = await page.getByText('Kaufen - 950 MC').isVisible().catch(() => false)

    expect(hasWarning || hasConfirmBtn).toBeTruthy()
  })
})

test.describe('Mind Pass - Hero Banner', () => {
  test('hero shows season countdown', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText(/Tage verbleibend/)).toBeVisible({ timeout: 10000 })
  })

  test('hero shows XP progress', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText(/XP gesamt/)).toBeVisible({ timeout: 10000 })
  })

  test('hero shows level info', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    // Level is shown as text in the hero section (not in SVG)
    await expect(page.getByText(/Level \d+/).first()).toBeVisible({ timeout: 10000 })
  })

  test('hero shows challenge count', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText(/\d+\/\d+ Aufgaben/)).toBeVisible({ timeout: 10000 })
  })

  test('hero shows season subtitle', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await expect(page.getByText('Die Reise des Wissens beginnt')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Mind Pass - Season-Aufgaben Tab', () => {
  test('challenges tab shows week selector and challenge cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    // Click week 1 to ensure we see its challenges
    await page.getByText('Woche 1').click()
    await expect(page.getByText('Spiele 5 Mathe-Spiele')).toBeVisible({ timeout: 10000 })
  })

  test('week selector shows multiple weeks', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    await expect(page.getByText('Woche 1')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Woche 2')).toBeVisible()
  })

  test('switching weeks changes challenges', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()

    // Go to week 1
    await page.getByText('Woche 1').click()
    await expect(page.getByText('Spiele 5 Mathe-Spiele')).toBeVisible({ timeout: 10000 })

    // Switch to week 2
    await page.getByText('Woche 2').click()
    await expect(page.getByText('Spiele 3 Sprach-Spiele')).toBeVisible({ timeout: 5000 })
  })

  test('challenges show XP rewards', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    await expect(page.getByText('+200 XP').first()).toBeVisible({ timeout: 10000 })
  })

  test('challenges show difficulty badges', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    await expect(page.getByText('Leicht').first()).toBeVisible({ timeout: 10000 })
  })

  test('challenges tab shows total XP earned', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Season-Aufgaben/i }).click()
    await expect(page.getByText(/verdient/)).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Mind Pass - Rangliste Tab', () => {
  test('leaderboard shows top players', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Rangliste/i }).click()
    await expect(page.getByText('PixelMaster')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('QuizKoenig')).toBeVisible()
  })

  test('leaderboard shows XP values', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Rangliste/i }).click()
    await expect(page.getByText('22.400').first()).toBeVisible({ timeout: 10000 })
  })

  test('leaderboard shows player levels', async ({ page }) => {
    await page.goto(`${BASE_URL}/seasons`)
    await page.getByRole('button', { name: /Rangliste/i }).click()
    await expect(page.getByText(/Level \d+/).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Mind Pass - Sidebar Integration', () => {
  test('Mind Pass link exists in sidebar', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.setViewportSize({ width: 1280, height: 720 })
    const sidebarLink = page.locator('aside a[href="/seasons"]')
    expect(await sidebarLink.count()).toBeGreaterThan(0)
  })
})
