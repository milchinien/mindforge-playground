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
      }),
    }
  )
)
