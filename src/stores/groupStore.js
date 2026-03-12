import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockLerngruppen, mockClans, mockKlassen, mockGroupInvites, mockClanWar } from '../data/groupData'

export const useGroupStore = create(
  persist(
    (set, get) => ({
      // Group data (mutable copies so memberCount updates)
      lerngruppen: [...mockLerngruppen],
      clans: [...mockClans],
      klassen: [...mockKlassen],

      // Custom community groups created by users
      customGroups: [],

      // User's groups
      myGroups: [],
      myClans: [],
      myClasses: [],
      groupInvites: [],

      // Clan war state
      activeClanWar: mockClanWar,

      // --- Clan War Actions ---
      updateMatchupScore: (matchupId, scoreA, scoreB) => set((state) => {
        if (!state.activeClanWar) return state
        const war = { ...state.activeClanWar }
        war.matchups = war.matchups.map(m =>
          m.id === matchupId ? { ...m, scoreA, scoreB, status: 'active' } : m
        )
        war.clanA = { ...war.clanA, score: war.matchups.reduce((sum, m) => sum + m.scoreA, 0) }
        war.clanB = { ...war.clanB, score: war.matchups.reduce((sum, m) => sum + m.scoreB, 0) }
        return { activeClanWar: war }
      }),

      completeMatchup: (matchupId, finalScoreA, finalScoreB) => set((state) => {
        if (!state.activeClanWar) return state
        const war = { ...state.activeClanWar }
        war.matchups = war.matchups.map(m =>
          m.id === matchupId
            ? { ...m, scoreA: finalScoreA, scoreB: finalScoreB, status: 'completed' }
            : m
        )
        war.clanA = { ...war.clanA, score: war.matchups.reduce((sum, m) => sum + m.scoreA, 0) }
        war.clanB = { ...war.clanB, score: war.matchups.reduce((sum, m) => sum + m.scoreB, 0) }
        const allDone = war.matchups.every(m => m.status === 'completed')
        if (allDone) war.status = 'completed'
        return { activeClanWar: war }
      }),

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

      // --- Helper to update memberCount on any group list ---
      _updateMemberCount: (listKey, groupId, delta) => set((state) => ({
        [listKey]: state[listKey].map(g =>
          g.id === groupId ? { ...g, memberCount: (g.memberCount || 0) + delta } : g
        ),
      })),

      // --- Actions ---
      joinGroup: (groupId) => set((state) => {
        if (state.myGroups.includes(groupId)) return state
        // Update memberCount in lerngruppen or customGroups
        const inLerngruppen = state.lerngruppen.some(g => g.id === groupId)
        const updatedLerngruppen = inLerngruppen
          ? state.lerngruppen.map(g => g.id === groupId ? { ...g, memberCount: (g.memberCount || 0) + 1 } : g)
          : state.lerngruppen
        const updatedCustom = !inLerngruppen
          ? state.customGroups.map(g => g.id === groupId ? { ...g, memberCount: (g.memberCount || 0) + 1 } : g)
          : state.customGroups
        return {
          myGroups: [...state.myGroups, groupId],
          lerngruppen: updatedLerngruppen,
          customGroups: updatedCustom,
        }
      }),

      leaveGroup: (groupId) => set((state) => {
        const inLerngruppen = state.lerngruppen.some(g => g.id === groupId)
        const updatedLerngruppen = inLerngruppen
          ? state.lerngruppen.map(g => g.id === groupId ? { ...g, memberCount: Math.max(0, (g.memberCount || 1) - 1) } : g)
          : state.lerngruppen
        const updatedCustom = !inLerngruppen
          ? state.customGroups.map(g => g.id === groupId ? { ...g, memberCount: Math.max(0, (g.memberCount || 1) - 1) } : g)
          : state.customGroups
        return {
          myGroups: state.myGroups.filter(id => id !== groupId),
          lerngruppen: updatedLerngruppen,
          customGroups: updatedCustom,
        }
      }),

      joinClan: (clanId) => set((state) => {
        if (state.myClans.includes(clanId)) return state
        return {
          myClans: [...state.myClans, clanId],
          clans: state.clans.map(c => c.id === clanId ? { ...c, memberCount: (c.memberCount || 0) + 1 } : c),
        }
      }),

      leaveClan: (clanId) => set((state) => ({
        myClans: state.myClans.filter(id => id !== clanId),
        clans: state.clans.map(c => c.id === clanId ? { ...c, memberCount: Math.max(0, (c.memberCount || 1) - 1) } : c),
      })),

      joinClass: (classId) => set((state) => {
        if (state.myClasses.includes(classId)) return state
        return { myClasses: [...state.myClasses, classId] }
      }),

      leaveClass: (classId) => set((state) => ({
        myClasses: state.myClasses.filter(id => id !== classId),
      })),

      createGroup: ({ name, description, requirements, subject }) => {
        const id = `lg-community-${Date.now()}`
        const newGroup = {
          id,
          type: 'lerngruppe',
          name,
          description,
          requirements: requirements || '',
          subject: subject || null,
          memberCount: 1,
          maxMembers: 30,
          isPublic: true,
          isCommunity: true,
          createdAt: new Date(),
          createdBy: 'Du',
          members: [
            { id: 'current-user', username: 'Du', displayName: 'Du', level: 1, role: 'leader' },
          ],
          leaderboard: [],
          activeChallenges: [],
        }
        set((state) => ({
          customGroups: [...state.customGroups, newGroup],
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
          updates.clans = state.clans.map(c =>
            c.id === invite.groupId ? { ...c, memberCount: (c.memberCount || 0) + 1 } : c
          )
        } else if (invite.groupType === 'lerngruppe') {
          updates.myGroups = [...state.myGroups, invite.groupId]
          updates.lerngruppen = state.lerngruppen.map(g =>
            g.id === invite.groupId ? { ...g, memberCount: (g.memberCount || 0) + 1 } : g
          )
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

      // Get all lerngruppen (mock + custom)
      getAllLerngruppen: () => [...get().lerngruppen, ...get().customGroups],
    }),
    {
      name: 'mindforge-groups',
      version: 3,
      migrate: (persisted, version) => {
        if (version < 3) {
          // Reset to empty state — mock data has been removed
          return {
            ...persisted,
            lerngruppen: [],
            clans: [],
            klassen: [],
            customGroups: persisted?.customGroups || [],
            myGroups: [],
            myClans: [],
            myClasses: [],
            groupInvites: [],
            activeClanWar: null,
          }
        }
        return persisted
      },
      partialize: (state) => ({
        myGroups: state.myGroups,
        myClans: state.myClans,
        myClasses: state.myClasses,
        groupInvites: state.groupInvites,
        activeClanWar: state.activeClanWar,
        lerngruppen: state.lerngruppen,
        clans: state.clans,
        klassen: state.klassen,
        customGroups: state.customGroups,
      }),
    }
  )
)
