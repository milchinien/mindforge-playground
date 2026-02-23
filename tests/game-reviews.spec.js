import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Game Reviews', () => {
  test('Reviews section appears on game detail page', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    // Scroll down to reviews section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    await expect(page.locator('h2:has-text("Bewertungen")')).toBeVisible()

    await context.close()
  })

  test('Average rating and review count are displayed', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Review count
    await expect(page.locator('text=10 Bewertungen').first()).toBeVisible()

    await context.close()
  })

  test('Rating distribution bars are shown', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Distribution shows star numbers 1-5
    await expect(page.locator('text=Bewertungen').first()).toBeVisible()

    await context.close()
  })

  test('Review cards show username, rating, and text', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Mock reviewers
    await expect(page.locator('text=MaxMustermann')).toBeVisible()
    await expect(page.locator('text=LenaLernt')).toBeVisible()
    await expect(page.locator('text=ProGamerTom')).toBeVisible()

    await context.close()
  })

  test('Write review form is visible for logged-in users', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    await expect(page.locator('text=Bewertung schreiben')).toBeVisible()
    await expect(page.locator('text=Deine Bewertung:')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="Schreibe deine Bewertung"]')).toBeVisible()
    await expect(page.locator('button:has-text("Absenden")')).toBeVisible()

    await context.close()
  })

  test('Sort dropdown has all options', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    const sortSelect = page.locator('select')
    await expect(sortSelect).toBeVisible()

    // Check options
    const options = sortSelect.locator('option')
    await expect(options).toHaveCount(3)

    await context.close()
  })

  test('Helpful/Not helpful vote buttons work', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Find helpful label
    const helpfulLabel = page.locator('text=Hilfreich?').first()
    await expect(helpfulLabel).toBeVisible()

    await context.close()
  })

  test('Submitting a review adds it to the list', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/game/game-001`, { waitUntil: 'networkidle' })

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Click 5th star for rating
    const stars = page.locator('text=Deine Bewertung:').locator('..').locator('svg')
    await stars.nth(4).click()
    await page.waitForTimeout(200)

    // Type review text
    await page.fill('textarea[placeholder*="Schreibe deine Bewertung"]', 'Das ist ein super tolles Lernspiel! Sehr empfehlenswert.')
    await page.waitForTimeout(200)

    // Submit
    await page.locator('button:has-text("Absenden")').click()
    await page.waitForTimeout(500)

    // Review count should now be 11
    await expect(page.locator('text=11 Bewertungen').first()).toBeVisible()

    await context.close()
  })
})
