import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  ALL_ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  MOCK_USER_PROGRESS,
} from '../data/achievementDefinitions'
import TitleSelectModal from '../components/achievements/TitleSelectModal'

function getAchievementStatus(achievement, userProgress, unlockedAchievements) {
  if (unlockedAchievements.includes(achievement.id)) {
    return { status: 'unlocked', current: achievement.requirement.value, percent: 100 }
  }

  const req = achievement.requirement
  let current = 0

  switch (req.type) {
    case 'games_played': current = userProgress.games_played || 0; break
    case 'games_completed': current = userProgress.games_completed || 0; break
    case 'daily_streak': current = userProgress.daily_streak || 0; break
    case 'likes_given': current = userProgress.likes_given || 0; break
    case 'total_playtime_minutes': current = userProgress.total_playtime_minutes || 0; break
    case 'following_count': current = userProgress.following_count || 0; break
    case 'followers_count': current = userProgress.followers_count || 0; break
    case 'friends_count': current = userProgress.friends_count || 0; break
    case 'avatar_customized': current = userProgress.avatar_customized || 0; break
    case 'profile_complete': current = userProgress.profile_complete || 0; break
    case 'events_participated': current = userProgress.events_participated || 0; break
    case 'events_completed': current = userProgress.events_completed || 0; break
    case 'games_created': current = userProgress.games_created || 0; break
    case 'total_likes_received': current = userProgress.total_likes_received || 0; break
    case 'total_plays_received': current = userProgress.total_plays_received || 0; break
    case 'assets_sold': current = userProgress.assets_sold || 0; break
    case 'is_premium': current = userProgress.is_premium || 0; break
    case 'game_approval_rate': current = userProgress.game_approval_rate || 0; break
    case 'category_games_completed':
      current = userProgress.category_games_completed?.[req.category] || 0; break
    case 'category_perfect_scores':
      current = userProgress.category_perfect_scores?.[req.category] || 0; break
    case 'unique_categories_played':
      current = userProgress.unique_categories_played || 0; break
    default: current = 0
  }

  const percent = Math.min(100, Math.round((current / req.value) * 100))
  return {
    status: percent >= 100 ? 'completable' : 'locked',
    current: Math.min(current, req.value),
    percent,
  }
}

function AchievementCard({ achievement, status, current, percent }) {
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
              Titel: "{achievement.reward.value}"
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
  const [activeCategory, setActiveCategory] = useState('player')
  const [userProgress] = useState(MOCK_USER_PROGRESS)
  const [unlockedAchievements] = useState(['first-steps', 'first-like', 'avatar-creator'])
  const [activeTitle, setActiveTitle] = useState('Anfaenger')
  const [showTitleModal, setShowTitleModal] = useState(false)

  const filteredAchievements = ALL_ACHIEVEMENTS.filter(a => a.category === activeCategory)

  const totalUnlocked = unlockedAchievements.length
  const totalAchievements = ALL_ACHIEVEMENTS.length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-text-secondary mt-1">
            {totalUnlocked} von {totalAchievements} freigeschaltet
          </p>
        </div>

        {/* Active title selector */}
        <button
          onClick={() => setShowTitleModal(true)}
          className="flex items-center gap-2 bg-bg-card border border-gray-700 hover:border-accent/50 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-sm text-text-muted">Aktiver Titel:</span>
          <span className="text-sm font-semibold text-accent">
            {activeTitle ? `"${activeTitle}"` : 'Keiner'}
          </span>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-8 overflow-x-auto">
        {ACHIEVEMENT_CATEGORIES.map(cat => {
          const catUnlocked = ALL_ACHIEVEMENTS
            .filter(a => a.category === cat.id && unlockedAchievements.includes(a.id))
            .length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer flex-1
                ${activeCategory === cat.id
                  ? 'bg-bg-card text-accent shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
              <span className="text-xs text-text-muted">{catUnlocked}/{cat.count}</span>
            </button>
          )
        })}
      </div>

      {/* Achievement list */}
      <div className="space-y-3">
        {filteredAchievements.map(achievement => {
          const { status, current, percent } = getAchievementStatus(achievement, userProgress, unlockedAchievements)
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
          Achievements geben <strong className="text-text-primary">keine MindCoins</strong> - nur kosmetische Belohnungen wie Titel.
        </p>
        <p className="text-text-muted text-xs mt-1">
          Das ist eine bewusste Design-Entscheidung gegen Farming.
        </p>
      </div>

      {/* Title select modal */}
      <TitleSelectModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        unlockedAchievements={unlockedAchievements}
        activeTitle={activeTitle}
        onSelect={(title) => {
          setActiveTitle(title)
          setShowTitleModal(false)
        }}
      />
    </div>
  )
}
