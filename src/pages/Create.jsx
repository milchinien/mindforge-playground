import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Image, FileArchive, Tag, Trash2, Edit3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { mockGames } from '../data/mockGames'
import GameCard from '../components/game/GameCard'
import Modal from '../components/common/Modal'
import ProgressBar from '../components/common/ProgressBar'

// Suggested tags
const SUGGESTED_TAGS = [
  'mathematik', 'physik', 'chemie', 'biologie', 'deutsch', 'englisch',
  'geschichte', 'geographie', 'informatik', 'kunst', 'musik',
  'quiz', 'simulation', 'puzzle', 'adventure', 'strategie',
  'grundschule', 'mittelstufe', 'oberstufe', 'interaktiv'
]

function validateForm(formData) {
  const errors = {}
  if (!formData.title.trim()) errors.title = 'Titel ist erforderlich.'
  else if (formData.title.length < 3) errors.title = 'Titel muss mindestens 3 Zeichen lang sein.'
  else if (formData.title.length > 100) errors.title = 'Titel darf maximal 100 Zeichen lang sein.'

  if (!formData.description.trim()) errors.description = 'Beschreibung ist erforderlich.'
  else if (formData.description.length < 10) errors.description = 'Beschreibung muss mindestens 10 Zeichen lang sein.'
  else if (formData.description.length > 2000) errors.description = 'Beschreibung darf maximal 2000 Zeichen lang sein.'

  if (!formData.gameFile) errors.gameFile = 'Bitte waehle eine ZIP-Datei aus.'
  else if (!formData.gameFile.name.endsWith('.zip')) errors.gameFile = 'Nur ZIP-Dateien sind erlaubt.'
  else if (formData.gameFile.size > 200 * 1024 * 1024) errors.gameFile = 'Die Datei darf maximal 200 MB gross sein.'

  if (!formData.thumbnail) errors.thumbnail = 'Bitte waehle ein Thumbnail aus.'
  else if (formData.thumbnail.size > 5 * 1024 * 1024) errors.thumbnail = 'Das Thumbnail darf maximal 5 MB gross sein.'

  if (formData.tags.length === 0) errors.tags = 'Mindestens ein Tag ist erforderlich.'

  if (!formData.isFree && formData.price < 1) errors.price = 'Preis muss mindestens 1 MindCoin betragen.'

  return errors
}

function DropZone({ onFileSelect, file, error }) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) onFileSelect(droppedFile)
      }}
      onClick={() => document.getElementById('game-file-input').click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragOver
          ? 'border-accent bg-accent/10'
          : error
            ? 'border-error bg-error/5'
            : 'border-gray-600 hover:border-gray-500'
      }`}
    >
      {file ? (
        <div>
          <FileArchive className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="font-semibold text-text-primary">{file.name}</p>
          <p className="text-text-muted text-sm">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      ) : (
        <div>
          <Upload className="w-8 h-8 mx-auto mb-2 text-text-muted" />
          <p className="font-semibold text-text-primary">Datei auswaehlen oder hierher ziehen</p>
          <p className="text-text-muted text-sm mt-1">ZIP-Datei, max. 200 MB, muss index.html enthalten</p>
        </div>
      )}
      <input
        type="file"
        accept=".zip"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="hidden"
        id="game-file-input"
      />
    </div>
  )
}

export default function Create() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameFile: null,
    thumbnail: null,
    thumbnailPreview: null,
    screenshots: [],
    screenshotPreviews: [],
    tags: [],
    price: 0,
    isFree: true,
  })

  const [tagInput, setTagInput] = useState('')
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [errors, setErrors] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStep, setUploadStep] = useState('')
  const [editGame, setEditGame] = useState(null)

  // My games
  const myGames = user ? mockGames.filter(g => g.creatorId === user.uid) : []

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    updateField('thumbnail', file)
    const reader = new FileReader()
    reader.onload = () => updateField('thumbnailPreview', reader.result)
    reader.readAsDataURL(file)
  }

  const handleScreenshotAdd = (e) => {
    const files = Array.from(e.target.files)
    if (formData.screenshots.length + files.length > 5) return

    const newScreenshots = [...formData.screenshots, ...files]
    const newPreviews = [...formData.screenshotPreviews]

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        newPreviews.push(reader.result)
        setFormData(prev => ({ ...prev, screenshotPreviews: [...newPreviews] }))
      }
      reader.readAsDataURL(file)
    })

    updateField('screenshots', newScreenshots)
  }

  const removeScreenshot = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
      screenshotPreviews: prev.screenshotPreviews.filter((_, i) => i !== index),
    }))
  }

  const addTag = (tag) => {
    const cleaned = tag.toLowerCase().trim().replace(/[^a-z0-9äöüß-]/g, '')
    if (!cleaned || cleaned.length < 2 || cleaned.length > 30) return
    if (formData.tags.length >= 10 || formData.tags.includes(cleaned)) return
    updateField('tags', [...formData.tags, cleaned])
    setTagInput('')
  }

  const removeTag = (tag) => {
    updateField('tags', formData.tags.filter(t => t !== tag))
  }

  const handleUpload = async () => {
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsUploading(true)
    setErrors({})

    // Simulate upload process
    const steps = [
      { step: 'Validiere Daten...', progress: 10 },
      { step: 'Bereite Upload vor...', progress: 15 },
      { step: 'Lade Spiel-Datei hoch...', progress: 45 },
      { step: 'Lade Thumbnail hoch...', progress: 72 },
      { step: 'Lade Screenshots hoch...', progress: 85 },
      { step: 'Erstelle Spieleintrag...', progress: 92 },
      { step: 'Aktualisiere Profil...', progress: 97 },
      { step: 'Fertig!', progress: 100 },
    ]

    for (const { step, progress } of steps) {
      setUploadStep(step)
      setUploadProgress(progress)
      await new Promise(r => setTimeout(r, 500))
    }

    // For MVP: simulate success
    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStep('')
      // Reset form
      setFormData({
        title: '', description: '', gameFile: null, thumbnail: null,
        thumbnailPreview: null, screenshots: [], screenshotPreviews: [],
        tags: [], price: 0, isFree: true,
      })
      navigate('/browse')
    }, 1000)
  }

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    t => t.includes(tagInput.toLowerCase()) && !formData.tags.includes(t)
  ).slice(0, 5)

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Spiel erstellen</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label>Titel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Gib deinem Spiel einen Titel..."
            maxLength={100}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label>Beschreibung</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Beschreibe dein Spiel..."
            rows={5}
            maxLength={2000}
          />
          <p className="text-text-muted text-xs mt-1 text-right">{formData.description.length}/2000</p>
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        {/* Game File (ZIP) */}
        <div>
          <label>Spiel-Datei (ZIP)</label>
          <DropZone
            onFileSelect={(file) => updateField('gameFile', file)}
            file={formData.gameFile}
            error={errors.gameFile}
          />
          {errors.gameFile && <p className="form-error">{errors.gameFile}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label>Thumbnail</label>
          <div className="flex items-center gap-4">
            {formData.thumbnailPreview ? (
              <div className="relative">
                <img
                  src={formData.thumbnailPreview}
                  alt="Thumbnail Vorschau"
                  className="w-40 h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => { updateField('thumbnail', null); updateField('thumbnailPreview', null) }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-40 h-24 bg-bg-card rounded-lg flex items-center justify-center border border-dashed border-gray-600">
                <Image size={24} className="text-text-muted" />
              </div>
            )}
            <div>
              <label htmlFor="thumbnail-input" className="bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer inline-block !mb-0">
                Bild auswaehlen
              </label>
              <input
                id="thumbnail-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              <p className="text-text-muted text-xs mt-1">PNG, JPG oder WebP. Max 5 MB.</p>
            </div>
          </div>
          {errors.thumbnail && <p className="form-error">{errors.thumbnail}</p>}
        </div>

        {/* Screenshots */}
        <div>
          <label>Screenshots (optional, max 5)</label>
          <div className="flex flex-wrap gap-2">
            {formData.screenshotPreviews.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Screenshot ${idx + 1}`} className="w-24 h-16 object-cover rounded-lg" />
                <button
                  onClick={() => removeScreenshot(idx)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error rounded-full flex items-center justify-center text-white"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {formData.screenshots.length < 5 && (
              <label className="w-24 h-16 bg-bg-card rounded-lg flex items-center justify-center border border-dashed border-gray-600 cursor-pointer hover:border-gray-500 transition-colors">
                <Plus size={20} className="text-text-muted" />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleScreenshotAdd}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label>Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-primary/20 text-primary-light px-3 py-1 rounded-full text-sm">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-error transition-colors cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          {formData.tags.length < 10 && (
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true) }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); setShowTagSuggestions(false) } }}
                  placeholder="Tag hinzufuegen..."
                  className="!flex-1"
                />
                <button
                  onClick={() => { addTag(tagInput); setShowTagSuggestions(false) }}
                  className="bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Tag size={16} />
                </button>
              </div>
              {showTagSuggestions && tagInput && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-12 mt-1 bg-bg-secondary border border-gray-700 rounded-lg overflow-hidden z-10 shadow-lg">
                  {filteredSuggestions.map(tag => (
                    <button
                      key={tag}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { addTag(tag); setShowTagSuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {errors.tags && <p className="form-error">{errors.tags}</p>}
          <p className="text-text-muted text-xs mt-1">{formData.tags.length}/10 Tags</p>
        </div>

        {/* Price */}
        <div>
          <label>Preis</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer !mb-0">
              <input
                type="radio"
                checked={formData.isFree}
                onChange={() => updateField('isFree', true)}
                className="!w-4 !h-4"
              />
              <span className="text-text-primary text-sm">Kostenlos</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer !mb-0">
              <input
                type="radio"
                checked={!formData.isFree}
                onChange={() => updateField('isFree', false)}
                className="!w-4 !h-4"
              />
              <span className="text-text-primary text-sm">MindCoins:</span>
              {!formData.isFree && (
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
                  min={1}
                  max={9999}
                  className="!w-24 !py-1 !text-sm"
                />
              )}
            </label>
          </div>
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-bg-secondary rounded-xl p-6">
            <p className="text-text-secondary mb-2">{uploadStep}</p>
            <ProgressBar value={uploadProgress} max={100} />
            <p className="text-text-muted text-sm mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Upload Error */}
        {errors.upload && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-error">{errors.upload}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg"
        >
          {isUploading ? 'Wird hochgeladen...' : 'Spiel hochladen'}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-10" />

      {/* My Games */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Meine Spiele ({myGames.length})</h2>
        {myGames.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {myGames.map(game => (
              <div key={game.id} className="relative group">
                <GameCard game={game} />
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditGame(game) }}
                    className="bg-bg-secondary/90 hover:bg-bg-card p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} className="text-text-secondary" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); alert('Loeschen ist im MVP nur simuliert.') }}
                    className="bg-bg-secondary/90 hover:bg-error/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} className="text-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">
            Du hast noch keine Spiele erstellt. Lade dein erstes Spiel hoch!
          </p>
        )}
      </div>

      {/* Edit Game Modal */}
      <Modal
        isOpen={!!editGame}
        onClose={() => setEditGame(null)}
        title="Spiel bearbeiten"
      >
        {editGame && (
          <div className="space-y-4">
            <div>
              <label>Titel</label>
              <input type="text" defaultValue={editGame.title} />
            </div>
            <div>
              <label>Beschreibung</label>
              <textarea defaultValue={editGame.description} rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditGame(null)}
                className="flex-1 bg-bg-card hover:bg-bg-hover text-text-secondary py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={() => { setEditGame(null); alert('Speichern ist im MVP nur simuliert.') }}
                className="flex-1 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                Speichern
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
