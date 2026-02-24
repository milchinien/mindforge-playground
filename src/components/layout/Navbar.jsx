import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Settings, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import AvatarRenderer from '../profile/AvatarRenderer'
import MindCoinIcon from '../common/MindCoinIcon'
import NotificationDropdown from './NotificationDropdown'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary border-b border-gray-700 h-16 flex items-center px-4 gap-4" role="navigation" aria-label="Main navigation">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          aria-label={t('nav.toggleSidebar', 'Toggle sidebar')}
          className="lg:hidden text-text-secondary hover:text-text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="text-xl font-bold text-accent shrink-0">MindForge</Link>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/browse" className="text-text-secondary hover:text-text-primary text-sm transition-colors">{t('nav.mindbrowser')}</Link>
          <Link to="/events" className="text-text-secondary hover:text-text-primary text-sm transition-colors">{t('nav.events')}</Link>
          <Link to="/marketplace" className="text-text-secondary hover:text-text-primary text-sm transition-colors">{t('nav.marketplace')}</Link>
          <Link to={user?.isPremium ? '/create' : user ? '/premium' : '/login'} className="text-text-secondary hover:text-text-primary text-sm transition-colors">{t('nav.create')}</Link>
          <Link to={user?.isPremium ? '/my-games' : user ? '/premium' : '/login'} className="text-text-secondary hover:text-text-primary text-sm transition-colors">{t('nav.myGames')}</Link>
        </div>

        <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-xs" role="search">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              aria-label={t('common.search')}
              className="!pl-9 !py-1.5 !text-sm !bg-bg-card !rounded-full"
            />
          </div>
        </form>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/shop" className="hidden sm:flex items-center gap-1.5 bg-bg-card hover:bg-bg-hover px-3 py-1.5 rounded-lg transition-colors text-sm" aria-label={`${user.mindCoins || 0} MindCoins`}>
              <MindCoinIcon size={20} />
              <span className="font-semibold text-accent">{user.mindCoins || 0}</span>
              <span className="text-text-muted text-xs" aria-hidden="true">{t('common.mc')}</span>
            </Link>
            <NotificationDropdown />
            <Link to={`/profile/${user.username}`} className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label={`${t('nav.profile')}: ${user.username}`}>
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <AvatarRenderer
                  skinColor={user.avatar?.skinColor}
                  hairColor={user.avatar?.hairColor}
                  hairStyle={user.avatar?.hairStyle}
                  eyeType={user.avatar?.eyes || user.avatar?.eyeType}
                  eyebrows={user.avatar?.eyebrows}
                  mouth={user.avatar?.mouth}
                  accessory={user.avatar?.accessory}
                  bgStyle={user.avatar?.bgStyle}
                  size={28}
                  username={user.username}
                />
              </div>
              <span className="text-sm text-text-secondary">{user.username}</span>
            </Link>
            <Link to="/settings" aria-label={t('nav.settings')} className="text-text-secondary hover:text-text-primary">
              <Settings className="w-5 h-5" />
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">{t('common.login')}</Link>
            <Link to="/register" className="text-sm bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-lg transition-colors">
              {t('common.register')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
