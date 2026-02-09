import { useNavigate } from 'react-router-dom'
import { Heart, Play } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import { getSubjectConfig } from '../../data/subjectConfig'
import TagList from './TagList'

function ThumbnailPlaceholder({ title, subject }) {
  const config = getSubjectConfig(subject)

  return (
    <div className={`w-full h-40 bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-3 text-6xl">{config.icon}</div>
        <div className="absolute bottom-1 right-2 text-4xl rotate-12">{config.icon}</div>
      </div>
      {/* Main icon */}
      <span className="text-4xl mb-1 drop-shadow-lg">{config.icon}</span>
      <span className="text-xs font-medium text-white/60 tracking-wider uppercase">{config.label}</span>
    </div>
  )
}

export default function GameCard({ game }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="w-[220px] flex-shrink-0 bg-bg-card rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        {!game.thumbnail && <ThumbnailPlaceholder title={game.title} subject={game.subject} />}
        {game.thumbnail && (
          <div className="hidden w-full h-40">
            <ThumbnailPlaceholder title={game.title} subject={game.subject} />
          </div>
        )}

        {/* Premium Badge */}
        {game.premium && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-md">
            {game.price > 0 ? `${game.price} MC` : 'Premium'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-text-primary text-sm line-clamp-2 leading-tight">
          {game.title}
        </h3>
        <p className="text-text-muted text-xs mt-1">
          von {game.creator}
        </p>

        <div className="mt-2">
          <TagList tags={game.tags} maxTags={3} size="sm" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-text-secondary text-xs">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {formatNumber(game.likes)}
          </span>
          <span className="flex items-center gap-1">
            <Play size={12} />
            {formatNumber(game.plays)}
          </span>
        </div>
      </div>
    </div>
  )
}
