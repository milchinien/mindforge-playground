import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, RotateCcw, Clock, MousePointerClick, Trophy } from 'lucide-react'

const GRID_CONFIGS = {
  '2x2': { cols: 2, rows: 2 },
  '3x2': { cols: 3, rows: 2 },
  '4x3': { cols: 4, rows: 3 },
  '4x4': { cols: 4, rows: 4 },
  '4x5': { cols: 4, rows: 5 },
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryRenderer({ data }) {
  const { t } = useTranslation()
  const { gridSize = '4x3', pairs = [] } = data || {}
  const config = GRID_CONFIGS[gridSize] || GRID_CONFIGS['4x3']

  // Build cards from pairs (each pair = 2 cards)
  const buildCards = useCallback(() => {
    const usablePairs = pairs.slice(0, (config.cols * config.rows) / 2)
    const cards = usablePairs.flatMap(pair => [
      { id: `${pair.id}-f`, pairId: pair.id, text: pair.front, side: 'front' },
      { id: `${pair.id}-b`, pairId: pair.id, text: pair.back, side: 'back' },
    ])
    return shuffleArray(cards)
  }, [pairs, config])

  const [cards, setCards] = useState(() => buildCards())
  const [flipped, setFlipped] = useState([])       // currently flipped card indices
  const [matched, setMatched] = useState(new Set()) // matched pair IDs
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const lockRef = useRef(false)

  // Timer
  useEffect(() => {
    if (!isRunning || gameWon) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning, gameWon])

  // Check for match
  useEffect(() => {
    if (flipped.length !== 2) return
    lockRef.current = true
    const [a, b] = flipped
    const cardA = cards[a]
    const cardB = cards[b]

    if (cardA.pairId === cardB.pairId) {
      // Match found
      setTimeout(() => {
        setMatched(prev => {
          const next = new Set(prev)
          next.add(cardA.pairId)
          return next
        })
        setFlipped([])
        lockRef.current = false
      }, 500)
    } else {
      // No match - flip back
      setTimeout(() => {
        setFlipped([])
        lockRef.current = false
      }, 1000)
    }
  }, [flipped, cards])

  // Win detection
  useEffect(() => {
    const totalPairs = Math.floor(cards.length / 2)
    if (matched.size > 0 && matched.size === totalPairs) {
      setGameWon(true)
      setIsRunning(false)
    }
  }, [matched, cards.length])

  const handleCardClick = (index) => {
    if (lockRef.current || gameWon) return
    if (flipped.includes(index)) return
    if (matched.has(cards[index].pairId)) return
    if (flipped.length >= 2) return

    if (!isRunning) setIsRunning(true)

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
    }
  }

  const reset = () => {
    setCards(buildCards())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setTimer(0)
    setIsRunning(false)
    setGameWon(false)
    lockRef.current = false
  }

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalPairs = Math.floor(cards.length / 2)
  const score = Math.max(0, 1000 - moves * 20 - timer * 2)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <LayoutGrid size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">
            {t('gameBuilder.memory.playTitle', 'Memory')}
          </h3>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer px-2 py-1 rounded bg-bg-secondary"
        >
          <RotateCcw size={12} />
          Neustart
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 bg-bg-secondary rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock size={12} />
          <span className="font-mono">{formatTime(timer)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MousePointerClick size={12} />
          <span>{moves} Zuege</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Trophy size={12} />
          <span>{matched.size}/{totalPairs} Paare</span>
        </div>
      </div>

      {/* Game Won Screen */}
      {gameWon && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center">
          <Trophy size={40} className="text-success mx-auto mb-3" />
          <h3 className="text-lg font-bold text-success mb-1">Gewonnen!</h3>
          <p className="text-sm text-text-secondary mb-1">
            {moves} Zuege in {formatTime(timer)}
          </p>
          <p className="text-xs text-text-muted mb-4">Punkte: {score}</p>
          <button
            onClick={reset}
            className="bg-success hover:bg-success/80 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Nochmal spielen
          </button>
        </div>
      )}

      {/* Card Grid */}
      {!gameWon && (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index)
            const isMatched = matched.has(card.pairId)
            const showFace = isFlipped || isMatched

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="relative cursor-pointer select-none"
                style={{ perspective: '600px' }}
              >
                <div
                  className="relative w-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: showFace ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    minHeight: '70px',
                  }}
                >
                  {/* Card Back (face down) */}
                  <div
                    className={`absolute inset-0 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      isMatched
                        ? 'bg-success/20 border-success/30'
                        : 'bg-gradient-to-br from-accent/30 to-accent/10 border-accent/30 hover:border-accent/60'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-lg font-bold text-accent/40">?</span>
                  </div>

                  {/* Card Front (face up) */}
                  <div
                    className={`absolute inset-0 rounded-lg border-2 flex items-center justify-center p-2 text-center ${
                      isMatched
                        ? 'bg-success/20 border-success/40'
                        : card.side === 'front'
                          ? 'bg-bg-card border-accent/40'
                          : 'bg-accent/10 border-accent/40'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <span className={`text-xs font-medium ${
                      isMatched ? 'text-success' : 'text-text-primary'
                    }`}>
                      {card.text}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
