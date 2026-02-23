import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Multiplayer Quiz Arena', () => {
  test('Quiz page loads with lobby and title', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    await expect(page.locator('h1:has-text("Multiplayer Quiz")')).toBeVisible()
    await expect(page.locator('text=Tritt gegen andere Spieler an')).toBeVisible()

    await context.close()
  })

  test('Lobby shows create and join buttons', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    await expect(page.locator('text=Spiel erstellen')).toBeVisible()
    await expect(page.locator('text=Spiel beitreten')).toBeVisible()
    await expect(page.locator('text=Schnellspiel (mit Bots)')).toBeVisible()

    await context.close()
  })

  test('Create game shows room code and settings', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    // Click Spiel erstellen
    await page.locator('button:has-text("Spiel erstellen")').first().click()
    await page.waitForTimeout(300)

    // Room code section
    await expect(page.locator('text=Raumcode')).toBeVisible()
    // Category options
    await expect(page.locator('text=Mathematik')).toBeVisible()
    await expect(page.locator('text=Naturwissenschaft')).toBeVisible()
    await expect(page.locator('text=Allgemeinwissen')).toBeVisible()
    // Start button
    await expect(page.locator('button:has-text("Spiel starten")')).toBeVisible()

    await context.close()
  })

  test('Join mode shows code input', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    await page.locator('button:has-text("Spiel beitreten")').first().click()
    await page.waitForTimeout(300)

    await expect(page.locator('h2:has-text("Spiel beitreten")')).toBeVisible()
    await expect(page.locator('input[placeholder*="ABC123"]')).toBeVisible()
    await expect(page.locator('button:has-text("Beitreten")')).toBeVisible()

    await context.close()
  })

  test('Quick play starts game with questions', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    // Click Schnellspiel
    await page.locator('button:has-text("Schnellspiel")').click()
    await page.waitForTimeout(500)

    // Should show a question with Frage counter
    await expect(page.locator('text=Frage 1/')).toBeVisible({ timeout: 3000 })
    // Score display
    await expect(page.locator('text=Pkt')).toBeVisible()
    // Answer buttons (4 options in grid)
    const answerButtons = page.locator('.grid button')
    await expect(answerButtons).toHaveCount(4)

    await context.close()
  })

  test('Category selection changes active state', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    await page.locator('button:has-text("Spiel erstellen")').first().click()
    await page.waitForTimeout(300)

    // Click Mathematik category
    await page.locator('button:has-text("Mathematik")').click()
    await page.waitForTimeout(200)

    // Mathematik button should have accent styling
    const mathBtn = page.locator('button:has-text("Mathematik")')
    await expect(mathBtn).toHaveClass(/border-accent/)

    await context.close()
  })

  test('Answering a question shows result and advances', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    // Start quick play
    await page.locator('button:has-text("Schnellspiel")').click()
    await page.waitForTimeout(500)

    // Should be on Frage 1
    await expect(page.locator('text=Frage 1/')).toBeVisible({ timeout: 3000 })

    // Click first answer
    const firstAnswer = page.locator('.grid button').first()
    await firstAnswer.click()
    await page.waitForTimeout(3000)

    // Should advance to Frage 2
    await expect(page.locator('text=Frage 2/')).toBeVisible({ timeout: 5000 })

    await context.close()
  })

  test('Sidebar has Quiz Arena link', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

    await expect(page.locator('aside a:has-text("Quiz Arena")')).toBeVisible()

    await context.close()
  })

  test('Back button returns to lobby from create', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/quiz`, { waitUntil: 'networkidle' })

    await page.locator('button:has-text("Spiel erstellen")').first().click()
    await page.waitForTimeout(300)

    await page.locator('button:has-text("Zurueck")').click()
    await page.waitForTimeout(300)

    // Back to main lobby
    await expect(page.locator('h1:has-text("Multiplayer Quiz")')).toBeVisible()

    await context.close()
  })
})
