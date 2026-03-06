import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useInventoryStore, selectItems } from '../stores/inventoryStore'
import Tabs from '../components/ui/Tabs'

const RARITY_STYLES = {
  common: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    badgeBg: 'bg-gray-500/20',
    label: 'Gewoehnlich',
  },
  uncommon: {
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    badgeBg: 'bg-green-500/20',
    label: 'Ungewoehnlich',
  },
  rare: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    badgeBg: 'bg-blue-500/20',
    label: 'Selten',
  },
  epic: {
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    badgeBg: 'bg-purple-500/20',
    label: 'Episch',
  },
  legendary: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    badgeBg: 'bg-orange-500/20',
    label: 'Legendaer',
  },
}

const SOURCE_LABELS = {
  default: 'Standard',
  achievement: 'Errungenschaft',
  quest: 'Quest-Belohnung',
  season: 'Season-Belohnung',
  shop: 'Shop',
  event: 'Event',
}

const TYPE_LABELS = {
  title: 'Titel',
  badge: 'Badge',
  frame: 'Rahmen',
  background: 'Hintergrund',
  effect: 'Effekt',
  'avatar-item': 'Avatar-Item',
  hat: 'Hut',
  accessory: 'Accessoire',
}

const CATEGORIES = [
  { key: 'all', label: 'Alle' },
  { key: 'title', label: 'Titel' },
  { key: 'badge', label: 'Badges' },
  { key: 'avatar', label: 'Avatar' },
  { key: 'frame', label: 'Rahmen' },
  { key: 'background', label: 'Hintergruende' },
  { key: 'effect', label: 'Effekte' },
]

const TYPE_ICONS = {
  title: '\uD83C\uDFF7\uFE0F',
  badge: '\uD83C\uDFC5',
  frame: '\uD83D\uDDBC\uFE0F',
  background: '\uD83C\uDF05',
  effect: '\u2728',
  'avatar-item': '\uD83D\uDC64',
  hat: '\uD83C\uDFA9',
  accessory: '\uD83D\uDC8D',
}

function InventoryItemCard({ item, onEquip, onUnequip }) {
  const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.common

  return (
    <div className={`bg-bg-card rounded-xl p-4 border relative ${item.equipped ? 'border-accent/50 ring-1 ring-accent/20' : rarityStyle.borderColor}`}>
      {item.equipped && (
        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
          Aktiv
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">
          {TYPE_ICONS[item.type] || '\uD83D\uDCE6'}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate">{item.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] px-1.5 py-px rounded-full ${rarityStyle.badgeBg} ${rarityStyle.color}`}>
              {rarityStyle.label}
            </span>
            <span className="text-[10px] text-text-muted">
              {TYPE_LABELS[item.type] || item.type}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-1 truncate">
            {SOURCE_LABELS[item.source] || item.source}
          </p>
        </div>
      </div>

      <button
        onClick={() => item.equipped ? onUnequip(item.id) : onEquip(item.id)}
        className={`w-full mt-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          item.equipped
            ? 'bg-bg-hover hover:bg-gray-500 text-text-secondary'
            : 'bg-accent/10 hover:bg-accent/20 text-accent'
        }`}
      >
        {item.equipped ? 'Ablegen' : 'Anlegen'}
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
  const [activeCategory, setActiveCategory] = useState('all')

  const items = useInventoryStore(selectItems)
  const { equipItem, unequipItem } = useInventoryStore()

  const filteredItems = activeCategory === 'all'
    ? items
    : activeCategory === 'avatar'
      ? items.filter((i) => ['avatar-item', 'hat', 'accessory'].includes(i.type))
      : items.filter((i) => i.type === activeCategory)

  const categoryTabs = CATEGORIES.map((cat) => {
    const count = cat.key === 'all'
      ? items.length
      : cat.key === 'avatar'
        ? items.filter((i) => ['avatar-item', 'hat', 'accessory'].includes(i.type)).length
        : items.filter((i) => i.type === cat.key).length
    return { id: cat.key, label: cat.label, count }
  })

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

      {/* Category Tabs */}
      <Tabs tabs={categoryTabs} activeTab={activeCategory} onChange={setActiveCategory} className="mb-6" />

      {/* Item Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onEquip={equipItem}
              onUnequip={unequipItem}
            />
          ))}
        </div>
      ) : (
        <EmptyTabState
          icon={'\uD83D\uDCE6'}
          title="Keine Items in dieser Kategorie"
          description="Schalte Achievements frei, schliesse Quests ab oder kaufe im Shop, um Items zu erhalten!"
          actionLabel={t('inventory.toMarketplace', 'Zum Shop')}
          actionLink="/shop"
        />
      )}
    </div>
  )
}
