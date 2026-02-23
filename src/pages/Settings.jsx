import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Lock, Trash2, Download, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'
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
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme, isDark } = useTheme()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState({
    achievements: true,
    follows: true,
    events: true,
    system: true,
  })

  const [language, setLanguage] = useState('de')

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

  const handlePasswordChange = async () => {
    setPasswordError('')
    if (!passwordForm.currentPassword) {
      setPasswordError('Aktuelles Passwort ist erforderlich')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwoerter stimmen nicht ueberein')
      return
    }

    setPasswordLoading(true)
    try {
      if (import.meta.env.DEV) {
        // Dev mode: validate current password against stored user
        const { devAuth } = await import('../firebase/devAuth')
        const currentUser = devAuth.currentUser
        if (!currentUser || currentUser.password !== passwordForm.currentPassword) {
          setPasswordError('Aktuelles Passwort ist falsch')
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
      setPasswordError(err.code === 'auth/wrong-password' ? 'Aktuelles Passwort ist falsch' : 'Fehler beim Aendern des Passworts')
    }
    setPasswordLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'LOESCHEN') return
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
    <div className="py-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Einstellungen</h1>

      {/* Theme */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
          Erscheinungsbild
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">Theme</p>
            <p className="text-sm text-text-muted">Waehle zwischen hellem und dunklem Design</p>
          </div>
          <div className="flex bg-bg-hover rounded-lg p-1">
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isDark ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Dunkel
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                !isDark ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Hell
            </button>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Sprache</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">Anzeigesprache</p>
            <p className="text-sm text-text-muted">Weitere Sprachen kommen in zukuenftigen Updates</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="!w-auto !py-2 !px-4"
          >
            <option value="de">Deutsch</option>
            <option value="en" disabled>English (bald)</option>
            <option value="fr" disabled>Francais (bald)</option>
            <option value="es" disabled>Espanol (bald)</option>
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          Benachrichtigungen
        </h2>
        <div className="space-y-4">
          {[
            { key: 'achievements', label: 'Achievements', desc: 'Benachrichtigung bei neuen Achievements' },
            { key: 'follows', label: 'Follows', desc: 'Wenn dir jemand folgt' },
            { key: 'events', label: 'Events', desc: 'Neue Events und Challenges' },
            { key: 'system', label: 'System', desc: 'Wichtige Systemmeldungen' },
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
          Sicherheit
        </h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Passwort aendern
        </button>
      </section>

      {/* Data & Privacy */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Daten & Datenschutz</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Download size={18} />
            Daten exportieren (JSON)
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
            Account loeschen
          </button>
        </div>
      </section>

      {/* Logout */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LogOut size={20} />
          Abmelden
        </h2>
        <p className="text-sm text-text-muted mb-4">Du wirst zur Login-Seite weitergeleitet.</p>
        <button
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
          className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Abmelden
        </button>
      </section>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Passwort aendern"
      >
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Aktuelles Passwort"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Neues Passwort (min. 6 Zeichen)"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Neues Passwort bestaetigen"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
          {passwordError && <p className="text-error text-sm">{passwordError}</p>}
          <button
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors cursor-pointer"
          >
            {passwordLoading ? 'Wird geaendert...' : 'Passwort aendern'}
          </button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Account loeschen"
      >
        <div className="space-y-4">
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-error font-semibold">Warnung: Diese Aktion kann nicht rueckgaengig gemacht werden!</p>
            <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc list-inside">
              <li>Alle deine Spiele werden geloescht</li>
              <li>Dein Profil wird entfernt</li>
              <li>Deine MindCoins gehen verloren</li>
              <li>Premium-Abonnement wird beendet</li>
            </ul>
          </div>
          <p className="text-text-secondary text-sm">
            Tippe <strong className="text-text-primary">LOESCHEN</strong> um zu bestaetigen:
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="LOESCHEN"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'LOESCHEN' || deleteLoading}
            className="w-full bg-error hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {deleteLoading ? 'Wird geloescht...' : 'Account endgueltig loeschen'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
