import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Home, User, Users, Palette, Backpack, Trophy, ChevronLeft, ChevronRight, ChevronDown, Diamond, X, Star, PinOff, MessageCircle, Shield, Scroll, Gift } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useUIStore } from '../../stores/uiStore'
import MindCoinIcon from '../common/MindCoinIcon'
import AvatarRenderer from '../profile/AvatarRenderer'

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home', public: true },
  { to: '/quests', icon: Scroll, labelKey: 'Quests', public: true, children: [
    { to: '/achievements', icon: Trophy, labelKey: 'nav.achievements' },
    { to: '/seasons', icon: Shield, labelKey: 'Seasons', public: true },
  ]},
  { to: '/chat', icon: MessageCircle, labelKey: 'Chat' },
  { to: '/groups', icon: Users, labelKey: 'Gruppen' },
  { to: '/friends', icon: Users, labelKey: 'nav.friends' },
  { to: '/avatar', icon: Palette, labelKey: 'nav.avatar' },
  { to: '/inventory', icon: Backpack, labelKey: 'nav.inventory' },
  { to: '/shop', icon: (props) => <MindCoinIcon size={28} className="shrink-0" />, labelKey: 'nav.shop', children: [
    { to: '/gift', icon: Gift, labelKey: 'Verschenken' },
  ]},
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const favorites = useUIStore((s) => s.favorites)
  const removeFavorite = useUIStore((s) => s.removeFavorite)

  // Track which parent items are expanded
  const [expandedItems, setExpandedItems] = useState(() => {
    // Auto-expand parents whose child is the current route
    const initial = new Set()
    for (const item of navItems) {
      if (item.children?.some((child) => location.pathname === child.to)) {
        initial.add(item.to)
      }
    }
    return initial
  })

  const toggleExpand = (path) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const isChildActive = (item) =>
    item.children?.some((child) => location.pathname === child.to)

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  const renderNavItem = (item, isChild = false) => {
    const needsAuth = !item.public && !user
    const to = needsAuth ? '/login' : item.to
    const Icon = item.icon
    const label = item.labelKey.includes('.') ? t(item.labelKey) : item.labelKey
    const hasChildren = item.children?.length > 0
    const isExpanded = expandedItems.has(item.to)
    const childActive = isChildActive(item)

    return (
      <div key={item.to}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <NavLink
            to={to}
            end={to === '/'}
            onClick={onClose}
            aria-label={collapsed ? label : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 ${isChild ? 'pl-10 pr-3 py-2' : 'px-3 py-2.5'} rounded-lg transition-colors ${isChild ? 'text-xs' : 'text-sm'}
              ${collapsed ? 'justify-center flex-1' : 'flex-1'}
              ${isActive || (!isChild && childActive)
                ? 'bg-accent/15 text-accent border-l-3 border-accent font-semibold'
                : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'}
            `}
          >
            <Icon className={`${isChild ? 'w-4 h-4' : 'w-5 h-5'} shrink-0`} aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
            {!collapsed && hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleExpand(item.to)
                }}
                className="ml-auto p-0.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
              </button>
            )}
          </NavLink>
        </div>

        {/* Sub-items */}
        {hasChildren && !collapsed && (
          <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            {item.children.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    )
  }

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
          flex flex-col transition-all duration-200 overflow-y-auto overflow-x-hidden
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

        {/* Favorites Section */}
        {!collapsed && favorites.length > 0 && (
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Favoriten
            </p>
            <div className="space-y-0.5">
              {favorites.map((fav) => (
                <div key={fav.path} className="flex items-center group">
                  <NavLink
                    to={fav.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex-1 text-xs px-2 py-1.5 rounded transition-colors truncate
                      ${isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'}
                    `}
                  >
                    {fav.label}
                  </NavLink>
                  <button
                    onClick={() => removeFavorite(fav.path)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-red-400 transition-all"
                    aria-label={`Remove ${fav.label} from favorites`}
                  >
                    <PinOff className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2" aria-label="Main menu">
          {navItems.map((item) => renderNavItem(item))}
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
