# 11 - Spiele erstellen & hochladen (Premium)

## Was wird hier gemacht?

In diesem Schritt baust du die **Create-Seite** unter `/create` - die Kernfunktion fuer Premium-User zum Erstellen und Hochladen von Spielen:
- **Premium-Check** (nicht-Premium User werden zu /premium weitergeleitet)
- **Upload-Formular** mit Titel, Beschreibung, ZIP-Datei, Thumbnail, Screenshots, Tags, Preis
- **Datei-Validierung** (ZIP max 200MB, Thumbnail max 5MB, ZIP muss index.html enthalten)
- **Upload-Fortschritt** mit Progress Bar
- **Firebase Storage** fuer Dateien
- **Firestore** fuer Spiel-Metadaten
- **Eigene Spiele verwalten** (Bearbeiten, Loeschen)

Am Ende koennen Premium-User ihre eigenen Lernspiele hochladen, bearbeiten und loeschen.

---

## Voraussetzung

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein (useAuth, ProtectedRoute)
- Datei `04-MINDBROWSER.md` muss abgeschlossen sein (GameCard)
- Firebase Storage ist aktiviert
- User muss Premium sein (ProtectedRoute mit `requirePremium`)

---

## Uebersicht der Seite

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                           │
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │                                                      │
│            │  Spiel erstellen                                     │
│            │                                                      │
│            │  ┌─────────────────────────────────────────────┐    │
│            │  │  Titel:                                      │    │
│            │  │  [Mein cooles Lernspiel              ]      │    │
│            │  │                                              │    │
│            │  │  Beschreibung:                                │    │
│            │  │  ┌────────────────────────────────────┐     │    │
│            │  │  │ Beschreibe dein Spiel...            │     │    │
│            │  │  │                                     │     │    │
│            │  │  └────────────────────────────────────┘     │    │
│            │  │                                              │    │
│            │  │  Spiel-Datei (ZIP):                          │    │
│            │  │  ┌────────────────────────────────────┐     │    │
│            │  │  │  📁 Datei auswaehlen oder          │     │    │
│            │  │  │     hierher ziehen                  │     │    │
│            │  │  │     Max. 200 MB, muss index.html   │     │    │
│            │  │  │     enthalten                       │     │    │
│            │  │  └────────────────────────────────────┘     │    │
│            │  │                                              │    │
│            │  │  Thumbnail (PNG/JPG):                        │    │
│            │  │  ┌──────────┐                                │    │
│            │  │  │ Vorschau │  [Bild auswaehlen]            │    │
│            │  │  └──────────┘                                │    │
│            │  │                                              │    │
│            │  │  Screenshots (optional, max 5):              │    │
│            │  │  [+] [img1] [img2]                           │    │
│            │  │                                              │    │
│            │  │  Tags:                                        │    │
│            │  │  [mathematik] [quiz] [+Tag hinzufuegen]      │    │
│            │  │                                              │    │
│            │  │  Preis:                                       │    │
│            │  │  (●) Kostenlos  ( ) MindCoins: [___]         │    │
│            │  │                                              │    │
│            │  │  [        Spiel hochladen        ]          │    │
│            │  │                                              │    │
│            │  └─────────────────────────────────────────────┘    │
│            │                                                      │
│            │  ─────────────────────────────────────────────       │
│            │                                                      │
│            │  Meine Spiele (3)                                    │
│            │  ┌──────┐ ┌──────┐ ┌──────┐                        │
│            │  │Game 1│ │Game 2│ │Game 3│                         │
│            │  │[Edit]│ │[Edit]│ │[Edit]│                         │
│            │  │[Del] │ │[Del] │ │[Del] │                         │
│            │  └──────┘ └──────┘ └──────┘                        │
│            │                                                      │
└────────────┴─────────────────────────────────────────────────────┘
```

---

## Premium-Check

Die Create-Seite ist NUR fuer Premium-User zugaenglich. Der Schutz wird ueber `ProtectedRoute` sichergestellt:

```jsx
// In App.jsx
<Route path="/create" element={
  <Layout>
    <ProtectedRoute requirePremium>
      <Create />
    </ProtectedRoute>
  </Layout>
} />
```

Wenn ein nicht-Premium User versucht `/create` zu oeffnen, wird er automatisch zu `/premium` weitergeleitet (ueber ProtectedRoute aus Plan 03).

---

## Upload-Formular

### Formular-State:

```javascript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  gameFile: null,           // File - ZIP-Datei
  thumbnail: null,          // File - Thumbnail-Bild
  thumbnailPreview: null,   // String - Data URL fuer Vorschau
  screenshots: [],          // File[] - Screenshot-Bilder (max 5)
  screenshotPreviews: [],   // String[] - Data URLs fuer Vorschauen
  tags: [],                 // String[] - Tags
  price: 0,                 // Number - Preis in MindCoins (0 = kostenlos)
  isFree: true              // Boolean - Kostenlos?
})

const [errors, setErrors] = useState({})
const [isUploading, setIsUploading] = useState(false)
const [uploadProgress, setUploadProgress] = useState(0)
const [uploadStep, setUploadStep] = useState('')
```

### Formular-Felder:

**Titel:**
- Input-Feld, Pflichtfeld
- Min: 3 Zeichen, Max: 100 Zeichen
- `<input type="text" placeholder="Gib deinem Spiel einen Titel..." />`

**Beschreibung:**
- Textarea, Pflichtfeld
- Min: 10 Zeichen, Max: 2000 Zeichen
- Zeichenzaehler anzeigen
- `<textarea rows={5} placeholder="Beschreibe dein Spiel..." />`

**Spiel-Datei (ZIP):**
- Drag & Drop Zone ODER Datei-Auswaehler
- Akzeptiert nur `.zip` Dateien
- Max: 200 MB
- ZIP muss `index.html` im Root oder einem Unterordner enthalten
- Anzeige: Dateiname + Groesse nach Auswahl

**Thumbnail:**
- Datei-Auswaehler fuer Bilder (PNG, JPG, JPEG, WebP)
- Max: 5 MB
- Vorschau des ausgewaehlten Bildes
- Empfohlene Groesse: 16:9 Format (z.B. 1280x720)

**Screenshots (optional):**
- Max 5 Bilder
- Gleiche Formate wie Thumbnail
- Max 5 MB pro Bild
- Vorschau aller ausgewaehlten Bilder
- Einzelne Screenshots entfernbar (X-Button)

**Tags:**
- Tag-Eingabefeld + "Hinzufuegen" Button
- Max 10 Tags
- Jeder Tag: 2-30 Zeichen, nur Kleinbuchstaben, Zahlen, Bindestriche
- Vorschlaege: Dropdown mit haeufigen Tags beim Tippen
- Tags als Chips anzeigen, einzeln entfernbar

**Preis:**
- Radio-Buttons: "Kostenlos" oder "MindCoins"
- Wenn MindCoins: Zahlenfeld fuer den Preis (min: 1, max: 9999)
- Standard: Kostenlos

---

## Datei-Validierung

### Validierung vor Upload:

```javascript
function validateForm(formData) {
  const errors = {}

  // Titel
  if (!formData.title.trim()) errors.title = 'Titel ist erforderlich.'
  else if (formData.title.length < 3) errors.title = 'Titel muss mindestens 3 Zeichen lang sein.'
  else if (formData.title.length > 100) errors.title = 'Titel darf maximal 100 Zeichen lang sein.'

  // Beschreibung
  if (!formData.description.trim()) errors.description = 'Beschreibung ist erforderlich.'
  else if (formData.description.length < 10) errors.description = 'Beschreibung muss mindestens 10 Zeichen lang sein.'
  else if (formData.description.length > 2000) errors.description = 'Beschreibung darf maximal 2000 Zeichen lang sein.'

  // Spiel-Datei
  if (!formData.gameFile) errors.gameFile = 'Bitte waehle eine ZIP-Datei aus.'
  else if (!formData.gameFile.name.endsWith('.zip')) errors.gameFile = 'Nur ZIP-Dateien sind erlaubt.'
  else if (formData.gameFile.size > 200 * 1024 * 1024) errors.gameFile = 'Die Datei darf maximal 200 MB gross sein.'

  // Thumbnail
  if (!formData.thumbnail) errors.thumbnail = 'Bitte waehle ein Thumbnail aus.'
  else if (formData.thumbnail.size > 5 * 1024 * 1024) errors.thumbnail = 'Das Thumbnail darf maximal 5 MB gross sein.'
  else if (!['image/png', 'image/jpeg', 'image/webp'].includes(formData.thumbnail.type)) {
    errors.thumbnail = 'Nur PNG, JPG und WebP Bilder sind erlaubt.'
  }

  // Screenshots
  if (formData.screenshots.length > 5) errors.screenshots = 'Maximal 5 Screenshots erlaubt.'
  formData.screenshots.forEach((file, index) => {
    if (file.size > 5 * 1024 * 1024) {
      errors.screenshots = `Screenshot ${index + 1} ist zu gross (max. 5 MB).`
    }
  })

  // Tags
  if (formData.tags.length === 0) errors.tags = 'Mindestens ein Tag ist erforderlich.'

  // Preis
  if (!formData.isFree && formData.price < 1) errors.price = 'Preis muss mindestens 1 MindCoin betragen.'

  return errors
}
```

---

## Firebase Storage Pfade

```
Firebase Storage Struktur:
─────────────────────────
games/
  {gameId}/
    game.zip                    ← Die Spiel-ZIP-Datei
    thumbnail.jpg               ← Das Thumbnail
    screenshots/
      screenshot-0.jpg          ← Screenshot 1
      screenshot-1.jpg          ← Screenshot 2
      ...
```

---

## Upload-Prozess (9 Schritte)

Der Upload-Prozess besteht aus mehreren Schritten die nacheinander ausgefuehrt werden:

```javascript
async function handleUpload() {
  // Schritt 1: Validierung
  setUploadStep('Validiere Daten...')
  setUploadProgress(10)
  const validationErrors = validateForm(formData)
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  setIsUploading(true)

  try {
    // Schritt 2: Game-ID generieren
    setUploadStep('Bereite Upload vor...')
    setUploadProgress(15)
    const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Schritt 3: ZIP-Datei hochladen
    setUploadStep('Lade Spiel-Datei hoch...')
    const gameFileRef = ref(storage, `games/${gameId}/game.zip`)
    const gameUploadTask = uploadBytesResumable(gameFileRef, formData.gameFile)

    await new Promise((resolve, reject) => {
      gameUploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 50
          setUploadProgress(20 + progress)  // 20-70%
        },
        reject,
        resolve
      )
    })
    const gameFileUrl = await getDownloadURL(gameFileRef)

    // Schritt 4: Thumbnail hochladen
    setUploadStep('Lade Thumbnail hoch...')
    setUploadProgress(72)
    const thumbnailRef = ref(storage, `games/${gameId}/thumbnail.jpg`)
    await uploadBytes(thumbnailRef, formData.thumbnail)
    const thumbnailUrl = await getDownloadURL(thumbnailRef)

    // Schritt 5: Screenshots hochladen (wenn vorhanden)
    setUploadStep('Lade Screenshots hoch...')
    setUploadProgress(78)
    const screenshotUrls = []
    for (let i = 0; i < formData.screenshots.length; i++) {
      const ssRef = ref(storage, `games/${gameId}/screenshots/screenshot-${i}.jpg`)
      await uploadBytes(ssRef, formData.screenshots[i])
      const ssUrl = await getDownloadURL(ssRef)
      screenshotUrls.push(ssUrl)
      setUploadProgress(78 + ((i + 1) / formData.screenshots.length) * 10)  // 78-88%
    }

    // Schritt 6: Firestore-Dokument erstellen
    setUploadStep('Erstelle Spieleintrag...')
    setUploadProgress(90)
    await setDoc(doc(db, 'games', gameId), {
      id: gameId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      creator: user.username,
      creatorId: user.uid,
      thumbnail: thumbnailUrl,
      screenshots: screenshotUrls,
      tags: formData.tags,
      likes: 0,
      dislikes: 0,
      plays: 0,
      views: 0,
      featured: false,
      premium: !formData.isFree,
      price: formData.isFree ? 0 : formData.price,
      createdAt: serverTimestamp(),
      category: formData.tags[0] || 'other',
      subject: formData.tags[0] || 'other',
      gameUrl: gameFileUrl,
      status: 'published'  // Fuer MVP: Direkt veroeffentlicht
    })

    // Schritt 7: User-Statistik aktualisieren
    setUploadStep('Aktualisiere Profil...')
    setUploadProgress(95)
    await updateDoc(doc(db, 'users', user.uid), {
      gamesCreated: increment(1)
    })

    // Schritt 8: Formular zuruecksetzen
    setUploadStep('Fertig!')
    setUploadProgress(100)

    // Schritt 9: Erfolgsmeldung + Weiterleitung
    // Toast: "Spiel erfolgreich hochgeladen!"
    // Nach 2 Sekunden: navigate(`/game/${gameId}`)

  } catch (error) {
    console.error('Upload fehlgeschlagen:', error)
    setErrors({ upload: 'Upload fehlgeschlagen. Bitte versuche es erneut.' })
  } finally {
    setIsUploading(false)
  }
}
```

### Progress Bar:

```
┌──────────────────────────────────────────────────┐
│  Lade Spiel-Datei hoch...                         │
│  ████████████████████░░░░░░░░░░  65%             │
└──────────────────────────────────────────────────┘
```

```jsx
{isUploading && (
  <div className="bg-bg-secondary rounded-xl p-6 mt-6">
    <p className="text-text-secondary mb-2">{uploadStep}</p>
    <div className="w-full h-3 bg-bg-card rounded-full overflow-hidden">
      <div
        className="h-full bg-accent rounded-full transition-all duration-300"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
    <p className="text-text-muted text-sm mt-1">{uploadProgress}%</p>
  </div>
)}
```

---

## Meine Spiele (Verwalten)

Unter dem Upload-Formular wird eine Liste der eigenen Spiele angezeigt.

### Aufbau:

```
Meine Spiele (3)

┌──────┐ ┌──────┐ ┌──────┐
│Game 1│ │Game 2│ │Game 3│
│      │ │      │ │      │
│[Edit]│ │[Edit]│ │[Edit]│
│[Del] │ │[Del] │ │[Del] │
└──────┘ └──────┘ └──────┘
```

### Implementierungsdetails:

- **Eigene Spiele laden:** Filter mockGames nach `creatorId === user.uid` (oder Firestore Query)
- **GameCard mit Aktionen:** Erweiterte GameCard mit "Bearbeiten" und "Loeschen" Buttons
- **Bearbeiten:** Oeffnet ein Modal oder eine separate Seite zum Bearbeiten der Metadaten (Titel, Beschreibung, Tags, Preis) - NICHT die ZIP-Datei
- **Loeschen:** Bestaetigungsdialog → Loescht Firestore-Dokument + Storage-Dateien

### Loeschen:

```javascript
async function handleDelete(gameId) {
  if (!confirm('Bist du sicher, dass du dieses Spiel loeschen moechtest? Diese Aktion kann nicht rueckgaengig gemacht werden.')) {
    return
  }

  try {
    // Firestore-Dokument loeschen
    await deleteDoc(doc(db, 'games', gameId))

    // Storage-Dateien loeschen
    const gameZipRef = ref(storage, `games/${gameId}/game.zip`)
    const thumbnailRef = ref(storage, `games/${gameId}/thumbnail.jpg`)
    await deleteObject(gameZipRef).catch(() => {})  // Ignoriere Fehler
    await deleteObject(thumbnailRef).catch(() => {})

    // User-Statistik aktualisieren
    await updateDoc(doc(db, 'users', user.uid), {
      gamesCreated: increment(-1)
    })

    // Liste aktualisieren
    // Toast: "Spiel geloescht."
  } catch (error) {
    console.error('Loeschen fehlgeschlagen:', error)
  }
}
```

### Bearbeiten-Modal:

```
┌───────────────────────────────────────┐
│  Spiel bearbeiten               [X]  │
│                                        │
│  Titel:                                │
│  [Mathe-Meister                  ]    │
│                                        │
│  Beschreibung:                         │
│  ┌────────────────────────────────┐   │
│  │ Teste dein mathematisches...   │   │
│  └────────────────────────────────┘   │
│                                        │
│  Tags:                                 │
│  [mathematik] [quiz] [+]              │
│                                        │
│  Preis:                                │
│  (●) Kostenlos  ( ) MindCoins         │
│                                        │
│  Neues Thumbnail (optional):           │
│  [Bild auswaehlen]                    │
│                                        │
│  [Abbrechen]        [Speichern]       │
│                                        │
└───────────────────────────────────────┘
```

---

## Firestore Games Schema (vollstaendig)

```javascript
// Collection: games
// Document ID: gameId (generiert)
{
  id: "game-abc123",                     // String - Eindeutige ID
  title: "Mathe-Meister",               // String - Spieltitel
  description: "Teste dein...",          // String - Beschreibung
  creator: "spieler42",                  // String - Creator Username
  creatorId: "uid-xyz789",              // String - Creator UID
  thumbnail: "https://storage...",       // String - Thumbnail Download URL
  screenshots: ["https://..."],          // Array<String> - Screenshot URLs
  tags: ["mathematik", "quiz"],          // Array<String> - Tags
  likes: 0,                              // Number - Likes
  dislikes: 0,                           // Number - Dislikes
  plays: 0,                              // Number - Play-Counter
  views: 0,                              // Number - View-Counter
  featured: false,                       // Boolean - Im Featured-Karussell?
  premium: false,                        // Boolean - Kostet MindCoins?
  price: 0,                              // Number - Preis in MindCoins
  createdAt: Timestamp,                  // Timestamp - Erstellungsdatum
  category: "quiz",                      // String - Kategorie
  subject: "mathematik",                 // String - Schulfach
  gameUrl: "https://storage...",         // String - Spiel Download/Play URL
  status: "published"                    // String - "published" (fuer MVP kein Review)
}
```

---

## Drag & Drop Zone

Die ZIP-Upload-Zone unterstuetzt Drag & Drop:

```jsx
function DropZone({ onFileSelect, file, error }) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) onFileSelect(droppedFile)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-colors ${
          isDragOver
            ? 'border-accent bg-accent/10'
            : error
              ? 'border-error bg-error/5'
              : 'border-gray-600 hover:border-gray-500'
        }`}
    >
      {file ? (
        <div>
          <p className="font-semibold">{file.name}</p>
          <p className="text-text-muted text-sm">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      ) : (
        <div>
          <p className="text-3xl mb-2">📁</p>
          <p className="font-semibold">Datei auswaehlen oder hierher ziehen</p>
          <p className="text-text-muted text-sm mt-1">
            ZIP-Datei, max. 200 MB, muss index.html enthalten
          </p>
        </div>
      )}
      <input
        type="file"
        accept=".zip"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="hidden"
        id="game-file-input"
      />
    </div>
  )
}
```

---

## Testen

1. **Premium-Check:**
   - Logge dich als normaler User ein
   - Navigiere zu `/create` → Redirect zu `/premium`
   - Setze `isPremium: true` in den Mock-Daten → Seite wird angezeigt

2. **Formular-Validierung:**
   - Klicke "Hochladen" mit leeren Feldern → Fehlermeldungen erscheinen
   - Titel zu kurz → Fehlermeldung
   - Keine ZIP-Datei → Fehlermeldung
   - Kein Thumbnail → Fehlermeldung
   - Zu grosse Datei → Fehlermeldung

3. **Datei-Auswahl:**
   - Waehle eine ZIP-Datei → Dateiname und Groesse werden angezeigt
   - Waehle ein Thumbnail → Vorschau wird angezeigt
   - Drag & Drop einer ZIP-Datei → Funktioniert

4. **Tags:**
   - Tag hinzufuegen → Erscheint als Chip
   - Tag entfernen → Wird entfernt
   - Max 10 Tags → Weitere koennen nicht hinzugefuegt werden

5. **Upload-Prozess (wenn Firebase aktiv):**
   - Fulle alle Felder aus und klicke "Hochladen"
   - Progress Bar zeigt Fortschritt
   - Upload-Steps werden angezeigt
   - Nach Erfolg: Weiterleitung zur Spiel-Detailseite

6. **Meine Spiele:**
   - Eigene Spiele werden unter dem Formular angezeigt
   - "Bearbeiten" oeffnet Modal mit aktuellen Daten
   - "Loeschen" zeigt Bestaetigungsdialog

---

## Checkliste

- [ ] `src/pages/Create.jsx` erstellt mit Upload-Formular
- [ ] Premium-Check: Nicht-Premium User werden zu /premium weitergeleitet
- [ ] Formular: Titel, Beschreibung, ZIP, Thumbnail, Screenshots, Tags, Preis
- [ ] Datei-Validierung: ZIP max 200MB, Thumbnail max 5MB, Formate
- [ ] Drag & Drop Zone fuer ZIP-Datei
- [ ] Thumbnail-Vorschau nach Auswahl
- [ ] Screenshot-Vorschauen (max 5, einzeln entfernbar)
- [ ] Tag-System: Hinzufuegen, Entfernen, Max 10
- [ ] Preis: Kostenlos oder MindCoins Radio-Buttons
- [ ] Upload-Prozess: 9 Schritte mit Progress Bar
- [ ] Firebase Storage: ZIP, Thumbnail, Screenshots hochgeladen
- [ ] Firestore: Games-Dokument erstellt mit allen Feldern
- [ ] User gamesCreated Counter wird inkrementiert
- [ ] "Meine Spiele" Sektion zeigt eigene Spiele
- [ ] Bearbeiten-Modal fuer eigene Spiele
- [ ] Loeschen mit Bestaetigungsdialog
- [ ] Fehlermeldungen auf Deutsch
- [ ] Status: "published" (kein Review-Prozess fuer MVP)
- [ ] Route `/create` in App.jsx mit ProtectedRoute requirePremium
- [ ] Responsive Design funktioniert

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Create.jsx` | Upload-Formular + Meine Spiele Verwaltung |
| `src/components/create/DropZone.jsx` | Drag & Drop Zone fuer ZIP-Datei (optional separat) |
