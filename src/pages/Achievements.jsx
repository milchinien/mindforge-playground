import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import {
  ALL_ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
} from '../data/achievementDefinitions'
import TitleSelectModal from '../components/achievements/TitleSelectModal'
import Tabs from '../components/ui/Tabs'
import { useAchievementStore } from '../stores/achievementStore'
import { useInventoryStore } from '../stores/inventoryStore'

function getAchievementStatus(achievement, progress, isUnlocked) {
  if (isUnlocked(achievement.id)) {
    return { status: 'unlocked', current: achievement.requirement.value, percent: 100 }
  }

  const req = achievement.requirement
  let current = 0

  if (req.type === 'category_games_completed') {
    current = progress.category_games_completed?.[req.category] || 0
  } else if (req.type === 'category_perfect_scores') {
    current = progress.category_perfect_scores?.[req.category] || 0
  } else {
    current = progress[req.type] || 0
  }

  const percent = Math.min(100, Math.round((current / req.value) * 100))
  return {
    status: current >= req.value ? 'completable' : 'locked',
    current: Math.min(current, req.value),
    percent,
  }
}

function AchievementCard({ achievement, status, current, percent }) {
  const { t } = useTranslation()
  const isUnlocked = status === 'unlocked'
  const isCompletable = status === 'completable'

  return (
    <div className={`bg-bg-card rounded-xl p-5 border transition-all
      ${isUnlocked
        ? 'border-success/30 bg-success/5'
        : isCompletable
          ? 'border-accent/30 bg-accent/5'
          : 'border-gray-700 opacity-75'
      }`}>
      <div className="flex items-start gap-4">
        <div className={`text-3xl flex-shrink-0
          ${!isUnlocked && !isCompletable ? 'grayscale opacity-50' : ''}`}>
          {isUnlocked ? '\u2705' : achievement.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-text-primary">{achievement.name}</h3>
            <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full flex-shrink-0">
              {t('achievements.titleLabel', { title: achievement.reward.value })}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{achievement.description}</p>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{current}/{achievement.requirement.value}</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500
                  ${isUnlocked ? 'bg-success' : isCompletable ? 'bg-accent' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Achievements() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('player')
  const [showTitleModal, setShowTitleModal] = useState(false)

  const progress = useAchievementStore((s) => s.progress)
  const unlockedMap = useAchievementStore((s) => s.unlockedAchievements)
  const isUnlocked = (id) => id in unlockedMap

  const items = useInventoryStore((s) => s.items)
  const equipItem = useInventoryStore((s) => s.equipItem)
  const unequipItem = useInventoryStore((s) => s.unequipItem)
  const equippedTitle = useMemo(() => items.find((i) => i.type === 'title' && i.equipped)?.name || null, [items])
  const titleItems = useMemo(() => items.filter((i) => i.type === 'title'), [items])

  const filteredAchievements = ALL_ACHIEVEMENTS.filter(a => a.category === activeCategory)

  const totalUnlocked = Object.keys(unlockedMap).length
  const totalAchievements = ALL_ACHIEVEMENTS.length

  const handleTitleSelect = (titleName) => {
    if (titleName === null) {
      titleItems.forEach((item) => { if (item.equipped) unequipItem(item.id) })
    } else {
      const item = titleItems.find((i) => i.name === titleName)
      if (item) equipItem(item.id)
    }
    setShowTitleModal(false)
  }

  return (
    <div className="p-6">
      <>
        <title>{t('achievements.title')} | MindForge</title>
        <meta name="description" content={t('achievements.title')} />
        <meta property="og:title" content={`${t('achievements.title')} | MindForge`} />
        <meta property="og:description" content={t('achievements.title')} />
        <meta property="og:type" content="website" />
      </>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('achievements.title')}</h1>
          <p className="text-text-secondary mt-1">
            {t('achievements.progress', { unlocked: totalUnlocked, total: totalAchievements })}
          </p>
        </div>

        {/* Active title selector */}
        <button
          onClick={() => setShowTitleModal(true)}
          className="flex items-center gap-2 bg-bg-card border border-gray-700 hover:border-accent/50 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-sm text-text-muted">{t('achievements.activeTitle')}</span>
          <span className="text-sm font-semibold text-accent">
            {equippedTitle ? `"${equippedTitle}"` : t('achievements.noTitle')}
          </span>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* Category tabs */}
      <Tabs
        tabs={ACHIEVEMENT_CATEGORIES.map(cat => {
          const catUnlocked = ALL_ACHIEVEMENTS
            .filter(a => a.category === cat.id && isUnlocked(a.id)).length
          return { id: cat.id, label: cat.name, icon: cat.icon, count: catUnlocked }
        })}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        className="mb-8"
      />

      {/* Achievement list */}
      <div className="space-y-3">
        {filteredAchievements.map(achievement => {
          const { status, current, percent } = getAchievementStatus(achievement, progress, isUnlocked)
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              status={status}
              current={current}
              percent={percent}
            />
          )
        })}
      </div>

      {/* Important note */}
      <div className="mt-8 bg-bg-card border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-text-secondary text-sm">
          {t('achievements.noCoinsNote')}
        </p>
        <p className="text-text-muted text-xs mt-1">
          {t('achievements.designNote')}
        </p>
      </div>

      {/* Title select modal */}
      <TitleSelectModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        activeTitle={equippedTitle}
        onSelect={handleTitleSelect}
      />
    </div>
  )
}
