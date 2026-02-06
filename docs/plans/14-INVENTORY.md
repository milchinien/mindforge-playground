# 14 - Inventar (Inventory)

## Was wird hier gemacht?

In diesem Schritt baust du die Inventar-Seite unter `/inventory`. Hier sieht der User alle seine gesammelten und gekauften Items: Avatar-Items (kosmetische Gegenstaende), gekaufte Spiele und heruntergeladene Assets. Fuer den MVP ist dies primaer eine Anzeige-Seite mit Mock-Daten und einem "Anlegen"-Button fuer Avatar-Items.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- User muss eingeloggt sein

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  INVENTAR (/inventory)                                            │
│                                                                    │
│  ┌──────────────┬──────────────────┬──────────────────┐          │
│  │ Avatar Items │ Gekaufte Spiele  │ Assets           │   TABS   │
│  └──────────────┴──────────────────┴──────────────────┘          │
│                                                                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐   │
│  │  [Icon]    │  │  [Icon]    │  │  [Icon]    │  │  [Icon]  │   │
│  │  Goldener  │  │  Feuer-    │  │  Krone     │  │  Neon-   │   │
│  │  Rahmen    │  │  Haarfarbe │  │            │  │  Augen   │   │
│  │            │  │            │  │            │  │          │   │
│  │  Selten    │  │  Gewoehnl. │  │  Episch    │  │  Selten  │   │
│  │ [Anlegen]  │  │ [Angelegt] │  │ [Anlegen]  │  │[Anlegen] │   │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘   │
│                                                                    │
│  (Bei "Gekaufte Spiele" und "Assets": EmptyState)                │
└──────────────────────────────────────────────────────────────────┘
```

---

## Rarity-System (Seltenheitsstufen)

Jedes Item hat eine Seltenheitsstufe die sich in der Farbe widerspiegelt:

```javascript
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
```

---

## Mock-Daten: Avatar Items

```javascript
const MOCK_AVATAR_ITEMS = [
  {
    id: 'item-1',
    name: 'Goldener Rahmen',
    description: 'Ein glaenzender goldener Rahmen fuer deinen Avatar',
    icon: '🖼️',
    rarity: 'rare',
    type: 'frame',
    equipped: false,
    obtainedAt: '2025-01-15T10:30:00Z',
    source: 'Event: Neujahrs-Challenge',
  },
  {
    id: 'item-2',
    name: 'Feuer-Haarfarbe',
    description: 'Leuchtend rote Haare mit Flammen-Effekt',
    icon: '🔥',
    rarity: 'common',
    type: 'hair_color',
    equipped: true,
    obtainedAt: '2025-02-01T14:00:00Z',
    source: 'Shop',
  },
  {
    id: 'item-3',
    name: 'Diamant-Krone',
    description: 'Eine funkelnde Krone fuer die Koepfe der Besten',
    icon: '👑',
    rarity: 'epic',
    type: 'accessory',
    equipped: false,
    obtainedAt: '2025-01-20T08:15:00Z',
    source: 'Achievement: Mathe-Genie',
  },
  {
    id: 'item-4',
    name: 'Neon-Augen',
    description: 'Leuchtende Neon-Augen die im Dunkeln strahlen',
    icon: '👁️',
    rarity: 'rare',
    type: 'eyes',
    equipped: false,
    obtainedAt: '2025-02-05T16:45:00Z',
    source: 'Marketplace',
  },
  {
    id: 'item-5',
    name: 'Sternen-Hintergrund',
    description: 'Ein animierter Sternenhimmel als Avatar-Hintergrund',
    icon: '✨',
    rarity: 'legendary',
    type: 'background',
    equipped: false,
    obtainedAt: '2024-12-25T00:00:00Z',
    source: 'Event: Weihnachts-Special',
  },
  {
    id: 'item-6',
    name: 'Pixel-Brille',
    description: 'Eine stylische Pixel-Art Sonnenbrille',
    icon: '🕶️',
    rarity: 'common',
    type: 'accessory',
    equipped: false,
    obtainedAt: '2025-01-10T11:20:00Z',
    source: 'Shop',
  },
  {
    id: 'item-7',
    name: 'Regenbogen-Aura',
    description: 'Ein schimmernder Regenbogen-Effekt um deinen Avatar',
    icon: '🌈',
    rarity: 'epic',
    type: 'effect',
    equipped: false,
    obtainedAt: '2025-01-28T09:30:00Z',
    source: 'Event: Pride Month',
  },
  {
    id: 'item-8',
    name: 'Wikinger-Helm',
    description: 'Ein beeindruckender Helm mit Hoernern',
    icon: '⚔️',
    rarity: 'rare',
    type: 'accessory',
    equipped: false,
    obtainedAt: '2025-02-03T13:00:00Z',
    source: 'Marketplace',
  },
]
```

---

## Datei 1: `src/pages/Inventory.jsx`

Die Inventar-Seite mit Tab-Navigation und Item-Grid.

**State:**

```jsx
const [activeTab, setActiveTab] = useState('avatarItems') // 'avatarItems' | 'games' | 'assets'
const [items, setItems] = useState(MOCK_AVATAR_ITEMS)
```

**Tabs:**

```javascript
const TABS = [
  { id: 'avatarItems', label: 'Avatar Items', count: MOCK_AVATAR_ITEMS.length },
  { id: 'games',       label: 'Gekaufte Spiele', count: 0 },
  { id: 'assets',      label: 'Assets', count: 0 },
]
```

### Tab-Navigation

```jsx
<div className="flex border-b border-gray-700 mb-6">
  {TABS.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-6 py-3 text-sm font-medium transition-colors relative
        ${activeTab === tab.id
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
```

### Item-Grid (Avatar Items Tab)

```jsx
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
```

### Empty States (Games und Assets Tabs)

```jsx
{activeTab === 'games' && (
  <EmptyState
    icon="🎮"
    title="Keine gekauften Spiele"
    description="Spiele die du im Marketplace kaufst, erscheinen hier."
    actionLabel="Zum Marketplace"
    actionLink="/marketplace"
  />
)}

{activeTab === 'assets' && (
  <EmptyState
    icon="📦"
    title="Keine Assets"
    description="Assets die du herunterlädst oder kaufst, erscheinen hier."
    actionLabel="Assets durchsuchen"
    actionLink="/marketplace"
  />
)}
```

**EmptyState Sub-Komponente (oder aus common/ importieren falls bereits vorhanden):**

```jsx
function EmptyState({ icon, title, description, actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted mb-6 max-w-md">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg
                     font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
```

---

## InventoryItemCard Komponente

Kann als lokale Komponente oder in `src/components/common/` definiert werden:

```jsx
function InventoryItemCard({ item, onEquip }) {
  const rarity = RARITY_CONFIG[item.rarity]

  return (
    <div className={`bg-bg-card rounded-xl p-4 border ${rarity.borderColor}
                     hover:scale-[1.02] transition-transform cursor-pointer`}>
      {/* Icon */}
      <div className={`w-full aspect-square rounded-lg ${rarity.bgColor}
                       flex items-center justify-center text-4xl mb-3`}>
        {item.icon}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-text-primary truncate">
        {item.name}
      </h3>

      {/* Rarity Badge */}
      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1
                        ${rarity.badgeBg} ${rarity.color}`}>
        {rarity.name}
      </span>

      {/* Equip Button */}
      <button
        onClick={onEquip}
        className={`w-full mt-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${item.equipped
            ? 'bg-success/20 text-success border border-success/30 cursor-default'
            : 'bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30'
          }`}
      >
        {item.equipped ? 'Angelegt' : 'Anlegen'}
      </button>
    </div>
  )
}
```

---

## Equip/Unequip Logik

```jsx
const handleEquip = (itemId) => {
  setItems(prevItems =>
    prevItems.map(item => ({
      ...item,
      // Fuer den MVP: Nur ein Item pro Typ kann angelegt sein
      equipped: item.id === itemId ? !item.equipped : item.equipped,
    }))
  )
  // Spaeter: Firestore-Update und Avatar-Integration
}
```

---

## Firestore-Schema (fuer spaetere Integration)

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  inventory: {
    avatarItems: ['item-1', 'item-3', 'item-5'],  // Array von Item-IDs
    equippedItems: {
      frame: 'item-1',
      accessory: 'item-3',
      background: null,
      effect: null,
    },
    purchasedGames: [],   // Array von Game-IDs
    downloadedAssets: [],  // Array von Asset-IDs
  }
}
```

---

## Datenfluss

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User oeffnet│────>│  Mock-Daten  │────>│  Item-Grid   │
│  /inventory  │     │  werden      │     │  wird        │
│              │     │  geladen     │     │  gerendert   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                │ (Klick auf "Anlegen")
                                                v
                                          ┌──────────────┐
                                          │  Lokaler     │
                                          │  State wird  │
                                          │  aktualisiert│
                                          │ (equipped=   │
                                          │  true/false) │
                                          └──────────────┘
```

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/inventory`, Seite laedt ohne Fehler
2. **Tabs wechseln** - Alle drei Tabs funktionieren, aktiver Tab ist hervorgehoben
3. **Avatar Items anzeigen** - Grid zeigt alle Mock-Items mit korrektem Layout
4. **Rarity-Farben** - Jedes Item hat die korrekte Rarity-Farbe (gray, blue, purple, orange)
5. **Anlegen-Button** - Klicke "Anlegen", Button wechselt zu "Angelegt" (gruen)
6. **Erneut klicken** - Nochmal klicken schaltet zurueck zu "Anlegen"
7. **Empty States** - "Gekaufte Spiele" und "Assets" Tabs zeigen Empty-State-Meldung
8. **Empty State Links** - "Zum Marketplace" Link fuehrt zu `/marketplace`
9. **Responsive** - Grid passt sich an (5 Spalten Desktop, 3 Tablet, 2 Mobile)
10. **Item-Hover** - Karten haben einen leichten Scale-Effekt beim Hover

---

## Checkliste

- [ ] Inventar-Seite unter `/inventory` ist erreichbar
- [ ] Tab-Navigation mit 3 Tabs (Avatar Items, Gekaufte Spiele, Assets)
- [ ] Aktiver Tab ist visuell hervorgehoben (Akzentfarbe + Unterstrich)
- [ ] Item-Count wird neben jedem Tab angezeigt
- [ ] Avatar Items Tab zeigt Grid mit 5-10 Mock-Items
- [ ] Jede Item-Karte zeigt: Icon, Name, Rarity-Badge
- [ ] Rarity-Farben: common=gray, rare=blue, epic=purple, legendary=orange
- [ ] "Anlegen"-Button wechselt zu "Angelegt" (gruen) beim Klicken
- [ ] Gekaufte Spiele Tab zeigt EmptyState mit Link zum Marketplace
- [ ] Assets Tab zeigt EmptyState mit Link zum Marketplace
- [ ] EmptyState hat Icon, Titel, Beschreibung und Action-Button
- [ ] Grid ist responsive (passt Spaltenanzahl an Bildschirmgroesse an)
- [ ] Hover-Effekt auf Item-Karten
- [ ] Seite ist nur fuer eingeloggte User zugaenglich

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Inventory.jsx` | Inventar-Seite mit Tabs, Item-Grid und Empty States |
| `src/data/mockInventory.js` | Mock-Daten fuer Avatar-Items (optional, kann auch direkt in Inventory.jsx) |
