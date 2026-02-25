import { useState, useMemo } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/common/Button'

function ValidationIcon({ valid }) {
  if (valid === null) return null
  return valid
    ? <Check size={14} className="text-success" />
    : <X size={14} className="text-error" />
}

function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { score: 1, label: 'Schwach', color: 'bg-error' }
    if (score <= 2) return { score: 2, label: 'Mittel', color: 'bg-warning' }
    if (score <= 3) return { score: 3, label: 'Gut', color: 'bg-accent' }
    return { score: 4, label: 'Stark', color: 'bg-success' }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= strength.score ? strength.color : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] mt-0.5 ${
        strength.score <= 1 ? 'text-error' :
        strength.score <= 2 ? 'text-warning' :
        strength.score <= 3 ? 'text-accent' : 'text-success'
      }`}>
        {strength.label}
      </p>
    </div>
  )
}

export default function Register() {
  const { t } = useTranslation()
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const markTouched = (field) => setTouched(prev => ({ ...prev, [field]: true }))

  const validations = useMemo(() => ({
    username: username ? /^[a-zA-Z0-9_]{3,20}$/.test(username) : null,
    email: email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : null,
    password: password ? password.length >= 6 : null,
    confirmPassword: confirmPassword ? password === confirmPassword : null,
  }), [username, email, password, confirmPassword])

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
      <>
        <title>{t('auth.createAccount')} | MindForge</title>
        <meta name="description" content="Register for MindForge" />
        <meta property="og:title" content={`${t('auth.createAccount')} | MindForge`} />
      </>
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
          <p className="text-text-secondary">{t('auth.createAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-1.5">
              {t('auth.username')}
              {touched.username && <ValidationIcon valid={validations.username} />}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => markTouched('username')}
              placeholder="DeinName123"
              required
              className={touched.username && validations.username === false ? '!border-error' : touched.username && validations.username ? '!border-success' : ''}
            />
            {touched.username && validations.username === false && (
              <p className="text-error text-xs mt-0.5">{t('auth.errors.usernameFormat', '3-20 Zeichen, nur Buchstaben, Zahlen und _')}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1.5">
              {t('auth.email')}
              {touched.email && <ValidationIcon valid={validations.email} />}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              placeholder="deine@email.com"
              required
              className={touched.email && validations.email === false ? '!border-error' : touched.email && validations.email ? '!border-success' : ''}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5">
              {t('auth.password')}
              {touched.password && <ValidationIcon valid={validations.password} />}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder={t('auth.passwordPlaceholder')}
                required
                className={`!pr-10 ${touched.password && validations.password === false ? '!border-error' : touched.password && validations.password ? '!border-success' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className="flex items-center gap-1.5">
              {t('auth.confirmPassword')}
              {touched.confirmPassword && <ValidationIcon valid={validations.confirmPassword} />}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => markTouched('confirmPassword')}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
              className={touched.confirmPassword && validations.confirmPassword === false ? '!border-error' : touched.confirmPassword && validations.confirmPassword ? '!border-success' : ''}
            />
            {touched.confirmPassword && validations.confirmPassword === false && (
              <p className="text-error text-xs mt-0.5">{t('auth.errors.passwordMismatch', 'Passwörter stimmen nicht überein')}</p>
            )}
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
