import { useState, useMemo } from 'react'
import {
  Lock, CheckCircle2, Gift, Zap, Award, Tag, Image,
  Sparkles, ShieldCheck, Crown, Gem, Star, Frame,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { BATTLE_PASS_TIERS, CURRENT_SEASON } from '../../data/seasonData'
import { useSeasonStore, selectIsPremiumPass } from '../../stores/seasonStore'

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

// ─── Fortnite-style rarity visuals ──────────────────────────
const RARITY_VISUAL = {
  common: {
    cardBg: 'from-gray-400 via-gray-500 to-gray-700',
    label: 'GEWOEHNLICH',
    labelBg: 'bg-gray-500',
    iconColor: 'text-gray-100',
    glowHex: '#9ca3af',
  },
  uncommon: {
    cardBg: 'from-green-400 via-green-500 to-green-800',
    label: 'UNGEWOEHNLICH',
    labelBg: 'bg-green-600',
    iconColor: 'text-green-50',
    glowHex: '#22c55e',
  },
  rare: {
    cardBg: 'from-sky-400 via-blue-500 to-blue-800',
    label: 'SELTEN',
    labelBg: 'bg-blue-500',
    iconColor: 'text-blue-50',
    glowHex: '#3b82f6',
  },
  epic: {
    cardBg: 'from-fuchsia-400 via-purple-500 to-purple-900',
    label: 'EPISCH',
    labelBg: 'bg-purple-600',
    iconColor: 'text-purple-50',
    glowHex: '#a855f7',
  },
  legendary: {
    cardBg: 'from-amber-300 via-orange-500 to-amber-800',
    label: 'LEGENDAER',
    labelBg: 'bg-amber-600',
    iconColor: 'text-amber-50',
    glowHex: '#f59e0b',
  },
}

// ─── Constants ──────────────────────────────────────────────
const LEVELS_PER_PAGE = 6
const TOTAL_PAGES = Math.ceil(BATTLE_PASS_TIERS.length / LEVELS_PER_PAGE)

// ─── Reward Card (Fortnite style) ───────────────────────────
function RewardCard({ reward, isSelected, onClick, currentTier, isPremium, isClaimed }) {
  const rarity = reward.rarity || 'common'
  const vis = RARITY_VISUAL[rarity] || RARITY_VISUAL.common
  const IconComponent = getRewardIcon(reward.icon)
  const isLocked = reward.tier > currentTier
  const isPremiumLocked = reward.track === 'premium' && !isPremium

  return (
    <button
      onClick={onClick}
      data-testid={`reward-card-${reward.tier}-${reward.track}`}
      className={`relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-[3px]
        w-[100px] h-[140px] sm:w-[115px] sm:h-[158px] md:w-[130px] md:h-[178px] lg:w-[148px] lg:h-[198px] xl:w-[158px] xl:h-[210px]
        ${isSelected
          ? 'border-white scale-[1.08] shadow-2xl z-10'
          : 'border-white/10 hover:scale-[1.04] hover:border-white/40'
        } ${(isLocked || isPremiumLocked) && !isClaimed ? 'brightness-[0.4] saturate-50' : ''
      }`}
    >
      {/* Full rarity gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isClaimed ? 'from-green-400 via-green-600 to-green-900' : vis.cardBg
      }`} />

      {/* Diagonal shine effect */}
      {!isLocked && !isPremiumLocked && !isClaimed && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />
      )}

      {/* Selected inner glow */}
      {isSelected && (
        <div className="absolute inset-[3px] rounded-lg border-2 border-white/40 z-10" />
      )}

      {/* Lock badge */}
      {isPremiumLocked && !isLocked && !isClaimed && (
        <div className="absolute top-2 right-2 z-20 w-7 h-7 rounded bg-red-500 flex items-center justify-center shadow-lg">
          <Lock className="w-4 h-4 text-white" />
        </div>
      )}
      {isLocked && !isClaimed && (
        <div className="absolute top-2 right-2 z-20 w-7 h-7 rounded bg-black/70 flex items-center justify-center">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Claimed badge */}
      {isClaimed && (
        <div className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
      )}

      {/* FREE tag */}
      {reward.track === 'free' && !isClaimed && (
        <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-white/30 backdrop-blur-sm text-[10px] font-extrabold text-white uppercase tracking-wider shadow">
          Free
        </div>
      )}

      {/* Premium crown */}
      {reward.track === 'premium' && !isPremiumLocked && !isLocked && !isClaimed && (
        <div className="absolute top-2 left-2 z-20">
          <Crown className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-2 gap-2">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 ${
            isClaimed ? 'text-white/80' : vis.iconColor
          } drop-shadow-lg`} />
        </div>
        <p className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-bold text-white text-center leading-tight line-clamp-2 px-1 drop-shadow-md">
          {reward.name}
        </p>
      </div>
    </button>
  )
}

// ─── MAIN BATTLE PASS TRACK (Fortnite Layout) ──────────────
export default function MindPassTrack({ onPurchaseClick }) {
  const isPremiumPass = useSeasonStore(selectIsPremiumPass)
  const isRewardClaimed = useSeasonStore((s) => s.isRewardClaimed)
  const claimReward = useSeasonStore((s) => s.claimReward)
  const currentTier = useSeasonStore((s) => s.getBattlePassTier)()

  const [currentPage, setCurrentPage] = useState(() =>
    Math.min(TOTAL_PAGES - 1, Math.max(0, Math.floor((currentTier - 1) / LEVELS_PER_PAGE)))
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Build rewards for current page: first=free, middle=premium, last=free
  const pageRewards = useMemo(() => {
    const startTier = currentPage * LEVELS_PER_PAGE + 1
    const endTier = startTier + LEVELS_PER_PAGE - 1
    const tiers = BATTLE_PASS_TIERS.filter(t => t.tier >= startTier && t.tier <= endTier)
    const rewards = []

    // Position 1: free reward from first tier
    const firstTier = tiers[0]
    if (firstTier?.free) rewards.push({ ...firstTier.free, tier: firstTier.tier, track: 'free' })

    // Positions 2-5: premium rewards from all tiers that have them
    for (const t of tiers) {
      if (t.premium) rewards.push({ ...t.premium, tier: t.tier, track: 'premium' })
    }

    // Position 6: free reward from last tier
    const lastTier = tiers[tiers.length - 1]
    if (lastTier?.free) rewards.push({ ...lastTier.free, tier: lastTier.tier, track: 'free' })

    return rewards
  }, [currentPage])

  // Page tier range
  const startTier = currentPage * LEVELS_PER_PAGE + 1
  const endTier = Math.min(startTier + LEVELS_PER_PAGE - 1, CURRENT_SEASON.maxTier)

  // Level track progress for this page
  const trackProgress = useMemo(() => {
    if (currentTier < startTier) return 0
    if (currentTier >= endTier) return 100
    return ((currentTier - startTier) / (endTier - startTier)) * 100
  }, [currentTier, startTier, endTier])

  const safeIndex = selectedIndex >= pageRewards.length ? 0 : selectedIndex
  const featured = pageRewards[safeIndex]
  const featuredVis = featured ? (RARITY_VISUAL[featured.rarity] || RARITY_VISUAL.common) : RARITY_VISUAL.common
  const FeaturedIcon = featured ? getRewardIcon(featured.icon) : Gift
  const fIsLocked = featured ? featured.tier > currentTier : true
  const fIsPremiumLocked = featured ? featured.track === 'premium' && !isPremiumPass : false
  const fIsClaimed = featured ? isRewardClaimed(featured.tier, featured.track) : false
  const fCanClaim = featured && !fIsLocked && !fIsPremiumLocked && !fIsClaimed

  const handlePageChange = (delta) => {
    setCurrentPage(p => Math.max(0, Math.min(TOTAL_PAGES - 1, p + delta)))
    setSelectedIndex(0)
  }

  const handleClaim = () => {
    if (featured && fCanClaim) claimReward(featured.tier, featured.track)
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 10rem)' }}>

      {/* ═══════ FEATURED ITEM DISPLAY ═══════ */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-4 lg:py-8 relative">
        {/* Rarity-colored background aura */}
        {featured && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at center, ${featuredVis.glowHex}22 0%, ${featuredVis.glowHex}08 40%, transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between w-full max-w-7xl gap-6 lg:gap-10">

          {/* ── Left: Item Info ── */}
          {featured && (
            <div className="flex-shrink-0 text-center lg:text-left max-w-[320px] lg:max-w-[340px] order-2 lg:order-1">
              <div className={`inline-block px-3 py-1 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider text-white mb-3 ${featuredVis.labelBg}`}>
                {featuredVis.label}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white uppercase tracking-tight leading-[0.95] mb-3">
                {featured.name}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/50 leading-relaxed mb-4">
                {featured.description}
              </p>
              {featured.track === 'premium' && (
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm lg:text-base text-yellow-400/80 font-semibold">Premium Belohnung</span>
                </div>
              )}
              {featured.track === 'free' && (
                <span className="text-sm lg:text-base text-white/40 font-semibold">Kostenlose Belohnung</span>
              )}
            </div>
          )}

          {/* ── Center: Large Icon Showcase ── */}
          {featured && (
            <div className="flex-1 flex items-center justify-center order-1 lg:order-2 min-h-[180px] lg:min-h-[260px]">
              <div className="relative">
                {/* Outer glow ring */}
                <div
                  className="absolute rounded-full blur-[60px] lg:blur-[80px] opacity-50"
                  style={{
                    background: `radial-gradient(${featuredVis.glowHex}, transparent)`,
                    inset: '-50%',
                  }}
                />
                {/* Secondary glow */}
                <div
                  className="absolute rounded-full blur-[40px] opacity-25"
                  style={{
                    background: featuredVis.glowHex,
                    inset: '-20%',
                  }}
                />
                {/* Icon container */}
                <div className={`relative w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl border-2 ${
                  fIsClaimed
                    ? 'bg-green-500/15 border-green-400/30'
                    : 'bg-white/[0.06] border-white/10'
                } backdrop-blur-sm`}>
                  <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-b ${
                    fIsClaimed ? 'from-green-400/10 to-transparent' : 'from-white/5 to-transparent'
                  }`} />
                  {fIsLocked || fIsPremiumLocked ? (
                    <Lock className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 text-gray-500/80 drop-shadow-lg" />
                  ) : (
                    <FeaturedIcon className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 ${
                      fIsClaimed ? 'text-green-300/90' : featuredVis.iconColor
                    } drop-shadow-xl`} />
                  )}
                  {fIsClaimed && (
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-500 border-4 border-[#0c1535] flex items-center justify-center shadow-xl">
                      <CheckCircle2 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Right: Actions ── */}
          {featured && (
            <div className="flex-shrink-0 flex flex-col gap-3 w-full sm:w-auto sm:min-w-[220px] lg:min-w-[260px] xl:min-w-[280px] order-3">
              {/* Cost/Tier display */}
              <div className="bg-black/50 border border-white/15 rounded-xl px-5 py-3 flex items-center justify-between">
                <span className="text-xs lg:text-sm text-white/50 font-bold uppercase tracking-wide">Stufe</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl lg:text-2xl font-black text-white">{featured.tier}</span>
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" fill="currentColor" />
                </div>
              </div>

              {/* Claim button */}
              {fCanClaim ? (
                <button
                  onClick={handleClaim}
                  data-testid="claim-reward-btn"
                  className="w-full py-3.5 lg:py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition-all uppercase tracking-wide text-sm lg:text-base cursor-pointer shadow-lg shadow-yellow-500/30 hover:shadow-yellow-400/50 active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center text-xs font-black">A</span>
                  EINLOESEN
                </button>
              ) : fIsClaimed ? (
                <div className="w-full py-3.5 lg:py-4 bg-green-500/20 border-2 border-green-500/40 text-green-400 font-black rounded-xl text-center uppercase tracking-wide text-sm lg:text-base">
                  ✓ Eingeloest
                </div>
              ) : fIsPremiumLocked ? (
                <button
                  onClick={onPurchaseClick}
                  className="w-full py-3.5 lg:py-4 bg-yellow-500/20 border-2 border-yellow-500/40 text-yellow-400 font-black rounded-xl uppercase tracking-wide text-sm lg:text-base cursor-pointer hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-3"
                >
                  <Crown className="w-5 h-5" />
                  Premium noetig
                </button>
              ) : (
                <div className="w-full py-3.5 lg:py-4 bg-gray-800/50 border-2 border-gray-700/40 text-gray-500 font-black rounded-xl text-center uppercase tracking-wide text-sm lg:text-base flex items-center justify-center gap-3">
                  <Lock className="w-5 h-5" />
                  Gesperrt
                </div>
              )}

              {/* View button */}
              <button className="w-full py-3 lg:py-3.5 bg-blue-600/80 hover:bg-blue-500 text-white font-bold rounded-xl transition-all uppercase tracking-wide text-sm lg:text-base cursor-pointer flex items-center justify-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black">Y</span>
                ANSEHEN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ HINT TEXT ═══════ */}
      <div className="px-4 sm:px-6 lg:px-8 mb-3">
        <div className="inline-flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2">
          <span className="text-xs sm:text-sm text-white/50">
            <span className="text-yellow-300 font-bold">Klicke</span> auf eine Belohnung um sie auszuwaehlen
          </span>
          <Star className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" fill="currentColor" />
        </div>
      </div>

      {/* ═══════ LEVEL PROGRESSION TRACK ═══════ */}
      <div className="px-6 sm:px-10 lg:px-14 xl:px-20 mb-1">
        <div className="relative flex justify-between items-center">
          {/* Background track line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/[0.06] rounded-full -translate-y-1/2" />
          {/* Progress fill */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full -translate-y-1/2 transition-all duration-500"
            style={{ width: `${trackProgress}%` }}
          />
          {/* Level dots */}
          {pageRewards.map((reward, i) => {
            const isPast = reward.tier <= currentTier
            const isCurrent = reward.tier === currentTier
            return (
              <div
                key={`dot-${reward.tier}-${reward.track}`}
                className="relative z-10 flex flex-col items-center gap-1"
              >
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                  isCurrent ? 'text-yellow-400' : isPast ? 'text-yellow-400/60' : 'text-white/15'
                }`}>
                  Lv {reward.tier}
                </span>
                <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-yellow-400 ring-[3px] ring-yellow-400/30 shadow-lg shadow-yellow-400/40'
                    : isPast
                      ? 'bg-yellow-400'
                      : 'bg-white/10 border border-white/15'
                }`} />
                {reward.track === 'free' && (
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase">Free</span>
                )}
                {reward.track === 'premium' && (
                  <span className="text-[8px] sm:text-[9px] font-bold text-yellow-400/20 uppercase">
                    <Crown className="w-2.5 h-2.5 inline" />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══════ BOTTOM CARD STRIP (6 cards per page) ═══════ */}
      <div
        className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3"
        data-testid="reward-card-strip"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(8,12,32,0.6) 40%, rgba(12,16,40,0.8) 100%)',
        }}
      >
        <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-evenly overflow-x-auto pb-1 hide-scrollbar">
          {pageRewards.map((reward, i) => (
            <RewardCard
              key={`${reward.tier}-${reward.track}`}
              reward={reward}
              isSelected={i === safeIndex}
              onClick={() => setSelectedIndex(i)}
              currentTier={currentTier}
              isPremium={isPremiumPass}
              isClaimed={isRewardClaimed(reward.tier, reward.track)}
            />
          ))}
        </div>
      </div>

      {/* ═══════ PAGE NAVIGATION ═══════ */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3" data-testid="page-navigation">
        <div className="text-xs sm:text-sm text-white/25 font-medium">
          Level {startTier} – {endTier}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
            data-testid="page-prev"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <span className="text-sm sm:text-base font-bold text-white/60 tracking-widest uppercase min-w-[120px] text-center" data-testid="page-indicator">
            Seite {currentPage + 1} / {TOTAL_PAGES}
          </span>

          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === TOTAL_PAGES - 1}
            data-testid="page-next"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer border border-white/10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-white/25 font-medium">
          Lvl {currentTier} / {CURRENT_SEASON.maxTier}
        </div>
      </div>

      {/* ═══════ BOTTOM DISCLAIMER ═══════ */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4">
        <p className="text-[10px] text-white/10">
          Season {CURRENT_SEASON.number} – {CURRENT_SEASON.name}. Belohnungen sind nur waehrend der Season verfuegbar.
        </p>
      </div>
    </div>
  )
}
