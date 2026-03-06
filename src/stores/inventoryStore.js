import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const EXCLUSIVE_TYPES = ['title', 'frame', 'background']

const DEFAULT_STARTER_ITEMS = [
  {
    id: 'title-neuling',
    type: 'title',
    name: 'Neuling',
    description: 'Jeder faengt mal an',
    rarity: 'common',
    source: 'default',
    equipped: false,
  },
  {
    id: 'badge-willkommen',
    type: 'badge',
    name: 'Willkommen',
    description: 'Willkommen bei MindForge!',
    rarity: 'common',
    source: 'default',
    equipped: false,
  },
  {
    id: 'bg-default',
    type: 'background',
    name: 'Standard',
    description: 'Standard-Hintergrund',
    rarity: 'common',
    source: 'default',
    equipped: false,
  },
]

function createDefaultItems() {
  return DEFAULT_STARTER_ITEMS.map((item) => ({
    ...item,
    acquiredAt: new Date().toISOString(),
  }))
}

const EMPTY_ARR = []

function getUserItems(state) {
  if (!state.currentUserId) return EMPTY_ARR
  return state.userItems[state.currentUserId] || EMPTY_ARR
}

// Selector for components
export const selectItems = (s) => getUserItems(s)

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      userItems: {},
      currentUserId: null,

      setCurrentUser: (userId) => {
        set((state) => {
          if (userId && !state.userItems[userId]) {
            return {
              currentUserId: userId,
              userItems: { ...state.userItems, [userId]: createDefaultItems() },
            }
          }
          return { currentUserId: userId }
        })
      },

      addItem: ({ id, type, name, description = '', rarity = 'common', source = 'shop' }) => {
        const { currentUserId } = get()
        if (!currentUserId) return false
        const items = getUserItems(get())
        if (items.some((i) => i.id === id)) return false

        const newItem = {
          id,
          type,
          name,
          description,
          rarity,
          source,
          acquiredAt: new Date().toISOString(),
          equipped: false,
        }

        set((state) => ({
          userItems: {
            ...state.userItems,
            [currentUserId]: [...getUserItems(state), newItem],
          },
        }))
        return true
      },

      removeItem: (itemId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => ({
          userItems: {
            ...state.userItems,
            [currentUserId]: getUserItems(state).filter((i) => i.id !== itemId),
          },
        }))
      },

      equipItem: (itemId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => {
          const items = getUserItems(state)
          const item = items.find((i) => i.id === itemId)
          if (!item) return state

          return {
            userItems: {
              ...state.userItems,
              [currentUserId]: items.map((i) => {
                if (i.id === itemId) return { ...i, equipped: true }
                if (EXCLUSIVE_TYPES.includes(item.type) && i.type === item.type)
                  return { ...i, equipped: false }
                return i
              }),
            },
          }
        })
      },

      unequipItem: (itemId) => {
        const { currentUserId } = get()
        if (!currentUserId) return
        set((state) => ({
          userItems: {
            ...state.userItems,
            [currentUserId]: getUserItems(state).map((i) =>
              i.id === itemId ? { ...i, equipped: false } : i
            ),
          },
        }))
      },

      getItemsByType: (type) => getUserItems(get()).filter((i) => i.type === type),

      getEquippedItems: () => getUserItems(get()).filter((i) => i.equipped),

      getEquippedTitle: () =>
        getUserItems(get()).find((i) => i.type === 'title' && i.equipped)?.name || null,

      hasItem: (itemId) => getUserItems(get()).some((i) => i.id === itemId),

      getItemCount: () => getUserItems(get()).length,

      getItemsBySource: (source) => getUserItems(get()).filter((i) => i.source === source),
    }),
    {
      name: 'mindforge-inventory',
      partialize: (state) => ({
        userItems: state.userItems,
      }),
    }
  )
)
