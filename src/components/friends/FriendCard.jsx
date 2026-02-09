import { Link } from 'react-router-dom'
import { timeAgo } from '../../utils/formatters'

export default function FriendCard({ friend }) {
  return (
    <div className="flex items-center gap-4 bg-bg-card rounded-xl p-4
                    hover:bg-bg-hover transition-colors">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-bg-hover rounded-full flex items-center justify-center
                        text-lg font-bold text-text-primary">
          {friend.displayName?.charAt(0) || '?'}
        </div>
        {/* Online-Indikator */}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2
                          border-bg-card
          ${friend.isOnline ? 'bg-success' : 'bg-gray-500'}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${friend.username}`}
            className="font-semibold text-text-primary hover:text-accent transition-colors"
          >
            {friend.displayName}
          </Link>
          <span className={`text-xs ${friend.isOnline ? 'text-success' : 'text-text-muted'}`}>
            {friend.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-sm text-text-muted truncate">
          {friend.isOnline && friend.activity
            ? friend.activity
            : friend.lastOnline
              ? `Zuletzt online ${timeAgo(friend.lastOnline)}`
              : 'Offline'
          }
        </p>
      </div>

      {/* Aktions-Menu */}
      <button className="text-text-muted hover:text-text-primary p-2">
        {'\u2022\u2022\u2022'}
      </button>
    </div>
  )
}
