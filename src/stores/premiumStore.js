import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createDefaultUserData() {
  return {
    activeTheme: null,
    unlockedThemes: [],
    activeFrame: null,
    unlockedFrames: [],
    detailedStats: {
      strengths: [],
      streakCalendar: generateStreakCalendar(),
      subjectBreakdown: [],
      dailyTime: [
        { day: 'Mo', minutes: 0 },
        { day: 'Di', minutes: 0 },
        { day: 'Mi', minutes: 0 },
        { day: 'Do', minutes: 0 },
        { day: 'Fr', minutes: 0 },
        { day: 'Sa', minutes: 0 },
        { day: 'So', minutes: 0 },
      ],
      improvements: [],
      totalLearningHours: 0,
      averageScore: 0,
      bestStreak: 0,
      currentStreak: 0,
    },
    giftHistory: [],
  }
}

function getUserData(state) {
  if (!state.currentUserId) return createDefaultUserData()
  return state.userData[state.currentUserId] || createDefaultUserData()
}

// Selectors for components
export const selectActiveTheme = (s) => getUserData(s).activeTheme
export const selectUnlockedThemes = (s) => getUserData(s).unlockedThemes
export const selectActiveFrame = (s) => getUserData(s).activeFrame
export const selectUnlockedFrames = (s) => getUserData(s).unlockedFrames
export const selectDetailedStats = (s) => getUserData(s).detailedStats
export const selectGiftHistory = (s) => getUserData(s).giftHistory

export const usePremiumStore = create(
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

      setTheme: (themeId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: { ...state.userData, [currentUserId]: { ...ud, activeTheme: themeId } },
          }
        })
      },

      unlockTheme: (themeId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          if (ud.unlockedThemes.includes(themeId)) return {}
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, unlockedThemes: [...ud.unlockedThemes, themeId] },
            },
          }
        })
      },

      setFrame: (frameId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: { ...state.userData, [currentUserId]: { ...ud, activeFrame: frameId } },
          }
        })
      },

      unlockFrame: (frameId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          if (ud.unlockedFrames.includes(frameId)) return {}
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, unlockedFrames: [...ud.unlockedFrames, frameId] },
            },
          }
        })
      },

      addGiftRecord: (gift) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, giftHistory: [gift, ...ud.giftHistory] },
            },
          }
        })
      },

    }),
    {
      name: 'mindforge-premium',
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
)

function generateStreakCalendar() {
  const weeks = []
  const today = new Date()
  for (let w = 11; w >= 0; w--) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      week.push({
        date: date.toISOString().split('T')[0],
        level: 0,
      })
    }
    weeks.push(week)
  }
  return weeks
}
