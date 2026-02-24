import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import FeaturedCarousel from '../components/game/FeaturedCarousel'
import GameRow from '../components/game/GameRow'
import {
  getFeaturedGames,
  getTrendingGames,
  getPopularGames,
  getNewGames,
  getGamesBySubject,
  getAllSubjects
} from '../data/mockGames'

export default function Mindbrowser() {
  const { t } = useTranslation()
  const featured = getFeaturedGames()
  const trending = getTrendingGames()
  const popular = getPopularGames()
  const newGames = getNewGames()
  const subjects = getAllSubjects()

  return (
    <div className="py-4">
      <Helmet>
        <title>Mindbrowser | MindForge</title>
        <meta name="description" content="Browse and discover learning games on MindForge." />
        <meta property="og:title" content="Mindbrowser | MindForge" />
        <meta property="og:description" content="Browse and discover learning games on MindForge." />
      </Helmet>

      <FeaturedCarousel games={featured} />

      <GameRow title={t('mindbrowser.trending')} games={trending} showAllLink="/search?sort=trending" />
      <GameRow title={t('mindbrowser.popular')} games={popular} showAllLink="/search?sort=popular" />
      <GameRow title={t('mindbrowser.new')} games={newGames} showAllLink="/search?sort=new" />

      {subjects.map(subject => (
        <GameRow
          key={subject}
          title={t(`mindbrowser.subjects.${subject}`, { defaultValue: subject })}
          games={getGamesBySubject(subject)}
          showAllLink={`/search?tag=${subject}`}
        />
      ))}
    </div>
  )
}
