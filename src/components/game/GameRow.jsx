import { Link } from 'react-router-dom'
import GameCard from './GameCard'

export default function GameRow({ title, games, showAllLink }) {
  if (!games || games.length === 0) return null

  return (
    <div className="mb-5 sm:mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-base sm:text-xl font-bold text-text-primary">{title}</h2>
        {showAllLink && (
          <Link
            to={showAllLink}
            className="text-xs sm:text-sm text-accent hover:text-accent-light transition-colors"
          >
            Alle anzeigen &rarr;
          </Link>
        )}
      </div>

      {/* Scrollable Cards */}
      <div className="flex gap-2.5 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
