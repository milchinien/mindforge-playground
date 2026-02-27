import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ALL_ACHIEVEMENTS } from '../data/achievementDefinitions'
import { useToastStore } from './toastStore'
import { useNotificationStore } from './notificationStore'
import { useInventoryStore } from './inventoryStore'
import { useActivityStore } from './activityStore'

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      progress: {
        games_played: 0,
        games_completed: 0,
        daily_streak: 0,
        likes_given: 0,
        total_playtime_minutes: 0,
        following_count: 0,
        followers_count: 0,
        friends_count: 0,
        avatar_customized: 0,
        profile_complete: 0,
        events_participated: 0,
        events_completed: 0,
        games_created: 0,
        total_likes_received: 0,
        total_plays_received: 0,
        game_approval_rate: 0,
        assets_sold: 0,
        is_premium: 0,
        unique_categories_played: 0,
        category_games_completed: {
          mathematik: 0, physik: 0, chemie: 0, biologie: 0,
          geschichte: 0, sprachen: 0, informatik: 0, musik: 0,
        },
        category_perfect_scores: {
          mathematik: 0, physik: 0,
        },
      },

      unlockedAchievements: {},
      lastStreakDate: null,
      categoriesPlayed: [],

      incrementProgress: (field, amount = 1) => {
        if (typeof get().progress[field] !== 'number') return
        set((state) => ({
          progress: { ...state.progress, [field]: state.progress[field] + amount },
        }))
        get().checkAchievements(field)
      },

      incrementCategoryProgress: (category, field, amount = 1) => {
        const fieldObj = get().progress[field]
        if (!fieldObj || typeof fieldObj[category] !== 'number') return
        set((state) => ({
          progress: {
            ...state.progress,
            [field]: { ...state.progress[field], [category]: state.progress[field][category] + amount },
          },
        }))
        get().checkAchievements(field)
      },

      setSyncedProgress: (field, value) => {
        set((state) => ({
          progress: { ...state.progress, [field]: value },
        }))
        get().checkAchievements(field)
      },

      trackCategoryPlayed: (category) => {
        if (!category) return
        if (get().categoriesPlayed.includes(category)) return
        const newCategories = [...get().categoriesPlayed, category]
        set((state) => ({
          categoriesPlayed: newCategories,
          progress: { ...state.progress, unique_categories_played: newCategories.length },
        }))
        get().checkAchievements('unique_categories_played')
      },

      checkAchievements: (changedField = null) => {
        const { progress, unlockedAchievements } = get()
        const newlyUnlocked = []
        const updatedUnlocked = { ...unlockedAchievements }

        for (const achievement of ALL_ACHIEVEMENTS) {
          if (updatedUnlocked[achievement.id]) continue

          // Optimization: only check relevant achievements
          if (changedField !== null) {
            const reqType = achievement.requirement.type
            if (reqType !== changedField
              && !(changedField === 'unique_categories_played' && reqType.startsWith('category_'))
              && !(reqType.startsWith('category_') && changedField.startsWith('category_'))) {
              continue
            }
          }

          const req = achievement.requirement
          let fulfilled = false

          if (req.type === 'category_games_completed') {
            const catProgress = progress.category_games_completed || {}
            if (req.category) {
              fulfilled = (catProgress[req.category] || 0) >= req.value
            } else {
              const sum = Object.values(catProgress).reduce((a, b) => a + b, 0)
              fulfilled = sum >= req.value
            }
          } else if (req.type === 'category_perfect_scores') {
            const catProgress = progress.category_perfect_scores || {}
            fulfilled = (catProgress[req.category] || 0) >= req.value
          } else {
            fulfilled = (progress[req.type] || 0) >= req.value
          }

          if (fulfilled) {
            newlyUnlocked.push(achievement)
            updatedUnlocked[achievement.id] = new Date().toISOString()
          }
        }

        if (newlyUnlocked.length === 0) return []

        set({ unlockedAchievements: updatedUnlocked })

        // Cross-store side effects — deferred to next tick to avoid cascading re-renders
        setTimeout(() => {
          for (const achievement of newlyUnlocked) {
            useToastStore.getState()?.showToast?.(
              `Achievement: ${achievement.name}`, 'success'
            )

            useNotificationStore.getState()?.addNotification?.({
              type: 'achievement',
              title: 'Achievement freigeschaltet!',
              message: `Du hast "${achievement.name}" erhalten!`,
              link: '/achievements',
            })

            if (achievement.reward?.type === 'title' && achievement.reward?.value) {
              useInventoryStore.getState()?.addItem?.({
                id: `title-${achievement.id}`,
                type: 'title',
                name: achievement.reward.value,
                description: `Belohnung fuer Achievement: ${achievement.name}`,
                rarity: achievement.rarity || 'common',
                source: 'achievement',
              })
            }

            useActivityStore.getState()?.addActivity?.({
              type: 'achievement_unlocked',
              description: `Achievement "${achievement.name}" freigeschaltet`,
              metadata: { achievementId: achievement.id, title: achievement.reward?.value },
            })
          }
        })

        return newlyUnlocked.map((a) => a.id)
      },

      checkDailyStreak: () => {
        const today = new Date().toISOString().split('T')[0]
        const { lastStreakDate } = get()
        if (lastStreakDate === today) return

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        if (lastStreakDate === yesterday) {
          set((state) => ({
            progress: { ...state.progress, daily_streak: state.progress.daily_streak + 1 },
            lastStreakDate: today,
          }))
        } else {
          set((state) => ({
            progress: { ...state.progress, daily_streak: 1 },
            lastStreakDate: today,
          }))
        }

        get().checkAchievements('daily_streak')
      },

      getProgress: () => get().progress,

      isUnlocked: (achievementId) => achievementId in get().unlockedAchievements,

      getUnlockDate: (achievementId) => get().unlockedAchievements[achievementId] || null,

      getUnlockedCount: () => Object.keys(get().unlockedAchievements).length,

      getUnlockedIds: () => Object.keys(get().unlockedAchievements),
    }),
    {
      name: 'mindforge-achievements',
      partialize: (state) => ({
        progress: state.progress,
        unlockedAchievements: state.unlockedAchievements,
        lastStreakDate: state.lastStreakDate,
        categoriesPlayed: state.categoriesPlayed,
      }),
    }
  )
)
