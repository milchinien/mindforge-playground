# 23 - Common Components (Basis-Bausteine)

## Was wird hier gemacht?

In diesem Schritt baust du die wiederverwendbaren Basis-Komponenten die ueberall in MindForge verwendet werden: Button, Modal, Toast-Benachrichtigungen, LoadingSpinner, ProgressBar, EmptyState und standardisiertes Form-Styling. **EMPFEHLUNG: Implementiere diesen Plan direkt nach Plan 02 (Layout), da fast alle anderen Features diese Komponenten brauchen.**

---

## Voraussetzungen

- Datei `01-PROJECT-SETUP.md` muss abgeschlossen sein
- Datei `02-LAYOUT-NAVIGATION.md` muss abgeschlossen sein
- Tailwind CSS ist konfiguriert

---

## Uebersicht aller Komponenten

```
src/components/common/
├── Button.jsx           # Vielseitiger Button mit Varianten
├── Modal.jsx            # Overlay-Dialog mit Schliess-Logik
├── Toast.jsx            # Benachrichtigungs-Pop-up
├── LoadingSpinner.jsx   # Lade-Animation
├── ProgressBar.jsx      # Fortschrittsbalken
└── EmptyState.jsx       # Platzhalter fuer leere Inhalte

src/contexts/
└── ToastContext.jsx      # Context + Provider fuer Toast-System

src/styles/
└── globals.css           # Ergaenzt um Form-Styling
```

---

## Datei 1: `src/components/common/Button.jsx`

Ein vielseitiger Button mit 5 Varianten und 3 Groessen.

### Varianten-Uebersicht

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [  Primary  ]   Haupt-Aktionen (orange, hervorgehoben)           │
│                                                                    │
│  [ Secondary ]   Neben-Aktionen (dunkelgrau)                      │
│                                                                    │
│  [  Outline  ]   Subtile Aktionen (transparenter Hintergrund)     │
│                                                                    │
│  [  Danger   ]   Gefaehrliche Aktionen (rot, loeschen etc.)       │
│                                                                    │
│  [  Ghost    ]   Minimale Aktionen (nur Text, kein Hintergrund)   │
│                                                                    │
│  Groessen: [sm] [   md   ] [    lg    ]                           │
│                                                                    │
│  Zusaetzlich: Loading-State, Disabled, fullWidth                  │
└──────────────────────────────────────────────────────────────────┘
```

### Props

```typescript
// Props-Beschreibung (als TypeScript-Annotation fuer Klarheit)
{
  children: ReactNode,           // Button-Text/Inhalt
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost',  // Standard: 'primary'
  size?: 'sm' | 'md' | 'lg',    // Standard: 'md'
  loading?: boolean,             // Zeigt Spinner und disabled den Button
  disabled?: boolean,            // Button deaktiviert
  fullWidth?: boolean,           // 100% Breite
  onClick?: function,            // Click-Handler
  type?: 'button' | 'submit',   // Standard: 'button'
  className?: string,            // Zusaetzliche CSS-Klassen
  ...rest                        // Alle weiteren HTML-Button-Props
}
```

### Implementierung

```jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  // Varianten-Styles
  const variants = {
    primary:   'bg-accent hover:bg-accent-dark text-white',
    secondary: 'bg-bg-hover hover:bg-gray-500 text-text-primary',
    outline:   'bg-transparent border border-gray-600 hover:bg-bg-hover text-text-primary',
    danger:    'bg-error hover:bg-red-700 text-white',
    ghost:     'bg-transparent hover:bg-bg-hover text-text-secondary hover:text-text-primary',
  }

  // Groessen-Styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-primary
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
      {...rest}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
```

### Verwendungsbeispiele

```jsx
// Standard
<Button onClick={handleSave}>Speichern</Button>

// Varianten
<Button variant="secondary">Abbrechen</Button>
<Button variant="outline">Details</Button>
<Button variant="danger">Loeschen</Button>
<Button variant="ghost">Mehr anzeigen</Button>

// Groessen
<Button size="sm">Klein</Button>
<Button size="md">Normal</Button>
<Button size="lg">Gross</Button>

// Zustaende
<Button loading>Wird gespeichert...</Button>
<Button disabled>Nicht verfuegbar</Button>
<Button fullWidth>Volle Breite</Button>

// Formular
<Button type="submit" variant="primary" size="lg" fullWidth>
  Registrieren
</Button>
```

---

## Datei 2: `src/components/common/Modal.jsx`

Ein wiederverwendbarer Overlay-Dialog.

### Features
- Overlay (dunkler Hintergrund)
- ESC-Taste schliesst Modal
- Klick ausserhalb schliesst Modal
- Scroll-Prevention auf dem Body
- Animation (Fade-In)
- Konfigurierbare Maximalbreite

### Props

```typescript
{
  isOpen: boolean,              // Sichtbar?
  onClose: function,            // Schliessen-Handler
  title?: string,               // Optionaler Titel im Header
  children: ReactNode,          // Modal-Inhalt
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl',  // Standard: 'md'
  showCloseButton?: boolean,    // X-Button anzeigen? Standard: true
}
```

### Implementierung

```jsx
import { useEffect, useRef } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) {
  const modalRef = useRef(null)

  // ESC-Taste Handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      // Scroll auf dem Body verhindern
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/60 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`bg-bg-secondary rounded-xl shadow-2xl w-full ${maxWidths[maxWidth]}
                    max-h-[90vh] overflow-y-auto animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            {title && (
              <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors
                           ml-auto p-1 rounded-lg hover:bg-bg-hover"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### CSS-Animationen (in globals.css ergaenzen)

```css
/* Modal Animationen */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.15s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.15s ease-out;
}
```

### Verwendungsbeispiel

```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Bestaetigung">
  <p className="text-text-secondary mb-4">Bist du sicher?</p>
  <div className="flex gap-3">
    <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
    <Button variant="danger" onClick={handleDelete}>Loeschen</Button>
  </div>
</Modal>
```

---

## Datei 3: Toast-System

### `src/contexts/ToastContext.jsx` - Context + Provider

```jsx
import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/common/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Convenience-Methoden
  const success = useCallback((msg) => addToast(msg, 'success'), [addToast])
  const error = useCallback((msg) => addToast(msg, 'error', 5000), [addToast])
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast])
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}

      {/* Toast-Container (unten rechts) */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Custom Hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast muss innerhalb von ToastProvider verwendet werden')
  }
  return context
}
```

### `src/components/common/Toast.jsx` - Einzelne Toast-Komponente

```jsx
import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Einblenden
    requestAnimationFrame(() => setIsVisible(true))

    // Auto-Hide Timer
    const hideTimer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(onClose, 300) // Warte auf Ausblend-Animation
    }, duration)

    return () => clearTimeout(hideTimer)
  }, [duration, onClose])

  // Typ-Konfiguration
  const types = {
    success: {
      icon: '✅',
      bgColor: 'bg-success/10 border-success/30',
      textColor: 'text-success',
    },
    error: {
      icon: '❌',
      bgColor: 'bg-error/10 border-error/30',
      textColor: 'text-error',
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-warning/10 border-warning/30',
      textColor: 'text-warning',
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-primary/10 border-primary/30',
      textColor: 'text-primary-light',
    },
  }

  const config = types[type] || types.info

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
                  backdrop-blur-sm transition-all duration-300
                  ${config.bgColor}
                  ${isVisible && !isLeaving
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                  }`}
    >
      <span className="text-lg flex-shrink-0">{config.icon}</span>
      <p className={`text-sm font-medium flex-1 ${config.textColor}`}>{message}</p>
      <button
        onClick={() => {
          setIsLeaving(true)
          setTimeout(onClose, 300)
        }}
        className="text-text-muted hover:text-text-primary flex-shrink-0 ml-2"
      >
        &#10005;
      </button>
    </div>
  )
}
```

### ToastProvider in App.jsx einbinden

```jsx
// In App.jsx:
import { ToastProvider } from './contexts/ToastContext'

function App() {
  return (
    <ToastProvider>
      <Router>
        {/* ... */}
      </Router>
    </ToastProvider>
  )
}
```

### Verwendungsbeispiel

```jsx
import { useToast } from '../../contexts/ToastContext'

function SomeComponent() {
  const toast = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      toast.success('Erfolgreich gespeichert!')
    } catch (error) {
      toast.error('Fehler beim Speichern: ' + error.message)
    }
  }

  return <Button onClick={handleSave}>Speichern</Button>
}
```

---

## Datei 4: `src/components/common/LoadingSpinner.jsx`

Eine einfache Lade-Animation.

### Props

```typescript
{
  size?: 'sm' | 'md' | 'lg',    // Standard: 'md'
  fullScreen?: boolean,          // Zentriert auf gesamtem Bildschirm
  text?: string,                 // Optionaler Ladetext
}
```

### Implementierung

```jsx
export default function LoadingSpinner({ size = 'md', fullScreen = false, text }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div className={`${sizes[size]} border-gray-600 border-t-accent rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center
                      bg-bg-primary/80 backdrop-blur-sm z-50">
        {spinner}
        {text && <p className="mt-4 text-text-secondary text-sm">{text}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {spinner}
      {text && <p className="mt-3 text-text-secondary text-sm">{text}</p>}
    </div>
  )
}
```

### CSS fuer den Spinner (globals.css, falls noch nicht vorhanden)

```css
/* border-3 als Custom-Utility (Tailwind hat nur border-2 und border-4) */
.border-3 {
  border-width: 3px;
}
```

### Verwendungsbeispiele

```jsx
// Inline-Spinner (z.B. in einem Button)
<LoadingSpinner size="sm" />

// Standard-Lade-Anzeige
<LoadingSpinner text="Daten werden geladen..." />

// Fullscreen-Overlay
<LoadingSpinner fullScreen text="MindForge wird geladen..." />
```

---

## Datei 5: `src/components/common/ProgressBar.jsx`

Ein konfigurierbarer Fortschrittsbalken.

### Props

```typescript
{
  value: number,                 // Aktueller Wert
  max?: number,                  // Maximalwert (Standard: 100)
  showLabel?: boolean,           // Prozent-Label anzeigen? Standard: false
  showValues?: boolean,          // "value/max" anzeigen? Standard: false
  color?: 'accent' | 'success' | 'warning' | 'error' | 'primary',  // Standard: 'accent'
  size?: 'sm' | 'md' | 'lg',    // Standard: 'md'
  label?: string,                // Optionaler Text-Label ueber dem Balken
}
```

### Implementierung

```jsx
export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  showValues = false,
  color = 'accent',
  size = 'md',
  label,
}) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const colors = {
    accent:  'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error:   'bg-error',
    primary: 'bg-primary-light',
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {/* Label-Zeile */}
      {(label || showLabel || showValues) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm text-text-secondary">{label}</span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {showValues && (
              <span className="text-xs text-text-muted">{value}/{max}</span>
            )}
            {showLabel && (
              <span className="text-xs font-medium text-text-primary">{percent}%</span>
            )}
          </div>
        </div>
      )}

      {/* Balken */}
      <div className={`w-full bg-bg-hover rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
```

### Verwendungsbeispiele

```jsx
// Einfach
<ProgressBar value={60} />

// Mit Label und Werten
<ProgressBar value={30} max={50} showLabel showValues label="Fortschritt" />

// Farbig und gross
<ProgressBar value={90} color="success" size="lg" showLabel />

// Klein fuer kompakte Anzeigen
<ProgressBar value={45} size="sm" color="warning" />
```

---

## Datei 6: `src/components/common/EmptyState.jsx`

Ein Platzhalter fuer Seiten/Bereiche ohne Inhalt.

### Props

```typescript
{
  icon?: string,                 // Emoji oder Icon-Text
  title: string,                 // Ueberschrift
  description?: string,          // Beschreibungstext
  actionLabel?: string,          // Button-Text (optional)
  actionLink?: string,           // Link-Ziel fuer den Button
  onAction?: function,           // Oder: Click-Handler statt Link
}
```

### Implementierung

```jsx
import { Link } from 'react-router-dom'

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <span className="text-6xl mb-4 block">{icon}</span>
      )}
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-muted max-w-md mb-6">{description}</p>
      )}
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg
                     font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg
                     font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
```

### Verwendungsbeispiele

```jsx
// Mit Link
<EmptyState
  icon="🎮"
  title="Keine Spiele gefunden"
  description="Versuche andere Suchbegriffe oder entdecke den Mindbrowser."
  actionLabel="Zum Mindbrowser"
  actionLink="/browse"
/>

// Mit Button
<EmptyState
  icon="👥"
  title="Noch keine Freunde"
  description="Fuege Freunde hinzu um gemeinsam zu lernen!"
  actionLabel="Freund hinzufuegen"
  onAction={() => setShowModal(true)}
/>

// Minimal
<EmptyState
  icon="📭"
  title="Keine Benachrichtigungen"
/>
```

---

## Datei 7: Form-Styling in `src/styles/globals.css`

Ergaenze standardisierte Styles fuer Formulare:

```css
/* ===== FORM STYLING ===== */

/* Standard Input */
.form-input {
  @apply w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg
         px-4 py-3 text-sm
         placeholder:text-text-muted
         focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
         transition-colors;
}

/* Standard Label */
.form-label {
  @apply block text-sm font-medium text-text-secondary mb-1.5;
}

/* Error-Message */
.form-error {
  @apply text-error text-xs mt-1;
}

/* Hint/Help-Text */
.form-hint {
  @apply text-text-muted text-xs mt-1;
}

/* Standard Textarea */
.form-textarea {
  @apply w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg
         px-4 py-3 text-sm resize-none
         placeholder:text-text-muted
         focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
         transition-colors;
}

/* Standard Select */
.form-select {
  @apply w-full bg-bg-hover text-text-primary border border-gray-600 rounded-lg
         px-4 py-3 text-sm
         focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
         transition-colors appearance-none cursor-pointer;
}

/* Form Group (Label + Input + Error zusammen) */
.form-group {
  @apply space-y-1;
}
```

### Verwendungsbeispiel mit Form-Klassen

```jsx
<div className="form-group">
  <label className="form-label">E-Mail</label>
  <input
    type="email"
    className="form-input"
    placeholder="deine@email.de"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  {error && <p className="form-error">{error}</p>}
  <p className="form-hint">Wir senden dir eine Bestaetigungs-E-Mail.</p>
</div>
```

---

## Komponenten-Uebersicht (Zusammenfassung)

```
┌─────────────────┬───────────────────┬─────────────────────────────┐
│  Komponente      │  Varianten/Props  │  Verwendet in               │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  Button          │  5 variants       │  Ueberall                    │
│                  │  3 sizes          │                              │
│                  │  loading/disabled │                              │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  Modal           │  4 maxWidth       │  Settings, Avatar, Create,  │
│                  │  ESC + Overlay    │  Friends, Teacher, etc.     │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  Toast           │  4 types          │  Save-Feedback, Errors,     │
│                  │  auto-hide        │  Erfolgs-Meldungen          │
│                  │  stackable        │                              │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  LoadingSpinner  │  3 sizes          │  Daten laden, Buttons,      │
│                  │  fullScreen       │  Seiten-Wechsel             │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  ProgressBar     │  5 colors         │  Achievements, Events,      │
│                  │  3 sizes          │  Teacher Dashboard          │
│                  │  labels/values    │                              │
├─────────────────┼───────────────────┼─────────────────────────────┤
│  EmptyState      │  icon/title/desc  │  Inventory, Friends,        │
│                  │  action button    │  Search, alle leeren Listen │
└─────────────────┴───────────────────┴─────────────────────────────┘
```

---

## Testen

### Button
1. **Alle Varianten** - Primary (orange), Secondary (grau), Outline (Rand), Danger (rot), Ghost (transparent)
2. **Alle Groessen** - sm (klein), md (normal), lg (gross)
3. **Loading State** - Button zeigt Spinner und ist nicht klickbar
4. **Disabled State** - Button ist ausgegraut und nicht klickbar
5. **Full Width** - Button nimmt volle Breite ein

### Modal
6. **Oeffnen/Schliessen** - Modal erscheint und verschwindet mit Animation
7. **ESC-Taste** - Druecke ESC, Modal schliesst
8. **Klick ausserhalb** - Klick auf Overlay schliesst Modal
9. **Scroll-Lock** - Body scrollt nicht waehrend Modal offen ist
10. **Maximalbreite** - sm, md, lg, xl werden korrekt angewendet

### Toast
11. **4 Typen** - success (gruen), error (rot), warning (gelb), info (blau)
12. **Auto-Hide** - Toast verschwindet nach 3-5 Sekunden
13. **Manuell schliessen** - X-Button schliesst Toast sofort
14. **Stackable** - Mehrere Toasts stapeln sich untereinander
15. **Animation** - Toast gleitet von rechts rein und raus

### LoadingSpinner
16. **3 Groessen** - sm, md, lg Spinner drehen sich
17. **FullScreen** - Overlay mit Spinner und optionalem Text
18. **Mit Text** - "Daten werden geladen..." unter dem Spinner

### ProgressBar
19. **Prozent-Berechnung** - value=30, max=50 zeigt 60%
20. **Farben** - accent, success, warning, error, primary
21. **Labels** - showLabel zeigt Prozent, showValues zeigt "value/max"
22. **Groessen** - sm, md, lg Balkenhoehen

### EmptyState
23. **Vollstaendig** - Icon, Titel, Beschreibung und Button angezeigt
24. **Link-Button** - Klick navigiert zu korrekter Seite
25. **Minimal** - Nur Icon und Titel ohne Button

### Form-Styling
26. **Input** - form-input Klasse styled Eingabefelder korrekt
27. **Focus** - Akzent-Farbe bei Fokus
28. **Error** - form-error zeigt roten Text

---

## Checkliste

- [ ] Button-Komponente mit 5 Varianten (primary, secondary, outline, danger, ghost)
- [ ] Button mit 3 Groessen (sm, md, lg)
- [ ] Button Loading-State mit Spinner
- [ ] Button Disabled-State
- [ ] Button fullWidth Option
- [ ] Modal-Komponente mit Overlay
- [ ] Modal schliesst bei ESC-Taste
- [ ] Modal schliesst bei Klick ausserhalb
- [ ] Modal verhindert Body-Scroll
- [ ] Modal hat Einblend-Animation
- [ ] Modal hat konfigurierbare maxWidth (sm, md, lg, xl)
- [ ] ToastContext und ToastProvider erstellt
- [ ] useToast Hook verfuegbar
- [ ] Toast in 4 Typen: success, error, warning, info
- [ ] Toast Auto-Hide nach 3-5 Sekunden
- [ ] Toast manuell schliessbar
- [ ] Toasts stapelbar (mehrere gleichzeitig)
- [ ] Toast Ein-/Ausblend-Animation
- [ ] LoadingSpinner in 3 Groessen (sm, md, lg)
- [ ] LoadingSpinner fullScreen Option
- [ ] LoadingSpinner optionaler Text
- [ ] ProgressBar mit value/max Berechnung
- [ ] ProgressBar 5 Farb-Optionen
- [ ] ProgressBar 3 Groessen
- [ ] ProgressBar optionale Labels und Values
- [ ] EmptyState mit Icon, Titel, Beschreibung
- [ ] EmptyState optionaler Action-Button (Link oder onClick)
- [ ] Form-Styling Klassen in globals.css (form-input, form-label, form-error, form-hint)
- [ ] ToastProvider in App.jsx eingebunden
- [ ] Animationen (fade-in, scale-in) in globals.css

---

## Zusammenfassung der erstellten Dateien

| Datei | Zweck |
|-------|-------|
| `src/components/common/Button.jsx` | Vielseitiger Button mit 5 Varianten und 3 Groessen |
| `src/components/common/Modal.jsx` | Overlay-Dialog mit ESC, Klick-ausserhalb, Animation |
| `src/components/common/Toast.jsx` | Einzelne Toast-Benachrichtigung mit Auto-Hide |
| `src/contexts/ToastContext.jsx` | Toast Context + Provider + useToast Hook |
| `src/components/common/LoadingSpinner.jsx` | Lade-Animation in 3 Groessen |
| `src/components/common/ProgressBar.jsx` | Konfigurierbarer Fortschrittsbalken |
| `src/components/common/EmptyState.jsx` | Platzhalter fuer leere Inhalte |
| `src/styles/globals.css` | Ergaenzt um Form-Styling und Modal-Animationen |
