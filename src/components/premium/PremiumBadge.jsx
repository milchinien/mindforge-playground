import { Star, Crown, Sparkles, GraduationCap } from 'lucide-react'

const TIER_CONFIG = {
  pro: {
    label: 'Pro',
    icon: Sparkles,
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  creator: {
    label: 'Creator',
    icon: Crown,
    bgClass: 'bg-accent/15',
    textClass: 'text-accent',
    borderClass: 'border-accent/30',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  teacher: {
    label: 'Lehrer',
    icon: GraduationCap,
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
  dev: {
    label: 'Dev',
    icon: Star,
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
}

/**
 * PremiumBadge - Small badge showing premium tier.
 *
 * @param {string} tier - One of 'pro', 'creator', 'teacher', 'dev'
 * @param {'inline'|'icon'|'full'} variant - Display variant
 * @param {boolean} glow - Whether to show glowing border effect
 */
export default function PremiumBadge({ tier, variant = 'inline', glow = true }) {
  const config = TIER_CONFIG[tier]
  if (!config) return null

  const Icon = config.icon

  // Icon-only variant (for leaderboard rows)
  if (variant === 'icon') {
    return (
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${config.bgClass} ${config.borderClass} border flex-shrink-0`}
        style={glow ? { boxShadow: `0 0 8px 1px ${config.glowColor}` } : undefined}
        title={`${config.label}-Mitglied`}
      >
        <Icon className={`w-3 h-3 ${config.textClass}`} />
      </div>
    )
  }

  // Full variant (with text and tier name)
  if (variant === 'full') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgClass} ${config.borderClass}`}
        style={glow ? { boxShadow: `0 0 12px 2px ${config.glowColor}` } : undefined}
      >
        <Icon className={`w-4 h-4 ${config.textClass}`} />
        <span className={`text-sm font-bold ${config.textClass}`}>{config.label}</span>
        <Star className={`w-3 h-3 ${config.textClass}`} />
      </div>
    )
  }

  // Default inline variant (small pill)
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bgClass} ${config.borderClass} ${config.textClass}`}
      style={glow ? { boxShadow: `0 0 6px 1px ${config.glowColor}` } : undefined}
    >
      <Star className="w-2.5 h-2.5" />
      {config.label}
    </span>
  )
}
