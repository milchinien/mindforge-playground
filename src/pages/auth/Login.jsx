import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'

const errorMessages = {
  'auth/user-not-found': 'Kein Account mit dieser E-Mail gefunden',
  'auth/wrong-password': 'Falsches Passwort',
  'auth/invalid-email': 'Ungueltige E-Mail-Adresse',
  'auth/too-many-requests': 'Zu viele Versuche. Bitte spaeter erneut versuchen',
  'auth/invalid-credential': 'E-Mail oder Passwort falsch',
}

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, rememberMe)
      navigate('/')
    } catch (err) {
      setError(errorMessages[err.code] || 'Fehler beim Einloggen')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-card rounded-xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent mb-1">MindForge</h1>
          <p className="text-text-secondary">Willkommen zurueck!</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>E-Mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required />
          </div>

          <div>
            <label>Passwort</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" required />
          </div>

          <label className="flex items-center gap-2 cursor-pointer !mb-0">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="!w-4 !h-4 rounded"
            />
            <span className="text-text-secondary text-sm">Angemeldet bleiben (30 Tage)</span>
          </label>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>Einloggen</Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Noch kein Account?{' '}
          <Link to="/register" className="text-accent hover:underline">Jetzt registrieren</Link>
        </p>
      </div>
    </div>
  )
}
