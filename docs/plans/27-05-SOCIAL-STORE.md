# Step 5: Social Store + Friends/Profile Integration

## Ziel

Echtes Follow/Unfollow, Freundschaftssystem und Follower-Tracking.
Ersetzt die leeren mockFriends-Arrays und die statischen user.followers/user.following Zahlen.

---

## 5.1 Neuer Store: `src/stores/socialStore.js`

**localStorage-Key:** `'mindforge-social'`

### State

```js
{
  following: [],          // string[] — User-IDs denen man folgt
  followers: [],          // string[] — User-IDs die einem folgen

  friends: [],
  // Array von:
  // {
  //   userId: string,          // User-ID des Freundes
  //   username: string,
  //   avatar: {                // { skinColor, hairColor, hairStyle, eyes }
  //     skinColor: string,
  //     hairColor: string,
  //     hairStyle: string,
  //     eyes: string
  //   },
  //   addedAt: string,         // ISO-Timestamp
  //   isOnline: boolean        // Simuliert
  // }

  friendRequests: [],
  // Array von:
  // {
  //   id: string,              // `req-${Date.now()}-${random}`
  //   fromUserId: string,
  //   fromUsername: string,
  //   fromAvatar: object,
  //   sentAt: string,          // ISO-Timestamp
  // }

  sentRequests: [],       // string[] — User-IDs an die man Anfragen gesendet hat
}
```

### Actions — Exakte Signaturen

```js
followUser(userId)
  // 1. if (get().following.includes(userId)) return
  // 2. set: following = [...following, userId]
  // 3. Simulation (kein Backend): addFollower() intern aufrufen um Gegenreaktion zu simulieren
  //    → Das simuliert dass der andere User jetzt den aktuellen User als Follower hat
  //    → In Wahrheit passiert das nur lokal (Single-User-System)

unfollowUser(userId)
  // 1. set: following = following.filter(id => id !== userId)
  // 2. Simulation: removeFollower() intern aufrufen

addFollower(userId)
  // 1. if (get().followers.includes(userId)) return
  // 2. set: followers = [...followers, userId]
  // 3. Cross-Store-Aufrufe:
  //    → notificationStore: useNotificationStore.getState().addNotification({
  //        type: 'follow',
  //        title: 'Neuer Follower!',
  //        message: `Jemand folgt dir jetzt!`,
  //        link: null
  //      })

removeFollower(userId)
  // followers = followers.filter(id => id !== userId)

sendFriendRequest(userId, username, avatar)
  // 1. if (get().sentRequests.includes(userId)) return
  // 2. if (get().friends.some(f => f.userId === userId)) return
  // 3. set: sentRequests = [...sentRequests, userId]
  // 4. Simulation: Automatisch eine eingehende Anfrage erzeugen (als ob der andere User zurückschreibt)
  //    → friendRequests = [...friendRequests, {
  //        id: `req-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
  //        fromUserId: userId,
  //        fromUsername: username,
  //        fromAvatar: avatar,
  //        sentAt: new Date().toISOString()
  //      }]
  //    → notificationStore: addNotification({ type: 'friend_request', title: 'Freundschaftsanfrage!', message: `${username} möchte dein Freund sein!`, link: '/friends' })
  //
  // HINWEIS: In einem echten System würde sendFriendRequest NUR sentRequests aktualisieren.
  //          Die Gegenseite (friendRequests) käme vom Server. Hier simulieren wir beides.

acceptFriendRequest(requestId)
  // 1. request = friendRequests.find(r => r.id === requestId)
  // 2. if (!request) return
  // 3. Neuen Freund hinzufügen:
  //    friends = [...friends, {
  //      userId: request.fromUserId,
  //      username: request.fromUsername,
  //      avatar: request.fromAvatar,
  //      addedAt: new Date().toISOString(),
  //      isOnline: Math.random() > 0.5
  //    }]
  // 4. friendRequests = friendRequests.filter(r => r.id !== requestId)
  // 5. sentRequests = sentRequests.filter(id => id !== request.fromUserId)

declineFriendRequest(requestId)
  // 1. request = friendRequests.find(r => r.id === requestId)
  // 2. friendRequests = friendRequests.filter(r => r.id !== requestId)
  // 3. if (request) sentRequests = sentRequests.filter(id => id !== request.fromUserId)

removeFriend(userId)
  // friends = friends.filter(f => f.userId !== userId)

// --- Getter ---

isFollowing(userId)
  // return get().following.includes(userId)

isFriend(userId)
  // return get().friends.some(f => f.userId === userId)

hasSentRequest(userId)
  // return get().sentRequests.includes(userId)

getFollowerCount()
  // return get().followers.length

getFollowingCount()
  // return get().following.length

getFriendCount()
  // return get().friends.length

getOnlineFriends()
  // return get().friends.filter(f => f.isOnline)

simulateOnlineStatus()
  // Für jeden Freund: isOnline = Math.random() > 0.6
  // set: friends = friends.map(f => ({ ...f, isOnline: Math.random() > 0.6 }))
```

### Persist-Config

```js
persist(
  (set, get) => ({ ... }),
  {
    name: 'mindforge-social',
    partialize: (state) => ({
      following: state.following,
      followers: state.followers,
      friends: state.friends,
      friendRequests: state.friendRequests,
      sentRequests: state.sentRequests,
      // NICHT: isOnline-Status wird bei App-Start neu simuliert
    }),
  }
)
```

### App-Start Trigger

```
In App.jsx (oder AppInitializer):
  useEffect(() => {
    useSocialStore.getState().simulateOnlineStatus()
  }, [])
```

---

## 5.2 Integration: `src/pages/Friends.jsx`

```
AKTUELL:
  - import { mockFriends, mockFriendRequests } from '../data/mockFriends'
  - const [friends, setFriends] = useState(mockFriends)          // leer
  - const [requests, setRequests] = useState(mockFriendRequests)  // leer
  - Accept/Decline: lokaler State

NEU:
  1. Import entfernen: mockFriends, mockFriendRequests
  2. Import hinzufügen: import { useSocialStore } from '../stores/socialStore'
  3. Store-Anbindung:
     const friends = useSocialStore(s => s.friends)
     const friendRequests = useSocialStore(s => s.friendRequests)
     const { acceptFriendRequest, declineFriendRequest, removeFriend, sendFriendRequest } = useSocialStore()
  4. Accept-Handler:
     const handleAccept = (requestId) => acceptFriendRequest(requestId)
  5. Decline-Handler:
     const handleDecline = (requestId) => declineFriendRequest(requestId)
  6. Remove-Handler:
     const handleRemove = (userId) => removeFriend(userId)
  7. Send-Request (AddFriendModal):
     const handleSendRequest = (userId, username, avatar) => sendFriendRequest(userId, username, avatar)
  8. Online/Offline Split:
     const online = friends.filter(f => f.isOnline)
     const offline = friends.filter(f => !f.isOnline)
  9. useState-Zeilen für friends und requests ENTFERNEN
```

---

## 5.3 Integration: `src/pages/Profile.jsx`

```
AKTUELL:
  - Follower/Following Zahlen aus user.followers / user.following (statische User-Felder)
  - Follow-Button: lokaler useState, ändert Zähler um +1/-1 ohne echte Speicherung

NEU:
  1. Import: import { useSocialStore } from '../stores/socialStore'
  2. Follower/Following Zahlen:
     Eigenes Profil:
       followers = useSocialStore(s => s.getFollowerCount())     ODER  useSocialStore(s => s.followers.length)
       following = useSocialStore(s => s.getFollowingCount())    ODER  useSocialStore(s => s.following.length)
     Anderes Profil:
       profileUser.followers / profileUser.following (bleiben statische Mock-Werte)
  3. Follow-Button auf anderem Profil:
     const isFollowing = useSocialStore(s => s.isFollowing(profileUser.uid))
     const { followUser, unfollowUser } = useSocialStore()
     onClick: isFollowing ? unfollowUser(profileUser.uid) : followUser(profileUser.uid)
  4. Lokales useState für isFollowing ENTFERNEN
```

---

## 5.4 Integration: `src/components/profile/ProfileHeader.jsx`

```
AKTUELL:
  - Stats: user.followers, user.following, user.gamesCreated, user.totalPlays
  - FollowButton: lokaler State

NEU:
  1. Import: import { useSocialStore } from '../../stores/socialStore'
  2. Für eigenes Profil (isOwnProfile === true):
     followers → useSocialStore.getState().getFollowerCount()
     following → useSocialStore.getState().getFollowingCount()
  3. Für anderes Profil:
     followers → user.followers (statisch, Mock-User)
     following → user.following (statisch, Mock-User)
  4. Follow-Button:
     isFollowing = useSocialStore(s => s.isFollowing(user.uid))
     onFollow = () => followUser(user.uid)
     onUnfollow = () => unfollowUser(user.uid)
```

---

## 5.5 Integration: `src/components/home/FriendsPreview.jsx`

```
AKTUELL:
  - Erhält mockFriends als Prop oder importiert direkt

NEU:
  1. Import: import { useSocialStore } from '../../stores/socialStore'
  2. const friends = useSocialStore(s => s.friends)
  3. Anzeige der Freunde (oder "Noch keine Freunde" wenn leer)
  4. Mock-Import entfernen
```

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/stores/socialStore.js` | **NEU erstellen** |
| `src/pages/Friends.jsx` | **ÄNDERN** — socialStore statt mockFriends, useState entfernen |
| `src/pages/Profile.jsx` | **ÄNDERN** — Follower/Following aus Store, Follow-Button über Store |
| `src/components/profile/ProfileHeader.jsx` | **ÄNDERN** — Stats aus Store für eigenes Profil |
| `src/components/home/FriendsPreview.jsx` | **ÄNDERN** — Friends aus Store |
| `src/App.jsx` | **ÄNDERN** — simulateOnlineStatus() bei Start |

## Prüfung nach Implementierung

1. Friends-Page öffnen → Leere Freundesliste (noch keine Freunde)
2. Profil eines Mock-Users besuchen → Follow-Button klicken → Follower-Count auf eigenem Profil steigt
3. Nochmal klicken → Unfollow → Count sinkt
4. Friends-Page: Freundschaftsanfrage an Mock-User senden → Request erscheint (simuliert)
5. Request annehmen → Freund erscheint in der Liste
6. Home: FriendsPreview zeigt Freunde an (oder leer wenn keine)
7. Seite neu laden → Alles gespeichert (localStorage)
8. Online-Status wechselt bei Reload (simuliert)
