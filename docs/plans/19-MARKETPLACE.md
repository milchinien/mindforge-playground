# 19 - Asset-Marketplace

## Was wird hier gemacht?

In diesem Schritt baust du den Asset-Marketplace unter `/marketplace`. Hier koennen User Assets wie 3D-Modelle, Texturen, Audio-Dateien und Scripts durchsuchen und (spaeter) kaufen. Fuer den MVP zeigt die Seite Mock-Daten mit Filtern und Sortierung. Der Kauf-Flow ist ein Platzhalter (nur UI, keine echte Transaktion).

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- Empfohlen: `20-MINDCOINS-PREMIUM.md` (fuer MindCoins-Preisanzeige)

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  MARKETPLACE (/marketplace)                                       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Filter: [Alle v] [3D-Model] [Texture] [Audio] [Script]   │  │
│  │  Sortieren: [Beliebt v]                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  [Preview]   │  │  [Preview]   │  │  [Preview]   │          │
│  │              │  │              │  │              │          │
│  │  Low-Poly    │  │  Stein-      │  │  Ambient     │          │
│  │  Baum        │  │  Textur      │  │  Musik Pack  │          │
│  │              │  │              │  │              │          │
│  │  von: Max    │  │  von: Anna   │  │  von: DJ_Bot │          │
│  │  ⭐ 4.5 (23)│  │  ⭐ 4.8 (89)│  │  ⭐ 4.2 (15)│          │
│  │  📥 156      │  │  📥 834      │  │  📥 67       │          │
│  │              │  │              │  │              │          │
│  │  Kostenlos   │  │  💰 50 MC    │  │  💰 120 MC   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │  [Preview]   │  │  [Preview]   │                              │
│  │  Quiz-       │  │  Holz-       │                              │
│  │  Template    │  │  Textur Set  │                              │
│  │  Script      │  │              │                              │
│  │  von: Dev42  │  │  von: Anna   │                              │
│  │  ⭐ 4.0 (7) │  │  ⭐ 4.9 (45)│                              │
│  │  📥 42       │  │  📥 312      │                              │
│  │  Kostenlos   │  │  💰 80 MC    │                              │
│  └──────────────┘  └──────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Asset-Typen

```javascript
const ASSET_TYPES = [
  { id: 'all',       name: 'Alle',       icon: '📦' },
  { id: '3d-model',  name: '3D-Modell',  icon: '🧊' },
  { id: 'texture',   name: 'Textur',     icon: '🎨' },
  { id: 'audio',     name: 'Audio',      icon: '🎵' },
  { id: 'script',    name: 'Script',     icon: '📜' },
]
```

## Sortier-Optionen

```javascript
const SORT_OPTIONS = [
  { id: 'popular',   name: 'Beliebteste' },
  { id: 'newest',    name: 'Neueste' },
  { id: 'price-asc', name: 'Preis aufsteigend' },
  { id: 'price-desc',name: 'Preis absteigend' },
  { id: 'rating',    name: 'Beste Bewertung' },
]
```

---

## Mock-Daten

### Datei: `src/data/mockAssets.js`

```javascript
export const MOCK_ASSETS = [
  {
    id: 'asset-1',
    name: 'Low-Poly Baum Set',
    description: 'Ein Set aus 5 verschiedenen Low-Poly Baeumen fuer Natur-Szenen. Optimiert fuer Web-Performance mit unter 500 Polygonen pro Baum.',
    type: '3d-model',
    creator: {
      uid: 'user-1',
      username: 'MaxModeler',
      avatar: null,
    },
    price: 0,  // 0 = Kostenlos
    rating: 4.5,
    ratingCount: 23,
    downloads: 156,
    previewImage: null,  // Placeholder
    tags: ['low-poly', 'natur', 'baum', '3d'],
    createdAt: new Date('2025-01-15'),
    fileSize: '2.3 MB',
    format: 'GLTF',
  },
  {
    id: 'asset-2',
    name: 'Realistische Stein-Texturen',
    description: 'Hochaufloesende Stein-Texturen (2048x2048) mit Normal-Maps und Roughness-Maps. Perfekt fuer realistische Umgebungen.',
    type: 'texture',
    creator: {
      uid: 'user-2',
      username: 'AnnaDesign',
      avatar: null,
    },
    price: 50,
    rating: 4.8,
    ratingCount: 89,
    downloads: 834,
    previewImage: null,
    tags: ['textur', 'stein', 'realistisch', 'pbr'],
    createdAt: new Date('2025-01-20'),
    fileSize: '15.7 MB',
    format: 'PNG',
  },
  {
    id: 'asset-3',
    name: 'Ambient Musik Pack',
    description: 'Beruhigende Ambient-Musik fuer Lernspiele. Enthaelt 8 Tracks in verschiedenen Stimmungen (entspannt, fokussiert, motivierend).',
    type: 'audio',
    creator: {
      uid: 'user-3',
      username: 'DJ_Bot',
      avatar: null,
    },
    price: 120,
    rating: 4.2,
    ratingCount: 15,
    downloads: 67,
    previewImage: null,
    tags: ['musik', 'ambient', 'lernspiel', 'hintergrund'],
    createdAt: new Date('2025-02-01'),
    fileSize: '45.2 MB',
    format: 'MP3',
  },
  {
    id: 'asset-4',
    name: 'Quiz-Template Script',
    description: 'Ein fertiges Quiz-Template-Script fuer MindForge. Einfach Fragen und Antworten eintragen und sofort ein Quiz-Spiel erstellen.',
    type: 'script',
    creator: {
      uid: 'user-4',
      username: 'Dev42',
      avatar: null,
    },
    price: 0,
    rating: 4.0,
    ratingCount: 7,
    downloads: 42,
    previewImage: null,
    tags: ['script', 'quiz', 'template', 'javascript'],
    createdAt: new Date('2025-02-03'),
    fileSize: '12 KB',
    format: 'JS',
  },
  {
    id: 'asset-5',
    name: 'Holz-Textur Collection',
    description: 'Sammlung von 12 verschiedenen Holz-Texturen. Von heller Birke bis dunklem Mahagoni. Alle mit Seamless-Tiling.',
    type: 'texture',
    creator: {
      uid: 'user-2',
      username: 'AnnaDesign',
      avatar: null,
    },
    price: 80,
    rating: 4.9,
    ratingCount: 45,
    downloads: 312,
    previewImage: null,
    tags: ['textur', 'holz', 'seamless', 'sammlung'],
    createdAt: new Date('2025-01-28'),
    fileSize: '22.1 MB',
    format: 'PNG',
  },
  {
    id: 'asset-6',
    name: 'Cartoon Charakter Basis-Modell',
    description: 'Ein einfaches Cartoon-Charakter-Modell als Ausgangspunkt fuer eigene Kreationen. Beinhaltet Basis-Rigging fuer Animationen.',
    type: '3d-model',
    creator: {
      uid: 'user-5',
      username: '3DKuenstler',
      avatar: null,
    },
    price: 200,
    rating: 4.7,
    ratingCount: 31,
    downloads: 189,
    previewImage: null,
    tags: ['3d', 'charakter', 'cartoon', 'rigging'],
    createdAt: new Date('2025-01-10'),
    fileSize: '8.5 MB',
    format: 'GLTF',
  },
  {
    id: 'asset-7',
    name: 'UI Sound-Effekte Pack',
    description: 'Sammlung von 25 UI-Sound-Effekten: Klicks, Erfolg, Fehler, Notification, Level-Up und mehr. Perfekt fuer Spiel-Interfaces.',
    type: 'audio',
    creator: {
      uid: 'user-3',
      username: 'DJ_Bot',
      avatar: null,
    },
    price: 60,
    rating: 4.4,
    ratingCount: 28,
    downloads: 203,
    previewImage: null,
    tags: ['audio', 'sfx', 'ui', 'sound-effekte'],
    createdAt: new Date('2025-01-25'),
    fileSize: '8.3 MB',
    format: 'WAV',
  },
]
```

---

## Datei 1: `src/components/marketplace/AssetCard.jsx`

Die AssetCard-Komponente fuer die Anzeige einzelner Assets.

```jsx
export default function AssetCard({ asset, onClick }) {
  const isFree = asset.price === 0

  // Typ-Icon mapping
  const typeIcons = {
    '3d-model': '🧊',
    'texture': '🎨',
    'audio': '🎵',
    'script': '📜',
  }

  return (
    <div
      onClick={() => onClick?.(asset)}
      className="bg-bg-card rounded-xl overflow-hidden border border-gray-700
                 hover:border-gray-600 transition-all cursor-pointer group"
    >
      {/* Preview Image / Placeholder */}
      <div className="aspect-video bg-bg-hover flex items-center justify-center
                      text-5xl group-hover:scale-105 transition-transform overflow-hidden">
        {asset.previewImage ? (
          <img src={asset.previewImage} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <span className="opacity-50">{typeIcons[asset.type] || '📦'}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Typ Badge */}
        <span className="text-xs bg-bg-hover text-text-muted px-2 py-0.5 rounded-full">
          {typeIcons[asset.type]} {ASSET_TYPES.find(t => t.id === asset.type)?.name || asset.type}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-text-primary mt-2 truncate">{asset.name}</h3>

        {/* Creator */}
        <p className="text-sm text-text-muted mt-1">
          von: <span className="text-text-secondary">{asset.creator.username}</span>
        </p>

        {/* Rating & Downloads */}
        <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <span className="text-warning">&#9733;</span>
            {asset.rating.toFixed(1)}
            <span className="text-xs">({asset.ratingCount})</span>
          </span>
          <span className="flex items-center gap-1">
            &#128229; {asset.downloads}
          </span>
        </div>

        {/* Preis */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          {isFree ? (
            <span className="text-success font-semibold">Kostenlos</span>
          ) : (
            <span className="flex items-center gap-1 font-semibold text-accent">
              <span>&#128176;</span> {asset.price} MC
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Datei 2: `src/pages/Marketplace.jsx`

Die Marketplace-Seite mit Filter und Sortierung.

**State:**

```jsx
const [assets, setAssets] = useState(MOCK_ASSETS)
const [filteredAssets, setFilteredAssets] = useState(MOCK_ASSETS)
const [activeType, setActiveType] = useState('all')
const [sortBy, setSortBy] = useState('popular')
const [selectedAsset, setSelectedAsset] = useState(null)  // Fuer Detail-Modal
```

### Filter-Logik

```jsx
useEffect(() => {
  let result = [...assets]

  // Nach Typ filtern
  if (activeType !== 'all') {
    result = result.filter(a => a.type === activeType)
  }

  // Sortieren
  switch (sortBy) {
    case 'popular':
      result.sort((a, b) => b.downloads - a.downloads)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
  }

  setFilteredAssets(result)
}, [assets, activeType, sortBy])
```

### Seiten-Layout

```jsx
return (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
    <p className="text-text-muted mb-8">Entdecke Assets fuer deine Lernspiele</p>

    {/* Filter & Sort Bar */}
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Typ-Filter */}
      <div className="flex flex-wrap gap-2">
        {ASSET_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeType === type.id
                ? 'bg-accent text-white'
                : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
              }`}
          >
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      {/* Sortierung */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-bg-card text-text-primary border border-gray-700 rounded-lg px-4 py-2
                   text-sm ml-auto"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>

    {/* Asset Grid */}
    {filteredAssets.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onClick={() => setSelectedAsset(asset)}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-20">
        <span className="text-6xl block mb-4">📦</span>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Keine Assets gefunden
        </h3>
        <p className="text-text-muted">
          Versuche einen anderen Filter oder erstelle selbst Assets!
        </p>
      </div>
    )}

    {/* Asset Detail Modal */}
    {selectedAsset && (
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    )}
  </div>
)
```

---

## AssetDetailModal Sub-Komponente

```jsx
function AssetDetailModal({ asset, onClose }) {
  const isFree = asset.price === 0

  const typeIcons = {
    '3d-model': '🧊',
    'texture': '🎨',
    'audio': '🎵',
    'script': '📜',
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-lg w-full overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        {/* Preview */}
        <div className="aspect-video bg-bg-hover flex items-center justify-center text-6xl">
          {typeIcons[asset.type] || '📦'}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{asset.name}</h2>
              <p className="text-text-muted text-sm mt-1">
                von {asset.creator.username}
              </p>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl">
              &#10005;
            </button>
          </div>

          <p className="text-text-secondary mt-4 text-sm leading-relaxed">
            {asset.description}
          </p>

          {/* Meta-Infos */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Bewertung</p>
              <p className="text-text-primary font-medium">
                &#9733; {asset.rating.toFixed(1)} ({asset.ratingCount} Bewertungen)
              </p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Downloads</p>
              <p className="text-text-primary font-medium">{asset.downloads}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Dateigroesse</p>
              <p className="text-text-primary font-medium">{asset.fileSize}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-3">
              <p className="text-text-muted">Format</p>
              <p className="text-text-primary font-medium">{asset.format}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {asset.tags.map((tag) => (
              <span key={tag} className="text-xs bg-bg-hover text-text-muted px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Kauf-Button */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            {isFree ? (
              <button className="w-full bg-success hover:bg-green-600 text-white py-3 rounded-lg
                                 font-semibold transition-colors">
                Kostenlos herunterladen
              </button>
            ) : (
              <button className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-lg
                                 font-semibold transition-colors flex items-center justify-center gap-2">
                <span>&#128176;</span> {asset.price} MindCoins - Kaufen
              </button>
            )}
            <p className="text-xs text-text-muted text-center mt-2">
              Kauf-Funktion kommt bald! (MVP-Platzhalter)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Firestore-Schema (fuer spaetere Integration)

### Collection: `marketplace`

```javascript
{
  id: 'asset-id',
  name: 'Low-Poly Baum Set',
  description: 'Beschreibung...',
  type: '3d-model',           // '3d-model' | 'texture' | 'audio' | 'script'
  creatorId: 'uid',
  creatorUsername: 'MaxModeler',
  price: 0,                    // 0 = kostenlos, >0 = MindCoins
  rating: 4.5,
  ratingCount: 23,
  downloads: 156,
  previewImageUrl: 'https://...',
  fileUrl: 'https://...',
  fileSize: '2.3 MB',
  format: 'GLTF',
  tags: ['low-poly', 'natur'],
  status: 'published',        // 'draft' | 'published' | 'removed'
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/marketplace`, Seite laedt ohne Fehler
2. **Asset-Grid** - Alle Mock-Assets werden als Karten angezeigt
3. **Typ-Filter** - Klicke auf "3D-Modell" - nur 3D-Modelle werden angezeigt
4. **Filter "Alle"** - Zeigt wieder alle Assets
5. **Sortierung** - "Neueste" sortiert nach Datum, "Preis aufsteigend" nach Preis
6. **AssetCard** - Zeigt Preview, Name, Creator, Rating, Downloads und Preis
7. **Kostenlos vs Bezahlt** - Kostenlose Assets zeigen "Kostenlos" (gruen), bezahlte zeigen MindCoins-Preis
8. **Detail-Modal** - Klick auf AssetCard oeffnet Modal mit erweiterten Infos
9. **Modal schliessen** - Klick ausserhalb oder auf X schliesst Modal
10. **Leerer Zustand** - Bei Filter ohne Ergebnisse erscheint passende Meldung
11. **Responsive** - Grid passt sich an (4 Spalten Desktop, 2 Tablet, 1 Mobile)

---

## Checkliste

- [ ] Marketplace-Seite unter `/marketplace` ist erreichbar
- [ ] Asset-Grid zeigt 5+ Mock-Assets als Karten
- [ ] AssetCard zeigt: Preview-Bereich, Name, Creator, Rating, Downloads, Preis
- [ ] Kostenlose Assets mit gruenem "Kostenlos" Label
- [ ] Bezahlte Assets mit MindCoins-Icon und Preis
- [ ] Typ-Filter: Alle, 3D-Modell, Textur, Audio, Script
- [ ] Aktiver Filter ist visuell hervorgehoben
- [ ] Sortier-Dropdown: Beliebt, Neueste, Preis auf/ab, Bewertung
- [ ] Filter und Sortierung funktionieren korrekt zusammen
- [ ] Detail-Modal oeffnet sich bei Klick auf AssetCard
- [ ] Modal zeigt: Beschreibung, Meta-Infos, Tags, Kauf-Button
- [ ] Kauf-Button zeigt "MVP-Platzhalter" Hinweis
- [ ] Leerer Zustand bei keinen Ergebnissen
- [ ] Responsive Grid-Layout
- [ ] Rating-Sterne und Download-Zaehler angezeigt

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Marketplace.jsx` | Marketplace-Seite mit Filter, Sortierung und Grid |
| `src/components/marketplace/AssetCard.jsx` | Asset-Karte mit Preview, Info und Preis |
| `src/data/mockAssets.js` | Mock-Daten fuer 7+ Assets verschiedener Typen |
