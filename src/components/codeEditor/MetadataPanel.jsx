import { useState } from 'react'
import { X, Tag } from 'lucide-react'
import { SUBJECT_CONFIG } from '../../data/subjectConfig'

const SUGGESTED_TAGS = [
  'mathematik', 'physik', 'chemie', 'biologie', 'deutsch', 'englisch',
  'informatik', 'quiz', 'interaktiv', 'simulation',
]

export default function MetadataPanel({ metadata, onChange, onClose }) {
  const [tagInput, setTagInput] = useState('')

  const subjects = Object.entries(SUBJECT_CONFIG).map(([key, val]) => ({
    value: key, label: val.label, icon: val.icon,
  }))

  const addTag = (tag) => {
    const cleaned = tag.toLowerCase().trim().replace(/[^a-z0-9äöüß-]/g, '')
    if (!cleaned || (metadata.tags || []).includes(cleaned) || (metadata.tags || []).length >= 10) return
    onChange({ tags: [...(metadata.tags || []), cleaned] })
    setTagInput('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-96 bg-bg-secondary h-full overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Metadaten</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label>Titel *</label>
            <input type="text" value={metadata.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="Spieltitel" maxLength={100} />
          </div>

          <div>
            <label>Beschreibung *</label>
            <textarea value={metadata.description || ''} onChange={(e) => onChange({ description: e.target.value })} placeholder="Beschreibe dein Spiel..." rows={4} maxLength={2000} />
          </div>

          <div>
            <label>Fach</label>
            <select value={metadata.subject || ''} onChange={(e) => onChange({ subject: e.target.value })} className="w-full">
              <option value="">Waehle ein Fach...</option>
              {subjects.map(s => (
                <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Tags</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {(metadata.tags || []).map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-accent/15 text-accent px-2 py-0.5 rounded-full text-xs">
                  #{tag}
                  <button onClick={() => onChange({ tags: metadata.tags.filter(t => t !== tag) })} className="cursor-pointer"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }} placeholder="Tag..." className="!flex-1 !text-sm" />
              <button onClick={() => addTag(tagInput)} className="bg-bg-card px-3 py-1 rounded-lg text-text-muted cursor-pointer"><Tag size={14} /></button>
            </div>
          </div>

          <div>
            <label>Preis</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 !mb-0 cursor-pointer">
                <input type="radio" checked={!metadata.premium} onChange={() => onChange({ premium: false, price: 0 })} className="!w-4 !h-4" />
                <span className="text-sm">Kostenlos</span>
              </label>
              <label className="flex items-center gap-2 !mb-0 cursor-pointer">
                <input type="radio" checked={metadata.premium} onChange={() => onChange({ premium: true, price: metadata.price || 10 })} className="!w-4 !h-4" />
                <span className="text-sm">MC:</span>
                {metadata.premium && <input type="number" value={metadata.price || 0} onChange={(e) => onChange({ price: parseInt(e.target.value) || 0 })} min={1} max={9999} className="!w-20 !py-1 !text-sm" />}
              </label>
            </div>
          </div>

          <div>
            <label>Sichtbarkeit</label>
            <select value={metadata.visibility || 'public'} onChange={(e) => onChange({ visibility: e.target.value })} className="w-full">
              <option value="public">Oeffentlich</option>
              <option value="unlisted">Ungelistet</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
