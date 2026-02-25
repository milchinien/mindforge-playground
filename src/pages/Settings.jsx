import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Lock, Trash2, Download, Bell, LogOut, Contrast } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useThemeStore, useIsDark, useIsHighContrast } from '../stores/themeStore'
import Modal from '../components/common/Modal'

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
        checked ? 'bg-accent' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { user, logout, updateUser } = useAuth()
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = useIsDark()
  const isHighContrast = useIsHighContrast()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState({
    achievements: true,
    follows: true,
    events: true,
    system: true,
  })

  const [language, setLanguage] = useState(i18n.language || 'de')

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const deleteConfirmWord = t('settings.deleteConfirmWord')

  const handleLanguageChange = (value) => {
    setLanguage(value)
    i18n.changeLanguage(value)
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    if (!passwordForm.currentPassword) {
      setPasswordError(t('settings.errors.currentRequired'))
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t('settings.errors.passwordMin'))
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('settings.errors.passwordMismatch'))
      return
    }

    setPasswordLoading(true)
    try {
      if (import.meta.env.DEV) {
        // Dev mode: validate current password against stored user
        const { devAuth } = await import('../firebase/devAuth')
        const currentUser = devAuth.currentUser
        if (!currentUser || currentUser.password !== passwordForm.currentPassword) {
          setPasswordError(t('settings.errors.wrongPassword'))
          setPasswordLoading(false)
          return
        }
        currentUser.password = passwordForm.newPassword
        localStorage.setItem('mindforge_dev_user', JSON.stringify(currentUser))
      } else {
        const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth')
        const { auth } = await import('../firebase/config')
        const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordForm.currentPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
        await updatePassword(auth.currentUser, passwordForm.newPassword)
      }
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError(err.code === 'auth/wrong-password' ? t('settings.errors.wrongPassword') : t('settings.errors.changeFailed'))
    }
    setPasswordLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== deleteConfirmWord) return
    setDeleteLoading(true)
    try {
      if (import.meta.env.DEV) {
        const { devAuth, devDb } = await import('../firebase/devAuth')
        // Delete user document
        await devDb.deleteDoc(devDb.doc('users', user.uid))
        // Sign out
        await devAuth.signOut()
      } else {
        const { deleteUser } = await import('firebase/auth')
        const { doc, deleteDoc } = await import('firebase/firestore')
        const { auth, db } = await import('../firebase/config')
        await deleteDoc(doc(db, 'users', auth.currentUser.uid))
        await deleteUser(auth.currentUser)
      }
      await logout()
      navigate('/login')
    } catch {
      setDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      profile: user,
      settings: { theme, language, notifications },
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindforge-export-${user?.uid || 'user'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="py-4 space-y-6">
      <>
        <title>{t('settings.title')} | MindForge</title>
        <meta name="description" content={t('settings.title')} />
        <meta property="og:title" content={`${t('settings.title')} | MindForge`} />
      </>
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>

      {/* Theme */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {isHighContrast ? <Contrast size={20} /> : isDark ? <Moon size={20} /> : <Sun size={20} />}
          {t('settings.appearance')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">{t('settings.theme')}</p>
            <p className="text-sm text-text-muted">{t('settings.themeDesc')}</p>
          </div>
          <div className="flex bg-bg-hover rounded-lg p-1">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t('settings.dark')}
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                theme === 'light' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t('settings.light')}
            </button>
            <button
              onClick={() => setTheme('high-contrast')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                theme === 'high-contrast' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t('settings.highContrast')}
            </button>
          </div>
        </div>

        {/* Theme Preview */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: t('settings.dark'), bg: '#111827', card: '#374151', text: '#ffffff', accent: '#f97316' },
            { id: 'light', label: t('settings.light'), bg: '#f9fafb', card: '#ffffff', text: '#111827', accent: '#2563eb' },
            { id: 'high-contrast', label: t('settings.highContrast'), bg: '#000000', card: '#1a1a1a', text: '#ffffff', accent: '#00ff88' },
          ].map((preview) => (
            <button
              key={preview.id}
              onClick={() => setTheme(preview.id)}
              className={`rounded-lg p-3 border-2 transition-all cursor-pointer ${
                theme === preview.id
                  ? 'border-accent shadow-lg shadow-accent/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              style={{ backgroundColor: preview.bg }}
            >
              <div className="space-y-1.5">
                <div className="h-2 w-3/4 rounded" style={{ backgroundColor: preview.text, opacity: 0.8 }} />
                <div className="h-2 w-1/2 rounded" style={{ backgroundColor: preview.text, opacity: 0.4 }} />
                <div className="flex gap-1 mt-2">
                  <div className="h-6 flex-1 rounded" style={{ backgroundColor: preview.card }} />
                  <div className="h-6 flex-1 rounded" style={{ backgroundColor: preview.accent }} />
                </div>
                <p className="text-xs font-medium mt-1 text-center" style={{ color: preview.text }}>
                  {preview.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">{t('settings.displayLanguage')}</p>
            <p className="text-sm text-text-muted">{t('settings.moreLanguages')}</p>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="!w-auto !py-2 !px-4"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr" disabled>Francais (bald)</option>
            <option value="es" disabled>Espanol (bald)</option>
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          {t('settings.notifications')}
        </h2>
        <div className="space-y-4">
          {[
            { key: 'achievements', label: t('settings.notifAchievements'), desc: t('settings.notifAchievementsDesc') },
            { key: 'follows', label: t('settings.notifFollows'), desc: t('settings.notifFollowsDesc') },
            { key: 'events', label: t('settings.notifEvents'), desc: t('settings.notifEventsDesc') },
            { key: 'system', label: t('settings.notifSystem'), desc: t('settings.notifSystemDesc') },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-text-primary">{label}</p>
                <p className="text-sm text-text-muted">{desc}</p>
              </div>
              <ToggleSwitch
                checked={notifications[key]}
                onChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock size={20} />
          {t('settings.security')}
        </h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
        >
          {t('settings.changePassword')}
        </button>
      </section>

      {/* Data & Privacy */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.dataPrivacy')}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Download size={18} />
            {t('settings.exportData')}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
            {t('settings.deleteAccount')}
          </button>
        </div>
      </section>

      {/* Logout */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LogOut size={20} />
          {t('settings.logout')}
        </h2>
        <p className="text-sm text-text-muted mb-4">{t('settings.logoutDesc')}</p>
        <button
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
          className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          {t('settings.logout')}
        </button>
      </section>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title={t('settings.changePassword')}
      >
        <div className="space-y-4">
          <input
            type="password"
            placeholder={t('settings.currentPassword')}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder={t('settings.newPassword')}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder={t('settings.confirmNewPassword')}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
          {passwordError && <p className="text-error text-sm">{passwordError}</p>}
          <button
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors cursor-pointer"
          >
            {passwordLoading ? t('settings.changingPassword') : t('settings.changePassword')}
          </button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('settings.deleteAccount')}
      >
        <div className="space-y-4">
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-error font-semibold">{t('settings.deleteWarning')}</p>
            <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc list-inside">
              <li>{t('settings.deleteGames')}</li>
              <li>{t('settings.deleteProfile')}</li>
              <li>{t('settings.deleteCoins')}</li>
              <li>{t('settings.deletePremium')}</li>
            </ul>
          </div>
          <p className="text-text-secondary text-sm" dangerouslySetInnerHTML={{ __html: t('settings.typeDelete') }} />
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={deleteConfirmWord}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== deleteConfirmWord || deleteLoading}
            className="w-full bg-error hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {deleteLoading ? t('settings.deleting') : t('settings.deleteForever')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
