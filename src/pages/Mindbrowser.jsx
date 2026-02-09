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

const subjectNames = {
  mathematik: 'Mathematik',
  physik: 'Physik',
  chemie: 'Chemie',
  biologie: 'Biologie',
  deutsch: 'Deutsch',
  englisch: 'Englisch',
  geschichte: 'Geschichte',
  geographie: 'Geographie',
  informatik: 'Informatik',
  kunst: 'Kunst',
  musik: 'Musik'
}

export default function Mindbrowser() {
  const featured = getFeaturedGames()
  const trending = getTrendingGames()
  const popular = getPopularGames()
  const newGames = getNewGames()
  const subjects = getAllSubjects()

  return (
    <div className="py-4">
      <FeaturedCarousel games={featured} />

      <GameRow title="Trending" games={trending} showAllLink="/search?sort=trending" />
      <GameRow title="Beliebt" games={popular} showAllLink="/search?sort=popular" />
      <GameRow title="Neu" games={newGames} showAllLink="/search?sort=new" />

      {subjects.map(subject => (
        <GameRow
          key={subject}
          title={subjectNames[subject] || subject}
          games={getGamesBySubject(subject)}
          showAllLink={`/search?tag=${subject}`}
        />
      ))}
    </div>
  )
}
