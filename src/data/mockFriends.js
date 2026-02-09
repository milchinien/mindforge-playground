export const mockFriends = [
  {
    id: "friend-001",
    username: "MaxGamer",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#4a3728",
      hairStyle: "short",
      eyes: "normal"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:30:00Z"
  },
  {
    id: "friend-002",
    username: "LisaLernt",
    avatar: {
      skinColor: "#d4a574",
      hairColor: "#1a1a1a",
      hairStyle: "long",
      eyes: "happy"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:25:00Z"
  },
  {
    id: "friend-003",
    username: "TomTueftler",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#c4821e",
      hairStyle: "curly",
      eyes: "normal"
    },
    isOnline: false,
    lastSeen: "2025-01-15T10:00:00Z"
  },
  {
    id: "friend-004",
    username: "SaraScience",
    avatar: {
      skinColor: "#8d5524",
      hairColor: "#1a1a1a",
      hairStyle: "ponytail",
      eyes: "cool"
    },
    isOnline: true,
    lastSeen: "2025-01-15T14:28:00Z"
  },
  {
    id: "friend-005",
    username: "JanJoker",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#b8860b",
      hairStyle: "mohawk",
      eyes: "wink"
    },
    isOnline: false,
    lastSeen: "2025-01-14T22:15:00Z"
  }
]

export function getOnlineFriends() {
  return mockFriends.filter(f => f.isOnline)
}

export function getOfflineFriends() {
  return mockFriends.filter(f => !f.isOnline)
}
