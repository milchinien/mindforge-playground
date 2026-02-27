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

// Helper: get next midnight timestamp
function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

// Helper: get next Monday midnight timestamp
function getNextMonday() {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun, 1=Mon...
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek)
  const next = new Date(now)
  next.setDate(next.getDate() + daysUntilMonday)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

export const useQuestStore = create(
  persist(
    (set, get) => ({
      // --- Quest State ---
      dailyQuests: DAILY_QUESTS,
      weeklyQuests: WEEKLY_QUESTS,
      storyProgress: STORY_QUESTS,
      communityQuests: COMMUNITY_QUESTS,

      // --- Reset Timestamps ---
      dailyResetAt: getNextMidnight(),
      weeklyResetAt: getNextMonday(),

      // --- Badge State ---
      unlockedBadges: BADGE_DEFINITIONS.filter(b => b.unlocked).map(b => b.id),
      selectedBadges: ['badge-beta-tester', 'badge-first-steps', 'badge-streak-7'],

      // --- Actions ---

      // Complete a quest (set status to "completed")
      completeQuest: (questId) => {
        set((state) => {
          // Check daily quests
          const dailyIdx = state.dailyQuests.findIndex(q => q.id === questId)
          if (dailyIdx !== -1) {
            const updated = [...state.dailyQuests]
            updated[dailyIdx] = { ...updated[dailyIdx], status: 'completed', current: updated[dailyIdx].target }
            return { dailyQuests: updated }
          }

          // Check weekly quests
          const weeklyIdx = state.weeklyQuests.findIndex(q => q.id === questId)
          if (weeklyIdx !== -1) {
            const updated = [...state.weeklyQuests]
            updated[weeklyIdx] = { ...updated[weeklyIdx], status: 'completed', current: updated[weeklyIdx].target }
            return { weeklyQuests: updated }
          }

          // Check story chapters
          const chapterIdx = state.storyProgress.chapters.findIndex(c => c.id === questId)
          if (chapterIdx !== -1) {
            const updatedChapters = [...state.storyProgress.chapters]
            updatedChapters[chapterIdx] = {
              ...updatedChapters[chapterIdx],
              status: 'completed',
              current: updatedChapters[chapterIdx].target,
            }
            return {
              storyProgress: { ...state.storyProgress, chapters: updatedChapters },
            }
          }

          return {}
        })
      },

      // Claim a quest reward (set status to "claimed")
      claimQuestReward: (questId) => {
        set((state) => {
          // Check daily quests
          const dailyIdx = state.dailyQuests.findIndex(q => q.id === questId)
          if (dailyIdx !== -1 && state.dailyQuests[dailyIdx].status === 'completed') {
            const updated = [...state.dailyQuests]
            updated[dailyIdx] = { ...updated[dailyIdx], status: 'claimed' }
            return { dailyQuests: updated }
          }

          // Check weekly quests
          const weeklyIdx = state.weeklyQuests.findIndex(q => q.id === questId)
          if (weeklyIdx !== -1 && state.weeklyQuests[weeklyIdx].status === 'completed') {
            const updated = [...state.weeklyQuests]
            updated[weeklyIdx] = { ...updated[weeklyIdx], status: 'claimed' }
            return { weeklyQuests: updated }
          }

          // Check story chapters
          const chapterIdx = state.storyProgress.chapters.findIndex(c => c.id === questId)
          if (chapterIdx !== -1 && state.storyProgress.chapters[chapterIdx].status === 'completed') {
            const updatedChapters = [...state.storyProgress.chapters]
            updatedChapters[chapterIdx] = { ...updatedChapters[chapterIdx], status: 'claimed' }
            // Unlock next chapter if exists
            if (chapterIdx + 1 < updatedChapters.length && updatedChapters[chapterIdx + 1].status === 'locked') {
              updatedChapters[chapterIdx + 1] = { ...updatedChapters[chapterIdx + 1], status: 'active' }
            }
            return {
              storyProgress: { ...state.storyProgress, chapters: updatedChapters },
            }
          }

          // Check community quests
          const communityIdx = state.communityQuests.findIndex(q => q.id === questId)
          if (communityIdx !== -1 && state.communityQuests[communityIdx].status === 'completed') {
            const updated = [...state.communityQuests]
            updated[communityIdx] = { ...updated[communityIdx], status: 'claimed' }
            return { communityQuests: updated }
          }

          return {}
        })

        // Cross-store side effects
        const state = get()
        const quest =
          state.dailyQuests.find(q => q.id === questId) ||
          state.weeklyQuests.find(q => q.id === questId) ||
          state.storyProgress?.chapters?.find(c => c.id === questId) ||
          state.communityQuests.find(q => q.id === questId)

        if (!quest) return

        // Cosmetic reward to inventory
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

        // Notification
        useNotificationStore.getState()?.addNotification?.({
          type: 'quest',
          title: 'Quest abgeschlossen!',
          message: `Du hast "${quest.title}" abgeschlossen${quest.xpReward ? ` und ${quest.xpReward} XP erhalten` : ''}!`,
          link: '/quests',
        })

        // Activity log
        useActivityStore.getState()?.addActivity?.({
          type: 'quest_completed',
          description: `Quest "${quest.title}" abgeschlossen`,
          metadata: { questId, xpReward: quest.xpReward || 0 },
        })
      },

      // Select/deselect badge for profile showcase (max 5)
      selectBadge: (badgeId) => {
        set((state) => {
          const { selectedBadges, unlockedBadges } = state
          // Only allow selecting unlocked badges
          if (!unlockedBadges.includes(badgeId)) return {}

          if (selectedBadges.includes(badgeId)) {
            // Deselect
            return { selectedBadges: selectedBadges.filter(id => id !== badgeId) }
          }
          if (selectedBadges.length >= 5) {
            // Replace oldest (first) selection
            return { selectedBadges: [...selectedBadges.slice(1), badgeId] }
          }
          return { selectedBadges: [...selectedBadges, badgeId] }
        })
      },

      // Unlock a badge
      unlockBadge: (badgeId) => {
        set((state) => {
          if (state.unlockedBadges.includes(badgeId)) return {}
          return { unlockedBadges: [...state.unlockedBadges, badgeId] }
        })
      },

      // Check and reset daily/weekly quests if expired
      checkResets: () => {
        const now = Date.now()
        const state = get()

        if (now >= state.dailyResetAt) {
          set({
            dailyQuests: DAILY_QUESTS.map(q => ({ ...q, current: 0, status: 'active' })),
            dailyResetAt: getNextMidnight(),
          })
        }

        if (now >= state.weeklyResetAt) {
          set({
            weeklyQuests: WEEKLY_QUESTS.map(q => ({ ...q, current: 0, status: 'active' })),
            weeklyResetAt: getNextMonday(),
          })
        }
      },
    }),
    {
      name: 'mindforge-quests',
      partialize: (state) => ({
        dailyQuests: state.dailyQuests,
        weeklyQuests: state.weeklyQuests,
        storyProgress: state.storyProgress,
        communityQuests: state.communityQuests,
        dailyResetAt: state.dailyResetAt,
        weeklyResetAt: state.weeklyResetAt,
        unlockedBadges: state.unlockedBadges,
        selectedBadges: state.selectedBadges,
      }),
    }
  )
)
