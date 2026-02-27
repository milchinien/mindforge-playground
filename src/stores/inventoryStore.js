import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const EXCLUSIVE_TYPES = ['title', 'frame', 'background']

const DEFAULT_STARTER_ITEMS = [
  {
    id: 'title-neuling',
    type: 'title',
    name: 'Neuling',
    description: 'Jeder fängt mal an',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
  {
    id: 'badge-willkommen',
    type: 'badge',
    name: 'Willkommen',
    description: 'Willkommen bei MindForge!',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
  {
    id: 'bg-default',
    type: 'background',
    name: 'Standard',
    description: 'Standard-Hintergrund',
    rarity: 'common',
    source: 'default',
    acquiredAt: new Date().toISOString(),
    equipped: false,
  },
]

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      items: [...DEFAULT_STARTER_ITEMS],

      addItem: ({ id, type, name, description = '', rarity = 'common', source = 'shop' }) => {
        if (get().items.some((i) => i.id === id)) return false

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

        set((state) => ({ items: [...state.items, newItem] }))
        return true
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      equipItem: (itemId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId)
          if (!item) return state

          return {
            items: state.items.map((i) => {
              if (i.id === itemId) return { ...i, equipped: true }
              if (EXCLUSIVE_TYPES.includes(item.type) && i.type === item.type)
                return { ...i, equipped: false }
              return i
            }),
          }
        }),

      unequipItem: (itemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, equipped: false } : i
          ),
        })),

      getItemsByType: (type) => get().items.filter((i) => i.type === type),

      getEquippedItems: () => get().items.filter((i) => i.equipped),

      getEquippedTitle: () =>
        get().items.find((i) => i.type === 'title' && i.equipped)?.name || null,

      hasItem: (itemId) => get().items.some((i) => i.id === itemId),

      getItemCount: () => get().items.length,

      getItemsBySource: (source) => get().items.filter((i) => i.source === source),
    }),
    {
      name: 'mindforge-inventory',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
