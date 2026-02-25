import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TextCursorInput, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

export default function FillInBlankRenderer({ data }) {
  const { t } = useTranslation()
  const { text = '', words = [] } = data || {}

  const parts = text.split('___')
  const blankCount = parts.length - 1
  const correctWords = words.filter(w => w.isCorrect)
  const allWords = [...words].sort(() => Math.random() - 0.5)

  const [placements, setPlacements] = useState(Array(blankCount).fill(null))
  const [selectedWord, setSelectedWord] = useState(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const [shuffledWords] = useState(allWords)

  const handleWordClick = useCallback((word) => {
    if (checked) return
    // If the word is already placed, remove it
    const placedIndex = placements.indexOf(word.id)
    if (placedIndex !== -1) {
      setPlacements(prev => {
        const next = [...prev]
        next[placedIndex] = null
        return next
      })
      return
    }
    setSelectedWord(word.id)
  }, [checked, placements])

  const handleBlankClick = useCallback((index) => {
    if (checked || !selectedWord) return

    // If blank already has a word, swap it out
    setPlacements(prev => {
      const next = [...prev]
      // Remove selectedWord from any other blank
      const existingIndex = next.indexOf(selectedWord)
      if (existingIndex !== -1) next[existingIndex] = null
      next[index] = selectedWord
      return next
    })
    setSelectedWord(null)
  }, [checked, selectedWord])

  const checkAnswers = () => {
    const res = placements.map((wordId, i) => {
      if (!wordId) return false
      const word = words.find(w => w.id === wordId)
      const expected = correctWords[i]
      return word && expected && word.text === expected.text
    })
    setResults(res)
    setChecked(true)
  }

  const reset = () => {
    setPlacements(Array(blankCount).fill(null))
    setSelectedWord(null)
    setChecked(false)
    setResults([])
  }

  const score = results.filter(Boolean).length
  const allFilled = placements.every(p => p !== null)
  const usedWordIds = placements.filter(Boolean)

  const getBlankStyle = (index) => {
    if (!checked) {
      const hasWord = placements[index] !== null
      const isTarget = selectedWord && !hasWord
      return `inline-flex items-center justify-center min-w-[90px] px-3 py-1 mx-1 rounded-lg border-2 transition-all cursor-pointer ${
        hasWord
          ? 'bg-accent/20 border-accent/40 text-accent font-medium'
          : isTarget
            ? 'border-accent border-dashed bg-accent/5 animate-pulse'
            : 'border-gray-600 border-dashed bg-bg-card text-text-muted hover:border-accent/40'
      }`
    }
    return `inline-flex items-center justify-center min-w-[90px] px-3 py-1 mx-1 rounded-lg border-2 font-medium ${
      results[index]
        ? 'bg-success/20 border-success/40 text-success'
        : 'bg-error/20 border-error/40 text-error'
    }`
  }

  const getWordForBlank = (index) => {
    const wordId = placements[index]
    if (!wordId) return null
    return words.find(w => w.id === wordId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
          <TextCursorInput size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">
          {t('gameBuilder.fillInBlank.playTitle', 'Lueckentext')}
        </h3>
      </div>

      {/* Instructions */}
      {!checked && (
        <p className="text-xs text-text-muted bg-bg-secondary rounded-lg px-3 py-2">
          Klicke auf ein Wort aus der Wortbank und dann auf eine Luecke, um es einzusetzen.
        </p>
      )}

      {/* Text with blanks */}
      <div className="bg-bg-secondary rounded-xl p-5 border border-gray-700/50">
        <div className="text-sm text-text-secondary leading-loose">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span
                  className={getBlankStyle(i)}
                  onClick={() => handleBlankClick(i)}
                >
                  {getWordForBlank(i)?.text || (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Word bank */}
      <div>
        <p className="text-xs text-text-muted mb-2 font-medium">Wortbank</p>
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map(word => {
            const isUsed = usedWordIds.includes(word.id)
            const isSelected = selectedWord === word.id
            return (
              <button
                key={word.id}
                onClick={() => handleWordClick(word)}
                disabled={checked}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                  isUsed
                    ? 'opacity-30 border-gray-700 bg-bg-card text-text-muted cursor-not-allowed'
                    : isSelected
                      ? 'bg-accent/30 border-accent text-accent scale-105 shadow-lg'
                      : 'bg-bg-card border-gray-600 text-text-primary hover:border-accent/40 hover:bg-bg-hover'
                }`}
              >
                {word.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Check / Reset buttons */}
      <div className="flex items-center gap-3">
        {!checked ? (
          <button
            onClick={checkAnswers}
            disabled={!allFilled}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            <CheckCircle size={16} />
            {t('gameBuilder.fillInBlank.check', 'Ueberpruefen')}
          </button>
        ) : (
          <>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold ${
              score === blankCount
                ? 'bg-success/20 text-success'
                : 'bg-warning/20 text-warning'
            }`}>
              {score === blankCount ? (
                <><CheckCircle size={16} /> Alles richtig!</>
              ) : (
                <><XCircle size={16} /> {score} von {blankCount} richtig</>
              )}
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 bg-bg-secondary hover:bg-bg-hover text-text-secondary px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Nochmal
            </button>
          </>
        )}
      </div>
    </div>
  )
}
