import { useCallback } from 'react'
import { addPublishedGame, removePublishedGame, mockGames } from '../data/mockGames'

export function usePublishedGames() {
  const publish = useCallback((gameData) => {
    const publishedGame = {
      ...gameData,
      status: 'published',
      publishedAt: new Date().toISOString(),
      views: 0,
      plays: 0,
      likes: 0,
      dislikes: 0,
      featured: false,
    }
    addPublishedGame(publishedGame)
    return publishedGame
  }, [])

  const unpublish = useCallback((gameId) => {
    removePublishedGame(gameId)
  }, [])

  const getMyPublished = useCallback((userId) => {
    return mockGames.filter(g => g.creatorId === userId && g.status === 'published')
  }, [])

  return { publish, unpublish, getMyPublished }
}
