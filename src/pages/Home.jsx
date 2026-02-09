import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import FeaturedCarousel from '../components/game/FeaturedCarousel'
import GameRow from '../components/game/GameRow'
import FriendsPreview from '../components/home/FriendsPreview'
import { getFeaturedGames, getPopularGames, getGameById, mockGames } from '../data/mockGames'
import { mockFriends } from '../data/mockFriends'

const RECENTLY_PLAYED_KEY = 'mindforge_recently_played'
const MAX_RECENT_GAMES = 10

function getRecentlyPlayedGames() {
  try {
    const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
    if (!stored) return []
    const gameIds = JSON.parse(stored)
    return gameIds.map(id => getGameById(id)).filter(Boolean)
  } catch {
    return []
  }
}

export function addToRecentlyPlayed(gameId) {
  try {
    const stored = localStorage.getItem(RECENTLY_PLAYED_KEY)
    let gameIds = stored ? JSON.parse(stored) : []
    gameIds = gameIds.filter(id => id !== gameId)
    gameIds.unshift(gameId)
    gameIds = gameIds.slice(0, MAX_RECENT_GAMES)
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(gameIds))
  } catch {
    // localStorage not available
  }
}

function getRandomGames(count) {
  const shuffled = [...mockGames].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function HomeGuest() {
  const featured = getFeaturedGames()
  const popular = getPopularGames()

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 sm:p-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Willkommen bei MindForge!</h1>
        <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
          Entdecke tausende Lernspiele oder erstelle deine eigenen!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            to="/browse"
            className="bg-bg-card hover:bg-bg-hover px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Spiele entdecken
          </Link>
        </div>
      </div>

      <FeaturedCarousel games={featured} />
      <GameRow title="Beliebte Spiele" games={popular} showAllLink="/search?sort=popular" />
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  if (!user) {
    return <HomeGuest />
  }

  const recentlyPlayed = getRecentlyPlayedGames()
  const recommended = getRandomGames(8)
  const featured = getFeaturedGames()

  return (
    <div className="space-y-8 py-4">
      {/* Greeting */}
      <h1 className="text-2xl font-bold">
        Willkommen zurueck, <span className="text-accent">{user.username}</span>!
      </h1>

      {/* Friends Preview */}
      <FriendsPreview friends={mockFriends} />

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <GameRow title="Zuletzt gespielt" games={recentlyPlayed} />
      )}

      {/* Recommended */}
      <GameRow title="Empfohlen fuer dich" games={recommended} showAllLink="/browse" />

      {/* Featured */}
      <FeaturedCarousel games={featured} />
    </div>
  )
}
