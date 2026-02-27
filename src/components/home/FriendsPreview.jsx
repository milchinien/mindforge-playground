import { Link } from 'react-router-dom'
import AvatarRenderer from '../profile/AvatarRenderer'
import { useSocialStore } from '../../stores/socialStore'

export default function FriendsPreview({ maxDisplay = 5 }) {
  const friends = useSocialStore((s) => s.friends)
  // Online friends first, then offline
  const sorted = [...friends].sort((a, b) => b.isOnline - a.isOnline)
  const visible = sorted.slice(0, maxDisplay)
  const remaining = friends.length - maxDisplay
  const onlineCount = friends.filter(f => f.isOnline).length

  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text-primary">Freunde</h3>
        <Link
          to="/friends"
          className="text-sm text-accent hover:text-accent-light transition-colors"
        >
          Alle anzeigen
        </Link>
      </div>

      {/* Friend List */}
      <div className="flex flex-wrap gap-3">
        {visible.map(friend => (
          <Link
            key={friend.id}
            to={`/profile/${friend.username}`}
            className="flex items-center gap-2 hover:bg-bg-hover rounded-lg px-2 py-1.5 transition-colors"
          >
            {/* Avatar with Online Indicator */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <AvatarRenderer
                  skinColor={friend.avatar?.skinColor}
                  hairColor={friend.avatar?.hairColor}
                  hairStyle={friend.avatar?.hairStyle}
                  eyeType={friend.avatar?.eyes || friend.avatar?.eyeType}
                  eyebrows={friend.avatar?.eyebrows}
                  mouth={friend.avatar?.mouth}
                  accessory={friend.avatar?.accessory}
                  bgStyle={friend.avatar?.bgStyle}
                  size={40}
                  username={friend.username}
                />
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-secondary ${
                  friend.isOnline ? 'bg-success' : 'bg-text-muted'
                }`}
              />
            </div>
            <span className="text-sm text-text-secondary">{friend.username}</span>
          </Link>
        ))}
        {remaining > 0 && (
          <div className="flex items-center px-2 text-sm text-text-muted">
            +{remaining} weitere
          </div>
        )}
      </div>

      {/* Online Counter */}
      <p className="text-xs text-text-muted mt-3">
        {onlineCount} {onlineCount === 1 ? 'Freund' : 'Freunde'} online
      </p>
    </div>
  )
}
