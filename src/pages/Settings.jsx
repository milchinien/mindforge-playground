import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Settings as SettingsIcon, Bell, Shield, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useThemeStore } from '../stores/themeStore'
import { useNotificationStore, selectNotifSettings } from '../stores/notificationStore'
import { useSettingsStore } from '../stores/settingsStore'
import Modal from '../components/common/Modal'
import Tabs from '../components/ui/Tabs'
import GeneralTab from '../components/settings/GeneralTab'
import NotificationsTab from '../components/settings/NotificationsTab'
import AccountTab from '../components/settings/AccountTab'
import PrivacyTab from '../components/settings/PrivacyTab'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const theme = useThemeStore((s) => s.theme)
  const notifSettings = useNotificationStore(selectNotifSettings)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('general')

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

  const tabs = [
    { id: 'general', label: t('settings.tabs.general'), icon: SettingsIcon },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'account', label: t('settings.tabs.account'), icon: Shield },
    { id: 'privacy', label: t('settings.tabs.privacy'), icon: Eye },
  ]

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
        await devDb.deleteDoc(devDb.doc('users', user.uid))
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
    const settingsData = useSettingsStore.getState()
    const exportData = {
      exportDate: new Date().toISOString(),
      profile: user,
      settings: {
        theme,
        language: i18n.language,
        notifications: notifSettings,
        soundEffects: settingsData.soundEffects,
        reducedMotion: settingsData.reducedMotion,
        autoplayVideos: settingsData.autoplayVideos,
        fontSize: settingsData.fontSize,
        profileVisibility: settingsData.profileVisibility,
        showOnlineStatus: settingsData.showOnlineStatus,
        showActivityStatus: settingsData.showActivityStatus,
        allowMessagesFrom: settingsData.allowMessagesFrom,
      },
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindforge-export-${user?.uid || 'user'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="py-4 space-y-6">
      <>
        <title>{t('settings.title')} | MindForge</title>
        <meta name="description" content={t('settings.title')} />
        <meta property="og:title" content={`${t('settings.title')} | MindForge`} />
      </>
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'account' && (
        <AccountTab
          onOpenPasswordModal={() => setShowPasswordModal(true)}
          onExportData={handleExportData}
          onOpenDeleteModal={() => setShowDeleteModal(true)}
          onLogout={handleLogout}
        />
      )}
      {activeTab === 'privacy' && <PrivacyTab />}

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
