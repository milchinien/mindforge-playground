import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockGames } from '../data/mockGames'

const DEFAULT_STATS = { likes: 0, dislikes: 0, views: 0, plays: 0 }

function buildInitialGlobalStats() {
  const stats = {}
  for (const game of mockGames) {
    stats[game.id] = {
      likes: game.likes || 0,
      dislikes: game.dislikes || 0,
      views: game.views || 0,
      plays: game.plays || 0,
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
      // Per-user likes/dislikes: { [userId]: { [gameId]: true/false } }
      userLikes: {},
      userDislikes: {},

      // Play counts (global)
      plays: {},
      viewedThisSession: {},

      // Global stats (shared across users)
      globalStats: buildInitialGlobalStats(),

      // Current user ID
      currentUserId: null,

      setCurrentUser: (userId) => {
        set({ currentUserId: userId })
      },

      toggleLike: (gameId) => {
        if (!gameId) return
        const { currentUserId, userLikes, userDislikes, globalStats } = get()
        if (!currentUserId) return

        const myLikes = userLikes[currentUserId] || {}
        const myDislikes = userDislikes[currentUserId] || {}
        const wasLiked = myLikes[gameId] === true
        const wasDisliked = myDislikes[gameId] === true
        const stats = ensureStats(globalStats, gameId)

        const newMyLikes = { ...myLikes }
        const newMyDislikes = { ...myDislikes }
        const newStats = { ...globalStats, [gameId]: { ...stats } }

        if (wasLiked) {
          newMyLikes[gameId] = false
          newStats[gameId].likes = Math.max(0, stats.likes - 1)
        } else {
          newMyLikes[gameId] = true
          newStats[gameId].likes = stats.likes + 1
          if (wasDisliked) {
            newMyDislikes[gameId] = false
            newStats[gameId].dislikes = Math.max(0, stats.dislikes - 1)
          }
        }

        set({
          userLikes: { ...userLikes, [currentUserId]: newMyLikes },
          userDislikes: { ...userDislikes, [currentUserId]: newMyDislikes },
          globalStats: newStats,
        })
        return !wasLiked
      },

      toggleDislike: (gameId) => {
        if (!gameId) return
        const { currentUserId, userLikes, userDislikes, globalStats } = get()
        if (!currentUserId) return

        const myLikes = userLikes[currentUserId] || {}
        const myDislikes = userDislikes[currentUserId] || {}
        const wasDisliked = myDislikes[gameId] === true
        const wasLiked = myLikes[gameId] === true
        const stats = ensureStats(globalStats, gameId)

        const newMyLikes = { ...myLikes }
        const newMyDislikes = { ...myDislikes }
        const newStats = { ...globalStats, [gameId]: { ...stats } }

        if (wasDisliked) {
          newMyDislikes[gameId] = false
          newStats[gameId].dislikes = Math.max(0, stats.dislikes - 1)
        } else {
          newMyDislikes[gameId] = true
          newStats[gameId].dislikes = stats.dislikes + 1
          if (wasLiked) {
            newMyLikes[gameId] = false
            newStats[gameId].likes = Math.max(0, stats.likes - 1)
          }
        }

        set({
          userLikes: { ...userLikes, [currentUserId]: newMyLikes },
          userDislikes: { ...userDislikes, [currentUserId]: newMyDislikes },
          globalStats: newStats,
        })
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

      getGameStats: (gameId) => get().globalStats[gameId] || { ...DEFAULT_STATS },

      hasLiked: (gameId) => {
        const s = get()
        if (!s.currentUserId) return false
        return (s.userLikes[s.currentUserId] || {})[gameId] === true
      },

      hasDisliked: (gameId) => {
        const s = get()
        if (!s.currentUserId) return false
        return (s.userDislikes[s.currentUserId] || {})[gameId] === true
      },

      getTotalUserPlays: () => Object.values(get().plays).reduce((sum, p) => sum + p, 0),

      deleteGameStats: (gameId) => {
        const { plays, globalStats } = get()
        const newPlays = { ...plays }; delete newPlays[gameId]
        const newGlobalStats = { ...globalStats }; delete newGlobalStats[gameId]
        set({ plays: newPlays, globalStats: newGlobalStats })
      },
    }),
    {
      name: 'mindforge-game-interactions-v2',
      partialize: (state) => ({
        userLikes: state.userLikes,
        userDislikes: state.userDislikes,
        plays: state.plays,
        globalStats: state.globalStats,
      }),
    }
  )
)
