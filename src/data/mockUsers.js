export const mockUsers = [
  {
    uid: "user-001",
    username: "MindForgeTeam",
    email: "team@mindforge.com",
    createdAt: "2024-01-01",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#4a3728",
      hairStyle: "short",
      eyes: "normal"
    },
    bio: "Das offizielle MindForge Team. Wir erstellen Lernspiele fuer alle!",
    isPremium: true,
    premiumTier: "pro",
    isTeacher: false,
    totalPlays: 5200,
    gamesCreated: 3,
    followers: 342,
    following: 15,
    mindCoins: 1000,
    theme: "dark",
    activeTitle: "Gruender",
    hasSeenWelcome: true,
    socialLinks: {
      website: "https://mindforge.com",
      twitter: "",
      youtube: ""
    }
  },
  {
    uid: "user-002",
    username: "ScienceGamer",
    email: "science@example.com",
    createdAt: "2024-03-15",
    avatar: {
      skinColor: "#d4a574",
      hairColor: "#1a1a1a",
      hairStyle: "long",
      eyes: "happy"
    },
    bio: "Physik und Chemie sind meine Leidenschaft! Hier teile ich meine Simulationen.",
    isPremium: true,
    premiumTier: "basic",
    isTeacher: true,
    totalPlays: 3100,
    gamesCreated: 5,
    followers: 189,
    following: 42,
    mindCoins: 500,
    theme: "dark",
    activeTitle: "Wissenschaftler",
    hasSeenWelcome: true,
    socialLinks: {
      website: "",
      twitter: "@sciencegamer",
      youtube: ""
    }
  },
  {
    uid: "user-003",
    username: "ChemieProf",
    email: "chemie@example.com",
    createdAt: "2024-02-10",
    avatar: {
      skinColor: "#f5d0a9",
      hairColor: "#9e9e9e",
      hairStyle: "short",
      eyes: "normal"
    },
    bio: "Chemielehrer mit Leidenschaft. Ueber 50 virtuelle Experimente erstellt!",
    isPremium: true,
    premiumTier: "pro",
    isTeacher: true,
    totalPlays: 6350,
    gamesCreated: 2,
    followers: 456,
    following: 28,
    mindCoins: 800,
    theme: "dark",
    activeTitle: "Meister-Creator",
    hasSeenWelcome: true,
    socialLinks: {
      website: "",
      twitter: "",
      youtube: "@chemieprof"
    }
  }
]

export const devUser = {
  uid: "dev-user-dev",
  username: "DevAccount",
  email: "dev@mindforge.dev",
  createdAt: "2024-01-01",
  avatar: {
    skinColor: "#f5d0a9",
    hairColor: "#ff6600",
    hairStyle: "short",
    eyes: "happy"
  },
  bio: "Developer Super-Account - Voller Zugriff auf alle Features",
  isPremium: true,
  premiumTier: "dev",
  isTeacher: true,
  totalPlays: 999,
  gamesCreated: 50,
  followers: 9999,
  following: 0,
  mindCoins: 99999,
  theme: "dark",
  activeTitle: "Developer",
  hasSeenWelcome: true,
  socialLinks: {
    website: "",
    twitter: "",
    youtube: ""
  }
}

export function getUserByUsername(username) {
  const allUsers = [...mockUsers, devUser]
  return allUsers.find(u => u.username.toLowerCase() === username.toLowerCase())
}
