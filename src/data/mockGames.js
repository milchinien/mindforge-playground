// Merge published games from localStorage at startup
function loadPublishedGames() {
  try {
    const stored = localStorage.getItem('mindforge_published_games')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const baseGames = []

// Merge published games from localStorage into the runtime array
const publishedGames = loadPublishedGames()
export const mockGames = [...baseGames, ...publishedGames]

export function addPublishedGame(game) {
  mockGames.push(game)
  const stored = loadPublishedGames()
  stored.push(game)
  localStorage.setItem('mindforge_published_games', JSON.stringify(stored))
}

export function removePublishedGame(gameId) {
  const idx = mockGames.findIndex(g => g.id === gameId)
  if (idx !== -1) mockGames.splice(idx, 1)
  const stored = loadPublishedGames().filter(g => g.id !== gameId)
  localStorage.setItem('mindforge_published_games', JSON.stringify(stored))
}

export function updatePublishedGame(gameId, updates) {
  const game = mockGames.find(g => g.id === gameId)
  if (game) Object.assign(game, updates)
  const stored = loadPublishedGames()
  const storedGame = stored.find(g => g.id === gameId)
  if (storedGame) {
    Object.assign(storedGame, updates)
    localStorage.setItem('mindforge_published_games', JSON.stringify(stored))
  }
}

// === Hilfsfunktionen ===

export function getFeaturedGames() {
  return mockGames.filter(game => game.featured)
}

export function getTrendingGames() {
  return [...mockGames].sort((a, b) => b.plays - a.plays).slice(0, 8)
}

export function getPopularGames() {
  return [...mockGames].sort((a, b) => b.likes - a.likes).slice(0, 8)
}

export function getNewGames() {
  return [...mockGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
}

export function getGamesBySubject(subject) {
  return mockGames.filter(game => game.subject === subject)
}

export function getGameById(id) {
  return mockGames.find(game => game.id === id)
}

export function getAllSubjects() {
  return [...new Set(mockGames.map(game => game.subject))]
}
