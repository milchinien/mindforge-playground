export const mockUsers = []

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
  totalPlays: 0,
  gamesCreated: 0,
  followers: 0,
  following: 0,
  mindCoins: 0,
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
