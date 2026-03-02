import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Shield, Zap, Crown, Trophy, Target, Clock,
  Medal, BookOpen,
  Lock, CheckCircle2, Calendar,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCountdown } from '../hooks/useCountdown'
import { useSeasonStore } from '../stores/seasonStore'
import {
  CURRENT_SEASON,
  WEEKLY_CHALLENGES,
  SEASON_LEADERBOARD,
  PREMIUM_PASS_PRICE,
} from '../data/seasonData'
import BattlePassTrack from '../components/seasons/BattlePassTrack'
import ChallengeCard from '../components/seasons/ChallengeCard'
import Tabs from '../components/ui/Tabs'

// ---- Rank badge for leaderboard ----
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

// ============================================================
// OVERVIEW TAB
// ============================================================
function OverviewTab() {
  const seasonXP = useSeasonStore((s) => s.seasonXP)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const getXPInCurrentTier = useSeasonStore((s) => s.getXPInCurrentTier)
  const isPremiumPass = useSeasonStore((s) => s.isPremiumPass)
  const upgradeToPremium = useSeasonStore((s) => s.upgradeToPremium)
  const challengeProgress = useSeasonStore((s) => s.challengeProgress)
  const countdown = useCountdown(CURRENT_SEASON.endDate)

  const currentTier = getBattlePassTier()
  const tierProgress = getXPInCurrentTier()

  // Stats
  const completedChallenges = Object.values(challengeProgress).filter((c) => c.completed).length
  const totalChallenges = Object.keys(challengeProgress).length

  // Calculate days elapsed
  const seasonStart = new Date(CURRENT_SEASON.startDate)
  const now = new Date()
  const daysElapsed = Math.max(0, Math.floor((now - seasonStart) / (1000 * 60 * 60 * 24)))
  const seasonPercent = Math.min(100, Math.round((daysElapsed / CURRENT_SEASON.durationDays) * 100))

  return (
    <div className="space-y-6">
      {/* Season banner */}
      <div className={`relative rounded-2xl overflow-hidden border border-indigo-500/30`}>
        <div className={`bg-gradient-to-r ${CURRENT_SEASON.theme.gradient} p-6 sm:p-8`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-4 left-12 w-24 h-24 rounded-full bg-white/15 blur-xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-white/80" />
              <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
                Season {CURRENT_SEASON.number}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {CURRENT_SEASON.name}
            </h2>
            <p className="text-white/70 text-sm sm:text-base mb-6">
              {CURRENT_SEASON.subtitle}
            </p>

            {/* Countdown */}
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Endet in</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {countdown.formatted}
                </p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20" />
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{countdown.days}</p>
                  <p className="text-xs text-white/60">Tage</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{countdown.hours}</p>
                  <p className="text-xs text-white/60">Stunden</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{countdown.minutes}</p>
                  <p className="text-xs text-white/60">Minuten</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Season progress bar */}
        <div className="bg-bg-card px-6 py-3 border-t border-indigo-500/20">
          <div className="flex justify-between text-xs text-text-muted mb-1.5">
            <span>Tag {daysElapsed} von {CURRENT_SEASON.durationDays}</span>
            <span>{seasonPercent}% der Season vergangen</span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${seasonPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current tier card */}
      <div className="bg-bg-card rounded-xl p-5 border border-accent/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-accent">{currentTier}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-muted">Aktueller Tier</p>
              <p className="text-xl font-bold text-text-primary">Battle Pass Tier {currentTier}</p>
              <p className="text-sm text-text-secondary">
                {seasonXP.toLocaleString('de-DE')} Season-XP gesammelt
              </p>
            </div>
          </div>
          {isPremiumPass ? (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2.5 flex-shrink-0">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">Premium Pass Aktiv</span>
            </div>
          ) : (
            <button
              onClick={upgradeToPremium}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold rounded-lg px-5 py-2.5 transition-all cursor-pointer flex-shrink-0"
            >
              <Crown className="w-5 h-5" />
              <span>Premium Pass ({PREMIUM_PASS_PRICE} MC)</span>
            </button>
          )}
        </div>

        {/* Tier progress */}
        {currentTier < CURRENT_SEASON.maxTier && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span>Tier {currentTier}</span>
              <span>{tierProgress.current.toLocaleString('de-DE')} / {tierProgress.needed.toLocaleString('de-DE')} XP</span>
              <span>Tier {currentTier + 1}</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-700"
                style={{ width: `${tierProgress.percent}%` }}
              />
            </div>
          </div>
        )}
        {currentTier >= CURRENT_SEASON.maxTier && (
          <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="font-semibold">Maximaler Tier erreicht! Du bist eine Legende!</span>
          </div>
        )}
      </div>

      {/* Compact season stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-accent" />
          {seasonXP.toLocaleString('de-DE')} XP
        </span>
        <span className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-purple-400" />
          {completedChallenges}/{totalChallenges} Challenges
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-orange-400" />
          {CURRENT_SEASON.durationDays - daysElapsed} Tage uebrig
        </span>
      </div>
    </div>
  )
}

// ============================================================
// BATTLE PASS TAB
// ============================================================
function BattlePassTab() {
  const isPremiumPass = useSeasonStore((s) => s.isPremiumPass)
  const upgradeToPremium = useSeasonStore((s) => s.upgradeToPremium)
  const seasonXP = useSeasonStore((s) => s.seasonXP)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const currentTier = getBattlePassTier()

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            Battle Pass - Season {CURRENT_SEASON.number}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Tier {currentTier} / {CURRENT_SEASON.maxTier} - {seasonXP.toLocaleString('de-DE')} XP
          </p>
        </div>

        {!isPremiumPass && (
          <button
            onClick={upgradeToPremium}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold rounded-lg px-5 py-2.5 transition-all cursor-pointer"
          >
            <Crown className="w-5 h-5" />
            <span>Premium freischalten ({PREMIUM_PASS_PRICE} MC)</span>
          </button>
        )}
      </div>

      {/* Battle Pass Track */}
      <BattlePassTrack />
    </div>
  )
}

// ============================================================
// CHALLENGES TAB
// ============================================================
function ChallengesTab() {
  const challengeProgress = useSeasonStore((s) => s.challengeProgress)
  const currentWeek = useSeasonStore((s) => s.currentWeek)
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)

  const weekData = WEEKLY_CHALLENGES.find((w) => w.week === selectedWeek)

  // Calculate next Monday for weekly reset countdown
  const now = new Date()
  const nextMonday = new Date(now)
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7))
  nextMonday.setHours(0, 0, 0, 0)
  const resetCountdown = useCountdown(nextMonday.toISOString())

  // Count completed for each week
  const weekCompletionCounts = useMemo(() => {
    const counts = {}
    for (const w of WEEKLY_CHALLENGES) {
      const completed = w.challenges.filter((c) => challengeProgress[c.id]?.completed).length
      counts[w.week] = { completed, total: w.challenges.length }
    }
    return counts
  }, [challengeProgress])

  return (
    <div className="space-y-6">
      {/* Header with reset timer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Woechentliche Challenges
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Schliesse Challenges ab, um Season-XP zu verdienen
          </p>
        </div>

        <div className="flex items-center gap-2 bg-bg-card border border-gray-700 rounded-lg px-4 py-2.5">
          <Clock className="w-4 h-4 text-text-muted" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Naechster Reset</p>
            <p className="text-sm font-mono font-semibold text-text-primary">{resetCountdown.formatted}</p>
          </div>
        </div>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WEEKLY_CHALLENGES.map((w) => {
          const counts = weekCompletionCounts[w.week] || { completed: 0, total: 5 }
          const isCurrentWeek = w.week === currentWeek
          const isSelected = w.week === selectedWeek
          const allDone = counts.completed === counts.total

          return (
            <button
              key={w.week}
              onClick={() => setSelectedWeek(w.week)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : allDone
                    ? 'bg-success/5 text-success border-success/20 hover:bg-success/10'
                    : 'bg-bg-card text-text-secondary border-gray-700 hover:text-text-primary hover:border-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                Woche {w.week}
                {isCurrentWeek && (
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
                {allDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
              <span className="text-xs opacity-70 block mt-0.5">
                {counts.completed}/{counts.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* Challenge cards */}
      {weekData ? (
        <div className="space-y-3">
          {weekData.challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progress={challengeProgress[challenge.id]}
            />
          ))}
        </div>
      ) : (
        <div className="bg-bg-card rounded-xl p-8 border border-gray-700 text-center">
          <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">Challenges fuer diese Woche sind noch nicht verfuegbar.</p>
        </div>
      )}

    </div>
  )
}

// ============================================================
// LEADERBOARD TAB
// ============================================================
function LeaderboardTab() {
  const { user } = useAuth()
  const seasonXP = useSeasonStore((s) => s.seasonXP)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const challengeProgress = useSeasonStore((s) => s.challengeProgress)
  const currentTier = getBattlePassTier()

  const currentUid = user?.uid || 'current-user'
  const currentUsername = user?.username || 'Spieler'

  // Build leaderboard with current user injected
  const players = useMemo(() => {
    const list = [...SEASON_LEADERBOARD]
    const hasUser = list.some((p) => p.id === currentUid)
    if (!hasUser) {
      const completedChallenges = Object.values(challengeProgress).filter((c) => c.completed).length
      list.push({
        id: currentUid,
        username: currentUsername,
        seasonXP,
        tier: currentTier,
        gamesPlayed: 56,
        challengesCompleted: completedChallenges,
      })
    }
    return list.sort((a, b) => b.seasonXP - a.seasonXP)
  }, [currentUid, currentUsername, seasonXP, currentTier, challengeProgress])

  const currentUserRank = players.findIndex((p) => p.id === currentUid) + 1

  return (
    <div className="space-y-4">
      {/* Ranking list */}
      <div className="space-y-2">
        {players.map((player, index) => {
          const rank = index + 1
          const isMe = player.id === currentUid

          const borderClass = rank === 1
            ? 'border-yellow-500/40 bg-yellow-500/5'
            : rank === 2
              ? 'border-gray-400/30 bg-gray-400/5'
              : rank === 3
                ? 'border-amber-600/30 bg-amber-600/5'
                : isMe
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-gray-700'

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all hover:bg-bg-hover/30 ${borderClass} ${isMe ? 'ring-1 ring-accent/30' : ''}`}
            >
              <RankBadge rank={rank} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold truncate ${isMe ? 'text-accent' : 'text-text-primary'}`}>
                    {player.username}
                  </span>
                  {isMe && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full flex-shrink-0">Du</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Tier {player.tier}
                  </span>
                  <span>{player.gamesPlayed} Spiele</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-text-primary">{player.seasonXP.toLocaleString('de-DE')}</p>
                <p className="text-xs text-text-muted">Season XP</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// MAIN SEASONS PAGE
// ============================================================
const TABS = [
  { id: 'overview', label: 'Uebersicht', icon: BookOpen },
  { id: 'battlepass', label: 'Battle Pass', icon: Shield },
  { id: 'challenges', label: 'Challenges', icon: Target },
  { id: 'leaderboard', label: 'Rangliste', icon: Trophy },
]

export default function Seasons() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="p-6">
      <>
        <title>{`Season ${CURRENT_SEASON.number}: ${CURRENT_SEASON.name} | MindForge`}</title>
        <meta name="description" content={`Season ${CURRENT_SEASON.number} "${CURRENT_SEASON.name}" - ${CURRENT_SEASON.description}`} />
        <meta property="og:title" content={`Season ${CURRENT_SEASON.number}: ${CURRENT_SEASON.name} | MindForge`} />
        <meta property="og:description" content={CURRENT_SEASON.description} />
        <meta property="og:type" content="website" />
      </>

      {/* Tab bar */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'battlepass' && <BattlePassTab />}
      {activeTab === 'challenges' && <ChallengesTab />}
      {activeTab === 'leaderboard' && <LeaderboardTab />}
    </div>
  )
}
