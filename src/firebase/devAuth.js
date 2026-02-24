/**
 * Dev-Mode Authentication
 * Replaces Firebase Auth for local development when no Firebase project is configured.
 * Credentials are loaded from .env.local (not committed to git).
 */

if (!import.meta.env.DEV) {
  throw new Error('devAuth.js should only be loaded in development mode')
}

const TEST_ACCOUNTS = [
  {
    uid: 'dev-user-001',
    email: import.meta.env.VITE_DEV_EMAIL_1 || 'test@mindforge.dev',
    password: import.meta.env.VITE_DEV_PASSWORD_1 || 'test1234',
    profile: {
      uid: 'dev-user-001',
      username: 'TestPlayer',
      email: import.meta.env.VITE_DEV_EMAIL_1 || 'test@mindforge.dev',
      createdAt: new Date('2025-01-01'),
      avatar: { skinColor: '#ffcc99', hairColor: '#4a90d9', hairStyle: 'short', eyes: 'round' },
      bio: 'Premium Test Account',
      isPremium: true,
      premiumTier: 'pro',
      isTeacher: false,
      totalPlays: 0,
      gamesCreated: 0,
      followers: 0,
      following: 0,
      mindCoins: 0,
      theme: 'dark',
      activeTitle: 'MindForge Pioneer',
      hasSeenWelcome: true,
    },
  },
  {
    uid: 'dev-user-dev',
    email: import.meta.env.VITE_DEV_EMAIL_2 || 'dev@mindforge.dev',
    password: import.meta.env.VITE_DEV_PASSWORD_2 || 'dev1234',
    profile: {
      uid: 'dev-user-dev',
      username: 'DevAccount',
      email: import.meta.env.VITE_DEV_EMAIL_2 || 'dev@mindforge.dev',
      createdAt: new Date('2024-01-01'),
      avatar: { skinColor: '#f5d0a9', hairColor: '#ff6600', hairStyle: 'short', eyes: 'happy' },
      bio: 'Developer Super-Account - Voller Zugriff auf alle Features',
      isPremium: true,
      premiumTier: 'dev',
      isTeacher: true,
      totalPlays: 0,
      gamesCreated: 0,
      followers: 0,
      following: 0,
      mindCoins: 99999,
      theme: 'dark',
      activeTitle: 'Developer',
      hasSeenWelcome: true,
    },
  },
]

const STORAGE_KEY = 'mindforge_dev_user'
const DB_STORAGE_KEY = 'mindforge_dev_firestore'

// Firestore mock with localStorage persistence
function loadDevFirestore() {
  try {
    const stored = localStorage.getItem(DB_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return {}
}

const devFirestore = loadDevFirestore()

function persistFirestore() {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(devFirestore))
  } catch { /* ignore */ }
}

// Initialize test data (only if not already persisted)
TEST_ACCOUNTS.forEach((acc) => {
  if (!devFirestore['users']) devFirestore['users'] = {}
  if (!devFirestore['users'][acc.uid]) {
    devFirestore['users'][acc.uid] = acc.profile
  }
})
persistFirestore()

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

const authStateCallbacks = new Set()

export const devAuth = {
  currentUser: getStoredUser(),

  onAuthStateChanged(callback) {
    authStateCallbacks.add(callback)
    // Fire immediately with current state
    setTimeout(() => callback(this.currentUser), 0)
    return () => { authStateCallbacks.delete(callback) }
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
    authStateCallbacks.forEach(cb => cb(user))
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
    authStateCallbacks.forEach(cb => cb(user))
    return { user }
  },

  async signOut() {
    this.currentUser = null
    storeUser(null)
    authStateCallbacks.forEach(cb => cb(null))
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

  async setDoc(ref, data, options) {
    if (!devFirestore[ref._collection]) devFirestore[ref._collection] = {}
    if (options?.merge) {
      devFirestore[ref._collection][ref._id] = {
        ...(devFirestore[ref._collection][ref._id] || {}),
        ...data,
      }
    } else {
      devFirestore[ref._collection][ref._id] = { ...data }
    }
    persistFirestore()
  },

  async deleteDoc(ref) {
    if (devFirestore[ref._collection]) {
      delete devFirestore[ref._collection][ref._id]
      persistFirestore()
    }
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
