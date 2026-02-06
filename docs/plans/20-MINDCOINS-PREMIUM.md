# 20 - MindCoins & Premium-System

## Was wird hier gemacht?

In diesem Schritt baust du das MindCoins-Waehrungssystem und die Premium-Abonnements fuer MindForge. MindCoins sind die Premium-Waehrung der Plattform und koennen **NUR durch Echtgeld-Kaeufe oder offizielle Events** erworben werden. Es gibt zwei Premium-Stufen: Creator Premium und Teacher Premium. Fuer den MVP wird nur die UI gebaut - keine echte Zahlungsabwicklung.

---

## WICHTIGES DESIGN-PRINZIP

```
╔══════════════════════════════════════════════════════════════════╗
║  MindCoins koennen NUR erworben werden durch:                    ║
║                                                                    ║
║  1. Echtgeld-Kauf im Shop                                         ║
║  2. Offizielle Events (zeitlich begrenzt)                          ║
║                                                                    ║
║  MindCoins koennen NICHT verdient werden durch:                    ║
║                                                                    ║
║  - Normales Gameplay (Spiele spielen)           ❌                 ║
║  - Achievements freischalten                     ❌                 ║
║  - Taegliche Logins                              ❌                 ║
║  - Freunde einladen                              ❌                 ║
║                                                                    ║
║  GRUND: Anti-Farming Design. MindCoins sollen echten Wert haben.  ║
║  Wenn sie leicht zu "grinden" waeren, wuerde die Waehrung          ║
║  entwertet und der Marketplace waere sinnlos.                      ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Datei `03-AUTHENTICATION.md` muss abgeschlossen sein
- Firebase Firestore ist eingerichtet

---

## Uebersicht: Drei Bereiche

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  1. MindCoins-Anzeige in Navbar     [💰 500 MC]                  │
│                                                                   │
│  2. Premium-Seite (/premium)         Feature-Vergleich & Pricing │
│                                                                   │
│  3. Shop-Seite (/shop)               MindCoins-Pakete kaufen     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Premium-Stufen

### Stufe 1: Creator Premium (9,99 Euro/Monat)

| Feature | Beschreibung |
|---------|-------------|
| Spiele hochladen | Eigene Lernspiele erstellen und veroeffentlichen |
| Custom Avatar Items | Exklusive Avatar-Anpassungen |
| Fruehzeitiger Event-Zugang | 24h Vorsprung bei neuen Events |
| Creator-Badge | Spezielles Badge am Profil |
| 100 MC/Monat Bonus | 100 MindCoins monatlich geschenkt |

### Stufe 2: Teacher Premium (14,99 Euro/Monat)

| Feature | Beschreibung |
|---------|-------------|
| Alle Creator-Features | Alles aus Creator Premium enthalten |
| Klassenverwaltung | Klassen erstellen und Schueler verwalten |
| Schueler-Tracking | Fortschritt der Schueler verfolgen |
| Aufgaben zuweisen | Spiele als Hausaufgaben zuweisen |
| Teacher-Badge | Spezielles Lehrer-Badge am Profil |
| 200 MC/Monat Bonus | 200 MindCoins monatlich geschenkt |
| Erweiterte Statistiken | Detaillierte Lern-Statistiken |

---

## MindCoins-Pakete

| Paket | Preis | MindCoins | Bonus | MC pro Euro |
|-------|-------|-----------|-------|-------------|
| Starter | 4,99 Euro | 500 MC | - | 100 MC/Euro |
| Standard | 9,99 Euro | 1200 MC | +200 Bonus | 120 MC/Euro |
| Premium | 19,99 Euro | 2500 MC | +500 Bonus | 125 MC/Euro |

---

## Firestore-Schema

### User-Dokument Erweiterung: `users/{uid}`

```javascript
// Dokument: users/{uid}
{
  // ...andere User-Felder...
  mindCoins: 500,              // Aktuelle MindCoins-Anzahl
  isPremium: false,            // Hat irgendein Premium?
  premiumTier: null,           // null | 'creator' | 'teacher'
  premiumExpiresAt: null,      // Timestamp wann Premium ablaeuft
  totalMindCoinsPurchased: 0,  // Insgesamt gekaufte MindCoins (Statistik)
  totalMindCoinsSpent: 0,      // Insgesamt ausgegebene MindCoins (Statistik)
}
```

---

## Datei 1: MindCoins-Anzeige in Navbar

Ergaenzung in `src/components/layout/Navbar.jsx`:

```jsx
// In der rechten Seite der Navbar:
<Link
  to="/shop"
  className="flex items-center gap-1.5 bg-bg-card hover:bg-bg-hover px-3 py-1.5
             rounded-lg transition-colors"
>
  <span className="text-lg">💰</span>
  <span className="font-semibold text-accent">{user.mindCoins || 0}</span>
  <span className="text-text-muted text-sm">MC</span>
</Link>
```

**Verhalten:**
- Klick fuehrt zum MindCoins-Shop (`/shop`)
- Zeigt aktuelle MindCoins-Anzahl
- Nur sichtbar wenn User eingeloggt ist

---

## Datei 2: `src/pages/Premium.jsx`

Die Premium-Seite mit Feature-Vergleich und Preis-Karten.

```
┌──────────────────────────────────────────────────────────────────┐
│  PREMIUM (/premium)                                               │
│                                                                    │
│  "Schalte das volle Potential von MindForge frei"                │
│                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐   │
│  │  KOSTENLOS       │  │  CREATOR PREMIUM│  │ TEACHER PREMIUM│   │
│  │                  │  │  9,99 Euro/Monat│  │ 14,99 Euro/Mon.│   │
│  │  ✅ Spiele       │  │                 │  │                │   │
│  │     spielen      │  │  ✅ Alles von   │  │ ✅ Alles von   │   │
│  │  ✅ Profil       │  │     Kostenlos   │  │    Creator     │   │
│  │  ✅ Freunde      │  │  ✅ Spiele      │  │ ✅ Klassen-    │   │
│  │  ✅ Events       │  │     hochladen   │  │    verwaltung  │   │
│  │  ❌ Spiele       │  │  ✅ Custom      │  │ ✅ Schueler-   │   │
│  │     hochladen    │  │     Avatar Items│  │    Tracking    │   │
│  │  ❌ Marketplace  │  │  ✅ Event Early │  │ ✅ Aufgaben    │   │
│  │     verkaufen    │  │     Access      │  │    zuweisen    │   │
│  │                  │  │  ✅ 100 MC/Monat│  │ ✅ 200 MC/Monat│   │
│  │  [Aktuell]       │  │                 │  │                │   │
│  │                  │  │  [Jetzt holen]  │  │ [Jetzt holen]  │   │
│  └─────────────────┘  └─────────────────┘  └────────────────┘   │
│                                                                    │
│  "Payment kommt bald - MVP zeigt nur UI"                         │
└──────────────────────────────────────────────────────────────────┘
```

### Premium-Tiers Definition

```javascript
const PREMIUM_TIERS = [
  {
    id: 'free',
    name: 'Kostenlos',
    price: '0',
    period: '',
    description: 'Grundlegende MindForge-Funktionen',
    features: [
      { text: 'Lernspiele spielen', included: true },
      { text: 'Profil erstellen', included: true },
      { text: 'Freunde hinzufuegen', included: true },
      { text: 'An Events teilnehmen', included: true },
      { text: 'Achievements sammeln', included: true },
      { text: 'Spiele hochladen', included: false },
      { text: 'Custom Avatar Items', included: false },
      { text: 'Marketplace verkaufen', included: false },
      { text: 'Klassenverwaltung', included: false },
    ],
    buttonText: 'Aktueller Plan',
    buttonStyle: 'bg-bg-hover text-text-muted cursor-default',
    highlighted: false,
  },
  {
    id: 'creator',
    name: 'Creator Premium',
    price: '9,99',
    period: '/Monat',
    description: 'Fuer Lernspiel-Ersteller und kreative Koepfe',
    features: [
      { text: 'Alles aus Kostenlos', included: true },
      { text: 'Lernspiele erstellen & hochladen', included: true },
      { text: 'Custom Avatar Items', included: true },
      { text: 'Fruehzeitiger Event-Zugang', included: true },
      { text: 'Creator-Badge am Profil', included: true },
      { text: '100 MindCoins/Monat Bonus', included: true },
      { text: 'Im Marketplace verkaufen', included: true },
      { text: 'Klassenverwaltung', included: false },
      { text: 'Schueler-Tracking', included: false },
    ],
    buttonText: 'Creator werden',
    buttonStyle: 'bg-accent hover:bg-accent-dark text-white',
    highlighted: true,
  },
  {
    id: 'teacher',
    name: 'Teacher Premium',
    price: '14,99',
    period: '/Monat',
    description: 'Fuer Lehrer und Bildungseinrichtungen',
    features: [
      { text: 'Alles aus Creator Premium', included: true },
      { text: 'Klassen erstellen & verwalten', included: true },
      { text: 'Schueler-Fortschritt tracken', included: true },
      { text: 'Spiele als Aufgaben zuweisen', included: true },
      { text: 'Teacher-Badge am Profil', included: true },
      { text: '200 MindCoins/Monat Bonus', included: true },
      { text: 'Erweiterte Lern-Statistiken', included: true },
      { text: 'Prioritaets-Support', included: true },
    ],
    buttonText: 'Teacher werden',
    buttonStyle: 'bg-primary hover:bg-primary-light text-white',
    highlighted: false,
  },
]
```

### PricingCard Komponente

```jsx
function PricingCard({ tier, isCurrentTier }) {
  return (
    <div className={`bg-bg-card rounded-xl p-6 border flex flex-col
      ${tier.highlighted
        ? 'border-accent ring-2 ring-accent/20 scale-105'
        : 'border-gray-700'
      }`}>
      {/* Empfohlen Badge */}
      {tier.highlighted && (
        <span className="bg-accent text-white text-xs font-bold px-3 py-1
                         rounded-full self-start mb-4">
          EMPFOHLEN
        </span>
      )}

      {/* Name & Preis */}
      <h3 className="text-xl font-bold text-text-primary">{tier.name}</h3>
      <div className="mt-2 mb-4">
        <span className="text-3xl font-bold text-text-primary">{tier.price} Euro</span>
        <span className="text-text-muted">{tier.period}</span>
      </div>
      <p className="text-sm text-text-secondary mb-6">{tier.description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            {feature.included ? (
              <span className="text-success">&#10003;</span>
            ) : (
              <span className="text-text-muted">&#10007;</span>
            )}
            <span className={feature.included ? 'text-text-primary' : 'text-text-muted'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${tier.buttonStyle}`}
        disabled={isCurrentTier}
      >
        {isCurrentTier ? 'Aktueller Plan' : tier.buttonText}
      </button>

      {/* MVP Hinweis */}
      {tier.id !== 'free' && (
        <p className="text-xs text-text-muted text-center mt-2">
          Payment kommt bald
        </p>
      )}
    </div>
  )
}
```

---

## Datei 3: `src/pages/Shop.jsx`

Die MindCoins-Shop-Seite.

```
┌──────────────────────────────────────────────────────────────────┐
│  MINDCOINS SHOP (/shop)                                           │
│                                                                    │
│  Dein Guthaben: 💰 500 MindCoins                                 │
│                                                                    │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │                │  │  BELIEBT ⭐     │  │  BESTER DEAL   │     │
│  │  STARTER       │  │                │  │                │     │
│  │                │  │  STANDARD      │  │  PREMIUM       │     │
│  │  💰 500 MC     │  │                │  │                │     │
│  │                │  │  💰 1200 MC    │  │  💰 2500 MC    │     │
│  │  4,99 Euro     │  │  (+200 Bonus)  │  │  (+500 Bonus)  │     │
│  │                │  │  9,99 Euro     │  │  19,99 Euro    │     │
│  │  100 MC/Euro   │  │                │  │                │     │
│  │                │  │  120 MC/Euro   │  │  125 MC/Euro   │     │
│  │  [ Kaufen ]    │  │                │  │                │     │
│  │                │  │  [ Kaufen ]    │  │  [ Kaufen ]    │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                    │
│  ── Wofuer MindCoins? ──                                         │
│  💎 Premium Avatar Items                                         │
│  🎨 Assets im Marketplace                                        │
│  🎮 Premium-Spielinhalte                                         │
│                                                                    │
│  "Payment kommt bald - MVP zeigt nur UI"                         │
└──────────────────────────────────────────────────────────────────┘
```

### MindCoins-Pakete Definition

```javascript
const MINDCOIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    amount: 500,
    bonus: 0,
    price: '4,99',
    pricePerEuro: '100 MC/Euro',
    badge: null,
    popular: false,
    bestDeal: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    amount: 1200,
    bonus: 200,
    price: '9,99',
    pricePerEuro: '120 MC/Euro',
    badge: 'BELIEBT',
    popular: true,
    bestDeal: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    amount: 2500,
    bonus: 500,
    price: '19,99',
    pricePerEuro: '125 MC/Euro',
    badge: 'BESTER DEAL',
    popular: false,
    bestDeal: true,
  },
]
```

### CoinPackageCard Komponente

```jsx
function CoinPackageCard({ pkg, onPurchase }) {
  return (
    <div className={`bg-bg-card rounded-xl p-6 border relative
      ${pkg.popular ? 'border-accent ring-2 ring-accent/20' : 'border-gray-700'}
      ${pkg.bestDeal ? 'border-warning ring-2 ring-warning/20' : ''}`}>

      {/* Badge */}
      {pkg.badge && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold
                          px-3 py-1 rounded-full
          ${pkg.popular ? 'bg-accent text-white' : 'bg-warning text-black'}`}>
          {pkg.badge}
        </span>
      )}

      {/* Paket-Name */}
      <h3 className="text-lg font-bold text-text-primary text-center mt-2">{pkg.name}</h3>

      {/* MindCoins Menge */}
      <div className="text-center my-6">
        <span className="text-4xl">💰</span>
        <p className="text-3xl font-bold text-accent mt-2">
          {pkg.amount.toLocaleString('de-DE')} MC
        </p>
        {pkg.bonus > 0 && (
          <p className="text-sm text-success font-medium mt-1">
            +{pkg.bonus} Bonus MindCoins!
          </p>
        )}
      </div>

      {/* Preis */}
      <p className="text-2xl font-bold text-text-primary text-center">
        {pkg.price} Euro
      </p>
      <p className="text-xs text-text-muted text-center mt-1">
        {pkg.pricePerEuro}
      </p>

      {/* Kauf-Button */}
      <button
        onClick={() => onPurchase(pkg)}
        className="w-full mt-6 bg-accent hover:bg-accent-dark text-white py-3 rounded-lg
                   font-semibold transition-colors"
      >
        Kaufen
      </button>
    </div>
  )
}
```

### Shop-Seite Gesamt

```jsx
export default function Shop() {
  const { currentUser } = useAuth()

  const handlePurchase = (pkg) => {
    // MVP: Nur UI, kein echter Kauf
    alert(`Kauf-Funktion kommt bald!\n\nPaket: ${pkg.name}\nPreis: ${pkg.price} Euro\nMindCoins: ${pkg.amount + pkg.bonus} MC`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">MindCoins Shop</h1>

      {/* Aktuelles Guthaben */}
      <div className="bg-bg-card rounded-xl p-4 mb-8 inline-flex items-center gap-3">
        <span className="text-2xl">💰</span>
        <div>
          <p className="text-sm text-text-muted">Dein Guthaben</p>
          <p className="text-2xl font-bold text-accent">{currentUser?.mindCoins || 0} MindCoins</p>
        </div>
      </div>

      {/* Pakete Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MINDCOIN_PACKAGES.map((pkg) => (
          <CoinPackageCard
            key={pkg.id}
            pkg={pkg}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {/* Wofuer MindCoins? */}
      <section className="bg-bg-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Wofuer kannst du MindCoins verwenden?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <p className="font-medium text-text-primary">Premium Avatar Items</p>
              <p className="text-sm text-text-muted">Exklusive Anpassungen fuer deinen Avatar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="font-medium text-text-primary">Marketplace Assets</p>
              <p className="text-sm text-text-muted">3D-Modelle, Texturen, Audio und mehr</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-medium text-text-primary">Premium-Spielinhalte</p>
              <p className="text-sm text-text-muted">Exklusive Inhalte und Features</p>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Hinweis */}
      <div className="mt-8 bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
        <p className="text-warning font-medium">
          &#9888; Payment-Integration kommt bald!
        </p>
        <p className="text-sm text-text-muted mt-1">
          Im MVP wird kein echtes Geld verarbeitet. Stripe/PayPal wird in einer spaeteren Version integriert.
        </p>
      </div>
    </div>
  )
}
```

---

## Premium-Check Utility

Fuer die Verwendung in anderen Komponenten:

```javascript
// Hilfsfunktionen fuer Premium-Checks

export function isPremium(user) {
  return user?.isPremium === true
}

export function isCreatorPremium(user) {
  return user?.premiumTier === 'creator' || user?.premiumTier === 'teacher'
}

export function isTeacherPremium(user) {
  return user?.premiumTier === 'teacher'
}

export function canUploadGames(user) {
  return isCreatorPremium(user)
}

export function canManageClasses(user) {
  return isTeacherPremium(user)
}
```

**Verwendung in anderen Komponenten:**

```jsx
// In Navbar.jsx - Create-Link nur fuer Creator Premium
{isCreatorPremium(currentUser) && (
  <Link to="/create">Create</Link>
)}

// In Create-Seite - Redirect wenn nicht Premium
if (!isCreatorPremium(currentUser)) {
  return <Navigate to="/premium" />
}

// In Teacher-Dashboard - Redirect wenn nicht Teacher
if (!isTeacherPremium(currentUser)) {
  return <Navigate to="/premium" />
}
```

---

## Testen

1. **MindCoins in Navbar** - Anzeige zeigt aktuelle MindCoins-Anzahl
2. **Navbar-Klick** - Klick auf MindCoins fuehrt zu `/shop`
3. **Premium-Seite** - `/premium` zeigt 3 Pricing-Karten (Kostenlos, Creator, Teacher)
4. **Feature-Vergleich** - Jede Karte zeigt Features mit Haekchen/Kreuz
5. **Empfohlen-Badge** - Creator Premium hat "EMPFOHLEN" Badge
6. **Shop-Seite** - `/shop` zeigt 3 MindCoins-Pakete
7. **Guthaben-Anzeige** - Aktuelles Guthaben wird oben angezeigt
8. **Bonus-Anzeige** - Standard und Premium Pakete zeigen Bonus-MindCoins
9. **Kauf-Button** - Klick zeigt MVP-Platzhalter (Alert oder Toast)
10. **MVP-Hinweis** - "Payment kommt bald" Hinweis ist sichtbar
11. **Premium-Checks** - isPremium/isCreatorPremium/isTeacherPremium Funktionen arbeiten korrekt
12. **Responsive** - Pricing-Cards und Shop-Karten passen sich an

---

## Checkliste

- [ ] MindCoins-Anzeige in der Navbar mit Klick-Link zum Shop
- [ ] Premium-Seite unter `/premium` mit 3 Pricing-Tiers
- [ ] Kostenlos-Tier: Grundfunktionen aufgelistet
- [ ] Creator Premium (9,99 Euro/Monat): Features aufgelistet
- [ ] Teacher Premium (14,99 Euro/Monat): Features aufgelistet
- [ ] Feature-Vergleich mit Haekchen/Kreuz pro Feature
- [ ] "EMPFOHLEN" Badge auf Creator Premium
- [ ] Shop-Seite unter `/shop` mit 3 MindCoins-Paketen
- [ ] Starter: 500 MC / 4,99 Euro
- [ ] Standard: 1200+200 MC / 9,99 Euro (BELIEBT Badge)
- [ ] Premium: 2500+500 MC / 19,99 Euro (BESTER DEAL Badge)
- [ ] Aktuelles MindCoins-Guthaben wird im Shop angezeigt
- [ ] Bonus-MindCoins sind visuell hervorgehoben (gruen)
- [ ] Kauf-Buttons zeigen MVP-Platzhalter (keine echte Transaktion)
- [ ] "Payment kommt bald" Hinweis ist sichtbar
- [ ] isPremium/isCreatorPremium/isTeacherPremium Utility-Funktionen
- [ ] user.mindCoins, user.isPremium, user.premiumTier Felder im Firestore-Schema
- [ ] **KEIN MindCoin-Verdienst durch Gameplay oder Achievements**

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/pages/Premium.jsx` | Premium-Seite mit Feature-Vergleich und Pricing |
| `src/pages/Shop.jsx` | MindCoins-Shop mit 3 Kauf-Paketen |
| `src/utils/premiumChecks.js` | Utility-Funktionen fuer Premium-Status-Pruefungen |
| `src/components/layout/Navbar.jsx` | Aktualisiert mit MindCoins-Anzeige |
