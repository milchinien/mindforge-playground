import { useState } from 'react'
import { Lock, Check, Info } from 'lucide-react'
import { BADGE_DEFINITIONS, RARITY_CONFIG } from '../../data/questData'
import { useQuestStore, selectUnlockedBadges, selectSelectedBadges } from '../../stores/questStore'

/**
 * BadgeGrid - Responsive badge collection grid
 * Shows all badges with rarity styling, locked state, and selection for profile showcase.
 */
export default function BadgeGrid() {
  const unlockedBadges = useQuestStore(selectUnlockedBadges)
  const selectedBadges = useQuestStore(selectSelectedBadges)
  const selectBadge = useQuestStore((s) => s.selectBadge)

  const [tooltipBadge, setTooltipBadge] = useState(null)

  const unlockedCount = unlockedBadges.length
  const totalCount = BADGE_DEFINITIONS.length

  // Group badges by rarity
  const grouped = {
    legendary: BADGE_DEFINITIONS.filter(b => b.rarity === 'legendary'),
    epic: BADGE_DEFINITIONS.filter(b => b.rarity === 'epic'),
    rare: BADGE_DEFINITIONS.filter(b => b.rarity === 'rare'),
    common: BADGE_DEFINITIONS.filter(b => b.rarity === 'common'),
  }

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-text-secondary text-sm">
            Abzeichen gesammelt
          </p>
          <p className="text-2xl font-bold text-text-primary">
            {unlockedCount} <span className="text-text-muted text-lg font-normal">/ {totalCount}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Ausgewaehlt:</span>
          <div className="flex gap-1">
            {selectedBadges.map(id => {
              const badge = BADGE_DEFINITIONS.find(b => b.id === id)
              if (!badge) return null
              return (
                <span key={id} className="text-xl" title={badge.name}>
                  {badge.icon}
                </span>
              )
            })}
            {selectedBadges.length === 0 && (
              <span className="text-xs text-text-muted italic">Keine</span>
            )}
          </div>
        </div>
      </div>

      {/* Selection hint */}
      <p className="text-xs text-text-muted mb-6 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" />
        Klicke auf freigeschaltete Abzeichen, um sie fuer dein Profil auszuwaehlen (max. 5).
      </p>

      {/* Badge sections by rarity */}
      {Object.entries(grouped).map(([rarity, badges]) => {
        const config = RARITY_CONFIG[rarity]
        return (
          <div key={rarity} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${config.textColor}`}>
                {config.label}
              </h3>
              <span className="text-xs text-text-muted">
                ({badges.filter(b => unlockedBadges.includes(b.id)).length}/{badges.length})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {badges.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id)
                const isSelected = selectedBadges.includes(badge.id)
                const showTooltip = tooltipBadge === badge.id

                return (
                  <div
                    key={badge.id}
                    className="relative"
                    onMouseEnter={() => setTooltipBadge(badge.id)}
                    onMouseLeave={() => setTooltipBadge(null)}
                  >
                    <button
                      onClick={() => isUnlocked && selectBadge(badge.id)}
                      disabled={!isUnlocked}
                      className={`
                        w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                        ${isUnlocked
                          ? `${config.borderColor} ${config.bgColor} ${config.glowColor} hover:scale-105`
                          : 'border-gray-700 bg-bg-card opacity-50 cursor-not-allowed'
                        }
                        ${isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary scale-105' : ''}
                      `}
                    >
                      {/* Badge icon or silhouette */}
                      <div className={`text-4xl transition-all duration-300 ${!isUnlocked ? 'grayscale brightness-50 blur-[1px]' : ''}`}>
                        {isUnlocked ? badge.icon : (
                          <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                            <Lock className="w-5 h-5 text-text-muted" />
                          </div>
                        )}
                      </div>

                      {/* Badge name */}
                      <span className={`text-xs font-medium text-center leading-tight ${
                        isUnlocked ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {isUnlocked ? badge.name : '???'}
                      </span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56
                                      bg-bg-secondary border border-gray-600 rounded-lg p-3 shadow-xl
                                      pointer-events-none animate-fadeIn">
                        <p className={`text-sm font-semibold ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                          {badge.name}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">{badge.description}</p>
                        <div className="mt-2 pt-2 border-t border-gray-700">
                          <p className={`text-xs ${config.textColor}`}>
                            {config.label}
                          </p>
                          {!isUnlocked && (
                            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              {badge.unlockCondition}
                            </p>
                          )}
                          {isUnlocked && !isSelected && (
                            <p className="text-xs text-accent mt-1">
                              Klicken zum Auswaehlen
                            </p>
                          )}
                          {isSelected && (
                            <p className="text-xs text-accent mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ausgewaehlt
                            </p>
                          )}
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                                        border-l-[6px] border-l-transparent
                                        border-r-[6px] border-r-transparent
                                        border-t-[6px] border-t-gray-600" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
