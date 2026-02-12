import { CheckCircle, XCircle, Clock, RotateCcw, ArrowLeft } from 'lucide-react'

export default function ResultScreen({ score, totalQuestions, totalTime, answers, questions, theme, onRestart, onBack }) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const minutes = Math.floor(totalTime / 60)
  const seconds = totalTime % 60

  let emoji = '🎉'
  let message = 'Ausgezeichnet!'
  if (percentage < 50) { emoji = '📚'; message = 'Weiter ueben!' }
  else if (percentage < 70) { emoji = '👍'; message = 'Gut gemacht!' }
  else if (percentage < 90) { emoji = '🌟'; message = 'Sehr gut!' }

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Result Header */}
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>{message}</h1>
          <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
            {score} von {totalQuestions} richtig
          </p>
        </div>

        {/* Score Bar */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: theme.colors.card }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: theme.colors.textSecondary }}>Ergebnis</span>
            <span className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{percentage}%</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.border }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${percentage}%`,
                backgroundColor: percentage >= 70 ? theme.colors.correct : percentage >= 50 ? theme.colors.primary : theme.colors.incorrect,
              }}
            />
          </div>
          {totalTime > 0 && (
            <div className="flex items-center gap-2 mt-3" style={{ color: theme.colors.textSecondary }}>
              <Clock size={14} />
              <span className="text-sm">Zeit: {minutes > 0 ? `${minutes}m ` : ''}{seconds}s</span>
            </div>
          )}
        </div>

        {/* Question Review */}
        <div className="mb-6">
          <h2 className="font-bold mb-3" style={{ color: theme.colors.text }}>Fragen-Uebersicht</h2>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const answer = answers[i]
              return (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                  {answer?.isCorrect ? (
                    <CheckCircle size={18} style={{ color: theme.colors.correct }} />
                  ) : (
                    <XCircle size={18} style={{ color: theme.colors.incorrect }} />
                  )}
                  <span className="text-sm flex-1 truncate" style={{ color: theme.colors.text }}>{q.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white cursor-pointer"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <RotateCcw size={18} />
            Nochmal spielen
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold cursor-pointer"
            style={{ backgroundColor: theme.colors.card, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
          >
            <ArrowLeft size={18} />
            Zurueck
          </button>
        </div>
      </div>
    </div>
  )
}
