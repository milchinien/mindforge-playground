import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Breadcrumbs from './Breadcrumbs'
import BottomNav from './BottomNav'
import ChatOverlay from '../chat/ChatOverlay'
import OfflineBanner from '../common/OfflineBanner'
import { useAuth } from '../../contexts/AuthContext'
import { useUIStore } from '../../stores/uiStore'

const pageTitleKeys = {
  '/': 'nav.home',
  '/browse': 'nav.mindbrowser',
  '/marketplace': 'nav.marketplace',
  '/events': 'nav.events',
  '/search': 'nav.search',
  '/settings': 'nav.settings',
  '/friends': 'nav.friends',
  '/avatar': 'nav.avatar',
  '/inventory': 'nav.inventory',
  '/achievements': 'nav.achievements',
  '/shop': 'nav.shop',
  '/create': 'nav.create',
  '/premium': 'Premium',
  '/teacher': 'nav.teacherDashboard',
  '/seasons': 'Seasons',
  '/quests': 'Quests',
  // '/chat' - eigene Layout-Steuerung in Chat.jsx
  '/groups': 'Gruppen',
}

export default function Layout({ children }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const addRecentPage = useUIStore((s) => s.addRecentPage)

  // Track recently visited pages
  useEffect(() => {
    const pathBase = '/' + (location.pathname.split('/')[1] || '')
    const titleKey = pageTitleKeys[location.pathname] || pageTitleKeys[pathBase]
    if (titleKey && location.pathname !== '/') {
      const label = titleKey.includes('.') ? t(titleKey) : titleKey
      addRecentPage({ path: location.pathname, label })
    }
  }, [location.pathname, t, addRecentPage])

  // Determine page title from current path
  const pathBase = '/' + (location.pathname.split('/')[1] || '')
  const titleKey = pageTitleKeys[location.pathname] || pageTitleKeys[pathBase]
  const pageTitle = titleKey ? (titleKey.includes('.') ? t(titleKey) : titleKey) : null

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Skip to content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <OfflineBanner />
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className={`flex-1 mt-16 p-6 pb-24 md:pb-6 transition-all duration-200 min-w-0 overflow-x-hidden ${
            collapsed ? 'lg:ml-16' : 'lg:ml-60'
          }`}
        >
          <Breadcrumbs />
          {pageTitle && (
            <h1 className="text-2xl font-bold text-text-primary mb-6 uppercase tracking-wide">{pageTitle}</h1>
          )}
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Floating Chat Widget - nicht auf der Chat-Seite anzeigen */}
      {location.pathname !== '/chat' && <ChatOverlay />}
    </div>
  )
}
