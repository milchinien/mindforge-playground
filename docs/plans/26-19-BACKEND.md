# Plan 26-19: Backend & Infrastruktur

> **Priorität:** Mittel (Mittelfristig, 1-3 Monate)
> **Zurück zur [Übersicht](26-00-UEBERSICHT.md)**

---

## Aktueller Stand
- Firebase als Backend (Auth, Firestore, Storage)
- Development-Modus mit localStorage-Mock
- Keine echte Server-Side-Logik
- Keine Cloud Functions definiert
- Kein CDN für Assets
- Keine Rate-Limiting
- Keine Backup-Strategie

---

> **WARNUNG: Sicherheitskritisch — Firestore Security Rules**
> Ohne Firestore Security Rules kann jeder authentifizierte User beliebige Daten lesen, ändern und löschen. Das ist ein **kritisches Sicherheitsproblem** das VOR allen anderen Feature-Plänen adressiert werden muss. Aktuell läuft das Projekt im Dev-Modus mit localStorage-Mock — beim Wechsel zu echtem Firebase-Backend MÜSSEN Security Rules implementiert sein.
>
> **Voraussetzung für:** 26-16 Monetarisierung, 26-14 Social Features (Chat), alle Features mit Echtdaten
>
> **Minimum Security Rules:**
> - User können nur eigene Profildaten schreiben
> - Games können nur vom Creator bearbeitet werden
> - MindCoin-Transaktionen nur über Cloud Functions (nicht client-seitig!)
> - Admin-Operationen nur für verifizierte Admins

---

## Vorschlag 19.1: Backend-Architektur
- [ ] **A) Firebase vollständig nutzen (Empfohlen)** — Cloud Functions für Business-Logik (Payments, Validierung, Anti-Cheat), Firestore Security Rules, Storage Rules
- [ ] **B) Custom Backend (Node.js/Express)** — Eigener Server für API, Firebase nur für Auth + Storage
- [ ] **C) Supabase statt Firebase** — Open-Source-Alternative mit PostgreSQL, besser für komplexe Queries
- [ ] **D) Serverless (Vercel/AWS Lambda)** — API-Endpoints als serverlose Funktionen, Firebase für Auth

## Vorschlag 19.2: Deployment-Strategie
- [ ] **A) Firebase Hosting + Vercel (Empfohlen)** — Firebase für Backend-Services, Vercel für Frontend mit Edge-CDN
- [ ] **B) Firebase Hosting komplett** — Alles bei Firebase, einfaches Setup
- [ ] **C) Cloudflare Pages** — Schnelles CDN, DDoS-Schutz, Workers für Edge-Logic
- [ ] **D) Docker + Custom Server** — Volle Kontrolle, eigene Infrastruktur (VPS)

## Vorschlag 19.3: Datenbank-Optimierung
- [ ] **A) Firestore-Indexe + Caching (Empfohlen)** — Composite-Indexes definieren, Client-Side-Caching mit TTL, Offline-Persistence aktivieren
- [ ] **B) Algolia für Suche** — Dedizierte Such-Engine für Games (besser als Firestore-Queries)
- [ ] **C) Redis-Cache-Layer** — In-Memory-Cache vor Firestore für häufige Abfragen
- [ ] **D) Erst optimieren wenn nötig** — Aktuelle Mock-Daten haben keine Performance-Probleme
