import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Zap, Crown, Target, Clock, Star,
  Lock, CheckCircle2, Calendar, X, AlertCircle,
  Sparkles, CreditCard,
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
  PREMIUM_PASS_PRICE,
  PREMIUM_SUBSCRIPTION,
  DIFFICULTY_CONFIG,
} from '../data/seasonData'
import MindPassTrack from '../components/seasons/BattlePassTrack'
import ChallengeCard from '../components/seasons/ChallengeCard'

// ─── SUB-TAB DEFINITIONS (no Rangliste) ─────────────────────
const SUB_TABS = [
  { id: 'mindpass', label: 'Mind Pass', icon: Shield },
  { id: 'challenges', label: 'Season-Aufgaben', icon: Target },
]

// ─── PURCHASE MODAL (with Premium Abo) ──────────────────────
function PurchaseModal({ onClose, onConfirmPass, userCoins }) {
  const canAfford = userCoins >= PREMIUM_PASS_PRICE
  const navigate = useNavigate()

  const passBenefits = [
    'Premium-Belohnungen auf allen 30 Leveln',
    'Legendaere Kosmetik-Items & Ruestungen',
    'Epische Profilrahmen & Partikel-Effekte',
    'Seltene XP-Booster (bis zu +100%)',
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #111833 0%, #0a0e27 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">Premium freischalten</h2>
              <p className="text-xs text-white/40">Season {CURRENT_SEASON.number}: {CURRENT_SEASON.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Two pricing options */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Premium Mind Pass (one-time) */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-black text-white uppercase">Premium Mind Pass</h3>
            </div>
            <p className="text-xs text-white/40 mb-4">Einmalige Zahlung fuer diese Season</p>
            <p className="text-3xl font-black text-yellow-400 mb-4">
              {PREMIUM_PASS_PRICE} <span className="text-sm text-yellow-400/60">MC</span>
            </p>
            <ul className="space-y-2 mb-5 flex-1">
              {passBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <Sparkles className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-xs text-white/30 mb-3">
              <span>Dein Guthaben</span>
              <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                {userCoins.toLocaleString('de-DE')} MC
              </span>
            </div>
            {canAfford ? (
              <button
                onClick={onConfirmPass}
                data-testid="buy-pass-btn"
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-lg transition-all text-sm uppercase cursor-pointer"
              >
                Kaufen – {PREMIUM_PASS_PRICE} MC
              </button>
            ) : (
              <button
                onClick={() => { onClose(); navigate('/shop') }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition-all text-sm cursor-pointer"
              >
                MindCoins kaufen
              </button>
            )}
          </div>

          {/* Option 2: Premium Abo (subscription) */}
          <div className="relative bg-gradient-to-b from-yellow-500/10 to-amber-600/5 rounded-xl p-5 border border-yellow-500/30 flex flex-col">
            {/* Recommended badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              Empfohlen
            </div>
            <div className="flex items-center gap-2 mb-3 mt-1">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-black text-white uppercase">{PREMIUM_SUBSCRIPTION.name}</h3>
            </div>
            <p className="text-xs text-white/40 mb-4">Monatliches Abo mit allen Vorteilen</p>
            <p className="text-3xl font-black text-yellow-400 mb-1">
              {PREMIUM_SUBSCRIPTION.price.toFixed(2).replace('.', ',')}€
              <span className="text-sm text-yellow-400/60 font-bold"> /Monat</span>
            </p>
            <p className="text-[10px] text-white/30 mb-4">Jederzeit kuendbar</p>
            <ul className="space-y-2 mb-5 flex-1">
              {PREMIUM_SUBSCRIPTION.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <Star className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" />
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => { onClose(); navigate('/premium') }}
              data-testid="subscribe-btn"
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black rounded-lg transition-all text-sm uppercase cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Abonnieren
            </button>
          </div>
        </div>

        {/* Not enough coins warning */}
        {!canAfford && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400/80">
                Dir fehlen {(PREMIUM_PASS_PRICE - userCoins).toLocaleString('de-DE')} MindCoins fuer den Premium Pass.
              </p>
            </div>
          </div>
        )}
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Season-Aufgaben
          </h2>
          <p className="text-sm text-white/40 mt-0.5">
            Schliesse Aufgaben ab um Season-XP zu verdienen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">{totalChallengeXP.toLocaleString('de-DE')} XP</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5 text-white/40" />
            <p className="text-xs font-mono font-semibold text-white/70">{resetCountdown.formatted}</p>
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
                  ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                  : allDone
                    ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/15'
                    : 'bg-white/5 text-white/50 border-white/10 hover:text-white/70 hover:border-white/20'
              }`}
            >
              <span className="flex items-center gap-2">
                Woche {w.week}
                {isCurrentWeek && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
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
        <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
          <Lock className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Aufgaben fuer diese Woche sind noch nicht verfuegbar.</p>
        </div>
      )}
    </div>
  )
}

// ─── MAIN MINDPASS PAGE (Full-bleed Fortnite layout) ────────
export default function Seasons() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('mindpass')
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const upgradeToPremium = useSeasonStore((s) => s.upgradeToPremium)
  const isPremiumPass = useSeasonStore(selectIsPremiumPass)
  const seasonXP = useSeasonStore(selectSeasonXP)
  const getBattlePassTier = useSeasonStore((s) => s.getBattlePassTier)
  const getXPInCurrentTier = useSeasonStore((s) => s.getXPInCurrentTier)
  const countdown = useCountdown(CURRENT_SEASON.endDate)

  const currentTier = getBattlePassTier()
  const tierProgress = getXPInCurrentTier()
  const daysRemaining = Math.max(0, countdown.days)

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
    await updateUser({ mindCoins: balance - PREMIUM_PASS_PRICE })
    upgradeToPremium()
    setShowPurchaseModal(false)
    showToast('Premium Mind Pass aktiviert! Alle Premium-Belohnungen sind jetzt freigeschaltet.', 'success')
  }

  return (
    <div
      className="relative -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 -mb-24 md:-mb-6 min-h-[calc(100vh-4rem)] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080c20 0%, #0c1535 40%, #150d30 100%)' }}
      data-testid="mind-pass-page"
    >
      <>
        <title>{`Mind Pass – Season ${CURRENT_SEASON.number} | MindForge`}</title>
        <meta name="description" content={`Mind Pass Season ${CURRENT_SEASON.number} "${CURRENT_SEASON.name}"`} />
      </>

      {/* Background decorative effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.04] blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[80px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ═══════ HEADER BAR ═══════ */}
      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-white/5">
          {/* Left: Title + Season */}
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white/60" />
              <h1 className="text-base sm:text-lg lg:text-xl font-black text-white uppercase tracking-wider" data-testid="mind-pass-title">
                Mind Pass
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-white/30">
              <span className="text-xs font-bold uppercase tracking-wider">Season {CURRENT_SEASON.number}</span>
              <span className="text-white/20">|</span>
              <span className="text-xs font-semibold">{CURRENT_SEASON.name}</span>
            </div>
          </div>

          {/* Right: Stats + Premium */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level + XP bar */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                <span className="text-sm font-bold text-white">{currentTier}</span>
              </div>
              <div className="w-20 lg:w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                  style={{ width: `${tierProgress.percent}%` }}
                />
              </div>
              <span className="text-[11px] text-white/40 font-semibold">{seasonXP.toLocaleString('de-DE')} XP</span>
            </div>

            {/* Days remaining */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-white/30 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{daysRemaining}d</span>
            </div>

            {/* Premium button */}
            {isPremiumPass ? (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 hidden sm:inline">Premium</span>
              </div>
            ) : (
              <button
                onClick={handlePurchaseClick}
                data-testid="premium-btn"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black rounded-lg px-3 sm:px-4 py-2 text-xs uppercase tracking-wide transition-all cursor-pointer shadow-lg shadow-yellow-500/15"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Premium</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══════ TAB BAR ═══════ */}
        <div className="flex gap-1 px-4 sm:px-6 lg:px-8 border-b border-white/5">
          {SUB_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* ═══════ TAB CONTENT ═══════ */}
        {activeTab === 'mindpass' && <MindPassTrack onPurchaseClick={handlePurchaseClick} />}
        {activeTab === 'challenges' && <ChallengesTab />}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onConfirmPass={handleConfirmPurchase}
          userCoins={user?.mindCoins || 0}
        />
      )}
    </div>
  )
}
