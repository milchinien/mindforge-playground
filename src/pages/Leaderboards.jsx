import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, Medal, Crown, TrendingUp, Users, Calendar, ChevronDown, Flame } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { mockGames } from '../data/mockGames'
import PremiumBadge from '../components/premium/PremiumBadge'
import Tabs from '../components/ui/Tabs'
import { useAchievementStore, selectProgress } from '../stores/achievementStore'
import { useSeasonStore, selectSeasonXP } from '../stores/seasonStore'

// Leaderboard data will come from the database. Empty arrays until real data is connected.
const MOCK_PLAYERS = []
const WEEKLY_PLAYERS = []
const MONTHLY_PLAYERS = []

// CURRENT_USER_STATS is now derived from stores (see component body)

function xpForLevel(level) {
  return level * 1000
}

// --- Rank badge component with animation ---
function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
        <Crown className="w-5 h-5 text-yellow-400" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300/20 flex items-center justify-center">
        <Medal className="w-5 h-5 text-gray-300" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-700/20 flex items-center justify-center">
        <Medal className="w-5 h-5 text-amber-600" />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
      <span className="text-sm font-bold text-text-muted">{rank}</span>
    </div>
  )
}

// --- Single leaderboard row ---
function LeaderboardRow({ player, rank, isCurrentUser, t }) {
  const borderClass = rank === 1
    ? 'border-yellow-500/40 bg-yellow-500/5'
    : rank === 2
      ? 'border-gray-400/30 bg-gray-400/5'
      : rank === 3
        ? 'border-amber-600/30 bg-amber-600/5'
        : isCurrentUser
          ? 'border-accent/40 bg-accent/5'
          : 'border-gray-700'

  return (
    <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all hover:bg-bg-hover/30 ${borderClass} ${isCurrentUser ? 'ring-1 ring-accent/30' : ''}`}>
      <RankBadge rank={rank} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold truncate ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
            {player.username}
          </span>
          {player.premiumTier && (
            <PremiumBadge tier={player.premiumTier} variant="inline" glow={true} />
          )}
          {isCurrentUser && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full flex-shrink-0">{t('leaderboards.you')}</span>
          )}
          {player.streak >= 20 && (
            <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
          <span>Level {player.level}</span>
          <span className="hidden sm:inline">{player.gamesPlayed} {t('leaderboards.gamesPlayed')}</span>
          {player.streak > 0 && (
            <span className="hidden sm:inline flex items-center gap-1">
              <Flame className="w-3 h-3 inline" /> {player.streak} {t('common.days')}
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-bold text-text-primary">{player.xp.toLocaleString('de-DE')}</p>
        <p className="text-xs text-text-muted">XP</p>
      </div>
    </div>
  )
}

export default function Leaderboards() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('global')
  const [selectedGame, setSelectedGame] = useState('')
  const [showGameDropdown, setShowGameDropdown] = useState(false)

  // Real user stats from stores
  const progress = useAchievementStore(selectProgress)
  const seasonXP = useSeasonStore(selectSeasonXP)

  const currentUserStats = useMemo(() => ({
    xp: seasonXP,
    level: Math.floor(seasonXP / 1000) + 1,
    gamesPlayed: progress.games_played,
    streak: progress.daily_streak,
  }), [seasonXP, progress.games_played, progress.daily_streak])

  const currentUsername = user?.username || 'Spieler'
  const currentUid = user?.uid || 'current-user'

  // Build player list based on time range
  const basePlayers = useMemo(() => {
    if (timeRange === 'weekly') return WEEKLY_PLAYERS
    if (timeRange === 'monthly') return MONTHLY_PLAYERS
    return MOCK_PLAYERS
  }, [timeRange])

  // If a game is selected, generate pseudo-random scores based on game id
  const players = useMemo(() => {
    let list = basePlayers
    if (selectedGame) {
      const game = mockGames.find(g => g.id === selectedGame)
      if (game) {
        const seed = game.plays || 1000
        list = basePlayers.slice(0, 10).map((p, i) => ({
          ...p,
          xp: Math.round((seed / (i + 1)) * (1 - i * 0.05)),
          gamesPlayed: Math.max(1, Math.round(p.gamesPlayed * 0.3)),
        }))
      }
    }

    // Inject current user if not already present
    const hasCurrentUser = list.some(p => p.id === currentUid)
    if (!hasCurrentUser) {
      const currentPlayer = {
        id: currentUid,
        username: currentUsername,
        ...currentUserStats,
        xp: selectedGame ? Math.round(currentUserStats.xp * 0.3) : currentUserStats.xp,
        gamesPlayed: selectedGame ? Math.round(currentUserStats.gamesPlayed * 0.3) : currentUserStats.gamesPlayed,
      }
      list = [...list, currentPlayer].sort((a, b) => b.xp - a.xp)
    }

    return list
  }, [basePlayers, selectedGame, currentUid, currentUsername, currentUserStats])

  const selectedGameData = mockGames.find(g => g.id === selectedGame)

  return (
    <div className="p-6">
      <>
        <title>Leaderboards | MindForge</title>
        <meta name="description" content="Compare your scores with other players on the MindForge leaderboards." />
        <meta property="og:title" content="Leaderboards | MindForge" />
        <meta property="og:description" content="Compare your scores with other players on the MindForge leaderboards." />
      </>

      {/* Time range tabs */}
      <Tabs
        tabs={[
          { id: 'global', label: t('leaderboards.all'), icon: Trophy },
          { id: 'weekly', label: t('leaderboards.thisWeek'), icon: Calendar },
          { id: 'monthly', label: t('leaderboards.thisMonth'), icon: TrendingUp },
        ]}
        activeTab={timeRange}
        onChange={setTimeRange}
        className="mb-6"
      />

      {/* Game filter dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setShowGameDropdown(!showGameDropdown)}
          className="flex items-center justify-between w-full sm:w-80 bg-bg-card border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2.5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Users className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="text-sm text-text-primary truncate">
              {selectedGameData ? selectedGameData.title : t('leaderboards.allGames')}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${showGameDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showGameDropdown && (
          <div className="absolute z-20 mt-1 w-full sm:w-80 bg-bg-card border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            <button
              onClick={() => { setSelectedGame(''); setShowGameDropdown(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-bg-hover ${!selectedGame ? 'text-accent bg-accent/10' : 'text-text-primary'}`}
            >
              {t('leaderboards.allGames')}
            </button>
            {mockGames.map(game => (
              <button
                key={game.id}
                onClick={() => { setSelectedGame(game.id); setShowGameDropdown(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer hover:bg-bg-hover ${selectedGame === game.id ? 'text-accent bg-accent/10' : 'text-text-primary'}`}
              >
                <span className="block truncate">{game.title}</span>
                <span className="text-xs text-text-muted">{t('leaderboards.playCount', { count: game.plays.toLocaleString('de-DE') })}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ranking list */}
      <div className="space-y-2">
        {players.map((player, index) => (
          <LeaderboardRow
            key={player.id}
            player={player}
            rank={index + 1}
            isCurrentUser={player.id === currentUid}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}
