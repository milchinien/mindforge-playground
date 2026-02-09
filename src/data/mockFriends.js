export const mockFriends = [
  {
    id: 'friend-1',
    friendshipId: 'fs-1',
    uid: 'user-101',
    username: 'MaxGamer',
    displayName: 'Max Gamer',
    avatar: {
      skinColor: '#f5d0a9',
      hairColor: '#4a3728',
      hairStyle: 'short',
      eyes: 'normal',
    },
    isOnline: true,
    activity: 'Spielt: Mathe-Quiz Pro',
    lastOnline: null,
  },
  {
    id: 'friend-2',
    friendshipId: 'fs-2',
    uid: 'user-102',
    username: 'AnnaCreator',
    displayName: 'Anna Creator',
    avatar: {
      skinColor: '#d4a574',
      hairColor: '#1a1a1a',
      hairStyle: 'long',
      eyes: 'happy',
    },
    isOnline: true,
    activity: 'Erstellt gerade ein Spiel',
    lastOnline: null,
  },
  {
    id: 'friend-3',
    friendshipId: 'fs-3',
    uid: 'user-103',
    username: 'PhysikFan',
    displayName: 'Physik Fan',
    avatar: {
      skinColor: '#f5d0a9',
      hairColor: '#c4821e',
      hairStyle: 'curly',
      eyes: 'normal',
    },
    isOnline: true,
    activity: 'Im Mindbrowser',
    lastOnline: null,
  },
  {
    id: 'friend-4',
    friendshipId: 'fs-4',
    uid: 'user-104',
    username: 'ProLearner99',
    displayName: 'Pro Learner',
    avatar: {
      skinColor: '#8d5524',
      hairColor: '#1a1a1a',
      hairStyle: 'ponytail',
      eyes: 'cool',
    },
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'friend-5',
    friendshipId: 'fs-5',
    uid: 'user-105',
    username: 'QuizKoenig',
    displayName: 'Quiz Koenig',
    avatar: {
      skinColor: '#f5d0a9',
      hairColor: '#b8860b',
      hairStyle: 'mohawk',
      eyes: 'wink',
    },
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'friend-6',
    friendshipId: 'fs-6',
    uid: 'user-106',
    username: 'CodeNinja',
    displayName: 'Code Ninja',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'friend-7',
    friendshipId: 'fs-7',
    uid: 'user-107',
    username: 'LernMaschine',
    displayName: 'Lern Maschine',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'friend-8',
    friendshipId: 'fs-8',
    uid: 'user-108',
    username: 'MatheMeister',
    displayName: 'Mathe Meister',
    avatar: null,
    isOnline: false,
    activity: null,
    lastOnline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

export const mockFriendRequests = [
  {
    id: 'request-1',
    friendshipId: 'fs-pending-1',
    uid: 'user-201',
    username: 'LernHeld42',
    displayName: 'Lern Held',
    avatar: null,
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'request-2',
    friendshipId: 'fs-pending-2',
    uid: 'user-202',
    username: 'BioExpertin',
    displayName: 'Bio Expertin',
    avatar: null,
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export function getOnlineFriends() {
  return mockFriends.filter(f => f.isOnline)
}

export function getOfflineFriends() {
  return mockFriends.filter(f => !f.isOnline)
}
