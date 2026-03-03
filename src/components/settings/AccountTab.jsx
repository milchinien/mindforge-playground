import { useTranslation } from 'react-i18next'
import { Lock, Download, Trash2, LogOut } from 'lucide-react'

export default function AccountTab({ onOpenPasswordModal, onExportData, onOpenDeleteModal, onLogout }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Security */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock size={20} />
          {t('settings.security')}
        </h2>
        <button
          onClick={onOpenPasswordModal}
          className="bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
        >
          {t('settings.changePassword')}
        </button>
      </section>

      {/* Data Export */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.dataPrivacy')}</h2>
        <button
          onClick={onExportData}
          className="flex items-center justify-center gap-2 bg-bg-hover hover:bg-gray-500 text-text-primary py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <Download size={18} />
          {t('settings.exportData')}
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-error">
          <Trash2 size={20} />
          {t('settings.deleteAccount')}
        </h2>
        <button
          onClick={onOpenDeleteModal}
          className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
        >
          <Trash2 size={18} />
          {t('settings.deleteAccount')}
        </button>
      </section>

      {/* Logout */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LogOut size={20} />
          {t('settings.logout')}
        </h2>
        <p className="text-sm text-text-muted mb-4">{t('settings.logoutDesc')}</p>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error py-3 px-6 rounded-lg font-medium border border-error/30 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          {t('settings.logout')}
        </button>
      </section>
    </div>
  )
}
