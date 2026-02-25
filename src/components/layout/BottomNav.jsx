import { NavLink } from 'react-router-dom'
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useChatStore } from '../../stores/chatStore'

const navItems = [
  { to: '/', icon: Home, label: 'Start', end: true },
  { to: '/browse', icon: Compass, label: 'Entdecken' },
  { to: '/create', icon: PlusCircle, label: 'Erstellen', requireAuth: true, requirePremium: true },
  { to: '/chat', icon: MessageCircle, label: 'Chat', requireAuth: true, showUnread: true },
  { to: '/profile', icon: User, label: 'Profil', needsUsername: true },
]

export default function BottomNav() {
  const { user } = useAuth()
  const unreadCounts = useChatStore((s) => s.unreadCounts)

  // Calculate total unread messages
  const totalUnread = Object.values(unreadCounts || {}).reduce((sum, count) => sum + count, 0)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-secondary border-t border-gray-700"
      role="navigation"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon

          // Determine destination
          let to = item.to
          if (item.needsUsername) {
            to = user ? `/profile/${user.username}` : '/login'
          } else if (item.requireAuth && !user) {
            to = '/login'
          } else if (item.requirePremium && user && !user.isPremium) {
            to = '/premium'
          }

          const hasUnread = item.showUnread && totalUnread > 0

          return (
            <NavLink
              key={item.to}
              to={to}
              end={item.end}
              className={({ isActive }) => `
                bottom-nav-item flex flex-col items-center justify-center
                min-w-[44px] min-h-[44px] px-1 py-1
                transition-colors duration-200 relative
                ${isActive
                  ? 'text-accent'
                  : 'text-text-muted active:text-text-primary'
                }
              `}
              aria-label={item.label}
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'scale-110' : ''
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                    {/* Unread badge dot */}
                    {hasUnread && (
                      <span
                        className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-bg-secondary"
                        aria-label={`${totalUnread} ungelesene Nachrichten`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 leading-tight font-medium transition-colors duration-200 ${
                      isActive ? 'text-accent' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
