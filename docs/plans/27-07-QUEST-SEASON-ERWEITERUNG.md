# Step 7: Quest Store & Season Store Erweiterungen

## Ziel

Die bestehenden questStore und seasonStore erweitern, damit beim Einlösen von Belohnungen:
- Kosmetische Items ins Inventar wandern
- Notifications erzeugt werden
- Activities geloggt werden

Keine neuen Stores — nur Erweiterungen der bestehenden.

---

## 7.1 Erweiterung: `src/stores/questStore.js`

### Neue Imports (oben hinzufügen)

```js
import { useInventoryStore } from './inventoryStore'
import { useNotificationStore } from './notificationStore'
import { useActivityStore } from './activityStore'
```

### Geänderte Action: `claimQuestReward(questId)`

Die bestehende Logik (Status auf 'claimed' setzen, nächstes Story-Chapter unlocken) bleibt **komplett erhalten**.
Folgendes wird **AM ENDE** der Funktion hinzugefügt, NACH dem set()-Aufruf:

```js
claimQuestReward: (questId) => {
  // ========== BESTEHENDE LOGIK (NICHT ÄNDERN) ==========
  set((state) => {
    // ... alles was aktuell da steht bleibt ...
  })

  // ========== NEU: Cross-Store-Aufrufe ==========

  // 1. Quest-Daten finden (in allen Quest-Arrays suchen)
  const state = get()
  const quest =
    state.dailyQuests.find(q => q.id === questId) ||
    state.weeklyQuests.find(q => q.id === questId) ||
    state.storyProgress?.chapters?.find(c => c.id === questId) ||
    state.communityQuests.find(q => q.id === questId)

  if (!quest) return

  // 2. Kosmetische Belohnung ins Inventar (wenn vorhanden)
  if (quest.cosmeticReward) {
    // cosmeticReward Struktur in questData: string (z.B. "Goldener Rahmen")
    // Typ ableiten aus dem Namen oder als generisches Badge/Frame behandeln
    const rewardType = quest.cosmeticReward.toLowerCase().includes('rahmen') ? 'frame'
      : quest.cosmeticReward.toLowerCase().includes('titel') ? 'title'
      : 'badge'

    useInventoryStore.getState().addItem({
      id: `quest-reward-${questId}`,
      type: rewardType,
      name: quest.cosmeticReward,
      description: `Belohnung für Quest: ${quest.title}`,
      rarity: 'rare',
      source: 'quest',
    })
  }

  // 3. Notification
  useNotificationStore.getState().addNotification({
    type: 'quest',
    title: 'Quest abgeschlossen!',
    message: `Du hast "${quest.title}" abgeschlossen${quest.xpReward ? ` und ${quest.xpReward} XP erhalten` : ''}!`,
    link: '/quests',
  })

  // 4. Activity Log
  useActivityStore.getState().addActivity({
    type: 'quest_completed',
    description: `Quest "${quest.title}" abgeschlossen`,
    metadata: { questId, xpReward: quest.xpReward || 0 },
  })
},
```

### Hinweis zur cosmeticReward-Struktur

```
In questData.js haben Quests mit cosmeticReward dieses Format:

Weekly-Quest Beispiel:
  cosmeticReward: "Goldener Rahmen"     → type: 'frame'
  cosmeticReward: "Wissenschaftler-Titel" → type: 'title'

Story-Quest Beispiel (chapters):
  cosmeticReward: "Akademie-Abzeichen"  → type: 'badge'
  cosmeticReward: "Profilrahmen: Flammen" → type: 'frame'

Die Typ-Ableitung im Code oben ist simpel (sucht nach Schlüsselwörtern).
Für Edge-Cases die nicht matchen: Default auf 'badge'.
```

---

## 7.2 Erweiterung: `src/stores/seasonStore.js`

### Neue Imports (oben hinzufügen)

```js
import { useInventoryStore } from './inventoryStore'
import { useNotificationStore } from './notificationStore'
import { useActivityStore } from './activityStore'
```

### Geänderte Action: `claimReward(tier, track)`

Bestehende Logik (claimed-Set aktualisieren) bleibt **komplett erhalten**.
Folgendes wird **AM ENDE** hinzugefügt:

```js
claimReward: (tier, track) => {
  // ========== BESTEHENDE LOGIK (NICHT ÄNDERN) ==========
  const key = `${tier}-${track}`
  set((state) => {
    const newClaimed = new Set(state.claimedRewards)
    newClaimed.add(key)
    return { claimedRewards: newClaimed }
  })

  // ========== NEU: Cross-Store-Aufrufe ==========

  // 1. Reward-Daten aus BATTLE_PASS_TIERS auslesen
  const tierData = BATTLE_PASS_TIERS.find(t => t.tier === tier)
  if (!tierData) return

  const reward = tierData[track]  // tierData.free oder tierData.premium
  if (!reward) return

  // 2. Item ins Inventar (reward.type aus seasonData muss auf inventoryStore-Types gemappt werden)
  const typeMapping = {
    'xp-booster': 'effect',
    'badge': 'badge',
    'avatar-item': 'avatar-item',
    'title': 'title',
    'avatar-frame': 'frame',
    'profile-banner': 'background',
    'profile-effect': 'effect',
  }
  const inventoryType = typeMapping[reward.type] || 'badge'

  useInventoryStore.getState().addItem({
    id: `season-${CURRENT_SEASON.id}-tier${tier}-${track}`,
    type: inventoryType,
    name: reward.name,
    description: reward.description || `Season ${CURRENT_SEASON.number} Tier ${tier} Belohnung`,
    rarity: reward.rarity || 'common',
    source: 'season',
  })

  // 3. Notification
  useNotificationStore.getState().addNotification({
    type: 'season',
    title: 'Season-Belohnung!',
    message: `Du hast "${reward.name}" für Tier ${tier} erhalten!`,
    link: '/seasons',
  })

  // 4. Activity Log
  useActivityStore.getState().addActivity({
    type: 'reward_claimed',
    description: `Season-Belohnung "${reward.name}" erhalten (Tier ${tier})`,
    metadata: { tier, track, rewardName: reward.name },
  })
},
```

### Geänderte Action: `claimChallengeReward(challengeId, xpAmount)`

Bestehende Logik bleibt. Notification hinzufügen:

```js
claimChallengeReward: (challengeId, xpAmount) => {
  // ========== BESTEHENDE LOGIK (NICHT ÄNDERN) ==========
  set((state) => ({
    challengeProgress: {
      ...state.challengeProgress,
      [challengeId]: {
        ...state.challengeProgress[challengeId],
        claimed: true,
      },
    },
    seasonXP: state.seasonXP + xpAmount,
  }))

  // ========== NEU ==========
  useNotificationStore.getState().addNotification({
    type: 'season',
    title: 'Challenge-Belohnung!',
    message: `Du hast ${xpAmount} XP für eine Challenge erhalten!`,
    link: '/seasons',
  })
},
```

---

## 7.3 Hinweis: Reward-Type-Mapping für Season

Das Type-Mapping ist jetzt direkt im `claimReward`-Code in 7.2 integriert.
Referenz der seasonData-Types und ihre Zuordnung zu inventoryStore-Types:

| seasonData Type | inventoryStore Type |
|----------------|-------------------|
| `'xp-booster'` | `'effect'` |
| `'badge'` | `'badge'` |
| `'avatar-item'` | `'avatar-item'` |
| `'title'` | `'title'` |
| `'avatar-frame'` | `'frame'` |
| `'profile-banner'` | `'background'` |
| `'profile-effect'` | `'effect'` |
| unbekannt/fehlt | `'badge'` (Fallback) |

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/questStore.js` | **ÄNDERN** — Imports + claimQuestReward erweitern |
| `src/stores/seasonStore.js` | **ÄNDERN** — Imports + claimReward + claimChallengeReward erweitern |

## Prüfung nach Implementierung

1. Quests-Page öffnen
2. Eine bereits abgeschlossene Quest claimen → Notification erscheint, Activity geloggt
3. Wenn Quest cosmeticReward hat → Item erscheint im Inventar (prüfen in Browser-Konsole: localStorage)
4. Seasons-Page öffnen
5. Eine Tier-Belohnung claimen → Notification + Item im Inventar
6. Challenge-Belohnung claimen → Notification + XP erhöht
7. Keine bestehende Quest/Season-Funktionalität ist gebrochen
8. Daily/Weekly Reset funktioniert noch wie vorher
