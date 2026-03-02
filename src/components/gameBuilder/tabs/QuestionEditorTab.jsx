import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Check, Image } from 'lucide-react'

function createEmptyQuestion() {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: '',
    imageRef: null,
    multiSelect: false,
    options: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
    ],
    explanation: '',
  }
}

function QuestionListItem({ question, index, isActive, onClick, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const hasCorrect = question.options.some(o => o.isCorrect)
  const hasText = question.text.trim().length > 0

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors group ${
        isActive ? 'bg-accent/15 border border-accent/30' : 'hover:bg-bg-hover border border-transparent'
      }`}
    >
      <GripVertical size={14} className="text-text-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {hasText ? question.text : `Frage ${index + 1}`}
        </p>
        <div className="flex gap-2 mt-0.5">
          {hasCorrect ? (
            <span className="text-xs text-green-400">Korrekte Antwort gesetzt</span>
          ) : (
            <span className="text-xs text-yellow-400">Keine Antwort</span>
          )}
          <span className="text-xs text-text-muted">{question.options.length} Optionen</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 hover-show transition-opacity">
        {!isFirst && (
          <button onClick={(e) => { e.stopPropagation(); onMoveUp() }} className="p-0.5 hover:text-accent cursor-pointer">
            <ChevronUp size={12} />
          </button>
        )}
        {!isLast && (
          <button onClick={(e) => { e.stopPropagation(); onMoveDown() }} className="p-0.5 hover:text-accent cursor-pointer">
            <ChevronDown size={12} />
          </button>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="hover-show p-1 hover:text-red-400 text-text-muted transition-all cursor-pointer"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function QuestionDetail({ question, onChange }) {
  const updateOption = (optionId, updates) => {
    onChange({
      options: question.options.map(o => o.id === optionId ? { ...o, ...updates } : o),
    })
  }

  const addOption = () => {
    if (question.options.length >= 6) return
    const nextId = String.fromCharCode(97 + question.options.length)
    onChange({
      options: [...question.options, { id: nextId, text: '', isCorrect: false }],
    })
  }

  const removeOption = (optionId) => {
    if (question.options.length <= 2) return
    onChange({
      options: question.options.filter(o => o.id !== optionId),
    })
  }

  const toggleCorrect = (optionId) => {
    if (question.multiSelect) {
      updateOption(optionId, { isCorrect: !question.options.find(o => o.id === optionId).isCorrect })
    } else {
      onChange({
        options: question.options.map(o => ({ ...o, isCorrect: o.id === optionId })),
      })
    }
  }

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <div>
        <label className="text-sm font-medium text-text-secondary">Fragetext *</label>
        <textarea
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Deine Frage eingeben..."
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Multi-Select Toggle */}
      <label className="flex items-center gap-2 cursor-pointer !mb-0">
        <input
          type="checkbox"
          checked={question.multiSelect}
          onChange={(e) => onChange({ multiSelect: e.target.checked })}
          className="!w-4 !h-4"
        />
        <span className="text-text-secondary text-sm">Mehrere korrekte Antworten erlauben</span>
      </label>

      {/* Answer Options */}
      <div>
        <label className="text-sm font-medium text-text-secondary">Antwortoptionen *</label>
        <div className="space-y-2 mt-2">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <button
                onClick={() => toggleCorrect(option.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                  option.isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-bg-secondary text-text-muted hover:bg-bg-hover'
                }`}
                title={option.isCorrect ? 'Korrekte Antwort' : 'Als korrekt markieren'}
              >
                {option.isCorrect ? <Check size={14} /> : <span className="text-xs">{option.id.toUpperCase()}</span>}
              </button>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(option.id, { text: e.target.value })}
                placeholder={`Antwort ${option.id.toUpperCase()}`}
                className="!flex-1"
              />
              {question.options.length > 2 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {question.options.length < 6 && (
          <button
            onClick={addOption}
            className="flex items-center gap-2 text-accent text-sm mt-2 hover:underline cursor-pointer"
          >
            <Plus size={14} /> Antwortoption hinzufuegen
          </button>
        )}
      </div>

      {/* Explanation */}
      <div>
        <label className="text-sm font-medium text-text-secondary">Erklaerung (optional)</label>
        <textarea
          value={question.explanation}
          onChange={(e) => onChange({ explanation: e.target.value })}
          placeholder="Erklaerung zur korrekten Antwort..."
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  )
}

export default function QuestionEditorTab({ gameData, onChange }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  const questions = gameData.questions || []
  const activeQuestion = questions[activeQuestionIndex]

  const addQuestion = () => {
    const newQ = createEmptyQuestion()
    const updated = [...questions, newQ]
    onChange({ questions: updated })
    setActiveQuestionIndex(updated.length - 1)
  }

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index)
    onChange({ questions: updated })
    if (activeQuestionIndex >= updated.length) {
      setActiveQuestionIndex(Math.max(0, updated.length - 1))
    }
  }

  const updateQuestion = (index, updates) => {
    onChange({
      questions: questions.map((q, i) => i === index ? { ...q, ...updates } : q),
    })
  }

  const moveQuestion = (from, to) => {
    const updated = [...questions]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    onChange({ questions: updated })
    setActiveQuestionIndex(to)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Fragen-Editor</h2>
          <p className="text-text-muted text-sm">Mindestens 3 Fragen, maximal 50</p>
        </div>
        <span className="text-text-muted text-sm">{questions.length}/50 Fragen</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Question List */}
        <div className="md:col-span-1">
          <div className="space-y-1 mb-3 max-h-[500px] overflow-y-auto">
            {questions.map((q, i) => (
              <QuestionListItem
                key={q.id}
                question={q}
                index={i}
                isActive={i === activeQuestionIndex}
                onClick={() => setActiveQuestionIndex(i)}
                onDelete={() => deleteQuestion(i)}
                onMoveUp={() => moveQuestion(i, i - 1)}
                onMoveDown={() => moveQuestion(i, i + 1)}
                isFirst={i === 0}
                isLast={i === questions.length - 1}
              />
            ))}
          </div>
          {questions.length < 50 && (
            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-600 hover:border-accent text-text-secondary hover:text-accent rounded-lg transition-colors cursor-pointer text-sm"
            >
              <Plus size={16} /> Neue Frage
            </button>
          )}
        </div>

        {/* Right: Question Detail */}
        <div className="md:col-span-2">
          {activeQuestion ? (
            <QuestionDetail
              question={activeQuestion}
              onChange={(updates) => updateQuestion(activeQuestionIndex, updates)}
            />
          ) : (
            <div className="text-center py-12 text-text-muted">
              <p className="text-lg mb-2">Noch keine Fragen</p>
              <p className="text-sm">Klicke "Neue Frage" um deine erste Frage zu erstellen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
