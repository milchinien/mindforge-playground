import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

const RARITY_STYLES = {
  common: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    badgeBg: 'bg-gray-500/20',
  },
  rare: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    badgeBg: 'bg-blue-500/20',
  },
  epic: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    badgeBg: 'bg-purple-500/20',
  },
  legendary: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    badgeBg: 'bg-orange-500/20',
  },
}

const DEFAULT_ITEMS = [
  { id: 'item-1', name: 'Goldener Rahmen', icon: '\u{1F5BC}\uFE0F', rarity: 'rare', type: 'frame', effect: 'golden', source: 'Starterset' },
  { id: 'item-2', name: 'Feuer-Haarfarbe', icon: '\u{1F525}', rarity: 'common', type: 'hair_color', effect: '#FF4500', source: 'Starterset' },
  { id: 'item-3', name: 'Sternen-Hintergrund', icon: '\u2728', rarity: 'rare', type: 'background', effect: 'galaxy', source: 'Starterset' },
]

function InventoryItemCard({ item, isEquipped, onToggleEquip }) {
  const { t } = useTranslation()
  const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.common

  const TYPE_KEY_MAP = {
    frame: 'frame',
    hair_color: 'hairColor',
    background: 'background',
    effect: 'effect',
    accessory: 'accessory',
  }

  return (
    <div className={`bg-bg-card rounded-xl p-4 border ${isEquipped ? 'border-accent ring-2 ring-accent/30' : rarityStyle.borderColor} hover:scale-[1.02] transition-transform`}>
      <div className={`w-full aspect-square rounded-lg ${rarityStyle.bgColor} flex items-center justify-center text-4xl mb-3 relative`}>
        {item.icon}
        {isEquipped && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-text-primary truncate">{item.name}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${rarityStyle.badgeBg} ${rarityStyle.color}`}>
          {t(`inventory.rarity.${item.rarity}`)}
        </span>
        {item.type && (
          <span className="text-xs text-text-muted">
            {TYPE_KEY_MAP[item.type] ? t(`inventory.type.${TYPE_KEY_MAP[item.type]}`) : item.type}
          </span>
        )}
      </div>
      {item.source && (
        <p className="text-xs text-text-muted mt-1 truncate">{item.source}</p>
      )}
      <button
        onClick={() => onToggleEquip(item)}
        className={`w-full mt-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
          isEquipped
            ? 'bg-accent/20 text-accent border border-accent/30 hover:bg-error/20 hover:text-error hover:border-error/30'
            : 'bg-bg-hover text-text-secondary hover:bg-accent/20 hover:text-accent'
        }`}
      >
        {isEquipped ? t('common.unequip') : t('common.equip')}
      </button>
    </div>
  )
}

function EmptyTabState({ icon, title, description, actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default function Inventory() {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('avatarItems')

  const equippedItems = user?.equippedItems || {}

  const allItems = useMemo(() => {
    const purchased = (user?.purchasedItems || []).map(item => ({
      ...item,
      source: 'Marketplace',
    }))
    const purchasedIds = new Set(purchased.map(i => i.id))
    const defaults = DEFAULT_ITEMS.filter(i => !purchasedIds.has(i.id))
    return [...defaults, ...purchased]
  }, [user?.purchasedItems])

  const handleToggleEquip = async (item) => {
    const newEquipped = { ...equippedItems }

    if (newEquipped[item.type] === item.id) {
      delete newEquipped[item.type]
    } else {
      newEquipped[item.type] = item.id
    }

    const effectMap = {}
    for (const [type, itemId] of Object.entries(newEquipped)) {
      const found = allItems.find(i => i.id === itemId)
      if (found) effectMap[type] = found.effect || found.id
    }

    await updateUser({
      equippedItems: newEquipped,
      equippedEffects: effectMap,
    })
  }

  const TABS = [
    { id: 'avatarItems', label: t('inventory.avatarItems'), count: allItems.length },
    { id: 'games', label: t('inventory.purchasedGames'), count: 0 },
    { id: 'assets', label: t('inventory.assets'), count: 0 },
  ]

  return (
    <div className="py-4">
      <>
        <title>{t('inventory.title')} | MindForge</title>
        <meta name="description" content={t('inventory.title')} />
        <meta property="og:title" content={`${t('inventory.title')} | MindForge`} />
        <meta property="og:description" content={t('inventory.title')} />
        <meta property="og:type" content="website" />
      </>

      <h1 className="text-3xl font-bold mb-6">{t('inventory.title')}</h1>

      {/* Active Equipment Summary */}
      {Object.keys(equippedItems).length > 0 && (
        <div className="bg-bg-card rounded-xl p-4 mb-6 border border-accent/20">
          <h3 className="text-sm font-semibold text-accent mb-2">{t('inventory.equipped')}</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(equippedItems).map(([type, itemId]) => {
              const item = allItems.find(i => i.id === itemId)
              if (!item) return null
              return (
                <span key={type} className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                  {item.icon} {item.name}
                  <button
                    onClick={() => handleToggleEquip(item)}
                    className="ml-1 hover:text-error cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === tab.id
                ? 'text-accent'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-bg-hover px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'avatarItems' && (
        allItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allItems.map((item) => (
              <InventoryItemCard
                key={item.id}
                item={item}
                isEquipped={equippedItems[item.type] === item.id}
                onToggleEquip={handleToggleEquip}
              />
            ))}
          </div>
        ) : (
          <EmptyTabState
            icon={'\u{1F464}'}
            title={t('inventory.noAvatarItems')}
            description={t('inventory.noAvatarItemsDesc')}
            actionLabel={t('inventory.toMarketplace')}
            actionLink="/marketplace"
          />
        )
      )}

      {activeTab === 'games' && (
        <EmptyTabState
          icon={'\u{1F3AE}'}
          title={t('inventory.noGames')}
          description={t('inventory.noGamesDesc')}
          actionLabel={t('inventory.toMarketplace')}
          actionLink="/marketplace"
        />
      )}

      {activeTab === 'assets' && (
        <EmptyTabState
          icon={'\u{1F4E6}'}
          title={t('inventory.noAssets')}
          description={t('inventory.noAssetsDesc')}
          actionLabel={t('inventory.browseAssets')}
          actionLink="/marketplace"
        />
      )}
    </div>
  )
}
