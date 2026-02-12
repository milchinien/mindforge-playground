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

function StarRating({ rating, onRate, interactive = false }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          disabled={!interactive}
          className={`text-lg transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <span className={
            (hovered || rating) >= star
              ? 'text-yellow-400'
              : 'text-gray-600'
          }>
            {'\u2605'}
          </span>
        </button>
      ))}
    </div>
  )
}

function RatingSection({ asset, isPurchased, userRating, onSubmitRating }) {
  const [newRating, setNewRating] = useState(userRating?.stars || 0)
  const [comment, setComment] = useState(userRating?.comment || '')
  const [submitted, setSubmitted] = useState(!!userRating)

  const handleSubmit = () => {
    if (newRating === 0) return
    onSubmitRating(asset.id, newRating, comment)
    setSubmitted(true)
  }

  if (!isPurchased) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <h4 className="text-sm font-medium text-text-secondary mb-2">
        {submitted ? 'Deine Bewertung' : 'Bewerte dieses Item'}
      </h4>
      <StarRating rating={newRating} onRate={submitted ? undefined : setNewRating} interactive={!submitted} />
      {!submitted ? (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optionaler Kommentar..."
            rows={2}
            className="w-full mt-2 bg-bg-card border border-gray-700 rounded-lg px-3 py-2 text-text-primary text-sm
                       focus:outline-none focus:border-accent resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={newRating === 0}
            className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              newRating > 0
                ? 'bg-accent text-white hover:bg-accent-dark cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Bewertung absenden
          </button>
        </>
      ) : (
        comment && <p className="text-xs text-text-muted mt-1">"{comment}"</p>
      )}
    </div>
  )
}

function ConfirmPurchaseModal({ asset, onClose, onConfirm, userCoins }) {
  const canAfford = userCoins >= asset.price
  useEscapeKey(onClose)

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-text-primary mb-3">Kauf bestaetigen</h3>
        <div className="flex items-center gap-3 bg-bg-card rounded-lg p-3 mb-4">
          <span className="text-3xl">{asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}'}</span>
          <div>
            <p className="font-semibold text-text-primary">{asset.name}</p>
            <p className="text-sm text-accent flex items-center gap-1">
              <MindCoinIcon size={16} /> {asset.price} MC
            </p>
          </div>
        </div>
        {!canAfford && (
          <p className="text-error text-sm mb-3">Dir fehlen {asset.price - userCoins} MindCoins.</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-bg-card text-text-secondary rounded-lg text-sm font-medium hover:bg-bg-hover transition-colors cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            disabled={!canAfford}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              canAfford
                ? 'bg-accent text-white hover:bg-accent-dark cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Kaufen
          </button>
        </div>
      </div>
    </div>
  )
}

function CartPanel({ cart, onRemove, onCheckout, userCoins }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const canAfford = userCoins >= total

  if (cart.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 bg-bg-secondary rounded-xl shadow-2xl border border-gray-700 p-4 w-80 z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          {'\u{1F6D2}'} Warenkorb
          <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">{cart.length}</span>
        </h3>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-text-primary truncate flex-1">{item.avatarIcon || TYPE_ICONS[item.type] || ''} {item.name}</span>
            <span className="text-accent font-medium ml-2">{item.price} MC</span>
            <button onClick={() => onRemove(item.id)} className="ml-2 text-text-muted hover:text-error cursor-pointer text-xs">{'\u2715'}</button>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span>Gesamt</span>
          <span className="text-accent">{total} MC</span>
        </div>
        {!canAfford && (
          <p className="text-error text-xs mb-2">Dir fehlen {total - userCoins} MindCoins.</p>
        )}
        <button
          onClick={onCheckout}
          disabled={!canAfford}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            canAfford
              ? 'bg-accent text-white hover:bg-accent-dark cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Alle kaufen ({cart.length} Items)
        </button>
      </div>
    </div>
  )
}

function AssetDetailModal({ asset, onClose, onPurchase, onAddToCart, isPurchased, userCoins, userRating, onSubmitRating }) {
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
      <div className="bg-bg-secondary rounded-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video bg-bg-hover flex items-center justify-center text-6xl">
          {asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}'}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{asset.name}</h2>
              <p className="text-text-muted text-sm mt-1">
                von {asset.creator.username}
              </p>
            </div>
            <button onClick={onClose} aria-label="Schliessen" className="text-text-muted hover:text-text-primary text-xl cursor-pointer">
              {'\u2715'}
            </button>
          </div>

          <p className="text-text-secondary mt-4 text-sm leading-relaxed">
            {asset.description}
          </p>

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

          <div className="flex flex-wrap gap-2 mt-4">
            {asset.tags.map((tag) => (
              <span key={tag} className="text-xs bg-bg-hover text-text-muted px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {feedback && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              feedback.type === 'success' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            }`}>
              {feedback.msg}
            </div>
          )}

          {/* Rating Section */}
          <RatingSection
            asset={asset}
            isPurchased={isPurchased}
            userRating={userRating}
            onSubmitRating={onSubmitRating}
          />

          {/* Buy/Cart Buttons */}
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
              <div className="flex gap-3">
                <button onClick={handleBuy}
                        disabled={!canAfford}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                          canAfford
                            ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}>
                  <MindCoinIcon size={20} /> {asset.price} MC - Kaufen
                </button>
                <button
                  onClick={() => { onAddToCart(asset); onClose() }}
                  className="px-4 py-3 bg-bg-card text-text-secondary hover:text-accent rounded-lg font-medium transition-colors cursor-pointer border border-gray-700 hover:border-accent/50"
                >
                  {'\u{1F6D2}'}
                </button>
              </div>
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
  const [cart, setCart] = useState([])
  const [confirmAsset, setConfirmAsset] = useState(null)

  const purchasedIds = user?.purchasedItems?.map(i => i.id) || []
  const userRatings = user?.ratings || {}

  const handlePurchase = async (asset) => {
    if (purchasedIds.includes(asset.id)) return

    const newCoins = (user?.mindCoins || 0) - asset.price
    const newItem = {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      icon: asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}',
      rarity: asset.rarity || 'common',
      effect: asset.effect,
      purchasedAt: new Date().toISOString(),
    }
    const currentPurchased = user?.purchasedItems || []
    const transactions = user?.transactions || []

    await updateUser({
      mindCoins: newCoins,
      purchasedItems: [...currentPurchased, newItem],
      transactions: [...transactions, {
        type: 'spend',
        amount: asset.price,
        description: `${asset.name} im Marketplace gekauft`,
        date: new Date().toISOString(),
      }],
    })

    setCart(prev => prev.filter(c => c.id !== asset.id))
  }

  const handleAddToCart = (asset) => {
    if (cart.find(c => c.id === asset.id) || purchasedIds.includes(asset.id)) return
    setCart(prev => [...prev, asset])
  }

  const handleRemoveFromCart = (assetId) => {
    setCart(prev => prev.filter(c => c.id !== assetId))
  }

  const handleCheckoutAll = async () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0)
    if ((user?.mindCoins || 0) < total) return

    const currentPurchased = user?.purchasedItems || []
    const transactions = user?.transactions || []
    const newItems = cart.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      icon: asset.avatarIcon || TYPE_ICONS[asset.type] || '\u{1F4E6}',
      rarity: asset.rarity || 'common',
      effect: asset.effect,
      purchasedAt: new Date().toISOString(),
    }))

    await updateUser({
      mindCoins: (user?.mindCoins || 0) - total,
      purchasedItems: [...currentPurchased, ...newItems],
      transactions: [...transactions, {
        type: 'spend',
        amount: total,
        description: `${cart.length} Items im Marketplace gekauft`,
        date: new Date().toISOString(),
      }],
    })

    setCart([])
  }

  const handleSubmitRating = async (assetId, stars, comment) => {
    const newRatings = { ...userRatings, [assetId]: { stars, comment, date: new Date().toISOString() } }
    await updateUser({ ratings: newRatings })
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

      {/* Cart Panel */}
      <CartPanel
        cart={cart}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckoutAll}
        userCoins={user?.mindCoins || 0}
      />

      {/* Confirm Purchase Modal */}
      {confirmAsset && (
        <ConfirmPurchaseModal
          asset={confirmAsset}
          onClose={() => setConfirmAsset(null)}
          onConfirm={() => handlePurchase(confirmAsset)}
          userCoins={user?.mindCoins || 0}
        />
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onPurchase={handlePurchase}
          onAddToCart={handleAddToCart}
          isPurchased={purchasedIds.includes(selectedAsset.id)}
          userCoins={user?.mindCoins || 0}
          userRating={userRatings[selectedAsset.id]}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </div>
  )
}
