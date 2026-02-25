import { CheckCircle2, Zap, Star, Trophy, Gift, Clock } from 'lucide-react'
import { DIFFICULTY_CONFIG } from '../../data/seasonData'
import { useSeasonStore } from '../../stores/seasonStore'

export default function ChallengeCard({ challenge, progress }) {
  const claimChallengeReward = useSeasonStore((s) => s.claimChallengeReward)

  const current = progress?.current || 0
  const completed = progress?.completed || false
  const claimed = progress?.claimed || false
  const percent = Math.min(100, Math.round((current / challenge.target) * 100))
  const diff = DIFFICULTY_CONFIG[challenge.difficulty] || DIFFICULTY_CONFIG.easy

  const canClaim = completed && !claimed

  function handleClaim() {
    if (canClaim) {
      claimChallengeReward(challenge.id, challenge.xpReward)
    }
  }

  return (
    <div
      className={`bg-bg-card rounded-xl p-5 border transition-all ${
        claimed
          ? 'border-success/30 bg-success/5 opacity-80'
          : canClaim
            ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20'
            : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div className="flex-shrink-0 mt-0.5">
          {claimed ? (
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          ) : completed ? (
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
              <Gift className="w-5 h-5 text-accent" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
              <Trophy className="w-5 h-5 text-text-muted" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with title and difficulty badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <h3 className={`font-semibold ${claimed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {challenge.title}
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diff.color} ${diff.bg}`}>
              {diff.label}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-3">{challenge.description}</p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>
                {current.toLocaleString('de-DE')}/{challenge.target.toLocaleString('de-DE')}
              </span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  claimed ? 'bg-success' : completed ? 'bg-accent' : 'bg-primary'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Rewards row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              {/* XP reward */}
              <div className="flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-semibold text-accent">+{challenge.xpReward} XP</span>
              </div>

              {/* Bonus reward preview */}
              {challenge.bonusReward && (
                <div className="flex items-center gap-1.5 text-sm text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">{challenge.bonusReward.name}</span>
                </div>
              )}
            </div>

            {/* Claim button */}
            {canClaim && (
              <button
                onClick={handleClaim}
                className="px-4 py-1.5 bg-accent hover:bg-accent/80 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Einsammeln
              </button>
            )}
            {claimed && (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Eingesammelt
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
