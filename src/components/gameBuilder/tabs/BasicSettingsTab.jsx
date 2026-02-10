import { useState } from 'react'
import { X, Tag } from 'lucide-react'
import { SUBJECT_CONFIG } from '../../../data/subjectConfig'

const SUGGESTED_TAGS = [
  'mathematik', 'physik', 'chemie', 'biologie', 'deutsch', 'englisch',
  'geschichte', 'geographie', 'informatik', 'kunst', 'musik',
  'quiz', 'grundschule', 'mittelstufe', 'oberstufe', 'interaktiv',
]

const subjects = Object.entries(SUBJECT_CONFIG).map(([key, val]) => ({
  value: key,
  label: val.label,
  icon: val.icon,
}))

export default function BasicSettingsTab({ gameData, onChange }) {
  const [tagInput, setTagInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag) => {
    const cleaned = tag.toLowerCase().trim().replace(/[^a-z0-9äöüß-]/g, '')
    if (!cleaned || cleaned.length < 2 || gameData.tags.length >= 10 || gameData.tags.includes(cleaned)) return
    onChange({ tags: [...gameData.tags, cleaned] })
    setTagInput('')
  }

  const removeTag = (tag) => {
    onChange({ tags: gameData.tags.filter(t => t !== tag) })
  }

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    t => t.includes(tagInput.toLowerCase()) && !gameData.tags.includes(t)
  ).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4">Grundeinstellungen</h2>
        <p className="text-text-muted text-sm mb-6">Lege die Basis deines Spiels fest.</p>
      </div>

      {/* Game Type (locked to Quiz for now) */}
      <div>
        <label>Spieltyp</label>
        <div className="bg-bg-secondary rounded-lg px-4 py-3 text-text-secondary text-sm">
          Quiz (weitere Typen folgen)
        </div>
      </div>

      {/* Title */}
      <div>
        <label>Titel *</label>
        <input
          type="text"
          value={gameData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="z.B. Mathe-Quiz fuer die 5. Klasse"
          maxLength={100}
        />
        <p className="text-text-muted text-xs mt-1 text-right">{gameData.title.length}/100</p>
      </div>

      {/* Description */}
      <div>
        <label>Beschreibung *</label>
        <textarea
          value={gameData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Beschreibe dein Spiel in wenigen Saetzen..."
          rows={4}
          maxLength={2000}
        />
        <p className="text-text-muted text-xs mt-1 text-right">{gameData.description.length}/2000</p>
      </div>

      {/* Subject */}
      <div>
        <label>Fach *</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {subjects.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ subject: s.value })}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors cursor-pointer text-center ${
                gameData.subject === s.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-700 hover:border-gray-500 text-text-secondary'
              }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label>Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {gameData.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-accent/15 text-accent px-3 py-1 rounded-full text-sm">
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        {gameData.tags.length < 10 && (
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => { setTagInput(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); setShowSuggestions(false) } }}
                placeholder="Tag hinzufuegen..."
                className="!flex-1"
              />
              <button
                onClick={() => { addTag(tagInput); setShowSuggestions(false) }}
                className="bg-bg-secondary hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Tag size={16} />
              </button>
            </div>
            {showSuggestions && tagInput && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-12 mt-1 bg-bg-secondary border border-gray-700 rounded-lg overflow-hidden z-10 shadow-lg">
                {filteredSuggestions.map(tag => (
                  <button
                    key={tag}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { addTag(tag); setShowSuggestions(false) }}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="text-text-muted text-xs mt-1">{gameData.tags.length}/10 Tags</p>
      </div>
    </div>
  )
}
