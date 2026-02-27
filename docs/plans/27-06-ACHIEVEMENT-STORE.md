# Step 6: Achievement Store + Page Integration

## Ziel

Achievements werden durch echte Aktionen freigeschaltet statt hardcoded.
Ein automatischer Check-Mechanismus prüft nach jeder relevanten Aktion ob neue Achievements earned wurden.
Bei Unlock: Toast-Popup, Notification, Titel ins Inventar.

---

## 6.1 Neuer Store: `src/stores/achievementStore.js`

**localStorage-Key:** `'mindforge-achievements'`

### Imports

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ALL_ACHIEVEMENTS } from '../data/achievementDefinitions'
import { useToastStore } from './toastStore'
import { useNotificationStore } from './notificationStore'
import { useInventoryStore } from './inventoryStore'
import { useActivityStore } from './activityStore'
```

### State

```js
{
  progress: {
    // Player-Progress
    games_played: 0,
    games_completed: 0,
    daily_streak: 0,
    likes_given: 0,
    total_playtime_minutes: 0,

    // Social-Progress
    following_count: 0,
    followers_count: 0,
    friends_count: 0,
    avatar_customized: 0,       // 0 oder 1
    profile_complete: 0,        // 0 oder 1
    events_participated: 0,
    events_completed: 0,

    // Creator-Progress
    games_created: 0,
    total_likes_received: 0,
    total_plays_received: 0,
    game_approval_rate: 0,
    assets_sold: 0,
    is_premium: 0,              // 0 oder 1

    // Subject-Progress
    unique_categories_played: 0,
    category_games_completed: {
      mathematik: 0,
      physik: 0,
      chemie: 0,
      biologie: 0,
      geschichte: 0,
      sprachen: 0,
      informatik: 0,
      musik: 0,
    },
    category_perfect_scores: {
      mathematik: 0,
      physik: 0,
    },
  },

  unlockedAchievements: {},   // { [achievementId]: "ISO-Timestamp" }
  lastStreakDate: null,        // "YYYY-MM-DD" oder null
  categoriesPlayed: [],        // string[] — Liste der Kategorien die je gespielt wurden (für unique_categories_played)
}
```

### Actions — Exakte Signaturen

```js
incrementProgress(field, amount = 1)
  // 1. Sicherheits-Check: if (typeof get().progress[field] !== 'number') return
  // 2. set: progress[field] += amount
  // 3. checkAchievements(field) aufrufen

incrementCategoryProgress(category, field, amount = 1)
  // 1. Sicherheits-Check: if (!get().progress[field] || typeof get().progress[field][category] !== 'number') return
  // 2. set: progress[field][category] += amount
  // 3. checkAchievements(field) aufrufen

setSyncedProgress(field, value)
  // 1. set: progress[field] = value
  // 2. checkAchievements(field) aufrufen
  // Wird von socialStore aufgerufen für: following_count, followers_count, friends_count

trackCategoryPlayed(category)
  // 1. if (get().categoriesPlayed.includes(category)) return
  // 2. categoriesPlayed = [...categoriesPlayed, category]
  // 3. progress.unique_categories_played = categoriesPlayed.length
  // 4. checkAchievements('unique_categories_played')

checkAchievements(changedField = null)
  // Diese Funktion prüft ALLE Achievements und unlockt neue.
  //
  // 1. const { progress, unlockedAchievements } = get()
  // 2. const newlyUnlocked = []
  //
  // 3. Für jedes Achievement in ALL_ACHIEVEMENTS:
  //    a) if (unlockedAchievements[achievement.id]) continue  // schon freigeschaltet
  //    b) if (changedField !== null && achievement.requirement.type !== changedField) continue
  //       // Optimierung: nur relevante Achievements prüfen
  //       // AUSNAHME: category-Types und unique_categories müssen auch bei null geprüft werden
  //    c) Achievement-Check je nach requirement.type:
  //
  //       Einfache Types (direkter Vergleich):
  //         'games_played', 'games_completed', 'daily_streak', 'likes_given',
  //         'total_playtime_minutes', 'following_count', 'followers_count',
  //         'friends_count', 'avatar_customized', 'profile_complete',
  //         'events_participated', 'events_completed', 'games_created',
  //         'total_likes_received', 'total_plays_received', 'game_approval_rate',
  //         'assets_sold', 'is_premium', 'unique_categories_played'
  //         → Check: progress[requirement.type] >= requirement.value
  //
  //       Kategorie-Types:
  //         'category_games_completed':
  //           → Check: progress.category_games_completed[requirement.category] >= requirement.value
  //           → ODER wenn kein requirement.category: Summe aller Kategorien >= requirement.value
  //         'category_perfect_scores':
  //           → Check: progress.category_perfect_scores[requirement.category] >= requirement.value
  //
  //    d) Wenn Check erfüllt:
  //       → newlyUnlocked.push(achievement)
  //       → unlockedAchievements[achievement.id] = new Date().toISOString()
  //
  // 4. State updaten: set({ unlockedAchievements: { ...unlockedAchievements } })
  //
  // 5. Für jedes neu freigeschaltete Achievement (NACH dem State-Update):
  //    a) Toast: useToastStore.getState().showToast(
  //         `🏆 Achievement: ${achievement.name}`, 'success'
  //       )
  //    b) Notification: useNotificationStore.getState().addNotification({
  //         type: 'achievement',
  //         title: 'Achievement freigeschaltet!',
  //         message: `Du hast "${achievement.name}" erhalten!`,
  //         link: '/achievements'
  //       })
  //    c) Wenn achievement.reward?.title existiert:
  //       useInventoryStore.getState().addItem({
  //         id: `title-${achievement.id}`,
  //         type: 'title',
  //         name: achievement.reward.title,
  //         description: `Belohnung für Achievement: ${achievement.name}`,
  //         rarity: achievement.rarity || 'common',
  //         source: 'achievement'
  //       })
  //    d) Activity: useActivityStore.getState().addActivity({
  //         type: 'achievement_unlocked',
  //         description: `Achievement "${achievement.name}" freigeschaltet`,
  //         metadata: { achievementId: achievement.id, title: achievement.reward?.title }
  //       })
  //
  // 6. return newlyUnlocked.map(a => a.id)

checkDailyStreak()
  // 1. const today = new Date().toISOString().split('T')[0]  // "YYYY-MM-DD"
  // 2. const { lastStreakDate } = get()
  // 3. if (lastStreakDate === today) return  // schon heute registriert
  // 4. const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  // 5. if (lastStreakDate === yesterday):
  //    → progress.daily_streak += 1
  // 6. else (lücke oder null):
  //    → progress.daily_streak = 1
  // 7. lastStreakDate = today
  // 8. checkAchievements('daily_streak')

// --- Getter ---

getProgress()
  // return get().progress

isUnlocked(achievementId)
  // return achievementId in get().unlockedAchievements

getUnlockDate(achievementId)
  // return get().unlockedAchievements[achievementId] || null

getUnlockedCount()
  // return Object.keys(get().unlockedAchievements).length

getUnlockedIds()
  // return Object.keys(get().unlockedAchievements)
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-achievements',
    partialize: (state) => ({
      progress: state.progress,
      unlockedAchievements: state.unlockedAchievements,
      lastStreakDate: state.lastStreakDate,
      categoriesPlayed: state.categoriesPlayed,
    }),
  }
)
```

---

## 6.2 Integration: `src/pages/Achievements.jsx`

```
AKTUELL:
  - import { MOCK_USER_PROGRESS } from '../data/achievementDefinitions'
  - const [userProgress, setUserProgress] = useState(MOCK_USER_PROGRESS)
  - unlockedAchievements = user?.unlockedAchievements || ['first-steps', 'first-like', 'avatar-creator']
  - getAchievementStatus() prüft gegen MOCK_USER_PROGRESS

NEU:
  1. Import hinzufügen: import { useAchievementStore } from '../stores/achievementStore'
  2. Import entfernen: MOCK_USER_PROGRESS
  3. Store-Anbindung:
     const progress = useAchievementStore(s => s.progress)
     const isUnlocked = useAchievementStore(s => s.isUnlocked)
     const getUnlockDate = useAchievementStore(s => s.getUnlockDate)
  4. useState für userProgress ENTFERNEN
  5. getAchievementStatus(achievement):
     - Prüft achievement.requirement.type gegen progress (aus Store)
     - Statt userProgress[type] → progress[type]
     - Für category-Types: progress.category_games_completed[cat] etc.
  6. Unlock-Status:
     - Statt unlockedAchievements.includes(id) → isUnlocked(id)
  7. Achievement-Titel aktivieren:
     - Statt updateUser({ activeTitle }) → inventoryStore.equipItem(`title-${achievementId}`)
```

---

## 6.3 Integration: `src/components/profile/ProfileHeader.jsx`

```
AKTUELL:
  - import { MOCK_USER_PROGRESS } from '../../data/achievementDefinitions'
  - isAchievementUnlocked() prüft gegen MOCK_USER_PROGRESS
  - Titel-Dropdown: hardcoded SHOP_TITLE_OFFERS + Achievement-Titel

NEU:
  1. Import hinzufügen: import { useAchievementStore } from '../../stores/achievementStore'
  2. Import hinzufügen: import { useInventoryStore } from '../../stores/inventoryStore'
  3. isAchievementUnlocked(id) → useAchievementStore(s => s.isUnlocked(id))
  4. Titel-Dropdown:
     - Verfügbare Titel aus useInventoryStore(s => s.getItemsByType('title'))
     - Aktiver Titel aus useInventoryStore(s => s.getEquippedTitle())
     - Titel wechseln: inventoryStore.equipItem(titleItemId)
  5. MOCK_USER_PROGRESS Import entfernen
  6. SHOP_TITLE_OFFERS Konstante entfernen (Titel kommen jetzt aus dem Inventar)
```

---

## 6.4 Integration: `src/App.jsx` (AppInitializer erweitern)

```
In der AppInitializer-Komponente (aus Step 1) hinzufügen:

  import { useAchievementStore } from './stores/achievementStore'

  useEffect(() => {
    if (user) {
      useAchievementStore.getState().checkDailyStreak()
    }
  }, [user])

HINWEIS: Dieser useEffect ist GETRENNT vom Reset-useEffect aus Step 1.
Der Daily-Streak-Check soll bei JEDEM App-Start laufen, nicht nur beim Reset.
```

---

## 6.5 Wo werden Achievement-Progress-Aufrufe gemacht?

Die folgenden Aufrufe werden in späteren Steps eingebaut, aber hier als Referenz dokumentiert:

```
achievementStore.incrementProgress('games_played')
  → Wird aufgerufen in: gameInteractionStore.recordPlay() (Step 4, nachträglich ergänzen)
  → ODER in der Page-Komponente die recordPlay aufruft

achievementStore.incrementProgress('likes_given')
  → Wird aufgerufen wenn: gameInteractionStore.toggleLike() und neuer Like (Step 4, nachträglich ergänzen)
  → ODER in GameDetail.jsx beim Like-Handler

achievementStore.setSyncedProgress('following_count', n)
  → Wird aufgerufen in: socialStore.followUser/unfollowUser (Step 5, nachträglich ergänzen)

achievementStore.setSyncedProgress('followers_count', n)
  → Wird aufgerufen in: socialStore.addFollower/removeFollower (Step 5, nachträglich ergänzen)

achievementStore.setSyncedProgress('friends_count', n)
  → Wird aufgerufen in: socialStore.acceptFriendRequest/removeFriend (Step 5, nachträglich ergänzen)

achievementStore.incrementProgress('games_created')
  → Wird aufgerufen in: GameBuilder bei Veröffentlichung (Step 8 oder eigenständig)

achievementStore.incrementProgress('avatar_customized')  // auf 1 setzen, nur einmal
  → Wird aufgerufen in: Avatar-Page bei Speicherung

achievementStore.incrementProgress('profile_complete')   // auf 1 setzen
  → Wird aufgerufen in: Profile.jsx bei Bio-/Social-Link-Speicherung

achievementStore.incrementCategoryProgress('mathematik', 'category_games_completed')
  → Wird aufgerufen beim Spielen eines Mathe-Spiels
```

### Nachrüsten in Steps 4 und 5

**Step 4 nachrüsten (gameInteractionStore / GameDetail / GamePlayer):**

In der Komponente die `recordPlay(gameId)` aufruft, NACH dem recordPlay:
```js
import { useAchievementStore } from '../stores/achievementStore'

// Nach recordPlay:
useAchievementStore.getState().incrementProgress('games_played')
useAchievementStore.getState().trackCategoryPlayed(game.subject)
useAchievementStore.getState().incrementCategoryProgress(game.subject, 'category_games_completed')
```

In GameDetail.jsx nach `toggleLike` (nur wenn neu geliked):
```js
if (!hasLiked(game.id)) {
  toggleLike(game.id)
  useAchievementStore.getState().incrementProgress('likes_given')
} else {
  toggleLike(game.id)
  // Kein Achievement-Decrement nötig (Achievements können nicht rückgängig gemacht werden)
}
```

**Step 5 nachrüsten (socialStore):**

In socialStore.js Actions, nach den Follow/Friend-Operationen:
```js
// In followUser, nach following.push:
import { useAchievementStore } from './achievementStore'
useAchievementStore.getState().setSyncedProgress('following_count', get().following.length + 1)

// In addFollower:
useAchievementStore.getState().setSyncedProgress('followers_count', get().followers.length + 1)

// In acceptFriendRequest:
useAchievementStore.getState().setSyncedProgress('friends_count', get().friends.length + 1)
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/achievementStore.js` | **NEU erstellen** |
| `src/pages/Achievements.jsx` | **ÄNDERN** — Store statt MOCK_USER_PROGRESS |
| `src/components/profile/ProfileHeader.jsx` | **ÄNDERN** — Unlock-Check + Titel aus Store |
| `src/App.jsx` | **ÄNDERN** — checkDailyStreak bei App-Start |
| `src/stores/socialStore.js` | **NACHTRÄGLICH ÄNDERN** — Achievement-Sync-Aufrufe hinzufügen |
| `src/pages/GameDetail.jsx` oder `GamePlayer.jsx` | **NACHTRÄGLICH ÄNDERN** — Achievement-Progress bei Play/Like |

## Prüfung nach Implementierung

1. Achievements-Page öffnen → Alle Achievements auf 0% Fortschritt
2. Ein Spiel spielen → "Erste Schritte" Achievement sollte automatisch unlocken
3. Toast-Popup erscheint: "Achievement: Erste Schritte"
4. Notification im Bell-Icon erscheint
5. Inventar: Titel "Anfänger" wurde hinzugefügt
6. Achievements-Page: "Erste Schritte" ist als freigeschaltet markiert mit Datum
7. Daily Streak: Nach App-Neustart wird Streak geprüft
8. Profil → Titel-Dropdown zeigt verfügbare Titel aus dem Inventar
