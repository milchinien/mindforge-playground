import { useTranslation } from 'react-i18next'
import { Gamepad2, Heart, Trophy } from 'lucide-react'

export default function ProfileTabs({ activeTab, onTabChange, gamesCount = 0, favoritesCount = 0 }) {
  const { t } = useTranslation()

  const tabs = [
    { id: 'games', label: t('profile.tabs.createdGames'), icon: Gamepad2, showCount: true },
    { id: 'favorites', label: t('profile.tabs.favorites'), icon: Heart, showCount: true },
    { id: 'achievements', label: t('profile.tabs.achievements'), icon: Trophy, showCount: false },
  ]

  const getCounts = (tabId) => {
    if (tabId === 'games') return gamesCount
    if (tabId === 'favorites') return favoritesCount
    return null
  }

  return (
    <div className="flex border-b border-gray-700 overflow-x-auto hide-scrollbar">
      {tabs.map(tab => {
        const Icon = tab.icon
        const count = getCounts(tab.id)
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
              isActive
                ? 'text-accent font-semibold'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            {tab.showCount && count !== null && (
              <span className="text-xs bg-bg-hover px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        )
      })}
    </div>
  )
}
