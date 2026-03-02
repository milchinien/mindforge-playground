import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import { PageLoader } from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import { useTranslation } from 'react-i18next'
import { useAchievementStore } from './stores/achievementStore'
import { useSocialStore } from './stores/socialStore'

// Lazy-loaded pages for code splitting
const AuthPage = lazy(() => import('./pages/auth/AuthPage'))
const Home = lazy(() => import('./pages/Home'))
const Mindbrowser = lazy(() => import('./pages/Mindbrowser'))
const GameDetail = lazy(() => import('./pages/GameDetail'))
const GamePlayer = lazy(() => import('./pages/GamePlayer'))
const Profile = lazy(() => import('./pages/Profile'))
const Search = lazy(() => import('./pages/Search'))
const Create = lazy(() => import('./pages/Create'))
const Avatar = lazy(() => import('./pages/Avatar'))
const Settings = lazy(() => import('./pages/Settings'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Premium = lazy(() => import('./pages/Premium'))
const Shop = lazy(() => import('./pages/Shop'))
const Events = lazy(() => import('./pages/Events'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const Friends = lazy(() => import('./pages/Friends'))
const Leaderboards = lazy(() => import('./pages/Leaderboards'))
const MultiplayerQuiz = lazy(() => import('./pages/MultiplayerQuiz'))
const SocialFeed = lazy(() => import('./pages/SocialFeed'))
const Quests = lazy(() => import('./pages/Quests'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const Seasons = lazy(() => import('./pages/Seasons'))
const TemplateMarketplace = lazy(() => import('./pages/TemplateMarketplace'))
const CreatorDashboard = lazy(() => import('./components/creatorDashboard/CreatorDashboard'))
const GiftMindCoins = lazy(() => import('./pages/GiftMindCoins'))

// PageLoader is imported from LoadingSpinner component

const RESET_VERSION = 'v27-data-persistence'
const STORE_KEYS_TO_CLEAR = [
  'mindforge-game-interactions',
  'mindforge-achievements',
  'mindforge-inventory',
  'mindforge-social',
  'mindforge-notifications',
  'mindforge-activity',
  'mindforge-quests',
  'mindforge-season',
]

function AppInitializer() {
  const { user, updateUser } = useAuth()

  // One-time reset for data persistence migration
  useEffect(() => {
    if (!user) return
    if (localStorage.getItem('mindforge-reset-version') === RESET_VERSION) return

    updateUser({
      followers: 0,
      following: 0,
      totalPlays: 0,
      gamesCreated: 0,
      mindCoins: 0,
      activeTitle: null,
      xp: 0,
    })

    STORE_KEYS_TO_CLEAR.forEach(key => localStorage.removeItem(key))
    localStorage.setItem('mindforge-reset-version', RESET_VERSION)
    window.location.reload()
  }, [user])

  // Daily streak check on login
  useEffect(() => {
    if (!user) return
    useAchievementStore.getState().checkDailyStreak()
  }, [user])

  // Simulate friend online status changes periodically
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      useSocialStore.getState().simulateOnlineStatus()
    }, 60000)
    return () => clearInterval(interval)
  }, [user])

  return null
}

function Placeholder({ title }) {
  const { t } = useTranslation()
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-text-secondary">{t('common.placeholderPage')}</p>
    </div>
  )
}

function App() {
  const { t } = useTranslation()
  return (
    <ErrorBoundary>
    <AuthProvider>
      <AppInitializer />
      <ToastProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth pages WITHOUT layout */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/play/:id" element={<GamePlayer />} />

              {/* All other pages WITH layout */}
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/browse" element={<Mindbrowser />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/leaderboards" element={<Leaderboards />} />
                      <Route path="/quiz" element={<MultiplayerQuiz />} />
                      <Route path="/feed" element={<SocialFeed />} />
                      <Route path="/quests" element={<Quests />} />
                      <Route path="/seasons" element={<Seasons />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/game/:id" element={<GameDetail />} />
                      <Route path="/templates" element={<TemplateMarketplace />} />
                      <Route path="/premium" element={<Premium />} />

                      {/* Profile - accessible without login to view others */}
                      <Route path="/profile/:username" element={<Profile />} />

                      {/* Protected routes */}
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                      <Route path="/avatar" element={<ProtectedRoute><Avatar /></ProtectedRoute>} />
                      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                      <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
                      <Route path="/gift" element={<ProtectedRoute><GiftMindCoins /></ProtectedRoute>} />

                      {/* Premium-only */}
                      <Route path="/create" element={<ProtectedRoute requirePremium><Create /></ProtectedRoute>} />
                      <Route path="/my-games" element={<ProtectedRoute requirePremium><CreatorDashboard /></ProtectedRoute>} />

                      {/* Teacher-only */}
                      <Route path="/teacher" element={<ProtectedRoute requireTeacher><TeacherDashboard /></ProtectedRoute>} />

                      <Route path="*" element={<Placeholder title={t('common.pageNotFound')} />} />
                    </Routes>
                  </Suspense>
                </Layout>
              } />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
