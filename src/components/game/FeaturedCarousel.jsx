import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getSubjectConfig } from '../../data/subjectConfig'

export default function FeaturedCarousel({ games }) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % games.length)
  }, [games.length])

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + games.length) % games.length)
  }, [games.length])

  useEffect(() => {
    if (isPaused || games.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next, games.length])

  if (!games || games.length === 0) return null

  const game = games[current]
  const config = getSubjectConfig(game.subject)
  const gradient = config.gradientDark

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-8 h-[250px] sm:h-[350px] lg:h-[400px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-500`} />

      {/* Thumbnail overlay if available */}
      {game.thumbnail && (
        <img
          src={game.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}

      {/* Subject icon decoration */}
      {!game.thumbnail && (
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <span className="absolute top-8 right-12 text-[120px] sm:text-[180px]">{config.icon}</span>
          <span className="absolute bottom-4 left-8 text-[80px] rotate-[-15deg]">{config.icon}</span>
        </div>
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          {game.title}
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-xl line-clamp-2 mb-4">
          {game.description}
        </p>
        <div>
          <button
            onClick={() => navigate(`/game/${game.id}`)}
            className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Jetzt spielen
          </button>
        </div>
      </div>

      {/* Arrow Buttons */}
      {games.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {games.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {games.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current
                  ? 'bg-white scale-110'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
