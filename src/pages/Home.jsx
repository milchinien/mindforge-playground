import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import FeaturedCarousel from '../components/game/FeaturedCarousel'
import GameRow from '../components/game/GameRow'
import FriendsPreview from '../components/home/FriendsPreview'
import DailyLoginBonus from '../components/common/DailyLoginBonus'
import { getFeaturedGames, getGameById, mockGames } from '../data/mockGames'
import { useGameInteractionStore } from '../stores/gameInteractionStore'
import { useSocialStore } from '../stores/socialStore'

const RECENTLY_PLAYED_PREFIX = 'mindforge_recently_played_'
const MAX_RECENT_GAMES = 10

function getRecentlyPlayedKey(userId) {
  return RECENTLY_PLAYED_PREFIX + (userId || 'guest')
}

function getRecentlyPlayedGames(userId) {
  try {
    const stored = localStorage.getItem(getRecentlyPlayedKey(userId))
    if (!stored) return []
    const gameIds = JSON.parse(stored)
    return gameIds.map(id => getGameById(id)).filter(Boolean)
  } catch {
    return []
  }
}

export function addToRecentlyPlayed(gameId, userId) {
  try {
    const key = getRecentlyPlayedKey(userId)
    const stored = localStorage.getItem(key)
    let gameIds = stored ? JSON.parse(stored) : []
    gameIds = gameIds.filter(id => id !== gameId)
    gameIds.unshift(gameId)
    gameIds = gameIds.slice(0, MAX_RECENT_GAMES)
    localStorage.setItem(key, JSON.stringify(gameIds))
  } catch {
    // localStorage not available
  }
}

function getRandomGames(count) {
  const shuffled = [...mockGames].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function HomeGuest() {
  const { t } = useTranslation()
  const featured = getFeaturedGames()
  const globalStats = useGameInteractionStore((s) => s.globalStats)
  const popular = [...mockGames].sort((a, b) => {
    const sA = globalStats[a.id] || { likes: 0 }
    const sB = globalStats[b.id] || { likes: 0 }
    return sB.likes - sA.likes
  }).slice(0, 8)

  return (
    <div className="space-y-5 sm:space-y-8 py-2 sm:py-4">
      <>
        <title>MindForge - {t('home.subtitle')}</title>
        <meta name="description" content={t('home.subtitle')} />
        <meta property="og:title" content="MindForge" />
        <meta property="og:description" content={t('home.subtitle')} />
      </>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 text-center">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">{t('home.welcome')}</h1>
        <p className="text-sm sm:text-lg text-text-secondary mb-4 sm:mb-6 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center">
          <Link
            to="/register"
            className="bg-accent hover:bg-accent-dark active:bg-accent-dark px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            {t('home.registerFree')}
          </Link>
          <Link
            to="/browse"
            className="bg-bg-card hover:bg-bg-hover active:bg-bg-hover px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            {t('home.discoverGames')}
          </Link>
        </div>
      </div>

      <FeaturedCarousel games={featured} />
      <GameRow title={t('home.popularGames')} games={popular} showAllLink="/search?sort=popular" />
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()

  if (!user) {
    return <HomeGuest />
  }

  const recentlyPlayed = getRecentlyPlayedGames(user?.uid)
  const recommended = getRandomGames(8)
  const featured = getFeaturedGames()

  const handleXPGain = (xp) => {
    if (user && updateUser) {
      updateUser({ xp: (user.xp || 0) + xp })
    }
  }

  return (
    <div className="space-y-5 sm:space-y-8 py-2 sm:py-4">
      <>
        <title>MindForge - {t('nav.home')}</title>
        <meta name="description" content={t('home.subtitle')} />
        <meta property="og:title" content="MindForge" />
        <meta property="og:description" content={t('home.subtitle')} />
      </>

      {/* Daily Login Bonus Popup */}
      <DailyLoginBonus onXPGain={handleXPGain} />

      {/* Greeting */}
      <h1 className="text-2xl font-bold">
        <Trans
          i18nKey="home.welcomeBack"
          values={{ username: user.username }}
          components={[<span />, <span className="text-accent" />]}
        />
      </h1>

      {/* Friends Preview */}
      <FriendsPreview />

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <GameRow title={t('home.recentlyPlayed')} games={recentlyPlayed} />
      )}

      {/* Recommended */}
      <GameRow title={t('home.recommended')} games={recommended} showAllLink="/browse" />

      {/* Featured */}
      <FeaturedCarousel games={featured} />
    </div>
  )
}
