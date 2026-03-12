import { useState } from 'react'
import { Search, Star, Download, Eye, ShoppingCart, Filter, Tag } from 'lucide-react'
import MindCoinIcon from '../components/common/MindCoinIcon'

// Template data will come from the database. Empty until real data is connected.
const MOCK_TEMPLATES = []

const CATEGORIES = [
  { id: 'all', label: 'Alle' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'memory', label: 'Memory' },
  { id: 'zuordnung', label: 'Zuordnung' },
  { id: 'lueckentext', label: 'Lueckentext' },
  { id: 'raetsel', label: 'Raetsel' },
  { id: 'timeline', label: 'Zeitstrahl' },
]

function TemplateCard({ template }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-bg-card border border-gray-700 rounded-xl overflow-hidden hover:border-accent/30 transition-all group">
      {/* Preview gradient */}
      <div className={`h-32 bg-gradient-to-br ${template.gradient} flex items-center justify-center relative`}>
        <span className="text-white text-4xl font-bold opacity-30">{template.name.charAt(0)}</span>
        {template.price === 0 && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Kostenlos
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-1">{template.name}</h3>
        <p className="text-xs text-text-muted mb-2">von {template.author}</p>
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-bg-hover text-text-muted px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {template.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" /> {template.downloads}
            </span>
          </div>
        </div>

        {/* Features (expandable) */}
        {showDetails && (
          <div className="mb-3 space-y-1">
            {template.features.map(feature => (
              <div key={feature} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {feature}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg transition-colors text-sm font-medium">
            {template.price > 0 ? (
              <>
                <MindCoinIcon size={16} />
                {template.price} MC
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Verwenden
              </>
            )}
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-bg-hover hover:bg-bg-card rounded-lg transition-colors text-text-muted hover:text-text-primary"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TemplateMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  let filtered = MOCK_TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (sortBy === 'popular') filtered.sort((a, b) => b.downloads - a.downloads)
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating)
  if (sortBy === 'new') filtered.sort((a, b) => b.id.localeCompare(a.id))
  if (sortBy === 'free') filtered = filtered.filter(t => t.price === 0)

  return (
    <div>
      <>
        <title>Template Marketplace | MindForge</title>
        <meta name="description" content="Entdecke und nutze Game-Templates von der MindForge Community." />
      </>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Template Marketplace</h1>
          <p className="text-text-secondary mt-1">Entdecke Game-Templates von der Community</p>
        </div>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Tag className="w-4 h-4" />
          Template verkaufen
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Templates suchen..."
            className="!pl-10 !py-2.5"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="!w-auto !py-2.5 !px-4"
        >
          <option value="popular">Beliebteste</option>
          <option value="rating">Beste Bewertung</option>
          <option value="new">Neueste</option>
          <option value="free">Nur kostenlos</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-accent/20 text-accent'
                : 'bg-bg-card text-text-muted hover:text-text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-bold text-text-primary mb-2">Keine Templates gefunden</p>
          <p className="text-text-secondary">Versuche einen anderen Suchbegriff oder Kategorie.</p>
        </div>
      )}
    </div>
  )
}
