import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Play, Layers, Code, FileArchive } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import { getSubjectConfig } from '../../data/subjectConfig'
import TagList from './TagList'
import { useGameInteractionStore } from '../../stores/gameInteractionStore'

function ThumbnailPlaceholder({ title, subject }) {
  const config = getSubjectConfig(subject)

  return (
    <div className={`w-full h-20 sm:h-40 bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-3 text-4xl sm:text-6xl">{config.icon}</div>
        <div className="absolute bottom-1 right-2 text-3xl sm:text-4xl rotate-12">{config.icon}</div>
      </div>
      {/* Main icon */}
      <span className="text-3xl sm:text-4xl mb-1 drop-shadow-lg">{config.icon}</span>
      <span className="text-[10px] sm:text-xs font-medium text-white/60 tracking-wider uppercase">{config.label}</span>
    </div>
  )
}

export default memo(function GameCard({ game }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const stats = useGameInteractionStore((s) => s.globalStats[game.id]) || { likes: 0, plays: 0 }

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="w-[120px] sm:w-[220px] flex-shrink-0 snap-start bg-bg-card rounded-lg sm:rounded-xl shadow-md hover:-translate-y-1 hover:shadow-xl active:scale-[0.97] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-20 sm:h-40 object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        {!game.thumbnail && <ThumbnailPlaceholder title={game.title} subject={game.subject} />}
        {game.thumbnail && (
          <div className="hidden w-full h-20 sm:h-40">
            <ThumbnailPlaceholder title={game.title} subject={game.subject} />
          </div>
        )}

        {/* Mode Indicator */}
        {game.mode && game.mode !== 'zip' && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-black/60 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-0.5 sm:gap-1">
            {game.mode === 'template' ? <Layers size={8} className="sm:w-[10px] sm:h-[10px]" /> : <Code size={8} className="sm:w-[10px] sm:h-[10px]" />}
            {game.mode === 'template' ? 'Quiz' : 'Custom'}
          </div>
        )}

        {/* Premium Badge */}
        {game.premium && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-accent text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md">
            {game.price > 0 ? `${game.price} MC` : 'Premium'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3">
        <h3 className="font-bold text-text-primary text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 leading-tight">
          {game.title}
        </h3>
        <p className="text-text-muted text-[10px] sm:text-xs mt-0.5 sm:mt-1 truncate">
          {t('game.by')} {game.creator}
        </p>

        {/* Tags - hidden on mobile for compact cards */}
        <div className="hidden sm:block mt-2">
          <TagList tags={game.tags} maxTags={3} size="sm" />
        </div>

        {/* Stats - hidden on mobile for compact cards */}
        <div className="hidden sm:flex items-center gap-3 mt-2 text-text-secondary text-xs">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {formatNumber(stats.likes)}
          </span>
          <span className="flex items-center gap-1">
            <Play size={12} />
            {formatNumber(stats.plays)}
          </span>
        </div>
      </div>
    </div>
  )
})
