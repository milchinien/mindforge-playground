import { useTranslation } from 'react-i18next'
import { Gamepad2, Heart, Trophy } from 'lucide-react'
import Tabs from '../ui/Tabs'

export default function ProfileTabs({ activeTab, onTabChange, gamesCount = 0, favoritesCount = 0 }) {
  const { t } = useTranslation()

  const tabs = [
    { id: 'games', label: t('profile.tabs.createdGames'), icon: Gamepad2, count: gamesCount },
    { id: 'favorites', label: t('profile.tabs.favorites'), icon: Heart, count: favoritesCount },
    { id: 'achievements', label: t('profile.tabs.achievements'), icon: Trophy },
  ]

  return <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
}
