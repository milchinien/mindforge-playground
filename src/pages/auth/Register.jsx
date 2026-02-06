import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return setError('Username: 3-20 Zeichen, nur Buchstaben, Zahlen, Unterstriche')
    }
    if (password.length < 6) {
      return setError('Passwort muss mindestens 6 Zeichen haben')
    }
    if (password !== confirmPassword) {
      return setError('Passwoerter stimmen nicht ueberein')
    }

    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      if (err.message === 'Username bereits vergeben') {
        setError('Dieser Username ist bereits vergeben')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Diese E-Mail wird bereits verwendet')
      } else if (err.code === 'auth/invalid-email') {
        setError('Ungueltige E-Mail-Adresse')
      } else {
        setError('Fehler bei der Registrierung')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-card rounded-xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent mb-1">MindForge</h1>
          <p className="text-text-secondary">Account erstellen</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="DeinName123" required />
          </div>

          <div>
            <label>E-Mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required />
          </div>

          <div>
            <label>Passwort</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 Zeichen" required />
          </div>

          <div>
            <label>Passwort wiederholen</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Passwort nochmal" required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>Registrieren</Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Bereits ein Account?{' '}
          <Link to="/login" className="text-accent hover:underline">Jetzt einloggen</Link>
        </p>
      </div>
    </div>
  )
}
