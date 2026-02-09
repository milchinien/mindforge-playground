import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGameById } from '../data/mockGames'
import { addToRecentlyPlayed } from './Home'

function EscHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-sm text-white/60 z-10">
      ESC = Pause
    </div>
  )
}

export default function GamePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [game, setGame] = useState(null)
  const [iframeKey, setIframeKey] = useState(0)

  useEffect(() => {
    const gameData = getGameById(id)
    if (!gameData) {
      navigate('/browse')
      return
    }
    setGame(gameData)
  }, [id, navigate])

  // Play counter + recently played
  useEffect(() => {
    if (game) {
      console.log(`Play fuer Spiel ${game.id} gezaehlt`)
      addToRecentlyPlayed(game.id)
    }
  }, [game])

  // ESC key handler
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleRestart() {
    setIsLoading(true)
    setIsPaused(false)
    setIframeKey(prev => prev + 1)
  }

  if (!game) return null

  // No gameUrl available
  if (!game.gameUrl) {
    return (
      <div className="fixed inset-0 bg-[#111827] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Dieses Spiel ist noch nicht verfuegbar.
          </h2>
          <button
            onClick={() => navigate(`/game/${id}`)}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Zurueck zur Uebersicht
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#111827]">
      {/* iframe */}
      <iframe
        key={iframeKey}
        src={game.gameUrl}
        className="w-full h-full border-0"
        title={game.title}
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setIsLoading(false)}
      />

      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#111827] flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-xl font-bold text-white mb-3">Spiel wird geladen...</h2>
            <div className="w-48 h-2 bg-[#374151] rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-[#f97316] rounded-full transition-all duration-1000"
                style={{ width: '80%', animation: 'pulse 1.5s ease-in-out infinite' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pause Menu */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <div className="bg-[#1f2937] rounded-2xl p-8 w-80 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Pausiert</h2>

            <div className="space-y-3">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Weiter spielen
              </button>
              <button
                onClick={handleRestart}
                className="w-full py-3 bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Neu starten
              </button>
              <button
                onClick={() => navigate(`/game/${id}`)}
                className="w-full py-3 bg-[#374151] hover:bg-[#4b5563] text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Zurueck zur Uebersicht
              </button>
            </div>

            <p className="text-[#6b7280] text-sm mt-4">{game.title}</p>
          </div>
        </div>
      )}

      {/* ESC Hint */}
      {!isLoading && !isPaused && <EscHint />}
    </div>
  )
}
