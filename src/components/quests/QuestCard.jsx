import { useState } from 'react'
import { Check, Gift, Sparkles, Lock, Clock } from 'lucide-react'

/**
 * QuestCard - Reusable quest card component
 *
 * Props:
 * - quest: { id, title, description, icon, target, current, xpReward, cosmeticReward?, status }
 * - onClaim: (questId) => void
 * - variant: 'default' | 'story' | 'community'
 * - contributors?: number (for community quests)
 * - locked?: boolean (for story quests)
 * - narrative?: string (for story quests)
 * - chapter?: number (for story quests)
 */
export default function QuestCard({
  quest,
  onClaim,
  variant = 'default',
  contributors,
  locked = false,
  narrative,
  chapter,
}) {
  const [claiming, setClaiming] = useState(false)

  const isCompleted = quest.status === 'completed'
  const isClaimed = quest.status === 'claimed'
  const isActive = quest.status === 'active'
  const isLocked = locked || quest.status === 'locked'

  const progress = quest.target > 0 ? Math.min(100, Math.round((quest.current / quest.target) * 100)) : 0

  const handleClaim = () => {
    if (!isCompleted || !onClaim) return
    setClaiming(true)
    // Simulate a short delay for animation
    setTimeout(() => {
      onClaim(quest.id)
      setClaiming(false)
    }, 400)
  }

  // Border and background based on status
  const cardStyles = isClaimed
    ? 'border-success/30 bg-success/5'
    : isCompleted
      ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20'
      : isLocked
        ? 'border-gray-700 opacity-60'
        : 'border-gray-700 hover:border-gray-600'

  return (
    <div
      className={`bg-bg-card rounded-xl p-5 border transition-all duration-300 ${cardStyles}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`text-3xl flex-shrink-0 ${isLocked ? 'grayscale opacity-40' : ''} ${isCompleted && !isClaimed ? 'animate-bounce' : ''}`}>
          {isLocked ? (
            <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
              <Lock className="w-5 h-5 text-text-muted" />
            </div>
          ) : isClaimed ? (
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-success" />
            </div>
          ) : (
            quest.icon
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {chapter !== undefined && (
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Kap. {chapter}
                </span>
              )}
              <h3 className={`font-semibold ${isLocked ? 'text-text-muted' : 'text-text-primary'}`}>
                {quest.title}
              </h3>
            </div>

            {/* Status indicator */}
            {isClaimed && (
              <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                <Check className="w-3 h-3" /> Abgeschlossen
              </span>
            )}
            {isCompleted && !isClaimed && (
              <span className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full animate-pulse">
                <Gift className="w-3 h-3" /> Bereit
              </span>
            )}
          </div>

          {/* Narrative text for story quests */}
          {narrative && !isLocked && (
            <p className="text-sm text-accent/80 italic mt-2 leading-relaxed border-l-2 border-accent/30 pl-3">
              {narrative}
            </p>
          )}

          {/* Description */}
          <p className={`text-sm mt-1.5 ${isLocked ? 'text-text-muted' : 'text-text-secondary'}`}>
            {isLocked ? 'Schliesse vorherige Quests ab, um diese freizuschalten.' : quest.description || quest.objective}
          </p>

          {/* Progress bar */}
          {!isClaimed && !isLocked && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>{quest.current}/{quest.target}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-bg-hover rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                    isCompleted ? 'bg-accent' : 'bg-primary-light'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Community contributors */}
          {contributors !== undefined && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                \uD83D\uDC65 {contributors.toLocaleString('de-DE')} Teilnehmer
              </span>
            </div>
          )}

          {/* Rewards */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {quest.xpReward && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                {quest.xpReward} XP
              </span>
            )}
            {quest.cosmeticReward && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full">
                <Gift className="w-3 h-3" />
                {quest.cosmeticReward}
              </span>
            )}
          </div>

          {/* Claim button */}
          {isCompleted && !isClaimed && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className={`mt-4 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer
                ${claiming
                  ? 'bg-accent/50 text-white scale-95'
                  : 'bg-accent hover:bg-accent-light text-white hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5'
                }`}
            >
              {claiming ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wird eingeloest...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Belohnung einloesen
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
