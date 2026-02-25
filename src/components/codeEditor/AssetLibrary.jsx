import { useState } from 'react'
import { X, Search, Image, Music, Box, Download, Star } from 'lucide-react'

const ASSET_CATEGORIES = [
  { id: 'all', label: 'Alle', icon: Box },
  { id: 'images', label: 'Bilder', icon: Image },
  { id: 'sounds', label: 'Sounds', icon: Music },
  { id: 'sprites', label: 'Sprites', icon: Box },
]

const MOCK_ASSETS = [
  // Images
  { id: 'a1', name: 'Sternenhintergrund', category: 'images', type: 'image/png', size: '45KB', rating: 4.5, downloads: 234, preview: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)', insertCode: '<div style="background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e); width: 100%; height: 100%;"></div>' },
  { id: 'a2', name: 'Holztextur', category: 'images', type: 'image/png', size: '62KB', rating: 4.2, downloads: 187, preview: 'linear-gradient(135deg, #8B4513 25%, #A0522D 50%, #8B4513 75%)', insertCode: '<div style="background: linear-gradient(135deg, #8B4513, #A0522D, #8B4513); width: 100%; height: 200px;"></div>' },
  { id: 'a3', name: 'Natur Panorama', category: 'images', type: 'image/jpg', size: '120KB', rating: 4.8, downloads: 456, preview: 'linear-gradient(to bottom, #87CEEB, #228B22)', insertCode: '<div style="background: linear-gradient(to bottom, #87CEEB 50%, #228B22 50%); width: 100%; height: 300px;"></div>' },
  { id: 'a4', name: 'Abstrakte Wellen', category: 'images', type: 'image/svg', size: '8KB', rating: 4.0, downloads: 89, preview: 'linear-gradient(45deg, #6c5ce7, #a29bfe, #6c5ce7)', insertCode: '<svg viewBox="0 0 200 60"><path d="M0 30 Q50 0 100 30 T200 30" fill="none" stroke="#6c5ce7" stroke-width="3"/></svg>' },

  // Sounds
  { id: 'a5', name: 'Richtig-Sound', category: 'sounds', type: 'audio/mp3', size: '15KB', rating: 4.7, downloads: 678, preview: '#00b894', insertCode: '// Richtig-Sound abspielen\nnew Audio("data:audio/wav;base64,...").play();' },
  { id: 'a6', name: 'Falsch-Sound', category: 'sounds', type: 'audio/mp3', size: '12KB', rating: 4.5, downloads: 543, preview: '#e74c3c', insertCode: '// Falsch-Sound abspielen\nnew Audio("data:audio/wav;base64,...").play();' },
  { id: 'a7', name: 'Level-Up', category: 'sounds', type: 'audio/mp3', size: '25KB', rating: 4.9, downloads: 891, preview: '#f39c12', insertCode: '// Level-Up Sound\nnew Audio("data:audio/wav;base64,...").play();' },
  { id: 'a8', name: 'Timer-Tick', category: 'sounds', type: 'audio/mp3', size: '5KB', rating: 4.1, downloads: 234, preview: '#3498db', insertCode: '// Timer-Tick Sound\nsetInterval(() => new Audio("data:audio/wav;base64,...").play(), 1000);' },

  // Sprites
  { id: 'a9', name: 'Checkmark Icon', category: 'sprites', type: 'image/svg', size: '2KB', rating: 4.6, downloads: 345, preview: '#2ecc71', insertCode: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' },
  { id: 'a10', name: 'Stern Sprite', category: 'sprites', type: 'image/svg', size: '3KB', rating: 4.4, downloads: 567, preview: '#f1c40f', insertCode: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#f1c40f"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>' },
  { id: 'a11', name: 'Herz Sprite', category: 'sprites', type: 'image/svg', size: '2KB', rating: 4.3, downloads: 432, preview: '#e74c3c', insertCode: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#e74c3c"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
]

export default function AssetLibrary({ isOpen, onClose, onInsertCode }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory
    const matchesSearch = !searchQuery || asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!isOpen) return null

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-bg-secondary border-l border-gray-700 z-20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-text-primary">Asset Library</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Assets suchen..."
            className="!pl-8 !py-1.5 !text-sm"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
        {ASSET_CATEGORIES.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-card text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Asset grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredAssets.map(asset => (
            <button
              key={asset.id}
              onClick={() => onInsertCode?.(asset.insertCode)}
              className="bg-bg-card hover:bg-bg-hover border border-gray-700 hover:border-accent/30 rounded-lg p-2 transition-all text-left group"
            >
              {/* Preview */}
              <div
                className="w-full aspect-square rounded-md mb-2 flex items-center justify-center"
                style={{
                  background: asset.preview.startsWith('linear') || asset.preview.startsWith('#')
                    ? asset.preview
                    : '#1a1a2e'
                }}
              >
                {asset.category === 'sounds' && <Music className="w-6 h-6 text-white/50" />}
                {asset.category === 'sprites' && <Box className="w-6 h-6 text-white/50" />}
              </div>

              {/* Info */}
              <p className="text-xs font-medium text-text-primary truncate">{asset.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-text-muted">{asset.size}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-text-muted">{asset.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-2.5 h-2.5" />
                Einfuegen
              </div>
            </button>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted">Keine Assets gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}
