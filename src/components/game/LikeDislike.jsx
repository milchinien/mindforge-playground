import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { formatNumber } from '../../utils/formatters'

export default function LikeDislike({ gameId, initialLikes = 0, initialDislikes = 0 }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userRating, setUserRating] = useState(null) // null | "like" | "dislike"
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleLike = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }

    setIsLoading(true)
    // Simulate async operation
    await new Promise(r => setTimeout(r, 200))

    if (userRating === 'like') {
      setLikes(prev => prev - 1)
      setUserRating(null)
    } else if (userRating === 'dislike') {
      setLikes(prev => prev + 1)
      setDislikes(prev => prev - 1)
      setUserRating('like')
    } else {
      setLikes(prev => prev + 1)
      setUserRating('like')
    }
    setIsLoading(false)
  }

  const handleDislike = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 3000)
      return
    }

    setIsLoading(true)
    await new Promise(r => setTimeout(r, 200))

    if (userRating === 'dislike') {
      setDislikes(prev => prev - 1)
      setUserRating(null)
    } else if (userRating === 'like') {
      setDislikes(prev => prev + 1)
      setLikes(prev => prev - 1)
      setUserRating('dislike')
    } else {
      setDislikes(prev => prev + 1)
      setUserRating('dislike')
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-wait ${
            userRating === 'like'
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
          }`}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} fill={userRating === 'like' ? 'currentColor' : 'none'} />}
          <span>{formatNumber(likes)}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-wait ${
            userRating === 'dislike'
              ? 'bg-red-600/20 text-red-400 border border-red-600'
              : 'bg-bg-card hover:bg-bg-hover text-text-secondary'
          }`}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ThumbsDown size={18} fill={userRating === 'dislike' ? 'currentColor' : 'none'} />}
          <span>{formatNumber(dislikes)}</span>
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
