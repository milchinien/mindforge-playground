import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
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
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (userDoc.exists()) {
      setUser({ uid: result.user.uid, ...userDoc.data() })
    }
    return result
  }

  const register = async (username, email, password) => {
    // Check username uniqueness
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

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
