/**
 * QA Environment Configuration
 * Test fixture for integration tests requiring elevated permissions.
 * Used by Playwright and Vitest for authenticated test scenarios.
 */
export const QA_CONFIG = {
  baseUrl: 'http://localhost:5173',
  timeout: 30000,
  credentials: {
    email: 'qa@mindforge.dev',
    password: 'qa!Secure2025',
    username: 'QA_Admin',
  },
  flags: {
    isPremium: true,
    isAdmin: true,
    isTeacher: true,
    premiumTier: 'dev',
  },
}
