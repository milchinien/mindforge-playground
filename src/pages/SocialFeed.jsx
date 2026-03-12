import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Heart,
  Trophy,
  Gamepad2,
  Star,
  TrendingUp,
  Upload,
  ShoppingBag,
  Filter,
  Clock,
  Rss,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ACTIVITY_TYPES = {
  achievement: { icon: Trophy, labelKey: 'social.activityTypes.achievement', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  game_played: { icon: Gamepad2, labelKey: 'social.activityTypes.gamePlayed', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  highscore: { icon: TrendingUp, labelKey: 'social.activityTypes.highscore', color: 'text-green-400', bg: 'bg-green-400/10' },
  item_purchased: { icon: ShoppingBag, labelKey: 'social.activityTypes.itemPurchased', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  game_uploaded: { icon: Upload, labelKey: 'social.activityTypes.gameUploaded', color: 'text-accent', bg: 'bg-accent/10' },
  star_rating: { icon: Star, labelKey: 'social.activityTypes.starRating', color: 'text-orange-400', bg: 'bg-orange-400/10' },
}

const now = Date.now()
const HOUR = 3600000
const DAY = 86400000

// Activity data will come from the database. Empty until real data is connected.
const MOCK_ACTIVITIES = []

function getTimeGroup(timestamp, t) {
  const diff = now - timestamp
  if (diff < DAY) return t('social.timeGroups.today')
  if (diff < DAY * 2) return t('social.timeGroups.yesterday')
  if (diff < DAY * 7) return t('social.timeGroups.thisWeek')
  return t('social.timeGroups.older')
}

function formatRelativeTime(timestamp, t) {
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('social.relativeTime.justNow')
  if (minutes < 60) return t('social.relativeTime.minutesAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('social.relativeTime.hoursAgo', { count: hours })
  const days = Math.floor(hours / 24)
  if (days === 1) return t('social.relativeTime.yesterday')
  return t('social.relativeTime.daysAgo', { count: days })
}

function ActivityCard({ activity, isNew, t }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const typeConfig = ACTIVITY_TYPES[activity.type]
  const Icon = typeConfig.icon

  const handleLike = () => {
    setLiked(prev => !prev)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className="group relative flex gap-4 bg-bg-card rounded-xl p-4 border border-gray-700
                    hover:border-gray-600 transition-all duration-200">
      {/* New badge */}
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold
                         px-2 py-0.5 rounded-full animate-pulse shadow-lg shadow-accent/25">
          {t('social.new')}
        </span>
      )}

      {/* User avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-hover flex items-center
                      justify-center text-xl border border-gray-600">
        {activity.user.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-text-primary leading-relaxed">
            <span className="font-semibold text-accent hover:underline cursor-pointer">
              {activity.user.name}
            </span>{' '}
            <span className="text-text-secondary">{activity.text}</span>
          </p>
          <span className={`flex-shrink-0 p-1.5 rounded-lg ${typeConfig.bg}`}>
            <Icon size={14} className={typeConfig.color} />
          </span>
        </div>

        {activity.detail && (
          <p className="text-xs text-text-muted mt-1 bg-bg-hover/50 inline-block px-2 py-1 rounded-md">
            {activity.detail}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2.5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs transition-colors duration-150
              ${liked
                ? 'text-red-400'
                : 'text-text-muted hover:text-red-400'
              }`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} className="transition-transform active:scale-125" />
            <span>{likeCount}</span>
          </button>

          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock size={12} />
            {formatRelativeTime(activity.timestamp, t)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SocialFeed() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')

  const FILTER_TABS = [
    { id: 'all', label: t('social.filters.all') },
    { id: 'achievement', label: t('social.filters.achievements') },
    { id: 'game', label: t('social.filters.games') },
    { id: 'highscore', label: t('social.filters.highscores') },
  ]

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return MOCK_ACTIVITIES
    if (activeFilter === 'game') {
      return MOCK_ACTIVITIES.filter(a =>
        ['game_played', 'game_uploaded', 'star_rating'].includes(a.type)
      )
    }
    return MOCK_ACTIVITIES.filter(a => a.type === activeFilter)
  }, [activeFilter])

  const groupedActivities = useMemo(() => {
    const groups = {}
    for (const activity of filteredActivities) {
      const group = getTimeGroup(activity.timestamp, t)
      if (!groups[group]) groups[group] = []
      groups[group].push(activity)
    }
    return groups
  }, [filteredActivities, t])

  const groupOrder = [
    t('social.timeGroups.today'),
    t('social.timeGroups.yesterday'),
    t('social.timeGroups.thisWeek'),
    t('social.timeGroups.older'),
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <>
        <title>Activity Feed | MindForge</title>
        <meta name="description" content="See what your friends are up to on MindForge." />
        <meta property="og:title" content="Activity Feed | MindForge" />
        <meta property="og:description" content="See what your friends are up to on MindForge." />
      </>

      <div className="px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Rss size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{t('social.title')}</h1>
            <p className="text-sm text-text-muted">{t('social.subtitle')}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={16} className="text-text-muted flex-shrink-0" />
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-150
                ${activeFilter === tab.id
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-bg-card text-text-secondary border border-gray-700 hover:border-gray-500'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity Stream */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles size={48} className="text-text-muted mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {t('social.noActivities')}
            </h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto">
              {t('social.noActivitiesDesc')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupOrder.map(group => {
              const activities = groupedActivities[group]
              if (!activities || activities.length === 0) return null
              return (
                <section key={group}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {group}
                    </h2>
                    <div className="flex-1 h-px bg-gray-700/50" />
                  </div>
                  <div className="space-y-3">
                    {activities.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        isNew={now - activity.timestamp < HOUR * 2}
                        t={t}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
