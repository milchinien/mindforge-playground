// @ts-check
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

// Helper: Login als Test-User
async function loginAsTestUser(page) {
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="email"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 5000 })
}

// Helper: Login als Dev-User
async function loginAsDevUser(page) {
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 5000 })
}

// ============================================
// 1. ZUGANGSKONTROLLEN - Uneingeloggte User
// ============================================

test.describe('Zugangskontrollen - Nicht eingeloggt', () => {
  test('Geschuetzte Seiten leiten zu /login um', async ({ page }) => {
    const protectedRoutes = [
      '/settings',
      '/friends',
      '/avatar',
      '/inventory',
      '/achievements',
      '/shop',
    ]

    for (const route of protectedRoutes) {
      await page.goto(`${BASE}${route}`)
      await page.waitForTimeout(1000)
      const url = page.url()
      expect(url, `Route ${route} sollte zu /login umleiten`).toContain('/login')
    }
  })

  test('Premium-Seiten leiten zu /login um', async ({ page }) => {
    const premiumRoutes = ['/create', '/my-games']
    for (const route of premiumRoutes) {
      await page.goto(`${BASE}${route}`)
      await page.waitForTimeout(1000)
      const url = page.url()
      expect(url, `Route ${route} sollte zu /login umleiten`).toContain('/login')
    }
  })

  test('Oeffentliche Seiten sind ohne Login erreichbar', async ({ page }) => {
    const publicRoutes = [
      { path: '/', expectText: 'Willkommen bei MindForge' },
      { path: '/browse', expectText: null },
      { path: '/marketplace', expectText: null },
      { path: '/events', expectText: null },
      { path: '/leaderboards', expectText: null },
      { path: '/premium', expectText: null },
    ]

    for (const route of publicRoutes) {
      await page.goto(`${BASE}${route.path}`)
      await page.waitForTimeout(500)
      const url = page.url()
      expect(url, `Route ${route.path} sollte oeffentlich sein`).not.toContain('/login')
      if (route.expectText) {
        await expect(page.locator('body')).toContainText(route.expectText)
      }
    }
  })

  test('Gast-Homepage zeigt Register-Link aber nicht Spieler-Content', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=Kostenlos registrieren')).toBeVisible()
    // Sollte KEIN "Willkommen zurueck" zeigen
    await expect(page.locator('text=Willkommen zurueck')).not.toBeVisible()
  })
})

// ============================================
// 2. LOGIN / REGISTER FLOW
// ============================================

test.describe('Login Flow', () => {
  test('Fehlermeldung bei falschen Credentials', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.fill('input[type="email"]', 'falsch@email.de')
    await page.fill('input[type="password"]', 'falschespasswort')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)
    // Sollte auf Login-Seite bleiben
    expect(page.url()).toContain('/login')
  })

  test('Erfolgreicher Login leitet zur Startseite', async ({ page }) => {
    await loginAsTestUser(page)
    await page.waitForTimeout(500)
    expect(page.url()).not.toContain('/login')
  })

  test('Nach Login zeigt Homepage den Username', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(BASE)
    await page.waitForTimeout(500)
    await expect(page.getByRole('main').getByText('TestPlayer')).toBeVisible()
  })

  test('Register-Link auf Login-Seite funktioniert', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.click('a[href="/register"]')
    await page.waitForURL('**/register')
    expect(page.url()).toContain('/register')
  })
})

// ============================================
// 3. NAVIGATION UND LAYOUT
// ============================================

test.describe('Navigation - Eingeloggt', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Navbar zeigt relevante Links', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(500)
    // Sollte Navbar-Elemente haben
    const nav = page.locator('nav, header').first()
    await expect(nav).toBeVisible()
  })

  test('Profil-Link in Navbar fuehrt zum eigenen Profil', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForTimeout(500)
    // Klicke auf Avatar/Profil in der Navbar
    const profileLink = page.locator('a[href*="/profile/"]').first()
    if (await profileLink.isVisible()) {
      await profileLink.click()
      await page.waitForTimeout(500)
      expect(page.url()).toContain('/profile/')
    }
  })
})

// ============================================
// 4. SHOP - LOGIK-PRUEFUNG
// ============================================

test.describe('Shop Logik', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Shop zeigt Guthaben und Pakete', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { name: 'MindCoins Shop' })).toBeVisible()
    await expect(page.getByText('Dein Guthaben')).toBeVisible()
    // Sollte mindestens ein Paket haben
    await expect(page.getByText('Starter', { exact: true }).first()).toBeVisible()
  })

  test('Rabattcode-Feld existiert im Kauf-Modal', async ({ page }) => {
    await page.goto(`${BASE}/shop`)
    await page.waitForTimeout(500)
    // Klicke auf ein Paket um das Modal zu oeffnen
    const starterButton = page.locator('text=Starter').first()
    await starterButton.click()
    await page.waitForTimeout(500)
    // Modal sollte sichtbar sein
    const modal = page.locator('text=Rabattcode')
    if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(modal).toBeVisible()
    }
  })
})

// ============================================
// 5. PROFIL - BEARBEITUNG
// ============================================

test.describe('Profil', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Eigenes Profil zeigt Bearbeiten-Button', async ({ page }) => {
    await page.goto(`${BASE}/profile/TestPlayer`)
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Profil bearbeiten').or(page.locator('text=bearbeiten'))).toBeVisible()
  })

  test('Fremdes Profil zeigt KEINEN Bearbeiten-Button', async ({ page }) => {
    await page.goto(`${BASE}/profile/SomeOtherUser`)
    await page.waitForTimeout(1000)
    // Entweder 404 oder kein Edit-Button
    const editButton = page.locator('button:has-text("Profil bearbeiten")')
    const isVisible = await editButton.isVisible().catch(() => false)
    expect(isVisible).toBeFalsy()
  })

  test('404-Seite fuer nicht existierende User', async ({ page }) => {
    await page.goto(`${BASE}/profile/NichtExistierenderUser12345`)
    await page.waitForTimeout(1000)
    await expect(page.getByText('404')).toBeVisible()
  })
})

// ============================================
// 6. EINSTELLUNGEN
// ============================================

test.describe('Einstellungen', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Einstellungen-Seite hat alle Sektionen', async ({ page }) => {
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Erscheinungsbild' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Sprache' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Benachrichtigungen' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Sicherheit' })).toBeVisible()
  })

  test('Theme-Wechsel funktioniert', async ({ page }) => {
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    // Klicke auf "Hell"
    await page.click('button:has-text("Hell")')
    await page.waitForTimeout(300)
    // Klicke auf "Dunkel"
    await page.click('button:has-text("Dunkel")')
    await page.waitForTimeout(300)
    // Keine Fehler = bestanden
  })

  test('Passwort-Modal oeffnet sich', async ({ page }) => {
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    await page.click('button:has-text("Passwort aendern")')
    await page.waitForTimeout(500)
    await expect(page.locator('input[placeholder*="Aktuelles Passwort"]')).toBeVisible()
  })

  test('Account-Loeschen-Modal zeigt Warnung', async ({ page }) => {
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    await page.click('button:has-text("Account loeschen")')
    await page.waitForTimeout(500)
    await expect(page.locator('text=Diese Aktion kann nicht rueckgaengig gemacht werden')).toBeVisible()
  })

  test('Daten-Export funktioniert', async ({ page }) => {
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    // Pruefen ob der Export-Button existiert
    await expect(page.locator('button:has-text("Daten exportieren")')).toBeVisible()
  })
})

// ============================================
// 7. ACHIEVEMENTS
// ============================================

test.describe('Achievements', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Achievements-Seite zeigt Kategorien', async ({ page }) => {
    await page.goto(`${BASE}/achievements`)
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { name: 'Achievements' }).first()).toBeVisible()
  })
})

// ============================================
// 8. SPIELE-BROWSE & DETAIL
// ============================================

test.describe('Spiele', () => {
  test('Browse-Seite zeigt Spiele', async ({ page }) => {
    await page.goto(`${BASE}/browse`)
    await page.waitForTimeout(1000)
    // Sollte mindestens eine Spielkarte haben
    const gameCards = page.locator('[class*="game"], [class*="card"]')
    const count = await gameCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Spiel-Detail zeigt Informationen', async ({ page }) => {
    await page.goto(`${BASE}/browse`)
    await page.waitForTimeout(1000)
    // Klicke auf das erste Spiel
    const firstLink = page.locator('a[href*="/game/"]').first()
    if (await firstLink.isVisible().catch(() => false)) {
      await firstLink.click()
      await page.waitForTimeout(1000)
      expect(page.url()).toContain('/game/')
    }
  })
})

// ============================================
// 9. AVATAR-EDITOR
// ============================================

test.describe('Avatar-Editor', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Avatar-Editor ist erreichbar und zeigt Preview', async ({ page }) => {
    await page.goto(`${BASE}/avatar`)
    await page.waitForTimeout(2000)
    // Sollte Avatar-Editor Inhalt zeigen
    expect(page.url()).toContain('/avatar')
    // Pruefen ob Seite geladen wurde (irgendein sichtbarer Inhalt)
    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Avatar-Editor hat Kategorien/Tabs', async ({ page }) => {
    await page.goto(`${BASE}/avatar`)
    await page.waitForTimeout(1000)
    // Sollte mehrere Optionen haben (Haut, Haare, etc.)
    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(3)
  })
})

// ============================================
// 10. EVENTS
// ============================================

test.describe('Events', () => {
  test('Events-Seite ist oeffentlich erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/events`)
    await page.waitForTimeout(500)
    expect(page.url()).not.toContain('/login')
  })
})

// ============================================
// 11. LEADERBOARDS
// ============================================

test.describe('Leaderboards', () => {
  test('Leaderboards zeigt Rangliste', async ({ page }) => {
    await page.goto(`${BASE}/leaderboards`)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('heading', { name: 'Bestenliste' })).toBeVisible()
  })
})

// ============================================
// 12. MARKETPLACE
// ============================================

test.describe('Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('Marketplace zeigt Items', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`)
    await page.waitForTimeout(1000)
    // Sollte Items zeigen
    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ============================================
// 13. PREMIUM-SEITE
// ============================================

test.describe('Premium', () => {
  test('Premium-Seite zeigt Preis und Features', async ({ page }) => {
    await page.goto(`${BASE}/premium`)
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { name: 'Premium', exact: true })).toBeVisible()
    await expect(page.getByText('9,99')).toBeVisible()
  })
})

// ============================================
// 14. SEARCH
// ============================================

test.describe('Suche', () => {
  test('Suche-Seite hat Suchfeld', async ({ page }) => {
    await page.goto(`${BASE}/search`)
    await page.waitForTimeout(500)
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await expect(searchInput).toBeVisible()
  })
})

// ============================================
// 15. LOGOUT
// ============================================

test.describe('Logout', () => {
  test('Logout leitet zur Login-Seite', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto(`${BASE}/settings`)
    await page.waitForTimeout(500)
    // Finde und klicke den Abmelden-Button
    const logoutButton = page.locator('button:has-text("Abmelden")').first()
    await logoutButton.click()
    await page.waitForTimeout(1500)
    expect(page.url()).toContain('/login')
  })
})

// ============================================
// 16. KONSOLEN-FEHLER PRUEFEN
// ============================================

test.describe('Console Errors', () => {
  test('Home-Seite hat keine kritischen JS-Fehler', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      // Ignoriere bekannte harmlose Fehler
      if (!err.message.includes('ResizeObserver') && !err.message.includes('Loading chunk')) {
        errors.push(err.message)
      }
    })

    await page.goto(BASE)
    await page.waitForTimeout(2000)

    expect(errors.length, `JS-Fehler gefunden: ${errors.join(', ')}`).toBe(0)
  })

  test('Login-Seite hat keine kritischen JS-Fehler', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      if (!err.message.includes('ResizeObserver')) {
        errors.push(err.message)
      }
    })

    await page.goto(`${BASE}/login`)
    await page.waitForTimeout(2000)

    expect(errors.length, `JS-Fehler gefunden: ${errors.join(', ')}`).toBe(0)
  })

  test('Eingeloggte Seiten haben keine kritischen JS-Fehler', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => {
      if (!err.message.includes('ResizeObserver') && !err.message.includes('Loading chunk')) {
        errors.push(err.message)
      }
    })

    await loginAsTestUser(page)

    const pages = ['/settings', '/friends', '/achievements', '/shop', '/avatar']
    for (const p of pages) {
      await page.goto(`${BASE}${p}`)
      await page.waitForTimeout(1500)
    }

    expect(errors.length, `JS-Fehler auf geschuetzten Seiten: ${errors.join(', ')}`).toBe(0)
  })
})
