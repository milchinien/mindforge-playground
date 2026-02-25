import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Eye, EyeOff, CheckCircle, GripVertical, Edit3 } from 'lucide-react'

const DEFAULT_DATA = {
  statements: [],  // { id, text, isTrue, explanation? }
}

export default function TrueFalseEditor({ data: initialData, onChange }) {
  const { t } = useTranslation()
  const [data, setData] = useState(initialData || DEFAULT_DATA)
  const [showPreview, setShowPreview] = useState(false)
  const [editForm, setEditForm] = useState({ text: '', isTrue: true, explanation: '' })
  const [editingId, setEditingId] = useState(null)

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange?.({ type: 'true-false', data: next })
      return next
    })
  }, [onChange])

  const addStatement = () => {
    if (!editForm.text.trim()) return

    if (editingId) {
      // Update existing
      update({
        statements: data.statements.map(s =>
          s.id === editingId
            ? { ...s, text: editForm.text.trim(), isTrue: editForm.isTrue, explanation: editForm.explanation.trim() || null }
            : s
        ),
      })
      setEditingId(null)
    } else {
      // Add new
      const statement = {
        id: `tf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: editForm.text.trim(),
        isTrue: editForm.isTrue,
        explanation: editForm.explanation.trim() || null,
      }
      update({ statements: [...data.statements, statement] })
    }
    setEditForm({ text: '', isTrue: true, explanation: '' })
  }

  const editStatement = (statement) => {
    setEditingId(statement.id)
    setEditForm({
      text: statement.text,
      isTrue: statement.isTrue,
      explanation: statement.explanation || '',
    })
  }

  const removeStatement = (id) => {
    update({ statements: data.statements.filter(s => s.id !== id) })
    if (editingId === id) {
      setEditingId(null)
      setEditForm({ text: '', isTrue: true, explanation: '' })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ text: '', isTrue: true, explanation: '' })
  }

  const trueCount = data.statements.filter(s => s.isTrue).length
  const falseCount = data.statements.filter(s => !s.isTrue).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {t('gameBuilder.trueFalse.title', 'Wahr/Falsch Editor')}
            </h3>
            <p className="text-xs text-text-muted">
              {t('gameBuilder.trueFalse.subtitle', 'Erstelle Wahr/Falsch-Aussagen')}
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
        <div className="bg-bg-secondary rounded-xl p-5 border border-gray-700/50 space-y-3">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{data.statements.length} Aussagen</span>
            <span className="text-success">{trueCount} wahr</span>
            <span className="text-error">{falseCount} falsch</span>
          </div>
          {data.statements.length > 0 ? (
            <div className="space-y-2">
              {data.statements.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 bg-bg-card rounded-lg px-3 py-2.5"
                >
                  <span className="text-xs text-text-muted w-5 text-right pt-0.5">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">{s.text}</p>
                    {s.explanation && (
                      <p className="text-xs text-text-muted mt-1 italic">{s.explanation}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    s.isTrue ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  }`}>
                    {s.isTrue ? 'WAHR' : 'FALSCH'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm italic">Noch keine Aussagen erstellt.</p>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <>
          {/* Add/Edit Form */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-gray-700/50 space-y-3">
            <p className="text-xs text-text-muted font-medium">
              {editingId ? 'Aussage bearbeiten' : 'Neue Aussage hinzufuegen'}
            </p>
            <textarea
              value={editForm.text}
              onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
              placeholder="z.B. Die Erde ist der groesste Planet im Sonnensystem."
              rows={2}
              className="w-full bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
            />

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">Antwort:</span>
              <button
                onClick={() => setEditForm(prev => ({ ...prev, isTrue: true }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  editForm.isTrue
                    ? 'bg-success/20 border-success/40 text-success'
                    : 'bg-bg-card border-gray-700 text-text-muted hover:text-text-secondary'
                }`}
              >
                WAHR
              </button>
              <button
                onClick={() => setEditForm(prev => ({ ...prev, isTrue: false }))}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  !editForm.isTrue
                    ? 'bg-error/20 border-error/40 text-error'
                    : 'bg-bg-card border-gray-700 text-text-muted hover:text-text-secondary'
                }`}
              >
                FALSCH
              </button>
            </div>

            <div>
              <label className="block text-[10px] text-text-muted mb-1">Erklaerung (optional)</label>
              <input
                type="text"
                value={editForm.explanation}
                onChange={(e) => setEditForm(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Wird nach der Antwort angezeigt..."
                className="w-full bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addStatement}
                disabled={!editForm.text.trim()}
                className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                {editingId ? 'Speichern' : 'Hinzufuegen'}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
              )}
            </div>
          </div>

          {/* Statement List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-muted font-medium">
                Aussagen ({data.statements.length})
              </p>
              {data.statements.length > 0 && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-success">{trueCount} wahr</span>
                  <span className="text-error">{falseCount} falsch</span>
                </div>
              )}
            </div>
            {data.statements.length > 0 ? (
              <div className="space-y-1.5">
                {data.statements.map((statement, index) => (
                  <div
                    key={statement.id}
                    className={`flex items-start gap-2 bg-bg-secondary rounded-lg px-3 py-2.5 group ${
                      editingId === statement.id ? 'ring-1 ring-accent/50' : ''
                    }`}
                  >
                    <GripVertical size={14} className="text-text-muted/40 mt-0.5" />
                    <span className="text-xs text-text-muted w-5 text-right mt-0.5">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{statement.text}</p>
                      {statement.explanation && (
                        <p className="text-[10px] text-text-muted mt-0.5 italic truncate">{statement.explanation}</p>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      statement.isTrue ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                    }`}>
                      {statement.isTrue ? 'W' : 'F'}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => editStatement(statement)}
                        className="text-text-muted hover:text-accent transition-colors cursor-pointer p-0.5"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => removeStatement(statement.id)}
                        className="text-text-muted hover:text-error transition-colors cursor-pointer p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                Erstelle Aussagen, die wahr oder falsch sein koennen.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

TrueFalseEditor.defaultData = DEFAULT_DATA
