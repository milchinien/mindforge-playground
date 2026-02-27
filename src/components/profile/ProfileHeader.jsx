import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit3, Crown, Globe, Twitter, ChevronDown, Lock, Check } from 'lucide-react'
import ShareButtons from '../common/ShareButtons'
import { formatNumber } from '../../utils/formatters'
import AvatarRenderer from './AvatarRenderer'
import { useSocialStore } from '../../stores/socialStore'
import { useInventoryStore } from '../../stores/inventoryStore'

function TitleDropdown({ activeTitle, onSelect, onClose, t }) {
  const items = useInventoryStore((s) => s.items)
  const titleItems = useMemo(() => items.filter((i) => i.type === 'title'), [items])

  const unlockedTitles = titleItems.map((item) => ({
    title: item.name,
    icon: item.source === 'achievement' ? '\uD83C\uDFC6' : item.source === 'shop' ? '\uD83D\uDED2' : '\u2B50',
    source: item.description || item.source,
    id: item.id,
  }))

  const lockedTitles = [] // All titles the user has are unlocked by definition

  return (
    <div className="absolute top-full left-0 sm:left-auto sm:right-auto mt-2 w-[300px] bg-bg-secondary border border-gray-700 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/50 bg-gradient-to-r from-accent/10 to-transparent">
        <p className="text-sm font-semibold text-text-primary">{t('profile.titleSelect')}</p>
        <p className="text-xs text-text-muted">{t('profile.unlockedCount', { count: unlockedTitles.length, total: unlockedTitles.length + lockedTitles.length })}</p>
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
            {t('profile.noTitleOption')}
          </span>
          {!activeTitle && <Check size={14} className="text-accent ml-auto" />}
        </button>

        {/* Unlocked titles */}
        {unlockedTitles.length > 0 && (
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">{t('profile.unlocked')}</p>
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
              <Lock size={10} /> {t('profile.notUnlockedYet')}
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

function FollowButtonStore({ targetUserId, isLoggedIn }) {
  const isFollowing = useSocialStore((s) => s.following.includes(targetUserId))
  const { followUser, unfollowUser } = useSocialStore()
  const [isHovering, setIsHovering] = useState(false)

  if (!isLoggedIn) return null

  const handleClick = () => {
    if (isFollowing) {
      unfollowUser(targetUserId)
    } else {
      followUser(targetUserId)
    }
  }

  const getStyle = () => {
    if (isFollowing && isHovering) return 'bg-error/20 text-error border border-error/30'
    if (isFollowing) return 'bg-bg-hover text-text-primary border border-gray-600'
    return 'bg-accent hover:bg-accent-dark text-white'
  }

  const getText = () => {
    if (isFollowing && isHovering) return 'Entfolgen'
    if (isFollowing) return 'Folgst du \u2713'
    return 'Folgen'
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all min-w-[120px] cursor-pointer ${getStyle()}`}
    >
      {getText()}
    </button>
  )
}

export default function ProfileHeader({ user, isOwnProfile, onEditClick, isLoggedIn = false, onTitleChange }) {
  const { t } = useTranslation()
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
    { label: t('profile.follower'), value: user.followers || 0 },
    { label: t('profile.following'), value: user.following || 0 },
    { label: t('profile.games'), value: user.gamesCreated || 0 },
    { label: t('common.plays'), value: user.totalPlays || 0 },
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
                  {user.activeTitle || t('profile.selectTitle')}
                  <ChevronDown size={12} className={`transition-transform ${titleOpen ? 'rotate-180' : ''}`} />
                </button>
                {titleOpen && (
                  <TitleDropdown
                    activeTitle={user.activeTitle}
                    onSelect={onTitleChange}
                    onClose={() => setTitleOpen(false)}
                    t={t}
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
            <p className="text-text-muted text-sm">{t('profile.memberSince', { date: memberSince() })}</p>
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
          <div className="mt-4 flex items-center gap-3 justify-center sm:justify-start">
            {isOwnProfile ? (
              <button
                onClick={onEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card hover:bg-bg-hover text-text-secondary rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 size={16} />
                <span>{t('profile.editProfile')}</span>
              </button>
            ) : (
              <FollowButtonStore targetUserId={user.uid} isLoggedIn={isLoggedIn} />
            )}
            <ShareButtons title={`${user.username} auf MindForge`} compact />
          </div>
        </div>
      </div>
    </div>
  )
}
