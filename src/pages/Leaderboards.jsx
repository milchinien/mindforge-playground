import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Calendar, ChevronDown, Flame, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { mockGames } from '../data/mockGames'

// --- Mock leaderboard data ---
const MOCK_PLAYERS = [
  { id: 'user-100', username: 'PixelMaster', xp: 48750, level: 47, gamesPlayed: 312, streak: 21 },
  { id: 'user-101', username: 'BrainStorm99', xp: 42300, level: 43, gamesPlayed: 278, streak: 14 },
  { id: 'user-102', username: 'QuizKoenig', xp: 38900, level: 40, gamesPlayed: 245, streak: 32 },
  { id: 'user-103', username: 'LernFuchs', xp: 35200, level: 37, gamesPlayed: 210, streak: 9 },
  { id: 'user-104', username: 'WissenHeld', xp: 31800, level: 34, gamesPlayed: 198, streak: 18 },
  { id: 'user-105', username: 'CodeNinja42', xp: 29400, level: 32, gamesPlayed: 187, streak: 7 },
  { id: 'user-106', username: 'MathGenius', xp: 27100, level: 30, gamesPlayed: 165, streak: 25 },
  { id: 'user-107', username: 'ScienceGirl', xp: 24500, level: 28, gamesPlayed: 152, streak: 11 },
  { id: 'user-108', username: 'HistoryPro', xp: 22800, level: 26, gamesPlayed: 143, streak: 5 },
  { id: 'user-109', username: 'GeoExpert', xp: 20100, level: 24, gamesPlayed: 130, streak: 16 },
  { id: 'user-110', username: 'PhysikFan', xp: 18700, level: 22, gamesPlayed: 118, streak: 3 },
  { id: 'user-111', username: 'BioNerd', xp: 16200, level: 20, gamesPlayed: 105, streak: 8 },
  { id: 'user-112', username: 'SprachProfi', xp: 14800, level: 18, gamesPlayed: 94, streak: 12 },
  { id: 'user-113', username: 'KunstFan', xp: 12500, level: 16, gamesPlayed: 82, streak: 4 },
  { id: 'user-114', username: 'MusikStar', xp: 10900, level: 14, gamesPlayed: 71, streak: 6 },
]

const WEEKLY_PLAYERS = [
  { id: 'user-102', username: 'QuizKoenig', xp: 4200, level: 40, gamesPlayed: 38, streak: 32 },
  { id: 'user-106', username: 'MathGenius', xp: 3800, level: 30, gamesPlayed: 34, streak: 25 },
  { id: 'user-100', username: 'PixelMaster', xp: 3500, level: 47, gamesPlayed: 29, streak: 21 },
  { id: 'user-104', username: 'WissenHeld', xp: 3100, level: 34, gamesPlayed: 26, streak: 18 },
  { id: 'user-109', username: 'GeoExpert', xp: 2800, level: 24, gamesPlayed: 22, streak: 16 },
  { id: 'user-101', username: 'BrainStorm99', xp: 2400, level: 43, gamesPlayed: 19, streak: 14 },
  { id: 'user-112', username: 'SprachProfi', xp: 2100, level: 18, gamesPlayed: 17, streak: 12 },
  { id: 'user-107', username: 'ScienceGirl', xp: 1900, level: 28, gamesPlayed: 15, streak: 11 },
  { id: 'user-103', username: 'LernFuchs', xp: 1700, level: 37, gamesPlayed: 13, streak: 9 },
  { id: 'user-111', username: 'BioNerd', xp: 1500, level: 20, gamesPlayed: 11, streak: 8 },
]

const MONTHLY_PLAYERS = [
  { id: 'user-100', username: 'PixelMaster', xp: 12400, level: 47, gamesPlayed: 89, streak: 21 },
  { id: 'user-102', username: 'QuizKoenig', xp: 11800, level: 40, gamesPlayed: 82, streak: 32 },
  { id: 'user-101', username: 'BrainStorm99', xp: 10200, level: 43, gamesPlayed: 74, streak: 14 },
  { id: 'user-106', username: 'MathGenius', xp: 9600, level: 30, gamesPlayed: 68, streak: 25 },
  { id: 'user-104', username: 'WissenHeld', xp: 8800, level: 34, gamesPlayed: 61, streak: 18 },
  { id: 'user-103', username: 'LernFuchs', xp: 8100, level: 37, gamesPlayed: 55, streak: 9 },
  { id: 'user-109', username: 'GeoExpert', xp: 7300, level: 24, gamesPlayed: 48, streak: 16 },
  { id: 'user-105', username: 'CodeNinja42', xp: 6800, level: 32, gamesPlayed: 43, streak: 7 },
  { id: 'user-107', username: 'ScienceGirl', xp: 6200, level: 28, gamesPlayed: 39, streak: 11 },
  { id: 'user-112', username: 'SprachProfi', xp: 5500, level: 18, gamesPlayed: 34, streak: 12 },
]

// Current user mock entry (always injected into lists)
const CURRENT_USER_STATS = { xp: 8450, level: 12, gamesPlayed: 56, streak: 4 }

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

// --- Tab button ---
function TabButton({ active, onClick, children, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer
        ${active
          ? 'bg-bg-card text-accent shadow-sm'
          : 'text-text-secondary hover:text-text-primary'
        }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

export default function Leaderboards() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('global')
  const [selectedGame, setSelectedGame] = useState('')
  const [showGameDropdown, setShowGameDropdown] = useState(false)

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
        ...CURRENT_USER_STATS,
        xp: selectedGame ? Math.round(CURRENT_USER_STATS.xp * 0.3) : CURRENT_USER_STATS.xp,
        gamesPlayed: selectedGame ? Math.round(CURRENT_USER_STATS.gamesPlayed * 0.3) : CURRENT_USER_STATS.gamesPlayed,
      }
      list = [...list, currentPlayer].sort((a, b) => b.xp - a.xp)
    }

    return list
  }, [basePlayers, selectedGame, currentUid, currentUsername])

  // Current user stats for the header card
  const currentUserRank = players.findIndex(p => p.id === currentUid) + 1
  const currentXp = CURRENT_USER_STATS.xp
  const currentLevel = CURRENT_USER_STATS.level
  const xpInLevel = currentXp - (currentLevel - 1) * 1000
  const xpNeeded = xpForLevel(currentLevel)
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))

  const selectedGameData = mockGames.find(g => g.id === selectedGame)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Helmet>
        <title>Leaderboards | MindForge</title>
        <meta name="description" content="Compare your scores with other players on the MindForge leaderboards." />
        <meta property="og:title" content="Leaderboards | MindForge" />
        <meta property="og:description" content="Compare your scores with other players on the MindForge leaderboards." />
      </Helmet>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">{t('leaderboards.title')}</h1>
          <p className="text-text-secondary">{t('leaderboards.subtitle')}</p>
        </div>
      </div>

      {/* Current user XP card */}
      {user && (
        <div className="bg-bg-card rounded-xl p-5 border border-accent/30 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-7 h-7 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-lg text-text-primary truncate">{currentUsername}</p>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-accent" /> Level {currentLevel}
                  </span>
                  <span>{t('common.rank', { rank: currentUserRank })}</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" /> {CURRENT_USER_STATS.streak} {t('common.days')}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-accent">{currentXp.toLocaleString('de-DE')} XP</p>
              <p className="text-xs text-text-muted">{CURRENT_USER_STATS.gamesPlayed} {t('leaderboards.gamesPlayed')}</p>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span>Level {currentLevel}</span>
              <span>{xpInLevel.toLocaleString('de-DE')} / {xpNeeded.toLocaleString('de-DE')} XP</span>
              <span>Level {currentLevel + 1}</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Time range tabs */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 mb-6 overflow-x-auto">
        <TabButton active={timeRange === 'global'} onClick={() => setTimeRange('global')} icon={Trophy}>
          {t('leaderboards.all')}
        </TabButton>
        <TabButton active={timeRange === 'weekly'} onClick={() => setTimeRange('weekly')} icon={Calendar}>
          {t('leaderboards.thisWeek')}
        </TabButton>
        <TabButton active={timeRange === 'monthly'} onClick={() => setTimeRange('monthly')} icon={TrendingUp}>
          {t('leaderboards.thisMonth')}
        </TabButton>
      </div>

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

      {/* Game info banner */}
      {selectedGameData && (
        <div className="flex items-center gap-3 bg-bg-secondary rounded-lg px-4 py-3 mb-6 border border-gray-700">
          <Trophy className="w-5 h-5 text-accent flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{selectedGameData.title}</p>
            <p className="text-xs text-text-muted">
              Top-Spieler nach XP - {t('leaderboards.playCount', { count: selectedGameData.plays.toLocaleString('de-DE') })}
            </p>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {players.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 0, 2].map(idx => {
            const p = players[idx]
            const rank = idx + 1
            const isMe = p.id === currentUid
            const colors = [
              'border-yellow-500/40 bg-yellow-500/5',
              'border-gray-400/30 bg-gray-400/5',
              'border-amber-600/30 bg-amber-600/5',
            ]
            const labels = [t('leaderboards.gold'), t('leaderboards.silver'), t('leaderboards.bronze')]
            const iconColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600']

            return (
              <div
                key={p.id}
                className={`rounded-xl p-4 border text-center transition-all ${colors[idx]} ${idx === 0 ? 'sm:-mt-4' : ''}`}
              >
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${idx === 0 ? 'bg-yellow-500/20 animate-pulse' : idx === 1 ? 'bg-gray-400/20' : 'bg-amber-600/20'}`}>
                  {rank === 1 ? <Crown className={`w-6 h-6 ${iconColors[idx]}`} /> : <Medal className={`w-6 h-6 ${iconColors[idx]}`} />}
                </div>
                <p className="text-xs text-text-muted mb-1">{labels[idx]}</p>
                <p className={`font-bold text-sm truncate ${isMe ? 'text-accent' : 'text-text-primary'}`}>
                  {p.username}
                </p>
                <p className="text-lg font-bold text-text-primary mt-1">{p.xp.toLocaleString('de-DE')}</p>
                <p className="text-xs text-text-muted">XP</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Full ranking list */}
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

      {/* Info footer */}
      <div className="mt-8 bg-bg-card border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-text-secondary text-sm">
          {t('leaderboards.updateNote')}
        </p>
        <p className="text-text-muted text-xs mt-1">
          {t('leaderboards.xpNote')}
        </p>
      </div>
    </div>
  )
}
