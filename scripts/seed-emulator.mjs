/**
 * Seed script for Firebase Emulators
 * Creates a premium test account for local development
 *
 * Test Account:
 *   Email:    test@mindforge.dev
 *   Password: test1234
 *   Username: TestPlayer
 */

const AUTH_URL = 'http://localhost:9099'
const FIRESTORE_URL = 'http://localhost:8080'
const PROJECT_ID = 'demo-mindforge'

async function seedTestAccount() {
  console.log('Seeding test account...')

  // 1. Create user in Auth Emulator
  const signUpRes = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@mindforge.dev',
        password: 'test1234',
        returnSecureToken: true,
      }),
    }
  )

  if (!signUpRes.ok) {
    const err = await signUpRes.json()
    if (err.error?.message === 'EMAIL_EXISTS') {
      console.log('Test account already exists, skipping.')
      return
    }
    throw new Error(`Auth signup failed: ${JSON.stringify(err)}`)
  }

  const { localId: uid } = await signUpRes.json()
  console.log(`Auth user created: ${uid}`)

  // 2. Create user document in Firestore Emulator
  const userData = {
    fields: {
      uid: { stringValue: uid },
      username: { stringValue: 'TestPlayer' },
      email: { stringValue: 'test@mindforge.dev' },
      createdAt: { timestampValue: new Date().toISOString() },
      avatar: {
        mapValue: {
          fields: {
            skinColor: { stringValue: '#ffcc99' },
            hairColor: { stringValue: '#4a90d9' },
            hairStyle: { stringValue: 'short' },
            eyes: { stringValue: 'round' },
          },
        },
      },
      bio: { stringValue: 'Premium Test Account for development' },
      isPremium: { booleanValue: true },
      premiumTier: { stringValue: 'pro' },
      isTeacher: { booleanValue: false },
      totalPlays: { integerValue: '42' },
      gamesCreated: { integerValue: '5' },
      followers: { integerValue: '100' },
      following: { integerValue: '25' },
      mindCoins: { integerValue: '500' },
      theme: { stringValue: 'dark' },
      activeTitle: { stringValue: 'MindForge Pioneer' },
      hasSeenWelcome: { booleanValue: true },
    },
  }

  const firestoreRes = await fetch(
    `${FIRESTORE_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?documentId=${uid}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }
  )

  if (!firestoreRes.ok) {
    const err = await firestoreRes.text()
    throw new Error(`Firestore write failed: ${err}`)
  }

  console.log('Firestore user document created.')
  console.log('')
  console.log('=== Test Account Ready ===')
  console.log('Email:    test@mindforge.dev')
  console.log('Password: test1234')
  console.log('Username: TestPlayer')
  console.log('Status:   Premium (Pro)')
  console.log('==========================')
}

// Wait for emulators to be ready, then seed
async function waitForEmulators(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fetch(`${AUTH_URL}/`)
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  throw new Error('Emulators did not start in time')
}

waitForEmulators()
  .then(() => seedTestAccount())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message)
    process.exit(1)
  })
