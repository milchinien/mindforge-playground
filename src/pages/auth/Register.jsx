import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'

export default function Register() {
  const { t } = useTranslation()
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
      return setError(t('auth.errors.usernameFormat'))
    }
    if (password.length < 6) {
      return setError(t('auth.errors.passwordMin'))
    }
    if (password !== confirmPassword) {
      return setError(t('auth.errors.passwordMismatch'))
    }

    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      if (err.message === 'Username bereits vergeben') {
        setError(t('auth.errors.usernameTakenLong'))
      } else if (err.code === 'auth/email-already-in-use') {
        setError(t('auth.errors.emailTaken'))
      } else if (err.code === 'auth/invalid-email') {
        setError(t('auth.errors.invalidEmail'))
      } else {
        setError(t('auth.errors.registerFailed'))
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Helmet>
        <title>{t('auth.createAccount')} | MindForge</title>
        <meta name="description" content="Register for MindForge" />
        <meta property="og:title" content={`${t('auth.createAccount')} | MindForge`} />
      </Helmet>
      <div className="w-full max-w-sm bg-bg-card rounded-xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent mb-1">MindForge</h1>
          <p className="text-text-secondary">{t('auth.createAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>{t('auth.username')}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="DeinName123" required />
          </div>

          <div>
            <label>{t('auth.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required />
          </div>

          <div>
            <label>{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.passwordPlaceholder')} required />
          </div>

          <div>
            <label>{t('auth.confirmPassword')}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('auth.confirmPasswordPlaceholder')} required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>{t('auth.registerButton')}</Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-accent hover:underline">{t('auth.loginNow')}</Link>
        </p>
      </div>
    </div>
  )
}
