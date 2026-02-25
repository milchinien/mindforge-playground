import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_SEASON, BATTLE_PASS_TIERS, WEEKLY_CHALLENGES } from '../data/seasonData'

// Calculate current week number based on season start
function getCurrentWeek() {
  const now = new Date()
  const start = new Date(CURRENT_SEASON.startDate)
  const diffMs = now - start
  if (diffMs < 0) return 1
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
  return Math.min(diffWeeks + 1, WEEKLY_CHALLENGES.length)
}

// Calculate tier from total XP
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

// Initialize challenge progress for a given week
function initChallengeProgress(weekNumber) {
  const weekData = WEEKLY_CHALLENGES.find((w) => w.week === weekNumber)
  if (!weekData) return {}
  const progress = {}
  for (const c of weekData.challenges) {
    progress[c.id] = { current: 0, completed: false, claimed: false }
  }
  return progress
}

export const useSeasonStore = create(
  persist(
    (set, get) => ({
      // Season state
      currentSeasonId: CURRENT_SEASON.id,
      seasonXP: 8450,
      isPremiumPass: false,

      // Claimed rewards: set of "tier-free" or "tier-premium" strings
      claimedRewards: new Set(['1-free', '1-premium', '2-free', '2-premium', '3-premium', '4-free', '5-free', '5-premium', '6-free', '7-premium', '8-free', '8-premium']),

      // Weekly challenge progress: { challengeId: { current, completed, claimed } }
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

      // Computed getters
      getBattlePassTier: () => getTierFromXP(get().seasonXP),
      getXPInCurrentTier: () => {
        const xp = get().seasonXP
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

      // Actions
      addSeasonXP: (amount) => {
        set((state) => ({
          seasonXP: state.seasonXP + amount,
        }))
      },

      claimReward: (tier, track) => {
        const key = `${tier}-${track}`
        set((state) => {
          const newClaimed = new Set(state.claimedRewards)
          newClaimed.add(key)
          return { claimedRewards: newClaimed }
        })
      },

      isRewardClaimed: (tier, track) => {
        return get().claimedRewards.has(`${tier}-${track}`)
      },

      completeChallenge: (challengeId) => {
        set((state) => ({
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: {
              ...state.challengeProgress[challengeId],
              completed: true,
            },
          },
        }))
      },

      claimChallengeReward: (challengeId, xpAmount) => {
        set((state) => ({
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: {
              ...state.challengeProgress[challengeId],
              claimed: true,
            },
          },
          seasonXP: state.seasonXP + xpAmount,
        }))
      },

      updateChallengeProgress: (challengeId, current, target) => {
        set((state) => ({
          challengeProgress: {
            ...state.challengeProgress,
            [challengeId]: {
              current: Math.min(current, target),
              completed: current >= target,
              claimed: state.challengeProgress[challengeId]?.claimed || false,
            },
          },
        }))
      },

      upgradeToPremium: () => {
        set({ isPremiumPass: true })
      },

      resetWeeklyChallenges: (weekNumber) => {
        set({
          currentWeek: weekNumber,
          challengeProgress: {
            ...get().challengeProgress,
            ...initChallengeProgress(weekNumber),
          },
        })
      },
    }),
    {
      name: 'mindforge-season',
      partialize: (state) => ({
        currentSeasonId: state.currentSeasonId,
        seasonXP: state.seasonXP,
        isPremiumPass: state.isPremiumPass,
        claimedRewards: Array.from(state.claimedRewards),
        currentWeek: state.currentWeek,
        challengeProgress: state.challengeProgress,
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState
        return {
          ...currentState,
          ...persistedState,
          claimedRewards: new Set(persistedState.claimedRewards || []),
        }
      },
    }
  )
)
