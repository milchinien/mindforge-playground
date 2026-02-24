import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import AvatarRenderer from '../components/profile/AvatarRenderer'
import MindCoinIcon from '../components/common/MindCoinIcon'
import useEscapeKey from '../hooks/useEscapeKey'
import {
  Sparkles, User, Scissors, Smile, Crown, Shirt,
  Glasses, Palette, Eye, ShoppingBag, PersonStanding,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  SKIN_COLORS, HAIR_COLORS, EYE_COLORS, CLOTHING_COLORS,
  HAIR_STYLES, EYE_TYPES, EYEBROW_TYPES, MOUTH_TYPES,
  BODY_TYPES, ACCESSORY_TYPES, HAT_TYPES, CLOTHING_TYPES,
  BG_STYLES, RARITY_CONFIG,
} from '../data/avatarItems'

// ============= SUB-COMPONENTS =============

function SectionLabel({ children }) {
  return (
    <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3">{children}</h4>
  )
}

function ColorPicker({ label, colors, selected, onChange }) {
  return (
    <div className="mb-6">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            title={color.name}
            className="group relative"
          >
            <div
              className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                selected === color.hex
                  ? 'border-accent scale-110 shadow-lg shadow-accent/30 ring-2 ring-accent/20'
                  : 'border-gray-600/50 hover:border-gray-400 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-bg-primary/95 text-[10px] text-text-secondary rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700/50">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StyleGrid({ label, options, selected, onChange, columns = 3 }) {
  return (
    <div className="mb-6">
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
              selected === option.id
                ? 'bg-accent/15 text-accent border-accent/40 shadow-sm shadow-accent/10'
                : 'bg-bg-secondary/60 text-text-secondary border-gray-700/40 hover:bg-bg-hover/60 hover:text-text-primary hover:border-gray-600/60'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function BodyTypeSelector({ selected, onChange, avatarConfig, t }) {
  return (
    <div>
      <SectionLabel>{t('avatar.bodyType')}</SectionLabel>
      <p className="text-xs text-text-muted mb-4 -mt-1">{t('avatar.bodyTypeDesc')}</p>
      <div className="grid grid-cols-3 gap-3">
        {BODY_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`relative rounded-2xl p-3 border-2 transition-all duration-200 cursor-pointer text-center hover:scale-[1.02] ${
              selected === type.id
                ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
                : 'border-gray-700/40 bg-bg-secondary/40 hover:border-gray-500/60 hover:bg-bg-secondary/60'
            }`}
          >
            <div className="w-full flex justify-center mb-2">
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
                bodyType={type.id}
                size={64}
              />
            </div>
            <p className="text-sm font-bold text-text-primary">{type.name}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{type.desc}</p>
            {selected === type.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-[10px]">{'\u2713'}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function HatItemCard({ hat, isOwned, isEquipped, onSelect, avatarConfig, t }) {
  const rarity = RARITY_CONFIG[hat.rarity] || RARITY_CONFIG.common
  const isFree = hat.price === 0

  return (
    <button
      onClick={() => onSelect(hat)}
      className={`relative rounded-2xl p-2.5 border-2 transition-all duration-200 cursor-pointer text-left hover:scale-[1.02] ${
        isEquipped
          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/15'
          : `border-gray-700/30 ${rarity.bg} hover:border-gray-500/50 ${rarity.glow ? `shadow-md ${rarity.glow}` : ''}`
      }`}
    >
      <div className="w-full aspect-square rounded-xl bg-bg-primary/40 flex items-center justify-center mb-2 overflow-hidden">
        <AvatarRenderer
          skinColor={avatarConfig.skinColor}
          hairColor={avatarConfig.hairColor}
          hairStyle={avatarConfig.hairStyle}
          eyeType={avatarConfig.eyeType}
          eyeColor={avatarConfig.eyeColor}
          eyebrows={avatarConfig.eyebrows}
          mouth={avatarConfig.mouth}
          accessory={avatarConfig.accessory}
          hat={hat.id}
          clothing={avatarConfig.clothing}
          clothingColor={avatarConfig.clothingColor}
          bgStyle={avatarConfig.bgStyle}
          bodyType={avatarConfig.bodyType}
          size={72}
        />
      </div>
      <p className="text-xs font-semibold text-text-primary truncate">{hat.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] font-medium ${rarity.color}`}>{rarity.name}</span>
        {isFree ? (
          <span className="text-[10px] text-success font-semibold">{t('common.free')}</span>
        ) : isOwned ? (
          <span className="text-[10px] text-accent font-semibold">{t('common.purchased')}</span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-warning font-semibold">
            <MindCoinIcon size={10} /> {hat.price}
          </span>
        )}
      </div>
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-[10px]">{'\u2713'}</span>
        </div>
      )}
    </button>
  )
}

function AccessoryItemCard({ item, isOwned, isEquipped, onSelect, avatarConfig, t }) {
  const isFree = item.price === 0

  return (
    <button
      onClick={() => onSelect(item)}
      className={`relative rounded-2xl p-2.5 border-2 transition-all duration-200 cursor-pointer text-left hover:scale-[1.02] ${
        isEquipped
          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/15'
          : 'border-gray-700/30 bg-gray-500/5 hover:border-gray-500/50'
      }`}
    >
      <div className="w-full aspect-square rounded-xl bg-bg-primary/40 flex items-center justify-center mb-2 overflow-hidden">
        <AvatarRenderer
          skinColor={avatarConfig.skinColor}
          hairColor={avatarConfig.hairColor}
          hairStyle={avatarConfig.hairStyle}
          eyeType={avatarConfig.eyeType}
          eyeColor={avatarConfig.eyeColor}
          eyebrows={avatarConfig.eyebrows}
          mouth={avatarConfig.mouth}
          accessory={item.id}
          hat={avatarConfig.hat}
          clothing={avatarConfig.clothing}
          clothingColor={avatarConfig.clothingColor}
          bgStyle={avatarConfig.bgStyle}
          bodyType={avatarConfig.bodyType}
          size={72}
        />
      </div>
      <p className="text-xs font-semibold text-text-primary truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        {isFree ? (
          <span className="text-[10px] text-success font-semibold">{t('common.free')}</span>
        ) : isOwned ? (
          <span className="text-[10px] text-accent font-semibold">{t('common.purchased')}</span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-warning font-semibold">
            <MindCoinIcon size={10} /> {item.price}
          </span>
        )}
      </div>
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-[10px]">{'\u2713'}</span>
        </div>
      )}
    </button>
  )
}

function PurchaseModal({ item, onClose, onConfirm, userBalance, t }) {
  useEscapeKey(onClose)

  const canAfford = (userBalance || 0) >= item.price
  const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-2xl max-w-sm w-full overflow-hidden border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t('avatar.buyItem')}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg cursor-pointer transition-colors">{'\u2715'}</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-xl font-bold text-text-primary">{item.name}</p>
            {item.rarity && <span className={`text-xs ${rarity.color}`}>{rarity.name}</span>}
          </div>

          <div className="flex items-center justify-between bg-bg-card/60 rounded-xl p-4 border border-gray-700/30">
            <div>
              <p className="text-xs text-text-muted">{t('common.price')}</p>
              <p className="text-lg font-bold text-warning flex items-center gap-1.5">
                <MindCoinIcon size={20} /> {item.price} {t('common.mc')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">{t('avatar.yourBalance')}</p>
              <p className={`text-lg font-bold ${canAfford ? 'text-success' : 'text-error'} flex items-center gap-1.5 justify-end`}>
                <MindCoinIcon size={20} /> {(userBalance || 0).toLocaleString('de-DE')} {t('common.mc')}
              </p>
            </div>
          </div>

          {canAfford ? (
            <button
              onClick={() => onConfirm(item)}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer shadow-lg shadow-accent/20"
            >
              {t('avatar.buyFor', { price: item.price })}
            </button>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-error text-sm font-medium">
                {t('avatar.notEnoughCoins', { amount: item.price - (userBalance || 0) })}
              </p>
              <Link
                to="/shop"
                className="inline-block bg-warning hover:bg-yellow-600 text-black px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                <ShoppingBag size={14} className="inline mr-1.5 -mt-0.5" />
                {t('avatar.toShop')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============= MAIN COMPONENT =============
export default function Avatar() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const [activeCategory, setActiveCategory] = useState('presets')
  const [purchaseItem, setPurchaseItem] = useState(null)
  const tabsRef = useRef(null)

  const AVATAR_PRESETS = [
    {
      id: 'warrior', name: t('avatar.presetNames.warrior'), emoji: '\u2694\uFE0F',
      config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'buzz', eyeType: 'almond', eyeColor: '#3E2723', eyebrows: 'angry', mouth: 'neutral', accessory: 'none', hat: 'none', clothing: 'tank', clothingColor: '#1a1a1a', bgStyle: 'gray', bodyType: 'wide' },
    },
    {
      id: 'scholar', name: t('avatar.presetNames.scholar'), emoji: '\u{1F4DA}',
      config: { skinColor: '#F5D6B8', hairColor: '#6B3A2A', hairStyle: 'short', eyeType: 'round', eyeColor: '#4A90D9', eyebrows: 'arched', mouth: 'smile', accessory: 'glasses', hat: 'none', clothing: 'suit', clothingColor: '#2c3e50', bgStyle: 'blue', bodyType: 'normal' },
    },
    {
      id: 'artist', name: t('avatar.presetNames.artist'), emoji: '\u{1F3A8}',
      config: { skinColor: '#FDEBD0', hairColor: '#E91E63', hairStyle: 'curly', eyeType: 'cat', eyeColor: '#5B8C5A', eyebrows: 'normal', mouth: 'smirk', accessory: 'earring', hat: 'beanie', clothing: 'hoodie', clothingColor: '#8e44ad', bgStyle: 'neon', bodyType: 'slim' },
    },
    {
      id: 'hacker', name: t('avatar.presetNames.hacker'), emoji: '\u{1F4BB}',
      config: { skinColor: '#C4956A', hairColor: '#2196F3', hairStyle: 'mohawk', eyeType: 'sleepy', eyeColor: '#8E8E8E', eyebrows: 'thick', mouth: 'smirk', accessory: 'sunglasses', hat: 'none', clothing: 'hoodie', clothingColor: '#1a1a1a', bgStyle: 'green', bodyType: 'normal' },
    },
    {
      id: 'hero', name: t('avatar.presetNames.hero'), emoji: '\u{1F9B8}',
      config: { skinColor: '#8D5524', hairColor: '#D4A843', hairStyle: 'short', eyeType: 'wide', eyeColor: '#D4A843', eyebrows: 'thick', mouth: 'grin', accessory: 'none', hat: 'none', clothing: 'jacket', clothingColor: '#c0392b', bgStyle: 'fire', bodyType: 'wide' },
    },
    {
      id: 'mystic', name: t('avatar.presetNames.mystic'), emoji: '\u{1F52E}',
      config: { skinColor: '#5C3317', hairColor: '#9E9E9E', hairStyle: 'long', eyeType: 'cat', eyeColor: '#9B59B6', eyebrows: 'arched', mouth: 'neutral', accessory: 'earring', hat: 'wizard', clothing: 'suit', clothingColor: '#4a1a6b', bgStyle: 'galaxy', bodyType: 'slim' },
    },
    {
      id: 'ninja', name: t('avatar.presetNames.ninja'), emoji: '\u{1F977}',
      config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'ponytail', eyeType: 'almond', eyeColor: '#3E2723', eyebrows: 'normal', mouth: 'neutral', accessory: 'mask', hat: 'none', clothing: 'jacket', clothingColor: '#1a1a1a', bgStyle: 'gray', bodyType: 'slim' },
    },
    {
      id: 'punk', name: t('avatar.presetNames.punk'), emoji: '\u{1F3B8}',
      config: { skinColor: '#FDEBD0', hairColor: '#8B2500', hairStyle: 'spiky', eyeType: 'round', eyeColor: '#C0392B', eyebrows: 'angry', mouth: 'open', accessory: 'earring', hat: 'none', clothing: 'tank', clothingColor: '#1a1a1a', bgStyle: 'sunset', bodyType: 'normal' },
    },
    {
      id: 'pirate', name: t('avatar.presetNames.pirate'), emoji: '\u{1F3F4}\u200D\u2620\uFE0F',
      config: { skinColor: '#C4956A', hairColor: '#2C1810', hairStyle: 'messy', eyeType: 'almond', eyeColor: '#6B3A2A', eyebrows: 'thick', mouth: 'smirk', accessory: 'earring', hat: 'pirate', clothing: 'jacket', clothingColor: '#2c3e50', bgStyle: 'ocean', bodyType: 'wide' },
    },
    {
      id: 'royal', name: t('avatar.presetNames.noble'), emoji: '\u{1F451}',
      config: { skinColor: '#F5D6B8', hairColor: '#D4A843', hairStyle: 'long', eyeType: 'almond', eyeColor: '#4A90D9', eyebrows: 'arched', mouth: 'smile', accessory: 'none', hat: 'crown', clothing: 'suit', clothingColor: '#8e44ad', bgStyle: 'purple', bodyType: 'normal' },
    },
  ]

  const CATEGORIES = [
    { id: 'presets', name: t('avatar.presets'), icon: Sparkles },
    { id: 'body', name: t('avatar.body'), icon: PersonStanding },
    { id: 'skin', name: t('avatar.skin'), icon: User },
    { id: 'hair', name: t('avatar.hair'), icon: Scissors },
    { id: 'face', name: t('avatar.face'), icon: Smile },
    { id: 'hats', name: t('avatar.hats'), icon: Crown },
    { id: 'clothing', name: t('avatar.clothing'), icon: Shirt },
    { id: 'accessories', name: t('avatar.accessories'), icon: Glasses },
    { id: 'background', name: t('avatar.background'), icon: Palette },
  ]

  const savedConfig = useRef({
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
  })

  const [avatarConfig, setAvatarConfig] = useState({ ...savedConfig.current })
  const [saveStatus, setSaveStatus] = useState('saved')
  const debounceRef = useRef(null)
  const latestConfig = useRef(avatarConfig)

  const ownedHats = user?.ownedHats || []
  const ownedAccessories = user?.ownedAccessories || []

  const saveToServer = useCallback(async (config) => {
    setSaveStatus('saving')
    try {
      await updateUser({
        avatar: {
          skinColor: config.skinColor,
          hairColor: config.hairColor,
          hairStyle: config.hairStyle,
          eyeType: config.eyeType,
          eyes: config.eyeType,
          eyeColor: config.eyeColor,
          eyebrows: config.eyebrows,
          mouth: config.mouth,
          accessory: config.accessory,
          hat: config.hat,
          clothing: config.clothing,
          clothingColor: config.clothingColor,
          bgStyle: config.bgStyle,
          bodyType: config.bodyType,
        },
      })
      savedConfig.current = { ...config }
      setSaveStatus('saved')
    } catch {
      setSaveStatus('pending')
    }
  }, [updateUser])

  const updateConfig = (key, value) => {
    const newConfig = { ...avatarConfig, [key]: value }
    setAvatarConfig(newConfig)
    latestConfig.current = newConfig
    setSaveStatus('pending')

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveToServer(latestConfig.current)
    }, 800)
  }

  const applyPreset = (preset) => {
    const newConfig = { ...preset.config }
    setAvatarConfig(newConfig)
    latestConfig.current = newConfig
    setSaveStatus('pending')

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveToServer(latestConfig.current)
    }, 800)
  }

  const handleSelectHat = (hat) => {
    if (hat.price === 0 || ownedHats.includes(hat.id)) {
      updateConfig('hat', hat.id === avatarConfig.hat ? 'none' : hat.id)
    } else {
      setPurchaseItem({ ...hat, type: 'hat' })
    }
  }

  const handleSelectAccessory = (item) => {
    if (item.price === 0 || ownedAccessories.includes(item.id)) {
      updateConfig('accessory', item.id === avatarConfig.accessory ? 'none' : item.id)
    } else {
      setPurchaseItem({ ...item, type: 'accessory' })
    }
  }

  const handlePurchaseConfirm = async (item) => {
    const newBalance = (user?.mindCoins || 0) - item.price
    const updates = { mindCoins: newBalance }

    if (item.type === 'hat') {
      updates.ownedHats = [...ownedHats, item.id]
      updateConfig('hat', item.id)
    } else {
      updates.ownedAccessories = [...ownedAccessories, item.id]
      updateConfig('accessory', item.id)
    }

    const newTransactions = [...(user?.transactions || []), {
      type: 'spend',
      amount: item.price,
      description: `${item.name} gekauft`,
      date: new Date().toISOString(),
    }]
    updates.transactions = newTransactions

    await updateUser(updates)
    setPurchaseItem(null)
  }

  const scrollTabs = (dir) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir * 160, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)
  const ActiveIcon = activeCat?.icon || Sparkles

  // ============= RENDER =============
  return (
    <div className="h-full max-w-[1400px] mx-auto">
      <Helmet>
        <title>Avatar | MindForge</title>
        <meta name="description" content={t('avatar.subtitle')} />
        <meta property="og:title" content="Avatar | MindForge" />
        <meta property="og:description" content={t('avatar.subtitle')} />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('avatar.title')}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t('avatar.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm bg-bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700/50 shadow-sm">
            <MindCoinIcon size={16} />
            <span className="font-bold text-accent">{(user?.mindCoins || 0).toLocaleString('de-DE')}</span>
          </span>
          <span className={`text-xs px-3 py-2 rounded-xl font-semibold border ${
            saveStatus === 'saved' ? 'bg-success/10 text-success border-success/20' :
            saveStatus === 'saving' ? 'bg-accent/10 text-accent border-accent/20' :
            'bg-warning/10 text-warning border-warning/20'
          }`}>
            {saveStatus === 'saved' ? t('avatar.saved') :
             saveStatus === 'saving' ? t('avatar.saving') :
             t('avatar.unsaved')}
          </span>
        </div>
      </div>

      {/* Main Layout - 2 columns */}
      <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left: Avatar Preview */}
        <div className="w-[300px] flex-shrink-0 flex flex-col">
          {/* Preview Card */}
          <div className="flex-1 rounded-2xl border border-gray-700/40 bg-bg-secondary/50 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative gradient glow behind avatar */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 40%, var(--color-accent) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Avatar with subtle ring */}
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-accent/5 border border-accent/10" />
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
                  size={240}
                  username={user?.username}
                  animated
                />
              </div>
              <p className="mt-4 text-lg font-bold text-text-primary">{user?.username}</p>
              <p className="text-text-muted text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                {t('avatar.livePreview')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="flex-1 rounded-2xl border border-gray-700/40 bg-bg-secondary/50 backdrop-blur-sm flex flex-col min-w-0 overflow-hidden">
          {/* Category Tabs - horizontal scrollable */}
          <div className="border-b border-gray-700/40 px-2 pt-3 pb-0">
            <div className="relative">
              {/* Scroll buttons */}
              <button
                onClick={() => scrollTabs(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-bg-secondary/90 border border-gray-700/50 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <ChevronLeft size={14} />
              </button>

              <div
                ref={tabsRef}
                className="flex gap-1 overflow-x-auto scrollbar-hide px-8 pb-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 ${
                        isActive
                          ? 'bg-accent/10 text-accent border-accent'
                          : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover/30 border-transparent'
                      }`}
                    >
                      <Icon size={15} />
                      {cat.name}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => scrollTabs(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-bg-secondary/90 border border-gray-700/50 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Panel Header */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-2">
            <ActiveIcon size={18} className="text-accent" />
            <h2 className="text-base font-bold text-text-primary">{activeCat?.name}</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            {/* PRESETS */}
            {activeCategory === 'presets' && (
              <div>
                <p className="text-xs text-text-muted mb-4">{t('avatar.presetsHint', 'Waehle ein Preset als Startpunkt oder passe alles individuell an.')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-gray-700/30 bg-bg-primary/30 hover:bg-bg-hover/40 hover:border-accent/30 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <AvatarRenderer
                          skinColor={preset.config.skinColor}
                          hairColor={preset.config.hairColor}
                          hairStyle={preset.config.hairStyle}
                          eyeType={preset.config.eyeType}
                          eyeColor={preset.config.eyeColor}
                          eyebrows={preset.config.eyebrows}
                          mouth={preset.config.mouth}
                          accessory={preset.config.accessory}
                          hat={preset.config.hat}
                          clothing={preset.config.clothing}
                          clothingColor={preset.config.clothingColor}
                          bgStyle={preset.config.bgStyle}
                          bodyType={preset.config.bodyType}
                          size={56}
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                          {preset.emoji} {preset.name}
                        </p>
                        <p className="text-[11px] text-text-muted">{t('avatar.applyPreset')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BODY TYPE */}
            {activeCategory === 'body' && (
              <BodyTypeSelector
                selected={avatarConfig.bodyType}
                onChange={(type) => updateConfig('bodyType', type)}
                avatarConfig={avatarConfig}
                t={t}
              />
            )}

            {/* SKIN */}
            {activeCategory === 'skin' && (
              <ColorPicker
                label={t('avatar.skinColor')}
                colors={SKIN_COLORS}
                selected={avatarConfig.skinColor}
                onChange={(color) => updateConfig('skinColor', color)}
              />
            )}

            {/* HAIR */}
            {activeCategory === 'hair' && (
              <>
                <StyleGrid
                  label={t('avatar.hairStyle')}
                  options={HAIR_STYLES}
                  selected={avatarConfig.hairStyle}
                  onChange={(style) => updateConfig('hairStyle', style)}
                  columns={3}
                />
                <ColorPicker
                  label={t('avatar.hairColor')}
                  colors={HAIR_COLORS}
                  selected={avatarConfig.hairColor}
                  onChange={(color) => updateConfig('hairColor', color)}
                />
              </>
            )}

            {/* FACE */}
            {activeCategory === 'face' && (
              <>
                <StyleGrid
                  label={t('avatar.eyeShape')}
                  options={EYE_TYPES}
                  selected={avatarConfig.eyeType}
                  onChange={(type) => updateConfig('eyeType', type)}
                />
                <ColorPicker
                  label={t('avatar.eyeColor')}
                  colors={EYE_COLORS}
                  selected={avatarConfig.eyeColor}
                  onChange={(color) => updateConfig('eyeColor', color)}
                />
                <StyleGrid
                  label={t('avatar.eyebrows')}
                  options={EYEBROW_TYPES}
                  selected={avatarConfig.eyebrows}
                  onChange={(type) => updateConfig('eyebrows', type)}
                />
                <StyleGrid
                  label={t('avatar.mouth')}
                  options={MOUTH_TYPES}
                  selected={avatarConfig.mouth}
                  onChange={(type) => updateConfig('mouth', type)}
                />
              </>
            )}

            {/* HATS */}
            {activeCategory === 'hats' && (
              <div>
                <p className="text-xs text-text-muted mb-4">
                  {t('avatar.hatsDesc')}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {HAT_TYPES.map((hat) => (
                    <HatItemCard
                      key={hat.id}
                      hat={hat}
                      isOwned={hat.price === 0 || ownedHats.includes(hat.id)}
                      isEquipped={avatarConfig.hat === hat.id}
                      onSelect={handleSelectHat}
                      avatarConfig={avatarConfig}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CLOTHING */}
            {activeCategory === 'clothing' && (
              <>
                <StyleGrid
                  label={t('avatar.clothingStyle')}
                  options={CLOTHING_TYPES}
                  selected={avatarConfig.clothing}
                  onChange={(style) => updateConfig('clothing', style)}
                />
                <ColorPicker
                  label={t('avatar.clothingColor')}
                  colors={CLOTHING_COLORS}
                  selected={avatarConfig.clothingColor}
                  onChange={(color) => updateConfig('clothingColor', color)}
                />
              </>
            )}

            {/* ACCESSORIES */}
            {activeCategory === 'accessories' && (
              <div>
                <p className="text-xs text-text-muted mb-4">
                  {t('avatar.accessoriesDesc')}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {ACCESSORY_TYPES.map((item) => (
                    <AccessoryItemCard
                      key={item.id}
                      item={item}
                      isOwned={item.price === 0 || ownedAccessories.includes(item.id)}
                      isEquipped={avatarConfig.accessory === item.id}
                      onSelect={handleSelectAccessory}
                      avatarConfig={avatarConfig}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* BACKGROUND */}
            {activeCategory === 'background' && (
              <div>
                <SectionLabel>{t('avatar.background')}</SectionLabel>
                <div className="grid grid-cols-4 gap-3">
                  {BG_STYLES.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => updateConfig('bgStyle', bg.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:scale-[1.03] ${
                        avatarConfig.bgStyle === bg.id
                          ? 'border-accent bg-accent/10 shadow-md shadow-accent/10'
                          : 'border-gray-700/30 hover:border-gray-500/50 bg-bg-primary/20'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl border border-gray-600/30 shadow-inner"
                        style={{ background: bg.color }}
                      />
                      <span className="text-[11px] text-text-secondary font-medium">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {purchaseItem && (
        <PurchaseModal
          item={purchaseItem}
          onClose={() => setPurchaseItem(null)}
          onConfirm={handlePurchaseConfirm}
          userBalance={user?.mindCoins || 0}
          t={t}
        />
      )}
    </div>
  )
}
