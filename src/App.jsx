import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

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

            {/* All other pages WITH layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Placeholder title="Home" />} />
                  <Route path="/browse" element={<Placeholder title="Mindbrowser" />} />
                  <Route path="/marketplace" element={<Placeholder title="Marketplace" />} />
                  <Route path="/events" element={<Placeholder title="Events" />} />
                  <Route path="/search" element={<Placeholder title="Suche" />} />
                  <Route path="/game/:id" element={<Placeholder title="Spiel-Detail" />} />
                  <Route path="/premium" element={<Placeholder title="Premium" />} />

                  {/* Protected routes */}
                  <Route path="/profile/:username" element={<ProtectedRoute><Placeholder title="Profil" /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Placeholder title="Einstellungen" /></ProtectedRoute>} />
                  <Route path="/friends" element={<ProtectedRoute><Placeholder title="Freunde" /></ProtectedRoute>} />
                  <Route path="/avatar" element={<ProtectedRoute><Placeholder title="Avatar" /></ProtectedRoute>} />
                  <Route path="/inventory" element={<ProtectedRoute><Placeholder title="Inventar" /></ProtectedRoute>} />
                  <Route path="/achievements" element={<ProtectedRoute><Placeholder title="Achievements" /></ProtectedRoute>} />
                  <Route path="/shop" element={<ProtectedRoute><Placeholder title="MindCoins Shop" /></ProtectedRoute>} />

                  {/* Premium-only */}
                  <Route path="/create" element={<ProtectedRoute requirePremium><Placeholder title="Spiel erstellen" /></ProtectedRoute>} />

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
