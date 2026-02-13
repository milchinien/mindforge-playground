// ============= AVATAR ITEM DATA =============
// Shared between Avatar editor and Marketplace

export const SKIN_COLORS = [
  { name: 'Hell', hex: '#FDEBD0' },
  { name: 'Beige', hex: '#F5D6B8' },
  { name: 'Mittel', hex: '#D4A574' },
  { name: 'Olive', hex: '#C4956A' },
  { name: 'Braun', hex: '#8D5524' },
  { name: 'Dunkelbraun', hex: '#5C3317' },
  { name: 'Espresso', hex: '#3B1F0B' },
]

export const HAIR_COLORS = [
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

export const EYE_COLORS = [
  { name: 'Braun', hex: '#6B3A2A' },
  { name: 'Dunkelbraun', hex: '#3E2723' },
  { name: 'Blau', hex: '#4A90D9' },
  { name: 'Gruen', hex: '#5B8C5A' },
  { name: 'Grau', hex: '#8E8E8E' },
  { name: 'Bernstein', hex: '#D4A843' },
  { name: 'Lila', hex: '#9B59B6' },
  { name: 'Rot', hex: '#C0392B' },
]

export const CLOTHING_COLORS = [
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

export const HAIR_STYLES = [
  { id: 'short', name: 'Kurz', price: 0 },
  { id: 'long', name: 'Lang', price: 0 },
  { id: 'curly', name: 'Lockig', price: 0 },
  { id: 'buzz', name: 'Buzz Cut', price: 0 },
  { id: 'ponytail', name: 'Zopf', price: 30 },
  { id: 'mohawk', name: 'Irokese', price: 60 },
  { id: 'messy', name: 'Strubbelig', price: 0 },
  { id: 'bob', name: 'Bob', price: 25 },
  { id: 'spiky', name: 'Stachelig', price: 40 },
  { id: 'braids', name: 'Zoepfe', price: 50 },
  { id: 'afro', name: 'Afro', price: 35 },
  { id: 'pixie', name: 'Pixie', price: 30 },
  { id: 'sidepart', name: 'Seitenscheitel', price: 0 },
  { id: 'undercut', name: 'Undercut', price: 45 },
]

export const EYE_TYPES = [
  { id: 'round', name: 'Rund' },
  { id: 'almond', name: 'Mandel' },
  { id: 'sleepy', name: 'Schlaefrig' },
  { id: 'cat', name: 'Katze' },
  { id: 'wide', name: 'Gross' },
]

export const EYEBROW_TYPES = [
  { id: 'none', name: 'Keine' },
  { id: 'normal', name: 'Normal' },
  { id: 'thick', name: 'Dick' },
  { id: 'arched', name: 'Geschwungen' },
  { id: 'angry', name: 'Wuetend' },
  { id: 'thin', name: 'Duenn' },
]

export const MOUTH_TYPES = [
  { id: 'smile', name: 'Laecheln' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'open', name: 'Offen' },
  { id: 'smirk', name: 'Grinsen' },
  { id: 'grin', name: 'Breit' },
]

export const BODY_TYPES = [
  { id: 'slim', name: 'Schmal', desc: 'Schmale Schultern' },
  { id: 'normal', name: 'Normal', desc: 'Standard-Figur' },
  { id: 'athletic', name: 'Sportlich', desc: 'Trainierte Figur' },
  { id: 'wide', name: 'Breit', desc: 'Breite Schultern' },
  { id: 'stocky', name: 'Staemmig', desc: 'Kraeftige Statur' },
]

export const ACCESSORY_TYPES = [
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

export const HAT_TYPES = [
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

export const CLOTHING_TYPES = [
  { id: 'tshirt', name: 'T-Shirt', price: 0 },
  { id: 'hoodie', name: 'Hoodie', price: 30 },
  { id: 'jacket', name: 'Jacke', price: 50 },
  { id: 'tank', name: 'Tank Top', price: 0 },
  { id: 'suit', name: 'Anzug', price: 80 },
]

export const BG_STYLES = [
  { id: 'gray', name: 'Grau', color: '#374151', price: 0 },
  { id: 'blue', name: 'Blau', color: '#1e3a5f', price: 0 },
  { id: 'purple', name: 'Lila', color: '#4a1a6b', price: 0 },
  { id: 'green', name: 'Gruen', color: '#1a4a2e', price: 0 },
  { id: 'red', name: 'Rot', color: '#7f1d1d', price: 0 },
  { id: 'pink', name: 'Pink', color: '#831843', price: 0 },
  { id: 'sunset', name: 'Sunset', color: 'linear-gradient(135deg, #ff6b35, #4a1a6b)', price: 40 },
  { id: 'galaxy', name: 'Galaxy', color: 'radial-gradient(#1a0533, #000)', price: 60 },
  { id: 'fire', name: 'Feuer', color: 'linear-gradient(0deg, #b71c1c, #ff8f00)', price: 75 },
  { id: 'ocean', name: 'Ozean', color: 'linear-gradient(180deg, #0077b6, #03045e)', price: 50 },
  { id: 'forest', name: 'Wald', color: 'linear-gradient(180deg, #2d6a4f, #1b4332)', price: 40 },
  { id: 'neon', name: 'Neon', color: 'linear-gradient(90deg, #7b2ff7, #00e5ff)', price: 100 },
  { id: 'arctic', name: 'Arktis', color: 'linear-gradient(180deg, #e3f2fd, #42a5f5)', price: 50 },
  { id: 'cherry', name: 'Kirsche', color: 'linear-gradient(180deg, #f8bbd0, #880e4f)', price: 45 },
  { id: 'candy', name: 'Candy', color: 'linear-gradient(90deg, #f48fb1, #80deea)', price: 55 },
  { id: 'mindforge', name: 'MindForge', color: 'linear-gradient(180deg, #f97316, #9a3412)', price: 150 },
]

export const RARITY_CONFIG = {
  common: { name: 'Gewoehnlich', color: 'text-gray-400', border: 'border-gray-500/30', bg: 'bg-gray-500/10', glow: '' },
  rare: { name: 'Selten', color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10', glow: 'shadow-blue-500/10' },
  epic: { name: 'Episch', color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/10', glow: 'shadow-purple-500/15' },
  legendary: { name: 'Legendaer', color: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10', glow: 'shadow-orange-500/20' },
}

// Marketplace category definitions
export const MARKETPLACE_CATEGORIES = [
  { id: 'all', name: 'Alle', icon: 'Package' },
  { id: 'hats', name: 'Huete', icon: 'Crown' },
  { id: 'hair', name: 'Haare', icon: 'Scissors' },
  { id: 'accessories', name: 'Accessoires', icon: 'Glasses' },
  { id: 'clothing', name: 'Kleidung', icon: 'Shirt' },
  { id: 'background', name: 'Hintergrund', icon: 'Palette' },
  { id: 'face', name: 'Gesicht', icon: 'Smile' },
]
