import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockLerngruppen, mockClans, mockKlassen, mockGroupInvites, mockClanWar } from '../data/groupData'

export const useGroupStore = create(
  persist(
    (set, get) => ({
      // User's groups
      myGroups: [mockLerngruppen[0].id],       // User is in "Mathe-Genies"
      myClans: [mockClans[0].id],              // User is in "Die Wissenskrieger"
      myClasses: [mockKlassen[0].id],          // User is in "Klasse 10a"
      groupInvites: mockGroupInvites,

      // Clan war state
      activeClanWar: mockClanWar,

      // --- Clan War Actions ---

      // Update a single matchup's scores (live during a duel)
      updateMatchupScore: (matchupId, scoreA, scoreB) => set((state) => {
        if (!state.activeClanWar) return state
        const war = { ...state.activeClanWar }
        war.matchups = war.matchups.map(m =>
          m.id === matchupId ? { ...m, scoreA, scoreB, status: 'active' } : m
        )
        // Recalculate clan scores from all matchups
        war.clanA = { ...war.clanA, score: war.matchups.reduce((sum, m) => sum + m.scoreA, 0) }
        war.clanB = { ...war.clanB, score: war.matchups.reduce((sum, m) => sum + m.scoreB, 0) }
        return { activeClanWar: war }
      }),

      // Mark a matchup as completed with final scores
      completeMatchup: (matchupId, finalScoreA, finalScoreB) => set((state) => {
        if (!state.activeClanWar) return state
        const war = { ...state.activeClanWar }
        war.matchups = war.matchups.map(m =>
          m.id === matchupId
            ? { ...m, scoreA: finalScoreA, scoreB: finalScoreB, status: 'completed' }
            : m
        )
        // Recalculate clan scores
        war.clanA = { ...war.clanA, score: war.matchups.reduce((sum, m) => sum + m.scoreA, 0) }
        war.clanB = { ...war.clanB, score: war.matchups.reduce((sum, m) => sum + m.scoreB, 0) }
        // Check if all matchups are done
        const allDone = war.matchups.every(m => m.status === 'completed')
        if (allDone) war.status = 'completed'
        return { activeClanWar: war }
      }),

      // Start a pending matchup
      startMatchup: (matchupId) => set((state) => {
        if (!state.activeClanWar) return state
        const war = { ...state.activeClanWar }
        war.matchups = war.matchups.map(m =>
          m.id === matchupId && m.status === 'pending'
            ? { ...m, status: 'active' }
            : m
        )
        return { activeClanWar: war }
      }),

      // --- Actions ---

      joinGroup: (groupId) => set((state) => {
        if (state.myGroups.includes(groupId)) return state
        return { myGroups: [...state.myGroups, groupId] }
      }),

      leaveGroup: (groupId) => set((state) => ({
        myGroups: state.myGroups.filter(id => id !== groupId),
      })),

      joinClan: (clanId) => set((state) => {
        if (state.myClans.includes(clanId)) return state
        return { myClans: [...state.myClans, clanId] }
      }),

      leaveClan: (clanId) => set((state) => ({
        myClans: state.myClans.filter(id => id !== clanId),
      })),

      joinClass: (classId) => set((state) => {
        if (state.myClasses.includes(classId)) return state
        return { myClasses: [...state.myClasses, classId] }
      }),

      leaveClass: (classId) => set((state) => ({
        myClasses: state.myClasses.filter(id => id !== classId),
      })),

      createGroup: (group) => {
        // In production this would call Firebase. For MVP we just join it.
        const id = `lg-custom-${Date.now()}`
        set((state) => ({
          myGroups: [...state.myGroups, id],
        }))
        return id
      },

      createClan: (clan) => {
        const id = `clan-custom-${Date.now()}`
        set((state) => ({
          myClans: [...state.myClans, id],
        }))
        return id
      },

      // Invites
      acceptInvite: (inviteId) => set((state) => {
        const invite = state.groupInvites.find(i => i.id === inviteId)
        if (!invite) return state

        const updates = {
          groupInvites: state.groupInvites.filter(i => i.id !== inviteId),
        }

        if (invite.groupType === 'clan') {
          updates.myClans = [...state.myClans, invite.groupId]
        } else if (invite.groupType === 'lerngruppe') {
          updates.myGroups = [...state.myGroups, invite.groupId]
        } else if (invite.groupType === 'klasse') {
          updates.myClasses = [...state.myClasses, invite.groupId]
        }

        return updates
      }),

      declineInvite: (inviteId) => set((state) => ({
        groupInvites: state.groupInvites.filter(i => i.id !== inviteId),
      })),

      // Helpers
      isInGroup: (groupId) => get().myGroups.includes(groupId),
      isInClan: (clanId) => get().myClans.includes(clanId),
      isInClass: (classId) => get().myClasses.includes(classId),
    }),
    {
      name: 'mindforge-groups',
      partialize: (state) => ({
        myGroups: state.myGroups,
        myClans: state.myClans,
        myClasses: state.myClasses,
        groupInvites: state.groupInvites,
        activeClanWar: state.activeClanWar,
      }),
    }
  )
)
