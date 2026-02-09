import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Mindbrowser from './pages/Mindbrowser'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import GamePlayer from './pages/GamePlayer'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Create from './pages/Create'
import Avatar from './pages/Avatar'
import Settings from './pages/Settings'
import Inventory from './pages/Inventory'

function Placeholder({ title }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-text-secondary">Diese Seite wird bald implementiert.</p>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Auth pages WITHOUT layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/play/:id" element={<GamePlayer />} />

            {/* All other pages WITH layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Mindbrowser />} />
                  <Route path="/marketplace" element={<Placeholder title="Marketplace" />} />
                  <Route path="/events" element={<Placeholder title="Events" />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/game/:id" element={<GameDetail />} />
                  <Route path="/premium" element={<Placeholder title="Premium" />} />

                  {/* Profile - accessible without login to view others */}
                  <Route path="/profile/:username" element={<Profile />} />

                  {/* Protected routes */}
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/friends" element={<ProtectedRoute><Placeholder title="Freunde" /></ProtectedRoute>} />
                  <Route path="/avatar" element={<ProtectedRoute><Avatar /></ProtectedRoute>} />
                  <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                  <Route path="/achievements" element={<ProtectedRoute><Placeholder title="Achievements" /></ProtectedRoute>} />
                  <Route path="/shop" element={<ProtectedRoute><Placeholder title="MindCoins Shop" /></ProtectedRoute>} />

                  {/* Premium-only */}
                  <Route path="/create" element={<ProtectedRoute requirePremium><Create /></ProtectedRoute>} />

                  {/* Teacher-only */}
                  <Route path="/teacher" element={<ProtectedRoute requireTeacher><Placeholder title="Lehrer-Dashboard" /></ProtectedRoute>} />

                  <Route path="*" element={<Placeholder title="404 - Seite nicht gefunden" />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
