import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AvatarRenderer from '../components/profile/AvatarRenderer'
import MindCoinIcon from '../components/common/MindCoinIcon'
import useEscapeKey from '../hooks/useEscapeKey'
import {
  Sparkles, User, Scissors, Smile, Crown, Shirt,
  Glasses, Palette, Eye, ShoppingBag,
} from 'lucide-react'

// ============= DATA =============
const SKIN_COLORS = [
  { name: 'Hell', hex: '#FDEBD0' },
  { name: 'Beige', hex: '#F5D6B8' },
  { name: 'Mittel', hex: '#D4A574' },
  { name: 'Olive', hex: '#C4956A' },
  { name: 'Braun', hex: '#8D5524' },
  { name: 'Dunkelbraun', hex: '#5C3317' },
  { name: 'Espresso', hex: '#3B1F0B' },
]

const HAIR_COLORS = [
  { name: 'Schwarz', hex: '#1C1C1C' },
  { name: 'Dunkelbraun', hex: '#2C1810' },
  { name: 'Braun', hex: '#6B3A2A' },
  { name: 'Hellbraun', hex: '#A0522D' },
  { name: 'Blond', hex: '#D4A843' },
  { name: 'Rot', hex: '#8B2500' },
  { name: 'Grau', hex: '#9E9E9E' },
  { name: 'Blau', hex: '#2196F3' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Lila', hex: '#9b59b6' },
  { name: 'Gruen', hex: '#27ae60' },
]

const EYE_COLORS = [
  { name: 'Braun', hex: '#6B3A2A' },
  { name: 'Dunkelbraun', hex: '#3E2723' },
  { name: 'Blau', hex: '#4A90D9' },
  { name: 'Gruen', hex: '#5B8C5A' },
  { name: 'Grau', hex: '#8E8E8E' },
  { name: 'Bernstein', hex: '#D4A843' },
  { name: 'Lila', hex: '#9B59B6' },
  { name: 'Rot', hex: '#C0392B' },
]

const CLOTHING_COLORS = [
  { name: 'Anthrazit', hex: '#374151' },
  { name: 'Schwarz', hex: '#1a1a1a' },
  { name: 'Weiss', hex: '#e8e8e8' },
  { name: 'Rot', hex: '#c0392b' },
  { name: 'Blau', hex: '#2980b9' },
  { name: 'Gruen', hex: '#27ae60' },
  { name: 'Lila', hex: '#8e44ad' },
  { name: 'Orange', hex: '#e67e22' },
  { name: 'Navy', hex: '#2c3e50' },
  { name: 'Pink', hex: '#e84393' },
]

const HAIR_STYLES = [
  { id: 'short', name: 'Kurz' },
  { id: 'long', name: 'Lang' },
  { id: 'curly', name: 'Lockig' },
  { id: 'buzz', name: 'Buzz Cut' },
  { id: 'ponytail', name: 'Zopf' },
  { id: 'mohawk', name: 'Irokese' },
  { id: 'messy', name: 'Strubbelig' },
  { id: 'bob', name: 'Bob' },
  { id: 'spiky', name: 'Stachelig' },
  { id: 'braids', name: 'Zoepfe' },
  { id: 'afro', name: 'Afro' },
  { id: 'pixie', name: 'Pixie' },
  { id: 'sidepart', name: 'Seitenscheitel' },
  { id: 'undercut', name: 'Undercut' },
]

const EYE_TYPES = [
  { id: 'round', name: 'Rund' },
  { id: 'almond', name: 'Mandel' },
  { id: 'sleepy', name: 'Schlaefrig' },
  { id: 'cat', name: 'Katze' },
  { id: 'wide', name: 'Gross' },
]

const EYEBROW_TYPES = [
  { id: 'none', name: 'Keine' },
  { id: 'normal', name: 'Normal' },
  { id: 'thick', name: 'Dick' },
  { id: 'arched', name: 'Geschwungen' },
  { id: 'angry', name: 'Wuetend' },
  { id: 'thin', name: 'Duenn' },
]

const MOUTH_TYPES = [
  { id: 'smile', name: 'Laecheln' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'open', name: 'Offen' },
  { id: 'smirk', name: 'Grinsen' },
  { id: 'grin', name: 'Breit' },
]

const ACCESSORY_TYPES = [
  { id: 'none', name: 'Keine', price: 0 },
  { id: 'glasses', name: 'Brille', price: 0 },
  { id: 'sunglasses', name: 'Sonnenbrille', price: 0 },
  { id: 'earring', name: 'Ohrring', price: 0 },
  { id: 'headphones', name: 'Kopfhoerer', price: 50 },
  { id: 'mask', name: 'Maske', price: 75 },
  { id: 'scarf', name: 'Schal', price: 60 },
  { id: 'monocle', name: 'Monokel', price: 120 },
  { id: 'bowtie', name: 'Fliege', price: 80 },
  { id: 'bandana', name: 'Bandana', price: 40 },
]

const HAT_TYPES = [
  { id: 'none', name: 'Keine', price: 0, rarity: 'common' },
  { id: 'baseball', name: 'Baseball Cap', price: 0, rarity: 'common' },
  { id: 'beanie', name: 'Beanie', price: 0, rarity: 'common' },
  { id: 'catears', name: 'Katzenohren', price: 100, rarity: 'rare' },
  { id: 'cowboy', name: 'Cowboyhut', price: 150, rarity: 'rare' },
  { id: 'santa', name: 'Weihnachtsmuetze', price: 150, rarity: 'rare' },
  { id: 'tophat', name: 'Zylinder', price: 200, rarity: 'epic' },
  { id: 'pirate', name: 'Piratenhut', price: 250, rarity: 'epic' },
  { id: 'wizard', name: 'Zauberhut', price: 300, rarity: 'epic' },
  { id: 'viking', name: 'Wikingerhelm', price: 350, rarity: 'epic' },
  { id: 'helmet', name: 'Helm', price: 200, rarity: 'rare' },
  { id: 'crown', name: 'Krone', price: 500, rarity: 'legendary' },
  { id: 'fedora', name: 'Fedora', price: 180, rarity: 'epic' },
  { id: 'beret', name: 'Baskenmtze', price: 120, rarity: 'rare' },
  { id: 'partyhat', name: 'Partyhut', price: 100, rarity: 'rare' },
  { id: 'bunnyears', name: 'Hasenohren', price: 200, rarity: 'epic' },
  { id: 'chef', name: 'Kochmuetze', price: 150, rarity: 'rare' },
  { id: 'astronaut', name: 'Astronaut', price: 400, rarity: 'legendary' },
]

const CLOTHING_TYPES = [
  { id: 'tshirt', name: 'T-Shirt' },
  { id: 'hoodie', name: 'Hoodie' },
  { id: 'jacket', name: 'Jacke' },
  { id: 'tank', name: 'Tank Top' },
  { id: 'suit', name: 'Anzug' },
]

const BG_STYLES = [
  { id: 'gray', name: 'Grau', color: '#374151' },
  { id: 'blue', name: 'Blau', color: '#1e3a5f' },
  { id: 'purple', name: 'Lila', color: '#4a1a6b' },
  { id: 'green', name: 'Gruen', color: '#1a4a2e' },
  { id: 'red', name: 'Rot', color: '#7f1d1d' },
  { id: 'pink', name: 'Pink', color: '#831843' },
  { id: 'sunset', name: 'Sunset', color: 'linear-gradient(135deg, #ff6b35, #4a1a6b)' },
  { id: 'galaxy', name: 'Galaxy', color: 'radial-gradient(#1a0533, #000)' },
  { id: 'fire', name: 'Feuer', color: 'linear-gradient(0deg, #b71c1c, #ff8f00)' },
  { id: 'ocean', name: 'Ozean', color: 'linear-gradient(180deg, #0077b6, #03045e)' },
  { id: 'forest', name: 'Wald', color: 'linear-gradient(180deg, #2d6a4f, #1b4332)' },
  { id: 'neon', name: 'Neon', color: 'linear-gradient(90deg, #7b2ff7, #00e5ff)' },
  { id: 'arctic', name: 'Arktis', color: 'linear-gradient(180deg, #e3f2fd, #42a5f5)' },
  { id: 'cherry', name: 'Kirsche', color: 'linear-gradient(180deg, #f8bbd0, #880e4f)' },
  { id: 'candy', name: 'Candy', color: 'linear-gradient(90deg, #f48fb1, #80deea)' },
  { id: 'mindforge', name: 'MindForge', color: 'linear-gradient(180deg, #f97316, #9a3412)' },
]

const RARITY_CONFIG = {
  common: { name: 'Gewoehnlich', color: 'text-gray-400', border: 'border-gray-500/30', bg: 'bg-gray-500/10' },
  rare: { name: 'Selten', color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10' },
  epic: { name: 'Episch', color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10' },
  legendary: { name: 'Legendaer', color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10' },
}

const AVATAR_PRESETS = [
  {
    id: 'warrior', name: 'Krieger', emoji: '\u2694\uFE0F',
    config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'buzz', eyeType: 'almond', eyeColor: '#3E2723', eyebrows: 'angry', mouth: 'neutral', accessory: 'none', hat: 'none', clothing: 'tank', clothingColor: '#1a1a1a', bgStyle: 'gray' },
  },
  {
    id: 'scholar', name: 'Gelehrter', emoji: '\u{1F4DA}',
    config: { skinColor: '#F5D6B8', hairColor: '#6B3A2A', hairStyle: 'short', eyeType: 'round', eyeColor: '#4A90D9', eyebrows: 'arched', mouth: 'smile', accessory: 'glasses', hat: 'none', clothing: 'suit', clothingColor: '#2c3e50', bgStyle: 'blue' },
  },
  {
    id: 'artist', name: 'Kuenstler', emoji: '\u{1F3A8}',
    config: { skinColor: '#FDEBD0', hairColor: '#E91E63', hairStyle: 'curly', eyeType: 'cat', eyeColor: '#5B8C5A', eyebrows: 'normal', mouth: 'smirk', accessory: 'earring', hat: 'beanie', clothing: 'hoodie', clothingColor: '#8e44ad', bgStyle: 'neon' },
  },
  {
    id: 'hacker', name: 'Hacker', emoji: '\u{1F4BB}',
    config: { skinColor: '#C4956A', hairColor: '#2196F3', hairStyle: 'mohawk', eyeType: 'sleepy', eyeColor: '#8E8E8E', eyebrows: 'thick', mouth: 'smirk', accessory: 'sunglasses', hat: 'none', clothing: 'hoodie', clothingColor: '#1a1a1a', bgStyle: 'green' },
  },
  {
    id: 'hero', name: 'Held', emoji: '\u{1F9B8}',
    config: { skinColor: '#8D5524', hairColor: '#D4A843', hairStyle: 'short', eyeType: 'wide', eyeColor: '#D4A843', eyebrows: 'thick', mouth: 'grin', accessory: 'none', hat: 'none', clothing: 'jacket', clothingColor: '#c0392b', bgStyle: 'fire' },
  },
  {
    id: 'mystic', name: 'Mystiker', emoji: '\u{1F52E}',
    config: { skinColor: '#5C3317', hairColor: '#9E9E9E', hairStyle: 'long', eyeType: 'cat', eyeColor: '#9B59B6', eyebrows: 'arched', mouth: 'neutral', accessory: 'earring', hat: 'wizard', clothing: 'suit', clothingColor: '#4a1a6b', bgStyle: 'galaxy' },
  },
  {
    id: 'ninja', name: 'Ninja', emoji: '\u{1F977}',
    config: { skinColor: '#D4A574', hairColor: '#1C1C1C', hairStyle: 'ponytail', eyeType: 'almond', eyeColor: '#3E2723', eyebrows: 'normal', mouth: 'neutral', accessory: 'mask', hat: 'none', clothing: 'jacket', clothingColor: '#1a1a1a', bgStyle: 'gray' },
  },
  {
    id: 'punk', name: 'Punk', emoji: '\u{1F3B8}',
    config: { skinColor: '#FDEBD0', hairColor: '#8B2500', hairStyle: 'spiky', eyeType: 'round', eyeColor: '#C0392B', eyebrows: 'angry', mouth: 'open', accessory: 'earring', hat: 'none', clothing: 'tank', clothingColor: '#1a1a1a', bgStyle: 'sunset' },
  },
  {
    id: 'pirate', name: 'Pirat', emoji: '\u{1F3F4}\u200D\u2620\uFE0F',
    config: { skinColor: '#C4956A', hairColor: '#2C1810', hairStyle: 'messy', eyeType: 'almond', eyeColor: '#6B3A2A', eyebrows: 'thick', mouth: 'smirk', accessory: 'earring', hat: 'pirate', clothing: 'jacket', clothingColor: '#2c3e50', bgStyle: 'ocean' },
  },
  {
    id: 'royal', name: 'Adlig', emoji: '\u{1F451}',
    config: { skinColor: '#F5D6B8', hairColor: '#D4A843', hairStyle: 'long', eyeType: 'almond', eyeColor: '#4A90D9', eyebrows: 'arched', mouth: 'smile', accessory: 'none', hat: 'crown', clothing: 'suit', clothingColor: '#8e44ad', bgStyle: 'purple' },
  },
]

// Roblox-style sidebar categories
const CATEGORIES = [
  { id: 'presets', name: 'Presets', icon: Sparkles },
  { id: 'skin', name: 'Hautfarbe', icon: User },
  { id: 'hair', name: 'Haare', icon: Scissors },
  { id: 'face', name: 'Gesicht', icon: Smile },
  { id: 'hats', name: 'Huete', icon: Crown },
  { id: 'clothing', name: 'Kleidung', icon: Shirt },
  { id: 'accessories', name: 'Accessoires', icon: Glasses },
  { id: 'background', name: 'Hintergrund', icon: Palette },
]

// ============= SUB-COMPONENTS =============

function ColorPicker({ label, colors, selected, onChange }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            title={color.name}
            className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
              selected === color.hex
                ? 'border-accent scale-110 ring-2 ring-accent/40 ring-offset-1 ring-offset-bg-card'
                : 'border-gray-600 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  )
}

function StyleGrid({ label, options, selected, onChange, columns = 3 }) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</h4>
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              selected === option.id
                ? 'bg-accent/20 text-accent border-accent/40'
                : 'bg-bg-hover/50 text-text-secondary border-transparent hover:bg-bg-hover hover:text-text-primary'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function HatItemCard({ hat, isOwned, isEquipped, onSelect, avatarConfig }) {
  const rarity = RARITY_CONFIG[hat.rarity] || RARITY_CONFIG.common
  const isFree = hat.price === 0

  return (
    <button
      onClick={() => onSelect(hat)}
      className={`relative rounded-xl p-2 border transition-all cursor-pointer text-left hover:scale-[1.03] ${
        isEquipped
          ? 'border-accent ring-2 ring-accent/30 bg-accent/10'
          : `${rarity.border} ${rarity.bg} hover:border-gray-400`
      }`}
    >
      {/* Mini preview */}
      <div className="w-full aspect-square rounded-lg bg-bg-primary/50 flex items-center justify-center mb-2 overflow-hidden">
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
          size={80}
        />
      </div>
      <p className="text-xs font-semibold text-text-primary truncate">{hat.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] ${rarity.color}`}>{rarity.name}</span>
        {isFree ? (
          <span className="text-[10px] text-success font-medium">Gratis</span>
        ) : isOwned ? (
          <span className="text-[10px] text-accent font-medium">Gekauft</span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-warning font-medium">
            <MindCoinIcon size={10} /> {hat.price}
          </span>
        )}
      </div>
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white text-[10px]">{'\u2713'}</span>
        </div>
      )}
    </button>
  )
}

function AccessoryItemCard({ item, isOwned, isEquipped, onSelect, avatarConfig }) {
  const isFree = item.price === 0

  return (
    <button
      onClick={() => onSelect(item)}
      className={`relative rounded-xl p-2 border transition-all cursor-pointer text-left hover:scale-[1.03] ${
        isEquipped
          ? 'border-accent ring-2 ring-accent/30 bg-accent/10'
          : 'border-gray-600/30 bg-gray-500/10 hover:border-gray-400'
      }`}
    >
      <div className="w-full aspect-square rounded-lg bg-bg-primary/50 flex items-center justify-center mb-2 overflow-hidden">
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
          size={80}
        />
      </div>
      <p className="text-xs font-semibold text-text-primary truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        {isFree ? (
          <span className="text-[10px] text-success font-medium">Gratis</span>
        ) : isOwned ? (
          <span className="text-[10px] text-accent font-medium">Gekauft</span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-warning font-medium">
            <MindCoinIcon size={10} /> {item.price}
          </span>
        )}
      </div>
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white text-[10px]">{'\u2713'}</span>
        </div>
      )}
    </button>
  )
}

function PurchaseModal({ item, onClose, onConfirm, userBalance }) {
  useEscapeKey(onClose)

  const canAfford = (userBalance || 0) >= item.price
  const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-2xl max-w-sm w-full overflow-hidden border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold">Item kaufen</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg cursor-pointer">{'\u2715'}</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-xl font-bold text-text-primary">{item.name}</p>
            {item.rarity && <span className={`text-xs ${rarity.color}`}>{rarity.name}</span>}
          </div>

          <div className="flex items-center justify-between bg-bg-card rounded-xl p-4">
            <div>
              <p className="text-xs text-text-muted">Preis</p>
              <p className="text-lg font-bold text-warning flex items-center gap-1.5">
                <MindCoinIcon size={20} /> {item.price} MC
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Dein Guthaben</p>
              <p className={`text-lg font-bold ${canAfford ? 'text-success' : 'text-error'} flex items-center gap-1.5 justify-end`}>
                <MindCoinIcon size={20} /> {(userBalance || 0).toLocaleString('de-DE')} MC
              </p>
            </div>
          </div>

          {canAfford ? (
            <button
              onClick={() => onConfirm(item)}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer"
            >
              Kaufen fuer {item.price} MC
            </button>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-error text-sm font-medium">
                Nicht genug MindCoins! Dir fehlen {item.price - (userBalance || 0)} MC.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-warning hover:bg-yellow-600 text-black px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                <ShoppingBag size={14} className="inline mr-1.5 -mt-0.5" />
                Zum Shop
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
  const { user, updateUser } = useAuth()
  const [activeCategory, setActiveCategory] = useState('presets')
  const [purchaseItem, setPurchaseItem] = useState(null)

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
          eyes: config.eyeType,
          eyeType: config.eyeType,
          eyeColor: config.eyeColor,
          eyebrows: config.eyebrows,
          mouth: config.mouth,
          accessory: config.accessory,
          hat: config.hat,
          clothing: config.clothing,
          clothingColor: config.clothingColor,
          bgStyle: config.bgStyle,
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

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // ============= RENDER =============
  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h1 className="text-2xl font-bold">Avatar anpassen</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm bg-bg-card px-3 py-1.5 rounded-full border border-gray-700">
            <MindCoinIcon size={16} />
            <span className="font-semibold text-accent">{(user?.mindCoins || 0).toLocaleString('de-DE')}</span>
          </span>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            saveStatus === 'saved' ? 'bg-success/20 text-success' :
            saveStatus === 'saving' ? 'bg-accent/20 text-accent' :
            'bg-warning/20 text-warning'
          }`}>
            {saveStatus === 'saved' ? 'Gespeichert' :
             saveStatus === 'saving' ? 'Speichere...' :
             'Ungespeichert'}
          </span>
        </div>
      </div>

      {/* Main Layout - Roblox style: Sidebar | Preview | Panel */}
      <div className="flex gap-3 min-h-[calc(100vh-180px)]">
        {/* Left: Category Sidebar (Roblox-style icons) */}
        <div className="w-14 flex-shrink-0 bg-bg-card rounded-xl py-3 flex flex-col items-center gap-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                title={cat.name}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <Icon size={18} />
                {/* Tooltip */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-bg-primary text-text-primary text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-gray-700 shadow-lg">
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Center: Avatar Preview */}
        <div className="flex-shrink-0 w-72 bg-bg-card rounded-xl flex flex-col items-center justify-center p-6">
          {/* Stage background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary/30 rounded-full" />
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
              size={240}
              username={user?.username}
              animated
            />
          </div>
          <p className="mt-4 text-lg font-bold text-text-primary">{user?.username}</p>
          <p className="text-text-muted text-xs">Live-Vorschau</p>

          {/* Quick equipped summary */}
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {avatarConfig.hat !== 'none' && (
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                {HAT_TYPES.find(h => h.id === avatarConfig.hat)?.name}
              </span>
            )}
            {avatarConfig.accessory !== 'none' && (
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                {ACCESSORY_TYPES.find(a => a.id === avatarConfig.accessory)?.name}
              </span>
            )}
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="flex-1 bg-bg-card rounded-xl overflow-hidden flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {(() => {
                const cat = CATEGORIES.find(c => c.id === activeCategory)
                const Icon = cat?.icon || Sparkles
                return <><Icon size={18} className="text-accent" /> {cat?.name}</>
              })()}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* PRESETS */}
            {activeCategory === 'presets' && (
              <div>
                <p className="text-xs text-text-muted mb-4">Waehle ein Preset als Startpunkt oder passe alles individuell an.</p>
                <div className="grid grid-cols-2 gap-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="flex items-center gap-3 p-3 bg-bg-hover/50 rounded-xl hover:bg-bg-hover border border-transparent hover:border-accent/30 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
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
                          size={48}
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {preset.emoji} {preset.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SKIN */}
            {activeCategory === 'skin' && (
              <ColorPicker
                label="Hautfarbe"
                colors={SKIN_COLORS}
                selected={avatarConfig.skinColor}
                onChange={(color) => updateConfig('skinColor', color)}
              />
            )}

            {/* HAIR */}
            {activeCategory === 'hair' && (
              <>
                <StyleGrid
                  label="Frisur"
                  options={HAIR_STYLES}
                  selected={avatarConfig.hairStyle}
                  onChange={(style) => updateConfig('hairStyle', style)}
                  columns={3}
                />
                <ColorPicker
                  label="Haarfarbe"
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
                  label="Augenform"
                  options={EYE_TYPES}
                  selected={avatarConfig.eyeType}
                  onChange={(type) => updateConfig('eyeType', type)}
                />
                <ColorPicker
                  label="Augenfarbe"
                  colors={EYE_COLORS}
                  selected={avatarConfig.eyeColor}
                  onChange={(color) => updateConfig('eyeColor', color)}
                />
                <StyleGrid
                  label="Augenbrauen"
                  options={EYEBROW_TYPES}
                  selected={avatarConfig.eyebrows}
                  onChange={(type) => updateConfig('eyebrows', type)}
                />
                <StyleGrid
                  label="Mund"
                  options={MOUTH_TYPES}
                  selected={avatarConfig.mouth}
                  onChange={(type) => updateConfig('mouth', type)}
                />
              </>
            )}

            {/* HATS */}
            {activeCategory === 'hats' && (
              <div>
                <p className="text-xs text-text-muted mb-3">
                  Kostenlose und Premium-Huete. Premium-Huete kaufst du mit MindCoins.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {HAT_TYPES.map((hat) => (
                    <HatItemCard
                      key={hat.id}
                      hat={hat}
                      isOwned={hat.price === 0 || ownedHats.includes(hat.id)}
                      isEquipped={avatarConfig.hat === hat.id}
                      onSelect={handleSelectHat}
                      avatarConfig={avatarConfig}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CLOTHING */}
            {activeCategory === 'clothing' && (
              <>
                <StyleGrid
                  label="Kleidungsstil"
                  options={CLOTHING_TYPES}
                  selected={avatarConfig.clothing}
                  onChange={(style) => updateConfig('clothing', style)}
                />
                <ColorPicker
                  label="Kleidungsfarbe"
                  colors={CLOTHING_COLORS}
                  selected={avatarConfig.clothingColor}
                  onChange={(color) => updateConfig('clothingColor', color)}
                />
              </>
            )}

            {/* ACCESSORIES */}
            {activeCategory === 'accessories' && (
              <div>
                <p className="text-xs text-text-muted mb-3">
                  Accessoires fuer deinen Avatar. Einige kosten MindCoins.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ACCESSORY_TYPES.map((item) => (
                    <AccessoryItemCard
                      key={item.id}
                      item={item}
                      isOwned={item.price === 0 || ownedAccessories.includes(item.id)}
                      isEquipped={avatarConfig.accessory === item.id}
                      onSelect={handleSelectAccessory}
                      avatarConfig={avatarConfig}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* BACKGROUND */}
            {activeCategory === 'background' && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Hintergrund</h4>
                <div className="grid grid-cols-4 gap-3">
                  {BG_STYLES.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => updateConfig('bgStyle', bg.id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                        avatarConfig.bgStyle === bg.id
                          ? 'border-accent ring-2 ring-accent/30'
                          : 'border-transparent hover:border-gray-500'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-gray-600"
                        style={{ background: bg.color }}
                      />
                      <span className="text-[10px] text-text-muted">{bg.name}</span>
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
        />
      )}
    </div>
  )
}
