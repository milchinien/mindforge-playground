import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Eye, EyeOff, LayoutGrid, Image } from 'lucide-react'

const GRID_OPTIONS = [
  { label: '2x2', cols: 2, rows: 2, pairs: 2 },
  { label: '3x2', cols: 3, rows: 2, pairs: 3 },
  { label: '4x3', cols: 4, rows: 3, pairs: 6 },
  { label: '4x4', cols: 4, rows: 4, pairs: 8 },
  { label: '4x5', cols: 4, rows: 5, pairs: 10 },
]

const DEFAULT_DATA = {
  gridSize: '4x3',
  pairs: [],   // { id, front, back, imageUrl? }
}

export default function MemoryEditor({ data: initialData, onChange }) {
  const { t } = useTranslation()
  const [data, setData] = useState(initialData || DEFAULT_DATA)
  const [showPreview, setShowPreview] = useState(false)
  const [editingPair, setEditingPair] = useState({ front: '', back: '', imageUrl: '' })

  const selectedGrid = GRID_OPTIONS.find(g => g.label === data.gridSize) || GRID_OPTIONS[2]

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      onChange?.({ type: 'memory', data: next })
      return next
    })
  }, [onChange])

  const addPair = () => {
    if (!editingPair.front.trim() || !editingPair.back.trim()) return
    const pair = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      front: editingPair.front.trim(),
      back: editingPair.back.trim(),
      imageUrl: editingPair.imageUrl.trim() || null,
    }
    update({ pairs: [...data.pairs, pair] })
    setEditingPair({ front: '', back: '', imageUrl: '' })
  }

  const removePair = (id) => {
    update({ pairs: data.pairs.filter(p => p.id !== id) })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <LayoutGrid size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              {t('gameBuilder.memory.title', 'Memory Editor')}
            </h3>
            <p className="text-xs text-text-muted">
              {t('gameBuilder.memory.subtitle', 'Erstelle Kartenpaare zum Aufdecken')}
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

      {/* Grid Size Selector */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 font-medium">
          {t('gameBuilder.memory.gridSize', 'Rastergroesse')}
        </label>
        <div className="flex gap-2">
          {GRID_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => update({ gridSize: opt.label })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                data.gridSize === opt.label
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-bg-secondary border-gray-700 text-text-secondary hover:border-gray-500'
              }`}
            >
              {opt.label} ({opt.pairs} Paare)
            </button>
          ))}
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-bg-secondary rounded-xl p-5 border border-gray-700/50">
          <p className="text-xs text-text-muted mb-3 font-medium">
            Vorschau ({data.pairs.length}/{selectedGrid.pairs} Paare)
          </p>
          {data.pairs.length > 0 ? (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${selectedGrid.cols}, 1fr)` }}
            >
              {data.pairs.slice(0, selectedGrid.pairs).flatMap(pair => [
                <div
                  key={`${pair.id}-f`}
                  className="bg-bg-card border border-gray-600 rounded-lg p-2 text-center text-xs text-text-secondary min-h-[60px] flex items-center justify-center"
                >
                  {pair.front}
                </div>,
                <div
                  key={`${pair.id}-b`}
                  className="bg-accent/10 border border-accent/30 rounded-lg p-2 text-center text-xs text-accent min-h-[60px] flex items-center justify-center"
                >
                  {pair.back}
                </div>,
              ])}
            </div>
          ) : (
            <p className="text-text-muted text-sm italic">Noch keine Paare erstellt.</p>
          )}
        </div>
      ) : (
        /* Editor Mode */
        <>
          {/* Add Pair Form */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-gray-700/50 space-y-3">
            <p className="text-xs text-text-muted font-medium">Neues Paar hinzufuegen</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={editingPair.front}
                onChange={(e) => setEditingPair(prev => ({ ...prev, front: e.target.value }))}
                placeholder="Vorderseite (z.B. Frage)"
                className="bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
              <input
                type="text"
                value={editingPair.back}
                onChange={(e) => setEditingPair(prev => ({ ...prev, back: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addPair()}
                placeholder="Rueckseite (z.B. Antwort)"
                className="bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2">
                <Image size={14} className="text-text-muted" />
                <input
                  type="text"
                  value={editingPair.imageUrl}
                  onChange={(e) => setEditingPair(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Bild-URL (optional)"
                  className="flex-1 bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <button
                onClick={addPair}
                disabled={!editingPair.front.trim() || !editingPair.back.trim() || data.pairs.length >= selectedGrid.pairs}
                className="bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                Hinzufuegen
              </button>
            </div>
            {data.pairs.length >= selectedGrid.pairs && (
              <p className="text-xs text-warning">
                Maximale Anzahl fuer {data.gridSize}-Raster erreicht ({selectedGrid.pairs} Paare).
              </p>
            )}
          </div>

          {/* Pair List */}
          <div>
            <p className="text-xs text-text-muted mb-2 font-medium">
              Paare ({data.pairs.length}/{selectedGrid.pairs})
            </p>
            {data.pairs.length > 0 ? (
              <div className="space-y-2">
                {data.pairs.map((pair, index) => (
                  <div
                    key={pair.id}
                    className="flex items-center gap-3 bg-bg-secondary rounded-lg px-3 py-2.5 group"
                  >
                    <span className="text-xs text-text-muted w-5 text-right">{index + 1}.</span>
                    <div className="flex-1 flex items-center gap-2 text-sm">
                      <span className="text-text-primary">{pair.front}</span>
                      <span className="text-text-muted">&harr;</span>
                      <span className="text-accent">{pair.back}</span>
                      {pair.imageUrl && (
                        <Image size={12} className="text-text-muted" />
                      )}
                    </div>
                    <button
                      onClick={() => removePair(pair.id)}
                      className="text-text-muted hover:text-error transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                Erstelle mindestens {selectedGrid.pairs} Paare fuer das {data.gridSize}-Raster.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

MemoryEditor.defaultData = DEFAULT_DATA
