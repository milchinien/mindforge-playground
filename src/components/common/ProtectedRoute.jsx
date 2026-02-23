import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

export default function ProtectedRoute({ children, requirePremium = false, requireTeacher = false }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen text="Laden..." />
  if (!user) return <Navigate to="/login" replace />

  // Dev tier bypasses all restrictions
  if (user.premiumTier === 'dev') return children

  if (requirePremium && !user.isPremium && !user.premiumTier) return <Navigate to="/premium" replace />
  if (requireTeacher && !user.isTeacher) return <Navigate to="/" replace />

  return children
}
