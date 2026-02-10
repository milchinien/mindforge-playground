import { useState, useEffect } from 'react'
import { Upload, X, Plus, Check } from 'lucide-react'
import { gameThemes, getThemeById } from '../../../data/gameThemes'
import { useImageStorage } from '../../../hooks/useImageStorage'

export default function DesignTab({ gameData, onChange }) {
  const { uploadImage, loadImageUrl } = useImageStorage()
  const [thumbnailUrl, setThumbnailUrl] = useState(gameData.thumbnailUrl || null)
  const [screenshotUrls, setScreenshotUrls] = useState([])

  // Load existing image URLs
  useEffect(() => {
    if (gameData.thumbnailRef && !thumbnailUrl) {
      loadImageUrl(gameData.thumbnailRef).then(url => { if (url) setThumbnailUrl(url) })
    }
  }, [gameData.thumbnailRef])

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { key, url } = await uploadImage(file, 'thumb')
    onChange({ thumbnailRef: key, thumbnailUrl: url })
    setThumbnailUrl(url)
  }

  const removeThumbnail = () => {
    onChange({ thumbnailRef: null, thumbnailUrl: null })
    setThumbnailUrl(null)
  }

  const handleScreenshotUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (screenshotUrls.length + files.length > 5) return

    const newRefs = [...(gameData.screenshotRefs || [])]
    const newUrls = [...screenshotUrls]

    for (const file of files) {
      const { key, url } = await uploadImage(file, 'screen')
      newRefs.push(key)
      newUrls.push(url)
    }

    onChange({ screenshotRefs: newRefs })
    setScreenshotUrls(newUrls)
  }

  const removeScreenshot = (index) => {
    const newRefs = (gameData.screenshotRefs || []).filter((_, i) => i !== index)
    const newUrls = screenshotUrls.filter((_, i) => i !== index)
    onChange({ screenshotRefs: newRefs })
    setScreenshotUrls(newUrls)
  }

  const selectedTheme = getThemeById(gameData.theme)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Design & Darstellung</h2>
      </div>

      {/* Thumbnail */}
      <div>
        <label>Thumbnail *</label>
        <p className="text-text-muted text-xs mb-3">Das Titelbild deines Spiels (PNG, JPG oder WebP, max. 5 MB)</p>
        <div className="flex items-center gap-4">
          {thumbnailUrl ? (
            <div className="relative">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-48 h-28 object-cover rounded-lg" />
              <button
                onClick={removeThumbnail}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="w-48 h-28 bg-bg-secondary rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-accent cursor-pointer transition-colors">
              <Upload size={20} className="text-text-muted mb-1" />
              <span className="text-text-muted text-xs">Bild auswaehlen</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnailUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Screenshots */}
      <div>
        <label>Screenshots (optional, max. 5)</label>
        <div className="flex flex-wrap gap-3">
          {screenshotUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt={`Screenshot ${idx + 1}`} className="w-28 h-20 object-cover rounded-lg" />
              <button
                onClick={() => removeScreenshot(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {screenshotUrls.length < 5 && (
            <label className="w-28 h-20 bg-bg-secondary rounded-lg flex items-center justify-center border border-dashed border-gray-600 hover:border-accent cursor-pointer transition-colors">
              <Plus size={18} className="text-text-muted" />
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleScreenshotUpload} className="hidden" multiple />
            </label>
          )}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <label>Spiel-Theme</label>
        <p className="text-text-muted text-xs mb-3">Waehle ein Farbschema fuer dein Quiz</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {gameThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onChange({ theme: theme.id })}
              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                gameData.theme === theme.id ? 'border-accent scale-105' : 'border-transparent hover:border-gray-500'
              }`}
            >
              <div className="h-20 flex flex-col" style={{ backgroundColor: theme.colors.background }}>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                </div>
                <div className="h-6 flex items-center justify-center gap-1 px-2" style={{ backgroundColor: theme.colors.card }}>
                  <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: theme.colors.correct }} />
                  <div className="w-3 h-1.5 rounded-sm" style={{ backgroundColor: theme.colors.incorrect }} />
                </div>
              </div>
              <div className="p-2 bg-bg-secondary text-center">
                <span className="text-xs text-text-primary">{theme.name}</span>
              </div>
              {gameData.theme === theme.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Preview */}
      <div>
        <label>Vorschau</label>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: selectedTheme.colors.background }}>
          <div className="p-4">
            <p className="text-sm font-medium mb-3" style={{ color: selectedTheme.colors.text }}>Beispielfrage: Was ist 2+2?</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border cursor-pointer" style={{ backgroundColor: selectedTheme.colors.card, borderColor: selectedTheme.colors.border, color: selectedTheme.colors.text }}>
                A) 3
              </div>
              <div className="p-3 rounded-lg border cursor-pointer" style={{ backgroundColor: selectedTheme.colors.primary, borderColor: selectedTheme.colors.primary, color: '#fff' }}>
                B) 4 (ausgewaehlt)
              </div>
              <div className="p-3 rounded-lg border cursor-pointer" style={{ backgroundColor: selectedTheme.colors.card, borderColor: selectedTheme.colors.border, color: selectedTheme.colors.text }}>
                C) 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
