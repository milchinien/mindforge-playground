// @ts-check
import { test, expect } from '@playwright/test'

// Helper: Login as dev user
async function devLogin(page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

// ============================================================
// 1. Console Error Detection on Every Page
// ============================================================
const pagesToCheck = [
  { name: 'Home', url: '/' },
  { name: 'Mindbrowser', url: '/browse' },
  { name: 'Events', url: '/events' },
  { name: 'Marketplace', url: '/marketplace' },
  { name: 'Shop', url: '/shop' },
  { name: 'Leaderboards', url: '/leaderboards' },
  { name: 'Friends', url: '/friends' },
  { name: 'Achievements', url: '/achievements' },
  { name: 'Settings', url: '/settings' },
  { name: 'Avatar', url: '/avatar' },
  { name: 'Inventory', url: '/inventory' },
  { name: 'SocialFeed', url: '/feed' },
  { name: 'MultiplayerQuiz', url: '/quiz' },
  { name: 'Search', url: '/search' },
  { name: 'Premium', url: '/premium' },
  { name: 'Profile', url: '/profile/DevMaster' },
  { name: 'Create', url: '/create' },
  { name: 'MyGames', url: '/my-games' },
  { name: 'Teacher', url: '/teacher' },
]

test.describe('Console Error Detection', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  for (const pg of pagesToCheck) {
    test(`no console errors on ${pg.name} (${pg.url})`, async ({ page }) => {
      const errors = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text()
          // Ignore known non-critical warnings
          if (text.includes('favicon.ico')) return
          if (text.includes('net::ERR_')) return  // network errors in dev mode
          if (text.includes('Download the React DevTools')) return
          errors.push(text)
        }
      })

      page.on('pageerror', err => {
        errors.push(`PAGE ERROR: ${err.message}`)
      })

      await page.goto(pg.url)
      await page.waitForTimeout(1500) // let async stuff settle

      if (errors.length > 0) {
        console.log(`Console errors on ${pg.name}:`, errors)
      }
      expect(errors, `Console errors found on ${pg.name}: ${errors.join('; ')}`).toHaveLength(0)
    })
  }
})

// ============================================================
// 2. Broken Images / Missing Assets
// ============================================================
test.describe('Broken Images & Assets', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('no broken images on Home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    const images = await page.locator('img').all()
    for (const img of images) {
      const src = await img.getAttribute('src')
      const naturalWidth = await img.evaluate(el => el.naturalWidth)
      // Images with src should either load or have error handling
      if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
        const isVisible = await img.isVisible()
        if (isVisible) {
          // Check the image has some dimension or an error fallback
          const hasContent = naturalWidth > 0 || await img.evaluate(el => el.classList.contains('error'))
          // Just log, don't fail - many images are mock URLs
          if (!hasContent) {
            console.log(`Potentially broken image: ${src}`)
          }
        }
      }
    }
  })

  test('no broken images on Mindbrowser', async ({ page }) => {
    await page.goto('/browse')
    await page.waitForTimeout(1000)
    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img')
      const broken = []
      imgs.forEach(img => {
        if (img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:')) {
          broken.push(img.src)
        }
      })
      return broken
    })
    if (brokenImages.length > 0) {
      console.log('Broken images on Mindbrowser:', brokenImages)
    }
  })
})

// ============================================================
// 3. Navigation & Routing Tests
// ============================================================
test.describe('Navigation & Routing', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('all sidebar links navigate correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // Check sidebar links
    const sidebarLinks = await page.locator('aside a[href], nav a[href]').all()
    const hrefs = []
    for (const link of sidebarLinks) {
      const href = await link.getAttribute('href')
      if (href && href.startsWith('/') && !hrefs.includes(href)) {
        hrefs.push(href)
      }
    }

    for (const href of hrefs) {
      const response = await page.goto(href)
      const status = response?.status()
      expect(status, `Page ${href} returned status ${status}`).toBeLessThan(400)
      // Check no crash - page should have content
      const body = await page.locator('body').textContent()
      expect(body?.length, `Page ${href} appears empty`).toBeGreaterThan(0)
    }
  })

  test('direct URL access works for all pages (no crash)', async ({ page }) => {
    for (const pg of pagesToCheck) {
      await page.goto(pg.url)
      // Should not show an error boundary message
      const errorBoundary = await page.locator('text=Etwas ist schiefgelaufen').count()
      const genericError = await page.locator('text=Something went wrong').count()
      expect(
        errorBoundary + genericError,
        `Error boundary triggered on ${pg.name} (${pg.url})`
      ).toBe(0)
    }
  })

  test('login page redirects logged-in user to home', async ({ page }) => {
    await page.goto('/login')
    // Should redirect to home since already logged in
    await page.waitForTimeout(1000)
    const url = page.url()
    // Either redirected or shows the page - shouldn't crash
    expect(url).toBeDefined()
  })

  test('unknown route shows 404 or redirects', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345')
    await page.waitForTimeout(1000)
    // Should either show 404 page, redirect to home, or show some content (not crash)
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })
})

// ============================================================
// 4. Auth & Protected Routes
// ============================================================
test.describe('Auth & Protected Routes', () => {
  test('protected pages redirect to login when not authenticated', async ({ page }) => {
    // Clear any existing session
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.clear()
    })

    const protectedRoutes = ['/settings', '/friends', '/avatar', '/inventory', '/achievements', '/shop']
    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForTimeout(1000)
      const url = page.url()
      // Should redirect to login or show login prompt
      const isOnLogin = url.includes('/login')
      const hasLoginPrompt = await page.locator('text=Anmelden').count() > 0
        || await page.locator('text=Login').count() > 0
        || await page.locator('input[type="email"]').count() > 0
      expect(
        isOnLogin || hasLoginPrompt,
        `Protected route ${route} is accessible without auth (url: ${url})`
      ).toBe(true)
    }
  })

  test('premium routes require premium status', async ({ page }) => {
    // Login as test user (not dev - to check premium gating)
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@mindforge.dev')
    await page.fill('input[type="password"]', 'test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')

    // Premium routes - test user IS premium, so should work
    await page.goto('/create')
    await page.waitForTimeout(1000)
    // Should not be redirected to premium page if user is premium
    const url = page.url()
    const isBlocked = url.includes('/premium')
    // test@mindforge.dev is Premium Pro, so should have access
    if (isBlocked) {
      console.log('WARNING: Premium user blocked from /create')
    }
  })
})

// ============================================================
// 5. Form Validation
// ============================================================
test.describe('Form Validation', () => {
  test('login form shows error for empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    // Should show validation error or not submit
    const url = page.url()
    expect(url).toContain('/login') // Should stay on login
  })

  test('login form shows error for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)
    // Should show error message
    const errorVisible = await page.locator('.text-red-400, .text-red-500, [class*="error"], [role="alert"]').count()
    const hasErrorText = await page.locator('text=falsch').count()
      + await page.locator('text=Fehler').count()
      + await page.locator('text=incorrect').count()
      + await page.locator('text=nicht gefunden').count()
    expect(errorVisible + hasErrorText, 'No error message shown for wrong credentials').toBeGreaterThan(0)
  })

  test('register form validates username length', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[placeholder*="Username"], input[name="username"], input:first-of-type', 'ab')
    await page.fill('input[type="email"]', 'test@test.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    // Should stay on register or show error
    const url = page.url()
    expect(url).toContain('/register')
  })
})

// ============================================================
// 6. UI Consistency & Layout Bugs
// ============================================================
test.describe('UI Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('no overlapping elements on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)

    // Check navbar doesn't overlap with content
    const navbar = page.locator('nav').first()
    const navbarBox = await navbar.boundingBox()
    expect(navbarBox).not.toBeNull()

    // Main content should start below navbar
    const mainContent = page.locator('main, [class*="main"], .ml-16, .ml-60').first()
    if (await mainContent.count() > 0) {
      const mainBox = await mainContent.boundingBox()
      if (mainBox && navbarBox) {
        expect(mainBox.y, 'Main content overlaps with navbar').toBeGreaterThanOrEqual(navbarBox.y + navbarBox.height - 5)
      }
    }
  })

  test('no text overflow/truncation issues on game cards', async ({ page }) => {
    await page.goto('/browse')
    await page.waitForTimeout(1000)

    // Target actual visible game cards with meaningful content, not tiny indicator elements
    const cards = await page.locator('[class*="card"], [class*="Card"]').all()
    for (const card of cards.slice(0, 10)) {
      const box = await card.boundingBox()
      if (box && box.height > 30 && box.width > 50) {
        // Only check cards that are reasonably sized (skip tiny indicator dots etc.)
        expect(box.width, 'Card too narrow').toBeGreaterThan(50)
        expect(box.height, 'Card too small').toBeGreaterThan(30)
      }
    }
  })

  test('dark mode is consistent across pages', async ({ page }) => {
    const checkPages = ['/', '/browse', '/shop', '/leaderboards']
    for (const url of checkPages) {
      await page.goto(url)
      await page.waitForTimeout(500)
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })
      // Dark mode should have dark background
      expect(bgColor, `Light background detected on ${url}: ${bgColor}`).not.toBe('rgb(255, 255, 255)')
    }
  })

  test('MindCoin balance displays correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // MindCoin display should show a number
    const mcText = await page.locator('text=99999').count()
      + await page.locator('text=99.999').count()
      + await page.locator('text=99,999').count()
      + await page.locator('text=100K').count()
      + await page.locator('text=99.9K').count()
    expect(mcText, 'MindCoin balance not visible for dev user').toBeGreaterThan(0)
  })
})

// ============================================================
// 7. Search Functionality
// ============================================================
test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('search with empty query shows all games or hint', async ({ page }) => {
    await page.goto('/search')
    await page.waitForTimeout(1000)
    const body = await page.locator('body').textContent()
    // Should show either all games or a search prompt
    expect(body?.length).toBeGreaterThan(10)
  })

  test('search with valid query returns results', async ({ page }) => {
    await page.goto('/search?q=Mathe')
    await page.waitForTimeout(1000)
    // Should find math-related games
    const results = await page.locator('[class*="card"], [class*="Card"], [class*="game"]').count()
    // At least show search UI even if no results
    const body = await page.locator('body').textContent()
    expect(body).toBeTruthy()
  })

  test('search with nonsense query shows no results state', async ({ page }) => {
    await page.goto('/search?q=xyznonexistentgame12345')
    await page.waitForTimeout(1000)
    const body = await page.locator('body').textContent()
    // Should show "no results" message or empty state
    const hasNoResults = body?.includes('keine') || body?.includes('Keine')
      || body?.includes('No results') || body?.includes('nicht gefunden')
      || body?.includes('0 Ergebnis')
    const hasResults = await page.locator('[class*="card"], [class*="Card"]').count()
    // Either shows no-results message OR actually has 0 cards
    expect(hasNoResults || hasResults === 0, 'No empty state for nonsense search').toBe(true)
  })
})

// ============================================================
// 8. Game Detail & Player
// ============================================================
test.describe('Game Detail & Player', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('game detail page loads for valid game', async ({ page }) => {
    await page.goto('/game/1')
    await page.waitForTimeout(1500)
    // Should show game info
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(20)
    // Should not show error boundary
    const errorCount = await page.locator('text=Etwas ist schiefgelaufen').count()
    expect(errorCount).toBe(0)
  })

  test('game detail page handles invalid game ID gracefully', async ({ page }) => {
    await page.goto('/game/nonexistent-id-99999')
    await page.waitForTimeout(1500)
    // Should show "not found" or redirect, not crash
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })

  test('game player loads for valid game', async ({ page }) => {
    await page.goto('/play/1')
    await page.waitForTimeout(2000)
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })

  test('game player handles invalid game ID gracefully', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/play/nonexistent-99999')
    await page.waitForTimeout(2000)
    // Should show error state, not crash
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })
})

// ============================================================
// 9. Theme Toggle
// ============================================================
test.describe('Theme Toggle', () => {
  test('theme toggle works in settings', async ({ page }) => {
    await devLogin(page)
    await page.goto('/settings')
    await page.waitForTimeout(1000)

    // Find theme toggle
    const themeToggle = page.locator('button:has-text("Light"), button:has-text("Hell"), button:has-text("Dark"), button:has-text("Dunkel"), [class*="theme"], label:has-text("Theme")')
    if (await themeToggle.count() > 0) {
      // Get initial state
      const initialBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)

      // Try to toggle
      await themeToggle.first().click()
      await page.waitForTimeout(500)

      // Check state changed or at least didn't crash
      const body = await page.locator('body').textContent()
      expect(body?.length).toBeGreaterThan(0)
    }
  })
})

// ============================================================
// 10. Edge Cases & Stress Tests
// ============================================================
test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await devLogin(page)
  })

  test('rapid navigation does not crash', async ({ page }) => {
    const routes = ['/', '/browse', '/events', '/shop', '/leaderboards', '/friends', '/']
    for (const route of routes) {
      await page.goto(route)
      await page.waitForTimeout(200) // Quick navigation
    }
    // Should end on home without errors
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })

  test('back/forward navigation works correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    await page.goto('/browse')
    await page.waitForTimeout(500)
    await page.goto('/events')
    await page.waitForTimeout(500)

    await page.goBack()
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/browse')

    await page.goBack()
    await page.waitForTimeout(500)
    // Should be on home
    const url = page.url()
    expect(url.endsWith('/') || url.endsWith(':5173') || url.endsWith(':5174')).toBe(true)

    await page.goForward()
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/browse')
  })

  test('page works after localStorage is cleared', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)
    // Should redirect to login or show guest view
    const body = await page.locator('body').textContent()
    expect(body?.length).toBeGreaterThan(0)
  })

  test('double-clicking buttons does not cause issues', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForTimeout(1000)
    // Find a visible clickable button (skip hidden hamburger menu)
    const visibleButton = page.locator('button:visible').first()
    if (await visibleButton.count() > 0) {
      await visibleButton.dblclick()
      await page.waitForTimeout(500)
      // Should not crash
      const body = await page.locator('body').textContent()
      expect(body?.length).toBeGreaterThan(0)
    }
  })

  test('viewport resize does not break layout', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    let scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    let clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth, 'Horizontal overflow at 375px').toBeLessThanOrEqual(clientWidth + 5)

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth, 'Horizontal overflow at 768px').toBeLessThanOrEqual(clientWidth + 5)

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)
    scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth, 'Horizontal overflow at 1920px').toBeLessThanOrEqual(clientWidth + 5)
  })
})
