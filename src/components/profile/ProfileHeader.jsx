import { useState, useRef, useEffect } from 'react'
import { Edit3, Crown, Globe, Twitter, ChevronDown, Lock, Check } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import { ALL_ACHIEVEMENTS, MOCK_USER_PROGRESS } from '../../data/achievementDefinitions'
import AvatarRenderer from './AvatarRenderer'
import FollowButton from './FollowButton'

const SHOP_TITLE_OFFERS = [
  { title: 'Schneekoenig', icon: '\u2744\uFE0F', source: 'Winter-Paket', hint: 'Winter-Paket im Shop kaufen' },
  { title: 'Amors Liebling', icon: '\u2764\uFE0F', source: 'Valentins-Paket', hint: 'Valentins-Paket im Shop kaufen' },
]

function isAchievementUnlocked(achievement, progress) {
  const req = achievement.requirement
  switch (req.type) {
    case 'games_played': return (progress.games_played || 0) >= req.value
    case 'games_completed': return (progress.games_completed || 0) >= req.value
    case 'daily_streak': return (progress.daily_streak || 0) >= req.value
    case 'likes_given': return (progress.likes_given || 0) >= req.value
    case 'total_playtime_minutes': return (progress.total_playtime_minutes || 0) >= req.value
    case 'following_count': return (progress.following_count || 0) >= req.value
    case 'followers_count': return (progress.followers_count || 0) >= req.value
    case 'friends_count': return (progress.friends_count || 0) >= req.value
    case 'avatar_customized': return (progress.avatar_customized || 0) >= req.value
    case 'profile_complete': return (progress.profile_complete || 0) >= req.value
    case 'events_participated': return (progress.events_participated || 0) >= req.value
    case 'events_completed': return (progress.events_completed || 0) >= req.value
    case 'games_created': return (progress.games_created || 0) >= req.value
    case 'total_likes_received': return (progress.total_likes_received || 0) >= req.value
    case 'total_plays_received': return (progress.total_plays_received || 0) >= req.value
    case 'assets_sold': return (progress.assets_sold || 0) >= req.value
    case 'is_premium': return (progress.is_premium || 0) >= req.value
    case 'game_approval_rate': return (progress.game_approval_rate || 0) >= req.value
    case 'category_games_completed': {
      const cat = progress.category_games_completed || {}
      return (cat[req.category] || 0) >= req.value
    }
    case 'category_perfect_scores': {
      const cat = progress.category_perfect_scores || {}
      return (cat[req.category] || 0) >= req.value
    }
    default: return false
  }
}

function TitleDropdown({ user, activeTitle, onSelect, onClose }) {
  const progress = MOCK_USER_PROGRESS

  const achievementTitles = ALL_ACHIEVEMENTS
    .filter(a => a.reward.type === 'title')
    .map(a => ({
      title: a.reward.value,
      icon: a.icon,
      source: a.name,
      unlocked: isAchievementUnlocked(a, progress),
      hint: a.description,
    }))

  const ownedShopTitleNames = (user.shopTitles || []).map(t => t.title)
  const shopTitles = SHOP_TITLE_OFFERS.map(t => ({
    ...t,
    unlocked: ownedShopTitleNames.includes(t.title),
  }))

  const unlockedTitles = [
    ...achievementTitles.filter(t => t.unlocked),
    ...shopTitles.filter(t => t.unlocked),
  ]
  const lockedTitles = [
    ...achievementTitles.filter(t => !t.unlocked),
    ...shopTitles.filter(t => !t.unlocked),
  ]

  return (
    <div className="absolute top-full left-0 sm:left-auto sm:right-auto mt-2 w-[300px] bg-bg-secondary border border-gray-700 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/50 bg-gradient-to-r from-accent/10 to-transparent">
        <p className="text-sm font-semibold text-text-primary">Titel auswaehlen</p>
        <p className="text-xs text-text-muted">{unlockedTitles.length} freigeschaltet / {unlockedTitles.length + lockedTitles.length} gesamt</p>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {/* No title option */}
        <button
          onClick={() => { onSelect(null); onClose() }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer
            ${!activeTitle ? 'bg-accent/10' : 'hover:bg-bg-hover'}`}
        >
          <span className="w-8 h-8 rounded-lg bg-bg-card border border-gray-700 flex items-center justify-center text-text-muted text-sm">
            &#10005;
          </span>
          <span className={`text-sm font-medium ${!activeTitle ? 'text-accent' : 'text-text-secondary'}`}>
            Kein Titel
          </span>
          {!activeTitle && <Check size={14} className="text-accent ml-auto" />}
        </button>

        {/* Unlocked titles */}
        {unlockedTitles.length > 0 && (
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Freigeschaltet</p>
          </div>
        )}
        {unlockedTitles.map(({ title, icon, source }) => (
          <button
            key={title}
            onClick={() => { onSelect(title); onClose() }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer
              ${activeTitle === title ? 'bg-accent/10' : 'hover:bg-bg-hover'}`}
          >
            <span className="w-8 h-8 rounded-lg bg-bg-card border border-gray-700 flex items-center justify-center text-lg">
              {icon}
            </span>
            <span className="flex-1 text-left">
              <span className={`text-sm font-medium block ${activeTitle === title ? 'text-accent' : 'text-text-primary'}`}>
                {title}
              </span>
              <span className="text-[11px] text-text-muted">{source}</span>
            </span>
            {activeTitle === title && <Check size={14} className="text-accent flex-shrink-0" />}
          </button>
        ))}

        {/* Locked titles */}
        {lockedTitles.length > 0 && (
          <div className="px-3 pt-4 pb-1 border-t border-gray-700/30 mt-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1 flex items-center gap-1">
              <Lock size={10} /> Noch nicht freigeschaltet
            </p>
          </div>
        )}
        {lockedTitles.map(({ title, icon, hint }) => (
          <div
            key={title}
            className="w-full flex items-center gap-3 px-4 py-2.5 opacity-40 cursor-not-allowed"
          >
            <span className="w-8 h-8 rounded-lg bg-bg-card border border-gray-700 flex items-center justify-center text-lg grayscale">
              {icon}
            </span>
            <span className="flex-1 text-left">
              <span className="text-sm font-medium text-text-muted block">{title}</span>
              <span className="text-[11px] text-text-muted">{hint}</span>
            </span>
            <Lock size={12} className="text-text-muted flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfileHeader({ user, isOwnProfile, onEditClick, onFollowChange, isFollowing, isLoggedIn = false, onTitleChange }) {
  const [titleOpen, setTitleOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setTitleOpen(false)
    }
    if (titleOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [titleOpen])

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
          <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
            {isOwnProfile && onTitleChange ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setTitleOpen(!titleOpen)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer
                    ${user.activeTitle
                      ? 'bg-accent/20 text-accent hover:bg-accent/30'
                      : 'bg-bg-card border border-gray-700 text-text-muted hover:border-accent/50 hover:text-text-secondary'
                    }`}
                >
                  {user.activeTitle || 'Titel waehlen'}
                  <ChevronDown size={12} className={`transition-transform ${titleOpen ? 'rotate-180' : ''}`} />
                </button>
                {titleOpen && (
                  <TitleDropdown
                    user={user}
                    activeTitle={user.activeTitle}
                    onSelect={onTitleChange}
                    onClose={() => setTitleOpen(false)}
                  />
                )}
              </div>
            ) : (
              user.activeTitle && (
                <span className="text-xs bg-accent/20 text-accent px-2.5 py-0.5 rounded-full font-medium">
                  {user.activeTitle}
                </span>
              )
            )}
            {user.isPremium && (
              <Crown size={14} className="text-accent" />
            )}
          </div>

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
