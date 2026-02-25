import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, SlidersHorizontal, Eye, Heart, ThumbsDown, Play, User, Trophy, Calendar, Gamepad2 } from 'lucide-react'
import { mockGames } from '../data/mockGames'
import { mockUsers } from '../data/mockUsers'
import { ALL_ACHIEVEMENTS } from '../data/achievementDefinitions'
import { MOCK_EVENTS } from '../data/mockEvents'
import { formatNumber } from '../utils/formatters'
import { getSubjectConfig } from '../data/subjectConfig'
import TagList from '../components/game/TagList'

// Search algorithms
function searchGames(query, games) {
  if (!query || query.trim() === '') return []
  const searchTerm = query.toLowerCase().trim()
  return games
    .map(game => {
      let score = 0
      if (game.title.toLowerCase().includes(searchTerm)) {
        score += 10
        if (game.title.toLowerCase().startsWith(searchTerm)) score += 5
      }
      if (game.tags.some(tag => tag.toLowerCase().includes(searchTerm))) score += 5
      if (game.creator.toLowerCase().includes(searchTerm)) score += 3
      if (game.description.toLowerCase().includes(searchTerm)) score += 1
      return { ...game, relevanceScore: score }
    })
    .filter(game => game.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function searchUsers(query, users) {
  if (!query || query.trim() === '') return []
  const searchTerm = query.toLowerCase().trim()
  return users.filter(u =>
    u.username.toLowerCase().includes(searchTerm) ||
    (u.bio && u.bio.toLowerCase().includes(searchTerm))
  )
}

function searchAchievements(query, achievements) {
  if (!query || query.trim() === '') return []
  const searchTerm = query.toLowerCase().trim()
  return achievements.filter(a =>
    a.name.toLowerCase().includes(searchTerm) ||
    a.description.toLowerCase().includes(searchTerm)
  )
}

function searchEvents(query, events) {
  if (!query || query.trim() === '') return []
  const searchTerm = query.toLowerCase().trim()
  return events.filter(e =>
    e.title.toLowerCase().includes(searchTerm) ||
    e.description.toLowerCase().includes(searchTerm)
  )
}

function searchByTag(tag, games) {
  if (!tag) return []
  return games.filter(game =>
    game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

function sortGames(games, sortBy) {
  switch (sortBy) {
    case 'popular':
      return [...games].sort((a, b) => b.likes - a.likes)
    case 'new':
      return [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'mostPlayed':
      return [...games].sort((a, b) => b.plays - a.plays)
    case 'relevance':
    default:
      return games
  }
}

const TABS = [
  { id: 'games', label: 'Spiele', icon: Gamepad2 },
  { id: 'users', label: 'User', icon: User },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'events', label: 'Events', icon: Calendar },
]

function GameResultItem({ game, t }) {
  const navigate = useNavigate()
  const config = getSubjectConfig(game.subject)

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="flex gap-4 p-4 bg-bg-secondary hover:bg-bg-card rounded-xl transition-colors duration-200 cursor-pointer"
    >
      <div className={`hidden sm:flex w-48 h-28 flex-shrink-0 rounded-lg bg-gradient-to-br ${config.gradient} items-center justify-center overflow-hidden relative`}>
        {game.thumbnail ? (
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1 left-2 text-5xl">{config.icon}</div>
            </div>
            <span className="text-3xl drop-shadow-lg">{config.icon}</span>
          </>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-bold text-text-primary line-clamp-1">{game.title}</h3>
          {game.premium && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0">
              {game.price > 0 ? `${game.price} MC` : 'Premium'}
            </span>
          )}
        </div>
        <p className="text-text-muted text-sm mt-0.5">
          {t('game.by')}{' '}
          <Link to={`/profile/${game.creator}`} onClick={(e) => e.stopPropagation()} className="text-accent hover:underline">
            {game.creator}
          </Link>
        </p>
        <p className="text-text-secondary text-sm mt-1 line-clamp-2">{game.description}</p>
        <div className="mt-2"><TagList tags={game.tags} maxTags={5} size="sm" /></div>
        <div className="flex items-center gap-4 mt-2 text-text-muted text-xs">
          <span className="flex items-center gap-1"><Heart size={12} /> {formatNumber(game.likes)}</span>
          <span className="flex items-center gap-1"><ThumbsDown size={12} /> {formatNumber(game.dislikes)}</span>
          <span className="flex items-center gap-1"><Play size={12} /> {formatNumber(game.plays)}</span>
          <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(game.views)}</span>
        </div>
      </div>
    </div>
  )
}

function UserResultItem({ user }) {
  return (
    <Link to={`/profile/${user.username}`} className="flex items-center gap-4 p-4 bg-bg-secondary hover:bg-bg-card rounded-xl transition-colors">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold text-lg">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary">{user.username}</h3>
        {user.activeTitle && <p className="text-xs text-accent">{user.activeTitle}</p>}
        {user.bio && <p className="text-sm text-text-secondary mt-1 line-clamp-1">{user.bio}</p>}
      </div>
      <div className="text-right text-xs text-text-muted">
        {user.isPremium && <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs">Premium</span>}
      </div>
    </Link>
  )
}

function AchievementResultItem({ achievement }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-xl">
      <span className="text-3xl">{achievement.icon}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary">{achievement.name}</h3>
        <p className="text-sm text-text-secondary mt-0.5">{achievement.description}</p>
        <p className="text-xs text-accent mt-1">Belohnung: Titel "{achievement.reward.value}"</p>
      </div>
      <span className="text-xs bg-bg-card text-text-muted px-2 py-1 rounded-full capitalize">{achievement.category}</span>
    </div>
  )
}

function EventResultItem({ event }) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    ended: 'bg-gray-500/20 text-gray-400',
  }
  return (
    <Link to="/events" className="flex items-center gap-4 p-4 bg-bg-secondary hover:bg-bg-card rounded-xl transition-colors">
      <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
        <Calendar className="w-6 h-6 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary">{event.title}</h3>
        <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">{event.description}</p>
        <p className="text-xs text-text-muted mt-1">{event.participants} Teilnehmer</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[event.status] || statusColors.ended}`}>
        {event.status === 'active' ? 'Aktiv' : event.status === 'upcoming' ? 'Bald' : 'Beendet'}
      </span>
    </Link>
  )
}

export default function Search() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const sortParam = searchParams.get('sort') || 'relevance'

  const [localQuery, setLocalQuery] = useState(query)
  const [sortBy, setSortBy] = useState(sortParam)
  const [activeTab, setActiveTab] = useState('games')
  const [results, setResults] = useState({ games: [], users: [], achievements: [], events: [] })

  const SORT_OPTIONS = [
    { value: 'relevance', label: t('search.sortRelevance') },
    { value: 'popular', label: t('search.sortPopular') },
    { value: 'new', label: t('search.sortNew') },
    { value: 'mostPlayed', label: t('search.sortMostPlayed') },
  ]

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    if (query) {
      const gameResults = sortGames(searchGames(query, mockGames), sortBy)
      const userResults = searchUsers(query, mockUsers)
      const achievementResults = searchAchievements(query, ALL_ACHIEVEMENTS)
      const eventResults = searchEvents(query, MOCK_EVENTS)
      setResults({ games: gameResults, users: userResults, achievements: achievementResults, events: eventResults })
    } else if (tag) {
      setResults({ games: sortGames(searchByTag(tag, mockGames), sortBy), users: [], achievements: [], events: [] })
    } else {
      setResults({ games: [], users: [], achievements: [], events: [] })
    }
  }, [query, tag, sortBy])

  const handleLocalSearch = (e) => {
    if (e.key === 'Enter' && localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() })
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    setSearchParams(params)
  }

  const totalResults = results.games.length + results.users.length + results.achievements.length + results.events.length

  const currentResults = results[activeTab] || []

  return (
    <div className="py-4">
      <>
        <title>Suche | MindForge</title>
        <meta name="description" content="Suche nach Lernspielen, Usern, Achievements und Events auf MindForge." />
      </>

      {/* Header */}
      <div className="mb-6">
        {query && <h1 className="text-2xl font-bold">{t('search.resultsFor', { query })}</h1>}
        {tag && !query && <h1 className="text-2xl font-bold">{t('search.gamesWithTag', { tag })}</h1>}
        {!query && !tag && <h1 className="text-2xl font-bold">{t('search.title')}</h1>}
        <p className="text-text-secondary mt-1">{totalResults} Ergebnisse gefunden</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleLocalSearch}
          placeholder={t('search.searchPlaceholder')}
          className="!pl-12 !py-3 !text-lg"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const count = results[tab.id]?.length || 0
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-accent/30' : 'bg-bg-hover'
              }`}>
                {count}
              </span>
            </button>
          )
        })}

        {/* Sort - only for games */}
        {activeTab === 'games' && (
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="!w-auto !py-1.5 !px-3 !text-sm"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      {currentResults.length > 0 ? (
        <div className="space-y-3">
          {activeTab === 'games' && currentResults.map(game => (
            <GameResultItem key={game.id} game={game} t={t} />
          ))}
          {activeTab === 'users' && currentResults.map(user => (
            <UserResultItem key={user.uid} user={user} />
          ))}
          {activeTab === 'achievements' && currentResults.map(achievement => (
            <AchievementResultItem key={achievement.id} achievement={achievement} />
          ))}
          {activeTab === 'events' && currentResults.map(event => (
            <EventResultItem key={event.id} event={event} />
          ))}
        </div>
      ) : (query || tag) ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">{t('search.noResults')}</h2>
          <p className="text-text-secondary mb-6">
            Keine {TABS.find(t => t.id === activeTab)?.label} gefunden
            {query ? ` fuer "${query}"` : ` mit Tag "${tag}"`}
          </p>
          <Link to="/browse" className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold inline-block text-white transition-colors">
            {t('search.toMindbrowser')}
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">{t('search.whatAreYouLooking')}</h2>
          <p className="text-text-secondary">{t('search.enterSearchTerm')}</p>
        </div>
      )}
    </div>
  )
}
