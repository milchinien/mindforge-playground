import { useState, useMemo } from 'react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { mockGames } from '../../data/mockGames'

const loginErrorMap = {
  'auth/user-not-found': 'auth.errors.noAccount',
  'auth/wrong-password': 'auth.errors.wrongPassword',
  'auth/invalid-email': 'auth.errors.invalidEmail',
  'auth/too-many-requests': 'auth.errors.tooManyAttempts',
  'auth/invalid-credential': 'auth.errors.emailOrPassword',
}

// Subject-based colors and emojis for games without thumbnails
const subjectStyles = {
  mathematik: { color: '#ea580c', emoji: '\u{1F9EE}' },
  physik: { color: '#2563eb', emoji: '\u26A1' },
  chemie: { color: '#059669', emoji: '\u{1F9EA}' },
  deutsch: { color: '#d97706', emoji: '\u{1F4DD}' },
  geographie: { color: '#0891b2', emoji: '\u{1F30D}' },
  biologie: { color: '#db2777', emoji: '\u{1F9EC}' },
  informatik: { color: '#7c3aed', emoji: '\u{1F4BB}' },
  kunst: { color: '#c026d3', emoji: '\u{1F3A8}' },
  musik: { color: '#4f46e5', emoji: '\u{1F3B5}' },
  englisch: { color: '#dc2626', emoji: '\u{1F1EC}\u{1F1E7}' },
  geschichte: { color: '#b45309', emoji: '\u2694\uFE0F' },
}

const fallbackStyle = { color: '#f97316', emoji: '\u{1F3AE}' }

const CARD_W = 240
const CARD_H = 150
const CARDS_PER_SET = 20
const ROW_COUNT = 15

function GameCard({ game }) {
  const s = subjectStyles[game.subject] || fallbackStyle
  const hasThumbnail = game.thumbnail != null

  return (
    <div
      style={{
        minWidth: `${CARD_W}px`,
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        flexShrink: 0,
        ...(hasThumbnail
          ? {
              backgroundImage: `url(${game.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              background: `linear-gradient(145deg, ${s.color}, ${s.color}88)`,
            }),
      }}
      className="flex flex-col items-center justify-center overflow-hidden"
    >
      {!hasThumbnail && (
        <>
          <span className="text-4xl md:text-5xl select-none opacity-90">{s.emoji}</span>
          <span className="text-white/60 text-[10px] md:text-xs font-bold mt-1 text-center px-2 truncate max-w-full select-none">
            {game.title}
          </span>
        </>
      )}
    </div>
  )
}

function GameBackground() {
  // Sort games by popularity (most played first)
  const sortedGames = useMemo(
    () => [...mockGames].sort((a, b) => b.plays - a.plays),
    []
  )

  // Build rows with offset so each row starts at a different game
  const rows = useMemo(() => {
    if (sortedGames.length === 0) return []
    const result = []
    for (let r = 0; r < ROW_COUNT; r++) {
      const offset = (r * 4) % sortedGames.length
      const rowGames = []
      for (let i = 0; i < CARDS_PER_SET; i++) {
        rowGames.push(sortedGames[(i + offset) % sortedGames.length])
      }
      result.push(rowGames)
    }
    return result
  }, [sortedGames])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Keyframes for infinite scrolling rows */}
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Rotated row container */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: 'rotate(-20deg)',
          transformOrigin: 'center center',
          filter: 'blur(1.5px) grayscale(0.4) brightness(0.7)',
        }}
      >
        {rows.map((rowGames, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              height: `${CARD_H}px`,
              animation: `${rowIdx % 2 === 0 ? 'marquee-left' : 'marquee-right'} ${70 + rowIdx * 5}s linear infinite`,
              willChange: 'transform',
            }}
          >
            {/* Two identical sets for seamless infinite loop */}
            {[...rowGames, ...rowGames].map((game, i) => (
              <GameCard key={i} game={game} />
            ))}
          </div>
        ))}
      </div>

      {/* Strong vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}

function ValidationIcon({ valid }) {
  if (valid === null) return null
  return valid ? (
    <Check size={14} className="text-green-400" />
  ) : (
    <X size={14} className="text-red-400" />
  )
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

    if (score <= 1) return { score: 1, label: 'Schwach', color: 'bg-red-500' }
    if (score <= 2) return { score: 2, label: 'Mittel', color: 'bg-yellow-500' }
    if (score <= 3) return { score: 3, label: 'Gut', color: 'bg-orange-400' }
    return { score: 4, label: 'Stark', color: 'bg-green-500' }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= strength.score ? strength.color : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p
        className={`text-[10px] mt-0.5 ${
          strength.score <= 1
            ? 'text-red-400'
            : strength.score <= 2
              ? 'text-yellow-400'
              : strength.score <= 3
                ? 'text-orange-400'
                : 'text-green-400'
        }`}
      >
        {strength.label}
      </p>
    </div>
  )
}

export default function AuthPage() {
  const { t } = useTranslation()
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState(location.pathname === '/login' ? 'login' : 'register')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const validations = useMemo(
    () => ({
      username: username ? /^[a-zA-Z0-9_]{3,20}$/.test(username) : null,
      email: email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : null,
      password: password ? password.length >= 6 : null,
      confirmPassword: confirmPassword ? password === confirmPassword : null,
    }),
    [username, email, password, confirmPassword]
  )

  if (user) return <Navigate to="/" replace />

  const switchMode = () => {
    setMode((m) => (m === 'register' ? 'login' : 'register'))
    setError('')
    setTouched({})
  }

  const handleRegister = async (e) => {
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginIdentifier, password, rememberMe)
      navigate('/')
    } catch (err) {
      const key = loginErrorMap[err.code]
      setError(key ? t(key) : t('auth.errors.loginFailed'))
    }
    setLoading(false)
  }

  const isRegister = mode === 'register'

  return (
    <div className="min-h-screen relative">
      <title>{isRegister ? t('auth.createAccount') : t('auth.welcomeBack')} | MindForge</title>

      <GameBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end p-4 md:p-6">
          <button
            onClick={switchMode}
            className="px-5 py-2 rounded-lg border-2 border-orange-500 text-white font-semibold text-sm
                       hover:bg-orange-500 hover:text-white transition-all duration-200 cursor-pointer"
          >
            {isRegister ? 'Anmelden' : 'Registrieren'}
          </button>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12 -mt-8">
          {/* MindForge title */}
          <h1
            className="text-5xl md:text-6xl font-black tracking-wider mb-2 select-none"
            style={{ color: '#f97316' }}
          >
            MINDFORGE
          </h1>

          {/* Subtitle */}
          <p className="text-white text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-8">
            {isRegister ? 'REGISTRIERE DICH UND LEG LOS!' : 'WILLKOMMEN ZURUECK!'}
          </p>

          {/* Form panel with background */}
          <div
            className="w-full max-w-md rounded-xl p-6 md:p-8"
            style={{
              backgroundColor: 'rgba(10, 10, 15, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(249, 115, 22, 0.15)',
            }}
          >
            <form
              onSubmit={isRegister ? handleRegister : handleLogin}
              className="flex flex-col gap-4"
            >
              {/* Username - register only */}
              {isRegister && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 mb-1.5">
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
                    className={`!bg-[#1a1a2e] !border-gray-700 focus:!ring-orange-500 focus:!border-orange-500 ${
                      touched.username && validations.username === false
                        ? '!border-red-500'
                        : touched.username && validations.username
                          ? '!border-green-500'
                          : ''
                    }`}
                  />
                  {touched.username && validations.username === false && (
                    <p className="text-red-400 text-xs mt-0.5">{t('auth.errors.usernameFormat')}</p>
                  )}
                </div>
              )}

              {/* Email (register) or Email/Username (login) */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 mb-1.5">
                  {isRegister ? t('auth.email') : 'E-Mail oder Benutzername'}
                  {isRegister && touched.email && <ValidationIcon valid={validations.email} />}
                </label>
                {isRegister ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                    placeholder="deine@email.com"
                    required
                    className={`!bg-[#1a1a2e] !border-gray-700 focus:!ring-orange-500 focus:!border-orange-500 ${
                      touched.email && validations.email === false
                        ? '!border-red-500'
                        : touched.email && validations.email
                          ? '!border-green-500'
                          : ''
                    }`}
                  />
                ) : (
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="deine@email.com oder DeinName123"
                    required
                    className="!bg-[#1a1a2e] !border-gray-700 focus:!ring-orange-500 focus:!border-orange-500"
                  />
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 mb-1.5">
                  {t('auth.password')}
                  {isRegister && touched.password && (
                    <ValidationIcon valid={validations.password} />
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                    className={`!pr-10 !bg-[#1a1a2e] !border-gray-700 focus:!ring-orange-500 focus:!border-orange-500 ${
                      isRegister && touched.password && validations.password === false
                        ? '!border-red-500'
                        : isRegister && touched.password && validations.password
                          ? '!border-green-500'
                          : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {isRegister && <PasswordStrength password={password} />}
              </div>

              {/* Confirm password - register only */}
              {isRegister && (
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 mb-1.5">
                    {t('auth.confirmPassword')}
                    {touched.confirmPassword && (
                      <ValidationIcon valid={validations.confirmPassword} />
                    )}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => markTouched('confirmPassword')}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                    className={`!bg-[#1a1a2e] !border-gray-700 focus:!ring-orange-500 focus:!border-orange-500 ${
                      touched.confirmPassword && validations.confirmPassword === false
                        ? '!border-red-500'
                        : touched.confirmPassword && validations.confirmPassword
                          ? '!border-green-500'
                          : ''
                    }`}
                  />
                  {touched.confirmPassword && validations.confirmPassword === false && (
                    <p className="text-red-400 text-xs mt-0.5">
                      {t('auth.errors.passwordMismatch')}
                    </p>
                  )}
                </div>
              )}

              {/* Remember me - login only */}
              {!isRegister && (
                <label className="flex items-center gap-2 cursor-pointer !mb-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="!w-4 !h-4 rounded accent-orange-500"
                  />
                  <span className="text-gray-300 text-sm">{t('auth.rememberMe')}</span>
                </label>
              )}

              {/* Legal text - register only */}
              {isRegister && (
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Wenn du auf &quot;Registrieren&quot; klickst, stimmst du unseren{' '}
                  <span className="text-orange-400 hover:underline cursor-pointer">
                    Nutzungsbedingungen
                  </span>{' '}
                  und unserer{' '}
                  <span className="text-orange-400 hover:underline cursor-pointer">
                    Datenschutzrichtlinie
                  </span>{' '}
                  zu.
                </p>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-white text-base transition-all duration-200
                           bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
                           cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Laden...
                  </span>
                ) : isRegister ? (
                  t('auth.registerButton')
                ) : (
                  t('auth.loginButton')
                )}
              </button>
            </form>

            {/* Bottom switch link */}
            <p className="text-center text-gray-400 text-sm mt-6">
              {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
              <button
                onClick={switchMode}
                className="text-orange-400 hover:text-orange-300 hover:underline font-semibold cursor-pointer"
              >
                {isRegister ? t('auth.loginNow') : t('auth.registerNow')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
