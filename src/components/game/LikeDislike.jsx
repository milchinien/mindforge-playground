import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { formatNumber } from '../../utils/formatters'
import { useGameInteractionStore } from '../../stores/gameInteractionStore'
import { useAchievementStore } from '../../stores/achievementStore'

export default function LikeDislike({ gameId }) {
  const { user } = useAuth()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const liked = useGameInteractionStore((s) => {
    if (!s.currentUserId) return false
    return (s.userLikes[s.currentUserId] || {})[gameId] === true
  })
  const disliked = useGameInteractionStore((s) => {
    if (!s.currentUserId) return false
    return (s.userDislikes[s.currentUserId] || {})[gameId] === true
  })
  const stats = useGameInteractionStore((s) => s.globalStats[gameId]) || { likes: 0, dislikes: 0 }
  const toggleLike = useGameInteractionStore((s) => s.toggleLike)
  const toggleDislike = useGameInteractionStore((s) => s.toggleDislike)

  const handleLike = () => {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }
    if (!liked) {
      useAchievementStore.getState().incrementProgress('likes_given')
    }
    toggleLike(gameId)
  }

  const handleDislike = () => {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }
    toggleDislike(gameId)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer ${
            liked
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
          }`}
        >
          <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{formatNumber(stats.likes)}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer ${
            disliked
              ? 'bg-red-600/20 text-red-400 border border-red-600'
              : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
          }`}
        >
          <ThumbsDown size={18} fill={disliked ? 'currentColor' : 'none'} />
          <span>{formatNumber(stats.dislikes)}</span>
        </button>
      </div>

      {/* Login prompt */}
      {showLoginPrompt && (
        <p className="text-sm text-text-muted text-center">
          <Link to="/login" className="text-accent hover:underline">Einloggen</Link> um zu bewerten
        </p>
      )}
    </div>
  )
}
