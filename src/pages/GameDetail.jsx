import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye, Play, Heart, ThumbsDown, Calendar, MonitorPlay, X } from 'lucide-react'
import ShareButtons from '../components/common/ShareButtons'
import { getGameById } from '../data/mockGames'
import { formatNumber, formatDate } from '../utils/formatters'
import { getSubjectConfig } from '../data/subjectConfig'
import TagList from '../components/game/TagList'
import LikeDislike from '../components/game/LikeDislike'
import { useGameInteractionStore } from '../stores/gameInteractionStore'

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
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const game = getGameById(id)
  const [showPreview, setShowPreview] = useState(false)
  const stats = useGameInteractionStore((s) => s.globalStats[game?.id]) || { likes: 0, dislikes: 0, views: 0, plays: 0 }

  useEffect(() => {
    if (game?.id) {
      useGameInteractionStore.getState().recordView(game.id)
    }
  }, [game?.id])

  if (!game) {
    return (
      <div className="text-center py-20">
        <>
          <title>404 | MindForge</title>
        </>
        <h1 className="text-6xl font-bold text-text-muted mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-6">
          {t('game.notFound')}
        </p>
        <Link to="/browse" className="text-accent hover:underline">
          {t('game.backToBrowser')}
        </Link>
      </div>
    )
  }

  return (
    <div className="py-4">
      <>
        <title>{game.title} | MindForge</title>
        <meta name="description" content={game.description} />
        <meta property="og:title" content={`${game.title} | MindForge`} />
        <meta property="og:description" content={game.description} />
        <meta property="og:type" content="website" />
        {game.thumbnail && <meta property="og:image" content={game.thumbnail} />}
      </>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>{t('common.back')}</span>
      </button>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8">
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
                  className="w-24 h-16 object-cover rounded-lg flex-shrink-0 opacity-70 hover:opacity-100 active:opacity-100 transition-opacity cursor-pointer"
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
            {t('game.by')}{' '}
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
              {t('game.questionCount', { count: game.questions.length })}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-bg-hover mb-4" />

          {/* Stats */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-text-secondary">
              <Eye size={16} className="text-text-muted" />
              <span>{formatNumber(stats.views)} {t('common.views')}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Play size={16} className="text-text-muted" />
              <span>{formatNumber(stats.plays)} {t('common.plays')}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-text-secondary">
                <Heart size={16} className="text-text-muted" />
                {formatNumber(stats.likes)} {t('common.likes')}
              </span>
              <span className="flex items-center gap-2 text-text-secondary">
                <ThumbsDown size={16} className="text-text-muted" />
                {formatNumber(stats.dislikes)} {t('common.dislikes')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar size={16} className="text-text-muted" />
              <span>{t('game.createdAt', { date: formatDate(game.createdAt) })}</span>
            </div>
          </div>

          {/* Play + Preview Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => navigate(`/play/${game.id}`)}
              className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors cursor-pointer text-lg flex items-center justify-center gap-2"
            >
              <Play size={20} />
              {t('game.playNow')}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="bg-bg-card hover:bg-bg-hover text-text-primary font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center gap-2 border border-gray-700"
              title={t('game.preview', 'Vorschau')}
            >
              <MonitorPlay size={18} />
              <span className="hidden sm:inline">{t('game.preview', 'Vorschau')}</span>
            </button>
          </div>

          {/* Like / Dislike */}
          <LikeDislike gameId={game.id} />

          {/* Share */}
          <div className="mt-4 pt-4 border-t border-bg-hover">
            <ShareButtons title={game.title} compact />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-bg-secondary rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <span className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <MonitorPlay size={16} />
                {t('game.preview', 'Vorschau')}: {game.title}
              </span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video bg-bg-primary flex items-center justify-center">
              {game.mode === 'template' && game.questions ? (
                <div className="text-center p-8 max-w-lg">
                  <p className="text-text-muted text-sm mb-4">{t('game.previewQuiz', 'Quiz-Vorschau')}</p>
                  <div className="space-y-3">
                    {game.questions.slice(0, 3).map((q, i) => (
                      <div key={i} className="bg-bg-card rounded-lg p-3 text-left">
                        <p className="text-text-primary text-sm font-medium">{i + 1}. {q.text}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.options?.map((opt, j) => (
                            <span key={j} className="text-xs bg-bg-hover px-2 py-0.5 rounded text-text-secondary">
                              {opt.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {game.questions.length > 3 && (
                      <p className="text-text-muted text-xs">
                        +{game.questions.length - 3} {t('game.moreQuestions', 'weitere Fragen')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowPreview(false); navigate(`/play/${game.id}`) }}
                    className="mt-4 bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    {t('game.playNow')}
                  </button>
                </div>
              ) : (
                <div className="text-center p-8">
                  <MonitorPlay size={48} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary mb-2">{t('game.previewNotAvailable', 'Vorschau für dieses Spielformat nicht verfügbar.')}</p>
                  <button
                    onClick={() => { setShowPreview(false); navigate(`/play/${game.id}`) }}
                    className="mt-2 bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    {t('game.playNow')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
