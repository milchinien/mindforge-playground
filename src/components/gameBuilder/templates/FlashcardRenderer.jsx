import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, RotateCcw, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function FlashcardRenderer({ data }) {
  const { t } = useTranslation()
  const { cards = [] } = data || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())
  const [studyAgain, setStudyAgain] = useState(new Set())
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = cards[currentIndex] || null
  const totalCards = cards.length
  const reviewed = known.size + studyAgain.size
  const progress = totalCards > 0 ? (reviewed / totalCards) * 100 : 0

  const handleKnow = () => {
    setKnown(prev => {
      const next = new Set(prev)
      next.add(currentCard.id)
      return next
    })
    // Remove from studyAgain if previously marked
    setStudyAgain(prev => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    goNext()
  }

  const handleStudyAgain = () => {
    setStudyAgain(prev => {
      const next = new Set(prev)
      next.add(currentCard.id)
      return next
    })
    // Remove from known if previously marked
    setKnown(prev => {
      const next = new Set(prev)
      next.delete(currentCard.id)
      return next
    })
    goNext()
  }

  const goNext = () => {
    setIsFlipped(false)
    if (currentIndex < totalCards - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 200)
    } else {
      setTimeout(() => setIsComplete(true), 200)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex(i => i - 1)
    }
  }

  const reset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnown(new Set())
    setStudyAgain(new Set())
    setIsComplete(false)
  }

  const studyOnlyUnknown = () => {
    // This would filter to only unknown cards in a real implementation
    // For now, just reset
    reset()
  }

  if (totalCards === 0) {
    return (
      <div className="text-center py-12">
        <Layers size={40} className="text-text-muted/30 mx-auto mb-3" />
        <p className="text-text-muted text-sm">Keine Karteikarten vorhanden.</p>
      </div>
    )
  }

  // Summary screen
  if (isComplete) {
    const knownCount = known.size
    const studyCount = studyAgain.size
    const unanswered = totalCards - knownCount - studyCount
    const percentage = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Zusammenfassung</h3>
        </div>

        <div className="bg-bg-secondary rounded-xl p-6 border border-gray-700/50 text-center">
          <div className="text-4xl font-bold text-accent mb-2">{percentage}%</div>
          <p className="text-sm text-text-secondary mb-6">der Karten gewusst</p>

          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <CheckCircle size={16} className="text-success" />
                <span className="text-lg font-bold text-success">{knownCount}</span>
              </div>
              <p className="text-xs text-text-muted">Gewusst</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <XCircle size={16} className="text-error" />
                <span className="text-lg font-bold text-error">{studyCount}</span>
              </div>
              <p className="text-xs text-text-muted">Nochmal lernen</p>
            </div>
            {unanswered > 0 && (
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <span className="text-lg font-bold text-text-muted">{unanswered}</span>
                </div>
                <p className="text-xs text-text-muted">Uebersprungen</p>
              </div>
            )}
          </div>

          {/* Progress bar breakdown */}
          <div className="w-full h-3 bg-bg-card rounded-full overflow-hidden mb-6">
            <div className="h-full flex">
              <div
                className="bg-success transition-all"
                style={{ width: `${(knownCount / totalCards) * 100}%` }}
              />
              <div
                className="bg-error transition-all"
                style={{ width: `${(studyCount / totalCards) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 bg-bg-card hover:bg-bg-hover text-text-secondary px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Alle nochmal
            </button>
            {studyCount > 0 && (
              <button
                onClick={studyOnlyUnknown}
                className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <XCircle size={14} />
                Nur unbekannte ({studyCount})
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">
            {t('gameBuilder.flashcard.playTitle', 'Karteikarten')}
          </h3>
        </div>
        <span className="text-xs text-text-muted">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative cursor-pointer select-none mx-auto"
        style={{ perspective: '800px', maxWidth: '400px' }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
            minHeight: '200px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-bg-secondary border border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {currentCard?.category && (
              <span className="absolute top-3 left-3 text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                {currentCard.category}
              </span>
            )}
            {currentCard?.imageUrl && (
              <img
                src={currentCard.imageUrl}
                alt=""
                className="max-h-16 rounded-lg mb-3 object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <p className="text-base text-text-primary font-medium text-center">
              {currentCard?.front}
            </p>
            <p className="text-[10px] text-text-muted mt-4">Klicken zum Umdrehen</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-2xl p-8 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-base text-accent font-medium text-center">
              {currentCard?.back}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation + Rating buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-2 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {isFlipped && (
          <>
            <button
              onClick={handleStudyAgain}
              className="flex items-center gap-1.5 bg-error/20 hover:bg-error/30 text-error px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer border border-error/30"
            >
              <XCircle size={16} />
              Nochmal lernen
            </button>
            <button
              onClick={handleKnow}
              className="flex items-center gap-1.5 bg-success/20 hover:bg-success/30 text-success px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer border border-success/30"
            >
              <CheckCircle size={16} />
              Gewusst!
            </button>
          </>
        )}

        <button
          onClick={goNext}
          disabled={currentIndex >= totalCards - 1}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-2 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Quick stats */}
      <div className="flex justify-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <CheckCircle size={10} className="text-success" />
          {known.size} gewusst
        </span>
        <span className="flex items-center gap-1">
          <XCircle size={10} className="text-error" />
          {studyAgain.size} nochmal
        </span>
      </div>
    </div>
  )
}
