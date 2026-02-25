import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Eye, EyeOff, TextCursorInput, GripVertical } from 'lucide-react'

const DEFAULT_DATA = {
  text: '',
  words: [],       // { id, text, isCorrect }
}

export default function FillInBlankEditor({ data: initialData, onChange }) {
  const { t } = useTranslation()
  const [data, setData] = useState(initialData || DEFAULT_DATA)
  const [showPreview, setShowPreview] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [newWordIsCorrect, setNewWordIsCorrect] = useState(true)

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange?.({ type: 'fill-in-blank', data: next })
      return next
    })
  }, [onChange])

  const addWord = () => {
    const trimmed = newWord.trim()
    if (!trimmed) return
    const word = {
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      isCorrect: newWordIsCorrect,
    }
    update({ words: [...data.words, word] })
    setNewWord('')
  }

  const removeWord = (id) => {
    update({ words: data.words.filter(w => w.id !== id) })
  }

  const toggleWordCorrect = (id) => {
    update({
      words: data.words.map(w =>
        w.id === id ? { ...w, isCorrect: !w.isCorrect } : w
      ),
    })
  }

  // Parse blanks from text
  const blanks = (data.text.match(/___/g) || []).length
  const correctWords = data.words.filter(w => w.isCorrect)

  // Preview rendering
  const renderPreview = () => {
    const parts = data.text.split('___')
    return (
      <div className="text-sm text-text-secondary leading-relaxed">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="inline-block min-w-[80px] border-b-2 border-accent/50 mx-1 text-center text-text-muted">
                {correctWords[i]?.text || '______'}
              </span>
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <TextCursorInput size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {t('gameBuilder.fillInBlank.title', 'Lueckentext Editor')}
            </h3>
            <p className="text-xs text-text-muted">
              {t('gameBuilder.fillInBlank.subtitle', 'Erstelle einen Text mit Luecken')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer px-2 py-1 rounded bg-bg-secondary"
        >
          {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPreview ? 'Editor' : 'Vorschau'}
        </button>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-bg-secondary rounded-xl p-5 border border-gray-700/50">
          <p className="text-xs text-text-muted mb-3 font-medium">Vorschau</p>
          {data.text ? renderPreview() : (
            <p className="text-text-muted text-sm italic">Kein Text vorhanden. Schreibe zuerst einen Text mit ___ als Luecken.</p>
          )}

          {data.words.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-700/50">
              <p className="text-xs text-text-muted mb-2 font-medium">Wortbank</p>
              <div className="flex flex-wrap gap-2">
                {data.words.map(w => (
                  <span
                    key={w.id}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      w.isCorrect
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'bg-bg-card text-text-secondary border border-gray-600'
                    }`}
                  >
                    {w.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <>
          {/* Text Area */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium">
              {t('gameBuilder.fillInBlank.textLabel', 'Text (nutze ___ fuer Luecken)')}
            </label>
            <textarea
              value={data.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="Die Hauptstadt von Deutschland ist ___. Sie liegt im Bundesland ___."
              rows={5}
              className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
            />
            <p className="text-xs text-text-muted mt-1">
              {blanks} {blanks === 1 ? 'Luecke' : 'Luecken'} erkannt
              {blanks > 0 && correctWords.length < blanks && (
                <span className="text-warning ml-2">
                  (noch {blanks - correctWords.length} korrekte Woerter noetig)
                </span>
              )}
            </p>
          </div>

          {/* Word Bank Editor */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium">
              {t('gameBuilder.fillInBlank.wordBank', 'Wortbank')}
            </label>

            {/* Add word form */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWord()}
                placeholder="Wort eingeben..."
                className="flex-1 bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={() => setNewWordIsCorrect(!newWordIsCorrect)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                  newWordIsCorrect
                    ? 'bg-success/20 text-success border-success/30'
                    : 'bg-error/20 text-error border-error/30'
                }`}
              >
                {newWordIsCorrect ? 'Korrekt' : 'Ablenker'}
              </button>
              <button
                onClick={addWord}
                disabled={!newWord.trim()}
                className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Word list */}
            {data.words.length > 0 ? (
              <div className="space-y-1.5">
                {data.words.map((word) => (
                  <div
                    key={word.id}
                    className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2 group"
                  >
                    <GripVertical size={14} className="text-text-muted/40" />
                    <span className="flex-1 text-sm text-text-primary">{word.text}</span>
                    <button
                      onClick={() => toggleWordCorrect(word.id)}
                      className={`text-xs px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                        word.isCorrect
                          ? 'bg-success/20 text-success'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      {word.isCorrect ? 'Korrekt' : 'Ablenker'}
                    </button>
                    <button
                      onClick={() => removeWord(word.id)}
                      className="text-text-muted hover:text-error transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                Noch keine Woerter hinzugefuegt. Fuege korrekte Antworten und Ablenker hinzu.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

FillInBlankEditor.defaultData = DEFAULT_DATA
