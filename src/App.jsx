import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/common/ErrorBoundary'
import { useTranslation } from 'react-i18next'

// Lazy-loaded pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
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
const CreatorDashboard = lazy(() => import('./components/creatorDashboard/CreatorDashboard'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" />
    </div>
  )
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
    <HelmetProvider>
    <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth pages WITHOUT layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
                      <Route path="/search" element={<Search />} />
                      <Route path="/game/:id" element={<GameDetail />} />
                      <Route path="/premium" element={<Premium />} />

                      {/* Profile - accessible without login to view others */}
                      <Route path="/profile/:username" element={<Profile />} />

                      {/* Protected routes */}
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                      <Route path="/avatar" element={<ProtectedRoute><Avatar /></ProtectedRoute>} />
                      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                      <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />

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
    </HelmetProvider>
  )
}

export default App
