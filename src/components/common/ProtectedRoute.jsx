import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

export default function ProtectedRoute({ children, requirePremium = false, requireTeacher = false }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen text="Laden..." />
  if (!user) return <Navigate to="/login" replace />
  if (requirePremium && !user.isPremium) return <Navigate to="/premium" replace />
  if (requireTeacher && !user.isTeacher) return <Navigate to="/" replace />

  return children
}
