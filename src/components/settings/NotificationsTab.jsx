import { useTranslation } from 'react-i18next'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '../../stores/notificationStore'
import ToggleSwitch from './ToggleSwitch'

export default function NotificationsTab() {
  const { t } = useTranslation()
  const notifSettings = useNotificationStore((s) => s.settings)
  const updateNotifSettings = useNotificationStore((s) => s.updateSettings)

  const notificationItems = [
    { key: 'achievements', label: t('settings.notifAchievements'), desc: t('settings.notifAchievementsDesc') },
    { key: 'follows', label: t('settings.notifFollows'), desc: t('settings.notifFollowsDesc') },
    { key: 'events', label: t('settings.notifEvents'), desc: t('settings.notifEventsDesc') },
    { key: 'system', label: t('settings.notifSystem'), desc: t('settings.notifSystemDesc') },
    { key: 'quests', label: t('settings.notifQuests'), desc: t('settings.notifQuestsDesc') },
    { key: 'season', label: t('settings.notifSeason'), desc: t('settings.notifSeasonDesc') },
    { key: 'chat', label: t('settings.notifChat'), desc: t('settings.notifChatDesc') },
    { key: 'friends', label: t('settings.notifFriends'), desc: t('settings.notifFriendsDesc') },
  ]

  return (
    <section className="bg-bg-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell size={20} />
        {t('settings.notifications')}
      </h2>
      <div className="space-y-4">
        {notificationItems.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="text-text-primary">{label}</p>
              <p className="text-sm text-text-muted">{desc}</p>
            </div>
            <ToggleSwitch
              checked={notifSettings[key] ?? true}
              onChange={(checked) => updateNotifSettings(key, checked)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
