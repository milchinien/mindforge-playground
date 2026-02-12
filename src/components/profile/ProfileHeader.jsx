import { Edit3, Crown, Globe, Twitter } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import AvatarRenderer from './AvatarRenderer'
import FollowButton from './FollowButton'

export default function ProfileHeader({ user, isOwnProfile, onEditClick, onFollowChange, isFollowing, isLoggedIn = false }) {
  const stats = [
    { label: 'Follower', value: user.followers || 0 },
    { label: 'Following', value: user.following || 0 },
    { label: 'Spiele', value: user.gamesCreated || 0 },
    { label: 'Plays', value: user.totalPlays || 0 },
  ]

  const memberSince = () => {
    const date = new Date(user.createdAt)
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="bg-bg-secondary rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
            <AvatarRenderer
              skinColor={user.avatar?.skinColor}
              hairColor={user.avatar?.hairColor}
              hairStyle={user.avatar?.hairStyle}
              eyeType={user.avatar?.eyes || user.avatar?.eyeType}
              eyebrows={user.avatar?.eyebrows}
              mouth={user.avatar?.mouth}
              accessory={user.avatar?.accessory}
              bgStyle={user.avatar?.bgStyle}
              size={128}
              username={user.username}
              animated
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          {/* Username + Title */}
          <h1 className="text-2xl font-bold text-text-primary">{user.username}</h1>
          {user.activeTitle && (
            <span className="inline-block mt-1 text-xs bg-accent/20 text-accent px-2.5 py-0.5 rounded-full font-medium">
              {user.activeTitle}
            </span>
          )}
          {user.isPremium && (
            <span className="inline-block ml-2 mt-1">
              <Crown size={14} className="text-accent inline" />
            </span>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="text-text-secondary mt-2 line-clamp-3 max-w-lg">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4 max-w-sm mx-auto sm:mx-0">
            {stats.map(stat => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-lg font-bold text-text-primary">{formatNumber(stat.value)}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Member since + Social */}
          <div className="flex flex-wrap items-center gap-3 mt-3 justify-center sm:justify-start">
            <p className="text-text-muted text-sm">Mitglied seit {memberSince()}</p>
            {user.socialLinks?.website && (
              <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent">
                <Globe size={14} />
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent">
                <Twitter size={14} />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-center sm:justify-start">
            {isOwnProfile ? (
              <button
                onClick={onEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card hover:bg-bg-hover text-text-secondary rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 size={16} />
                <span>Profil bearbeiten</span>
              </button>
            ) : (
              <FollowButton
                targetUserId={user.uid}
                initialFollowing={isFollowing}
                onFollowChange={onFollowChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
