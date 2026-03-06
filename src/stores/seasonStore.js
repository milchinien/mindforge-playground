import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_SEASON, BATTLE_PASS_TIERS, WEEKLY_CHALLENGES } from '../data/seasonData'
import { useInventoryStore } from './inventoryStore'
import { useNotificationStore } from './notificationStore'
import { useActivityStore } from './activityStore'

function getCurrentWeek() {
  const now = new Date()
  const start = new Date(CURRENT_SEASON.startDate)
  const diffMs = now - start
  if (diffMs < 0) return 1
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
  return Math.min(diffWeeks + 1, WEEKLY_CHALLENGES.length)
}

function getTierFromXP(xp) {
  let tier = 0
  for (const t of BATTLE_PASS_TIERS) {
    if (xp >= t.xpRequired) {
      tier = t.tier
    } else {
      break
    }
  }
  return tier
}

function initChallengeProgress(weekNumber) {
  const weekData = WEEKLY_CHALLENGES.find((w) => w.week === weekNumber)
  if (!weekData) return {}
  const progress = {}
  for (const c of weekData.challenges) {
    progress[c.id] = { current: 0, completed: false, claimed: false }
  }
  return progress
}

function createDefaultUserData() {
  return {
    currentSeasonId: CURRENT_SEASON.id,
    seasonXP: 8450,
    isPremiumPass: false,
    claimedRewards: ['1-free', '1-premium', '2-free', '2-premium', '3-premium', '4-free', '5-free', '5-premium', '6-free', '7-premium', '8-free', '8-premium'],
    currentWeek: getCurrentWeek(),
    challengeProgress: {
      'w1-c1': { current: 5, completed: true, claimed: true },
      'w1-c2': { current: 3, completed: true, claimed: true },
      'w1-c3': { current: 3, completed: true, claimed: true },
      'w1-c4': { current: 10, completed: true, claimed: false },
      'w1-c5': { current: 0, completed: false, claimed: false },
      'w2-c1': { current: 2, completed: false, claimed: false },
      'w2-c2': { current: 1200, completed: false, claimed: false },
      'w2-c3': { current: 3, completed: false, claimed: false },
      'w2-c4': { current: 1, completed: false, claimed: false },
      'w2-c5': { current: 4, completed: false, claimed: false },
    },
  }
}

function getUserData(state) {
  if (!state.currentUserId) return createDefaultUserData()
  return state.userData[state.currentUserId] || createDefaultUserData()
}

// Selectors for components
export const selectSeasonXP = (s) => getUserData(s).seasonXP
export const selectIsPremiumPass = (s) => getUserData(s).isPremiumPass
export const selectChallengeProgress = (s) => getUserData(s).challengeProgress
export const selectCurrentWeek = (s) => getUserData(s).currentWeek
export const selectClaimedRewards = (s) => getUserData(s).claimedRewards

export const useSeasonStore = create(
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

      getBattlePassTier: () => getTierFromXP(getUserData(get()).seasonXP),
      getXPInCurrentTier: () => {
        const xp = getUserData(get()).seasonXP
        const tier = getTierFromXP(xp)
        const currentTierData = BATTLE_PASS_TIERS.find((t) => t.tier === tier)
        const nextTierData = BATTLE_PASS_TIERS.find((t) => t.tier === tier + 1)
        if (!nextTierData) return { current: 0, needed: 0, percent: 100 }
        const currentBase = currentTierData ? currentTierData.xpRequired : 0
        const nextBase = nextTierData.xpRequired
        const xpInTier = xp - currentBase
        const xpNeeded = nextBase - currentBase
        return {
          current: xpInTier,
          needed: xpNeeded,
          percent: Math.min(100, Math.round((xpInTier / xpNeeded) * 100)),
        }
      },

      addSeasonXP: (amount) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, seasonXP: ud.seasonXP + amount },
            },
          }
        })
      },

      claimReward: (tier, track) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        const key = `${tier}-${track}`
        set((state) => {
          const ud = getUserData(state)
          const newClaimed = [...ud.claimedRewards]
          if (!newClaimed.includes(key)) newClaimed.push(key)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, claimedRewards: newClaimed },
            },
          }
        })

        const tierData = BATTLE_PASS_TIERS.find(t => t.tier === tier)
        if (!tierData) return

        const reward = tierData[track]
        if (!reward) return

        const typeMapping = {
          'xp-booster': 'effect',
          'badge': 'badge',
          'avatar-item': 'avatar-item',
          'title': 'title',
          'avatar-frame': 'frame',
          'profile-banner': 'background',
          'profile-effect': 'effect',
        }
        const inventoryType = typeMapping[reward.type] || 'badge'

        useInventoryStore.getState()?.addItem?.({
          id: `season-${CURRENT_SEASON.id}-tier${tier}-${track}`,
          type: inventoryType,
          name: reward.name,
          description: reward.description || `Season ${CURRENT_SEASON.number} Tier ${tier} Belohnung`,
          rarity: reward.rarity || 'common',
          source: 'season',
        })

        useNotificationStore.getState()?.addNotification?.({
          type: 'season',
          title: 'Season-Belohnung!',
          message: `Du hast "${reward.name}" fuer Tier ${tier} erhalten!`,
          link: '/seasons',
        })

        useActivityStore.getState()?.addActivity?.({
          type: 'reward_claimed',
          description: `Season-Belohnung "${reward.name}" erhalten (Tier ${tier})`,
          metadata: { tier, track, rewardName: reward.name },
        })
      },

      isRewardClaimed: (tier, track) => {
        return getUserData(get()).claimedRewards.includes(`${tier}-${track}`)
      },

      completeChallenge: (challengeId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...ud,
                challengeProgress: {
                  ...ud.challengeProgress,
                  [challengeId]: {
                    ...ud.challengeProgress[challengeId],
                    completed: true,
                  },
                },
              },
            },
          }
        })
      },

      claimChallengeReward: (challengeId, xpAmount) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...ud,
                challengeProgress: {
                  ...ud.challengeProgress,
                  [challengeId]: {
                    ...ud.challengeProgress[challengeId],
                    claimed: true,
                  },
                },
                seasonXP: ud.seasonXP + xpAmount,
              },
            },
          }
        })

        useNotificationStore.getState()?.addNotification?.({
          type: 'season',
          title: 'Challenge-Belohnung!',
          message: `Du hast ${xpAmount} XP fuer eine Challenge erhalten!`,
          link: '/seasons',
        })
      },

      updateChallengeProgress: (challengeId, current, target) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...ud,
                challengeProgress: {
                  ...ud.challengeProgress,
                  [challengeId]: {
                    current: Math.min(current, target),
                    completed: current >= target,
                    claimed: ud.challengeProgress[challengeId]?.claimed || false,
                  },
                },
              },
            },
          }
        })
      },

      upgradeToPremium: () => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: { ...ud, isPremiumPass: true },
            },
          }
        })
      },

      resetWeeklyChallenges: (weekNumber) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const ud = getUserData(state)
          return {
            userData: {
              ...state.userData,
              [currentUserId]: {
                ...ud,
                currentWeek: weekNumber,
                challengeProgress: {
                  ...ud.challengeProgress,
                  ...initChallengeProgress(weekNumber),
                },
              },
            },
          }
        })
      },

    }),
    {
      name: 'mindforge-season',
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
)
