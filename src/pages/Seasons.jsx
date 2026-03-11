import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Zap, Crown, Trophy, Target, Clock,
  Medal, Lock, CheckCircle2, Calendar, Star,
  ChevronRight, Sparkles, X, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useCountdown } from '../hooks/useCountdown'
import {
  useSeasonStore,
  selectSeasonXP,
  selectIsPremiumPass,
  selectChallengeProgress,
  selectCurrentWeek,
} from '../stores/seasonStore'
import {
  CURRENT_SEASON,
  WEEKLY_CHALLENGES,
  SEASON_LEADERBOARD,
  PREMIUM_PASS_PRICE,
  DIFFICULTY_CONFIG,
} from '../data/seasonData'
import MindPassTrack from '../components/seasons/BattlePassTrack'
import ChallengeCard from '../components/seasons/ChallengeCard'

// ─── LEVEL BADGE (SVG ring with level number) ──────────────────
function LevelBadge({ level, progress, isPremium }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="xpRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="levelBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPremium ? 'rgba(234,179,8,0.4)' : 'rgba(99,102,241,0.5)'} />
            <stop offset="100%" stopColor={isPremium ? 'rgba(217,119,6,0.4)' : 'rgba(139,92,246,0.5)'} />
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        {/* Progress ring */}
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="url(#xpRingGrad)" strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          className="transition-all duration-700"
        />
        {/* Center filled circle */}
        <circle cx="50" cy="50" r="36" fill="url(#levelBg)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Level number */}
        <text x="50" y="46" textAnchor="middle" fill="white" fontWeight="900" fontSize="22" fontFamily="Inter, system-ui, sans-serif">
          {level}
        </text>
        <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontWeight="600" fontSize="9" fontFamily="Inter, system-ui, sans-serif">
          LEVEL
        </text>
      </svg>
      {/* Premium crown badge */}
      {isPremium && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
          <Crown className="w-3.5 h-3.5 text-black" />
        </div>
      )}
    </div>
  )
}

// ─── HERO BANNER ─────────────────────────────────────────────
function MindPassHero({ onPurchaseClick }) {
  const seasonXP = useSeasonStore(selectSeasonXP)
  const isPremiumPass = useSeasonStore(selectIsPremiumPass)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const getXPInCurrentTier = useSeasonStore((s) => s.getXPInCurrentTier)
  const challengeProgress = useSeasonStore(selectChallengeProgress)
  const countdown = useCountdown(CURRENT_SEASON.endDate)

  const currentTier = getBattlePassTier()
  const tierProgress = getXPInCurrentTier()
  const completedChallenges = Object.values(challengeProgress).filter((c) => c.completed).length
  const totalChallenges = Object.keys(challengeProgress).length

  const daysRemaining = Math.max(0, countdown.days)

  return (
    <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 mb-6">
      {/* Background gradient */}
      <div className={`bg-gradient-to-br ${CURRENT_SEASON.theme.gradient} relative`}>
        {/* Decorative background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-6 right-12 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/3 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        <div className="relative z-10 p-5 sm:p-7">
          {/* Top: Season label */}
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-white/60" />
            <span className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
              Season {CURRENT_SEASON.number}
            </span>
          </div>

          {/* Season name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1">
            {CURRENT_SEASON.name}
          </h1>
          <p className="text-white/50 text-sm mb-5">{CURRENT_SEASON.subtitle}</p>

          {/* Main info row: Level Badge + Stats */}
          <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
            {/* Level Badge */}
            <LevelBadge level={currentTier} progress={tierProgress.percent} isPremium={isPremiumPass} />

            {/* Level info + XP bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white font-bold text-lg">Level {currentTier}</span>
                <span className="text-white/40 text-sm">/ {CURRENT_SEASON.maxTier}</span>
              </div>

              {/* XP Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>{tierProgress.current.toLocaleString('de-DE')} / {tierProgress.needed.toLocaleString('de-DE')} XP</span>
                  <span>{seasonXP.toLocaleString('de-DE')} XP gesamt</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 transition-all duration-700 relative"
                    style={{ width: `${tierProgress.percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs text-white/60 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {daysRemaining} Tage verbleibend
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  {completedChallenges}/{totalChallenges} Aufgaben
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {countdown.hours}h {countdown.minutes}m
                </span>
              </div>
            </div>

            {/* Premium button */}
            <div className="flex-shrink-0">
              {isPremiumPass ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 rounded-xl px-4 py-3">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-bold text-yellow-400">Premium Aktiv</p>
                    <p className="text-[10px] text-yellow-400/60">Alle Belohnungen freigeschaltet</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onPurchaseClick}
                  className="group flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl px-5 py-3 transition-all cursor-pointer shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Crown className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-sm font-black">Premium Mind Pass</p>
                    <p className="text-[11px] font-semibold opacity-70">{PREMIUM_PASS_PRICE} MindCoins</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PURCHASE MODAL ──────────────────────────────────────────
function PurchaseModal({ onClose, onConfirm, userCoins }) {
  const canAfford = userCoins >= PREMIUM_PASS_PRICE
  const navigate = useNavigate()

  const benefits = [
    'Exklusive Premium-Belohnungen auf allen 30 Leveln',
    'Legendaere Kosmetik-Items & Avatar-Ruestungen',
    'Epische Profilrahmen & Partikel-Effekte',
    'Spezielle Profilbanner & Hintergruende',
    'XP-Booster mit bis zu +100% Bonus',
    'Exklusive Titel die nie wieder verfuegbar sind',
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-secondary border border-yellow-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-yellow-500/10">
        {/* Gold header gradient */}
        <div className="bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-transparent p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Premium Mind Pass</h2>
              <p className="text-sm text-yellow-400/70">Season {CURRENT_SEASON.number}: {CURRENT_SEASON.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 space-y-5">
          {/* Benefits list */}
          <div className="space-y-2.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-secondary">{b}</span>
              </div>
            ))}
          </div>

          {/* Price section */}
          <div className="bg-bg-card rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Preis</span>
              <span className="text-lg font-black text-yellow-400">{PREMIUM_PASS_PRICE} MC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Dein Guthaben</span>
              <span className={`text-lg font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                {userCoins.toLocaleString('de-DE')} MC
              </span>
            </div>
            {canAfford && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                <span className="text-sm text-text-muted">Nach dem Kauf</span>
                <span className="text-sm font-semibold text-text-secondary">
                  {(userCoins - PREMIUM_PASS_PRICE).toLocaleString('de-DE')} MC
                </span>
              </div>
            )}
          </div>

          {/* Not enough coins warning */}
          {!canAfford && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400">Nicht genuegend MindCoins</p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  Dir fehlen {(PREMIUM_PASS_PRICE - userCoins).toLocaleString('de-DE')} MindCoins.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-600 text-text-secondary hover:text-text-primary hover:border-gray-500 transition-colors text-sm font-semibold cursor-pointer"
            >
              Abbrechen
            </button>
            {canAfford ? (
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-sm transition-all cursor-pointer shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30"
              >
                Kaufen - {PREMIUM_PASS_PRICE} MC
              </button>
            ) : (
              <button
                onClick={() => { onClose(); navigate('/shop') }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-accent to-orange-500 hover:from-accent/90 hover:to-orange-500/90 text-white font-bold text-sm transition-all cursor-pointer"
              >
                MindCoins kaufen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CHALLENGES TAB ──────────────────────────────────────────
function ChallengesTab() {
  const challengeProgress = useSeasonStore(selectChallengeProgress)
  const currentWeek = useSeasonStore(selectCurrentWeek)
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)

  const weekData = WEEKLY_CHALLENGES.find((w) => w.week === selectedWeek)

  // Next Monday countdown
  const now = new Date()
  const nextMonday = new Date(now)
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7))
  nextMonday.setHours(0, 0, 0, 0)
  const resetCountdown = useCountdown(nextMonday.toISOString())

  const weekCompletionCounts = useMemo(() => {
    const counts = {}
    for (const w of WEEKLY_CHALLENGES) {
      const completed = w.challenges.filter((c) => challengeProgress[c.id]?.completed).length
      counts[w.week] = { completed, total: w.challenges.length }
    }
    return counts
  }, [challengeProgress])

  // Total XP from completed challenges
  const totalChallengeXP = useMemo(() => {
    let xp = 0
    for (const w of WEEKLY_CHALLENGES) {
      for (const c of w.challenges) {
        if (challengeProgress[c.id]?.claimed) xp += c.xpReward
      }
    }
    return xp
  }, [challengeProgress])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Season-Aufgaben
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Schliesse Aufgaben ab, um Season-XP und exklusive Belohnungen zu verdienen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-card border border-gray-700 rounded-lg px-3 py-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">{totalChallengeXP.toLocaleString('de-DE')} XP</span>
            <span className="text-xs text-text-muted">verdient</span>
          </div>
          <div className="flex items-center gap-2 bg-bg-card border border-gray-700 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <div>
              <p className="text-xs font-mono font-semibold text-text-primary">{resetCountdown.formatted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {WEEKLY_CHALLENGES.map((w) => {
          const counts = weekCompletionCounts[w.week] || { completed: 0, total: 5 }
          const isCurrentWeek = w.week === currentWeek
          const isSelected = w.week === selectedWeek
          const allDone = counts.completed === counts.total

          return (
            <button
              key={w.week}
              onClick={() => setSelectedWeek(w.week)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-accent/15 text-accent border-accent/30 shadow-sm shadow-accent/10'
                  : allDone
                    ? 'bg-green-500/5 text-green-400 border-green-500/20 hover:bg-green-500/10'
                    : 'bg-bg-card text-text-secondary border-gray-700 hover:text-text-primary hover:border-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                Woche {w.week}
                {isCurrentWeek && <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />}
                {allDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
              <span className="text-xs opacity-60 block mt-0.5">{counts.completed}/{counts.total}</span>
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
          <p className="text-text-secondary">Aufgaben fuer diese Woche sind noch nicht verfuegbar.</p>
        </div>
      )}
    </div>
  )
}

// ─── RANK BADGE ──────────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/30 to-amber-500/20 flex items-center justify-center ring-2 ring-yellow-500/30">
      <Crown className="w-5 h-5 text-yellow-400" />
    </div>
  )
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-gray-300/10 flex items-center justify-center ring-2 ring-gray-400/20">
      <Medal className="w-5 h-5 text-gray-300" />
    </div>
  )
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full bg-amber-700/15 flex items-center justify-center ring-2 ring-amber-600/20">
      <Medal className="w-5 h-5 text-amber-500" />
    </div>
  )
  return (
    <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
      <span className="text-sm font-bold text-text-muted">{rank}</span>
    </div>
  )
}

// ─── LEADERBOARD TAB ─────────────────────────────────────────
function LeaderboardTab() {
  const { user } = useAuth()
  const seasonXP = useSeasonStore(selectSeasonXP)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const challengeProgress = useSeasonStore(selectChallengeProgress)
  const currentTier = getBattlePassTier()

  const currentUid = user?.uid || 'current-user'
  const currentUsername = user?.username || 'Spieler'

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Season-Rangliste
        </h2>
        <p className="text-sm text-text-secondary mt-0.5">
          Die besten Spieler der aktuellen Season
        </p>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => {
          const rank = index + 1
          const isMe = player.id === currentUid

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all hover:bg-bg-hover/30 ${
                rank === 1 ? 'border-yellow-500/30 bg-yellow-500/5'
                : rank === 2 ? 'border-gray-400/20 bg-gray-400/5'
                : rank === 3 ? 'border-amber-600/20 bg-amber-600/5'
                : isMe ? 'border-accent/30 bg-accent/5 ring-1 ring-accent/20'
                : 'border-gray-700/50'
              }`}
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
                    <Shield className="w-3 h-3" /> Level {player.tier}
                  </span>
                  <span>{player.gamesPlayed} Spiele</span>
                  <span>{player.challengesCompleted} Aufgaben</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-text-primary">{player.seasonXP.toLocaleString('de-DE')}</p>
                <p className="text-xs text-text-muted">XP</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SUB-TAB DEFINITIONS ─────────────────────────────────────
const SUB_TABS = [
  { id: 'mindpass', label: 'Mind-Pass', icon: Shield },
  { id: 'challenges', label: 'Season-Aufgaben', icon: Target },
  { id: 'leaderboard', label: 'Rangliste', icon: Trophy },
]

// ─── MAIN MINDPASS PAGE ──────────────────────────────────────
export default function Seasons() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('mindpass')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const upgradeToPremium = useSeasonStore((s) => s.upgradeToPremium)
  const isPremiumPass = useSeasonStore(selectIsPremiumPass)

  const handlePurchaseClick = () => {
    if (!user) {
      showToast('Bitte melde dich an, um den Premium Mind Pass zu kaufen.', 'warning')
      return
    }
    if (isPremiumPass) return
    setShowPurchaseModal(true)
  }

  const handleConfirmPurchase = async () => {
    if (!user) return
    const balance = user.mindCoins || 0
    if (balance < PREMIUM_PASS_PRICE) {
      showToast('Nicht genuegend MindCoins!', 'error')
      setShowPurchaseModal(false)
      return
    }

    // Deduct MindCoins
    await updateUser({ mindCoins: balance - PREMIUM_PASS_PRICE })
    // Activate premium pass
    upgradeToPremium()

    setShowPurchaseModal(false)
    showToast('Premium Mind Pass aktiviert! Alle Premium-Belohnungen sind jetzt freigeschaltet.', 'success')
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <>
        <title>{`Mind Pass - Season ${CURRENT_SEASON.number} | MindForge`}</title>
        <meta name="description" content={`Mind Pass Season ${CURRENT_SEASON.number} "${CURRENT_SEASON.name}" - ${CURRENT_SEASON.description}`} />
      </>

      {/* Hero Banner */}
      <MindPassHero onPurchaseClick={handlePurchaseClick} />

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto hide-scrollbar">
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'mindpass' && <MindPassTrack onPurchaseClick={handlePurchaseClick} />}
      {activeTab === 'challenges' && <ChallengesTab />}
      {activeTab === 'leaderboard' && <LeaderboardTab />}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={handleConfirmPurchase}
          userCoins={user?.mindCoins || 0}
        />
      )}
    </div>
  )
}
