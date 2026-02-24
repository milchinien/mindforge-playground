# Plan 26-01: Sicherheit & Datenschutz

> **Priorität:** Kritisch (Sofort)
> **Status:** Implementiert
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- ~~Hardcodierte Dev-Credentials in `devAuth.js`~~ → Jetzt aus `.env.local` geladen
- ~~Kein DOMPurify oder HTML-Sanitization~~ → DOMPurify installiert + `sanitize.js` Utility
- ~~`CustomCodeRenderer` iframe zu permissiv~~ → CSP im iframe + `referrerPolicy="no-referrer"`
- ~~Keine Content Security Policy~~ → CSP-Meta-Tag in `index.html`
- Firebase-Config als Placeholder im Code (nicht in .env)
- localStorage speichert Auth-State unverschlüsselt
- Code-Review-Utility warnt nur, blockiert nicht

---

## Vorschlag 1.1: Dev-Credentials absichern
- [x] **A) .env.local Migration (Empfohlen)** — Credentials in .env.local verschieben, .gitignore sicherstellen, Build-Time-Injection
- [ ] **B) Separate Dev-Config-Datei** — Eigene unversionierte Datei `devAuth.local.js` mit Import-Fallback
- [ ] **C) Nur Environment-Check** — Credentials bleiben, aber werden nur geladen wenn `NODE_ENV === 'development'` strikt geprüft wird
- [ ] **D) Komplett entfernen** — Dev-Auth-System durch Firebase Emulator ersetzen, keine Mock-Credentials mehr

## Vorschlag 1.2: HTML/XSS-Schutz
- [x] **A) DOMPurify integrieren (Empfohlen)** — Alle User-Inputs (Game-Titel, Beschreibungen, Reviews, Chat) sanitizen
- [ ] **B) React-eigene Escaping nutzen** — Nur dangerouslySetInnerHTML vermeiden, kein extra Paket
- [ ] **C) Allowlist-Ansatz** — Nur bestimmte HTML-Tags erlauben (b, i, a, p), alles andere strippen
- [ ] **D) Markdown-Only** — User-Inputs nur als Markdown akzeptieren, kein HTML erlauben

## Vorschlag 1.3: Iframe-Sandbox verschärfen
- [x] **A) Minimale Permissions (Empfohlen)** — `sandbox="allow-scripts"` beibehalten, aber CSP-Header und `allow-same-origin` explizit verbieten
- [ ] **B) Separate Origin** — Spiele auf einer Subdomain laden (z.B. `games.mindforge.dev`), komplett isoliert
- [ ] **C) Web Worker Sandbox** — Spiel-Code in Web Worker ausführen statt in iframe
- [ ] **D) Status Quo** — Aktuelle Sandbox-Einstellung beibehalten, da Games nur eigenen Code ausführen

## Vorschlag 1.4: Content Security Policy (CSP)
- [x] **A) Strikte CSP-Header (Empfohlen)** — `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob:` etc.
- [ ] **B) Report-Only CSP** — CSP im Report-Modus starten, Violations sammeln, dann schrittweise verschärfen
- [ ] **C) Nur für Spiel-iframes** — CSP nur im iframe-Kontext, Hauptseite bleibt ohne
- [ ] **D) Erst bei Produktion** — CSP-Implementierung auf Produktions-Deployment verschieben
