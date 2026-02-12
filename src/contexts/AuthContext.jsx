import { createContext, useContext, useState, useEffect } from 'react'
import { devAuth, devDb } from '../firebase/devAuth'

const USE_DEV_AUTH = import.meta.env.DEV

const SESSION_KEY = 'mindforge_session'

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function setSession(uid, email, rememberMe) {
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    uid, email, rememberMe,
    createdAt: Date.now(),
    expiresAt: Date.now() + duration,
  }))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_DEV_AUTH) {
      // Check for existing session first
      const session = getSession()
      if (session && !devAuth.currentUser) {
        // Restore session
        devAuth.currentUser = { uid: session.uid, email: session.email }
        const stored = localStorage.getItem('mindforge_dev_user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            devAuth.currentUser = parsed
          } catch { /* ignore */ }
        }
      }

      const unsubscribe = devAuth.onAuthStateChanged(async (devUser) => {
        if (devUser) {
          const userDoc = await devDb.getDoc(devDb.doc('users', devUser.uid))
          if (userDoc.exists()) {
            setUser({ uid: devUser.uid, ...userDoc.data() })
          } else {
            setUser({ uid: devUser.uid, email: devUser.email })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })
      return unsubscribe
    }

    // Production: use Firebase
    let unsubscribe
    Promise.all([
      import('firebase/auth'),
      import('firebase/firestore'),
      import('../firebase/config'),
    ]).then(([firebaseAuth, firebaseFirestore, firebaseConfig]) => {
      unsubscribe = firebaseAuth.onAuthStateChanged(firebaseConfig.auth, async (firebaseUser) => {
        if (firebaseUser) {
          const docRef = firebaseFirestore.doc(firebaseConfig.db, 'users', firebaseUser.uid)
          const userDoc = await firebaseFirestore.getDoc(docRef)
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() })
          } else {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email })
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    }).catch((err) => {
      console.error('Firebase init failed:', err)
      setLoading(false)
    })
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  const login = async (email, password, rememberMe = false) => {
    if (USE_DEV_AUTH) {
      const result = await devAuth.signInWithEmailAndPassword(email, password)
      const userDoc = await devDb.getDoc(devDb.doc('users', result.user.uid))
      if (userDoc.exists()) {
        setUser({ uid: result.user.uid, ...userDoc.data() })
      }
      setSession(result.user.uid, email, rememberMe)
      return result
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { doc, getDoc } = await import('firebase/firestore')
    const { auth, db } = await import('../firebase/config')
    const result = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (userDoc.exists()) {
      setUser({ uid: result.user.uid, ...userDoc.data() })
    }
    setSession(result.user.uid, email, rememberMe)
    return result
  }

  const register = async (username, email, password) => {
    if (USE_DEV_AUTH) {
      const q = devDb.query(devDb.collection('users'), devDb.where('username', '==', username))
      const snap = await devDb.getDocs(q)
      if (!snap.empty) throw new Error('Username bereits vergeben')

      const result = await devAuth.createUserWithEmailAndPassword(email, password)
      const userData = {
        uid: result.user.uid,
        username,
        email,
        createdAt: new Date(),
        avatar: { skinColor: '#ffcc99', hairColor: '#000000', hairStyle: 'short', eyes: 'round' },
        bio: '',
        isPremium: false,
        premiumTier: null,
        isTeacher: false,
        totalPlays: 0,
        gamesCreated: 0,
        followers: 0,
        following: 0,
        mindCoins: 0,
        theme: 'dark',
        activeTitle: null,
        hasSeenWelcome: false,
      }
      await devDb.setDoc(devDb.doc('users', result.user.uid), userData)
      setUser(userData)
      return result
    }

    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const { doc, setDoc, serverTimestamp, collection, query, where, getDocs } = await import('firebase/firestore')
    const { auth, db } = await import('../firebase/config')
    const q = query(collection(db, 'users'), where('username', '==', username))
    const snap = await getDocs(q)
    if (!snap.empty) throw new Error('Username bereits vergeben')

    const result = await createUserWithEmailAndPassword(auth, email, password)
    const userData = {
      uid: result.user.uid,
      username,
      email,
      createdAt: serverTimestamp(),
      avatar: { skinColor: '#ffcc99', hairColor: '#000000', hairStyle: 'short', eyes: 'round' },
      bio: '',
      isPremium: false,
      premiumTier: null,
      isTeacher: false,
      totalPlays: 0,
      gamesCreated: 0,
      followers: 0,
      following: 0,
      mindCoins: 0,
      theme: 'dark',
      activeTitle: null,
      hasSeenWelcome: false,
    }
    await setDoc(doc(db, 'users', result.user.uid), userData)
    setUser(userData)
    return result
  }

  const updateUser = async (updates) => {
    if (!user) return
    if (USE_DEV_AUTH) {
      await devDb.setDoc(devDb.doc('users', user.uid), updates, { merge: true })
    } else {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../firebase/config')
      await updateDoc(doc(db, 'users', user.uid), updates)
    }
    setUser(prev => ({ ...prev, ...updates }))
  }

  const logout = async () => {
    if (USE_DEV_AUTH) {
      await devAuth.signOut()
    } else {
      const { signOut } = await import('firebase/auth')
      const { auth } = await import('../firebase/config')
      await signOut(auth)
    }
    setUser(null)
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
