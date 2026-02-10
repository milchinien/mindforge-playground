/**
 * Dev-Mode Authentication
 * Replaces Firebase Auth for local development when no Firebase project is configured.
 *
 * Test Account:
 *   Email:    test@mindforge.dev
 *   Password: test1234
 *   Username: TestPlayer
 *   Status:   Premium (Pro)
 */

const TEST_ACCOUNTS = [
  {
    uid: 'dev-user-001',
    email: 'test@mindforge.dev',
    password: 'test1234',
    profile: {
      uid: 'dev-user-001',
      username: 'TestPlayer',
      email: 'test@mindforge.dev',
      createdAt: new Date('2025-01-01'),
      avatar: { skinColor: '#ffcc99', hairColor: '#4a90d9', hairStyle: 'short', eyes: 'round' },
      bio: 'Premium Test Account',
      isPremium: true,
      premiumTier: 'pro',
      isTeacher: false,
      totalPlays: 42,
      gamesCreated: 5,
      followers: 100,
      following: 25,
      mindCoins: 500,
      theme: 'dark',
      activeTitle: 'MindForge Pioneer',
      hasSeenWelcome: true,
    },
  },
]

const STORAGE_KEY = 'mindforge_dev_user'

// In-memory Firestore mock
const devFirestore = {}

// Initialize test data
TEST_ACCOUNTS.forEach((acc) => {
  if (!devFirestore['users']) devFirestore['users'] = {}
  devFirestore['users'][acc.uid] = acc.profile
})

function getStoredUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

let authStateCallback = null

export const devAuth = {
  currentUser: getStoredUser(),

  onAuthStateChanged(callback) {
    authStateCallback = callback
    // Fire immediately with current state
    setTimeout(() => callback(this.currentUser), 0)
    return () => { authStateCallback = null }
  },

  async signInWithEmailAndPassword(email, password) {
    const account = TEST_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    )
    if (!account) {
      const error = new Error('E-Mail oder Passwort falsch')
      error.code = 'auth/invalid-credential'
      throw error
    }
    const user = { uid: account.uid, email: account.email }
    this.currentUser = user
    storeUser(user)
    if (authStateCallback) authStateCallback(user)
    return { user }
  },

  async createUserWithEmailAndPassword(email, password) {
    if (TEST_ACCOUNTS.some((a) => a.email === email)) {
      const error = new Error('Email already in use')
      error.code = 'auth/email-already-in-use'
      throw error
    }
    const uid = 'dev-user-' + Date.now()
    const user = { uid, email }
    this.currentUser = user
    storeUser(user)
    if (authStateCallback) authStateCallback(user)
    return { user }
  },

  async signOut() {
    this.currentUser = null
    storeUser(null)
    if (authStateCallback) authStateCallback(null)
  },
}

export const devDb = {
  doc(collection, id) {
    return { _collection: collection, _id: id }
  },

  async getDoc(ref) {
    const data = devFirestore[ref._collection]?.[ref._id]
    return {
      exists() { return !!data },
      data() { return data ? { ...data } : undefined },
    }
  },

  async setDoc(ref, data) {
    if (!devFirestore[ref._collection]) devFirestore[ref._collection] = {}
    devFirestore[ref._collection][ref._id] = { ...data }
  },

  async getDocs(queryRef) {
    const col = devFirestore[queryRef._collection] || {}
    const results = Object.values(col).filter((doc) => {
      if (queryRef._where) {
        return doc[queryRef._where.field] === queryRef._where.value
      }
      return true
    })
    return {
      empty: results.length === 0,
      docs: results.map((d) => ({ data: () => d })),
    }
  },

  collection(name) {
    return { _collection: name }
  },

  query(colRef, ...constraints) {
    const whereConstraint = constraints.find((c) => c._type === 'where')
    return {
      _collection: colRef._collection,
      _where: whereConstraint ? { field: whereConstraint.field, value: whereConstraint.value } : null,
    }
  },

  where(field, _op, value) {
    return { _type: 'where', field, value }
  },

  serverTimestamp() {
    return new Date()
  },
}

export const isDevMode = true
