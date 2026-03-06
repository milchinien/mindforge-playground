import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const EMPTY_ARR = []

function getUserActivities(state) {
  if (!state.currentUserId) return EMPTY_ARR
  return state.userActivities[state.currentUserId] || EMPTY_ARR
}

export const useActivityStore = create(
  persist(
    (set, get) => ({
      userActivities: {},
      currentUserId: null,

      setCurrentUser: (userId) => {
        set((state) => {
          if (userId && !state.userActivities[userId]) {
            return {
              currentUserId: userId,
              userActivities: { ...state.userActivities, [userId]: [] },
            }
          }
          return { currentUserId: userId }
        })
      },

      addActivity: ({ type, description, metadata = null }) => {
        const { currentUserId } = get()
        if (!currentUserId) return

        const activity = {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          description,
          metadata,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          userActivities: {
            ...state.userActivities,
            [currentUserId]: [activity, ...getUserActivities(state)].slice(0, 50),
          },
        }))
      },

      getRecentActivities: (limit = 20) => getUserActivities(get()).slice(0, limit),

      clearActivities: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => ({
          userActivities: { ...state.userActivities, [currentUserId]: [] },
        }))
      },
    }),
    {
      name: 'mindforge-activity',
      partialize: (state) => ({
        userActivities: state.userActivities,
      }),
    }
  )
)
