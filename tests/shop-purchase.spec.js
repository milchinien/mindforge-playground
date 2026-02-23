import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'dev@mindforge.dev')
  await page.fill('input[type="password"]', 'dev1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/', { timeout: 5000 })
}

test.describe('Shop Purchase System', () => {
  test('Shop page shows MindCoin balance', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: 'MindCoins Shop' })).toBeVisible()
    await expect(page.locator('text=Dein Guthaben')).toBeVisible()
    // Dev account has 99999 MindCoins
    await expect(page.locator('text=99.999 MindCoins')).toBeVisible()

    await context.close()
  })

  test('Shop shows three main package cards', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    await expect(page.getByRole('heading', { name: 'Starter' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Standard' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Premium' })).toBeVisible()

    await context.close()
  })

  test('Clicking main package Kaufen opens purchase modal', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Click Starter package Kaufen button (skip seasonal offers by targeting the package grid)
    const starterCard = page.locator('.grid >> div:has(h3:text("Starter"))').first()
    await starterCard.locator('button:text("Kaufen")').click()

    // Modal should appear
    await expect(page.locator('text=MindCoins kaufen')).toBeVisible()
    await expect(page.locator('text=Starter-Paket')).toBeVisible()
    await expect(page.getByText('500 MindCoins', { exact: true })).toBeVisible()

    // Payment method placeholder
    await expect(page.locator('text=Kommt bald: Kreditkarte, PayPal')).toBeVisible()

    // Discount code section
    await expect(page.getByRole('heading', { name: 'Rabattcode' })).toBeVisible()
    await expect(page.locator('input[placeholder="Code eingeben..."]')).toBeVisible()

    // Purchase button should be disabled (no payment method)
    const purchaseBtn = page.locator('button:text("Zahlungsmethode erforderlich")')
    await expect(purchaseBtn).toBeVisible()
    await expect(purchaseBtn).toBeDisabled()

    await context.close()
  })

  test('Invalid discount code shows error', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    const starterCard = page.locator('.grid >> div:has(h3:text("Starter"))').first()
    await starterCard.locator('button:text("Kaufen")').click()
    await expect(page.locator('text=MindCoins kaufen')).toBeVisible()

    // Enter invalid code
    await page.fill('input[placeholder="Code eingeben..."]', 'INVALIDCODE')
    await page.click('button:text("Einloesen")')

    await expect(page.locator('text=Ungueltiger Rabattcode')).toBeVisible()

    await context.close()
  })

  test('Valid discount code MindForge enables free purchase', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Click Starter Kaufen
    const starterCard = page.locator('.grid >> div:has(h3:text("Starter"))').first()
    await starterCard.locator('button:text("Kaufen")').click()
    await expect(page.locator('text=MindCoins kaufen')).toBeVisible()

    // Enter valid code
    await page.fill('input[placeholder="Code eingeben..."]', 'MindForge')
    await page.click('button:text("Einloesen")')

    // Should show success
    await expect(page.locator('text=100% Rabatt angewendet!')).toBeVisible()

    // Price should show "Kostenlos"
    await expect(page.locator('text=Kostenlos').first()).toBeVisible()

    // Button should now be "Kostenlos bestellen" and enabled
    const freeBtn = page.locator('button:text("Kostenlos bestellen")')
    await expect(freeBtn).toBeVisible()
    await expect(freeBtn).toBeEnabled()

    await context.close()
  })

  test('Completing free purchase shows success and updates balance', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Click Starter Kaufen
    const starterCard = page.locator('.grid >> div:has(h3:text("Starter"))').first()
    await starterCard.locator('button:text("Kaufen")').click()

    // Apply discount
    await page.fill('input[placeholder="Code eingeben..."]', 'MindForge')
    await page.click('button:text("Einloesen")')
    await expect(page.locator('text=100% Rabatt angewendet!')).toBeVisible()

    // Complete purchase
    await page.click('button:text("Kostenlos bestellen")')

    // Should show success screen
    await expect(page.locator('text=Erfolgreich!')).toBeVisible()
    await expect(page.locator('text=500 MindCoins wurden gutgeschrieben')).toBeVisible()

    // Close modal
    await page.click('button:text("Schliessen")')

    await context.close()
  })

  test('Modal closes on X button', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    const starterCard = page.locator('.grid >> div:has(h3:text("Starter"))').first()
    await starterCard.locator('button:text("Kaufen")').click()
    await expect(page.locator('text=MindCoins kaufen')).toBeVisible()

    // Click X button
    await page.locator('button[aria-label="Schliessen"]').click()

    // Modal should be gone
    await expect(page.locator('text=MindCoins kaufen')).not.toBeVisible()

    await context.close()
  })

  test('Standard package shows bonus info', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Click Standard Kaufen
    const standardCard = page.locator('.grid >> div:has(h3:text("Standard"))').first()
    await standardCard.locator('button:text("Kaufen")').click()

    await expect(page.locator('text=Standard-Paket')).toBeVisible()
    await expect(page.locator('text=1.400 MindCoins')).toBeVisible()
    await expect(page.locator('text=+200 Bonus inkludiert')).toBeVisible()

    await context.close()
  })

  test('Seasonal offers section is visible', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Seasonal offers section
    await expect(page.locator('text=Aktuelle Angebote')).toBeVisible()

    await context.close()
  })

  test('More packages toggle shows extra packages', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    await login(page)
    await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })

    // Click "Mehr Pakete anzeigen"
    await page.locator('text=Mehr Pakete anzeigen').click()
    await page.waitForTimeout(300)

    // Extra packages should appear
    await expect(page.locator('text=Grosse Pakete')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mega' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ultra' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Diamant' })).toBeVisible()

    await context.close()
  })
})
