import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Eye, EyeOff, Layers, GripVertical, ChevronUp, ChevronDown, Image, Tag } from 'lucide-react'

const DEFAULT_DATA = {
  cards: [],  // { id, front, back, imageUrl?, category? }
}

export default function FlashcardEditor({ data: initialData, onChange }) {
  const { t } = useTranslation()
  const [data, setData] = useState(initialData || DEFAULT_DATA)
  const [showPreview, setShowPreview] = useState(false)
  const [editForm, setEditForm] = useState({ front: '', back: '', imageUrl: '', category: '' })
  const [previewFlipped, setPreviewFlipped] = useState(null)

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange?.({ type: 'flashcard', data: next })
      return next
    })
  }, [onChange])

  const addCard = () => {
    if (!editForm.front.trim() || !editForm.back.trim()) return
    const card = {
      id: `fc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      front: editForm.front.trim(),
      back: editForm.back.trim(),
      imageUrl: editForm.imageUrl.trim() || null,
      category: editForm.category.trim() || null,
    }
    update({ cards: [...data.cards, card] })
    setEditForm({ front: '', back: '', imageUrl: '', category: '' })
  }

  const removeCard = (id) => {
    update({ cards: data.cards.filter(c => c.id !== id) })
  }

  const moveCard = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= data.cards.length) return
    const newCards = [...data.cards]
    ;[newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]]
    update({ cards: newCards })
  }

  const categories = [...new Set(data.cards.map(c => c.category).filter(Boolean))]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {t('gameBuilder.flashcard.title', 'Karteikarten Editor')}
            </h3>
            <p className="text-xs text-text-muted">
              {t('gameBuilder.flashcard.subtitle', 'Erstelle Lernkarten mit Vorder- und Rueckseite')}
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
        <div className="space-y-3">
          <p className="text-xs text-text-muted font-medium">
            Vorschau ({data.cards.length} Karten) - Klicke zum Umdrehen
          </p>
          {data.cards.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {data.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setPreviewFlipped(previewFlipped === card.id ? null : card.id)}
                  className="relative cursor-pointer select-none"
                  style={{ perspective: '600px' }}
                >
                  <div
                    className="relative transition-transform duration-500"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: previewFlipped === card.id ? 'rotateY(180deg)' : 'rotateY(0)',
                      minHeight: '100px',
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 bg-bg-secondary border border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {card.category && (
                        <span className="absolute top-2 left-2 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                          {card.category}
                        </span>
                      )}
                      <p className="text-sm text-text-primary font-medium text-center">{card.front}</p>
                      <p className="text-[10px] text-text-muted mt-2">Klicken zum Umdrehen</p>
                    </div>
                    {/* Back */}
                    <div
                      className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <p className="text-sm text-accent font-medium text-center">{card.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm italic">Noch keine Karten erstellt.</p>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <>
          {/* Add Card Form */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-gray-700/50 space-y-3">
            <p className="text-xs text-text-muted font-medium">Neue Karte hinzufuegen</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-text-muted mb-1">Vorderseite (Frage)</label>
                <textarea
                  value={editForm.front}
                  onChange={(e) => setEditForm(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="Was ist die Hauptstadt von Frankreich?"
                  rows={2}
                  className="w-full bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-1">Rueckseite (Antwort)</label>
                <textarea
                  value={editForm.back}
                  onChange={(e) => setEditForm(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="Paris"
                  rows={2}
                  className="w-full bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Image size={14} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Bild-URL (optional)"
                  className="flex-1 bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Kategorie"
                  className="w-32 bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <button
                onClick={addCard}
                disabled={!editForm.front.trim() || !editForm.back.trim()}
                className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus size={14} />
                Hinzufuegen
              </button>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={12} className="text-text-muted" />
              {categories.map(cat => (
                <span key={cat} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {cat} ({data.cards.filter(c => c.category === cat).length})
                </span>
              ))}
            </div>
          )}

          {/* Card List */}
          <div>
            <p className="text-xs text-text-muted mb-2 font-medium">
              Karten ({data.cards.length})
            </p>
            {data.cards.length > 0 ? (
              <div className="space-y-1.5">
                {data.cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2.5 group"
                  >
                    <GripVertical size={14} className="text-text-muted/40 flex-shrink-0" />
                    <span className="text-xs text-text-muted w-5 text-right flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-primary truncate">{card.front}</span>
                        <span className="text-text-muted flex-shrink-0">&rarr;</span>
                        <span className="text-accent truncate">{card.back}</span>
                      </div>
                      {card.category && (
                        <span className="text-[10px] text-text-muted">{card.category}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 hover-show transition-opacity">
                      <button
                        onClick={() => moveCard(index, -1)}
                        disabled={index === 0}
                        className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-0.5"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveCard(index, 1)}
                        disabled={index === data.cards.length - 1}
                        className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-0.5"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => removeCard(card.id)}
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
                Noch keine Karten. Fuege Lernkarten mit Frage und Antwort hinzu.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

FlashcardEditor.defaultData = DEFAULT_DATA
