import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DAILY_QUESTS,
  WEEKLY_QUESTS,
  STORY_QUESTS,
  COMMUNITY_QUESTS,
  BADGE_DEFINITIONS,
} from '../data/questData'
import { useInventoryStore } from './inventoryStore'
import { useNotificationStore } from './notificationStore'
import { useActivityStore } from './activityStore'

function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

function getNextMonday() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek)
  const next = new Date(now)
  next.setDate(next.getDate() + daysUntilMonday)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

function createDefaultUserData() {
  return {
    dailyQuests: DAILY_QUESTS,
    weeklyQuests: WEEKLY_QUESTS,
    storyProgress: STORY_QUESTS,
    communityQuests: COMMUNITY_QUESTS,
    dailyResetAt: getNextMidnight(),
    weeklyResetAt: getNextMonday(),
    unlockedBadges: BADGE_DEFINITIONS.filter(b => b.unlocked).map(b => b.id),
    selectedBadges: [],
  }
}

function getUserData(state) {
  if (!state.currentUserId) return createDefaultUserData()
  return state.userData[state.currentUserId] || createDefaultUserData()
}

// Selectors for components
export const selectDailyQuests = (s) => getUserData(s).dailyQuests
export const selectWeeklyQuests = (s) => getUserData(s).weeklyQuests
export const selectStoryProgress = (s) => getUserData(s).storyProgress
export const selectCommunityQuests = (s) => getUserData(s).communityQuests
export const selectUnlockedBadges = (s) => getUserData(s).unlockedBadges
export const selectSelectedBadges = (s) => getUserData(s).selectedBadges
export const selectDailyResetAt = (s) => getUserData(s).dailyResetAt
export const selectWeeklyResetAt = (s) => getUserData(s).weeklyResetAt

export const useQuestStore = create(
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

      completeQuest: (questId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)

          const dailyIdx = ud.dailyQuests.findIndex(q => q.id === questId)
          if (dailyIdx !== -1) {
            const updated = [...ud.dailyQuests]
            updated[dailyIdx] = { ...updated[dailyIdx], status: 'completed', current: updated[dailyIdx].target }
            return { userData: { ...state.userData, [currentUserId]: { ...ud, dailyQuests: updated } } }
          }

          const weeklyIdx = ud.weeklyQuests.findIndex(q => q.id === questId)
          if (weeklyIdx !== -1) {
            const updated = [...ud.weeklyQuests]
            updated[weeklyIdx] = { ...updated[weeklyIdx], status: 'completed', current: updated[weeklyIdx].target }
            return { userData: { ...state.userData, [currentUserId]: { ...ud, weeklyQuests: updated } } }
          }

          const chapterIdx = ud.storyProgress.chapters.findIndex(c => c.id === questId)
          if (chapterIdx !== -1) {
            const updatedChapters = [...ud.storyProgress.chapters]
            updatedChapters[chapterIdx] = {
              ...updatedChapters[chapterIdx],
              status: 'completed',
              current: updatedChapters[chapterIdx].target,
            }
            return {
              userData: {
                ...state.userData,
                [currentUserId]: { ...ud, storyProgress: { ...ud.storyProgress, chapters: updatedChapters } },
              },
            }
          }

          return {}
        })
      },

      claimQuestReward: (questId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)

          const dailyIdx = ud.dailyQuests.findIndex(q => q.id === questId)
          if (dailyIdx !== -1 && ud.dailyQuests[dailyIdx].status === 'completed') {
            const updated = [...ud.dailyQuests]
            updated[dailyIdx] = { ...updated[dailyIdx], status: 'claimed' }
            return { userData: { ...state.userData, [currentUserId]: { ...ud, dailyQuests: updated } } }
          }

          const weeklyIdx = ud.weeklyQuests.findIndex(q => q.id === questId)
          if (weeklyIdx !== -1 && ud.weeklyQuests[weeklyIdx].status === 'completed') {
            const updated = [...ud.weeklyQuests]
            updated[weeklyIdx] = { ...updated[weeklyIdx], status: 'claimed' }
            return { userData: { ...state.userData, [currentUserId]: { ...ud, weeklyQuests: updated } } }
          }

          const chapterIdx = ud.storyProgress.chapters.findIndex(c => c.id === questId)
          if (chapterIdx !== -1 && ud.storyProgress.chapters[chapterIdx].status === 'completed') {
            const updatedChapters = [...ud.storyProgress.chapters]
            updatedChapters[chapterIdx] = { ...updatedChapters[chapterIdx], status: 'claimed' }
            if (chapterIdx + 1 < updatedChapters.length && updatedChapters[chapterIdx + 1].status === 'locked') {
              updatedChapters[chapterIdx + 1] = { ...updatedChapters[chapterIdx + 1], status: 'active' }
            }
            return {
              userData: {
                ...state.userData,
                [currentUserId]: { ...ud, storyProgress: { ...ud.storyProgress, chapters: updatedChapters } },
              },
            }
          }

          const communityIdx = ud.communityQuests.findIndex(q => q.id === questId)
          if (communityIdx !== -1 && ud.communityQuests[communityIdx].status === 'completed') {
            const updated = [...ud.communityQuests]
            updated[communityIdx] = { ...updated[communityIdx], status: 'claimed' }
            return { userData: { ...state.userData, [currentUserId]: { ...ud, communityQuests: updated } } }
          }

          return {}
        })

        // Cross-store side effects
        const ud = getUserData(get())
        const quest =
          ud.dailyQuests.find(q => q.id === questId) ||
          ud.weeklyQuests.find(q => q.id === questId) ||
          ud.storyProgress?.chapters?.find(c => c.id === questId) ||
          ud.communityQuests.find(q => q.id === questId)

        if (!quest) return

        if (quest.cosmeticReward) {
          const rewardType = quest.cosmeticReward.toLowerCase().includes('rahmen') ? 'frame'
            : quest.cosmeticReward.toLowerCase().includes('titel') ? 'title'
            : 'badge'

          useInventoryStore.getState()?.addItem?.({
            id: `quest-reward-${questId}`,
            type: rewardType,
            name: quest.cosmeticReward,
            description: `Belohnung fuer Quest: ${quest.title}`,
            rarity: 'rare',
            source: 'quest',
          })
        }

        useNotificationStore.getState()?.addNotification?.({
          type: 'quest',
          title: 'Quest abgeschlossen!',
          message: `Du hast "${quest.title}" abgeschlossen${quest.xpReward ? ` und ${quest.xpReward} XP erhalten` : ''}!`,
          link: '/quests',
        })

        useActivityStore.getState()?.addActivity?.({
          type: 'quest_completed',
          description: `Quest "${quest.title}" abgeschlossen`,
          metadata: { questId, xpReward: quest.xpReward || 0 },
        })
      },

      selectBadge: (badgeId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          const { selectedBadges, unlockedBadges } = ud
          if (!unlockedBadges.includes(badgeId)) return {}

          if (selectedBadges.includes(badgeId)) {
            return {
              userData: {
                ...state.userData,
                [currentUserId]: { ...ud, selectedBadges: selectedBadges.filter(id => id !== badgeId) },
              },
            }
          }
          if (selectedBadges.length >= 5) {
            return {
              userData: {
                ...state.userData,
                [currentUserId]: { ...ud, selectedBadges: [...selectedBadges.slice(1), badgeId] },
              },
            }
          }
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, selectedBadges: [...selectedBadges, badgeId] },
            },
          }
        })
      },

      unlockBadge: (badgeId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          if (ud.unlockedBadges.includes(badgeId)) return {}
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, unlockedBadges: [...ud.unlockedBadges, badgeId] },
            },
          }
        })
      },

      checkResets: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const now = Date.now()
        const ud = getUserData(get())

        if (now >= ud.dailyResetAt) {
          set((state) => {
            const currentUd = getUserData(state)
            return {
              userData: {
                ...state.userData,
                [currentUserId]: {
                  ...currentUd,
                  dailyQuests: DAILY_QUESTS.map(q => ({ ...q, current: 0, status: 'active' })),
                  dailyResetAt: getNextMidnight(),
                },
              },
            }
          })
        }

        if (now >= ud.weeklyResetAt) {
          set((state) => {
            const currentUd = getUserData(state)
            return {
              userData: {
                ...state.userData,
                [currentUserId]: {
                  ...currentUd,
                  weeklyQuests: WEEKLY_QUESTS.map(q => ({ ...q, current: 0, status: 'active' })),
                  weeklyResetAt: getNextMonday(),
                },
              },
            }
          })
        }
      },

    }),
    {
      name: 'mindforge-quests',
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
)
