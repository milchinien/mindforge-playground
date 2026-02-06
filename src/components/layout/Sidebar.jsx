import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, User, Users, Palette, Backpack, UsersRound, Calendar, ChevronLeft, ChevronRight, Diamond, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/profile/', icon: User, label: 'Profil', needsUsername: true },
  { to: '/friends', icon: Users, label: 'Friends' },
  { to: '/avatar', icon: Palette, label: 'Avatar' },
  { to: '/inventory', icon: Backpack, label: 'Inventory' },
  { to: '/groups', icon: UsersRound, label: 'Groups', disabled: true },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed)
  }, [collapsed])

  if (!user) return null

  const sidebarWidth = collapsed ? 'w-16' : 'w-60'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 bg-bg-secondary border-r border-gray-700
        flex flex-col transition-all duration-200 overflow-hidden
        ${sidebarWidth}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-10 text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile close */}
        <button onClick={onClose} className="lg:hidden flex items-center justify-end p-3 text-text-muted hover:text-text-primary">
          <X className="w-5 h-5" />
        </button>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const to = item.needsUsername ? `/profile/${user.username}` : item.to
            const Icon = item.icon

            if (item.disabled) {
              return (
                <div key={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted opacity-50 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                  {!collapsed && <span className="text-xs ml-auto">Soon</span>}
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive ? 'bg-bg-card text-accent' : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Premium button */}
        {!user.isPremium && (
          <div className="px-2 mb-2">
            <NavLink
              to="/premium"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
            >
              <Diamond className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">Get Premium</span>}
            </NavLink>
          </div>
        )}

        {/* Events */}
        <div className="px-2 pb-4 border-t border-gray-700 pt-2">
          <NavLink
            to="/events"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
              ${collapsed ? 'justify-center' : ''}
              ${isActive ? 'bg-bg-card text-accent' : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'}
            `}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Events</span>}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
