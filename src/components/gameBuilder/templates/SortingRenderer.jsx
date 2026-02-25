import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpDown, RotateCcw, CheckCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SortingRenderer({ data }) {
  const { t } = useTranslation()
  const { title = 'Sortieraufgabe', description = '', items = [] } = data || {}

  const correctOrder = useMemo(() => items.map(i => i.id), [items])
  const [currentItems, setCurrentItems] = useState(() => shuffleArray(items))
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const handleItemClick = (index) => {
    if (checked) return

    if (selectedIndex === null) {
      setSelectedIndex(index)
    } else if (selectedIndex === index) {
      setSelectedIndex(null)
    } else {
      // Swap the two items
      const newItems = [...currentItems]
      ;[newItems[selectedIndex], newItems[index]] = [newItems[index], newItems[selectedIndex]]
      setCurrentItems(newItems)
      setSelectedIndex(null)
    }
  }

  const moveItem = (index, direction) => {
    if (checked) return
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= currentItems.length) return
    const newItems = [...currentItems]
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    setCurrentItems(newItems)
  }

  const checkOrder = () => {
    const res = currentItems.map((item, i) => item.id === correctOrder[i])
    setResults(res)
    setChecked(true)
  }

  const reset = () => {
    setCurrentItems(shuffleArray(items))
    setChecked(false)
    setResults([])
    setSelectedIndex(null)
  }

  const correctCount = results.filter(Boolean).length
  const allCorrect = correctCount === items.length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <ArrowUpDown size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">
            {t('gameBuilder.sorting.playTitle', 'Sortierung')}
          </h3>
        </div>
      </div>

      {/* Task info */}
      <div className="bg-bg-secondary rounded-lg px-4 py-3 border border-gray-700/50">
        <h4 className="text-sm font-bold text-text-primary mb-0.5">{title}</h4>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
        {!checked && (
          <p className="text-xs text-text-muted mt-1.5">
            Klicke auf zwei Elemente um sie zu tauschen, oder nutze die Pfeile.
          </p>
        )}
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {currentItems.map((item, index) => {
          const isSelected = selectedIndex === index
          let bgClass = 'bg-bg-secondary border-gray-700 hover:border-gray-500'
          let numberClass = 'bg-bg-card text-text-muted'

          if (checked) {
            if (results[index]) {
              bgClass = 'bg-success/10 border-success/30'
              numberClass = 'bg-success/20 text-success'
            } else {
              bgClass = 'bg-error/10 border-error/30'
              numberClass = 'bg-error/20 text-error'
            }
          } else if (isSelected) {
            bgClass = 'bg-accent/10 border-accent/40 scale-[1.02]'
            numberClass = 'bg-accent/20 text-accent'
          }

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(index)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 border cursor-pointer transition-all ${bgClass}`}
            >
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${numberClass}`}>
                {index + 1}
              </span>
              <span className={`flex-1 text-sm font-medium ${
                checked
                  ? results[index] ? 'text-success' : 'text-error'
                  : 'text-text-primary'
              }`}>
                {item.text}
              </span>
              {!checked && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(index, -1) }}
                    disabled={index === 0}
                    className="text-text-muted hover:text-text-primary disabled:opacity-20 cursor-pointer p-1 transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(index, 1) }}
                    disabled={index === currentItems.length - 1}
                    className="text-text-muted hover:text-text-primary disabled:opacity-20 cursor-pointer p-1 transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
              {checked && (
                results[index]
                  ? <CheckCircle size={16} className="text-success flex-shrink-0" />
                  : <XCircle size={16} className="text-error flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {!checked ? (
          <button
            onClick={checkOrder}
            disabled={currentItems.length < 2}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-40 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            <CheckCircle size={16} />
            {t('gameBuilder.sorting.check', 'Reihenfolge pruefen')}
          </button>
        ) : (
          <>
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold ${
              allCorrect
                ? 'bg-success/20 text-success'
                : 'bg-warning/20 text-warning'
            }`}>
              {allCorrect ? (
                <><CheckCircle size={16} /> Perfekte Reihenfolge!</>
              ) : (
                <><XCircle size={16} /> {correctCount} von {items.length} richtig</>
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
