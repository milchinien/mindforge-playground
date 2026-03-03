import { useTranslation } from 'react-i18next'
import { Eye } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import ToggleSwitch from './ToggleSwitch'

export default function PrivacyTab() {
  const { t } = useTranslation()
  const profileVisibility = useSettingsStore((s) => s.profileVisibility)
  const showOnlineStatus = useSettingsStore((s) => s.showOnlineStatus)
  const showActivityStatus = useSettingsStore((s) => s.showActivityStatus)
  const allowMessagesFrom = useSettingsStore((s) => s.allowMessagesFrom)
  const updateSetting = useSettingsStore((s) => s.updateSetting)

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye size={20} />
          {t('settings.profileVisibility')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.profileVisibility')}</p>
              <p className="text-sm text-text-muted">{t('settings.profileVisibilityDesc')}</p>
            </div>
            <div className="flex bg-bg-hover rounded-lg p-1">
              {[
                { id: 'public', label: t('settings.visibilityPublic') },
                { id: 'friends', label: t('settings.visibilityFriends') },
                { id: 'private', label: t('settings.visibilityPrivate') },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateSetting('profileVisibility', opt.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    profileVisibility === opt.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Status Settings */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.onlineStatus')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.onlineStatus')}</p>
              <p className="text-sm text-text-muted">{t('settings.onlineStatusDesc')}</p>
            </div>
            <ToggleSwitch checked={showOnlineStatus} onChange={(v) => updateSetting('showOnlineStatus', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{t('settings.activityStatus')}</p>
              <p className="text-sm text-text-muted">{t('settings.activityStatusDesc')}</p>
            </div>
            <ToggleSwitch checked={showActivityStatus} onChange={(v) => updateSetting('showActivityStatus', v)} />
          </div>
        </div>
      </section>

      {/* Message Permissions */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{t('settings.messagePermissions')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary">{t('settings.messagePermissions')}</p>
            <p className="text-sm text-text-muted">{t('settings.messagePermissionsDesc')}</p>
          </div>
          <div className="flex bg-bg-hover rounded-lg p-1">
            {[
              { id: 'everyone', label: t('settings.messagesEveryone') },
              { id: 'friends', label: t('settings.messagesFriends') },
              { id: 'nobody', label: t('settings.messagesNobody') },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSetting('allowMessagesFrom', opt.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  allowMessagesFrom === opt.id ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
