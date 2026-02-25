import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Upload, X, Plus, Image, FileArchive, Tag, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ProgressBar from '../components/common/ProgressBar'
import ModeSelector from '../components/gameBuilder/ModeSelector'
import GameBuilderPage from '../components/gameBuilder/GameBuilderPage'

// Suggested tags
const SUGGESTED_TAGS = [
  'mathematik', 'physik', 'chemie', 'biologie', 'deutsch', 'englisch',
  'geschichte', 'geographie', 'informatik', 'kunst', 'musik',
  'quiz', 'simulation', 'puzzle', 'adventure', 'strategie',
  'grundschule', 'mittelstufe', 'oberstufe', 'interaktiv'
]

function validateForm(formData, t) {
  const errors = {}
  if (!formData.title.trim()) errors.title = t('create.errors.titleRequired')
  else if (formData.title.length < 3) errors.title = t('create.errors.titleMin')
  else if (formData.title.length > 100) errors.title = t('create.errors.titleMax')

  if (!formData.description.trim()) errors.description = t('create.errors.descRequired')
  else if (formData.description.length < 10) errors.description = t('create.errors.descMin')
  else if (formData.description.length > 2000) errors.description = t('create.errors.descMax')

  if (!formData.gameFile) errors.gameFile = t('create.errors.zipRequired')
  else if (!formData.gameFile.name.endsWith('.zip')) errors.gameFile = t('create.errors.zipOnly')
  else if (formData.gameFile.size > 200 * 1024 * 1024) errors.gameFile = t('create.errors.fileSize')

  if (!formData.thumbnail) errors.thumbnail = t('create.errors.thumbRequired')
  else if (formData.thumbnail.size > 5 * 1024 * 1024) errors.thumbnail = t('create.errors.thumbSize')

  if (formData.tags.length === 0) errors.tags = t('create.errors.tagRequired')

  if (!formData.isFree && formData.price < 1) errors.price = t('create.errors.priceMin')

  return errors
}

function DropZone({ onFileSelect, file, error, t }) {
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
          <p className="font-semibold text-text-primary">{t('create.dropFile')}</p>
          <p className="text-text-muted text-sm mt-1">{t('create.fileHint')}</p>
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

function ZipUploadMode({ onBack }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

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

    let loadedCount = 0
    const previewResults = new Array(files.length)
    files.forEach((file, idx) => {
      const reader = new FileReader()
      reader.onload = () => {
        previewResults[idx] = reader.result
        loadedCount++
        if (loadedCount === files.length) {
          setFormData(prev => ({
            ...prev,
            screenshotPreviews: [...prev.screenshotPreviews, ...previewResults]
          }))
        }
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
    const validationErrors = validateForm(formData, t)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsUploading(true)
    setErrors({})

    const steps = [
      { step: t('create.steps.validate'), progress: 10 },
      { step: t('create.steps.prepare'), progress: 15 },
      { step: t('create.steps.uploadFile'), progress: 45 },
      { step: t('create.steps.uploadThumb'), progress: 72 },
      { step: t('create.steps.uploadScreens'), progress: 85 },
      { step: t('create.steps.createEntry'), progress: 92 },
      { step: t('create.steps.updateProfile'), progress: 97 },
      { step: t('create.steps.done'), progress: 100 },
    ]

    for (const { step, progress } of steps) {
      setUploadStep(step)
      setUploadProgress(progress)
      await new Promise(r => setTimeout(r, 500))
    }

    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStep('')
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
    <div className="py-4">
      <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer">
        <ArrowLeft size={20} />
        <span>{t('create.backToMode')}</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">{t('create.zipUpload')}</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label>{t('create.gameTitle')}</label>
          <input type="text" value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder={t('create.titlePlaceholder')} maxLength={100} />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label>{t('create.description')}</label>
          <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder={t('create.descriptionPlaceholder')} rows={5} maxLength={2000} />
          <p className="text-text-muted text-xs mt-1 text-right">{formData.description.length}/2000</p>
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        {/* Game File (ZIP) */}
        <div>
          <label>{t('create.gameFile')}</label>
          <DropZone onFileSelect={(file) => updateField('gameFile', file)} file={formData.gameFile} error={errors.gameFile} t={t} />
          {errors.gameFile && <p className="form-error">{errors.gameFile}</p>}
        </div>

        {/* Thumbnail */}
        <div>
          <label>{t('create.thumbnail')}</label>
          <div className="flex items-center gap-4">
            {formData.thumbnailPreview ? (
              <div className="relative">
                <img src={formData.thumbnailPreview} alt={t('create.thumbnailPreview')} className="w-40 h-24 object-cover rounded-lg" />
                <button onClick={() => { updateField('thumbnail', null); updateField('thumbnailPreview', null) }} className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center text-white">
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
                {t('create.selectImage')}
              </label>
              <input id="thumbnail-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnailSelect} className="hidden" />
              <p className="text-text-muted text-xs mt-1">{t('create.imageHint')}</p>
            </div>
          </div>
          {errors.thumbnail && <p className="form-error">{errors.thumbnail}</p>}
        </div>

        {/* Screenshots */}
        <div>
          <label>{t('create.screenshots')}</label>
          <div className="flex flex-wrap gap-2">
            {formData.screenshotPreviews.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Screenshot ${idx + 1}`} className="w-24 h-16 object-cover rounded-lg" />
                <button onClick={() => removeScreenshot(idx)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error rounded-full flex items-center justify-center text-white">
                  <X size={10} />
                </button>
              </div>
            ))}
            {formData.screenshots.length < 5 && (
              <label className="w-24 h-16 bg-bg-card rounded-lg flex items-center justify-center border border-dashed border-gray-600 cursor-pointer hover:border-gray-500 transition-colors">
                <Plus size={20} className="text-text-muted" />
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleScreenshotAdd} className="hidden" multiple />
              </label>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label>{t('create.tags')}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-primary/20 text-primary-light px-3 py-1 rounded-full text-sm">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-error transition-colors cursor-pointer"><X size={12} /></button>
              </span>
            ))}
          </div>
          {formData.tags.length < 10 && (
            <div className="relative">
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true) }} onFocus={() => setShowTagSuggestions(true)} onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); setShowTagSuggestions(false) } }} placeholder={t('create.addTag')} className="!flex-1" />
                <button onClick={() => { addTag(tagInput); setShowTagSuggestions(false) }} className="bg-bg-card hover:bg-bg-hover text-text-secondary px-4 py-2 rounded-lg transition-colors cursor-pointer"><Tag size={16} /></button>
              </div>
              {showTagSuggestions && tagInput && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-12 mt-1 bg-bg-secondary border border-gray-700 rounded-lg overflow-hidden z-10 shadow-lg">
                  {filteredSuggestions.map(tag => (
                    <button key={tag} onMouseDown={(e) => e.preventDefault()} onClick={() => { addTag(tag); setShowTagSuggestions(false) }} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer">#{tag}</button>
                  ))}
                </div>
              )}
            </div>
          )}
          {errors.tags && <p className="form-error">{errors.tags}</p>}
          <p className="text-text-muted text-xs mt-1">{t('create.tagCount', { count: formData.tags.length })}</p>
        </div>

        {/* Price */}
        <div>
          <label>{t('create.pricing')}</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer !mb-0">
              <input type="radio" checked={formData.isFree} onChange={() => updateField('isFree', true)} className="!w-4 !h-4" />
              <span className="text-text-primary text-sm">{t('create.freeLabel')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer !mb-0">
              <input type="radio" checked={!formData.isFree} onChange={() => updateField('isFree', false)} className="!w-4 !h-4" />
              <span className="text-text-primary text-sm">{t('create.mindcoinsLabel')}</span>
              {!formData.isFree && (
                <input type="number" value={formData.price} onChange={(e) => updateField('price', parseInt(e.target.value) || 0)} min={1} max={9999} className="!w-24 !py-1 !text-sm" />
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

        {errors.upload && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-error">{errors.upload}</p>
          </div>
        )}

        <button onClick={handleUpload} disabled={isUploading} className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg">
          {isUploading ? t('create.uploading') : t('create.uploadGame')}
        </button>
      </div>
    </div>
  )
}

const CodeEditorLayout = lazy(() => import('../components/codeEditor/CodeEditorLayout'))
const VisualBuilder = lazy(() => import('../components/gameBuilder/VisualBuilder'))

export default function Create() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [mode, setMode] = useState(null)
  const [editDraftId, setEditDraftId] = useState(null)

  const handleBack = () => {
    setMode(null)
    setEditDraftId(null)
  }

  if (mode === 'template') {
    return <GameBuilderPage editDraftId={editDraftId} onBack={handleBack} />
  }

  if (mode === 'freeform') {
    return (
      <Suspense fallback={<div className="text-center py-20 text-text-muted">{t('create.loadingEditor')}</div>}>
        <CodeEditorLayout onBack={handleBack} />
      </Suspense>
    )
  }

  if (mode === 'visual') {
    return (
      <Suspense fallback={<div className="text-center py-20 text-text-muted">{t('create.loadingEditor')}</div>}>
        <VisualBuilder onBack={handleBack} />
      </Suspense>
    )
  }

  if (mode === 'zip') {
    return <ZipUploadMode onBack={handleBack} />
  }

  return (
    <>
      <>
        <title>Create | MindForge</title>
        <meta name="description" content="Create and upload your own learning games on MindForge." />
        <meta property="og:title" content="Create | MindForge" />
        <meta property="og:description" content="Create and upload your own learning games on MindForge." />
      </>
      <ModeSelector onSelect={setMode} />
    </>
  )
}
