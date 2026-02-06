# 12 - Avatar-Customization

## Was wird hier gemacht?

In diesem Schritt baust du einen Avatar-Editor unter `/avatar`, mit dem User ihren eigenen Avatar anpassen koennen. Der Avatar wird als SVG gerendert und besteht aus anpassbaren Aspekten wie Hautfarbe, Haarfarbe, Frisur und Augenform. Eine Live-Vorschau zeigt alle Aenderungen sofort an, bevor sie in Firestore gespeichert werden.

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein (User muss eingeloggt sein)
- Firebase Firestore ist eingerichtet und erreichbar

---

## Uebersicht der Komponenten

```
┌──────────────────────────────────────────────────────────────────┐
│  AVATAR EDITOR SEITE (/avatar)                                    │
│                                                                    │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│  │                     │  │  CUSTOMIZATION PANEL              │   │
│  │   LIVE PREVIEW      │  │                                   │   │
│  │                     │  │  Hautfarbe:                       │   │
│  │   ┌─────────────┐   │  │  [O] [O] [O] [O] [O] [O]        │   │
│  │   │             │   │  │                                   │   │
│  │   │   Avatar    │   │  │  Haarfarbe:                       │   │
│  │   │   SVG       │   │  │  [O] [O] [O] [O] [O] [O]        │   │
│  │   │   Render    │   │  │                                   │   │
│  │   │             │   │  │  Frisur:                          │   │
│  │   └─────────────┘   │  │  [Kurz] [Lang] [Lockig] [Buzz]   │   │
│  │                     │  │  [Pferdeschwanz] [Irokese]        │   │
│  │   "Username"        │  │                                   │   │
│  │                     │  │  Augen:                            │   │
│  └─────────────────────┘  │  [Rund] [Mandel] [Schlaefrig]    │   │
│                            │  [Katze]                          │   │
│                            │                                   │   │
│                            │  [    Speichern    ]              │   │
│                            │  [  Zuruecksetzen  ]              │   │
│                            └──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Datei 1: `src/components/profile/AvatarRenderer.jsx`

Die AvatarRenderer-Komponente rendert einen SVG-basierten Avatar basierend auf den uebergebenen Eigenschaften.

**Props:**
- `skinColor` (string) - Hex-Farbwert fuer die Hautfarbe
- `hairColor` (string) - Hex-Farbwert fuer die Haarfarbe
- `hairStyle` (string) - Frisur-Typ (z.B. "short", "long", "curly", "buzz", "ponytail", "mohawk")
- `eyeType` (string) - Augenform (z.B. "round", "almond", "sleepy", "cat")
- `size` (number) - Groesse des Avatars in Pixeln (Standard: 200)
- `username` (string) - Fallback: Initialen werden angezeigt wenn kein Avatar konfiguriert ist

**SVG-Aufbau (von hinten nach vorne):**

```
Ebene 1: Hintergrund-Kreis (dezente Farbe, z.B. #374151)
Ebene 2: Kopf/Gesicht (Kreis in Hautfarbe)
Ebene 3: Haare (SVG-Path je nach Frisur)
Ebene 4: Augen (SVG-Elemente je nach Augentyp)
Ebene 5: Mund (einfache Linie oder Bogen)
```

**Einfache SVG-Variante (Minimal-Version fuer MVP):**

```jsx
// Wenn kein Avatar konfiguriert: Farbiger Kreis mit Initialen
<svg width={size} height={size} viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill={skinColor || '#374151'} />
  <text x="100" y="115" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold">
    {getInitials(username)}
  </text>
</svg>
```

**Erweiterte SVG-Variante (Gesicht):**

```jsx
<svg width={size} height={size} viewBox="0 0 200 200">
  {/* Hintergrund */}
  <circle cx="100" cy="100" r="98" fill="#374151" />

  {/* Kopf */}
  <circle cx="100" cy="105" r="75" fill={skinColor} />

  {/* Haare - je nach hairStyle unterschiedliche Paths */}
  {renderHair(hairStyle, hairColor)}

  {/* Augen - je nach eyeType unterschiedliche Formen */}
  {renderEyes(eyeType)}

  {/* Mund */}
  <path d="M 80 135 Q 100 150 120 135" stroke="#333" strokeWidth="2" fill="none" />
</svg>
```

**Haar-Rendering Funktion `renderHair(style, color)`:**

| Frisur | SVG-Beschreibung |
|--------|-----------------|
| `short` | Halbkreis oben auf dem Kopf, eng anliegend |
| `long` | Haare die ueber die Schultern fallen (zwei Seitenteile + Oberteil) |
| `curly` | Wellige Formen um den Kopf (mehrere ueberlappende Kreise) |
| `buzz` | Sehr kurze Haare, leichte Schattierung oben |
| `ponytail` | Kurzes Oberteil + Pferdeschwanz-Element hinten |
| `mohawk` | Schmaler Streifen in der Mitte, hoch stehend |

**Augen-Rendering Funktion `renderEyes(type)`:**

| Augentyp | SVG-Beschreibung |
|----------|-----------------|
| `round` | Zwei einfache Kreise (cx="75" und cx="125") |
| `almond` | Mandelfoermige Ellipsen, leicht nach aussen geneigt |
| `sleepy` | Halbkreise (obere Haelfte), halb geschlossene Augen |
| `cat` | Spitz zulaufende Formen, schmal und lang |

**Wichtig:**
- Die Komponente ist REIN darstellend (kein State, keine Seiteneffekte)
- Sie wird sowohl im Avatar-Editor als auch ueberall wo Avatare angezeigt werden verwendet (Profil, Sidebar, Navbar, etc.)
- Die Groesse ist ueber die `size`-Prop skalierbar

---

## Datei 2: `src/pages/Avatar.jsx`

Die Avatar-Editor-Seite unter `/avatar`.

**State-Management:**

```jsx
const [avatarConfig, setAvatarConfig] = useState({
  skinColor: '#F5D6B8',   // Standard-Hautfarbe
  hairColor: '#2C1810',   // Standard-Haarfarbe (Dunkelbraun)
  hairStyle: 'short',     // Standard-Frisur
  eyeType: 'round',       // Standard-Augenform
})
const [savedConfig, setSavedConfig] = useState(null) // Aus Firestore geladen
const [isSaving, setIsSaving] = useState(false)
const [hasChanges, setHasChanges] = useState(false)
```

**Laden des gespeicherten Avatars:**

```jsx
useEffect(() => {
  const loadAvatar = async () => {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    if (userDoc.exists() && userDoc.data().avatar) {
      setAvatarConfig(userDoc.data().avatar)
      setSavedConfig(userDoc.data().avatar)
    }
  }
  loadAvatar()
}, [currentUser])
```

**Speichern-Funktion:**

```jsx
const handleSave = async () => {
  setIsSaving(true)
  try {
    await updateDoc(doc(db, 'users', currentUser.uid), {
      avatar: avatarConfig
    })
    setSavedConfig(avatarConfig)
    setHasChanges(false)
    // Toast: "Avatar gespeichert!"
  } catch (error) {
    // Toast: "Fehler beim Speichern"
  } finally {
    setIsSaving(false)
  }
}
```

**Zuruecksetzen-Funktion:**

```jsx
const handleReset = () => {
  if (savedConfig) {
    setAvatarConfig(savedConfig)
  }
  setHasChanges(false)
}
```

---

## Predefined Color Palettes

### Hautfarben (mindestens 6)

```javascript
const SKIN_COLORS = [
  { name: 'Hell',         hex: '#FDEBD0' },
  { name: 'Beige',        hex: '#F5D6B8' },
  { name: 'Mittel',       hex: '#D4A574' },
  { name: 'Olive',        hex: '#C4956A' },
  { name: 'Braun',        hex: '#8D5524' },
  { name: 'Dunkelbraun',  hex: '#5C3317' },
  { name: 'Espresso',     hex: '#3B1F0B' },
]
```

### Haarfarben (mindestens 6)

```javascript
const HAIR_COLORS = [
  { name: 'Schwarz',      hex: '#1C1C1C' },
  { name: 'Dunkelbraun',  hex: '#2C1810' },
  { name: 'Braun',        hex: '#6B3A2A' },
  { name: 'Hellbraun',    hex: '#A0522D' },
  { name: 'Blond',        hex: '#D4A843' },
  { name: 'Rot',          hex: '#8B2500' },
  { name: 'Grau',         hex: '#9E9E9E' },
  { name: 'Blau (Fantasy)', hex: '#2196F3' },
  { name: 'Pink (Fantasy)', hex: '#E91E63' },
]
```

### Frisuren

```javascript
const HAIR_STYLES = [
  { id: 'short',     name: 'Kurz',            icon: '✂️' },
  { id: 'long',      name: 'Lang',            icon: '💇' },
  { id: 'curly',     name: 'Lockig',          icon: '🌀' },
  { id: 'buzz',      name: 'Buzz Cut',        icon: '💈' },
  { id: 'ponytail',  name: 'Pferdeschwanz',   icon: '🎀' },
  { id: 'mohawk',    name: 'Irokese',         icon: '🤘' },
]
```

### Augenformen

```javascript
const EYE_TYPES = [
  { id: 'round',   name: 'Rund',       icon: '👁️' },
  { id: 'almond',  name: 'Mandel',     icon: '👀' },
  { id: 'sleepy',  name: 'Schlaefrig', icon: '😴' },
  { id: 'cat',     name: 'Katze',      icon: '🐱' },
]
```

---

## UI-Aufbau der Seite

### Layout: Zwei Spalten

```jsx
<div className="max-w-5xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-8">Avatar anpassen</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Linke Spalte: Live Preview */}
    <div className="flex flex-col items-center bg-bg-card rounded-xl p-8">
      <AvatarRenderer
        skinColor={avatarConfig.skinColor}
        hairColor={avatarConfig.hairColor}
        hairStyle={avatarConfig.hairStyle}
        eyeType={avatarConfig.eyeType}
        size={250}
        username={currentUser.displayName}
      />
      <p className="mt-4 text-lg font-semibold">{currentUser.displayName}</p>
      <p className="text-text-muted text-sm">Live-Vorschau</p>
    </div>

    {/* Rechte Spalte: Customization Panel */}
    <div className="bg-bg-card rounded-xl p-6 space-y-6">
      {/* Hautfarbe */}
      <ColorPicker
        label="Hautfarbe"
        colors={SKIN_COLORS}
        selected={avatarConfig.skinColor}
        onChange={(color) => updateConfig('skinColor', color)}
      />

      {/* Haarfarbe */}
      <ColorPicker
        label="Haarfarbe"
        colors={HAIR_COLORS}
        selected={avatarConfig.hairColor}
        onChange={(color) => updateConfig('hairColor', color)}
      />

      {/* Frisur */}
      <StylePicker
        label="Frisur"
        options={HAIR_STYLES}
        selected={avatarConfig.hairStyle}
        onChange={(style) => updateConfig('hairStyle', style)}
      />

      {/* Augenform */}
      <StylePicker
        label="Augenform"
        options={EYE_TYPES}
        selected={avatarConfig.eyeType}
        onChange={(type) => updateConfig('eyeType', type)}
      />

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-lg
                     font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isSaving ? 'Speichere...' : 'Speichern'}
        </button>
        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className="flex-1 bg-bg-hover hover:bg-gray-500 text-white py-3 rounded-lg
                     font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          Zuruecksetzen
        </button>
      </div>
    </div>
  </div>
</div>
```

### ColorPicker Sub-Komponente

Kann als lokale Komponente in der Avatar-Seite definiert werden:

```jsx
function ColorPicker({ label, colors, selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            title={color.name}
            className={`w-10 h-10 rounded-full border-2 transition-all
              ${selected === color.hex
                ? 'border-accent scale-110 ring-2 ring-accent ring-offset-2 ring-offset-bg-card'
                : 'border-gray-600 hover:border-gray-400'
              }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  )
}
```

### StylePicker Sub-Komponente

```jsx
function StylePicker({ label, options, selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${selected === option.id
                ? 'bg-accent text-white'
                : 'bg-bg-hover text-text-secondary hover:bg-gray-500'
              }`}
          >
            <span className="mr-1">{option.icon}</span>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## Firestore-Schema

### users/{uid}.avatar

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  avatar: {
    skinColor: '#F5D6B8',    // Hex-Farbwert
    hairColor: '#2C1810',     // Hex-Farbwert
    hairStyle: 'short',       // 'short' | 'long' | 'curly' | 'buzz' | 'ponytail' | 'mohawk'
    eyeType: 'round',         // 'round' | 'almond' | 'sleepy' | 'cat'
  }
}
```

**Firestore-Regeln (Ergaenzung):**

```
match /users/{userId} {
  allow read: if true;
  allow update: if request.auth != null && request.auth.uid == userId;
}
```

---

## Datenfluss

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User klickt │────>│  Lokaler     │────>│  AvatarRen-  │
│  Farbe/Style │     │  State wird  │     │  derer zeigt │
│              │     │  aktualisiert│     │  Live-Preview│
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            │ (bei Klick auf "Speichern")
                            v
                     ┌──────────────┐     ┌──────────────┐
                     │  Firestore   │────>│  savedConfig │
                     │  Update      │     │  wird gesetzt│
                     └──────────────┘     └──────────────┘
```

---

## Integration mit anderen Komponenten

Der AvatarRenderer wird an mehreren Stellen verwendet:

| Ort | Groesse | Daten-Quelle |
|-----|---------|-------------|
| Avatar-Editor (diese Seite) | 250px | Lokaler State |
| Sidebar (User-Bereich) | 40px | User-Dokument aus Firestore |
| Navbar (User-Info) | 32px | User-Dokument aus Firestore |
| Profil-Seite (ProfileHeader) | 120px | User-Dokument aus Firestore |
| Freunde-Liste (FriendCard) | 48px | Friend-User-Dokument |

---

## Testen

1. **Seite aufrufen** - Navigiere zu `/avatar`, Seite laedt ohne Fehler
2. **Live-Vorschau** - Aendere Hautfarbe, Avatar aktualisiert sich sofort
3. **Alle Optionen testen** - Klicke durch alle Hautfarben, Haarfarben, Frisuren, Augenformen
4. **Speichern** - Klicke "Speichern", pruefe in Firestore ob Daten korrekt gespeichert wurden
5. **Persistenz** - Lade die Seite neu, der gespeicherte Avatar sollte geladen werden
6. **Zuruecksetzen** - Aendere etwas, klicke "Zuruecksetzen", Avatar geht auf gespeicherten Stand zurueck
7. **Kein Speichern ohne Aenderungen** - Button ist disabled wenn nichts geaendert wurde
8. **Nicht eingeloggt** - Weiterleitung zu `/login` wenn User nicht eingeloggt ist

---

## Checkliste

- [ ] AvatarRenderer-Komponente rendert SVG basierend auf Props
- [ ] AvatarRenderer zeigt Initialen-Fallback wenn kein Avatar konfiguriert ist
- [ ] Avatar-Seite zeigt Live-Vorschau links und Customization-Panel rechts
- [ ] Hautfarbe-Auswahl mit mindestens 6 Optionen funktioniert
- [ ] Haarfarbe-Auswahl mit mindestens 6 Optionen funktioniert
- [ ] Frisur-Auswahl mit 4-6 Optionen funktioniert
- [ ] Augenform-Auswahl mit 3-4 Optionen funktioniert
- [ ] Ausgewaehlte Option ist visuell hervorgehoben
- [ ] Live-Vorschau aktualisiert sich sofort bei jeder Aenderung
- [ ] Speichern-Button schreibt Daten in Firestore users/{uid}.avatar
- [ ] Zuruecksetzen-Button stellt gespeicherten Zustand wieder her
- [ ] Buttons sind disabled wenn keine Aenderungen vorliegen
- [ ] Loading-State waehrend des Speicherns wird angezeigt
- [ ] Gespeicherter Avatar wird beim Laden der Seite wiederhergestellt
- [ ] Seite ist responsive (Spalten untereinander auf Mobile)

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/profile/AvatarRenderer.jsx` | SVG-basierte Avatar-Darstellung (wiederverwendbar) |
| `src/pages/Avatar.jsx` | Avatar-Editor-Seite mit Live-Vorschau und Speichern |
