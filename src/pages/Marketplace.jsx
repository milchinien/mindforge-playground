import { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MOCK_ASSETS, ASSET_TYPES, SORT_OPTIONS } from '../data/mockAssets'
import AssetCard from '../components/marketplace/AssetCard'
import MindCoinIcon from '../components/common/MindCoinIcon'
import useEscapeKey from '../hooks/useEscapeKey'

const TYPE_ICONS = {
  '3d-model': '\u{1F9CA}',
  'texture': '\u{1F3A8}',
  'audio': '\u{1F3B5}',
  'script': '\u{1F4DC}',
  'avatar-item': '\u{1F464}',
}

function AssetDetailModal({ asset, onClose, onPurchase, isPurchased, userCoins }) {
  const isFree = asset.price === 0
  const canAfford = userCoins >= asset.price
  const [feedback, setFeedback] = useState(null)
  useEscapeKey(onClose)

  const handleBuy = () => {
    if (isPurchased) return
    if (!isFree && !canAfford) {
      setFeedback({ type: 'error', msg: 'Nicht genug MindCoins!' })
      return
    }
    onPurchase(asset)
    setFeedback({ type: 'success', msg: 'Erfolgreich gekauft!' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         role="dialog" aria-modal="true" aria-label={asset.name}
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-lg w-full overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        {/* Preview */}
        <div className="aspect-video bg-bg-hover flex items-center justify-center text-6xl">
          {asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}'}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{asset.name}</h2>
              <p className="text-text-muted text-sm mt-1">
                von {asset.creator.username}
              </p>
            </div>
            <button onClick={onClose} aria-label="Schliessen" className="text-text-muted hover:text-text-primary text-xl">
              {'\u2715'}
            </button>
          </div>

          <p className="text-text-secondary mt-4 text-sm leading-relaxed">
            {asset.description}
          </p>

          {/* Meta-Infos */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Bewertung</p>
              <p className="text-text-primary font-medium">
                {'\u2605'} {asset.rating.toFixed(1)} ({asset.ratingCount} Bewertungen)
              </p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Downloads</p>
              <p className="text-text-primary font-medium">{asset.downloads}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Dateigroesse</p>
              <p className="text-text-primary font-medium">{asset.fileSize}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Format</p>
              <p className="text-text-primary font-medium">{asset.format}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {asset.tags.map((tag) => (
              <span key={tag} className="text-xs bg-bg-hover text-text-muted px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              feedback.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            }`}>
              {feedback.msg}
            </div>
          )}

          {/* Kauf-Button */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            {isPurchased ? (
              <button disabled className="w-full bg-success/20 text-success py-3 rounded-lg
                                         font-semibold border border-success/30 cursor-default">
                Bereits gekauft
              </button>
            ) : isFree ? (
              <button onClick={handleBuy}
                      className="w-full bg-success hover:bg-green-600 text-white py-3 rounded-lg
                                 font-semibold transition-colors cursor-pointer">
                Kostenlos herunterladen
              </button>
            ) : (
              <button onClick={handleBuy}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        canAfford
                          ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}>
                <MindCoinIcon size={20} /> {asset.price} MindCoins - Kaufen
              </button>
            )}
            {!isPurchased && !isFree && !canAfford && (
              <p className="text-xs text-error text-center mt-2">
                Du brauchst {asset.price - userCoins} weitere MindCoins
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const { user, updateUser } = useAuth()
  const [activeType, setActiveType] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedAsset, setSelectedAsset] = useState(null)

  const purchasedIds = user?.purchasedItems?.map(i => i.id) || []

  const handlePurchase = async (asset) => {
    if (purchasedIds.includes(asset.id)) return

    const newCoins = (user?.mindCoins || 0) - asset.price
    const newItem = {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      icon: asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}',
      rarity: asset.rarity || 'common',
      purchasedAt: new Date().toISOString(),
    }
    const currentPurchased = user?.purchasedItems || []

    await updateUser({
      mindCoins: newCoins,
      purchasedItems: [...currentPurchased, newItem],
    })
  }

  const filteredAssets = useMemo(() => {
    let result = [...MOCK_ASSETS]

    if (activeType !== 'all') {
      result = result.filter(a => a.type === activeType)
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [activeType, sortBy])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
      <p className="text-text-muted mb-8">Entdecke Assets fuer deine Lernspiele</p>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Typ-Filter */}
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeType === type.id
                  ? 'bg-accent text-white'
                  : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                }`}
            >
              {type.icon} {type.name}
            </button>
          ))}
        </div>

        {/* Sortierung */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sortierung"
          className="bg-bg-card text-text-primary border border-gray-700 rounded-lg px-4 py-2
                     text-sm ml-auto"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onClick={() => setSelectedAsset(asset)}
              purchased={purchasedIds.includes(asset.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">{'\u{1F4E6}'}</span>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Keine Assets gefunden
          </h3>
          <p className="text-text-muted">
            Versuche einen anderen Filter oder erstelle selbst Assets!
          </p>
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onPurchase={handlePurchase}
          isPurchased={purchasedIds.includes(selectedAsset.id)}
          userCoins={user?.mindCoins || 0}
        />
      )}
    </div>
  )
}
