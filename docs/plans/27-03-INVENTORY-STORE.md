# Step 3: Inventory Store

## Ziel

Zentraler Store für alle Items die der User besitzt.
Items kommen aus: Default-Starter, Achievements, Quests, Season-Rewards, Shop-Käufe.
Ersetzt das bisherige `user.purchasedItems`-Array im AuthContext.

---

## 3.1 Neuer Store: `src/stores/inventoryStore.js`

**localStorage-Key:** `'mindforge-inventory'`

### Konstante (außerhalb des Stores, aber in der gleichen Datei)

```js
const DEFAULT_STARTER_ITEMS = [
  {
    id: 'title-neuling',
    type: 'title',
    name: 'Neuling',
    description: 'Jeder fängt mal an',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
  {
    id: 'badge-willkommen',
    type: 'badge',
    name: 'Willkommen',
    description: 'Willkommen bei MindForge!',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
  {
    id: 'bg-default',
    type: 'background',
    name: 'Standard',
    description: 'Standard-Hintergrund',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
]
```

### State

```js
{
  items: [...DEFAULT_STARTER_ITEMS]
  // Jedes Item hat:
  // {
  //   id: string,              // Eindeutig (z.B. "title-anfaenger", "hat-crown", "season-5-free")
  //   type: string,            // 'title' | 'badge' | 'avatar-item' | 'frame' | 'effect' | 'background' | 'hat' | 'accessory'
  //   name: string,
  //   description: string,
  //   rarity: string,          // 'common' | 'rare' | 'epic' | 'legendary'
  //   source: string,          // 'default' | 'achievement' | 'quest' | 'season' | 'shop' | 'event'
  //   acquiredAt: string,      // ISO-Timestamp
  //   equipped: boolean
  // }
}
```

### Actions — Exakte Signaturen

```js
addItem({ id, type, name, description = '', rarity = 'common', source = 'shop' })
  // 1. Prüfen: items.some(i => i.id === id) → wenn true: return false
  // 2. Neues Item erstellen: { id, type, name, description, rarity, source, acquiredAt: new Date().toISOString(), equipped: false }
  // 3. Zu items hinzufügen
  // 4. Return true

removeItem(itemId)
  // items = items.filter(i => i.id !== itemId)

equipItem(itemId)
  // 1. Item finden: const item = items.find(i => i.id === itemId)
  // 2. Wenn nicht gefunden → return
  // 3. Exklusiv-Typen (nur 1 gleichzeitig aktiv): 'title', 'frame', 'background'
  //    Wenn item.type einer dieser Typen ist:
  //    → Alle anderen Items gleichen Typs: equipped = false
  // 4. item.equipped = true
  //
  // HINWEIS: 'badge', 'hat', 'accessory', 'effect', 'avatar-item' können mehrfach equipped sein

unequipItem(itemId)
  // items.map(i => i.id === itemId ? { ...i, equipped: false } : i)

getItemsByType(type)
  // return get().items.filter(i => i.type === type)

getEquippedItems()
  // return get().items.filter(i => i.equipped)

getEquippedTitle()
  // return get().items.find(i => i.type === 'title' && i.equipped)?.name || null

hasItem(itemId)
  // return get().items.some(i => i.id === itemId)

getItemCount()
  // return get().items.length

getItemsBySource(source)
  // return get().items.filter(i => i.source === source)
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-inventory',
    partialize: (state) => ({
      items: state.items,
    }),
  }
)
```

### Initialisierungs-Logik

```
Beim ersten Laden (kein persisted State vorhanden):
  → items = [...DEFAULT_STARTER_ITEMS]

Wenn persisted State vorhanden und items.length > 0:
  → Persisted items verwenden (keine Starter-Items erneut einfügen)

Wenn persisted State vorhanden aber items.length === 0:
  → Das ist ein gültiger Zustand (User hat alles entfernt/verkauft) — NICHT automatisch Starter-Items einfügen
```

**Umsetzung:** Den Default-Wert des State auf `DEFAULT_STARTER_ITEMS` setzen. Zustand-Persist überschreibt diesen Default automatisch wenn ein persistierter State existiert. Wenn kein persistierter State existiert, werden die Default-Starter-Items verwendet.

---

## Kategorie-Zuordnung für die UI (wird in Step 9 bei Inventory.jsx genutzt)

```
Kategorie-Tabs für die Inventory-Page:

| Tab-Label | Filter (type) |
|-----------|---------------|
| Alle | kein Filter |
| Titel | 'title' |
| Badges | 'badge' |
| Avatar | 'avatar-item', 'hat', 'accessory' |
| Rahmen | 'frame' |
| Hintergründe | 'background' |
| Effekte | 'effect' |
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/inventoryStore.js` | **NEU erstellen** |

## Prüfung nach Implementierung

1. Dev-Server starten — keine Fehler
2. Browser-Konsole:

```js
const inv = JSON.parse(localStorage.getItem('mindforge-inventory'))
console.log(inv.state.items)
// → Sollte 3 Default-Starter-Items enthalten
```

3. Seite neu laden → Items sind noch da (Persistenz funktioniert)
4. Keine bestehende Funktionalität darf brechen (Inventory-Page nutzt den Store erst in Step 9)
