import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import AvatarRenderer from '../components/profile/AvatarRenderer'
import MindCoinIcon from '../components/common/MindCoinIcon'
import useEscapeKey from '../hooks/useEscapeKey'
import {
  Crown, Scissors, Glasses, Shirt, Palette, Smile,
  Package, ShoppingBag, Check, X, Search, Filter,
  CircleDollarSign, Gift, Star,
} from 'lucide-react'
import {
  HAT_TYPES, HAIR_STYLES, ACCESSORY_TYPES, CLOTHING_TYPES,
  BG_STYLES, EYE_TYPES, EYEBROW_TYPES, MOUTH_TYPES,
  HAIR_COLORS, CLOTHING_COLORS, RARITY_CONFIG,
  MARKETPLACE_CATEGORIES,
} from '../data/avatarItems'

const CATEGORY_ICONS = {
  all: Package,
  hats: Crown,
  hair: Scissors,
  accessories: Glasses,
  clothing: Shirt,
  background: Palette,
  face: Smile,
}

// Build a unified list of all marketplace items
function buildMarketplaceItems() {
  const items = []

  // Hats (skip 'none')
  HAT_TYPES.filter(h => h.id !== 'none').forEach(hat => {
    items.push({
      id: `hat-${hat.id}`,
      itemId: hat.id,
      category: 'hats',
      name: hat.name,
      price: hat.price,
      rarity: hat.rarity || 'common',
      avatarKey: 'hat',
    })
  })

  // Hair styles
  HAIR_STYLES.forEach(hair => {
    items.push({
      id: `hair-${hair.id}`,
      itemId: hair.id,
      category: 'hair',
      name: hair.name,
      price: hair.price || 0,
      rarity: (hair.price || 0) >= 50 ? 'rare' : 'common',
      avatarKey: 'hairStyle',
    })
  })

  // Hair colors
  HAIR_COLORS.forEach(color => {
    items.push({
      id: `haircolor-${color.hex}`,
      itemId: color.hex,
      category: 'hair',
      name: `Haarfarbe: ${color.name}`,
      price: 0,
      rarity: 'common',
      avatarKey: 'hairColor',
      isColor: true,
      colorHex: color.hex,
    })
  })

  // Accessories (skip 'none')
  ACCESSORY_TYPES.filter(a => a.id !== 'none').forEach(acc => {
    items.push({
      id: `acc-${acc.id}`,
      itemId: acc.id,
      category: 'accessories',
      name: acc.name,
      price: acc.price,
      rarity: acc.price >= 100 ? 'epic' : acc.price >= 50 ? 'rare' : 'common',
      avatarKey: 'accessory',
    })
  })

  // Clothing types
  CLOTHING_TYPES.forEach(cloth => {
    items.push({
      id: `cloth-${cloth.id}`,
      itemId: cloth.id,
      category: 'clothing',
      name: cloth.name,
      price: cloth.price || 0,
      rarity: (cloth.price || 0) >= 50 ? 'rare' : 'common',
      avatarKey: 'clothing',
    })
  })

  // Clothing colors
  CLOTHING_COLORS.forEach(color => {
    items.push({
      id: `clothcolor-${color.hex}`,
      itemId: color.hex,
      category: 'clothing',
      name: `Farbe: ${color.name}`,
      price: 0,
      rarity: 'common',
      avatarKey: 'clothingColor',
      isColor: true,
      colorHex: color.hex,
    })
  })

  // Backgrounds
  BG_STYLES.forEach(bg => {
    items.push({
      id: `bg-${bg.id}`,
      itemId: bg.id,
      category: 'background',
      name: bg.name,
      price: bg.price || 0,
      rarity: (bg.price || 0) >= 100 ? 'epic' : (bg.price || 0) >= 40 ? 'rare' : 'common',
      avatarKey: 'bgStyle',
      bgColor: bg.color,
    })
  })

  // Face - Eye types
  EYE_TYPES.forEach(eye => {
    items.push({
      id: `eye-${eye.id}`,
      itemId: eye.id,
      category: 'face',
      name: `Augen: ${eye.name}`,
      price: 0,
      rarity: 'common',
      avatarKey: 'eyeType',
    })
  })

  // Face - Eyebrows
  EYEBROW_TYPES.forEach(eb => {
    items.push({
      id: `eyebrow-${eb.id}`,
      itemId: eb.id,
      category: 'face',
      name: `Brauen: ${eb.name}`,
      price: 0,
      rarity: 'common',
      avatarKey: 'eyebrows',
    })
  })

  // Face - Mouth
  MOUTH_TYPES.forEach(mouth => {
    items.push({
      id: `mouth-${mouth.id}`,
      itemId: mouth.id,
      category: 'face',
      name: `Mund: ${mouth.name}`,
      price: 0,
      rarity: 'common',
      avatarKey: 'mouth',
    })
  })

  return items
}

const ALL_ITEMS = buildMarketplaceItems()

const RARITY_ORDER = { common: 0, rare: 1, epic: 2, legendary: 3 }

// ============= STAR RATING =============
function StarRating({ rating, onRate, size = 16, interactive = false }) {
  const [hovered, setHovered] = useState(0)
  const displayRating = hovered || rating

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => interactive && setHovered(0)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform disabled:opacity-100`}
        >
          <Star
            size={size}
            className={star <= displayRating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-600'
            }
          />
        </button>
      ))}
    </div>
  )
}

function getAvatarConfig(user) {
  return {
    skinColor: user?.avatar?.skinColor || '#F5D6B8',
    hairColor: user?.avatar?.hairColor || '#2C1810',
    hairStyle: user?.avatar?.hairStyle || 'short',
    eyeType: user?.avatar?.eyes || user?.avatar?.eyeType || 'round',
    eyeColor: user?.avatar?.eyeColor || '#6B3A2A',
    eyebrows: user?.avatar?.eyebrows || 'none',
    mouth: user?.avatar?.mouth || 'smile',
    accessory: user?.avatar?.accessory || 'none',
    hat: user?.avatar?.hat || 'none',
    clothing: user?.avatar?.clothing || 'tshirt',
    clothingColor: user?.avatar?.clothingColor || '#374151',
    bgStyle: user?.avatar?.bgStyle || 'gray',
    bodyType: user?.avatar?.bodyType || 'normal',
  }
}

function isItemOwned(item, user) {
  if (item.price === 0) return true
  if (item.category === 'hats') return (user?.ownedHats || []).includes(item.itemId)
  if (item.category === 'accessories') return (user?.ownedAccessories || []).includes(item.itemId)
  if (item.category === 'hair') return (user?.ownedHairStyles || []).includes(item.itemId)
  if (item.category === 'clothing') return (user?.ownedClothing || []).includes(item.itemId)
  if (item.category === 'background') return (user?.ownedBackgrounds || []).includes(item.itemId)
  return true
}

function isItemEquipped(item, avatarConfig) {
  return avatarConfig[item.avatarKey] === item.itemId
}

// ============= ITEM CARD =============
function MarketplaceItemCard({ item, avatarConfig, isOwned, isEquipped, rating, onClick, t }) {
  const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common
  const previewConfig = { ...avatarConfig, [item.avatarKey]: item.itemId }

  return (
    <button
      onClick={() => onClick(item)}
      className={`relative rounded-2xl p-2.5 border-2 transition-all duration-200 cursor-pointer text-left hover:scale-[1.02] group ${
        isEquipped
          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/15'
          : `border-gray-700/30 ${rarity.bg} hover:border-gray-500/50 ${rarity.glow ? `shadow-md ${rarity.glow}` : ''}`
      }`}
    >
      {/* Avatar Preview */}
      <div className="w-full aspect-square rounded-xl bg-bg-primary/40 flex items-center justify-center overflow-hidden mb-2">
        {item.isColor ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-xl border-2 border-gray-600/30 shadow-inner"
              style={{ background: item.colorHex }}
            />
          </div>
        ) : item.bgColor ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-xl border-2 border-gray-600/30 shadow-inner"
              style={{ background: item.bgColor }}
            />
          </div>
        ) : (
          <AvatarRenderer
            skinColor={previewConfig.skinColor}
            hairColor={previewConfig.hairColor}
            hairStyle={previewConfig.hairStyle}
            eyeType={previewConfig.eyeType}
            eyeColor={previewConfig.eyeColor}
            eyebrows={previewConfig.eyebrows}
            mouth={previewConfig.mouth}
            accessory={previewConfig.accessory}
            hat={previewConfig.hat}
            clothing={previewConfig.clothing}
            clothingColor={previewConfig.clothingColor}
            bgStyle={previewConfig.bgStyle}
            bodyType={previewConfig.bodyType}
            size={80}
          />
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-semibold text-text-primary truncate">{item.name}</p>

      {/* Rating */}
      {rating > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] text-yellow-400 font-medium">{rating}</span>
        </div>
      )}

      {/* Rarity & Price */}
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] font-medium ${rarity.color}`}>{rarity.name}</span>
        {item.price === 0 ? (
          <span className="text-[10px] text-success font-semibold">{t('marketplace.gratis')}</span>
        ) : isOwned ? (
          <span className="text-[10px] text-accent font-semibold">{t('common.purchased')}</span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-warning font-semibold">
            <MindCoinIcon size={10} /> {item.price}
          </span>
        )}
      </div>

      {/* Equipped badge */}
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md">
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  )
}

// ============= ITEM DETAIL MODAL =============
function ItemDetailModal({ item, avatarConfig, user, isOwned, isEquipped, userRating, onClose, onBuyAndEquip, onEquip, onRate, t }) {
  useEscapeKey(onClose)

  const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common
  const canAfford = (user?.mindCoins || 0) >= item.price
  const previewConfig = { ...avatarConfig, [item.avatarKey]: item.itemId }
  const needsPurchase = item.price > 0 && !isOwned

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-2xl max-w-md w-full overflow-hidden border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{item.name}</h2>
            <span className={`text-xs font-medium ${rarity.color}`}>{rarity.name}</span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="p-6 flex justify-center bg-bg-primary/30">
          <div className="flex gap-6 items-center">
            {/* Current */}
            <div className="text-center">
              <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider font-medium">{t('marketplace.currentLabel')}</p>
              <div className="rounded-xl overflow-hidden border-2 border-gray-700/30">
                <AvatarRenderer
                  skinColor={avatarConfig.skinColor}
                  hairColor={avatarConfig.hairColor}
                  hairStyle={avatarConfig.hairStyle}
                  eyeType={avatarConfig.eyeType}
                  eyeColor={avatarConfig.eyeColor}
                  eyebrows={avatarConfig.eyebrows}
                  mouth={avatarConfig.mouth}
                  accessory={avatarConfig.accessory}
                  hat={avatarConfig.hat}
                  clothing={avatarConfig.clothing}
                  clothingColor={avatarConfig.clothingColor}
                  bgStyle={avatarConfig.bgStyle}
                  bodyType={avatarConfig.bodyType}
                  size={120}
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="text-text-muted text-2xl">{'\u2192'}</div>

            {/* Preview with item */}
            <div className="text-center">
              <p className="text-[10px] text-accent mb-2 uppercase tracking-wider font-medium">{t('marketplace.previewLabel')}</p>
              <div className="rounded-xl overflow-hidden border-2 border-accent/40 shadow-lg shadow-accent/10">
                <AvatarRenderer
                  skinColor={previewConfig.skinColor}
                  hairColor={previewConfig.hairColor}
                  hairStyle={previewConfig.hairStyle}
                  eyeType={previewConfig.eyeType}
                  eyeColor={previewConfig.eyeColor}
                  eyebrows={previewConfig.eyebrows}
                  mouth={previewConfig.mouth}
                  accessory={previewConfig.accessory}
                  hat={previewConfig.hat}
                  clothing={previewConfig.clothing}
                  clothingColor={previewConfig.clothingColor}
                  bgStyle={previewConfig.bgStyle}
                  bodyType={previewConfig.bodyType}
                  size={120}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="p-5 space-y-4">
          {needsPurchase && (
            <div className="flex items-center justify-between bg-bg-card/60 rounded-xl p-4 border border-gray-700/30">
              <div>
                <p className="text-xs text-text-muted">{t('common.price')}</p>
                <p className="text-lg font-bold text-warning flex items-center gap-1.5">
                  <MindCoinIcon size={20} /> {item.price} {t('common.mc')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">{t('shop.yourBalance')}</p>
                <p className={`text-lg font-bold ${canAfford ? 'text-success' : 'text-error'} flex items-center gap-1.5 justify-end`}>
                  <MindCoinIcon size={20} /> {(user?.mindCoins || 0).toLocaleString('de-DE')} {t('common.mc')}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {isEquipped ? (
            <div className="w-full py-3 rounded-xl bg-accent/15 text-accent font-semibold text-center border border-accent/30">
              {t('marketplace.currentlyEquipped')}
            </div>
          ) : needsPurchase ? (
            canAfford ? (
              <button
                onClick={() => onBuyAndEquip(item)}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer shadow-lg shadow-accent/20"
              >
                <ShoppingBag size={16} className="inline mr-2 -mt-0.5" />
                {t('marketplace.buyAndEquip', { price: item.price })}
              </button>
            ) : (
              <div className="text-center space-y-2">
                <button disabled className="w-full py-3 rounded-xl bg-gray-600 text-gray-400 font-semibold cursor-not-allowed">
                  {t('marketplace.notEnoughCoins')}
                </button>
                <p className="text-xs text-error">{t('marketplace.missingCoins', { amount: item.price - (user?.mindCoins || 0) })}</p>
              </div>
            )
          ) : (
            <button
              onClick={() => onEquip(item)}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer shadow-lg shadow-accent/20"
            >
              {t('common.equip')}
            </button>
          )}

          {/* Rating Section - only for owned items */}
          {isOwned && (
            <div className="pt-3 border-t border-gray-700/40">
              <p className="text-xs text-text-muted mb-2">
                {userRating ? t('marketplace.yourRating') : t('marketplace.rateItem')}
              </p>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={userRating || 0}
                  onRate={(stars) => onRate(item.id, stars)}
                  size={20}
                  interactive
                />
                {userRating > 0 && (
                  <span className="text-xs text-yellow-400 font-medium">{userRating}/5</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============= SIDEBAR FILTER =============
function FilterSidebar({ activeCategory, setActiveCategory, priceFilter, setPriceFilter, categoryCount, t }) {
  const PRICE_FILTERS = [
    { id: 'all', name: t('marketplace.allItems'), icon: Package },
    { id: 'free', name: t('marketplace.free'), icon: Gift },
    { id: 'premium', name: t('marketplace.premium'), icon: CircleDollarSign },
  ]

  return (
    <aside className="w-56 flex-shrink-0 space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Filter size={12} />
          {t('marketplace.category')}
        </h3>
        <div className="space-y-1">
          {MARKETPLACE_CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.id] || Package
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-text-secondary hover:bg-bg-hover/60 hover:text-text-primary border border-transparent'
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  isActive ? 'bg-accent/20 text-accent' : 'bg-bg-hover text-text-muted'
                }`}>
                  {categoryCount[cat.id] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/40" />

      {/* Price Filter */}
      <div>
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <CircleDollarSign size={12} />
          {t('marketplace.priceLabel')}
        </h3>
        <div className="space-y-1">
          {PRICE_FILTERS.map(filter => {
            const Icon = filter.icon
            const isActive = priceFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setPriceFilter(filter.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-text-secondary hover:bg-bg-hover/60 hover:text-text-primary border border-transparent'
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{filter.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

// ============= MAIN COMPONENT =============
export default function Marketplace() {
  const { user, updateUser } = useAuth()
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const SORT_OPTIONS = [
    { id: 'default', name: t('marketplace.sortDefault') },
    { id: 'price-asc', name: t('marketplace.sortPriceAsc') },
    { id: 'price-desc', name: t('marketplace.sortPriceDesc') },
    { id: 'name', name: t('marketplace.sortName') },
    { id: 'rarity', name: t('marketplace.sortRarity') },
    { id: 'rating', name: t('marketplace.sortRating') },
  ]

  const avatarConfig = getAvatarConfig(user)
  const itemRatings = user?.itemRatings || {}

  const getItemRating = (itemId) => itemRatings[itemId] || 0

  const handleRate = async (itemId, stars) => {
    const newRatings = { ...itemRatings, [itemId]: stars }
    await updateUser({ itemRatings: newRatings })
  }

  const filteredItems = useMemo(() => {
    let result = [...ALL_ITEMS]

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory)
    }

    // Price filter
    if (priceFilter === 'free') {
      result = result.filter(item => item.price === 0)
    } else if (priceFilter === 'premium') {
      result = result.filter(item => item.price > 0)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(item => item.name.toLowerCase().includes(q))
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'de'))
        break
      case 'rarity':
        result.sort((a, b) => (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0))
        break
      case 'rating':
        result.sort((a, b) => (itemRatings[b.id] || 0) - (itemRatings[a.id] || 0))
        break
    }

    return result
  }, [activeCategory, priceFilter, sortBy, searchQuery, itemRatings])

  const categoryCount = useMemo(() => {
    const counts = { all: ALL_ITEMS.length }
    MARKETPLACE_CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = ALL_ITEMS.filter(i => i.category === cat.id).length
      }
    })
    return counts
  }, [])

  const saveAvatarConfig = async (newConfig) => {
    await updateUser({
      avatar: {
        skinColor: newConfig.skinColor,
        hairColor: newConfig.hairColor,
        hairStyle: newConfig.hairStyle,
        eyes: newConfig.eyeType,
        eyeType: newConfig.eyeType,
        eyeColor: newConfig.eyeColor,
        eyebrows: newConfig.eyebrows,
        mouth: newConfig.mouth,
        accessory: newConfig.accessory,
        hat: newConfig.hat,
        clothing: newConfig.clothing,
        clothingColor: newConfig.clothingColor,
        bgStyle: newConfig.bgStyle,
        bodyType: newConfig.bodyType,
      },
    })
  }

  const handleEquip = async (item) => {
    const newConfig = { ...avatarConfig, [item.avatarKey]: item.itemId }
    await saveAvatarConfig(newConfig)
    setSelectedItem(null)
  }

  const handleBuyAndEquip = async (item) => {
    const newBalance = (user?.mindCoins || 0) - item.price
    const updates = { mindCoins: newBalance }

    // Add to owned items based on category (with duplicate check)
    if (item.category === 'hats') {
      const current = user?.ownedHats || []
      if (!current.includes(item.itemId)) updates.ownedHats = [...current, item.itemId]
    } else if (item.category === 'accessories') {
      const current = user?.ownedAccessories || []
      if (!current.includes(item.itemId)) updates.ownedAccessories = [...current, item.itemId]
    } else if (item.category === 'hair') {
      const current = user?.ownedHairStyles || []
      if (!current.includes(item.itemId)) updates.ownedHairStyles = [...current, item.itemId]
    } else if (item.category === 'clothing') {
      const current = user?.ownedClothing || []
      if (!current.includes(item.itemId)) updates.ownedClothing = [...current, item.itemId]
    } else if (item.category === 'background') {
      const current = user?.ownedBackgrounds || []
      if (!current.includes(item.itemId)) updates.ownedBackgrounds = [...current, item.itemId]
    }

    // Transaction
    updates.transactions = [...(user?.transactions || []), {
      type: 'spend',
      amount: item.price,
      description: t('marketplace.purchasedInMarketplace', { name: item.name }),
      date: new Date().toISOString(),
    }]

    // Equip
    const newConfig = { ...avatarConfig, [item.avatarKey]: item.itemId }
    updates.avatar = {
      skinColor: newConfig.skinColor,
      hairColor: newConfig.hairColor,
      hairStyle: newConfig.hairStyle,
      eyes: newConfig.eyeType,
      eyeType: newConfig.eyeType,
      eyeColor: newConfig.eyeColor,
      eyebrows: newConfig.eyebrows,
      mouth: newConfig.mouth,
      accessory: newConfig.accessory,
      hat: newConfig.hat,
      clothing: newConfig.clothing,
      clothingColor: newConfig.clothingColor,
      bgStyle: newConfig.bgStyle,
      bodyType: newConfig.bodyType,
    }

    await updateUser(updates)
    setSelectedItem(null)
  }

  const PRICE_FILTERS = [
    { id: 'all', name: t('marketplace.allItems') },
    { id: 'free', name: t('marketplace.free') },
    { id: 'premium', name: t('marketplace.premium') },
  ]

  return (
    <div className="w-full">
      <Helmet>
        <title>Marketplace | MindForge</title>
        <meta name="description" content="Discover and buy avatar items on the MindForge Marketplace." />
        <meta property="og:title" content="Marketplace | MindForge" />
        <meta property="og:description" content="Discover and buy avatar items on the MindForge Marketplace." />
      </Helmet>

      {/* Sub-Header: Description + Balance + Search + Sort */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-text-muted">{t('marketplace.discoverItems')}</p>
          <div className="flex items-center gap-2 bg-bg-secondary/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-700/50 shadow-sm">
            <MindCoinIcon size={20} />
            <span className="font-bold text-accent text-lg">{(user?.mindCoins || 0).toLocaleString('de-DE')}</span>
            <span className="text-text-muted text-sm">{t('common.mc')}</span>
          </div>
        </div>

        {/* Search + Sort Row */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('marketplace.searchItems')}
              className="w-full bg-bg-card border border-gray-700/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary
                         placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            aria-label={t('marketplace.sorting')}
            className="bg-bg-card text-text-primary border border-gray-700/40 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:border-gray-600 transition-colors"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <FilterSidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          categoryCount={categoryCount}
          t={t}
        />

        {/* Separator */}
        <div className="w-px bg-gray-700/40 flex-shrink-0" />

        {/* Items Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-muted">
              {filteredItems.length === 1 ? t('marketplace.itemCountSingle') : t('marketplace.itemCount', { count: filteredItems.length })}
              {activeCategory !== 'all' && ` ${t('marketplace.inCategory', { category: MARKETPLACE_CATEGORIES.find(c => c.id === activeCategory)?.name })}`}
              {priceFilter !== 'all' && ` (${PRICE_FILTERS.find(f => f.id === priceFilter)?.name})`}
              {searchQuery && ` ${t('marketplace.forSearch', { query: searchQuery })}`}
            </p>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {filteredItems.map(item => (
                <MarketplaceItemCard
                  key={item.id}
                  item={item}
                  avatarConfig={avatarConfig}
                  isOwned={isItemOwned(item, user)}
                  isEquipped={isItemEquipped(item, avatarConfig)}
                  rating={getItemRating(item.id)}
                  onClick={setSelectedItem}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">{t('marketplace.noItemsFound')}</h3>
              <p className="text-text-muted">
                {searchQuery ? t('marketplace.noItemsTryOther') : t('marketplace.noItemsTryFilter')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          avatarConfig={avatarConfig}
          user={user}
          isOwned={isItemOwned(selectedItem, user)}
          isEquipped={isItemEquipped(selectedItem, avatarConfig)}
          userRating={getItemRating(selectedItem.id)}
          onClose={() => setSelectedItem(null)}
          onBuyAndEquip={handleBuyAndEquip}
          onEquip={handleEquip}
          onRate={handleRate}
          t={t}
        />
      )}
    </div>
  )
}
