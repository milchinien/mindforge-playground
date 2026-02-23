import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, Play, Heart, ThumbsDown, Calendar } from 'lucide-react'
import { getGameById } from '../data/mockGames'
import { formatNumber, formatDate } from '../utils/formatters'
import { getSubjectConfig } from '../data/subjectConfig'
import TagList from '../components/game/TagList'
import LikeDislike from '../components/game/LikeDislike'
import GameReviews from '../components/game/GameReviews'

function ThumbnailPlaceholder({ title, subject, className = '' }) {
  const config = getSubjectConfig(subject)
  return (
    <div className={`bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-6 text-8xl">{config.icon}</div>
        <div className="absolute bottom-2 right-4 text-6xl rotate-12">{config.icon}</div>
      </div>
      <span className="text-6xl mb-2 drop-shadow-lg">{config.icon}</span>
      <span className="text-sm font-medium text-white/60 tracking-wider uppercase">{config.label}</span>
    </div>
  )
}

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const game = getGameById(id)

  useEffect(() => {
    if (game) {
      // TODO: Increment view counter via API
    }
  }, [id, game])

  if (!game) {
    return (
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-6">
          Dieses Spiel wurde nicht gefunden.
        </p>
        <Link to="/browse" className="text-accent hover:underline">
          Zurueck zum Mindbrowser
        </Link>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>Zurueck</span>
      </button>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-3">
          {/* Main Thumbnail */}
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full aspect-video object-cover rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          {!game.thumbnail && (
            <ThumbnailPlaceholder
              title={game.title}
              subject={game.subject}
              className="w-full aspect-video rounded-xl"
            />
          )}
          {game.thumbnail && (
            <div className="hidden w-full aspect-video rounded-xl">
              <ThumbnailPlaceholder title={game.title} subject={game.subject} className="w-full h-full rounded-xl" />
            </div>
          )}

          {/* Screenshots Gallery */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
              {game.screenshots.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-24 h-16 object-cover rounded-lg flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-2">
          {/* Title + Badges */}
          <div className="flex items-start gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-text-primary">{game.title}</h1>
            {game.mode === 'template' && (
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md mt-1 flex-shrink-0">
                Quiz
              </span>
            )}
            {game.mode === 'freeform' && (
              <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2.5 py-1 rounded-md mt-1 flex-shrink-0">
                Custom
              </span>
            )}
            {game.premium && (
              <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-md mt-1 flex-shrink-0">
                {game.price > 0 ? `${game.price} MC` : 'Premium'}
              </span>
            )}
          </div>

          {/* Creator */}
          <p className="text-text-secondary mb-4">
            von{' '}
            <Link
              to={`/profile/${game.creator}`}
              className="text-accent hover:underline"
            >
              {game.creator}
            </Link>
          </p>

          {/* Description */}
          <p className="text-text-secondary mb-4 leading-relaxed">
            {game.description}
          </p>

          {/* Tags */}
          <div className="mb-6">
            <TagList tags={game.tags} maxTags={10} size="md" />
          </div>

          {/* Question count for template games */}
          {game.mode === 'template' && game.questions && (
            <p className="text-text-secondary text-sm mb-4">
              {game.questions.length} Fragen
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-bg-hover mb-4" />

          {/* Stats */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Eye size={16} className="text-text-muted" />
              <span>{formatNumber(game.views)} Views</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Play size={16} className="text-text-muted" />
              <span>{formatNumber(game.plays)} Plays</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-text-secondary">
                <Heart size={16} className="text-text-muted" />
                {formatNumber(game.likes)} Likes
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <ThumbsDown size={16} className="text-text-muted" />
                {formatNumber(game.dislikes)} Dislikes
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar size={16} className="text-text-muted" />
              <span>Erstellt am {formatDate(game.createdAt)}</span>
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={() => navigate(`/play/${game.id}`)}
            className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors mb-4 cursor-pointer text-lg"
          >
            Jetzt spielen
          </button>

          {/* Like / Dislike */}
          <LikeDislike
            gameId={game.id}
            initialLikes={game.likes}
            initialDislikes={game.dislikes}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <GameReviews gameId={game.id} />
      </div>
    </div>
  )
}
