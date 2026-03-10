import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const routeLabels = {
  browse: 'nav.mindbrowser',
  marketplace: 'nav.marketplace',
  events: 'nav.events',
  leaderboards: 'nav.leaderboards',
  quiz: 'nav.quizArena',
  feed: 'nav.activityFeed',
  search: 'nav.search',
  settings: 'nav.settings',
  friends: 'nav.friends',
  avatar: 'nav.avatar',
  inventory: 'nav.inventory',
  achievements: 'nav.achievements',
  shop: 'nav.shop',
  create: 'nav.create',
  premium: 'Premium',
  teacher: 'nav.teacherDashboard',
  profile: 'nav.profile',
  game: 'Game',
  'my-games': 'nav.myGames',
  seasons: 'Seasons',
  quests: 'Quests',
  chat: 'Chat',
  groups: 'Gruppen',
}

// Pages that handle their own full-bleed layout and don't need breadcrumbs
const hiddenOnRoutes = ['/chat']

export default function Breadcrumbs() {
  const location = useLocation()
  const { t } = useTranslation()

  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Don't show breadcrumbs on home page or full-bleed pages
  if (pathSegments.length === 0) return null
  if (hiddenOnRoutes.includes(location.pathname)) return null

  const crumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const labelKey = routeLabels[segment]
    let label = labelKey
      ? (labelKey.includes('.') ? t(labelKey) : labelKey)
      : decodeURIComponent(segment)

    // Capitalize first letter for dynamic segments
    if (!labelKey) {
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }

    const isLast = index === pathSegments.length - 1

    return { path, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-4 overflow-x-auto">
      <Link
        to="/"
        className="flex items-center gap-1 text-text-muted hover:text-accent transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1.5 min-w-0">
          <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
          {crumb.isLast ? (
            <span className="text-text-primary font-medium truncate">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-text-muted hover:text-accent transition-colors truncate"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
