import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Eye, EyeOff, ArrowUpDown, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

const DEFAULT_DATA = {
  title: '',
  description: '',
  items: [],  // { id, text } - order in array = correct order
}

export default function SortingEditor({ data: initialData, onChange }) {
  const { t } = useTranslation()
  const [data, setData] = useState(initialData || DEFAULT_DATA)
  const [showPreview, setShowPreview] = useState(false)
  const [newItem, setNewItem] = useState('')

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange?.({ type: 'sorting', data: next })
      return next
    })
  }, [onChange])

  const addItem = () => {
    const trimmed = newItem.trim()
    if (!trimmed) return
    const item = {
      id: `si-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
    }
    update({ items: [...data.items, item] })
    setNewItem('')
  }

  const removeItem = (id) => {
    update({ items: data.items.filter(i => i.id !== id) })
  }

  const moveItem = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= data.items.length) return
    const newItems = [...data.items]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    update({ items: newItems })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <ArrowUpDown size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {t('gameBuilder.sorting.title', 'Sortierung Editor')}
            </h3>
            <p className="text-xs text-text-muted">
              {t('gameBuilder.sorting.subtitle', 'Erstelle eine Sortieraufgabe')}
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
        <div className="bg-bg-secondary rounded-xl p-5 border border-gray-700/50 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-text-primary mb-1">
              {data.title || 'Sortieraufgabe'}
            </h4>
            {data.description && (
              <p className="text-xs text-text-secondary">{data.description}</p>
            )}
          </div>
          <p className="text-xs text-text-muted font-medium">
            Korrekte Reihenfolge ({data.items.length} Elemente):
          </p>
          {data.items.length > 0 ? (
            <div className="space-y-1.5">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-bg-card rounded-lg px-3 py-2"
                >
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-primary">{item.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm italic">Noch keine Elemente hinzugefuegt.</p>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <>
          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-muted mb-1 font-medium">
                {t('gameBuilder.sorting.taskTitle', 'Aufgabentitel')}
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="z.B. Sortiere die Planeten nach Groesse"
                className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1 font-medium">
                {t('gameBuilder.sorting.taskDescription', 'Beschreibung (optional)')}
              </label>
              <textarea
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Optionale Hinweise fuer den Spieler..."
                rows={2}
                className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
              />
            </div>
          </div>

          {/* Add Item */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5 font-medium">
              {t('gameBuilder.sorting.items', 'Elemente (Reihenfolge = korrekte Sortierung)')}
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder="Element eingeben..."
                className="flex-1 bg-bg-secondary border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={addItem}
                disabled={!newItem.trim()}
                className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Item List */}
            {data.items.length > 0 ? (
              <div className="space-y-1.5">
                {data.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-bg-secondary rounded-lg px-3 py-2.5 group"
                  >
                    <GripVertical size={14} className="text-text-muted/40" />
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm text-text-primary">{item.text}</span>
                    <div className="flex items-center gap-1 hover-show transition-opacity">
                      <button
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-0.5"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(index, 1)}
                        disabled={index === data.items.length - 1}
                        className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer p-0.5"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
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
                Fuege Elemente in der korrekten Reihenfolge hinzu. Die Reihenfolge hier bestimmt die richtige Loesung.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

SortingEditor.defaultData = DEFAULT_DATA
