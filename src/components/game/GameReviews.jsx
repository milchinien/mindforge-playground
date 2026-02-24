import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, ThumbsUp, ThumbsDown, Send, User, Clock, ChevronDown, MessageSquare } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

const MOCK_REVIEWS = [
  { id: '1', userId: 'u1', username: 'MaxMustermann', avatar: null, rating: 5, text: 'Absolut geniales Lernspiel! Meine Schüler lieben es und die Ergebnisse sprechen für sich.', date: '2026-02-20T10:30:00Z', helpful: 14, notHelpful: 1 },
  { id: '2', userId: 'u2', username: 'LenaLernt', avatar: null, rating: 4, text: 'Sehr gut aufgebaut, nur das letzte Level ist etwas zu schwer für Anfänger. Ansonsten top!', date: '2026-02-18T14:15:00Z', helpful: 9, notHelpful: 2 },
  { id: '3', userId: 'u3', username: 'ProGamerTom', avatar: null, rating: 5, text: 'Endlich ein Spiel, bei dem man wirklich was lernt und trotzdem Spaß hat. Perfekt!', date: '2026-02-15T09:00:00Z', helpful: 22, notHelpful: 0 },
  { id: '4', userId: 'u4', username: 'SarahSchule', avatar: null, rating: 3, text: 'Ganz okay, aber die Grafik könnte besser sein. Inhaltlich aber solide.', date: '2026-02-12T16:45:00Z', helpful: 5, notHelpful: 3 },
  { id: '5', userId: 'u5', username: 'MatheMaster', avatar: null, rating: 5, text: 'Als Mathelehrer bin ich begeistert. Die Aufgaben sind didaktisch sehr gut aufbereitet.', date: '2026-02-10T11:20:00Z', helpful: 18, notHelpful: 1 },
  { id: '6', userId: 'u6', username: 'KleinerFuchs', avatar: null, rating: 4, text: 'Macht echt Spaß! Ich spiele es jeden Tag nach der Schule. Wünsche mir mehr Level.', date: '2026-02-08T13:00:00Z', helpful: 7, notHelpful: 0 },
  { id: '7', userId: 'u7', username: 'TechNerd99', avatar: null, rating: 2, text: 'Idee ist gut, aber es gibt noch einige Bugs. Manchmal lädt das Spiel nicht richtig.', date: '2026-02-05T08:30:00Z', helpful: 11, notHelpful: 4 },
  { id: '8', userId: 'u8', username: 'BiologieFan', avatar: null, rating: 4, text: 'Tolles Konzept! Besonders die interaktiven Elemente sind super gemacht.', date: '2026-02-03T17:10:00Z', helpful: 6, notHelpful: 1 },
  { id: '9', userId: 'u9', username: 'AnnaAdmin', avatar: null, rating: 5, text: 'Nutze es in meiner Klasse - die Kinder sind motivierter als je zuvor. Klare Empfehlung!', date: '2026-01-28T10:00:00Z', helpful: 25, notHelpful: 2 },
  { id: '10', userId: 'u10', username: 'CoolCoder', avatar: null, rating: 3, text: 'Für den Anfang nicht schlecht. Es fehlen aber noch Features wie Multiplayer oder Ranglisten.', date: '2026-01-25T15:30:00Z', helpful: 4, notHelpful: 2 },
]

function StarRating({ rating, size = 16, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${interactive ? 'cursor-pointer' : ''} transition-colors`}
          fill={(interactive ? hovered || rating : rating) >= star ? '#EAB308' : 'transparent'}
          color={(interactive ? hovered || rating : rating) >= star ? '#EAB308' : '#6b7280'}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  )
}

function RatingDistribution({ reviews }) {
  const total = reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => {
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary w-6 text-right">{star}</span>
            <Star size={12} fill="#EAB308" color="#EAB308" />
            <div className="flex-1 h-2.5 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-text-muted text-xs w-8 text-right">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ReviewCard({ review, onVote, votedReviews, t }) {
  const vote = votedReviews[review.id]
  return (
    <div className="bg-bg-card rounded-xl border border-gray-700 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center shrink-0">
          <User size={18} className="text-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-text-primary text-sm">{review.username}</span>
            <div className="flex items-center gap-1 text-text-muted text-xs">
              <Clock size={12} />
              {formatDate(review.date)}
            </div>
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size={14} />
          </div>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">{review.text}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-text-muted text-xs mr-1">{t('game.reviews.helpful')}</span>
            <button
              onClick={() => onVote(review.id, 'helpful')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${
                vote === 'helpful'
                  ? 'bg-green-600/20 text-green-400'
                  : 'text-text-muted hover:text-green-400 hover:bg-green-600/10'
              }`}
            >
              <ThumbsUp size={13} />
              {review.helpful}
            </button>
            <button
              onClick={() => onVote(review.id, 'notHelpful')}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${
                vote === 'notHelpful'
                  ? 'bg-red-600/20 text-red-400'
                  : 'text-text-muted hover:text-red-400 hover:bg-red-600/10'
              }`}
            >
              <ThumbsDown size={13} />
              {review.notHelpful}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GameReviews({ gameId }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [sortBy, setSortBy] = useState('newest')
  const [newRating, setNewRating] = useState(0)
  const [newText, setNewText] = useState('')
  const [votedReviews, setVotedReviews] = useState({})

  const SORT_OPTIONS = [
    { value: 'newest', label: t('game.reviews.sortNewest') },
    { value: 'highest', label: t('game.reviews.sortHighest') },
    { value: 'helpful', label: t('game.reviews.sortHelpful') },
  ]

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews])

  const sorted = useMemo(() => {
    const copy = [...reviews]
    if (sortBy === 'newest') copy.sort((a, b) => new Date(b.date) - new Date(a.date))
    else if (sortBy === 'highest') copy.sort((a, b) => b.rating - a.rating)
    else copy.sort((a, b) => b.helpful - a.helpful)
    return copy
  }, [reviews, sortBy])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      showToast(t('game.reviews.loginRequired'), 'warning')
      return
    }
    if (newRating === 0) {
      showToast(t('game.reviews.selectRating'), 'warning')
      return
    }
    if (newText.trim().length < 10) {
      showToast(t('game.reviews.minLength'), 'warning')
      return
    }
    const review = {
      id: `new-${Date.now()}`,
      userId: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'Nutzer',
      avatar: null,
      rating: newRating,
      text: newText.trim(),
      date: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
    }
    setReviews((prev) => [review, ...prev])
    setNewRating(0)
    setNewText('')
    showToast(t('game.reviews.success'), 'success')
  }

  const handleVote = (reviewId, type) => {
    if (!user) {
      showToast(t('game.reviews.loginToVote'), 'warning')
      return
    }
    const current = votedReviews[reviewId]
    setVotedReviews((prev) => {
      const next = { ...prev }
      if (current === type) {
        delete next[reviewId]
      } else {
        next[reviewId] = type
      }
      return next
    })
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r
        let { helpful, notHelpful } = r
        // Undo previous vote
        if (current === 'helpful') helpful--
        if (current === 'notHelpful') notHelpful--
        // Apply new vote (unless toggling off)
        if (current !== type) {
          if (type === 'helpful') helpful++
          if (type === 'notHelpful') notHelpful++
        }
        return { ...r, helpful, notHelpful }
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-text-primary">{t('game.reviews.title')}</h2>
        <span className="text-text-muted text-sm">({reviews.length})</span>
      </div>

      {/* Summary + Distribution */}
      <div className="bg-bg-card rounded-xl border border-gray-700 p-5">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average */}
          <div className="flex flex-col items-center justify-center sm:min-w-[140px]">
            <span className="text-4xl font-bold text-text-primary">{avgRating.toFixed(1)}</span>
            <StarRating rating={Math.round(avgRating)} size={18} />
            <span className="text-text-muted text-xs mt-1">{t('game.reviews.count', { count: reviews.length })}</span>
          </div>
          {/* Distribution */}
          <div className="flex-1">
            <RatingDistribution reviews={reviews} />
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-bg-card rounded-xl border border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">{t('game.reviews.writeReview')}</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-text-secondary text-sm">{t('game.reviews.yourRating')}</span>
              <StarRating rating={newRating} size={22} interactive onChange={setNewRating} />
              {newRating > 0 && (
                <span className="text-yellow-500 text-sm font-medium">{newRating}/5</span>
              )}
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={t('game.reviews.placeholder')}
              rows={3}
              maxLength={500}
              className="w-full bg-bg-primary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent transition-colors"
            />
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs">{newText.length}/500</span>
              <button
                type="submit"
                className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Send size={14} />
                {t('game.reviews.submit')}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-text-muted text-sm">
            {t('game.reviews.loginRequired')}
          </p>
        )}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">{t('game.reviews.count', { count: reviews.length })}</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-bg-card border border-gray-700 rounded-lg text-text-secondary text-sm pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onVote={handleVote}
            votedReviews={votedReviews}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}
