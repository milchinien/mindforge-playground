import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TYPE_TO_SETTING = {
  follow: 'follows',
  friend_request: 'follows',
  achievement: 'achievements',
  quest: 'quests',
  season: 'season',
  system: 'system',
  new_game: 'events',
  event: 'events',
}

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      settings: {
        achievements: true,
        follows: true,
        events: true,
        system: true,
        quests: true,
        season: true,
      },

      addNotification: ({ type, title, message, link = null }) => {
        const settingKey = TYPE_TO_SETTING[type] || 'system'
        if (get().settings[settingKey] === false) return

        const notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          title,
          message,
          link,
          read: false,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        }))
      },

      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      deleteNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notificationId),
        })),

      clearAll: () => set({ notifications: [] }),

      updateSettings: (category, enabled) =>
        set((state) => ({
          settings: { ...state.settings, [category]: enabled },
        })),

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'mindforge-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
      }),
    }
  )
)
