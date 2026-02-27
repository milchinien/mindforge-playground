import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useActivityStore = create(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: ({ type, description, metadata = null }) => {
        const activity = {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          description,
          metadata,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 50),
        }))
      },

      getRecentActivities: (limit = 20) => get().activities.slice(0, limit),

      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'mindforge-activity',
      partialize: (state) => ({
        activities: state.activities,
      }),
    }
  )
)
