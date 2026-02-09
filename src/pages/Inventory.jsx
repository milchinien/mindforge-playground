import { useState } from 'react'
import { Link } from 'react-router-dom'

const RARITY_CONFIG = {
  common: {
    name: 'Gewoehnlich',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    badgeBg: 'bg-gray-500/20',
  },
  rare: {
    name: 'Selten',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    badgeBg: 'bg-blue-500/20',
  },
  epic: {
    name: 'Episch',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    badgeBg: 'bg-purple-500/20',
  },
  legendary: {
    name: 'Legendaer',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    badgeBg: 'bg-orange-500/20',
  },
}

const MOCK_AVATAR_ITEMS = [
  { id: 'item-1', name: 'Goldener Rahmen', description: 'Ein glaenzender goldener Rahmen fuer deinen Avatar', icon: '🖼️', rarity: 'rare', type: 'frame', equipped: false, source: 'Event: Neujahrs-Challenge' },
  { id: 'item-2', name: 'Feuer-Haarfarbe', description: 'Leuchtend rote Haare mit Flammen-Effekt', icon: '🔥', rarity: 'common', type: 'hair_color', equipped: true, source: 'Shop' },
  { id: 'item-3', name: 'Diamant-Krone', description: 'Eine funkelnde Krone fuer die Koepfe der Besten', icon: '👑', rarity: 'epic', type: 'accessory', equipped: false, source: 'Achievement: Mathe-Genie' },
  { id: 'item-4', name: 'Neon-Augen', description: 'Leuchtende Neon-Augen die im Dunkeln strahlen', icon: '👁️', rarity: 'rare', type: 'eyes', equipped: false, source: 'Marketplace' },
  { id: 'item-5', name: 'Sternen-Hintergrund', description: 'Ein animierter Sternenhimmel als Avatar-Hintergrund', icon: '✨', rarity: 'legendary', type: 'background', equipped: false, source: 'Event: Weihnachts-Special' },
  { id: 'item-6', name: 'Pixel-Brille', description: 'Eine stylische Pixel-Art Sonnenbrille', icon: '🕶️', rarity: 'common', type: 'accessory', equipped: false, source: 'Shop' },
  { id: 'item-7', name: 'Regenbogen-Aura', description: 'Ein schimmernder Regenbogen-Effekt um deinen Avatar', icon: '🌈', rarity: 'epic', type: 'effect', equipped: false, source: 'Event: Pride Month' },
  { id: 'item-8', name: 'Wikinger-Helm', description: 'Ein beeindruckender Helm mit Hoernern', icon: '⚔️', rarity: 'rare', type: 'accessory', equipped: false, source: 'Marketplace' },
]

const TABS = [
  { id: 'avatarItems', label: 'Avatar Items', count: MOCK_AVATAR_ITEMS.length },
  { id: 'games', label: 'Gekaufte Spiele', count: 0 },
  { id: 'assets', label: 'Assets', count: 0 },
]

function InventoryItemCard({ item, onEquip }) {
  const rarity = RARITY_CONFIG[item.rarity]

  return (
    <div className={`bg-bg-card rounded-xl p-4 border ${rarity.borderColor} hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className={`w-full aspect-square rounded-lg ${rarity.bgColor} flex items-center justify-center text-4xl mb-3`}>
        {item.icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary truncate">{item.name}</h3>
      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${rarity.badgeBg} ${rarity.color}`}>
        {rarity.name}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onEquip() }}
        className={`w-full mt-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          item.equipped
            ? 'bg-success/20 text-success border border-success/30'
            : 'bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30'
        }`}
      >
        {item.equipped ? 'Angelegt' : 'Anlegen'}
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
  const [activeTab, setActiveTab] = useState('avatarItems')
  const [items, setItems] = useState(MOCK_AVATAR_ITEMS)

  const handleEquip = (itemId) => {
    setItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        equipped: item.id === itemId ? !item.equipped : item.equipped,
      }))
    )
  }

  return (
    <div className="py-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventar</h1>

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
              {tab.id === 'avatarItems' ? items.length : tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'avatarItems' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onEquip={() => handleEquip(item.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'games' && (
        <EmptyTabState
          icon="🎮"
          title="Keine gekauften Spiele"
          description="Spiele die du im Marketplace kaufst, erscheinen hier."
          actionLabel="Zum Marketplace"
          actionLink="/marketplace"
        />
      )}

      {activeTab === 'assets' && (
        <EmptyTabState
          icon="📦"
          title="Keine Assets"
          description="Assets die du herunterlaedst oder kaufst, erscheinen hier."
          actionLabel="Assets durchsuchen"
          actionLink="/marketplace"
        />
      )}
    </div>
  )
}
