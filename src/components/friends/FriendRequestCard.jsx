import { useState } from 'react'
import { Link } from 'react-router-dom'
import { timeAgo } from '../../utils/formatters'

export default function FriendRequestCard({ request, onAccept, onDecline }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = () => {
    setIsLoading(true)
    onAccept(request.friendshipId)
  }

  const handleDecline = () => {
    setIsLoading(true)
    onDecline(request.friendshipId)
  }

  return (
    <div className="flex items-center gap-4 bg-bg-card rounded-xl p-4
                    border border-accent/20">
      {/* Avatar */}
      <div className="w-12 h-12 bg-bg-hover rounded-full flex items-center justify-center
                      text-lg font-bold text-text-primary flex-shrink-0">
        {request.displayName?.charAt(0) || '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${request.username}`}
          className="font-semibold text-text-primary hover:text-accent transition-colors"
        >
          {request.displayName}
        </Link>
        <p className="text-sm text-text-muted">
          moechte dein Freund sein - {timeAgo(request.requestedAt)}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg
                     text-sm font-medium transition-colors disabled:opacity-50"
        >
          Annehmen
        </button>
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="bg-bg-hover hover:bg-gray-500 text-text-primary px-4 py-2 rounded-lg
                     text-sm font-medium transition-colors disabled:opacity-50"
        >
          Ablehnen
        </button>
      </div>
    </div>
  )
}
