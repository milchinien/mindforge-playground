import { memo, useState, useEffect } from 'react'
import { Swords, Clock, Trophy, Flame, Timer } from 'lucide-react'

function formatTimeRemaining(endsAt) {
  const now = Date.now()
  const diff = new Date(endsAt).getTime() - now
  if (diff <= 0) return 'Beendet'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}T ${hours % 24}Std`
  }
  return `${hours}Std ${minutes}Min ${seconds}Sek`
}

function getStatusConfig(status) {
  switch (status) {
    case 'preparing':
      return {
        label: 'Vorbereitung',
        bgClass: 'from-yellow-500/10 to-orange-500/10',
        borderClass: 'border-yellow-500/30',
        badgeClass: 'bg-yellow-500/20 text-yellow-400',
        icon: Timer,
      }
    case 'active':
      return {
        label: 'Aktiv',
        bgClass: 'from-red-500/10 to-purple-500/10',
        borderClass: 'border-red-500/30',
        badgeClass: 'bg-red-500/20 text-red-400',
        icon: Flame,
      }
    case 'completed':
      return {
        label: 'Beendet',
        bgClass: 'from-green-500/10 to-teal-500/10',
        borderClass: 'border-green-500/30',
        badgeClass: 'bg-green-500/20 text-green-400',
        icon: Trophy,
      }
    default:
      return {
        label: status,
        bgClass: 'from-gray-500/10 to-gray-600/10',
        borderClass: 'border-gray-500/30',
        badgeClass: 'bg-gray-500/20 text-gray-400',
        icon: Swords,
      }
  }
}

function ClanWarBanner({ war }) {
  const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(war.endsAt))
  const config = getStatusConfig(war.status)
  const StatusIcon = config.icon

  // Live countdown
  useEffect(() => {
    if (war.status === 'completed') return
    const interval = setInterval(() => {
      setTimeLeft(formatTimeRemaining(war.endsAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [war.endsAt, war.status])

  const clanA = war.clanA
  const clanB = war.clanB
  const aLeading = clanA.score > clanB.score
  const bLeading = clanB.score > clanA.score
  const completedMatchups = war.matchups?.filter(m => m.status === 'completed').length || 0
  const totalMatchups = war.matchups?.length || 0

  return (
    <div className={`rounded-xl border ${config.borderClass} bg-gradient-to-r ${config.bgClass}
                    overflow-hidden transition-all`}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 py-2 bg-black/20">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-text-primary">Clan War</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* VS Layout */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Clan A */}
          <div className="flex-1 text-center">
            <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${clanA.emblemColor}
                            flex items-center justify-center shadow-lg mb-3`}>
              <span className="text-2xl font-black text-white">
                {clanA.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-bold text-text-primary text-sm truncate mb-1">{clanA.name}</h3>
            <p className="text-xs text-text-muted">Lvl {clanA.clanLevel}</p>
            <p className={`text-3xl font-black mt-2 ${aLeading ? 'text-success' : bLeading ? 'text-error' : 'text-text-primary'}`}>
              {clanA.score.toLocaleString('de-DE')}
            </p>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-bg-card border-2 border-gray-600 flex items-center justify-center
                           shadow-xl">
              <StatusIcon className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">VS</span>
          </div>

          {/* Clan B */}
          <div className="flex-1 text-center">
            <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${clanB.emblemColor}
                            flex items-center justify-center shadow-lg mb-3`}>
              <span className="text-2xl font-black text-white">
                {clanB.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-bold text-text-primary text-sm truncate mb-1">{clanB.name}</h3>
            <p className="text-xs text-text-muted">Lvl {clanB.clanLevel}</p>
            <p className={`text-3xl font-black mt-2 ${bLeading ? 'text-success' : aLeading ? 'text-error' : 'text-text-primary'}`}>
              {clanB.score.toLocaleString('de-DE')}
            </p>
          </div>
        </div>

        {/* Matchup progress */}
        <div className="mt-5 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span>Duelle abgeschlossen</span>
            <span className="font-semibold text-text-primary">{completedMatchups}/{totalMatchups}</span>
          </div>
          <div className="w-full bg-bg-hover rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{ width: `${totalMatchups > 0 ? Math.round((completedMatchups / totalMatchups) * 100) : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ClanWarBanner)
