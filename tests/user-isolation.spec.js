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

test.describe('User Isolation - Recently Played & Likes', () => {

  test('Recently played is isolated per user', async ({ page }) => {
    // Clear recently played data only
    await page.goto(BASE)
    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter(k => k.startsWith('mindforge_recently_played_'))
        .forEach(k => localStorage.removeItem(k))
    })

    // Login as Account 1, play a game
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/play/game-001`)
    await page.waitForTimeout(2000)

    // Check that recently played key was created for this user
    const account1HasRecent = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k =>
        k.startsWith('mindforge_recently_played_') && k.includes('dev-user-001')
      )
      if (!key) return false
      const data = JSON.parse(localStorage.getItem(key))
      return data.includes('game-001')
    })
    expect(account1HasRecent).toBe(true)

    // Clear session, login as Account 2
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
    })
    await loginAs(page, 'dev@mindforge.dev', 'dev1234')

    // Account 2's recently played should be separate (empty or not containing game-001)
    const account2HasGame = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k =>
        k.startsWith('mindforge_recently_played_') && k.includes('dev-user-dev')
      )
      if (!key) return false
      const data = JSON.parse(localStorage.getItem(key))
      return data.includes('game-001')
    })
    expect(account2HasGame).toBe(false)
  })

  test('Likes are isolated per user - store structure', async ({ page }) => {
    // Login as Account 1, like a game via the page
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/game/game-002`)
    await page.waitForTimeout(1000)

    // Click like button
    const likeBtn = page.locator('button:has(.lucide-thumbs-up)').first()
    await expect(likeBtn).toBeVisible({ timeout: 5000 })
    await likeBtn.click()
    await page.waitForTimeout(500)

    // Verify liked state in store
    const storeAfterLike = await page.evaluate(() => {
      const raw = localStorage.getItem('mindforge-game-interactions-v2')
      if (!raw) return null
      return JSON.parse(raw)
    })
    expect(storeAfterLike).toBeTruthy()
    // Account 1's like should be stored under their userId
    expect(storeAfterLike.state.userLikes['dev-user-001']).toBeTruthy()
    expect(storeAfterLike.state.userLikes['dev-user-001']['game-002']).toBe(true)

    // Account 2 should NOT have a like for game-002
    const account2Likes = storeAfterLike.state.userLikes['dev-user-dev']
    const account2LikedGame = account2Likes ? account2Likes['game-002'] === true : false
    expect(account2LikedGame).toBe(false)
  })

  test('Like button reflects per-user state', async ({ page }) => {
    // Login as Account 1, like game-003
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/game/game-003`)
    await page.waitForTimeout(1000)

    const likeBtn = page.locator('button:has(.lucide-thumbs-up)').first()
    await expect(likeBtn).toBeVisible({ timeout: 5000 })
    await likeBtn.click()
    await page.waitForTimeout(500)

    // Should be green (liked)
    await expect(likeBtn).toHaveClass(/green/, { timeout: 3000 })

    // Switch to Account 2
    await page.evaluate(() => {
      localStorage.removeItem('mindforge_session')
      localStorage.removeItem('mindforge_dev_user')
    })
    await loginAs(page, 'dev@mindforge.dev', 'dev1234')
    await page.goto(`${BASE}/game/game-003`)
    await page.waitForTimeout(1000)

    // Like button should NOT be green for Account 2
    const likeBtn2 = page.locator('button:has(.lucide-thumbs-up)').first()
    await expect(likeBtn2).toBeVisible({ timeout: 5000 })
    const classes = await likeBtn2.getAttribute('class')
    expect(classes).not.toContain('green')
  })

  test('Star reviews are removed from game detail page', async ({ page }) => {
    await loginAs(page, 'test@mindforge.dev', 'test1234')
    await page.goto(`${BASE}/game/game-001`)
    await page.waitForTimeout(1000)

    // No star rating icons should be visible
    const starElements = await page.locator('.lucide-star').count()
    expect(starElements).toBe(0)

    // No review form
    const reviewForm = await page.locator('text=Bewertung schreiben').count()
    expect(reviewForm).toBe(0)
  })
})
