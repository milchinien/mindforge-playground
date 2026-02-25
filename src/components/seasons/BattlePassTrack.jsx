import { useRef, useEffect } from 'react'
import {
  Lock, CheckCircle2, Gift, Zap, Award, Tag, Image,
  Sparkles, ShieldCheck, Crown, Gem, Star, Frame,
} from 'lucide-react'
import { BATTLE_PASS_TIERS, RARITY_CONFIG } from '../../data/seasonData'
import { useSeasonStore } from '../../stores/seasonStore'

// Map icon names to lucide components
const ICON_MAP = {
  zap: Zap,
  award: Award,
  tag: Tag,
  image: Image,
  sparkles: Sparkles,
  shield: ShieldCheck,
  crown: Crown,
  gem: Gem,
  star: Star,
  frame: Frame,
  book: Award,
  glasses: Sparkles,
  headphones: Sparkles,
  wand: Star,
  feather: Sparkles,
  flame: Zap,
  target: Star,
  'trending-up': Zap,
  clock: Star,
}

function getRewardIcon(iconName) {
  return ICON_MAP[iconName] || Gift
}

function RewardSlot({ reward, tier, track, currentTier, isPremium, isClaimed }) {
  const claimReward = useSeasonStore((s) => s.claimReward)

  if (!reward) {
    return (
      <div className="w-full h-20 rounded-lg border border-dashed border-gray-700/50 flex items-center justify-center">
        <span className="text-xs text-text-muted">--</span>
      </div>
    )
  }

  const isLocked = tier > currentTier
  const isPremiumLocked = track === 'premium' && !isPremium
  const canClaim = !isLocked && !isPremiumLocked && !isClaimed
  const rarity = RARITY_CONFIG[reward.rarity] || RARITY_CONFIG.common
  const IconComponent = getRewardIcon(reward.icon)

  function handleClaim() {
    if (canClaim) {
      claimReward(tier, track)
    }
  }

  return (
    <div
      className={`relative w-full rounded-lg border p-2.5 transition-all group ${
        isClaimed
          ? 'border-success/40 bg-success/5'
          : canClaim
            ? `${rarity.border} ${rarity.bg} ring-1 ring-accent/20 hover:ring-accent/40`
            : isLocked || isPremiumLocked
              ? 'border-gray-700/50 bg-bg-hover/30 opacity-50'
              : `${rarity.border} ${rarity.bg}`
      }`}
    >
      {/* Reward icon */}
      <div className="flex flex-col items-center gap-1.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          isClaimed ? 'bg-success/20' : isLocked ? 'bg-bg-hover' : `${rarity.bg}`
        }`}>
          {isClaimed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : isLocked || isPremiumLocked ? (
            <Lock className="w-4 h-4 text-text-muted" />
          ) : (
            <IconComponent className={`w-5 h-5 ${rarity.color}`} />
          )}
        </div>

        {/* Reward name */}
        <p className={`text-[10px] leading-tight text-center font-medium line-clamp-2 ${
          isClaimed ? 'text-success' : isLocked ? 'text-text-muted' : rarity.color
        }`}>
          {reward.name}
        </p>

        {/* Rarity label */}
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${rarity.bg} ${rarity.color}`}>
          {rarity.label}
        </span>
      </div>

      {/* Claim button overlay */}
      {canClaim && (
        <button
          onClick={handleClaim}
          className="absolute inset-0 rounded-lg flex items-center justify-center bg-accent/0 hover:bg-accent/10 transition-colors cursor-pointer"
          title={`${reward.name} einsammeln`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-accent bg-bg-card/90 px-2 py-1 rounded-md shadow">
            Einsammeln
          </span>
        </button>
      )}

      {/* Premium lock icon */}
      {isPremiumLocked && !isLocked && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow">
          <Crown className="w-3 h-3 text-black" />
        </div>
      )}
    </div>
  )
}

export default function BattlePassTrack() {
  const seasonXP = useSeasonStore((s) => s.seasonXP)
  const isPremiumPass = useSeasonStore((s) => s.isPremiumPass)
  const isRewardClaimed = useSeasonStore((s) => s.isRewardClaimed)
  const currentTier = useSeasonStore((s) => s.getBattlePassTier)()

  const scrollRef = useRef(null)
  const currentTierRef = useRef(null)

  // Scroll to current tier on mount
  useEffect(() => {
    if (currentTierRef.current && scrollRef.current) {
      const container = scrollRef.current
      const element = currentTierRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const scrollLeft = elementRect.left - containerRect.left + container.scrollLeft - containerRect.width / 2 + elementRect.width / 2
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
    }
  }, [currentTier])

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-success/40" />
          Eingesammelt
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent/40 animate-pulse" />
          Verfuegbar
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          Gesperrt
        </span>
        <span className="flex items-center gap-1.5">
          <Crown className="w-3 h-3 text-yellow-500" />
          Premium
        </span>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 -mx-2 px-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex gap-2" style={{ minWidth: `${BATTLE_PASS_TIERS.length * 120}px` }}>
          {BATTLE_PASS_TIERS.map((tierData) => {
            const isCurrentTier = tierData.tier === currentTier
            const isReached = tierData.tier <= currentTier
            const freeClaimed = isRewardClaimed(tierData.tier, 'free')
            const premiumClaimed = isRewardClaimed(tierData.tier, 'premium')

            return (
              <div
                key={tierData.tier}
                ref={isCurrentTier ? currentTierRef : null}
                className={`flex flex-col items-center flex-shrink-0 ${isCurrentTier ? '' : ''}`}
                style={{ width: '112px' }}
              >
                {/* Tier number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  isCurrentTier
                    ? 'bg-accent text-white ring-2 ring-accent/50 ring-offset-2 ring-offset-bg-primary'
                    : isReached
                      ? 'bg-success/20 text-success'
                      : 'bg-bg-hover text-text-muted'
                }`}>
                  {tierData.tier}
                </div>

                {/* Progress connector line */}
                <div className={`w-full h-1 rounded-full mb-2 ${
                  isReached ? 'bg-accent' : 'bg-bg-hover'
                }`} />

                {/* Free track reward */}
                <div className="w-full mb-1.5">
                  <p className="text-[9px] text-text-muted text-center mb-1 uppercase tracking-wider font-semibold">Free</p>
                  <RewardSlot
                    reward={tierData.free}
                    tier={tierData.tier}
                    track="free"
                    currentTier={currentTier}
                    isPremium={true}
                    isClaimed={freeClaimed}
                  />
                </div>

                {/* Premium track reward */}
                <div className="w-full">
                  <p className="text-[9px] text-yellow-400/80 text-center mb-1 uppercase tracking-wider font-semibold flex items-center justify-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" /> Premium
                  </p>
                  <RewardSlot
                    reward={tierData.premium}
                    tier={tierData.tier}
                    track="premium"
                    currentTier={currentTier}
                    isPremium={isPremiumPass}
                    isClaimed={premiumClaimed}
                  />
                </div>

                {/* XP threshold label */}
                <p className="text-[9px] text-text-muted mt-1.5 text-center">
                  {tierData.xpRequired.toLocaleString('de-DE')} XP
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
