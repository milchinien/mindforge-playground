import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

const pageTitles = {
  '/': 'Home',
  '/browse': 'Mindbrowser',
  '/marketplace': 'Marketplace',
  '/events': 'Events',
  '/search': 'Suche',
  '/settings': 'Settings',
  '/friends': 'Friends',
  '/avatar': 'Avatar',
  '/inventory': 'Inventory',
  '/achievements': 'Achievements',
  '/shop': 'Shop',
  '/create': 'Create',
  '/premium': 'Premium',
  '/teacher': 'Teacher Dashboard',
}

export default function Layout({ children }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const collapsed = localStorage.getItem('sidebar-collapsed') === 'true'

  // Determine page title from current path
  const pathBase = '/' + (location.pathname.split('/')[1] || '')
  const pageTitle = pageTitles[location.pathname] || pageTitles[pathBase]

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 mt-16 p-6 transition-all duration-200 min-w-0 overflow-x-hidden ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}>
          {pageTitle && (
            <h1 className="text-2xl font-bold text-text-primary mb-6 uppercase tracking-wide">{pageTitle}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
