import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { getThemeById } from '../../data/gameThemes'
import ResultScreen from './ResultScreen'

export default function QuizRenderer({ game, onBack, onRestart }) {
  const theme = getThemeById(game.theme || 'mindforge')
  const settings = game.settings || {}
  const allQuestions = game.questions || []

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit || 0)
  const [totalTime, setTotalTime] = useState(0)

  // Initialize: shuffle if needed
  useEffect(() => {
    const q = settings.randomOrder
      ? [...allQuestions].sort(() => Math.random() - 0.5)
      : [...allQuestions]
    setQuestions(q)
  }, [settings.randomOrder, allQuestions])

  // Timer
  useEffect(() => {
    if (isComplete || showFeedback || !settings.timeLimit) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer([])
          return settings.timeLimit
        }
        return prev - 1
      })
      setTotalTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentIndex, isComplete, showFeedback, settings.timeLimit, handleAnswer])

  // Reset timer on question change
  useEffect(() => {
    if (settings.timeLimit) setTimeLeft(settings.timeLimit)
  }, [currentIndex, settings.timeLimit])

  const currentQuestion = questions[currentIndex]

  const handleSelectAnswer = (optionId) => {
    if (showFeedback) return
    if (currentQuestion?.multiSelect) {
      setSelectedAnswers(prev =>
        prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
      )
    } else {
      setSelectedAnswers([optionId])
    }
  }

  const handleAnswer = useCallback((forcedAnswers) => {
    const selected = forcedAnswers || selectedAnswers
    if (showFeedback) return

    const correctIds = currentQuestion.options.filter(o => o.isCorrect).map(o => o.id)
    const isCorrect = correctIds.length === selected.length &&
      correctIds.every(id => selected.includes(id))

    if (isCorrect) setScore(prev => prev + 1)

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected,
      correctIds,
      isCorrect,
    }])

    setShowFeedback(true)
  }, [selectedAnswers, showFeedback, currentQuestion])

  const handleNext = () => {
    setShowFeedback(false)
    setSelectedAnswers([])
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleRestart = () => {
    const q = settings.randomOrder
      ? [...allQuestions].sort(() => Math.random() - 0.5)
      : [...allQuestions]
    setQuestions(q)
    setCurrentIndex(0)
    setSelectedAnswers([])
    setShowFeedback(false)
    setScore(0)
    setIsComplete(false)
    setAnswers([])
    setTotalTime(0)
    if (settings.timeLimit) setTimeLeft(settings.timeLimit)
  }

  if (isComplete) {
    return (
      <ResultScreen
        score={score}
        totalQuestions={questions.length}
        totalTime={totalTime}
        answers={answers}
        questions={questions}
        theme={theme}
        onRestart={handleRestart}
        onBack={onBack}
      />
    )
  }

  if (!currentQuestion) return null

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
            Frage {currentIndex + 1} von {questions.length}
          </span>
          {settings.showPoints && (
            <span className="text-sm font-bold" style={{ color: theme.colors.primary }}>
              {score} Punkte
            </span>
          )}
        </div>
        {settings.timeLimit > 0 && (() => {
          const pct = (timeLeft / settings.timeLimit) * 100
          const isUrgent = timeLeft <= 5
          const timerColor = pct > 50
            ? '#10b981'
            : pct > 25
              ? '#f59e0b'
              : '#ef4444'

          return (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.border }}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${isUrgent ? 'animate-pulse' : ''}`}
                  style={{ width: `${pct}%`, backgroundColor: timerColor }}
                />
              </div>
              <span
                className={`text-sm font-mono font-bold min-w-[2.5rem] text-right ${isUrgent ? 'animate-pulse scale-110' : ''}`}
                style={{ color: timerColor, transition: 'color 0.3s' }}
              >
                {timeLeft}s
              </span>
            </div>
          )
        })()}
      </div>

      {/* Progress Bar */}
      <div className="h-1" style={{ backgroundColor: theme.colors.border }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: theme.colors.primary }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8" style={{ color: theme.colors.text }}>
          {currentQuestion.text}
        </h2>

        {/* Answer Options */}
        <div className="w-full space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id)
            const showCorrect = showFeedback && option.isCorrect
            const showIncorrect = showFeedback && isSelected && !option.isCorrect

            let bgColor = theme.colors.card
            let borderColor = theme.colors.border
            if (isSelected && !showFeedback) {
              bgColor = theme.colors.primary
              borderColor = theme.colors.primary
            }
            if (showCorrect) {
              bgColor = theme.colors.correct
              borderColor = theme.colors.correct
            }
            if (showIncorrect) {
              bgColor = theme.colors.incorrect
              borderColor = theme.colors.incorrect
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={showFeedback}
                className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default"
                style={{
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  color: (isSelected && !showFeedback) || showCorrect || showIncorrect ? '#fff' : theme.colors.text,
                }}
              >
                <span className="font-medium flex items-center gap-2">
                  {showCorrect && <CheckCircle size={18} className="flex-shrink-0" />}
                  {showIncorrect && <XCircle size={18} className="flex-shrink-0" />}
                  {option.id.toUpperCase()}) {option.text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Submit / Next */}
        <div className="mt-6 w-full">
          {!showFeedback ? (
            <button
              onClick={() => handleAnswer(null)}
              disabled={selectedAnswers.length === 0}
              className="w-full py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Antwort bestaetigen
            </button>
          ) : (
            <div>
              {/* Explanation */}
              {currentQuestion.explanation && (
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: theme.colors.card, borderLeft: `4px solid ${theme.colors.primary}` }}>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl font-bold text-white cursor-pointer"
                style={{ backgroundColor: theme.colors.primary }}
              >
                {currentIndex + 1 >= questions.length ? 'Ergebnis anzeigen' : 'Naechste Frage'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
