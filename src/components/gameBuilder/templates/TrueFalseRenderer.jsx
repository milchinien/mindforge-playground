import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react'

export default function TrueFalseRenderer({ data }) {
  const { t } = useTranslation()
  const { statements = [] } = data || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState(null) // null | 'correct' | 'wrong'
  const [results, setResults] = useState([]) // { id, correct }
  const [isComplete, setIsComplete] = useState(false)

  const currentStatement = statements[currentIndex] || null
  const totalStatements = statements.length
  const progress = totalStatements > 0 ? (currentIndex / totalStatements) * 100 : 0

  const handleAnswer = (userSaidTrue) => {
    if (answer !== null) return
    const correct = userSaidTrue === currentStatement.isTrue
    setAnswer(correct ? 'correct' : 'wrong')
    setResults(prev => [...prev, { id: currentStatement.id, correct }])
  }

  const goNext = () => {
    setAnswer(null)
    if (currentIndex < totalStatements - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      setIsComplete(true)
    }
  }

  const reset = () => {
    setCurrentIndex(0)
    setAnswer(null)
    setResults([])
    setIsComplete(false)
  }

  if (totalStatements === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={40} className="text-text-muted/30 mx-auto mb-3" />
        <p className="text-text-muted text-sm">Keine Aussagen vorhanden.</p>
      </div>
    )
  }

  if (isComplete) {
    const correctCount = results.filter(r => r.correct).length
    const percentage = Math.round((correctCount / totalStatements) * 100)

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Ergebnis</h3>
        </div>

        <div className="bg-bg-secondary rounded-xl p-6 border border-gray-700/50 text-center">
          <div className={`text-4xl font-bold mb-2 ${percentage >= 70 ? 'text-success' : percentage >= 40 ? 'text-warning' : 'text-error'}`}>
            {percentage}%
          </div>
          <p className="text-sm text-text-secondary mb-6">richtig beantwortet</p>

          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <CheckCircle size={16} className="text-success" />
                <span className="text-lg font-bold text-success">{correctCount}</span>
              </div>
              <p className="text-xs text-text-muted">Richtig</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <XCircle size={16} className="text-error" />
                <span className="text-lg font-bold text-error">{totalStatements - correctCount}</span>
              </div>
              <p className="text-xs text-text-muted">Falsch</p>
            </div>
          </div>

          <div className="w-full h-3 bg-bg-card rounded-full overflow-hidden mb-6">
            <div className="h-full flex">
              <div
                className="bg-success transition-all"
                style={{ width: `${percentage}%` }}
              />
              <div
                className="bg-error transition-all"
                style={{ width: `${100 - percentage}%` }}
              />
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-1.5 mb-6 text-left">
            {statements.map((s, i) => {
              const result = results[i]
              return (
                <div key={s.id} className="flex items-start gap-2 bg-bg-card rounded-lg px-3 py-2">
                  {result?.correct
                    ? <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                    : <XCircle size={14} className="text-error mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary">{s.text}</p>
                    <p className="text-[10px] text-text-muted">
                      Antwort: {s.isTrue ? 'Wahr' : 'Falsch'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer mx-auto"
          >
            <RotateCcw size={14} />
            Nochmal spielen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">
            {t('gameBuilder.trueFalse.playTitle', 'Wahr oder Falsch?')}
          </h3>
        </div>
        <span className="text-xs text-text-muted">
          {currentIndex + 1} / {totalStatements}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Statement card */}
      <div className={`bg-bg-secondary rounded-2xl p-8 border text-center transition-colors ${
        answer === 'correct' ? 'border-success/50 bg-success/5' :
        answer === 'wrong' ? 'border-error/50 bg-error/5' :
        'border-gray-700/50'
      }`}>
        <p className="text-base text-text-primary font-medium mb-6">
          {currentStatement?.text}
        </p>

        {answer === null ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-2 bg-success/20 hover:bg-success/30 text-success px-6 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer border border-success/30"
            >
              <CheckCircle size={18} />
              Wahr
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-2 bg-error/20 hover:bg-error/30 text-error px-6 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer border border-error/30"
            >
              <XCircle size={18} />
              Falsch
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`flex items-center justify-center gap-2 text-sm font-bold ${
              answer === 'correct' ? 'text-success' : 'text-error'
            }`}>
              {answer === 'correct'
                ? <><CheckCircle size={20} /> Richtig!</>
                : <><XCircle size={20} /> Falsch! Die Antwort ist: {currentStatement.isTrue ? 'Wahr' : 'Falsch'}</>
              }
            </div>

            {currentStatement?.explanation && (
              <p className="text-xs text-text-muted italic bg-bg-card rounded-lg px-4 py-2">
                {currentStatement.explanation}
              </p>
            )}

            <button
              onClick={goNext}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer mx-auto"
            >
              {currentIndex < totalStatements - 1 ? (
                <><ArrowRight size={14} /> Weiter</>
              ) : (
                <>Ergebnis anzeigen</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="flex justify-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <CheckCircle size={10} className="text-success" />
          {results.filter(r => r.correct).length} richtig
        </span>
        <span className="flex items-center gap-1">
          <XCircle size={10} className="text-error" />
          {results.filter(r => !r.correct).length} falsch
        </span>
      </div>
    </div>
  )
}
