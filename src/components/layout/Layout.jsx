import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

export default function Layout({ children }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const collapsed = localStorage.getItem('sidebar-collapsed') === 'true'

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 mt-0 p-6 transition-all duration-200 ${
          user ? (collapsed ? 'lg:ml-16' : 'lg:ml-60') : ''
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}
