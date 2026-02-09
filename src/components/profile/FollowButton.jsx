import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function FollowButton({ targetUserId, initialFollowing = false, onFollowChange }) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Not logged in or own profile: don't render
  if (!user || user.uid === targetUserId) return null

  const handleClick = async () => {
    if (isLoading) return
    setIsLoading(true)

    // MVP: simulate async operation
    await new Promise(r => setTimeout(r, 300))

    const newState = !isFollowing
    setIsFollowing(newState)
    onFollowChange?.(newState)
    setIsLoading(false)
  }

  const getStyle = () => {
    if (isLoading) return 'bg-bg-hover text-text-muted opacity-50 cursor-not-allowed'
    if (isFollowing && isHovering) return 'bg-error/20 text-error border border-error/30'
    if (isFollowing) return 'bg-bg-hover text-text-primary border border-gray-600'
    return 'bg-accent hover:bg-accent-dark text-white'
  }

  const getText = () => {
    if (isLoading) return '...'
    if (isFollowing && isHovering) return 'Entfolgen'
    if (isFollowing) return 'Folgst du \u2713'
    return 'Folgen'
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all min-w-[120px] cursor-pointer ${getStyle()}`}
    >
      {getText()}
    </button>
  )
}
