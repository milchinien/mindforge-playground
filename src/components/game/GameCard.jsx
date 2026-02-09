import { useNavigate } from 'react-router-dom'
import { Heart, Play } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import TagList from './TagList'

const subjectGradients = {
  mathematik: 'from-blue-600 to-blue-800',
  physik: 'from-purple-600 to-purple-800',
  chemie: 'from-green-600 to-green-800',
  biologie: 'from-emerald-600 to-emerald-800',
  deutsch: 'from-red-600 to-red-800',
  englisch: 'from-yellow-600 to-yellow-800',
  geschichte: 'from-amber-600 to-amber-800',
  geographie: 'from-teal-600 to-teal-800',
  informatik: 'from-cyan-600 to-cyan-800',
  kunst: 'from-pink-600 to-pink-800',
  musik: 'from-violet-600 to-violet-800'
}

function ThumbnailPlaceholder({ title, subject }) {
  const gradient = subjectGradients[subject] || 'from-gray-600 to-gray-800'

  return (
    <div className={`w-full h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-4xl font-bold text-white/40">{title.charAt(0)}</span>
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
