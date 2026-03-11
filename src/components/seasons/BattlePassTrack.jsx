import { useRef, useEffect, useState } from 'react'
import {
  Lock, CheckCircle2, Gift, Zap, Award, Tag, Image,
  Sparkles, ShieldCheck, Shield, Crown, Gem, Star, Frame,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { BATTLE_PASS_TIERS, RARITY_CONFIG, CURRENT_SEASON } from '../../data/seasonData'
import { useSeasonStore, selectSeasonXP, selectIsPremiumPass } from '../../stores/seasonStore'

// ─── Icon mapping ───────────────────────────────────────────
const ICON_MAP = {
  zap: Zap, award: Award, tag: Tag, image: Image,
  sparkles: Sparkles, shield: ShieldCheck, crown: Crown,
  gem: Gem, star: Star, frame: Frame, book: Award,
  glasses: Sparkles, headphones: Sparkles, wand: Star,
  feather: Sparkles, flame: Zap, target: Star,
  'trending-up': Zap, clock: Star,
}

function getRewardIcon(iconName) {
  return ICON_MAP[iconName] || Gift
}

// ─── Rarity visual config ──────────────────────────────────
const RARITY_STYLES = {
  common: {
    border: 'border-gray-500/25',
    bg: 'bg-gradient-to-b from-gray-700/30 via-gray-800/40 to-gray-900/50',
    glow: '',
    iconBg: 'bg-gray-600/20',
    accent: 'gray',
  },
  uncommon: {
    border: 'border-green-400/35',
    bg: 'bg-gradient-to-b from-green-800/20 via-green-900/30 to-gray-900/50',
    glow: 'shadow-green-500/10',
    iconBg: 'bg-green-500/15',
    accent: 'green',
  },
  rare: {
    border: 'border-blue-400/35',
    bg: 'bg-gradient-to-b from-blue-800/20 via-blue-900/30 to-gray-900/50',
    glow: 'shadow-blue-500/15',
    iconBg: 'bg-blue-500/15',
    accent: 'blue',
  },
  epic: {
    border: 'border-purple-400/40',
    bg: 'bg-gradient-to-b from-purple-800/20 via-purple-900/30 to-gray-900/50',
    glow: 'shadow-purple-500/20',
    iconBg: 'bg-purple-500/15',
    accent: 'purple',
  },
  legendary: {
    border: 'border-amber-400/50',
    bg: 'bg-gradient-to-b from-amber-800/20 via-amber-900/30 to-gray-900/50',
    glow: 'shadow-amber-500/25',
    iconBg: 'bg-amber-500/20',
    accent: 'amber',
  },
}

// ─── Bottom rarity color stripe ────────────────────────────
const RARITY_STRIPE = {
  common: 'from-gray-500/20 to-gray-600/10',
  uncommon: 'from-green-400/30 to-green-500/15',
  rare: 'from-blue-400/30 to-blue-500/15',
  epic: 'from-purple-400/35 to-purple-500/15',
  legendary: 'from-amber-400/40 to-amber-500/20',
}

// ─── REWARD CARD ───────────────────────────────────────────
function RewardCard({ reward, tier, track, currentTier, isPremium, isClaimed }) {
  const claimReward = useSeasonStore((s) => s.claimReward)

  // Empty slot
  if (!reward) {
    return (
      <div className="w-full h-full rounded-lg border border-dashed border-gray-700/20 flex items-center justify-center bg-gray-900/15">
        <span className="text-[8px] text-gray-700 select-none">—</span>
      </div>
    )
  }

  const isLocked = tier > currentTier
  const isPremiumLocked = track === 'premium' && !isPremium
  const canClaim = !isLocked && !isPremiumLocked && !isClaimed
  const rarity = RARITY_CONFIG[reward.rarity] || RARITY_CONFIG.common
  const style = RARITY_STYLES[reward.rarity] || RARITY_STYLES.common
  const stripe = RARITY_STRIPE[reward.rarity] || RARITY_STRIPE.common
  const IconComponent = getRewardIcon(reward.icon)

  function handleClaim(e) {
    e.stopPropagation()
    if (canClaim) claimReward(tier, track)
  }

  return (
    <div
      className={`relative w-full h-full rounded-lg border-2 overflow-hidden transition-all duration-300 group ${
        isClaimed
          ? 'border-green-500/40 shadow-md shadow-green-500/10'
          : canClaim
            ? `${style.border} shadow-lg ${style.glow} hover:scale-[1.05] hover:brightness-110`
            : isLocked || isPremiumLocked
              ? 'border-gray-800/30 opacity-30'
              : `${style.border} shadow-md ${style.glow}`
      }`}
    >
      {/* Card background */}
      <div className={`absolute inset-0 ${
        isClaimed ? 'bg-gradient-to-b from-green-900/25 via-green-950/35 to-gray-900/60'
        : isLocked || isPremiumLocked ? 'bg-gray-900/80'
        : style.bg
      }`} />

      {/* Rarity bottom stripe */}
      {!isLocked && !isPremiumLocked && (
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stripe}`} />
      )}

      {/* Pulse for claimable */}
      {canClaim && (
        <div className="absolute inset-0 rounded-lg border border-white/8 animate-pulse" />
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full p-1.5 gap-1 z-10">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
          isClaimed ? 'bg-green-500/20' : isLocked || isPremiumLocked ? 'bg-gray-800/60' : style.iconBg
        }`}>
          {isClaimed ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-green-400" />
          ) : isLocked || isPremiumLocked ? (
            <Lock className="w-3 h-3 text-gray-600" />
          ) : (
            <IconComponent className={`w-4.5 h-4.5 ${rarity.color} drop-shadow-sm`} />
          )}
        </div>

        {/* Reward name */}
        <p className={`text-[8px] leading-tight text-center font-bold line-clamp-2 px-0.5 ${
          isClaimed ? 'text-green-400/80' : isLocked || isPremiumLocked ? 'text-gray-600' : 'text-white/85'
        }`}>
          {reward.name}
        </p>
      </div>

      {/* Hover claim overlay */}
      {canClaim && (
        <button
          onClick={handleClaim}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-all cursor-pointer rounded-lg"
          title={`${reward.name} einsammeln`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-all text-[9px] font-black text-white bg-accent/90 px-2 py-1 rounded-md shadow-xl border border-accent/40">
            Claim
          </span>
        </button>
      )}

      {/* Premium lock crown */}
      {isPremiumLocked && !isLocked && (
        <div className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-bl-md rounded-tr-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md z-10">
          <Crown className="w-2.5 h-2.5 text-black" />
        </div>
      )}
    </div>
  )
}

// ─── Constants ──────────────────────────────────────────────
const TIER_W = 116 // pixel width per tier column
const CARD_H = 88  // card height in pixels
const BAR_ROW_H = 40 // progress bar row height

// ─── MAIN BATTLE PASS TRACK ────────────────────────────────
export default function MindPassTrack({ onPurchaseClick }) {
  const seasonXP = useSeasonStore(selectSeasonXP)
  const isPremiumPass = useSeasonStore(selectIsPremiumPass)
  const isRewardClaimed = useSeasonStore((s) => s.isRewardClaimed)
  const currentTier = useSeasonStore((s) => s.getBattlePassTier)()

  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const TOTAL_W = BATTLE_PASS_TIERS.length * TIER_W

  // Progress bar geometry
  const currentTierIndex = BATTLE_PASS_TIERS.findIndex(t => t.tier === currentTier)
  const barStart = TIER_W / 2
  const barTotalW = (BATTLE_PASS_TIERS.length - 1) * TIER_W
  const filledW = currentTierIndex >= 0 ? currentTierIndex * TIER_W : 0

  // Scroll to current tier on mount
  useEffect(() => {
    if (!scrollRef.current) return
    const tierIdx = Math.max(0, currentTier - 1)
    const target = tierIdx * TIER_W - scrollRef.current.clientWidth / 2 + TIER_W / 2
    scrollRef.current.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [currentTier])

  function updateArrows() {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    updateArrows()
    return () => el.removeEventListener('scroll', updateArrows)
  }, [])

  function scroll(direction) {
    scrollRef.current?.scrollBy({ left: direction * 460, behavior: 'smooth' })
  }

  return (
    <div className="space-y-3">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Mind Pass
          </h2>
          <div className="flex items-center gap-2 bg-bg-card/60 rounded-lg px-3 py-1.5 border border-gray-700/50">
            <span className="text-sm text-text-muted">Lvl</span>
            <span className="text-sm font-bold text-text-primary">{currentTier}</span>
            <span className="text-xs text-text-muted">/ {CURRENT_SEASON.maxTier}</span>
          </div>
          <span className="text-sm text-accent font-semibold">
            {seasonXP.toLocaleString('de-DE')} XP
          </span>
        </div>
        {!isPremiumPass && (
          <button
            onClick={onPurchaseClick}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-lg px-4 py-2 text-sm transition-all cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            <Crown className="w-4 h-4" />
            Premium freischalten
          </button>
        )}
      </div>

      {/* ── TRACK CONTAINER ── */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-700/40">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-gray-900/90 to-slate-950/70" />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />

        <div className="flex relative z-10">
          {/* ── Fixed Left Labels ── */}
          <div className="flex-shrink-0 w-11 sm:w-14 border-r border-gray-700/30 bg-gray-950/50 z-10 select-none">
            {/* Free label */}
            <div className="flex items-center justify-center" style={{ height: CARD_H + 12 }}>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-white/20 uppercase tracking-[0.15em] [writing-mode:vertical-lr] rotate-180">
                Free
              </span>
            </div>
            {/* Progress bar spacer */}
            <div className="flex items-center justify-center border-y border-gray-700/20" style={{ height: BAR_ROW_H }} />
            {/* Premium label */}
            <div
              className="flex items-center justify-center bg-gradient-to-b from-amber-500/[0.10] via-amber-600/[0.12] to-amber-700/[0.06] border-t border-amber-500/15"
              style={{ height: CARD_H + 12 }}
            >
              <div className="flex items-center gap-1.5 [writing-mode:vertical-lr] rotate-180">
                <Crown className="w-2.5 h-2.5 text-yellow-500/60 rotate-90" />
                <span className="text-[8px] sm:text-[9px] font-extrabold text-yellow-400/40 uppercase tracking-[0.15em]">
                  Premium
                </span>
              </div>
            </div>
          </div>

          {/* ── Scrollable Track ── */}
          <div className="flex-1 relative overflow-hidden">
            {/* Left scroll arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scroll(-1)}
                className="absolute left-0 top-0 bottom-0 z-20 w-9 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center justify-center cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/25 flex items-center justify-center transition-all border border-white/10 group-hover:border-white/30 backdrop-blur-sm">
                  <ChevronLeft className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
                </div>
              </button>
            )}
            {/* Right scroll arrow */}
            {showRightArrow && (
              <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-0 bottom-0 z-20 w-9 bg-gradient-to-l from-black/80 via-black/50 to-transparent flex items-center justify-center cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/25 flex items-center justify-center transition-all border border-white/10 group-hover:border-white/30 backdrop-blur-sm">
                  <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
                </div>
              </button>
            )}

            <div ref={scrollRef} className="overflow-x-auto hide-scrollbar">
              <div style={{ width: TOTAL_W }} className="flex flex-col">

                {/* ═══════ FREE REWARD ROW ═══════ */}
                <div className="flex pt-2.5 pb-1">
                  {BATTLE_PASS_TIERS.map(tierData => (
                    <div key={tierData.tier} className="flex-shrink-0 px-[3px]" style={{ width: TIER_W }}>
                      <div style={{ height: CARD_H }}>
                        <RewardCard
                          reward={tierData.free}
                          tier={tierData.tier}
                          track="free"
                          currentTier={currentTier}
                          isPremium={true}
                          isClaimed={isRewardClaimed(tierData.tier, 'free')}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ═══════ CONTINUOUS PROGRESS BAR ═══════ */}
                <div className="relative flex items-center" style={{ height: BAR_ROW_H }}>
                  {/* Background track line (full span between first and last tier centers) */}
                  <div
                    className="absolute h-[3px] rounded-full bg-gray-700/40"
                    style={{ left: barStart, width: barTotalW }}
                  />
                  {/* Filled progress line */}
                  {filledW > 0 && (
                    <div
                      className="absolute h-[3px] rounded-full transition-all duration-700"
                      style={{
                        left: barStart,
                        width: filledW,
                        background: 'linear-gradient(90deg, #6366f1, #f97316, #eab308)',
                      }}
                    />
                  )}

                  {/* Tier number circles */}
                  <div className="flex w-full relative z-10">
                    {BATTLE_PASS_TIERS.map(tierData => {
                      const isCurrent = tierData.tier === currentTier
                      const isReached = tierData.tier <= currentTier
                      const milestone = tierData.tier % 5 === 0 || tierData.tier === 1 || tierData.tier === CURRENT_SEASON.maxTier

                      return (
                        <div key={tierData.tier} className="flex-shrink-0 flex items-center justify-center" style={{ width: TIER_W }}>
                          <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                            isCurrent
                              ? 'w-8 h-8 bg-gradient-to-br from-accent via-orange-500 to-amber-500 shadow-lg shadow-accent/50 ring-2 ring-white/25'
                              : milestone && isReached
                                ? 'w-[26px] h-[26px] bg-accent/20 ring-[1.5px] ring-accent/35'
                                : isReached
                                  ? 'w-[22px] h-[22px] bg-accent/15 ring-1 ring-accent/25'
                                  : milestone
                                    ? 'w-[26px] h-[26px] bg-gray-800 ring-[1.5px] ring-gray-600/40'
                                    : 'w-[22px] h-[22px] bg-gray-800 ring-1 ring-gray-700/30'
                          }`}>
                            {isCurrent && (
                              <div className="absolute inset-0 rounded-full bg-white/15 animate-pulse" />
                            )}
                            <span className={`relative font-black select-none ${
                              isCurrent
                                ? 'text-white text-[11px]'
                                : milestone && isReached
                                  ? 'text-accent text-[10px]'
                                  : isReached
                                    ? 'text-accent/80 text-[9px]'
                                    : milestone
                                      ? 'text-gray-400 text-[10px]'
                                      : 'text-gray-500 text-[9px]'
                            }`}>
                              {tierData.tier}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ═══════ PREMIUM REWARD ROW ═══════ */}
                <div className="flex relative pt-1 pb-2.5">
                  {/* Premium golden background - more visible */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.07] via-amber-600/[0.10] to-amber-800/[0.05]" />
                  {/* Golden top border line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/10 via-amber-400/30 to-amber-500/10" />
                  {/* Subtle left gold accent */}
                  <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400/25 via-amber-500/15 to-transparent" />

                  {BATTLE_PASS_TIERS.map(tierData => (
                    <div key={tierData.tier} className="flex-shrink-0 px-[3px] relative z-10" style={{ width: TIER_W }}>
                      <div style={{ height: CARD_H }}>
                        <RewardCard
                          reward={tierData.premium}
                          tier={tierData.tier}
                          track="premium"
                          currentTier={currentTier}
                          isPremium={isPremiumPass}
                          isClaimed={isRewardClaimed(tierData.tier, 'premium')}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Info Bar ── */}
      <div className="flex items-center justify-between bg-bg-card/50 rounded-xl p-3.5 border border-gray-800 flex-wrap gap-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-muted">Naechstes Level:</span>
          {currentTier < CURRENT_SEASON.maxTier ? (
            <>
              <span className="text-text-primary font-semibold">Level {currentTier + 1}</span>
              <span className="text-text-muted text-xs">
                ({((currentTier + 1) * CURRENT_SEASON.xpPerTier).toLocaleString('de-DE')} XP)
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Star className="w-4 h-4" />
              Max Level erreicht!
            </span>
          )}
        </div>
        <div className="text-xs text-text-muted">
          {BATTLE_PASS_TIERS.filter(t => t.tier <= currentTier && t.free).length +
            BATTLE_PASS_TIERS.filter(t => t.tier <= currentTier && t.premium && isPremiumPass).length} Belohnungen verfuegbar
        </div>
      </div>
    </div>
  )
}
