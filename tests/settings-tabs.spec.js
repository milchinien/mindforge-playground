import { test, expect } from '@playwright/test'

const login = async (page) => {
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="text"]', 'test@mindforge.dev')
  await page.fill('input[type="password"]', 'test1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:5173/', { timeout: 10000 })
  await page.goto('http://localhost:5173/settings')
  await expect(page.getByRole('heading', { name: /Settings|Einstellungen/i })).toBeVisible()
}

test('settings page has 4 tabs', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await expect(main.getByRole('button', { name: /General|Allgemein/i })).toBeVisible()
  await expect(main.getByRole('button', { name: /Notifications|Benachrichtigungen/i })).toBeVisible()
  await expect(main.getByRole('button', { name: /Account|Konto/i })).toBeVisible()
  await expect(main.getByRole('button', { name: /Privacy|Datenschutz/i })).toBeVisible()
})

test('general tab shows theme and language settings', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  // General tab should be active by default
  await expect(main.getByText(/Appearance|Erscheinungsbild/).first()).toBeVisible()
  await expect(main.getByText(/Language|Sprache/).first()).toBeVisible()
  await expect(main.getByText(/Sound Effects|Soundeffekte/)).toBeVisible()
  await expect(main.getByText(/Font Size|Schriftgroesse/)).toBeVisible()
})

test('can switch theme on general tab', async ({ page }) => {
  await login(page)

  const lightButton = page.locator('button', { hasText: /^Light$|^Hell$/ }).first()
  await lightButton.click()

  await expect(lightButton).toHaveClass(/bg-primary/)
})

test('notifications tab shows all toggles', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Notifications|Benachrichtigungen/i }).click()

  await expect(main.getByText('Achievements', { exact: true })).toBeVisible()
  await expect(main.getByText('Follows', { exact: true })).toBeVisible()
  await expect(main.getByText('Events', { exact: true })).toBeVisible()
  await expect(main.getByText('System', { exact: true })).toBeVisible()
  await expect(main.getByText(/Chat Messages|Chat-Nachrichten/)).toBeVisible()
  await expect(main.getByText(/Friend Activity|Freunde-Aktivitaet/)).toBeVisible()
})

test('can toggle a notification setting', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Notifications|Benachrichtigungen/i }).click()

  const toggles = main.getByRole('switch')
  const firstToggle = toggles.first()

  const initialState = await firstToggle.getAttribute('aria-checked')
  await firstToggle.click()
  const newState = await firstToggle.getAttribute('aria-checked')

  expect(newState).not.toBe(initialState)
})

test('account tab shows password and logout', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Account|Konto/i }).click()

  await expect(main.getByText(/Change password|Passwort aendern/)).toBeVisible()
  await expect(main.getByText(/Export data|Daten exportieren/)).toBeVisible()
  await expect(main.getByText(/Delete account|Account loeschen/).first()).toBeVisible()
  await expect(main.getByText(/Log out|Abmelden/).first()).toBeVisible()
})

test('password modal opens from account tab', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Account|Konto/i }).click()

  const changePasswordBtn = main.locator('button', { hasText: /Change password|Passwort aendern/ })
  await changePasswordBtn.click()

  await expect(page.getByPlaceholder(/Current password|Aktuelles Passwort/)).toBeVisible()
  await expect(page.getByPlaceholder(/New password|Neues Passwort/)).toBeVisible()
})

test('privacy tab shows visibility and status settings', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Privacy|Datenschutz/i }).click()

  await expect(main.getByText(/Profile Visibility|Profil-Sichtbarkeit/).first()).toBeVisible()
  await expect(main.getByText(/Online Status|Online-Status/).first()).toBeVisible()
  await expect(main.getByText(/Activity Status|Aktivitaetsstatus/).first()).toBeVisible()
  await expect(main.getByText(/^Messages$|^Nachrichten$/).first()).toBeVisible()
})

test('can change profile visibility on privacy tab', async ({ page }) => {
  await login(page)

  const main = page.locator('#main-content')
  await main.getByRole('button', { name: /Privacy|Datenschutz/i }).click()

  const friendsOnlyBtn = main.locator('button', { hasText: /Friends Only|Nur Freunde/ }).first()
  await friendsOnlyBtn.click()
  await expect(friendsOnlyBtn).toHaveClass(/bg-primary/)
})
