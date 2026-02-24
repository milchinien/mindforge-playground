import { NavLink, Link } from 'react-router-dom'
import { Home, User, Users, Palette, Backpack, Settings, Calendar, Trophy, ChevronLeft, ChevronRight, Diamond, X, LogIn, Gamepad2, Swords, Rss, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useUIStore } from '../../stores/uiStore'
import MindCoinIcon from '../common/MindCoinIcon'
import AvatarRenderer from '../profile/AvatarRenderer'

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home', public: true },
  { to: '/profile/', icon: User, labelKey: 'nav.profile', needsUsername: true },
  { to: '/events', icon: Calendar, labelKey: 'nav.events', public: true },
  { to: '/leaderboards', icon: BarChart3, labelKey: 'nav.leaderboards', public: true },
  { to: '/quiz', icon: Swords, labelKey: 'nav.quizArena', public: true },
  { to: '/feed', icon: Rss, labelKey: 'nav.activityFeed', public: true },
  { to: '/my-games', icon: Gamepad2, labelKey: 'nav.myGames', premiumOnly: true },
  { to: '/achievements', icon: Trophy, labelKey: 'nav.achievements' },
  { to: '/friends', icon: Users, labelKey: 'nav.friends' },
  { to: '/avatar', icon: Palette, labelKey: 'nav.avatar' },
  { to: '/inventory', icon: Backpack, labelKey: 'nav.inventory' },
  { to: '/shop', icon: (props) => <MindCoinIcon size={28} className="shrink-0" />, labelKey: 'nav.shop' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        aria-label="Sidebar navigation"
        className={`
          fixed top-16 bottom-0 left-0 z-40 bg-bg-secondary border-r border-gray-700
          flex flex-col transition-all duration-200 overflow-hidden
          ${sidebarWidth}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex items-center justify-center h-10 text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile close */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden flex items-center justify-end p-3 text-text-muted hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar Section / Login Prompt */}
        <div className={`px-3 py-3 border-b border-gray-700 mb-2 ${collapsed ? 'flex justify-center' : ''}`}>
          {user ? (
            <NavLink to={`/profile/${user.username}`} onClick={onClose} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <AvatarRenderer
                  skinColor={user.avatar?.skinColor}
                  hairColor={user.avatar?.hairColor}
                  hairStyle={user.avatar?.hairStyle}
                  eyeType={user.avatar?.eyes || user.avatar?.eyeType}
                  eyebrows={user.avatar?.eyebrows}
                  mouth={user.avatar?.mouth}
                  accessory={user.avatar?.accessory}
                  bgStyle={user.avatar?.bgStyle}
                  size={36}
                  username={user.username}
                />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">{user.username}</p>
                  {user.activeTitle && (
                    <p className="text-xs text-accent truncate">{user.activeTitle}</p>
                  )}
                </div>
              )}
            </NavLink>
          ) : (
            <Link to="/login" onClick={onClose} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-bg-card flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-text-muted" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-secondary truncate group-hover:text-accent transition-colors">{t('common.login')}</p>
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2" aria-label="Main menu">
          {navItems.map((item) => {
            // Only hide premium items for logged-in non-premium users
            if (item.premiumOnly && user && !user.isPremium) return null

            // Determine link target: auth-required items → /login when not logged in
            const needsAuth = !item.public && !user
            const to = item.needsUsername
              ? (user ? `/profile/${user.username}` : '/login')
              : needsAuth ? '/login' : item.to
            const Icon = item.icon
            const label = t(item.labelKey)

            if (item.disabled) {
              return (
                <div key={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted opacity-50 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}>
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="text-sm">{label}</span>}
                  {!collapsed && <span className="text-xs ml-auto">{t('common.comingSoon')}</span>}
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                aria-label={collapsed ? label : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-accent/15 text-accent border-l-3 border-accent font-semibold'
                    : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Premium button */}
        {(!user || !user.isPremium) && (
          <div className="px-2 mb-2">
            <NavLink
              to={user ? '/premium' : '/login'}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
            >
              <Diamond className="w-5 h-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="font-medium">{t('nav.getPremium')}</span>}
            </NavLink>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="pb-4" />
      </aside>
    </>
  )
}
