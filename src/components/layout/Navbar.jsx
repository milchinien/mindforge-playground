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
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label={t('nav.toggleSidebar', 'Toggle sidebar')}
          className="lg:hidden flex items-center justify-center text-text-secondary hover:text-text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="shrink-0 flex items-center h-8 group lg:w-40" aria-label="MindForge Home">
          <span
            className="text-[26px] font-black tracking-tight text-accent leading-none"
            style={{
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              textShadow: '0 0 6px rgba(249, 115, 22, 0.2)',
            }}
          >
            M
          </span>
          <span className="text-2xl font-black tracking-tight text-accent" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            ind
          </span>
          <svg
            viewBox="0 0 48 34"
            className="w-[30px] h-[22px] mx-[-1px] self-center"
            aria-hidden="true"
            style={{ color: 'var(--color-accent)' }}
          >
            {/* Outline anvil matching reference image */}
            <path
              d="
                M2 9
                C5 5, 9 3, 14 3
                Q14 1, 17 1
                L40 1 Q44 1, 44 4
                L44 10 Q44 13, 41 13
                L31 13
                C29 13, 27 16, 26 20
                L25 25
                L35 25 Q41 25, 41 28
                L41 31 Q41 34, 38 34
                L10 34 Q7 34, 7 31
                L7 28 Q7 25, 13 25
                L19 25
                L18 20
                C17 16, 16 13, 14 13
                C9 13, 5 12, 2 9
                Z
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-2xl font-black tracking-tight text-accent" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            orge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
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
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile search icon */}
        <Link
          to="/search"
          className="sm:hidden flex items-center justify-center text-text-secondary hover:text-text-primary"
          aria-label={t('common.search')}
        >
          <Search className="w-5 h-5" />
        </Link>

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
            <Link to="/settings" aria-label={t('nav.settings')} className="flex items-center justify-center text-text-secondary hover:text-text-primary">
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
