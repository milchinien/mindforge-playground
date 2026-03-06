import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

// Login-Helper
async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="text"], input[placeholder*="mail"], input[placeholder*="Benutzername"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/*', { timeout: 5000 })
  // Wait for auth to settle
  await page.waitForTimeout(1000)
}

test.describe('Chat System - User Isolation', () => {
  test('ForgeBot is available as first chat contact', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    // ForgeBot should be visible in the chat list
    const forgeBot = page.locator('text=ForgeBot')
    await expect(forgeBot.first()).toBeVisible({ timeout: 5000 })
  })

  test('ForgeBot shows AI badge', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    // AI badge should be visible
    const aiBadge = page.locator('text=AI')
    await expect(aiBadge.first()).toBeVisible({ timeout: 5000 })
  })

  test('ForgeBot welcome messages are shown on first open', async ({ page }) => {
    // Clear old chat data
    await page.goto(BASE)
    await page.evaluate(() => {
      localStorage.removeItem('mindforge-chat-v2')
    })

    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    // Click on ForgeBot
    const forgeBot = page.locator('button:has-text("ForgeBot")')
    await forgeBot.first().click()
    await page.waitForTimeout(500)

    // Welcome messages should appear
    await expect(page.locator('text=ForgeBot, dein persoenlicher Lernassistent')).toBeVisible({ timeout: 5000 })
  })

  test('Chat messages are isolated between accounts', async ({ page }) => {
    // Clear all session/chat data
    await page.goto(BASE)
    await page.evaluate(() => {
      localStorage.clear()
    })

    // Login as Account 1 and send a message
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    const forgeBot = page.locator('button:has-text("ForgeBot")')
    await forgeBot.first().click()
    await page.waitForTimeout(500)

    // Send a unique message
    const uniqueMsg = 'TestNachricht_Account1_' + Date.now()
    await page.fill('textarea, input[placeholder*="Nachricht"]', uniqueMsg)
    await page.click('button[aria-label="Nachricht senden"]')
    await page.waitForTimeout(500)

    // Verify message is visible in chat area (not sidebar preview)
    await expect(page.locator('.whitespace-pre-wrap', { hasText: uniqueMsg })).toBeVisible({ timeout: 3000 })

    // Clear session (simulate logout) but keep chat data to test isolation
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
    })

    // Login as Account 2
    await loginAs(page, 'dev@mindforge.dev', 'dev1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    await forgeBot.first().click()
    await page.waitForTimeout(500)

    // The unique message from Account 1 should NOT be visible
    const msgCount = await page.locator(`.whitespace-pre-wrap:has-text("${uniqueMsg}")`).count()
    expect(msgCount).toBe(0)
  })

  test('ForgeBot responds to messages', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => {
      localStorage.removeItem('mindforge-chat-v2')
    })

    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    const forgeBot = page.locator('button:has-text("ForgeBot")')
    await forgeBot.first().click()
    await page.waitForTimeout(500)

    // Send "Hallo"
    await page.fill('textarea, input[placeholder*="Nachricht"]', 'Hallo')
    await page.click('button[aria-label="Nachricht senden"]')

    // Wait for bot response
    await page.waitForTimeout(3000)

    // Bot should respond with a greeting (in chat bubble, not sidebar)
    await expect(page.locator('.whitespace-pre-wrap', { hasText: 'Wie kann ich dir heute beim Lernen helfen' })).toBeVisible({ timeout: 5000 })
  })

  test('ForgeBot gives subject-specific tips', async ({ page }) => {
    await page.goto(BASE)
    await page.evaluate(() => {
      localStorage.removeItem('mindforge-chat-v2')
    })

    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    const forgeBot = page.locator('button:has-text("ForgeBot")')
    await forgeBot.first().click()
    await page.waitForTimeout(500)

    // Ask about Mathe
    await page.fill('textarea, input[placeholder*="Nachricht"]', 'Ich brauche Hilfe bei Mathe')
    await page.click('button[aria-label="Nachricht senden"]')

    // Wait for bot response
    await page.waitForTimeout(3000)

    // Bot should mention Mathe-Meister game (in chat bubble, not sidebar)
    await expect(page.locator('.whitespace-pre-wrap', { hasText: 'Mathe-Meister' })).toBeVisible({ timeout: 5000 })
  })

  test('No mock friends (Max, Lena, Paul, Sarah) visible', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/chat`)
    await page.waitForTimeout(500)

    // Old mock friends should not be visible
    expect(await page.locator('text=MaxGamer99').count()).toBe(0)
    expect(await page.locator('text=LenaLernt').count()).toBe(0)
    expect(await page.locator('text=PixelPaul').count()).toBe(0)
    expect(await page.locator('text=SarahStar').count()).toBe(0)
  })
})
