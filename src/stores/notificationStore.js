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
  chat_message: 'chat',
  friend_activity: 'friends',
}

const DEFAULT_SETTINGS = {
  achievements: true,
  follows: true,
  events: true,
  system: true,
  quests: true,
  season: true,
  chat: true,
  friends: true,
}

const EMPTY_ARR = []

function createDefaultUserData() {
  return { notifications: [], settings: { ...DEFAULT_SETTINGS } }
}

function getUserData(state) {
  if (!state.currentUserId) return createDefaultUserData()
  return state.userData[state.currentUserId] || createDefaultUserData()
}

// Selectors for components
export const selectNotifications = (s) => getUserData(s).notifications
export const selectNotifSettings = (s) => getUserData(s).settings

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      userData: {},
      currentUserId: null,

      setCurrentUser: (userId) => {
        set((state) => {
          if (userId && !state.userData[userId]) {
            return {
              currentUserId: userId,
              userData: { ...state.userData, [userId]: createDefaultUserData() },
            }
          }
          return { currentUserId: userId }
        })
      },

      addNotification: ({ type, title, message, link = null }) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const ud = getUserData(get())
        const settingKey = TYPE_TO_SETTING[type] || 'system'
        if (ud.settings[settingKey] === false) return

        const notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          title,
          message,
          link,
          read: false,
          createdAt: new Date().toISOString(),
        }

        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                notifications: [notification, ...currentUd.notifications].slice(0, 50),
              },
            },
          }
        })
      },

      markAsRead: (notificationId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                notifications: currentUd.notifications.map((n) =>
                  n.id === notificationId ? { ...n, read: true } : n
                ),
              },
            },
          }
        })
      },

      markAllAsRead: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                notifications: currentUd.notifications.map((n) => ({ ...n, read: true })),
              },
            },
          }
        })
      },

      deleteNotification: (notificationId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                notifications: currentUd.notifications.filter((n) => n.id !== notificationId),
              },
            },
          }
        })
      },

      clearAll: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...currentUd, notifications: [] },
            },
          }
        })
      },

      updateSettings: (category, enabled) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const currentUd = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...currentUd,
                settings: { ...currentUd.settings, [category]: enabled },
              },
            },
          }
        })
      },

      getUnreadCount: () => getUserData(get()).notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'mindforge-notifications',
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
)
