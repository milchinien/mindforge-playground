import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function createDefaultUserData() {
  return {
    activeTheme: null,
    unlockedThemes: [],
    activeFrame: null,
    unlockedFrames: [],
    detailedStats: {
      strengths: [
        { subject: 'Mathematik', score: 85 },
        { subject: 'Physik', score: 72 },
        { subject: 'Geschichte', score: 91 },
        { subject: 'Biologie', score: 68 },
        { subject: 'Deutsch', score: 78 },
        { subject: 'Informatik', score: 94 },
      ],
      streakCalendar: generateStreakCalendar(),
      subjectBreakdown: [
        { subject: 'Mathematik', percentage: 28, color: '#6366f1' },
        { subject: 'Informatik', percentage: 22, color: '#06b6d4' },
        { subject: 'Geschichte', percentage: 18, color: '#f59e0b' },
        { subject: 'Physik', percentage: 15, color: '#10b981' },
        { subject: 'Deutsch', percentage: 10, color: '#ec4899' },
        { subject: 'Biologie', percentage: 7, color: '#8b5cf6' },
      ],
      dailyTime: [
        { day: 'Mo', minutes: 45 },
        { day: 'Di', minutes: 62 },
        { day: 'Mi', minutes: 30 },
        { day: 'Do', minutes: 78 },
        { day: 'Fr', minutes: 55 },
        { day: 'Sa', minutes: 90 },
        { day: 'So', minutes: 40 },
      ],
      improvements: [
        { subject: 'Mathematik', change: 12, direction: 'up' },
        { subject: 'Physik', change: 8, direction: 'up' },
        { subject: 'Geschichte', change: 5, direction: 'up' },
        { subject: 'Biologie', change: -3, direction: 'down' },
        { subject: 'Deutsch', change: 15, direction: 'up' },
        { subject: 'Informatik', change: 2, direction: 'up' },
      ],
      totalLearningHours: 142,
      averageScore: 81,
      bestStreak: 21,
      currentStreak: 4,
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
      const activity = Math.random()
      let level = 0
      if (activity > 0.3) level = 1
      if (activity > 0.5) level = 2
      if (activity > 0.7) level = 3
      if (activity > 0.85) level = 4
      week.push({
        date: date.toISOString().split('T')[0],
        level,
      })
    }
    weeks.push(week)
  }
  return weeks
}
