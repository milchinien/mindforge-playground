import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'

const errorKeyMap = {
  'auth/user-not-found': 'auth.errors.noAccount',
  'auth/wrong-password': 'auth.errors.wrongPassword',
  'auth/invalid-email': 'auth.errors.invalidEmail',
  'auth/too-many-requests': 'auth.errors.tooManyAttempts',
  'auth/invalid-credential': 'auth.errors.emailOrPassword',
}

export default function Login() {
  const { t } = useTranslation()
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
      const key = errorKeyMap[err.code]
      setError(key ? t(key) : t('auth.errors.loginFailed'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Helmet>
        <title>{t('auth.welcomeBack')} | MindForge</title>
        <meta name="description" content="Login to MindForge" />
        <meta property="og:title" content={`${t('auth.welcomeBack')} | MindForge`} />
      </Helmet>
      <div className="w-full max-w-sm bg-bg-card rounded-xl p-8 shadow-xl relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-text-muted hover:text-text-primary transition-colors"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent mb-1">MindForge</h1>
          <p className="text-text-secondary">{t('auth.welcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>{t('auth.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required />
          </div>

          <div>
            <label>{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password')} required />
          </div>

          <label className="flex items-center gap-2 cursor-pointer !mb-0">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="!w-4 !h-4 rounded"
            />
            <span className="text-text-secondary text-sm">{t('auth.rememberMe')}</span>
          </label>

          {error && <p className="form-error">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>{t('auth.loginButton')}</Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-accent hover:underline">{t('auth.registerNow')}</Link>
        </p>
      </div>
    </div>
  )
}
