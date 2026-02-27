import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import Tabs from '../components/ui/Tabs'

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
  { id: 'item-1', name: 'Goldener Rahmen', image: '/images/items/golden-frame.svg', rarity: 'rare', type: 'frame', effect: 'golden', source: 'Starterset' },
  { id: 'item-2', name: 'Feuer-Haarfarbe', image: '/images/items/fire-hair.svg', rarity: 'common', type: 'hair_color', effect: '#FF4500', source: 'Starterset' },
  { id: 'item-3', name: 'Sternen-Hintergrund', image: '/images/items/galaxy-background.svg', rarity: 'rare', type: 'background', effect: 'galaxy', source: 'Starterset' },
]

const TYPE_KEY_MAP = {
  frame: 'frame',
  hair_color: 'hairColor',
  background: 'background',
  effect: 'effect',
  accessory: 'accessory',
}

function InventoryItemCard({ item }) {
  const { t } = useTranslation()
  const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.common

  return (
    <div className={`bg-bg-card rounded-lg p-2.5 border ${rarityStyle.borderColor} hover:scale-[1.02] transition-transform`}>
      <div className={`w-full aspect-[4/3] rounded-md overflow-hidden ${rarityStyle.bgColor}`}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">{item.icon}</div>
        )}
      </div>
      <h3 className="text-xs font-semibold text-text-primary truncate mt-1.5">{item.name}</h3>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className={`inline-block text-[10px] px-1.5 py-px rounded-full ${rarityStyle.badgeBg} ${rarityStyle.color}`}>
          {t(`inventory.rarity.${item.rarity}`)}
        </span>
        {item.type && (
          <span className="text-[10px] text-text-muted">
            {TYPE_KEY_MAP[item.type] ? t(`inventory.type.${TYPE_KEY_MAP[item.type]}`) : item.type}
          </span>
        )}
      </div>
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
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('avatarItems')

  const allItems = useMemo(() => {
    const purchased = (user?.purchasedItems || []).map(item => ({
      ...item,
      source: 'Marketplace',
    }))
    const purchasedIds = new Set(purchased.map(i => i.id))
    const defaults = DEFAULT_ITEMS.filter(i => !purchasedIds.has(i.id))
    return [...defaults, ...purchased]
  }, [user?.purchasedItems])

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

      {/* Tab Navigation */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab Content */}
      {activeTab === 'avatarItems' && (
        allItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {allItems.map((item) => (
              <InventoryItemCard key={item.id} item={item} />
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
