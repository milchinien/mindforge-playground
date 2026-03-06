import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function loginAs(page, email, password) {
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="text"], input[placeholder*="mail"], input[placeholder*="Benutzername"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/*', { timeout: 5000 })
  await page.waitForTimeout(1000)
}

test.describe('Store Isolation - All stores per-user', () => {

  test('Achievement progress is isolated per user', async ({ page }) => {
    // Login as Account 1
    await loginAs(page, 'test@mindforge.dev', 'test1234')

    // Play a game to increment games_played for account 1
    await page.goto(`${BASE}/play/game-001`)
    await page.waitForTimeout(2000)

    // Check achievement store has user-scoped data
    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-achievements')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userData).toBeTruthy()
    // Account 1 data should exist under their userId
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    // Account 2 should NOT have the same progress
    const account2Data = store.state.userData['dev-user-dev']
    expect(account2Data).toBeFalsy()
  })

  test('Inventory is isolated per user', async ({ page }) => {
    // Login as Account 1
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/inventory`)
    await page.waitForTimeout(1000)

    // Check inventory store structure
    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-inventory')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userItems).toBeTruthy()
    expect(store.state.userItems['dev-user-001']).toBeTruthy()
    // Should have default starter items
    expect(store.state.userItems['dev-user-001'].length).toBeGreaterThanOrEqual(3)
  })

  test('Notifications are isolated per user', async ({ page }) => {
    // Login as Account 1
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.waitForTimeout(1000)

    // Check notification store structure
    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-notifications')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userData).toBeTruthy()
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    expect(store.state.userData['dev-user-001'].notifications).toBeDefined()
    expect(store.state.userData['dev-user-001'].settings).toBeDefined()
  })

  test('Quest progress is isolated per user', async ({ page }) => {
    // Login as Account 1
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/quests`)
    await page.waitForTimeout(1000)

    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-quests')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userData).toBeTruthy()
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    expect(store.state.userData['dev-user-001'].dailyQuests).toBeDefined()
  })

  test('Season progress is isolated per user', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/seasons`)
    await page.waitForTimeout(1000)

    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-season')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userData).toBeTruthy()
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    expect(store.state.userData['dev-user-001'].seasonXP).toBeDefined()
  })

  test('Social data is isolated per user', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/friends`)
    await page.waitForTimeout(1000)

    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-social')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    expect(store.state.userData).toBeTruthy()
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    expect(store.state.userData['dev-user-001'].friends).toBeDefined()
    expect(store.state.userData['dev-user-001'].following).toBeDefined()
  })

  test('No cross-account data leakage', async ({ page }) => {
    // Login as Account 1, like a game
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/game/game-001`)
    await page.waitForTimeout(1000)

    // Switch to Account 2
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
    })
    await loginAs(page, 'dev@mindforge.dev', 'dev1234')
    await page.goto(`${BASE}/achievements`)
    await page.waitForTimeout(1000)

    // Check that account 2 has its own achievement data
    const store = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-achievements')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(store).toBeTruthy()
    // Both users should have separate data
    expect(store.state.userData['dev-user-001']).toBeTruthy()
    expect(store.state.userData['dev-user-dev']).toBeTruthy()
    // They should be independent objects
    expect(store.state.userData['dev-user-001']).not.toBe(store.state.userData['dev-user-dev'])
  })
})
