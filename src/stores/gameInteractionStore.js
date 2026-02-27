import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockGames } from '../data/mockGames'

const DEFAULT_STATS = { likes: 0, dislikes: 0, views: 0, plays: 0, avgRating: 0, ratingCount: 0 }

function buildInitialGlobalStats() {
  const stats = {}
  for (const game of mockGames) {
    stats[game.id] = {
      likes: game.likes || 0,
      dislikes: game.dislikes || 0,
      views: game.views || 0,
      plays: game.plays || 0,
      avgRating: 0,
      ratingCount: 0,
    }
  }
  return stats
}

function ensureStats(globalStats, gameId) {
  if (!globalStats[gameId]) globalStats[gameId] = { ...DEFAULT_STATS }
  return globalStats[gameId]
}

export const useGameInteractionStore = create(
  persist(
    (set, get) => ({
      likes: {},
      dislikes: {},
      plays: {},
      ratings: {},
      viewedThisSession: {},
      globalStats: buildInitialGlobalStats(),

      toggleLike: (gameId) => {
        if (!gameId) return
        const { likes, dislikes, globalStats } = get()
        const wasLiked = likes[gameId] === true
        const wasDisliked = dislikes[gameId] === true
        const stats = ensureStats(globalStats, gameId)

        const newLikes = { ...likes }
        const newDislikes = { ...dislikes }
        const newStats = { ...globalStats, [gameId]: { ...stats } }

        if (wasLiked) {
          newLikes[gameId] = false
          newStats[gameId].likes = Math.max(0, stats.likes - 1)
        } else {
          newLikes[gameId] = true
          newStats[gameId].likes = stats.likes + 1
          if (wasDisliked) {
            newDislikes[gameId] = false
            newStats[gameId].dislikes = Math.max(0, stats.dislikes - 1)
          }
        }

        set({ likes: newLikes, dislikes: newDislikes, globalStats: newStats })
        return !wasLiked // returns true if this was a new like
      },

      toggleDislike: (gameId) => {
        if (!gameId) return
        const { likes, dislikes, globalStats } = get()
        const wasDisliked = dislikes[gameId] === true
        const wasLiked = likes[gameId] === true
        const stats = ensureStats(globalStats, gameId)

        const newLikes = { ...likes }
        const newDislikes = { ...dislikes }
        const newStats = { ...globalStats, [gameId]: { ...stats } }

        if (wasDisliked) {
          newDislikes[gameId] = false
          newStats[gameId].dislikes = Math.max(0, stats.dislikes - 1)
        } else {
          newDislikes[gameId] = true
          newStats[gameId].dislikes = stats.dislikes + 1
          if (wasLiked) {
            newLikes[gameId] = false
            newStats[gameId].likes = Math.max(0, stats.likes - 1)
          }
        }

        set({ likes: newLikes, dislikes: newDislikes, globalStats: newStats })
      },

      recordView: (gameId) => {
        if (!gameId) return
        if (get().viewedThisSession[gameId]) return
        const { globalStats } = get()
        const stats = ensureStats(globalStats, gameId)

        set({
          viewedThisSession: { ...get().viewedThisSession, [gameId]: true },
          globalStats: { ...globalStats, [gameId]: { ...stats, views: stats.views + 1 } },
        })
      },

      recordPlay: (gameId) => {
        if (!gameId) return
        const { plays, globalStats } = get()
        const stats = ensureStats(globalStats, gameId)

        set({
          plays: { ...plays, [gameId]: (plays[gameId] || 0) + 1 },
          globalStats: { ...globalStats, [gameId]: { ...stats, plays: stats.plays + 1 } },
        })
      },

      setRating: (gameId, rating) => {
        if (!gameId) return
        const { ratings, globalStats } = get()
        const oldRating = ratings[gameId] || 0
        const stats = ensureStats(globalStats, gameId)
        const newStats = { ...stats }

        if (oldRating === 0) {
          newStats.ratingCount = stats.ratingCount + 1
          newStats.avgRating = ((stats.avgRating * (newStats.ratingCount - 1)) + rating) / newStats.ratingCount
        } else {
          newStats.avgRating = ((stats.avgRating * stats.ratingCount) - oldRating + rating) / stats.ratingCount
        }

        set({
          ratings: { ...ratings, [gameId]: rating },
          globalStats: { ...globalStats, [gameId]: newStats },
        })
      },

      getGameStats: (gameId) => get().globalStats[gameId] || { ...DEFAULT_STATS },

      hasLiked: (gameId) => get().likes[gameId] === true,

      hasDisliked: (gameId) => get().dislikes[gameId] === true,

      getUserRating: (gameId) => get().ratings[gameId] || 0,

      getTotalUserPlays: () => Object.values(get().plays).reduce((sum, p) => sum + p, 0),

      deleteGameStats: (gameId) => {
        const { likes, dislikes, plays, ratings, globalStats } = get()
        const newLikes = { ...likes }; delete newLikes[gameId]
        const newDislikes = { ...dislikes }; delete newDislikes[gameId]
        const newPlays = { ...plays }; delete newPlays[gameId]
        const newRatings = { ...ratings }; delete newRatings[gameId]
        const newGlobalStats = { ...globalStats }; delete newGlobalStats[gameId]
        set({ likes: newLikes, dislikes: newDislikes, plays: newPlays, ratings: newRatings, globalStats: newGlobalStats })
      },
    }),
    {
      name: 'mindforge-game-interactions',
      partialize: (state) => ({
        likes: state.likes,
        dislikes: state.dislikes,
        plays: state.plays,
        ratings: state.ratings,
        globalStats: state.globalStats,
      }),
    }
  )
)
