import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Settings, Coins, Menu } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AvatarRenderer from '../profile/AvatarRenderer'
import NotificationDropdown from './NotificationDropdown'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary border-b border-gray-700 h-16 flex items-center px-4 gap-4">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onToggleSidebar} className="lg:hidden text-text-secondary hover:text-text-primary">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="text-xl font-bold text-accent shrink-0">MindForge</Link>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/browse" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Mindbrowser</Link>
          <Link to="/events" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Events</Link>
          <Link to="/marketplace" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Marketplace</Link>
          {user?.isPremium && (
            <Link to="/create" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Create</Link>
          )}
        </div>

        <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Spiele suchen..."
              className="!pl-9 !py-1.5 !text-sm !bg-bg-card !rounded-full"
            />
          </div>
        </form>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 bg-bg-card hover:bg-bg-hover px-3 py-1.5 rounded-lg transition-colors text-sm">
              <Coins className="w-4 h-4 text-accent" />
              <span className="font-semibold text-accent">{user.mindCoins || 0}</span>
              <span className="text-text-muted text-xs">MC</span>
            </Link>
            <NotificationDropdown />
            <Link to={`/profile/${user.username}`} className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <AvatarRenderer
                  skinColor={user.avatar?.skinColor}
                  hairColor={user.avatar?.hairColor}
                  hairStyle={user.avatar?.hairStyle}
                  eyeType={user.avatar?.eyes || user.avatar?.eyeType}
                  size={28}
                  username={user.username}
                />
              </div>
              <span className="text-sm text-text-secondary">{user.username}</span>
            </Link>
            <Link to="/settings" className="text-text-secondary hover:text-text-primary">
              <Settings className="w-5 h-5" />
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">Login</Link>
            <Link to="/register" className="text-sm bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-lg transition-colors">
              Registrieren
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
